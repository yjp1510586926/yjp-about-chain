import { useState } from 'react'

interface InfoEvent {
  id: string
  sender: string
  name: string
  data: string
  timestamp: string
  blockNumber: string
}

export function GraphReader() {
  const [events, setEvents] = useState<InfoEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // The Graph 子图 URL - 部署后替换为你的实际 URL
  // 格式: https://api.studio.thegraph.com/query/<YOUR_ID>/<SUBGRAPH_NAME>/version/latest
  const SUBGRAPH_URL = import.meta.env.VITE_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/<SUBGRAPH_ID>/<SUBGRAPH_NAME>/version/latest'

  const fetchFromGraph = async () => {
    setLoading(true)
    setError('')

    try {
      const query = `
        {
          infoStoreds(first: 10, orderBy: timestamp, orderDirection: desc) {
            id
            sender
            name
            data
            timestamp
            blockNumber
          }
        }
      `

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      setEvents(result.data.infoStoreds || [])
    } catch (err: any) {
      setError(err.message || '从 The Graph 读取数据失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleString('zh-CN')
  }

  return (
    <div className="glass-effect border border-slate-700 rounded-2xl p-6 mb-8 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-[fadeIn_0.5s_ease-in]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gradient">
          📊 方式二: 使用 The Graph 读取数据
        </h2>
        <p className="text-slate-400 text-sm">
          通过 The Graph 索引的事件日志读取链上数据
        </p>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-secondary/5 rounded-lg mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-400 font-medium">子图 URL:</span>
          <code className="text-sm text-primary-light bg-slate-800 px-2 py-1 rounded font-mono break-all">{SUBGRAPH_URL}</code>
        </div>
      </div>

      {SUBGRAPH_URL.includes('<SUBGRAPH_ID>') && (
        <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-500 mb-6">
          ⚠️ 请先创建 The Graph 子图并配置 URL
        </div>
      )}

      <button
        onClick={fetchFromGraph}
        disabled={loading}
        className="w-full px-6 py-3 font-semibold text-white bg-gradient-primary rounded-lg shadow-md hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
      >
        {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : '🔍'}
        从 The Graph 读取数据
      </button>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-6">
          ❌ {error}
        </div>
      )}

      {events.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-slate-100">链上数据记录 ({events.length} 条)</h3>
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
            {events.map((event) => (
              <div key={event.id} className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-primary hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700 flex-wrap gap-2">
                  <span className="text-lg font-semibold text-primary-light">{event.name}</span>
                  <span className="text-sm text-slate-500">{formatTimestamp(event.timestamp)}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg mb-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-all">{event.data}</pre>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-[80px]">发送者:</span>
                    <code className="text-slate-300 font-mono">{formatAddress(event.sender)}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-[80px]">区块:</span>
                    <span className="text-slate-300">#{event.blockNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 min-w-[80px]">事件 ID:</span>
                    <code className="text-slate-300 font-mono text-xs">{event.id.slice(0, 20)}...</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-lg mb-6">
        <h4 className="text-primary-light font-semibold mb-3">💡 The Graph 部署步骤:</h4>
        <ol className="pl-5 space-y-3 text-slate-400 text-sm list-decimal">
          <li className="pb-2">
            <div className="mb-1">
              访问{' '}
              <a 
                href="https://thegraph.com/studio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-light hover:text-primary hover:underline transition-colors font-semibold"
              >
                The Graph Studio
              </a>
              {' '}并创建新的子图项目
            </div>
          </li>
          <li className="pb-2">
            <div className="mb-1">安装 Graph CLI 并认证:</div>
            <code className="block mt-1 bg-slate-800 px-3 py-2 rounded text-primary-light text-xs">
              npm install -g @graphprotocol/graph-cli<br/>
              graph auth --studio &lt;YOUR_DEPLOY_KEY&gt;
            </code>
          </li>
          <li className="pb-2">
            <div className="mb-1">在 <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light text-xs">subgraph/subgraph.yaml</code> 中配置:</div>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
              <li>合约地址 (address)</li>
              <li>起始区块号 (startBlock) - 可在 Sepolia Etherscan 查看</li>
            </ul>
          </li>
          <li className="pb-2">
            <div className="mb-1">生成代码并部署:</div>
            <code className="block mt-1 bg-slate-800 px-3 py-2 rounded text-primary-light text-xs">
              cd subgraph<br/>
              graph codegen<br/>
              graph build<br/>
              graph deploy --studio &lt;YOUR_SUBGRAPH_SLUG&gt;
            </code>
          </li>
          <li className="pb-2">
            <div className="mb-1">获取子图 URL 并配置:</div>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
              <li>复制 The Graph Studio 中的查询 URL</li>
              <li>在项目根目录创建 <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light">.env</code> 文件</li>
              <li>添加: <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light">VITE_SUBGRAPH_URL=你的URL</code></li>
            </ul>
          </li>
          <li className="pb-2">
            <div className="text-green-500">✅ 完成!刷新页面即可使用 The Graph 查询数据</div>
          </li>
        </ol>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500 rounded-lg">
          <div className="text-blue-400 text-xs">
            📖 详细部署指南请查看:{' '}
            <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light">subgraph/README.md</code>
          </div>
        </div>
      </div>

      <div className="p-4 bg-secondary/5 border-l-4 border-secondary rounded-lg mb-6">
        <h4 className="text-secondary font-semibold mb-2">📝 Schema 示例:</h4>
        <pre className="p-4 bg-slate-900 rounded-lg overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
{`type InfoStored @entity {
  id: ID!
  sender: Bytes!
  name: String!
  data: String!
  timestamp: BigInt!
  blockNumber: BigInt!
}`}
        </pre>
      </div>

      <div className="p-4 bg-secondary/5 border-l-4 border-secondary rounded-lg">
        <h4 className="text-secondary font-semibold mb-2">🔍 GraphQL 查询示例:</h4>
        <pre className="p-4 bg-slate-900 rounded-lg overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
{`{
  infoStoreds(
    first: 10,
    orderBy: timestamp,
    orderDirection: desc
  ) {
    id
    sender
    name
    data
    timestamp
    blockNumber
  }
}`}
        </pre>
      </div>
    </div>
  )
}
