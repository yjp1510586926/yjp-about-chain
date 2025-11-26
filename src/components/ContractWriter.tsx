import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { INFO_CONTRACT_ABI, INFO_CONTRACT_ADDRESS } from '../config/contracts'

export function ContractWriter() {
  const { address, isConnected } = useAccount()
  const [name, setName] = useState('')
  const [data, setData] = useState('')
  const [error, setError] = useState('')

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !data) {
      setError('请填写所有字段')
      return
    }

    if (!isConnected) {
      setError('请先连接钱包')
      return
    }

    setError('')

    try {
      writeContract({
        address: INFO_CONTRACT_ADDRESS as `0x${string}`,
        abi: INFO_CONTRACT_ABI,
        functionName: 'storeInfo',
        args: [name, data],
      })
    } catch (err: any) {
      setError(err.message || '写入数据失败')
      console.error(err)
    }
  }

  const resetForm = () => {
    setName('')
    setData('')
    setError('')
  }

  return (
    <div className="glass-effect border border-slate-700 rounded-2xl p-6 mb-8 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-[fadeIn_0.5s_ease-in]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gradient">
          ✍️ 方式二: 通过智能合约写入数据 (Sepolia 测试网)
        </h2>
        <p className="text-slate-400 text-sm">
          将数据写入智能合约,通过事件日志记录,可使用 The Graph 索引 • 
          <a 
            href={`https://sepolia.etherscan.io/address/${INFO_CONTRACT_ADDRESS}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary hover:underline ml-1 transition-colors"
          >
            在 Etherscan 上查看合约 →
          </a>
        </p>
      </div>

      {INFO_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
        <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-500 mb-6 flex items-center gap-2">
          <span>⚠️</span>
          <span>请先部署智能合约并在 <code className="bg-yellow-500/20 px-2 py-0.5 rounded text-sm">src/config/contracts.ts</code> 中配置合约地址</span>
        </div>
      )}

      <div className="flex flex-col gap-2 p-4 bg-secondary/5 rounded-lg mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-400 font-medium">合约地址:</span>
          <code className="text-sm text-primary-light bg-slate-800 px-2 py-1 rounded font-mono">{INFO_CONTRACT_ADDRESS}</code>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-400 font-medium">当前账户:</span>
          <code className="text-sm text-primary-light bg-slate-800 px-2 py-1 rounded font-mono">{address || '未连接'}</code>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-6">
          <label className="block mb-2 text-slate-300 font-medium text-sm">数据名称:</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50"
            placeholder="例如: 用户信息"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isConnected}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-slate-300 font-medium text-sm">数据内容:</label>
          <textarea
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-y min-h-[100px] font-mono disabled:opacity-50"
            placeholder='例如: {"name": "张三", "age": 25}'
            value={data}
            onChange={(e) => setData(e.target.value)}
            rows={4}
            disabled={!isConnected}
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-6">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isConnected || isPending || isConfirming}
          className="w-full px-6 py-3 font-semibold text-white bg-gradient-primary rounded-lg shadow-md hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isPending || isConfirming ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : '📝'}
          {isPending ? '等待确认...' : isConfirming ? '交易确认中...' : '写入数据到链上'}
        </button>
      </form>

      {hash && (
        <div className="p-6 bg-gradient-to-br from-primary/10 to-green-500/10 border-2 border-primary rounded-2xl mb-6 animate-[slideIn_0.5s_ease]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl animate-bounce-slow">
              {isConfirming ? '⏳' : isConfirmed ? '✅' : '📤'}
            </span>
            <span className="text-lg font-semibold text-slate-100">
              {isConfirming ? '交易确认中...' : isConfirmed ? '交易成功!' : '交易已提交'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg mb-4 flex-wrap">
            <span className="text-sm text-slate-500">交易哈希:</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light hover:text-primary hover:underline transition-colors font-mono font-semibold"
            >
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </a>
          </div>
          {isConfirmed && (
            <button 
              onClick={resetForm} 
              className="px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-primary rounded-lg transition-all duration-300"
            >
              继续写入新数据
            </button>
          )}
        </div>
      )}

      <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-lg mb-6">
        <h4 className="text-primary-light font-semibold mb-2">💡 使用说明:</h4>
        <ul className="space-y-1 text-slate-400 text-sm">
          {[
            '需要先部署 InfoContract.sol 到测试网(如 Sepolia)',
            '部署后将合约地址配置到 src/config/contracts.ts',
            '连接钱包后即可写入数据到区块链',
            '每次写入会触发 InfoStored 事件,可被 The Graph 索引',
            '数据永久存储在区块链上,无法删除或修改'
          ].map((text, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary mt-0.5">→</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-accent/5 border-l-4 border-accent rounded-lg">
        <h4 className="text-accent font-semibold mb-2">📦 使用 Remix 部署合约:</h4>
        <ol className="pl-5 space-y-2 text-slate-400 text-sm list-decimal">
          <li className="pb-2">
            打开 <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary hover:underline transition-colors">Remix IDE</a>
          </li>
          <li className="pb-2">
            创建新文件 <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light text-xs">InfoContract.sol</code>,复制 <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light text-xs">contracts/InfoContract.sol</code> 的代码
          </li>
          <li className="pb-2">
            编译合约: 点击左侧 "Solidity Compiler" 图标,选择编译器版本 0.8.x,点击 "Compile"
          </li>
          <li className="pb-2">
            部署合约: 
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>点击左侧 "Deploy & Run Transactions" 图标</li>
              <li>Environment 选择 "Injected Provider - MetaMask"</li>
              <li>确保 MetaMask 已切换到 <strong className="text-primary-light">Sepolia 测试网</strong></li>
              <li>点击 "Deploy" 按钮并在 MetaMask 中确认交易</li>
            </ul>
          </li>
          <li className="pb-2">
            复制部署后的合约地址,粘贴到 <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light text-xs">src/config/contracts.ts</code> 中的 <code className="bg-slate-800 px-2 py-0.5 rounded text-primary-light text-xs">INFO_CONTRACT_ADDRESS</code>
          </li>
          <li className="pb-2">
            ✅ 完成!现在可以在页面上测试写入数据了
          </li>
        </ol>
      </div>
    </div>
  )
}
