import { defineChain } from "viem";
import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export const L1Chain = defineChain({
  id: 900,
  name: "Local L1",
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  contracts: {
    L1StandardBridgeProxy: {
      address: "0x8d515eb0e5f293b16b6bbca8275c060bae0056b0",
    },
  },
});

export const L2ChainA = defineChain({
  id: 901,
  name: "OPChainA",
  rpcUrls: {
    default: { http: ["http://127.0.0.1:9545"] },
  },
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  contracts: {
    OptimismPortal: {
      address: "0x37a418800d0c812A9dE83Bc80e993A6b76511B57",
    },
    L1CrossDomainMessenger: {
      address: "0xcd712b03bc6424BF45cE6C29Fc90FFDece228F6E",
    },
    L1StandardBridge: {
      address: "0x8d515eb0e5F293B16B6bBCA8275c060bAe0056B0",
    },
  },
});

export const L2ChainB = defineChain({
  id: 902,
  name: "OPChainB",
  rpcUrls: {
    default: { http: ["http://127.0.0.1:9546"] },
  },
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  contracts: {
    OptimismPortal: {
      address: "0x35e67BC631C327b60C6A39Cff6b03a8adBB19c2D",
    },
    L1CrossDomainMessenger: {
      address: "0xeCA0f912b4bd255f3851951caE5775CC9400aA3B",
    },
    L1StandardBridge: {
      address: "0x67B2aB287a32bB9ACe84F6a5A30A62597b10AdE9",
    },
  },
});

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [L1Chain, L2ChainA, L2ChainB],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // You can get your Alchemy's default API key at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: false,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
