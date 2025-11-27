/*
 * @Description:
 * @Autor: yjp
 * @Date: 2025-11-26 15:29:28
 * @LastEditors: yjp
 * @LastEditTime: 2025-11-27 10:17:03
 * @FilePath: /yjp-about-chain/src/config/contracts.ts
 */

// 数据存储合约 ABI
export const INFO_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_data", type: "string" },
    ],
    name: "storeInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "infos",
    outputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "data", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInfoCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "data", type: "string" },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "InfoStored",
    type: "event",
  },
] as const;

// 你部署的数据存储合约地址 (部署后填入)
export const INFO_CONTRACT_ADDRESS: string =
  "0xF7E9260E03ca2ff3f20307e8CfbA480ad1AD6175"; // 最新部署的合约地址
