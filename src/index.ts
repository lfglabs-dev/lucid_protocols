import { createProtocols } from "./scripts/fetchContracts";
import { buildRegistry } from "./scripts/buildRegistry";
import { Protocol, ProtocolsRegistry } from "./types";

/**
 * Main function to run the complete workflow - Rabby only
 */
export async function main() {
  console.log("=== Starting Rabby protocols workflow ===");

  try {
    // Step 1: Fetch protocols
    console.log("\n1. Fetching protocols...");
    await createProtocols();

    // Step 2: Build registry
    console.log("\n2. Building registry...");
    await buildRegistry();

    console.log("\n=== Workflow completed successfully ===");
  } catch (error) {
    console.error("Error in workflow:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Utility functions for working with the registry
export const utils = {
  // Find a protocol by its ID
  findProtocolById: (
    registry: ProtocolsRegistry,
    id: string
  ): Protocol | undefined => {
    return registry.protocols.find((p) => p.id === id);
  },

  // Find a protocol by contract address
  findProtocolByAddress: (
    registry: ProtocolsRegistry,
    chainId: string,
    address: string
  ): Protocol | undefined => {
    const normalizedAddress = address.toLowerCase();

    // Check if we have a mapping for this chain and address
    const chainMap = registry.addressMap[chainId];
    if (!chainMap) return undefined;

    const protocolId = chainMap[normalizedAddress];
    if (!protocolId) return undefined;

    // Return the protocol if found
    return registry.protocols.find((p) => p.id === protocolId);
  },

  // Filter protocols by category
  filterByCategory: (
    registry: ProtocolsRegistry,
    category: string
  ): Protocol[] => {
    return registry.protocols.filter(
      (p) => p.category && p.category.includes(category)
    );
  },

  // Filter out excluded protocols
  getIncludedProtocols: (registry: ProtocolsRegistry): Protocol[] => {
    return registry.protocols.filter((p) => !p.excluded);
  },
};

// Export types and main functions
export { Protocol, ProtocolsRegistry };
