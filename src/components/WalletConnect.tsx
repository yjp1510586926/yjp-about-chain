import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getConnectorInfo = (connectorId: string) => {
    switch (connectorId) {
      case 'injected':
        return { name: '浏览器钱包', icon: '🦊', description: 'MetaMask、Coinbase 等' }
      case 'walletConnect':
        return { name: '移动端钱包', icon: '📱', description: '扫码连接' }
      default:
        return { name: connectorId, icon: '👛', description: '' }
    }
  }

  const handleConnect = (connector: typeof connectors[0]) => {
    // 如果已经在连接中,不执行操作
    if (isPending) return
    
    connect({ connector }, {
      onError: (error) => {
        // 忽略重复请求错误
        if (error.message.includes('already pending')) {
          console.log('连接请求正在处理中,请稍候...')
        }
      }
    })
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 glass-effect border border-slate-700 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="text-xl animate-pulse-slow">🔗</div>
          <span className="font-mono font-semibold text-primary-light text-sm tracking-wide">
            {formatAddress(address)}
          </span>
        </div>
        <button 
          onClick={() => disconnect()} 
          className="px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-primary rounded-lg transition-all duration-300"
        >
          断开连接
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap">
        {connectors.slice(0, 2).map((connector) => {
          const info = getConnectorInfo(connector.id)
          return (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              className={`relative px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-300 overflow-hidden group ${
                isPending 
                  ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-primary hover:shadow-lg hover:shadow-glow hover:-translate-y-0.5'
              }`}
            >
              <span className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-[3] transition-transform duration-600"></span>
              <span className="relative flex flex-col items-center gap-1">
                {isPending ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span className="text-sm">连接中...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">{info.icon}</span>
                    <span>{info.name}</span>
                    {info.description && (
                      <span className="text-xs text-slate-300 opacity-80">{info.description}</span>
                    )}
                  </>
                )}
              </span>
            </button>
          )
        })}
      </div>
      {error && !error.message.includes('already pending') && (
        <div className="text-red-400 text-sm px-2">
          ⚠️ {error.message}
        </div>
      )}
    </div>
  )
}
