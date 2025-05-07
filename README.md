# Lucid Protocols

A TypeScript repository providing a structured database of DeFi protocols with their contract addresses, metadata, and other relevant information. This repository focuses on Rabby Swap contract addresses and includes the ERC-7730 Clear Signing Metadata Registry for improved transaction transparency.

## Project Structure

```
src/
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── scripts/      # Scripts for protocol parsing and registry building
data/             # Generated protocols data
clear-signing-erc7730-registry/ # ERC-7730 metadata registry submodule
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
2. Constructs a registry mapping contracts to protocols (`buildRegistry.ts`)
3. Provides utility functions for looking up protocols by address
4. Integrates with ERC-7730 registry for clear signing metadata

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
- Kiln
- Lens
- Lido
- Lombard
- KyberSwap
- Magpie
- MarkerDAO
- Morpho
- ODOS
- OpenSea
- ParaSwap
- Quickswap
- Uniswap
- OpenOcean
- Sky


## Data Sources

### Contract Addresses
This repository uses contract addresses from [Rabby Swap](https://github.com/RabbyHub/rabby-swap), focusing on DEX protocols and aggregators across multiple chains.

### Clear Signing Metadata
For clear signing support, we use the [ERC-7730 Clear Signing Metadata Registry](https://github.com/LedgerHQ/clear-signing-erc7730-registry), which provides human-readable metadata for smart contract interactions.
