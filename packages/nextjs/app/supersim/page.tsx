"use client";

import { EthIcon, OPIcon } from "./_assets/icons";
import { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount, useBalance, useReadContract, useWalletClient } from "wagmi";
import { useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { L1Chain, L2ChainA, L2ChainB } from "~~/scaffold.config";

const Supersim: NextPage = () => {
  const { data: walletClient } = useWalletClient();
  const bridgeETHABI = [
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

  const L2NativeSuperchainERC20ABI = [
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

  const l2Erc20BridgeAbi = [
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

  const l1StandardBridgeAddress = L1Chain.contracts.L1StandardBridgeProxy.address;

  const L2NativeSuperchainERC20Address = "0x420beeF000000000000000000000000000000001";

  const L2Erc20BridgeAddress = "0x4200000000000000000000000000000000000028";

  const { address: connectedAddress } = useAccount();

  const { writeContract } = useWriteContract();

  const handleBridgeETH = async () => {
    const bridgeData = writeContract({
      abi: bridgeETHABI,
      address: l1StandardBridgeAddress,
      functionName: "bridgeETH",
      args: [50000, "0x"],
      value: parseEther("1"),
    });

    const tx = {
      from: connectedAddress,
      to: l1StandardBridgeAddress,
      data: bridgeData,
      value: parseEther("1").toString(),
    };
    //@ts-ignore
    const txResponse = await walletClient?.sendTransaction(tx);
  };

  const handleMintToL2 = async () => {
    const mintData = writeContract({
      abi: L2NativeSuperchainERC20ABI,
      address: L2NativeSuperchainERC20Address,
      functionName: "mint",
      args: [connectedAddress, 1000],
      chainId: L2ChainA.id,
    });

    const tx = {
      from: connectedAddress,
      to: L2NativeSuperchainERC20Address,
      data: mintData,
    };

    //@ts-ignore
    const txResponse = await walletClient?.sendTransaction(tx);
  };

  const handleBridgeErc20ToL2 = async () => {
    const bridgeData = writeContract({
      abi: l2Erc20BridgeAbi,
      address: L2Erc20BridgeAddress,
      functionName: "sendERC20",
      args: [L2NativeSuperchainERC20Address, connectedAddress, 1000, 902],
      chainId: L2ChainA.id,
    });

    const tx = {
      from: connectedAddress,
      to: L2Erc20BridgeAddress,
      data: bridgeData,
    };

    //@ts-ignore
    const txResponse = await walletClient?.sendTransaction(tx);
  };

  const { data: l1Balance, isLoading: l1BalanceIsLoading } = useBalance({
    address: connectedAddress,
    chainId: L1Chain.id,
  });

  const { data: l2ChainABalance, isLoading: l2ChainABalanceIsLoading } = useBalance({
    address: connectedAddress,
    chainId: L2ChainA.id,
  });

  const { data: l2ChainBBalance, isLoading: l2ChainBBalanceIsLoading } = useBalance({
    address: connectedAddress,
    chainId: L2ChainB.id,
  });

  const { data: chainAErc20Balance, isLoading: chainAErc20IsLoading } = useReadContract({
    address: L2NativeSuperchainERC20Address,
    abi: L2NativeSuperchainERC20ABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    chainId: L2ChainA.id,
  });

  const { data: chainBErc20Balance, isLoading: chainBErc20IsLoading } = useReadContract({
    address: L2NativeSuperchainERC20Address,
    abi: L2NativeSuperchainERC20ABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    chainId: L2ChainB.id,
  });
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Supersim on Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
      </div>
      <button className="btn" onClick={handleBridgeETH}>
        Deposit ETH from the L1 into the L2
      </button>
      <button className="btn" onClick={handleMintToL2}>
        Mint ERC20 on L2 OP Chain A
      </button>
      <button className="btn" onClick={handleBridgeErc20ToL2}>
        Bridge ERC20 from OP Chain A to OP Chain B
      </button>
      <div>
        <h1>Account Balances</h1>
        Connected Address: <Address address={connectedAddress} />
        <div>
          <h2>L1 Balance:</h2>
          {l1BalanceIsLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="flex items-center">
              {l1Balance?.formatted} <span className="ml-1">{EthIcon}</span>
            </p>
          )}
        </div>
        <div>
          <h2>L2 OP Chain A Balance:</h2>
          {l2ChainABalanceIsLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="flex items-center">
              {l2ChainABalance?.formatted} <span className="ml-1">{EthIcon}</span>
            </p>
          )}
        </div>
        <div>
          <h2>L2 OP Chain B Balance:</h2>
          {l2ChainBBalanceIsLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="flex items-center">
              {l2ChainBBalance?.formatted} <span className="ml-1">{EthIcon}</span>
            </p>
          )}
        </div>
        <div>
          <h2>L2 Chain A Tokens:</h2>
          {chainAErc20IsLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="flex items-center">
              {Number(chainAErc20Balance)} <span className="ml-1">{OPIcon}</span>
            </p>
          )}
        </div>
        <div>
          <h2>L2 Chain B Tokens:</h2>
          {chainBErc20IsLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="flex items-center">
              {Number(chainBErc20Balance)} <span className="ml-1">{OPIcon}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Supersim;
