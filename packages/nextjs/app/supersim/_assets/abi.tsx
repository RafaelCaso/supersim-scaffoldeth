export const bridgeETHABI = [
  {
    constant: false,
    inputs: [
      { name: "minGasLimit", type: "uint256" },
      { name: "extraData", type: "bytes" },
    ],
    name: "bridgeETH",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];

export const L2NativeSuperchainERC20ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const l2Erc20BridgeAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
    ],
    name: "sendERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
