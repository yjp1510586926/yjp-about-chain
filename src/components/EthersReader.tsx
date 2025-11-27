import { useState } from 'react'
import { ethers } from 'ethers'

export function EthersReader() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [blockNumber, setBlockNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [txDetail, setTxDetail] = useState<any>(null)

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

  const getTransactionDetail = async () => {
    if (!txHash) {
      setError('请输入交易哈希')
      return
    }

    // 验证交易哈希格式（必须是 0x 开头的 66 个字符）
    if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
      setError('交易哈希格式不正确！交易哈希应该是 66 个字符（0x + 64位十六进制）。提示：请先点击"查询交易记录"获取交易列表。')
      return
    }

    setLoading(true)
    setError('')
    setTxDetail(null)

    try {
      const provider = new ethers.JsonRpcProvider(INFURA_URL)
      
      console.log('正在查询交易:', txHash)
      
      // 获取交易详情
      const tx = await provider.getTransaction(txHash)
      
      if (!tx) {
        setError('未找到该交易，请检查交易哈希是否正确')
        return
      }

      // 获取交易收据（包含状态）
      const receipt = await provider.getTransactionReceipt(txHash)
      
      // 获取区块信息（用于获取时间戳）
      const block = tx.blockNumber ? await provider.getBlock(tx.blockNumber) : null
      
      const detail = {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || '合约创建',
        value: ethers.formatEther(tx.value),
        blockNumber: tx.blockNumber || '待确认',
        data: tx.data,
        gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : '0',
        gasLimit: tx.gasLimit.toString(),
        nonce: tx.nonce,
        status: receipt ? (receipt.status === 1 ? '成功' : '失败') : '待确认',
        timestamp: block?.timestamp ? new Date(block.timestamp * 1000).toLocaleString('zh-CN') : '待确认',
      }
      
      console.log('交易详情:', detail)
      setTxDetail(detail)
    } catch (err: any) {
      setError(err.message || '获取交易详情失败')
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

      <div className="mb-6">
        <button
          onClick={readChainData}
          disabled={loading}
          className="w-full px-6 py-3 font-semibold text-white bg-gradient-primary rounded-lg shadow-md hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : '📊'}
          读取余额和区块信息
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

      {/* 交易查询部分 */}
      <div className="mt-8 pt-8 border-t border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-gradient">🔍 查询交易详情</h3>
        <div className="mb-4">
          <label className="block mb-2 text-slate-300 font-medium text-sm">交易哈希 (Transaction Hash):</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300"
            placeholder="0x..."
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
          />
        </div>
        <button
          onClick={getTransactionDetail}
          disabled={loading}
          className="w-full px-6 py-3 font-semibold bg-gradient-secondary rounded-lg shadow-md hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : '🔎'}
          查询交易
        </button>
      </div>


      {/* 交易详情显示 */}
      {txDetail && (
        <div className="mt-6 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>📋 交易详情</span>
            <span className={`px-2 py-1 rounded text-xs ${txDetail.status === '成功' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {txDetail.status}
            </span>
          </h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-slate-500 min-w-[100px]">交易哈希:</span>
              <a 
                href={`https://sepolia.etherscan.io/tx/${txDetail.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-light hover:text-primary hover:underline break-all flex-1"
              >
                {txDetail.hash}
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500">发送方:</span>
                <div className="text-slate-300 break-all text-xs mt-1">{txDetail.from}</div>
              </div>
              <div>
                <span className="text-slate-500">接收方:</span>
                <div className="text-slate-300 break-all text-xs mt-1">{txDetail.to}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500">金额:</span>
                <div className="text-green-400 font-semibold mt-1">{txDetail.value} ETH</div>
              </div>
              <div>
                <span className="text-slate-500">区块号:</span>
                <div className="text-slate-300 mt-1">#{txDetail.blockNumber}</div>
              </div>
              <div>
                <span className="text-slate-500">Gas 价格:</span>
                <div className="text-slate-300 mt-1">{txDetail.gasPrice} Gwei</div>
              </div>
              <div>
                <span className="text-slate-500">Gas 限制:</span>
                <div className="text-slate-300 mt-1">{txDetail.gasLimit}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500">Nonce:</span>
                <span className="text-slate-300 ml-2">{txDetail.nonce}</span>
              </div>
              <div>
                <span className="text-slate-500">交易时间:</span>
                <span className="text-slate-300 ml-2">{txDetail.timestamp}</span>
              </div>
            </div>
            
            {/* 十六进制数据 - 重点展示 */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-slate-200 font-semibold mb-2 flex items-center gap-2">
                <span>📊 交易数据 (十六进制)</span>
                {txDetail.data === '0x' && <span className="text-xs text-slate-500">(无数据 - 普通转账)</span>}
              </div>
              <div className="bg-slate-900 p-4 rounded border border-slate-700 overflow-x-auto">
                <code className="text-xs text-green-400 font-mono break-all whitespace-pre-wrap">
                  {txDetail.data}
                </code>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                数据长度: {txDetail.data.length} 字符 ({Math.floor((txDetail.data.length - 2) / 2)} 字节)
              </div>
              
              {/* 数据解析 */}
              {txDetail.data && txDetail.data !== '0x' && txDetail.data.length > 2 && (
                <div className="mt-4 p-4 bg-slate-800/50 border border-slate-600 rounded-lg">
                  <div className="text-slate-200 font-semibold mb-3">🔍 UTF-8 解析</div>
                  
                  {(() => {
                    try {
                      // 使用完整的 data 字段（去掉 0x）
                      const hexData = txDetail.data.replace(/^0x/, '')
                      if (hexData && hexData.length % 2 === 0) {
                        const bytes = new Uint8Array(
                          hexData.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16))
                        )
                        const decoder = new TextDecoder('utf-8', { fatal: false })
                        const text = decoder.decode(bytes)
                        // 只显示可打印字符
                        const printable = text.replace(/[^\x20-\x7E\u4e00-\u9fa5]/g, '')
                        if (printable) {
                          return (
                            <div className="bg-slate-900 px-4 py-3 rounded border border-slate-700">
                              <div className="text-green-400 text-lg font-semibold mb-2">"{printable}"</div>
                              <div className="text-xs text-slate-500">
                                原始数据: {txDetail.data}
                              </div>
                            </div>
                          )
                        }
                      }
                    } catch (e) {
                      // 解析失败
                    }
                    return <div className="text-slate-600 text-sm">无法解析为有效的 UTF-8 文本</div>
                  })()}
                </div>
              )}
            </div>
          </div>
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
