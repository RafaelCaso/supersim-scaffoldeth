"use client";

import { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useWriteContract } from "wagmi";
import { L1Chain } from "~~/scaffold.config";

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
  const l1StandardBridgeAddress = L1Chain.contracts.L1StandardBridgeProxy.address;

  const { address: connectedAddress } = useAccount();

  const { writeContract } = useWriteContract();

  const handleBridgeETH = async () => {
    const data = writeContract({
      abi: bridgeETHABI,
      address: l1StandardBridgeAddress,
      functionName: "bridgeETH",
      args: [50000, "0x"],
      value: parseEther("1"),
    });

    console.log(data);
    const tx = {
      from: connectedAddress,
      to: l1StandardBridgeAddress,
      data: data,
      value: parseEther("1").toString(),
    };
    //@ts-ignore
    const txResponse = await walletClient?.sendTransaction(tx);
    console.log(txResponse);
  };

  return (
    <>
      <h1>Hello, world!</h1>
      <button onClick={handleBridgeETH}>Send to L2</button>
    </>
  );
};

export default Supersim;
