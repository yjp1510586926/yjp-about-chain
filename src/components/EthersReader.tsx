import { useState } from 'react'
import { ethers } from 'ethers'

export function EthersReader() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [blockNumber, setBlockNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sepolia 测试网 RPC URL
  const INFURA_URL = 'https://sepolia.infura.io/v3/bb5ee58d9b444e87b8210309985f7a3e'

  const readChainData = async () => {
    if (!address) {
      setError('请输入地址')
      return
    }

    setLoading(true)
    setError('')

    try {
      const provider = new ethers.JsonRpcProvider(INFURA_URL)
      const balanceWei = await provider.getBalance(address)
      const balanceEth = ethers.formatEther(balanceWei)
      setBalance(balanceEth)

      const currentBlock = await provider.getBlockNumber()
      setBlockNumber(currentBlock.toString())
    } catch (err: any) {
      setError(err.message || '读取数据失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionHistory = async () => {
    if (!address) {
      setError('请输入地址')
      return
    }

    setLoading(true)
    setError('')

    try {
      const provider = new ethers.JsonRpcProvider(INFURA_URL)
      const currentBlock = await provider.getBlockNumber()
      const fromBlock = currentBlock - 10000
      const toBlock = currentBlock

      console.log(`正在查询区块 ${fromBlock} 到 ${toBlock} 的交易记录...`)
      
      const filter = { fromBlock, toBlock, address: address }
      const logs = await provider.getLogs(filter)
      console.log('找到的交易记录:', logs)
      alert(`找到 ${logs.length} 条交易记录,请查看控制台`)
    } catch (err: any) {
      setError(err.message || '获取交易历史失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-effect border border-slate-700 rounded-2xl p-6 mb-8 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-[fadeIn_0.5s_ease-in]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gradient">
          📖 方式一: 使用 Ethers.js 读取链上数据 (Sepolia 测试网)
        </h2>
        <p className="text-slate-400 text-sm">
          通过 Infura 提供的 RPC 节点读取 Sepolia 测试网数据 • 
          <a 
            href="https://sepolia.etherscan.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary hover:underline ml-1 transition-colors"
          >
            在 Etherscan 上查看 →
          </a>
        </p>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-slate-300 font-medium text-sm">以太坊地址:</label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={readChainData}
          disabled={loading}
          className="flex-1 min-w-[200px] px-6 py-3 font-semibold text-white bg-gradient-primary rounded-lg shadow-md hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : '📊'}
          读取余额和区块信息
        </button>
        <button
          onClick={getTransactionHistory}
          disabled={loading}
          className="flex-1 min-w-[200px] px-6 py-3 font-semibold bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-primary rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : '📜'}
          获取交易历史
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-6 animate-[shake_0.5s_ease]">
          ❌ {error}
        </div>
      )}

      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: '账户余额', value: `${balance} ETH` },
            { label: '当前区块', value: `#${blockNumber}` },
            { label: '数据来源', value: 'Infura (Sepolia)' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border border-slate-700 rounded-lg hover:-translate-y-1 hover:border-primary hover:shadow-glow transition-all duration-300">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
              <div className="text-xl font-bold text-slate-100 break-all">{item.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-lg">
        <h4 className="text-primary-light font-semibold mb-2">💡 使用说明:</h4>
        <ul className="space-y-1 text-slate-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">→</span>
            <span>当前使用 <strong className="text-primary-light">Sepolia 测试网</strong>,无需真实 ETH</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">→</span>
            <span>数据来源: <strong className="text-primary-light">Infura RPC 节点</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">→</span>
            <span>获取测试 ETH: <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary hover:underline transition-colors">Sepolia Faucet</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">→</span>
            <span>测试地址示例: <code className="px-1.5 py-0.5 bg-slate-800 rounded text-primary-light text-xs">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</code></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">→</span>
            <span>Infura 注册地址: <a href="https://www.infura.io/zh" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary hover:underline transition-colors">https://www.infura.io/zh</a></span>
          </li>
        </ul>
      </div>
    </div>
  )
}
