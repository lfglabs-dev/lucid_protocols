import fs from "fs";
import path from "path";
import { Protocol, ProtocolsRegistry } from "../types";

// Path constants
const DATA_DIR = path.join(__dirname, "../../data");
const REGISTRY_FILE = path.join(DATA_DIR, "registry.json");
const EULER_INTERFACES_DIR = path.join(
  __dirname,
  "../../data_sources/euler-interfaces"
);
const CHAINS_FILE = path.join(EULER_INTERFACES_DIR, "chains.js");
const ADDRESSES_DIR = path.join(EULER_INTERFACES_DIR, "addresses");

/**
 * Parse chains.js to get all chainIds
 */
function parseChainIds(): number[] {
  try {
    // Read chains.js file
    const chainFileContent = fs.readFileSync(CHAINS_FILE, "utf-8");

    // Extract chain IDs using regex pattern matching
    const chainIdRegex = /chainId:\s*(\d+)/g;
    let match;
    const chainIds: number[] = [];

    while ((match = chainIdRegex.exec(chainFileContent)) !== null) {
      chainIds.push(parseInt(match[1], 10));
    }

    return chainIds;
  } catch (error) {
    console.error("Error parsing chain IDs:", error);
    return [];
  }
}

/**
 * Parse address files for a specific chain
 */
function parseAddressesForChain(chainId: number): string[] {
  try {
    const addresses: string[] = [];
    const chainDir = path.join(ADDRESSES_DIR, chainId.toString());

    // Check if directory exists
    if (!fs.existsSync(chainDir)) {
      console.log(`No address directory found for chain ${chainId}`);
      return addresses;
    }

    // Read bridge addresses
    const bridgeAddressesPath = path.join(chainDir, "BridgeAddresses.json");
    if (fs.existsSync(bridgeAddressesPath)) {
      const bridgeContent = fs.readFileSync(bridgeAddressesPath, "utf-8");
      extractAddresses(bridgeContent, addresses);
    }

    // Read core addresses
    const coreAddressesPath = path.join(chainDir, "CoreAddresses.json");
    if (fs.existsSync(coreAddressesPath)) {
      const coreContent = fs.readFileSync(coreAddressesPath, "utf-8");
      extractAddresses(coreContent, addresses);
    }

    // Read any other JS files in the directory
    const files = fs.readdirSync(chainDir);
    for (const file of files) {
      if (
        file.endsWith(".js") &&
        file !== "BridgeAddresses.js" &&
        file !== "CoreAddresses.js"
      ) {
        const filePath = path.join(chainDir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        extractAddresses(content, addresses);
      }
    }

    return addresses;
  } catch (error) {
    console.error(`Error parsing addresses for chain ${chainId}:`, error);
    return [];
  }
}

/**
 * Extract Ethereum addresses from file content
 */
function extractAddresses(content: string, addresses: string[]): void {
  // Match Ethereum addresses (0x followed by 40 hex chars)
  const addressRegex = /0x[a-fA-F0-9]{40}/g;
  let match;

  while ((match = addressRegex.exec(content)) !== null) {
    const address = match[0];
    if (!addresses.includes(address)) {
      addresses.push(address);
    }
  }
}

/**
 * Create Euler protocol with contract addresses
 */
async function createEulerProtocol(): Promise<Protocol> {
  // Parse all chain IDs
  const chainIds = parseChainIds();
  console.log(`Found ${chainIds.length} chain IDs in Euler interfaces`);

  // Create contracts object
  const contracts: Protocol["contracts"] = {};
  let totalAddresses = 0;

  // Parse addresses for each chain
  for (const chainId of chainIds) {
    const addresses = parseAddressesForChain(chainId);

    if (addresses.length > 0) {
      contracts[chainId.toString()] = addresses.map((address) => ({ address }));
      totalAddresses += addresses.length;
      console.log(
        `Found ${addresses.length} contract addresses for chain ${chainId}`
      );
    }
  }

  // Create Euler protocol
  const eulerProtocol: Protocol = {
    id: "euler",
    name: "Euler",
    slug: "euler",
    logo: "/assets/euler.png",
    category: ["Lending"],
    contracts,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  };

  console.log(
    `Created Euler protocol with ${totalAddresses} contract addresses across ${
      Object.keys(contracts).length
    } chains`
  );

  return eulerProtocol;
}

/**
 * Fetch Euler contracts and add them to the registry
 */
async function fetchEulerContracts(): Promise<void> {
  try {
    console.log("Fetching Euler contracts...");

    // Check if Euler interfaces directory exists
    if (!fs.existsSync(EULER_INTERFACES_DIR)) {
      throw new Error(
        `Euler interfaces directory not found: ${EULER_INTERFACES_DIR}`
      );
    }

    // Create Euler protocol
    const eulerProtocol = await createEulerProtocol();

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

    // Check if Euler protocol already exists
    const existingEulerIndex = registry.protocols.findIndex(
      (p) => p.id === "euler"
    );

    if (existingEulerIndex >= 0) {
      // Update existing Euler protocol
      console.log("Updating existing Euler protocol in registry");

      // Merge contracts
      for (const chainId in eulerProtocol.contracts) {
        if (!registry.protocols[existingEulerIndex].contracts[chainId]) {
          registry.protocols[existingEulerIndex].contracts[chainId] = [];
        }

        for (const contract of eulerProtocol.contracts[chainId]) {
          const exists = registry.protocols[existingEulerIndex].contracts[
            chainId
          ].some(
            (c) => c.address.toLowerCase() === contract.address.toLowerCase()
          );

          if (!exists) {
            registry.protocols[existingEulerIndex].contracts[chainId].push(
              contract
            );
          }
        }
      }

      registry.protocols[existingEulerIndex].updatedAt = Date.now();
    } else {
      // Add new Euler protocol
      console.log("Adding new Euler protocol to registry");
      registry.protocols.push(eulerProtocol);
    }

    // Rebuild address map
    for (const chainId in eulerProtocol.contracts) {
      if (!registry.addressMap[chainId]) {
        registry.addressMap[chainId] = {};
      }

      for (const contract of eulerProtocol.contracts[chainId]) {
        registry.addressMap[chainId][contract.address.toLowerCase()] = "euler";
      }
    }

    // Save updated registry
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
    console.log(
      `Saved updated registry with Euler contracts to ${REGISTRY_FILE}`
    );
  } catch (error) {
    console.error("Error fetching Euler contracts:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  fetchEulerContracts().catch(console.error);
}

export { fetchEulerContracts };
