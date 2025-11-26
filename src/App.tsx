import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { WalletConnect } from './components/WalletConnect'
import { EthersReader } from './components/EthersReader'
import { ContractWriter } from './components/ContractWriter'
import { GraphReader } from './components/GraphReader'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col">
          {/* 头部导航 */}
          <header className="glass-effect border-b border-slate-700 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="flex justify-between items-center py-4 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-4xl animate-[rotate_10s_linear_infinite]">⛓️</span>
                  <h1 className="text-2xl font-bold text-gradient">Web3 数据上链平台</h1>
                </div>
                <WalletConnect />
              </div>
            </div>
          </header>

          {/* 主要内容 */}
          <main className="flex-1 py-12">
            <div className="max-w-7xl mx-auto px-6 w-full">
              {/* 介绍区域 */}
              <section className="text-center mb-12 p-12 glass-effect border border-slate-700 rounded-3xl animate-[fadeIn_0.5s_ease-in]">
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent">
                  🚀 两种数据上链方式
                </h2>
                <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                  本平台演示了两种主流的区块链数据交互方式,帮助前端开发者快速掌握 Web3 开发技能
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: '📖',
                      title: '方式一: 读取链上数据',
                      desc: '使用 Ethers.js + Infura/Alchemy 读取以太坊链上的数据,包括余额、交易记录等'
                    },
                    {
                      icon: '✍️',
                      title: '方式二: 智能合约写入',
                      desc: '通过智能合约将数据写入区块链,使用 The Graph 进行数据索引和查询'
                    }
                  ].map((feature, idx) => (
                    <div 
                      key={idx}
                      className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-slate-700 rounded-2xl hover:-translate-y-2 hover:border-primary hover:shadow-lg hover:shadow-glow transition-all duration-300 text-left"
                    >
                      <div className="text-5xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-100">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 分隔线 */}
              <div className="relative text-center my-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <span className="relative px-6 bg-slate-900 text-primary-light font-semibold text-lg uppercase tracking-widest">
                  方式一: 直接读取链上数据
                </span>
              </div>

              {/* 方式一: Ethers.js 读取 */}
              <EthersReader />

              {/* 分隔线 */}
              <div className="relative text-center my-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <span className="relative px-6 bg-slate-900 text-primary-light font-semibold text-lg uppercase tracking-widest">
                  方式二: 智能合约数据上链
                </span>
              </div>

              {/* 方式二: 合约写入 */}
              <ContractWriter />

              {/* 方式二: The Graph 读取 */}
              <GraphReader />
            </div>
          </main>

          {/* 页脚 */}
          <footer className="glass-effect border-t border-slate-700 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <p className="text-center text-slate-400 mb-4">
                Built with ❤️ using Vite + React + TypeScript + Wagmi + TailwindCSS
              </p>
              <div className="flex justify-center gap-8 flex-wrap">
                {[
                  { text: 'Ethers.js 文档', url: 'https://docs.ethers.org/' },
                  { text: 'Wagmi 文档', url: 'https://wagmi.sh/' },
                  { text: 'The Graph 文档', url: 'https://thegraph.com/docs/' }
                ].map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light hover:text-primary hover:underline transition-colors text-sm"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
