import { parseProtocols } from "./scripts/parseProtocols";
import { fetchExclusionList } from "./scripts/fetchExclusionList";
import { buildRegistry, saveRegistry } from "./utils/buildRegistry";
import { Protocol, ProtocolsRegistry } from "./types";

/**
 * Main function to run the entire process
 * 1. Fetch excluded protocols list
 * 2. Parse protocols directly from the submodule
 * 3. Build the registry with address mappings
 * 4. Save the registry to a file
 */
export async function main(): Promise<ProtocolsRegistry> {
  try {
    // Step 1: Fetch excluded protocols list
    console.log("Step 1: Fetching excluded protocols list...");
    await fetchExclusionList();

    // Step 2: Parse protocols from the DefiLlama-Adapters submodule
    console.log("Step 2: Parsing protocols from DefiLlama-Adapters repo...");
    const protocols = await parseProtocols();

    // Step 3: Build registry
    console.log("Step 3: Building protocol registry...");
    const registry = buildRegistry(protocols);

    // Step 4: Save registry
    console.log("Step 4: Saving protocol registry...");
    saveRegistry(registry);

    console.log("Process completed successfully");
    return registry;
  } catch (error) {
    console.error("Error in main process:", error);
    throw error;
  }
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

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export types and main functions
export { Protocol, ProtocolsRegistry };
