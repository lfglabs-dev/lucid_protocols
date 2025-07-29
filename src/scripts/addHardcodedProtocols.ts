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
  {
    id: "spark",
    name: "Spark",
    slug: "spark",
    logo: "/assets/spark.png",
    category: ["Lending"],
    contracts: {
      "1": [
        // Spark Liquidity Layer Addresses
        {
          address: "0xF8Dff673b555a225e149218C5005FC88f4a13870",
        },
        {
          address: "0x1601843c5E9bC251A3272907010AFa41Fa18347E",
        },
        {
          address: "0x7A5FD5cf045e010e62147F065cEAe59e5344b188",
        },
        {
          address: "0x90D8c80C028B4C09C0d8dcAab9bbB057F0513431",
        },
        {
          address: "0x8a25A24EDE9482C4Fc0738F99611BE58F1c839AB",
        },
        {
          address: "0x8Cc0Cb0cfB6B7e548cfd395B833c05C346534795",
        },
        // SparkLend - Core Protocol Addresses
        {
          address: "0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9",
        },
        {
          address: "0xdA135Cd78A086025BcdC87B038a1C462032b510C",
        },
        {
          address: "0x856900aa78e856a5df1a2665eE3a66b2487cD68f",
        },
        {
          address: "0xf09e48dd4CA8e76F63a57ADd428bB06fee7932a4",
        },
        {
          address: "0x4370D3b6C9588E02ce9D22e684387859c7Ff5b34",
        },
        {
          address: "0xC13e21B648A5Ee794902342038FF3aDAB66BE987",
        },
        {
          address: "0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE",
        },
        {
          address: "0x03cFa0C4622FF84E50E75062683F44c9587e6Cc1",
        },
        {
          address: "0x542DBa469bdE58FAeE189ffB60C6b49CE60E0738",
        },
        {
          address: "0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5",
        },
        {
          address: "0x92eF091C5a1E01b3CE1ba0D0150C84412d818F7a",
        },
        {
          address: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
        },
        // SparkDAO Addresses
        {
          address: "0x3300f198988e4C9C63F75dF86De36421f06af8c4",
        },
        {
          address: "0xbaf21A27622Db71041Bd336a573DDEdC8eB65122",
        },
        {
          address: "0x0000000000000000000000000000000000000000",
        },
      ],
      "42161": [
        // Bridging Addresses
        {
          address: "0x19330d10D9Cc8751218eaf51E8885D058642E08A",
        },
        {
          address: "0x10E6593CDda8c58a1d0f14C5164B376352a55f2F",
        },
        {
          address: "0x13F7F24CA959359a4D710D32c715D4bce273C793",
        },
        // Spark Liquidity Layer Addresses
        {
          address: "0x98f567464e91e9B4831d3509024b7868f9F79ee1",
        },
        {
          address: "0x92afd6F2385a90e44da3a8B60fe36f6cBe1D8709",
        },
        {
          address: "0x19D08879851FB54C2dCc4bb32b5a1EA5E9Ad6838",
        },
        {
          address: "0x90D8c80C028B4C09C0d8dcAab9bbB057F0513431",
        },
        {
          address: "0x8a25A24EDE9482C4Fc0738F99611BE58F1c839AB",
        },
        {
          address: "0x8Cc0Cb0cfB6B7e548cfd395B833c05C346534795",
        },
        // PSM Addresses
        {
          address: "0x2B05F8e1cACC6974fD79A673a341Fe1f58d27266",
        },
        // Governance Relay Addresses
        {
          address: "0x65d946e533748A998B1f0E430803e39A6388f7a1",
        },
        {
          address: "0x212871A1C235892F86cAB30E937e18c94AEd8474",
        },
        // SSR Oracle Addresses
        {
          address: "0xEE2816c1E1eed14d444552654Ed3027abC033A36",
        },
        {
          address: "0xc0737f29b964e6fC8025F16B30f2eA4C2e2d6f22",
        },
        {
          address: "0x84AB0c8C158A1cD0d215BE2746cCa668B79cc287",
        },
        {
          address: "0x567214Dc57a2385Abc4a756f523ddF0275305Cbc",
        },
        // DSR Oracle Addresses
        {
          address: "0xE206AEbca7B28e3E8d6787df00B010D4a77c32F3",
        },
        {
          address: "0xcA61540eC2AC74E6954FA558B4aF836d95eCb91b",
        },
        {
          address: "0x73750DbD85753074e452B2C27fB9e3B0E75Ff3B8",
        },
        // SPARK_REWARDS_MULTISIG
        {
          address: "0xF649956f43825d4d7295a50EDdBe1EDC814A3a83",
        },
      ],
      "8453": [
        // Bridging Addresses
        {
          address: "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
        },
        {
          address: "0xdD0BCc201C9E47c6F6eE68E4dB05b652Bb6aC255",
        },
        {
          address: "0xee44cdb68D618d58F75d9fe0818B640BD7B8A7B7",
        },
        // Spark Liquidity Layer Addresses
        {
          address: "0xB94378b5347a3E199AF3575719F67A708a5D8b9B",
        },
        {
          address: "0x2917956eFF0B5eaF030abDB4EF4296DF775009cA",
        },
        {
          address: "0x983eC82E45C61a42FDDA7B3c43B8C767004c8A74",
        },
        {
          address: "0x90D8c80C028B4C09C0d8dcAab9bbB057F0513431",
        },
        {
          address: "0x8a25A24EDE9482C4Fc0738F99611BE58F1c839AB",
        },
        {
          address: "0x8Cc0Cb0cfB6B7e548cfd395B833c05C346534795",
        },
        // PSM Addresses
        {
          address: "0x1601843c5E9bC251A3272907010AFa41Fa18347E",
        },
        // Governance Relay Addresses
        {
          address: "0xF93B7122450A50AF3e5A76E1d546e95Ac1d0F579",
        },
        {
          address: "0xfda082e00EF89185d9DB7E5DcD8c5505070F5A3B",
        },
        // SSR Oracle Addresses
        {
          address: "0x65d946e533748A998B1f0E430803e39A6388f7a1",
        },
        {
          address: "0x49aF4eE75Ae62C2229bb2486a59Aa1a999f050f0",
        },
        {
          address: "0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E",
        },
        {
          address: "0x212871A1C235892F86cAB30E937e18c94AEd8474",
        },
        // DSR Oracle Addresses
        {
          address: "0x2Dd2a2Fe346B5704380EfbF6Bd522042eC3E8FAe",
        },
        {
          address: "0xaDEAf02Ddb5Bed574045050B8096307bE66E0676",
        },
        {
          address: "0xeC0C14Ea7fF20F104496d960FDEBF5a0a0cC14D0",
        },
        // SPARK_REWARDS_MULTISIG
        {
          address: "0xF649956f43825d4d7295a50EDdBe1EDC814A3a83",
        },
      ],
      "100": [
        // SparkLend - Core Protocol Addresses
        {
          address: "0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9",
        },
        {
          address: "0x86C71796CcDB31c3997F8Ec5C2E3dB3e9e40b985",
        },
        {
          address: "0x4d988568b5f0462B08d1F40bA1F5f17ad2D24F76",
        },
        {
          address: "0x98e6BcBA7d5daFbfa4a92dAF08d3d7512820c30C",
        },
        {
          address: "0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0",
        },
        {
          address: "0xA98DaCB3fC964A6A0d2ce3B77294241585EAbA6d",
        },
        {
          address: "0x49d24798d3b84965F0d1fc8684EF6565115e70c1",
        },
        {
          address: "0x2Fc8823E1b967D474b47Ae0aD041c2ED562ab588",
        },
        {
          address: "0xb9E6DBFa4De19CCed908BcbFe1d015190678AB5f",
        },
        {
          address: "0x8220096398c3Dc2644026E8864f5D80Ef613B437",
        },
        {
          address: "0xBD7D6a9ad7865463DE44B05F04559f65e3B11704",
        },
        // SPARK_REWARDS_MULTISIG
        {
          address: "0xF649956f43825d4d7295a50EDdBe1EDC814A3a83",
        },
      ],
      "10": [
        // DSR Oracle Addresses
        {
          address: "0x33a3aB524A43E69f30bFd9Ae97d1Ec679FF00B64",
        },
        {
          address: "0xE206AEbca7B28e3E8d6787df00B010D4a77c32F3",
        },
        {
          address: "0x15ACEE5F73b36762Ab1a6b7C98787b8148447898",
        },
        // SPARK_REWARDS_MULTISIG
        {
          address: "0xF649956f43825d4d7295a50EDdBe1EDC814A3a83",
        },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  },
  // https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md
  {
    id: "fluid",
    name: "Fluid",
    slug: "fluid",
    logo: "/assets/fluid.png",
    category: ["DEX"],
    contracts: {
      "1": [
        {
          address: "0xF82111c4354622AB12b9803cD3F6164FCE52e847",
        },
        {
          address: "0xC215485C572365AE87f908ad35233EC2572A3BEC",
        },
        {
          address: "0x122E12eB5F235adAC8DC78292CB1838f065D9b9f",
        },
        {
          address: "0xE3DcB2183fe0aBBa897F7880C6E8c58d9c5A3Ce9",
        },
        {
          address: "0xf0b280cCa857E0580a0aE13fbd8e7c7Ec71bfc38",
        },
        {
          address: "0x394Ce45678e0019c0045194a561E2bEd0FCc6Cf0",
        },
        {
          address: "0x113555CdF22d8A7C2F8346bf86D76230A5b2aC11",
        },
        {
          address: "0x3E3dae4F30347782089d398D462546eb5276801C",
        },
        {
          address: "0x6Cd1E75b524D3CCa4c3320436d6F09e24Dadd613",
        },
        {
          address: "0x8F31451Afa539cAfB92CBd5cdA41DC026f9CDc62",
        },
        {
          address: "0xFe4affaD55c7AeC012346195654634F7C786fA2c",
        },
        {
          address: "0xb387f9C2092cF7c4943F97842887eBff7AE96EB3",
        },
        {
          address: "0x71783F64719899319B56BdA4F27E1219d9AF9a3d",
        },
        {
          address: "0x4B2dEf0bd5201543FFc8900C13724a81Ed3324Fe",
        },
        {
          address: "0x52Aa899454998Be5b000Ad077a46Bbe360F4e497",
        },
        {
          address: "0xC3800E7527145837e525cfA6AD96B6B5DaE01586",
        },
        {
          address: "0x6967e68F7f9b3921181f27E66Aa9c3ac7e13dBc0",
        },
        {
          address: "0xa57D7CeF617271F4cEa4f665D33ebcFcBA4929f6",
        },
        {
          address: "0x9191b9539DD588dB81076900deFDd79Cb1115f72",
        },
        {
          address: "0x54B91A0D94cb471F37f949c60F7Fa7935b551D03",
        },
        {
          address: "0x324c5Dc1fC42c7a4D43d92df1eBA58a54d13Bf2d",
        },
        {
          address: "0x5dDf07980ADD152D518AE463269e1A97e93EE1a9",
        },
        {
          address: "0x98711192e2be92302cb6263e6fCf99169146b9FB",
        },
        {
          address: "0xF4b87B0A2315534A8233724b87f2a8E3197ad649",
        },
        {
          address: "0x148807CFE7C285003A923411C6037eb3Fe0E7f1C",
        },
        {
          address: "0xB6FF36e7d04e6017E0323F1f92A8184370d48907",
        },
        {
          address: "0xf92b954D3B2F6497B580D799Bf0907332AF1f63B",
        },
        {
          address: "0x5f0C79742bEdFC62C2Ae74e5f2De8aB2c74a3481",
        },
        {
          address: "0x076a9fe6051d66b6281e8aC26a8278330274C004",
        },
        {
          address: "0xbc9c8528c66D1910CFb6Bde2a8f1C2F1D38026c7",
        },
        {
          address: "0x644E0b92Ef00847184acB0679D2F116d1fA66659",
        },
        {
          address: "0xC292c87F3116CBbfb2186d4594Dc48d55fCa6e34",
        },
        {
          address: "0x91716C4EDA1Fb55e84Bf8b4c7085f84285c19085",
        },
        {
          address: "0x7db5101f12555bD7Ef11B89e4928061B7C567D27",
        },
        {
          address: "0x780D3C70d583DD8bd894abB53952B868916f69D8",
        },
        {
          address: "0x7781455D7c55C717ea6298D0492D950179830B43",
        },
      ],
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    excluded: false,
  },
  // compound: https://docs.compound.finance/#developer-resources
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
