import fs from "fs";
import path from "path";
import { Protocol } from "../types";

// Path constants
const DATA_DIR = path.join(__dirname, "../../data");
const OUTPUT_FILE = path.join(DATA_DIR, "clear-signing-protocols.json");
const REGISTRY_DIR = path.join(
  __dirname,
  "../../data_sources/clear-signing-erc7730-registry/registry"
);

/**
 * Extract contract addresses from ERC-7730 metadata files
 */
function extractContractAddresses(
  metadataPath: string
): { chainId: string; address: string }[] {
  try {
    const content = fs.readFileSync(metadataPath, "utf-8");
    const metadata = JSON.parse(content);

    console.log(`  Processing: ${path.basename(metadataPath)}`);

    const addresses: { chainId: string; address: string }[] = [];

    // ERC-7730 metadata structure has deployments in context.contract.deployments
    if (
      metadata.context &&
      metadata.context.contract &&
      metadata.context.contract.deployments &&
      Array.isArray(metadata.context.contract.deployments)
    ) {
      // Extract addresses from deployments array
      for (const deployment of metadata.context.contract.deployments) {
        if (deployment.chainId && deployment.address) {
          addresses.push({
            chainId: deployment.chainId.toString(),
            address: deployment.address.toLowerCase(),
          });

          console.log(
            `    Found deployment: ${deployment.address} on chain ${deployment.chainId}`
          );
        }
      }
    }

    return addresses;
  } catch (error) {
    console.warn(
      `Error extracting contract addresses from ${metadataPath}:`,
      error
    );
    return [];
  }
}

/**
 * Parse protocol metadata from ERC-7730 registry
 */
async function createClearSigningProtocols(): Promise<Protocol[]> {
  try {
    console.log("Parsing ERC-7730 Clear Signing Metadata Registry...");

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Check if registry directory exists
    if (!fs.existsSync(REGISTRY_DIR)) {
      throw new Error(`Registry directory not found: ${REGISTRY_DIR}`);
    }

    // Get all protocol folders in the registry
    const protocolFolders = fs
      .readdirSync(REGISTRY_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    console.log(`Found ${protocolFolders.length} protocol folders in registry`);

    const protocols: Protocol[] = [];

    // Process each protocol folder
    for (const folder of protocolFolders) {
      const folderPath = path.join(REGISTRY_DIR, folder);

      // Find all metadata files in the folder
      // ERC-7730 files can have various naming patterns, so we'll check:
      // - calldata*.json, eip712*.json (with dash or underscore)
      // - Files that start with those prefixes in any case
      const metadataFiles = fs.readdirSync(folderPath).filter((file) => {
        const lowerFile = file.toLowerCase();
        return (
          file.endsWith(".json") &&
          (lowerFile.startsWith("calldata") || lowerFile.startsWith("eip712"))
        );
      });

      if (metadataFiles.length === 0) {
        console.log(`No metadata files found for ${folder}, skipping`);
        continue;
      }

      console.log(`Found ${metadataFiles.length} metadata files for ${folder}`);

      // Generate capitalized name (e.g., "uniswap" -> "Uniswap")
      const name = folder.charAt(0).toUpperCase() + folder.slice(1);

      // Create protocol object
      const protocol: Protocol = {
        id: folder,
        name: name,
        slug: folder,
        logo: `/assets/${folder}.png`, // Use a standardized path
        category: ["DeFi"], // Default category
        contracts: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        excluded: false,
      };

      // Process each metadata file to extract contract addresses
      for (const file of metadataFiles) {
        const metadataPath = path.join(folderPath, file);
        const contractAddresses = extractContractAddresses(metadataPath);

        // Add contracts to the protocol
        for (const { chainId, address } of contractAddresses) {
          if (!protocol.contracts[chainId]) {
            protocol.contracts[chainId] = [];
          }

          // Check if contract already exists
          const contractExists = protocol.contracts[chainId].some(
            (c) => c.address === address
          );

          // Add contract if it doesn't exist
          if (!contractExists) {
            protocol.contracts[chainId].push({
              address,
            });
          }
        }
      }

      // Only add protocol if it has contracts
      if (Object.keys(protocol.contracts).length > 0) {
        protocols.push(protocol);
        console.log(
          `  Extracted ${
            Object.keys(protocol.contracts).length
          } chain(s) with contracts`
        );
      } else {
        console.log(`  No contract addresses found for ${folder}`);
      }
    }

    // Save protocols to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(protocols, null, 2));

    // Count the total number of contracts
    let totalContracts = 0;
    for (const protocol of protocols) {
      for (const chainId in protocol.contracts) {
        totalContracts += protocol.contracts[chainId].length;
      }
    }

    console.log(
      `Created ${protocols.length} protocols with ${totalContracts} contracts from ERC-7730 registry`
    );
    console.log(`Saved protocols to ${OUTPUT_FILE}`);

    return protocols;
  } catch (error) {
    console.error("Error creating clear signing protocols:", error);
    return [];
  }
}

// Run if executed directly
if (require.main === module) {
  createClearSigningProtocols().catch(console.error);
}

export { createClearSigningProtocols };
