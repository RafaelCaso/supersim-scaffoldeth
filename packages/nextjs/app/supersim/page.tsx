"use client";

import { NextPage } from "next";
import { formatEther, parseEther } from "viem";
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

  const l1StandardBridgeAddress = L1Chain.contracts.L1StandardBridgeProxy.address;

  const L2NativeSuperchainERC20Address = "0x420beeF000000000000000000000000000000001";

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
    console.log(txResponse);
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
    console.log(txResponse);
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

  return (
    <>
      <h1>Hello, world!</h1>
      <button className="btn" onClick={handleBridgeETH}>
        Deposit ETH from the L1 into the L2
      </button>
      <button className="btn" onClick={handleMintToL2}>
        Mint ERC20 on L2 OP Chain A
      </button>
      <div>
        <h1>Account Balances</h1>
        Connected Address: <Address address={connectedAddress} />
        <div>
          <h2>L1 Balance:</h2>
          {l1BalanceIsLoading ? (
            <p>Loading...</p>
          ) : (
            <p>
              {l1Balance?.formatted} {l1Balance?.symbol}
            </p>
          )}
        </div>
        <div>
          <h2>L2 OP Chain A Balance:</h2>
          {l2ChainABalanceIsLoading ? (
            <p>Loading...</p>
          ) : (
            <p>
              {l2ChainABalance?.formatted} {l2ChainABalance?.symbol}
            </p>
          )}
        </div>
        <div>
          <h2>L2 OP Chain B Balance:</h2>
          {l2ChainBBalanceIsLoading ? (
            <p>Loading...</p>
          ) : (
            <p>
              {l2ChainBBalance?.formatted} {l2ChainBBalance?.symbol}
            </p>
          )}
        </div>
        <div>
          <h2>L2 Chain A Tokens:</h2>
          {chainAErc20IsLoading ? <p>Loading...</p> : <p>{Number(chainAErc20Balance)}</p>}
        </div>
      </div>
    </>
  );
};

export default Supersim;
