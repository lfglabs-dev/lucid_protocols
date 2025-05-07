import fs from "fs";
import path from "path";
import { Protocol, ProtocolsRegistry } from "../types";

// Path constants
const DATA_DIR = path.join(__dirname, "../../data");
const REGISTRY_FILE = path.join(DATA_DIR, "registry.json");
const PENDLE_CORE_DIR = path.join(
  __dirname,
  "../../data_sources/pendle-core-v2"
);

/**
 * Discover all available chain files in the Pendle directory
 */
function discoverChainFiles(): { chainId: string; filePath: string }[] {
  try {
    const result: { chainId: string; filePath: string }[] = [];

    // Check if directory exists
    if (!fs.existsSync(PENDLE_CORE_DIR)) {
      console.warn(`Pendle core directory not found: ${PENDLE_CORE_DIR}`);
      return result;
    }

    // Read all files in the directory
    const files = fs.readdirSync(PENDLE_CORE_DIR);

    // Filter for chain-id-core.json files
    for (const file of files) {
      if (file.endsWith("-core.json")) {
        const chainId = file.replace("-core.json", "");
        result.push({
          chainId,
          filePath: path.join(PENDLE_CORE_DIR, file),
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error discovering chain files:", error);
    return [];
  }
}

/**
 * Parse contract addresses from a chain file
 */
function parseContractAddresses(filePath: string): string[] {
  try {
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const contractData = JSON.parse(fileContent);

    // Extract contract addresses
    const addresses: string[] = [];

    // Go through all keys in the object and extract addresses
    for (const key in contractData) {
      if (
        typeof contractData[key] === "string" &&
        contractData[key].startsWith("0x")
      ) {
        const address = contractData[key];
        if (!addresses.includes(address)) {
          addresses.push(address);
        }
      } else if (
        typeof contractData[key] === "object" &&
        contractData[key] !== null
      ) {
        // Handle nested objects that might contain addresses
        const nestedObj = contractData[key];
        for (const nestedKey in nestedObj) {
          if (
            typeof nestedObj[nestedKey] === "string" &&
            nestedObj[nestedKey].startsWith("0x")
          ) {
            const address = nestedObj[nestedKey];
            if (!addresses.includes(address)) {
              addresses.push(address);
            }
          }
        }
      }
    }

    return addresses;
  } catch (error) {
    console.error(`Error parsing contract addresses from ${filePath}:`, error);
    return [];
  }
}

/**
 * Create Pendle protocol with contract addresses
 */
async function createPendleProtocol(): Promise<Protocol> {
  // Discover chain files
  const chainFiles = discoverChainFiles();
  console.log(
    `Found ${chainFiles.length} chain files in Pendle core directory`
  );

  // Create contracts object
  const contracts: Protocol["contracts"] = {};
  let totalAddresses = 0;

  // Parse addresses for each chain
  for (const { chainId, filePath } of chainFiles) {
    const addresses = parseContractAddresses(filePath);

    if (addresses.length > 0) {
      contracts[chainId] = addresses.map((address) => ({ address }));
      totalAddresses += addresses.length;
      console.log(
        `Found ${addresses.length} contract addresses for chain ${chainId}`
      );
    }
  }

  // Create Pendle protocol
  const pendleProtocol: Protocol = {
    id: "pendle",
    name: "Pendle",
    slug: "pendle",
    logo: "/assets/pendle.png",
    category: ["Yield"],
    contracts,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  };

  console.log(
    `Created Pendle protocol with ${totalAddresses} contract addresses across ${
      Object.keys(contracts).length
    } chains`
  );

  return pendleProtocol;
}

/**
 * Fetch Pendle contracts and add them to the registry
 */
async function fetchPendleContracts(): Promise<void> {
  try {
    console.log("Fetching Pendle contracts...");

    // Check if Pendle core directory exists
    if (!fs.existsSync(PENDLE_CORE_DIR)) {
      throw new Error(`Pendle core directory not found: ${PENDLE_CORE_DIR}`);
    }

    // Create Pendle protocol
    const pendleProtocol = await createPendleProtocol();

    // Skip if no contracts were found
    if (Object.keys(pendleProtocol.contracts).length === 0) {
      console.log("No Pendle contracts found, skipping registry update");
      return;
    }

    // Read existing registry
    let registry: ProtocolsRegistry;
    if (fs.existsSync(REGISTRY_FILE)) {
      registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf-8"));
      console.log(
        `Loaded existing registry with ${registry.protocols.length} protocols`
      );
    } else {
      registry = { protocols: [], addressMap: {} };
      console.log("No existing registry found, creating new one");
    }

    // Check if Pendle protocol already exists
    const existingPendleIndex = registry.protocols.findIndex(
      (p) => p.id === "pendle"
    );

    if (existingPendleIndex >= 0) {
      // Update existing Pendle protocol
      console.log("Updating existing Pendle protocol in registry");

      // Merge contracts
      for (const chainId in pendleProtocol.contracts) {
        if (!registry.protocols[existingPendleIndex].contracts[chainId]) {
          registry.protocols[existingPendleIndex].contracts[chainId] = [];
        }

        for (const contract of pendleProtocol.contracts[chainId]) {
          const exists = registry.protocols[existingPendleIndex].contracts[
            chainId
          ].some(
            (c) => c.address.toLowerCase() === contract.address.toLowerCase()
          );

          if (!exists) {
            registry.protocols[existingPendleIndex].contracts[chainId].push(
              contract
            );
          }
        }
      }

      registry.protocols[existingPendleIndex].updatedAt = Date.now();
    } else {
      // Add new Pendle protocol
      console.log("Adding new Pendle protocol to registry");
      registry.protocols.push(pendleProtocol);
    }

    // Rebuild address map for Pendle contracts
    for (const chainId in pendleProtocol.contracts) {
      if (!registry.addressMap[chainId]) {
        registry.addressMap[chainId] = {};
      }

      for (const contract of pendleProtocol.contracts[chainId]) {
        registry.addressMap[chainId][contract.address.toLowerCase()] = "pendle";
      }
    }

    // Save updated registry
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
    console.log(
      `Saved updated registry with Pendle contracts to ${REGISTRY_FILE}`
    );
  } catch (error) {
    console.error("Error fetching Pendle contracts:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  fetchPendleContracts().catch(console.error);
}

export { fetchPendleContracts };
