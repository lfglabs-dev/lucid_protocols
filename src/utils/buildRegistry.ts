import fs from "fs";
import path from "path";
import { Protocol, ProtocolsRegistry } from "../types";

/**
 * Builds a protocol registry from a list of protocols
 * This includes creating an address map for quick lookups by contract address
 */
export function buildRegistry(protocols: Protocol[]): ProtocolsRegistry {
  console.log(`Building registry from ${protocols.length} protocols`);

  // Initialize the address map
  const addressMap: ProtocolsRegistry["addressMap"] = {};

  // Process each protocol
  for (const protocol of protocols) {
    // Process each chain in the protocol
    for (const [chainId, contracts] of Object.entries(protocol.contracts)) {
      // Initialize chain map if it doesn't exist
      if (!addressMap[chainId]) {
        addressMap[chainId] = {};
      }

      // Add each contract address to the map
      for (const contract of contracts) {
        const address = contract.address.toLowerCase();
        addressMap[chainId][address] = protocol.id;
      }
    }
  }

  // Create and return the registry
  const registry: ProtocolsRegistry = {
    protocols,
    addressMap,
  };

  return registry;
}

/**
 * Saves the protocol registry to a file
 */
export function saveRegistry(
  registry: ProtocolsRegistry,
  filename = "registry.json"
) {
  // Create directory if it doesn't exist
  const outputDir = path.join(__dirname, "../../data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write registry to file
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2));

  console.log(`Registry saved to ${outputPath}`);

  // Log some stats
  const totalAddresses = Object.values(registry.addressMap).reduce(
    (sum, chainMap) => sum + Object.keys(chainMap).length,
    0
  );

  console.log(
    `Registry contains ${registry.protocols.length} protocols and ${totalAddresses} mapped addresses`
  );
}

/**
 * Loads protocols from the JSON file
 */
export function loadProtocols(filename = "protocols.json"): Protocol[] {
  const filePath = path.join(__dirname, "../../data", filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} does not exist`);
    return [];
  }

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Protocol[];
  } catch (error) {
    console.error(`Error loading protocols from ${filePath}:`, error);
    return [];
  }
}

/**
 * Builds and saves the registry from protocols in the data directory
 */
export function buildAndSaveRegistry() {
  const protocols = loadProtocols();
  const registry = buildRegistry(protocols);
  saveRegistry(registry);
  return registry;
}

// Execute if run directly
if (require.main === module) {
  buildAndSaveRegistry();
}
