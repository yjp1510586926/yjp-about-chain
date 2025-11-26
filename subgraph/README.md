# The Graph 子图部署指南

本指南将帮助你部署 InfoContract 的 The Graph 子图,用于索引和查询链上数据。

## 📋 前提条件

1. 已部署 InfoContract 智能合约到 Sepolia 测试网
2. 安装 Node.js (v16 或更高版本)
3. 安装 Graph CLI: `npm install -g @graphprotocol/graph-cli`
4. 注册 The Graph Studio 账号: https://thegraph.com/studio/

## 🚀 部署步骤

### 1. 初始化子图项目

在 The Graph Studio 创建新的子图项目:

1. 访问 https://thegraph.com/studio/
2. 点击 "Create a Subgraph"
3. 输入子图名称,例如: `info-contract-sepolia`
4. 选择网络: `Sepolia`
5. 记录下你的 **Deploy Key** 和 **Subgraph Slug**

### 2. 认证

```bash
graph auth --studio <YOUR_DEPLOY_KEY>
```

### 3. 更新配置

确保 `subgraph.yaml` 中的配置正确:

- `address`: 你部署的 InfoContract 合约地址
- `startBlock`: 合约部署的区块号(可在 Sepolia Etherscan 查看)

### 4. 生成代码

```bash
cd subgraph
graph codegen
```

这会根据 ABI 和 schema 生成 TypeScript 类型定义。

### 5. 构建子图

```bash
graph build
```

### 6. 部署到 The Graph Studio

```bash
graph deploy --studio <YOUR_SUBGRAPH_SLUG>
```

例如:

```bash
graph deploy --studio info-contract-sepolia
```

### 7. 发布子图

部署成功后,在 The Graph Studio 中:

1. 测试你的子图查询
2. 点击 "Publish" 发布到去中心化网络(可选)

## 📊 测试查询

部署成功后,你会获得一个查询 URL,类似:

```
https://api.studio.thegraph.com/query/<YOUR_ID>/<SUBGRAPH_NAME>/version/latest
```

### 示例查询

```graphql
{
  infoStoreds(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    sender
    name
    data
    timestamp
    blockNumber
    transactionHash
  }
}
```

## 🔧 更新前端配置

将获得的子图 URL 更新到 `src/components/GraphReader.tsx`:

```typescript
const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/<YOUR_ID>/<SUBGRAPH_NAME>/version/latest";
```

## 📝 常见问题

### 1. 部署失败

- 检查 Graph CLI 版本: `graph --version`
- 确保已正确认证: `graph auth --studio <DEPLOY_KEY>`
- 检查网络连接

### 2. 查询没有数据

- 确保合约地址正确
- 确保 startBlock 不晚于合约部署区块
- 等待子图同步(可能需要几分钟)
- 检查合约是否有 InfoStored 事件被触发

### 3. 更新子图

如果修改了 schema 或 mapping:

```bash
cd subgraph
graph codegen
graph build
graph deploy --studio <YOUR_SUBGRAPH_SLUG>
```

## 📚 相关资源

- [The Graph 文档](https://thegraph.com/docs/)
- [AssemblyScript 文档](https://www.assemblyscript.org/)
- [GraphQL 查询语法](https://graphql.org/learn/queries/)

## 💡 提示

1. **开发环境**: 可以使用 Graph Node 本地运行子图进行开发测试
2. **查询优化**: 使用 `first`、`skip` 参数进行分页
3. **索引速度**: startBlock 设置得越接近合约部署区块,同步越快
4. **成本**: The Graph Studio 提供免费的开发和测试配额
