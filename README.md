# Lucid Protocols

A TypeScript repository providing a structured database of DeFi protocols with their contract addresses, metadata, and other relevant information. This repository now focuses specifically on Rabby Swap contract addresses.

## Project Structure

```
src/
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── scripts/      # Scripts for protocol parsing and registry building
data/             # Generated protocols data
```

## Usage

This repository can be used to:
- Look up protocol information by contract address
- Find DEX protocol metadata (name, logo, etc.)
- Filter protocols by categories or chains

## How It Works

The repository uses a simplified approach:

1. Fetches contract addresses from the Rabby Swap repository (`fetchContracts.ts`)
2. Constructs a registry mapping contracts to protocols (`buildRegistry.ts`)
3. Provides utility functions for looking up protocols by address

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/lucid_protocols.git
cd lucid_protocols

# Install dependencies
npm install
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
- 1inch
- ParaSwap
- 0x API
- Uniswap V3
- Wrap Token
- OpenOcean
- KyberSwap
- ParaSwap V6
- ODOS
- 0x API V2
- Magpie

## Data Sources

This repository uses contract addresses from [Rabby Swap](https://github.com/RabbyHub/rabby-swap), focusing on DEX protocols and aggregators across multiple chains.
