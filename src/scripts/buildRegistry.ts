import fs from "fs";
import path from "path";
import { Protocol, ProtocolsRegistry } from "../types";

// Path constants
const DATA_DIR = path.join(__dirname, "../../data");
const RABBY_PROTOCOLS_FILE = path.join(DATA_DIR, "protocols.json");
const OUTPUT_FILE = path.join(DATA_DIR, "registry.json");

/**
 * Build a registry for Rabby protocols
 */
async function buildRegistry(): Promise<ProtocolsRegistry> {
  try {
    console.log("Building Rabby protocols registry...");

    // Check if Rabby protocols file exists
    if (!fs.existsSync(RABBY_PROTOCOLS_FILE)) {
      throw new Error(
        `Rabby protocols file not found: ${RABBY_PROTOCOLS_FILE}`
      );
    }

    // Read Rabby protocols
    const protocols: Protocol[] = JSON.parse(
      fs.readFileSync(RABBY_PROTOCOLS_FILE, "utf-8")
    );
    console.log(`Loaded ${protocols.length} Rabby protocols`);

    // Build address map for quick lookups
    const addressMap: ProtocolsRegistry["addressMap"] = {};

    for (const protocol of protocols) {
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

    // Create registry
    const registry: ProtocolsRegistry = {
      protocols,
      addressMap,
    };

    // Save registry
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));
    console.log(
      `Built registry with ${protocols.length} protocols and ${totalAddresses} addresses`
    );
    console.log(`Saved registry to ${OUTPUT_FILE}`);

    return registry;
  } catch (error) {
    console.error("Error building Rabby registry:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  buildRegistry().catch(console.error);
}

export { buildRegistry };
