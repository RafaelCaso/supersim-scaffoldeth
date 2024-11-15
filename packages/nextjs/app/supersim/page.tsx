"use client";

import { L2NativeSuperchainERC20ABI, bridgeETHABI, l2Erc20BridgeAbi } from "./_assets/abi";
import { EthIcon, OPIcon } from "./_assets/icons";
import { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount, useBalance, useReadContract, useWalletClient } from "wagmi";
import { useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { L1Chain, L2ChainA, L2ChainB } from "~~/scaffold.config";

const Supersim: NextPage = () => {
  const { data: walletClient } = useWalletClient();

  const l1StandardBridgeAddress = L1Chain.contracts.L1StandardBridgeProxy.address;

  const L2NativeSuperchainERC20Address = "0x420beeF000000000000000000000000000000001";

  const L2Erc20BridgeAddress = "0x4200000000000000000000000000000000000028";

  const { address: connectedAddress } = useAccount();

  const { writeContract } = useWriteContract();

  const handleBridgeETH = async () => {
    //ABI-encoding for transaction data
    const bridgeData = writeContract({
      abi: bridgeETHABI,
      address: l1StandardBridgeAddress,
      functionName: "bridgeETH",
      args: [50000, "0x"],
      value: parseEther("1"),
    });

    // manually create transaction data
    const tx = {
      from: connectedAddress,
      to: l1StandardBridgeAddress,
      data: bridgeData,
      value: parseEther("1").toString(),
    };
    // wallet client sends raw transaction data and handles signing and broadcasting transaction
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
      {/* Header Section */}
      <div className="flex flex-col items-center pt-10">
        <div className="px-5 text-center">
          <h1>
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Supersim on Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center mt-4">
            <p className="my-2 font-medium mr-2">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-wrap justify-center items-center mt-6 space-x-4 space-y-2 sm:space-y-0">
        <button
          className="btn px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md transition"
          onClick={handleBridgeETH}
        >
          Deposit ETH from L1 to L2
        </button>
        <button
          className="btn px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-md transition"
          onClick={handleMintToL2}
        >
          Mint ERC20 on L2 OP Chain A
        </button>
        <button
          className="btn px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 shadow-md transition"
          onClick={handleBridgeErc20ToL2}
        >
          Bridge ERC20 from OP Chain A to OP Chain B
        </button>
      </div>

      {/* Account Balances */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-semibold text-center mb-6">Account Balances</h1>

        {/* Row 1: L1 Balance */}
        <div className="flex justify-center items-center mb-6 bg-gray-100 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-medium mr-4">L1 Balance:</h2>
          {l1BalanceIsLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="flex items-center text-lg font-semibold">
              {l1Balance?.formatted} <span className="ml-2">{EthIcon}</span>
            </p>
          )}
        </div>

        {/* Row 2: L2 ETH Balances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-medium">L2 OP Chain A Balance:</h2>
            {l2ChainABalanceIsLoading ? (
              <p>Loading...</p>
            ) : (
              <p className="flex items-center text-lg font-semibold">
                {l2ChainABalance?.formatted} <span className="ml-2">{EthIcon}</span>
              </p>
            )}
          </div>
          <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-medium">L2 OP Chain B Balance:</h2>
            {l2ChainBBalanceIsLoading ? (
              <p>Loading...</p>
            ) : (
              <p className="flex items-center text-lg font-semibold">
                {l2ChainBBalance?.formatted} <span className="ml-2">{EthIcon}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 3: L2 Token Balances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-medium">L2 Chain A Tokens:</h2>
            {chainAErc20IsLoading ? (
              <p>Loading...</p>
            ) : (
              <p className="flex items-center text-lg font-semibold">
                {Number(chainAErc20Balance)} <span className="ml-2">{OPIcon}</span>
              </p>
            )}
          </div>
          <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-medium">L2 Chain B Tokens:</h2>
            {chainBErc20IsLoading ? (
              <p>Loading...</p>
            ) : (
              <p className="flex items-center text-lg font-semibold">
                {Number(chainBErc20Balance)} <span className="ml-2">{OPIcon}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Supersim;
