# Lucid Protocols

A TypeScript repository of whitelisted protocols inspired by DefiLlama-Adapters. This repository provides a structured database of DeFi protocols with their contract addresses, metadata, and other relevant information.

## Project Structure

```
src/
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── scripts/      # Scripts for protocol parsing
data/             # Generated protocols data
defillama-adapters/ # Git submodule of DefiLlama-Adapters
```

## Usage

This repository can be used to:
- Look up protocol information by contract address
- Find protocol metadata (name, logo, etc.)
- Filter protocols by categories or chains
- Identify excluded protocols (those not officially listed on DefiLlama)

## How It Works

This repository uses a simple and direct approach:

1. It includes the DefiLlama-Adapters repository as a git submodule
2. Fetches the list of excluded protocols 
3. Parses protocol information directly from the local files
4. Marks protocols that are excluded based on the exclusion list
5. Constructs a registry with addresses and metadata
6. Protocol logos are accessed via `https://icons.llama.fi/{protocol-name}.jpg`

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
# Run the full process (fetch excluded list, parse protocols, build registry)
npm run dev

# Individual steps
npm run fetch:exclude  # Fetch the list of excluded protocols
npm run parse          # Parse all protocols from DefiLlama-Adapters
npm run build-registry # Build the protocol registry with address maps

# Build the project
npm run build
```

### Sample Run

For testing or development purposes, you can modify `src/scripts/parseProtocols.ts` to limit the number of protocols:

```typescript
// To process only the first 10 protocols
const protocols = await parseProtocols(10);
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
  contracts: {             // Contracts by chain ID
    [chainId: string]: {
      address: string;
    }[];
  };
  createdAt: number;       // Timestamp when added
  updatedAt: number;       // Timestamp when last updated
  excluded: boolean;       // Whether this protocol is excluded from DefiLlama
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
