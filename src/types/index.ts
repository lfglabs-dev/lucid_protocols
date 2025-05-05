export type ChainId = string;
export type Address = string;

export interface ContractInfo {
  address: Address;
  deployedAt?: number; // timestamp
  version?: string;
}

export interface Protocol {
  id: string;
  name: string;
  slug: string;
  logo: string;
  category: string[];
  contracts: Record<ChainId, ContractInfo[]>;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  excluded: boolean; // whether this protocol is excluded from official listings
}

export interface ProtocolsRegistry {
  protocols: Protocol[];
  addressMap: Record<ChainId, Record<Address, string>>; // maps address to protocol id
}
