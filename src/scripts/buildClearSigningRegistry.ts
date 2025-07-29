import fs from "fs";
import path from "path";
import { Protocol, ProtocolsRegistry } from "../types";

// Path constants
const DATA_DIR = path.join(__dirname, "../../data");
const CLEAR_SIGNING_PROTOCOLS_FILE = path.join(
  DATA_DIR,
  "clear-signing-protocols.json"
);
const REGISTRY_FILE = path.join(DATA_DIR, "registry.json");

/**
 * Build a registry for Clear Signing protocols and merge with existing registry
 */
async function buildClearSigningRegistry(): Promise<ProtocolsRegistry> {
  try {
    console.log("Building Clear Signing protocols registry...");

    // Check if Clear Signing protocols file exists
    if (!fs.existsSync(CLEAR_SIGNING_PROTOCOLS_FILE)) {
      throw new Error(
        `Clear Signing protocols file not found: ${CLEAR_SIGNING_PROTOCOLS_FILE}`
      );
    }

    // Read Clear Signing protocols
    const clearSigningProtocols: Protocol[] = JSON.parse(
      fs.readFileSync(CLEAR_SIGNING_PROTOCOLS_FILE, "utf-8")
    );
    console.log(
      `Loaded ${clearSigningProtocols.length} Clear Signing protocols`
    );

    // Read existing registry if it exists
    let existingRegistry: ProtocolsRegistry = {
      protocols: [],
      addressMap: {},
    };

    if (fs.existsSync(REGISTRY_FILE)) {
      existingRegistry = JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf-8"));
      console.log(
        `Loaded existing registry with ${existingRegistry.protocols.length} protocols`
      );
    }

    // Create a map of existing protocol IDs for quick lookup
    const existingProtocolIds = new Set(
      existingRegistry.protocols.map((p) => p.id)
    );

    // Merge protocols
    const mergedProtocols = [...existingRegistry.protocols];
    let newProtocolsCount = 0;

    for (const protocol of clearSigningProtocols) {
      if (!existingProtocolIds.has(protocol.id)) {
        mergedProtocols.push(protocol);
        existingProtocolIds.add(protocol.id);
        newProtocolsCount++;
      } else {
        // Update existing protocol with new contracts
        const existingProtocol = mergedProtocols.find(
          (p) => p.id === protocol.id
        );
        if (existingProtocol) {
          // Merge contracts from both sources
          for (const chainId in protocol.contracts) {
            if (!existingProtocol.contracts[chainId]) {
              existingProtocol.contracts[chainId] = [];
            }

            // Add new contracts that don't exist
            for (const contract of protocol.contracts[chainId]) {
              const contractExists = existingProtocol.contracts[chainId].some(
                (c) => c.address === contract.address
              );
              if (!contractExists) {
                existingProtocol.contracts[chainId].push(contract);
              }
            }
          }
        }
      }
    }

    // Rebuild address map
    const addressMap: ProtocolsRegistry["addressMap"] = {};

    for (const protocol of mergedProtocols) {
      for (const chainId in protocol.contracts) {
        if (!addressMap[chainId]) {
          addressMap[chainId] = {};
        }

        for (const contract of protocol.contracts[chainId]) {
          const address = contract.address.toLowerCase();
          addressMap[chainId][address] = protocol.id;
        }
      }
    }

    // Count the total number of addresses
    let totalAddresses = 0;
    for (const chainId in addressMap) {
      totalAddresses += Object.keys(addressMap[chainId]).length;
    }

    // Create updated registry
    const updatedRegistry: ProtocolsRegistry = {
      protocols: mergedProtocols,
      addressMap,
    };

    // Save updated registry
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(updatedRegistry, null, 2));
    console.log(
      `Updated registry with ${newProtocolsCount} new protocols and ${totalAddresses} total addresses`
    );
    console.log(`Saved registry to ${REGISTRY_FILE}`);

    return updatedRegistry;
  } catch (error) {
    console.error("Error building Clear Signing registry:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  buildClearSigningRegistry().catch(console.error);
}

export { buildClearSigningRegistry };
