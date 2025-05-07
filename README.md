# Lucid Protocols

A TypeScript repository providing a structured database of DeFi protocols with their contract addresses, metadata, and other relevant information. This repository focuses on Rabby Swap contract addresses and includes the ERC-7730 Clear Signing Metadata Registry for improved transaction transparency.

## Project Structure

```
src/
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── scripts/      # Scripts for protocol parsing and registry building
data/             # Generated protocols data
data_sources/
├── clear-signing-erc7730-registry/  # ERC-7730 metadata registry submodule
├── euler-interfaces/                # Euler interfaces submodule
└── pendle-core-v2-public/           # Pendle core contracts submodule
```

## Usage

This repository can be used to:
- Look up protocol information by contract address
- Find DEX protocol metadata (name, logo, etc.)
- Filter protocols by categories or chains
- Access ERC-7730 Clear Signing metadata for supported protocols

## How It Works

The repository uses a simplified approach:

1. Fetches contract addresses from the Rabby Swap repository (`fetchContracts.ts`)
2. Extracts contract information from the ERC-7730 Clear Signing Metadata Registry (`fetchClearSigningMetadata.ts`)
3. Parses Euler protocol contracts from the Euler interfaces (`fetchEulerContracts.ts`)
4. Extracts Pendle protocol contracts from deployment files (`fetchPendleContracts.ts`)
5. Adds hardcoded protocols for specific DeFi projects (`addHardcodedProtocols.ts`)
6. Constructs a registry mapping contracts to protocols (`buildRegistry.ts`)
7. Provides utility functions for looking up protocols by address

## Development

### Setup

```bash
# Clone the repository with submodules
git clone --recurse-submodules https://github.com/yourusername/lucid_protocols.git
cd lucid_protocols

# Install dependencies
npm install

# If you've already cloned without submodules, run:
git submodule update --init --recursive
```

### Building and Running

```bash
# Run the full process (fetch contracts, build registry)
npm run dev

# Individual steps
npm run fetch         # Fetch protocol contracts from Rabby
npm run fetch:clear-signing  # Fetch contracts from ERC-7730 registry
npm run fetch:euler   # Parse Euler protocol contracts
npm run fetch:pendle  # Extract Pendle protocol contracts
npm run add:hardcoded # Add hardcoded protocol data
npm run build-registry  # Build the protocol registry with address maps

# Build the project
npm run build
```

## Data Structure

The main types used in this repository are:

### Protocol

```typescript
interface Protocol {
  id: string;              // Unique identifier for the protocol
  name: string;            // Display name
  slug: string;            // URL-friendly name
  logo: string;            // URL to protocol logo
  category: string[];      // Categories like "DEX", "Aggregator"
  contracts: {             // Contracts by chain ID
    [chainId: string]: {
      address: string;
    }[];
  };
  createdAt: number;       // Timestamp when added
  updatedAt: number;       // Timestamp when last updated
}
```

### ProtocolsRegistry

```typescript
interface ProtocolsRegistry {
  protocols: Protocol[];   // List of all protocols
  addressMap: {            // Mapping for quick lookup by address
    [chainId: string]: {
      [address: string]: string; // Maps address to protocol ID
    };
  };
}
```

## Supported Protocols

This repository currently includes contract addresses for the following protocols:
- 0x
- 1inch
- Aave
- Aerodrome
- Cowswap
- Degate
- Ethena
- Euler
- Kiln
- Lens
- Lido
- Lombard
- KyberSwap
- Magpie
- MakerDAO
- Morpho
- ODOS
- OpenOcean
- OpenSea
- ParaSwap
- Pendle
- Quickswap
- Sky
- Spark
- Uniswap


## Data Sources

### Contract Addresses
This repository uses contract addresses from several sources:

1. **Rabby Swap**: Contract addresses from [Rabby Swap](https://github.com/RabbyHub/rabby-swap), focusing on DEX protocols and aggregators across multiple chains.

2. **ERC-7730 Clear Signing Metadata**: Human-readable metadata for smart contract interactions from the [ERC-7730 Clear Signing Metadata Registry](https://github.com/LedgerHQ/clear-signing-erc7730-registry).

3. **Euler Interfaces**: Contract addresses from the [Euler Protocol Interfaces](https://github.com/euler-xyz/euler-interfaces) repository.

4. **Pendle Core**: Contract addresses from the [Pendle Core V2](https://github.com/pendle-finance/pendle-core-v2-public) repository deployment files.

5. **Hardcoded Protocols**: Additional contract addresses for specific protocols that are maintained directly in this repository.
