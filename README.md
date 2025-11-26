# Web3 数据上链平台

一个完整的 Web3 应用,演示两种主流的区块链数据交互方式。

## 🚀 功能特性

### 方式一: 直接读取链上数据

#### 使用 Ethers.js 读取链上数据

- ✅ 通过 Infura/Alchemy 读取以太坊主网数据
- ✅ 查询账户余额
- ✅ 获取当前区块号
- ✅ 查询交易历史

### 方式二: 智能合约数据上链

#### 1. 通过智能合约写入数据

- ✅ 部署数据存储合约到 Sepolia 测试网
- ✅ 使用 Wagmi 连接钱包(支持浏览器钱包和移动端钱包)
- ✅ 写入数据到区块链
- ✅ 通过事件日志记录数据

#### 2. 使用 The Graph 读取数据

- ✅ 创建子图索引合约事件
- ✅ 使用 GraphQL 查询数据
- ✅ 显示链上数据记录

## 📦 技术栈

- **前端框架**: React + TypeScript + Vite
- **Web3 库**:
  - Wagmi v2 (钱包连接和合约交互)
  - Ethers.js v6 (链上数据读取)
  - Viem (底层 Web3 工具)
- **数据查询**: The Graph (事件索引)
- **RPC 节点**: Infura / Alchemy
- **样式**: TailwindCSS (深色主题 + 玻璃态效果)

## 🛠️ 安装和运行

### 1. 克隆项目

\`\`\`bash
git clone <repository-url>
cd yjp-about-chain
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 3. 配置环境变量

复制 `.env.example` 为 `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 `.env` 文件,配置以下内容:

\`\`\`env

# The Graph 子图 URL (部署子图后填入)

VITE_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<YOUR_ID>/<SUBGRAPH_NAME>/version/latest
\`\`\`

### 4. 配置 API Keys

在 `src/components/EthersReader.tsx` 中配置 Infura 或 Alchemy API Key:

\`\`\`typescript
const INFURA_URL = 'https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY'
const ALCHEMY_URL = 'https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY'
\`\`\`

**获取 API Key:**

- Infura: https://www.infura.io/zh
- Alchemy: https://www.alchemy.com

### 5. 配置 WalletConnect

在 `src/config/wagmi.ts` 中已配置 WalletConnect Project ID。

如需更换,访问 https://cloud.walletconnect.com/ 获取新的 Project ID。

### 6. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

## 📝 部署智能合约

### 1. 安装 Hardhat

\`\`\`bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
\`\`\`

### 2. 配置 Hardhat

在 `hardhat.config.js` 中配置 Sepolia 测试网:

\`\`\`javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
solidity: "0.8.0",
networks: {
sepolia: {
url: "https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY",
accounts: ["YOUR_PRIVATE_KEY"]
}
}
};
\`\`\`

### 3. 部署合约

\`\`\`bash

# 复制合约文件

cp contracts/InfoContract.sol hardhat-project/contracts/

# 创建部署脚本

# 在 hardhat-project/scripts/deploy.js 中:

async function main() {
const InfoContract = await ethers.getContractFactory("InfoContract");
const contract = await InfoContract.deploy();
await contract.deployed();
console.log("InfoContract deployed to:", contract.address);
}

main();

# 部署到 Sepolia

npx hardhat run scripts/deploy.js --network sepolia
\`\`\`

### 4. 配置合约地址

将部署的合约地址填入 `src/config/contracts.ts`:

\`\`\`typescript
export const INFO_CONTRACT_ADDRESS = '0xYourContractAddress'
\`\`\`

## 🔍 配置 The Graph

The Graph 用于索引智能合约事件,提供高效的数据查询能力。

### 快速开始

详细的部署指南请查看: **`subgraph/README.md`**

### 简要步骤

1. **安装 Graph CLI**

\`\`\`bash
npm install -g @graphprotocol/graph-cli
\`\`\`

2. **创建子图项目**

访问 [The Graph Studio](https://thegraph.com/studio/) 创建新的子图项目。

3. **认证**

\`\`\`bash
graph auth --studio <YOUR_DEPLOY_KEY>
\`\`\`

4. **配置子图**

编辑 `subgraph/subgraph.yaml`,确保以下配置正确:

- `address`: 你部署的 InfoContract 合约地址
- `startBlock`: 合约部署的区块号(可在 Sepolia Etherscan 查看)

5. **部署子图**

\`\`\`bash
cd subgraph
npm install
npm run codegen
npm run build
graph deploy --studio <YOUR_SUBGRAPH_SLUG>
\`\`\`

6. **配置前端**

将获得的子图 URL 添加到 `.env` 文件:

\`\`\`env
VITE_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<YOUR_ID>/<SUBGRAPH_NAME>/version/latest
\`\`\`

### 子图文件说明

项目已包含完整的子图配置:

- `subgraph/schema.graphql` - 数据模型定义
- `subgraph/subgraph.yaml` - 子图配置文件
- `subgraph/src/mapping.ts` - 事件处理逻辑
- `subgraph/abis/InfoContract.json` - 合约 ABI
- `subgraph/package.json` - 依赖和脚本
- `subgraph/README.md` - 详细部署指南

## 🎨 功能演示

### 方式一: 读取链上数据

1. **读取余额和区块信息**

   - 输入任意以太坊地址
   - 选择 Infura 或 Alchemy 作为 RPC 提供商
   - 点击"读取余额和区块信息"
   - 查看账户余额、区块号等信息
   - 点击"查询交易历史"查看最近的交易记录

### 方式二: 智能合约数据上链

1. **连接钱包**

   - 点击页面右上角的连接按钮
   - 选择"浏览器钱包"(MetaMask 等)或"移动端钱包"(扫码连接)
   - 确保钱包已切换到 Sepolia 测试网

2. **写入数据到链上**

   - 在"数据名称"输入框中输入数据标题,例如: `用户信息`
   - 在"数据内容"输入框中输入 JSON 数据,例如: `{"name": "张三", "age": 25}`
   - 点击"写入数据到链上"按钮
   - 在钱包中确认交易
   - 等待交易确认,查看交易哈希和状态

3. **使用 The Graph 读取数据**

   - 确保已部署 The Graph 子图(参考上面的配置步骤)
   - 点击"从 The Graph 读取数据"按钮
   - 查看所有通过智能合约写入的链上记录
   - 数据按时间倒序排列,显示发送者、数据内容、区块号等信息

## 📚 学习资源

- [Ethers.js 文档](https://docs.ethers.org/)
- [Wagmi 文档](https://wagmi.sh/)
- [The Graph 文档](https://thegraph.com/docs/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [Hardhat 文档](https://hardhat.org/docs)

## 🔐 安全提示

⚠️ **重要**:

- 不要在代码中硬编码私钥
- 使用环境变量存储敏感信息
- 测试网和主网要分开配置
- 部署前务必审计智能合约

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!
