/*
 * @Description:
 * @Autor: yjp
 * @Date: 2025-11-26 15:29:06
 * @LastEditors: yjp
 * @LastEditTime: 2025-11-26 17:35:42
 * @FilePath: /yjp-about-chain/src/config/wagmi.ts
 */
import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// WalletConnect 项目 ID (你需要在 https://cloud.walletconnect.com/ 注册获取)
const projectId = "6b34a0eff998c7a65907ef58454314d0";

export const config = createConfig({
  chains: [sepolia], // 使用 Sepolia 测试网,避免误操作真实资产
  connectors: [
    injected(), // 支持所有浏览器钱包(MetaMask、Coinbase Wallet、Brave Wallet 等)
    walletConnect({ projectId }), // 支持移动端钱包(通过扫码连接)
  ],
  transports: {
    [sepolia.id]: http(),
  },
});
