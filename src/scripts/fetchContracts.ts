import axios from "axios";
import fs from "fs";
import path from "path";
import { Protocol } from "../types";

// Path to the registry file
const DATA_DIR = path.join(__dirname, "../../data");
const OUTPUT_FILE = path.join(DATA_DIR, "protocols.json");

// URL to Rabby's contract list
const RABBY_LIST_URL =
  "https://raw.githubusercontent.com/RabbyHub/rabby-swap/main/src/list.ts";

// Map Rabby chain names to our chainIds
const CHAIN_MAP: Record<string, string> = {
  ETH: "1", // Ethereum
  POLYGON: "137", // Polygon
  BSC: "56", // Binance Smart Chain
  OP: "10", // Optimism
  FTM: "250", // Fantom
  AVAX: "43114", // Avalanche
  ARBITRUM: "42161", // Arbitrum
  KLAY: "8217", // Klaytn
  GNOSIS: "100", // Gnosis
  BASE: "8453", // Base
  ERA: "324", // zkSync Era
  AURORA: "1313161554", // Aurora
  LINEA: "59144", // Linea
  METIS: "1088", // Metis
  ZKSYNC: "324", // zkSync (same as ERA)
  CELO: "42220", // Celo
  HARMONY: "1666600000", // Harmony
  HECO: "128", // HECO
  OKC: "66", // OKC
  THUNDERCORE: "108", // ThunderCore
  BOBA: "288", // Boba
  CRONOS: "25", // Cronos
  DOGECHAIN: "2000", // Dogechain
  MOONRIVER: "1285", // Moonriver
  MOONBEAM: "1284", // Moonbeam
  ASTAR: "592", // Astar
  FUSE: "122", // Fuse
  TELOS: "40", // Telos
  CANTO: "7700", // Canto
  MANTLE: "5000", // Mantle
};

// Predefined protocol information
interface ProtocolInfo {
  id: string;
  name: string;
  slug: string;
  logo: string;
  category: string[];
}

// Define protocol information with predefined data - only including the ones specified
const PROTOCOL_INFO: Record<string, ProtocolInfo> = {
  ONEINCH: {
    id: "1inch",
    name: "1inch",
    slug: "1inch",
    logo: "https://icons.llama.fi/1inch.jpg", // TODO: Add logo
    category: ["DEX", "Aggregator"],
  },
  PARASWAP: {
    id: "paraswap",
    name: "ParaSwap",
    slug: "paraswap",
    logo: "https://icons.llama.fi/paraswap.jpg",
    category: ["DEX", "Aggregator"],
  },
  ZEROXAPI: {
    id: "0x-api",
    name: "0x",
    slug: "0x-api",
    logo: "https://icons.llama.fi/0x-protocol.jpg",
    category: ["DEX", "Aggregator"],
  },
  UNISWAP: {
    id: "uniswap-v3",
    name: "Uniswap V3",
    slug: "uniswap-v3",
    logo: "https://icons.llama.fi/uniswap.jpg", // TODO: Add logo
    category: ["DEX"],
  },
  WRAPTOKEN: {
    id: "wrap-token",
    name: "Wrap Token",
    slug: "wrap-token",
    logo: "https://icons.llama.fi/wrap-token.jpg", // TODO: Add logo token default
    category: ["Token"],
  },
  OPENOCEAN: {
    id: "openocean",
    name: "OpenOcean",
    slug: "openocean",
    logo: "https://icons.llama.fi/openocean.jpg",
    category: ["DEX", "Aggregator"],
  },
  KYBERSWAP: {
    id: "kyberswap",
    name: "KyberSwap",
    slug: "kyberswap",
    logo: "https://icons.llama.fi/kyberswap.jpg", // TODO: Add logo
    category: ["DEX"],
  },
  PARASWAPV6: {
    id: "paraswap-v6",
    name: "ParaSwap V6",
    slug: "paraswap-v6",
    logo: "https://icons.llama.fi/paraswap.jpg",
    category: ["DEX", "Aggregator"],
  },
  ODOS: {
    id: "odos",
    name: "ODOS",
    slug: "odos",
    logo: "https://icons.llama.fi/odos.jpg",
    category: ["DEX", "Aggregator"],
  },
  ZEROXAPIV2: {
    id: "0x-api-v2",
    name: "0x API V2",
    slug: "0x-api-v2",
    logo: "https://icons.llama.fi/0x-protocol.jpg",
    category: ["DEX", "Aggregator"],
  },
  MAGPIE: {
    id: "magpie",
    name: "Magpie",
    slug: "magpie",
    logo: "https://icons.llama.fi/magpie.jpg", // TODO: Add logo
    category: ["DEX"],
  },
};

/**
 * Fetch Rabby contract list from GitHub
 */
async function fetchRabbyContractList(): Promise<string> {
  try {
    console.log("Fetching Rabby contract list...");
    const response = await axios.get(RABBY_LIST_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching Rabby contract list:", error);
    throw error;
  }
}

/**
 * Parse contract addresses from the Rabby list
 */
function parseRabbyContracts(
  content: string
): Record<string, Record<string, string>> {
  try {
    console.log("Parsing Rabby contract list...");
    const contracts: Record<string, Record<string, string>> = {};

    // Look for DEX_ROUTER_WHITELIST and other similar objects
    const whitelist = extractWhitelist(content, "DEX_ROUTER_WHITELIST");
    const spenderList = extractWhitelist(content, "DEX_SPENDER_WHITELIST");

    // Combine all contracts
    return { ...whitelist, ...spenderList };
  } catch (error) {
    console.error("Error parsing Rabby contracts:", error);
    return {};
  }
}

/**
 * Extract whitelist from content
 */
function extractWhitelist(
  content: string,
  listName: string
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  // Find the list declaration
  const listRegex = new RegExp(
    `export const ${listName} = {([\\s\\S]*?)};`,
    "g"
  );
  const listMatch = listRegex.exec(content);

  if (!listMatch || !listMatch[1]) {
    console.warn(`Could not find ${listName} in the content`);
    return result;
  }

  // Extract the protocols
  const protocolsContent = listMatch[1];
  const protocolRegex = /\[DEX_ENUM\.([^\]]+)\]:\s*{([\s\S]*?)},/g;

  let protocolMatch;
  while ((protocolMatch = protocolRegex.exec(protocolsContent)) !== null) {
    const protocolName = protocolMatch[1];
    const chainsContent = protocolMatch[2];

    // Extract chains and addresses
    const chainRegex = /\[CHAINS_ENUM\.([^\]]+)\]:\s*"([^"]+)"/g;
    const chains: Record<string, string> = {};

    let chainMatch;
    while ((chainMatch = chainRegex.exec(chainsContent)) !== null) {
      const chainName = chainMatch[1];
      const address = chainMatch[2].toLowerCase();
      chains[chainName] = address;
    }

    result[protocolName] = chains;
  }

  return result;
}

/**
 * Create protocols from Rabby contracts only (no merging with existing)
 */
async function createProtocols(): Promise<Protocol[]> {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Fetch and parse Rabby contracts
    const contractsContent = await fetchRabbyContractList();
    const contractsByProtocol = parseRabbyContracts(contractsContent);

    const protocols: Protocol[] = [];
    const protocolsMap = new Map<string, Protocol>();

    console.log("Creating protocols from Rabby data only...");

    // Process each protocol in the Rabby data
    for (const [rabbyName, contractsByChain] of Object.entries(
      contractsByProtocol
    )) {
      // Get protocol info from our predefined data
      const protocolInfo = PROTOCOL_INFO[rabbyName];

      if (!protocolInfo) {
        console.warn(`No predefined information for ${rabbyName}, skipping`);
        continue;
      }

      // Create protocol object
      let protocol: Protocol = {
        id: protocolInfo.id,
        name: protocolInfo.name,
        slug: protocolInfo.slug,
        logo: protocolInfo.logo,
        category: protocolInfo.category,
        contracts: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        excluded: false,
      };

      // Add contracts for each chain
      for (const [rabbyChain, address] of Object.entries(contractsByChain)) {
        const chainId = CHAIN_MAP[rabbyChain];

        if (chainId) {
          // Initialize contracts array for this chain if it doesn't exist
          if (!protocol.contracts[chainId]) {
            protocol.contracts[chainId] = [];
          }

          // Add contract
          const normalizedAddress = address.toLowerCase();
          protocol.contracts[chainId].push({
            address: normalizedAddress,
          });
        }
      }

      // Only add protocol if it has contracts
      if (Object.keys(protocol.contracts).length > 0) {
        protocols.push(protocol);
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
      `Created ${protocols.length} protocols with ${totalContracts} contracts from Rabby`
    );
    console.log(`Saved protocols to ${OUTPUT_FILE}`);

    return protocols;
  } catch (error) {
    console.error("Error creating Rabby protocols:", error);
    return [];
  }
}

// Run if executed directly
if (require.main === module) {
  createProtocols().catch(console.error);
}

export { createProtocols };
