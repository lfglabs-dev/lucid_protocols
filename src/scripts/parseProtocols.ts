import fs from "fs";
import path from "path";
import { Protocol } from "../types";

// Define paths
const REPO_DIR = path.join(__dirname, "../../defillama-adapters");
const PROJECTS_DIR = path.join(REPO_DIR, "projects");
const DATA_DIR = path.join(__dirname, "../../data");
const OUTPUT_FILE = path.join(DATA_DIR, "protocols.json");
const EXCLUDED_PROTOCOLS_FILE = path.join(DATA_DIR, "excluded-protocols.json");

/**
 * Load excluded protocols if the file exists
 */
function loadExcludedProtocols(): string[] {
  try {
    if (fs.existsSync(EXCLUDED_PROTOCOLS_FILE)) {
      const excludedData = JSON.parse(
        fs.readFileSync(EXCLUDED_PROTOCOLS_FILE, "utf-8")
      );
      console.log(
        `Loaded ${excludedData.length} excluded protocols from ${EXCLUDED_PROTOCOLS_FILE}`
      );
      return excludedData;
    }
  } catch (error) {
    console.error("Error loading excluded protocols file:", error);
  }
  return [];
}

/**
 * Main function to parse all protocols from the DefiLlama-Adapters repo
 * @param limit Optional limit on the number of protocols to parse (for testing)
 */
async function parseProtocols(limit?: number): Promise<Protocol[]> {
  try {
    console.log("Starting protocol parsing from DefiLlama-Adapters repo...");

    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Load excluded protocols list
    const excludedProtocols = loadExcludedProtocols();

    // Get all protocol directories
    const protocolDirs = fs
      .readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    console.log(`Found ${protocolDirs.length} protocol directories`);

    // Apply limit if specified
    const dirsToProcess = limit ? protocolDirs.slice(0, limit) : protocolDirs;
    console.log(
      `Processing ${dirsToProcess.length} protocols${
        limit ? ` (limited to ${limit})` : ""
      }`
    );

    // Process each protocol
    const protocols: Protocol[] = [];

    for (const dirName of dirsToProcess) {
      const protocol = parseProtocol(dirName, excludedProtocols);
      protocols.push(protocol);
    }

    // Save the protocols to a file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(protocols, null, 2));
    console.log(`Saved ${protocols.length} protocols to ${OUTPUT_FILE}`);

    return protocols;
  } catch (error) {
    console.error("Error parsing protocols:", error);
    return [];
  }
}

/**
 * Parse a single protocol directory
 */
function parseProtocol(
  protocolDirName: string,
  excludedProtocols: string[]
): Protocol {
  try {
    console.log(`Parsing protocol: ${protocolDirName}`);

    // Check if protocol is excluded
    const isExcluded =
      excludedProtocols.includes(protocolDirName) ||
      excludedProtocols.includes(protocolDirName.toLowerCase());

    if (isExcluded) {
      console.log(`Protocol ${protocolDirName} is on the exclusion list`);
    }

    // Base protocol data
    const protocol: Protocol = {
      id: protocolDirName,
      name: formatName(protocolDirName),
      slug: protocolDirName.toLowerCase(),
      logo: `https://icons.llama.fi/${protocolDirName}.jpg`,
      category: [],
      description: "",
      website: "",
      socials: {},
      contracts: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      excluded: isExcluded,
    };

    // Parse index.js or other files to extract more info
    const dirPath = path.join(PROJECTS_DIR, protocolDirName);
    const files = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter(
        (file) =>
          file.isFile() &&
          (file.name.endsWith(".js") || file.name.endsWith(".ts"))
      )
      .map((file) => file.name);

    // If we have an index.js/ts, parse it first
    const indexFile = files.find((f) => f === "index.js" || f === "index.ts");
    if (indexFile) {
      extractInfoFromFile(protocol, path.join(dirPath, indexFile));
    }

    // Parse other files to get more contract addresses
    for (const file of files) {
      if (file !== indexFile) {
        extractInfoFromFile(protocol, path.join(dirPath, file));
      }
    }

    return protocol;
  } catch (error) {
    console.error(`Error parsing protocol ${protocolDirName}:`, error);

    // Return a minimal protocol object in case of error
    const isExcluded =
      excludedProtocols.includes(protocolDirName) ||
      excludedProtocols.includes(protocolDirName.toLowerCase());

    return {
      id: protocolDirName,
      name: formatName(protocolDirName),
      slug: protocolDirName.toLowerCase(),
      logo: `https://icons.llama.fi/${protocolDirName}.jpg`,
      category: [],
      description: "",
      website: "",
      socials: {},
      contracts: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      excluded: isExcluded,
    };
  }
}

/**
 * Format a protocol name from its directory name
 */
function formatName(dirName: string): string {
  return dirName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extract protocol information from a file
 */
function extractInfoFromFile(protocol: Protocol, filePath: string): void {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, "utf-8");

    // Extract metadata
    extractMetadata(protocol, content);

    // Extract contract addresses
    extractContractAddresses(protocol, content);
  } catch (error) {
    console.error(`Error extracting info from ${filePath}:`, error);
  }
}

/**
 * Extract metadata from file content
 */
function extractMetadata(protocol: Protocol, content: string): void {
  // Extract name
  const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
  if (nameMatch && nameMatch[1]) {
    protocol.name = nameMatch[1];
  }

  // Extract category
  const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
  if (
    categoryMatch &&
    categoryMatch[1] &&
    !protocol.category.includes(categoryMatch[1])
  ) {
    protocol.category.push(categoryMatch[1]);
  }

  // Extract website
  const websiteMatch = content.match(/(?:website|url):\s*['"]([^'"]+)['"]/);
  if (websiteMatch && websiteMatch[1]) {
    protocol.website = websiteMatch[1];
  }

  // Extract description
  const descriptionMatch = content.match(/description:\s*['"]([^'"]+)['"]/);
  if (descriptionMatch && descriptionMatch[1]) {
    protocol.description = descriptionMatch[1];
  }

  // Initialize socials object if needed
  if (!protocol.socials) {
    protocol.socials = {};
  }

  // Extract social links
  const twitterMatch = content.match(/twitter:\s*['"]([^'"]+)['"]/);
  if (twitterMatch && twitterMatch[1]) {
    const twitter = twitterMatch[1];
    protocol.socials.twitter = twitter.startsWith("http")
      ? twitter
      : `https://twitter.com/${twitter.replace(/^@/, "")}`;
  }

  const discordMatch = content.match(/discord:\s*['"]([^'"]+)['"]/);
  if (discordMatch && discordMatch[1]) {
    protocol.socials.discord = discordMatch[1];
  }

  const telegramMatch = content.match(/telegram:\s*['"]([^'"]+)['"]/);
  if (telegramMatch && telegramMatch[1]) {
    protocol.socials.telegram = telegramMatch[1];
  }
}

/**
 * Extract contract addresses from file content
 */
function extractContractAddresses(protocol: Protocol, content: string): void {
  // Look for Ethereum addresses
  const addressMatches = content.match(/0x[a-fA-F0-9]{40}/g) || [];

  if (addressMatches.length > 0) {
    // Look for chain information
    const chainMatches = content.match(/chain[s]?:\s*['"]([^'"]+)['"]/g) || [];
    const chains = chainMatches
      .map((match) => {
        const chainName = match.match(/['"]([^'"]+)['"]/);
        return chainName ? chainName[1].toLowerCase() : null;
      })
      .filter(Boolean);

    // Map chain names to IDs
    const chainIds = chains
      .map((chain) => (chain ? mapChainNameToId(chain) : null))
      .filter(Boolean) as string[];

    // If chains found, associate addresses with them
    if (chainIds.length > 0) {
      for (const chainId of chainIds) {
        if (!protocol.contracts[chainId]) {
          protocol.contracts[chainId] = [];
        }

        for (const address of addressMatches) {
          // Check if address already exists
          const normalizedAddress = address.toLowerCase();
          const exists = protocol.contracts[chainId].some(
            (a) => a.address === normalizedAddress
          );

          if (!exists) {
            protocol.contracts[chainId].push({
              address: normalizedAddress,
            });
          }
        }
      }
    } else {
      // Default to Ethereum if no chain specified
      if (!protocol.contracts["1"]) {
        protocol.contracts["1"] = [];
      }

      for (const address of addressMatches) {
        const normalizedAddress = address.toLowerCase();
        const exists = protocol.contracts["1"].some(
          (a) => a.address === normalizedAddress
        );

        if (!exists) {
          protocol.contracts["1"].push({
            address: normalizedAddress,
          });
        }
      }
    }
  }
}

/**
 * Map chain names to chain IDs
 */
function mapChainNameToId(chainName: string): string | null {
  const chainMap: Record<string, string> = {
    ethereum: "1",
    eth: "1",
    bsc: "56",
    binance: "56",
    polygon: "137",
    matic: "137",
    arbitrum: "42161",
    optimism: "10",
    avalanche: "43114",
    avax: "43114",
    fantom: "250",
    ftm: "250",
    base: "8453",
  };

  const normalizedChainName = chainName.toLowerCase();
  return chainMap[normalizedChainName] || null;
}

// Run if executed directly
if (require.main === module) {
  parseProtocols().catch(console.error);
}

export { parseProtocols };
