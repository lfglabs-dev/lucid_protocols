import fs from "fs";
import path from "path";
import { Protocol, ProtocolsRegistry } from "../types";

// Path constants
const DATA_DIR = path.join(__dirname, "../../data");
const REGISTRY_FILE = path.join(DATA_DIR, "registry.json");

// Hardcoded protocols data
const HARDCODED_PROTOCOLS: Protocol[] = [
  {
    // https://docs.cow.fi/cow-protocol/reference/contracts/core
    id: "cowswap",
    name: "CowSwap",
    slug: "cowswap",
    logo: "/assets/cowswap.png",
    category: ["DEX", "Aggregator"],
    contracts: {
      // ethereum mainnet
      "1": [
        {
          address: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
        },
      ],
      // gnosis chain
      "100": [
        {
          address: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
        },
      ],
      // arbitrum chain
      "42161": [
        {
          address: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
        },
      ],
      // base
      "8453": [
        {
          address: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
        },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  },
  // https://developers.sky.money/deployments/deployment-tracker
  {
    id: "sky",
    name: "Sky",
    slug: "sky",
    logo: "/assets/sky.png",
    category: ["DEX"],
    contracts: {
      "1": [
        {
          address: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
        },
        {
          address: "0x1923DfeE706A8E78157416C29cBCCFDe7cdF4102",
        },
        {
          address: "0x3C0f895007CA717Aa01c8693e59DF1e8C3777FEB",
        },
        {
          address: "0x3225737a9Bbb6473CB4a45b7244ACa2BeFdB276A",
        },
        {
          address: "0xA188EEC8F81263234dA3622A406892F3D630f98c",
        },
        {
          address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        },
        {
          address: "0x9759a6ac90977b93b58547b4a71c78317f391a28",
        },
        {
          address: "0xf6e72db5454dd049d0788e411b06cfaf16853042",
        },
        {
          address: "0x56072C95FAA701256059aa122697B133aDEd9279",
        },
        {
          address: "0xBDcFCA946b6CDd965f99a839e4435Bcdc1bc470B",
        },
        {
          address: "0x2621CC0B3F3c079c1Db0E80794AA24976F0b9e3c",
        },
        {
          address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
        },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  },
  // https://docs.ethena.fi/solution-design/key-addresses
  {
    id: "ethena",
    name: "Ethena",
    slug: "ethena",
    logo: "/assets/ethena.png",
    category: ["Lending"],
    contracts: {
      "1": [
        {
          address: "0x2cc440b721d2cafd6d64908d6d8c4acc57f8afc3",
        },
        {
          address: "0xe3490297a08d6fC8Da46Edb7B6142E4F461b62D3",
        },
        {
          address: "0x9d39a5de30e57443bff2a8307a4256c8797a3497",
        },
        {
          address: "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
        },
        {
          address: "0x9d39a5de30e57443bff2a8307a4256c8797a3497",
        },
        {
          address: "0xf2fa332bd83149c66b09b45670bce64746c6b439",
        },
        {
          address: "0x57e114B691Db790C35207b2e685D4A43181e6061",
        },
        {
          address: "0x8bE3460A480c80728a8C4D7a5D5303c85ba7B3b9",
        },
        {
          address: "0xc65433845ecd16688eda196497fa9130d6c47bd8",
        },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  },
  // https://www.aerodrome.finance/security
  {
    id: "aerodrome",
    name: "Aerodrome",
    slug: "aerodrome",
    logo: "/assets/aerodrome.png",
    category: ["DEX"],
    contracts: {
      "8453": [
        {
          address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
        },
        {
          address: "0xE4c69af018B2EA9e575026c0472B6531A2bC382F",
        },
        {
          address: "0xE9992487b2EE03b7a91241695A58E0ef3654643E",
        },
        {
          address: "0x5C3F18F06CC09CA1910767A34a20F771039E37C0",
        },
        {
          address: "0x15e62707FCA7352fbE35F51a8D6b0F8066A05DCc",
        },
        {
          address: "0x35f35cA5B132CaDf2916BaB57639128eAC5bbcb5",
        },
        {
          address: "0xFdA1fb5A2a5B23638C7017950506a36dcFD2bDC3",
        },
        {
          address: "0xeB018363F0a9Af8f91F06FEe6613a751b2A33FE5",
        },
        {
          address: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
        },
        {
          address: "0x227f65131A261548b057215bB1D5Ab2997964C7d",
        },
        {
          address: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
        },
        {
          address: "0x16613524e02ad97eDfeF371bC883F2F5d6C480A5",
        },
        {
          address: "0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4",
        },
        {
          address: "0x45cA74858C579E717ee29A86042E0d53B252B504",
        },
        {
          address: "0xD30677bd8dd15132F251Cb54CbDA552d2A05Fb08",
        },
        {
          address: "0xF5601F95708256A118EF5971820327F362442D2d",
        },
        {
          address: "0x0A5aA5D3a4d28014f967Bf0f29EAA3FF9807D5c6",
        },
        {
          address: "0x827922686190790b37229fd06084350E74485b72",
        },
        {
          address: "0x01b0CaCB9A8004e08D075c919B5dF3b59FD53c55",
        },
        {
          address: "0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A",
        },
        {
          address: "0xeC8E5342B19977B4eF8892e02D8DAEcfa1315831",
        },
        {
          address: "0x254cF9E1E6e233aa1AC962CB9B05b2cfeAaE15b0",
        },
        {
          address: "0xF4171B0953b52Fa55462E4d76ecA1845Db69af00",
        },
        {
          address: "0x0AD08370c76Ff426F534bb2AFFD9b5555338ee68",
        },
        {
          address: "0x6Cb442acF35158D5eDa88fe602221b67B400Be3E",
        },
        {
          address: "0xBE6D8f0d05cC4be24d5167a3eF062215bE6D18a5",
        },
        {
          address: "0xee717411f6E44F9feE011835C8E6FAaC5dEfF166",
        },
        {
          address: "0x0AD09A66af0154a84e86F761313d02d0abB6edd5",
        },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  },
  // https://github.com/sparkdotfi/spark-address-registry/tree/master/src
  //   {
  //     id: "spark",
  //     name: "Spark",
  //     slug: "spark",
  //     logo: "/assets/spark.png",
  //     category: ["Lending"],
  //     contracts: {
  //       "1": [
  //         {
  //           address: "0x0000000000000000000000000000000000000000",
  //         },
  //       ],
  //     },
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     excluded: false,
  //   },
  // https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md
  //   {
  //     id: "fluid",
  //     name: "Fluid",
  //     slug: "fluid",
  //     logo: "/assets/fluid.png",
  //     category: ["DEX"],
  //     contracts: {
  //       "1": [
  //         {
  //           address: "0x0000000000000000000000000000000000000000",
  //         },
  //       ],
  //     },
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     excluded: false,
  //   },
  // https://github.com/euler-xyz/euler-interfaces/tree/master
  //   {
  //     id: "euler",
  //     name: "Euler",
  //     slug: "euler",
  //     logo: "/assets/euler.png",
  //     category: ["Lending"],
  //     contracts: {
  //       "1": [
  //         {
  //           address: "0x0000000000000000000000000000000000000000",
  //         },
  //       ],
  //     },
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     excluded: false,
  //   },
  // https://docs.compound.finance/#developer-resources
  //   {
  //     id: "compound",
  //     name: "Compound",
  //     slug: "compound",
  //     logo: "/assets/compound.png",
  //     category: ["Lending"],
  //     contracts: {
  //       "1": [
  //         {
  //           address: "0x0000000000000000000000000000000000000000",
  //         },
  //       ],
  //     },
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     excluded: false,
  //   },
  // https://github.com/pendle-finance/pendle-core-v2-public/blob/main/deployments/1-core.json
  //   {
  //     id: "pendle",
  //     name: "Pendle",
  //     slug: "pendle",
  //     logo: "/assets/pendle.png",
  //     category: ["Yield"],
  //     contracts: {
  //       "1": [
  //         {
  //           address: "0x0000000000000000000000000000000000000000",
  //         },
  //       ],
  //     },
  //     createdAt: Date.now(),
  //     updatedAt: Date.now(),
  //     excluded: false,
  //   },
];

/**
 * Add hardcoded protocols to the registry
 */
async function addHardcodedProtocols(): Promise<ProtocolsRegistry> {
  try {
    console.log("Adding hardcoded protocols to registry...");

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

    for (const protocol of HARDCODED_PROTOCOLS) {
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
    console.error("Error adding hardcoded protocols:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  addHardcodedProtocols().catch(console.error);
}

export { addHardcodedProtocols };
