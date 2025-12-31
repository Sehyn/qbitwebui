import type { ReactNode } from 'react'
import { StatusBar } from './StatusBar'

declare const __APP_VERSION__: string

interface Props {
	children: ReactNode
}

export function Layout({ children }: Props) {
	return (
		<div className="flex flex-col h-screen bg-[#07070a] scanlines">
			<header className="relative flex items-center justify-between px-6 py-4 bg-[#0d0d12]/80 backdrop-blur-md border-b border-white/[0.06]">
				<div className="absolute inset-0 bg-gradient-to-r from-[#00d4aa]/[0.02] via-transparent to-[#8b5cf6]/[0.02]" />
				<div className="relative flex items-center gap-3">
					<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#00a884] flex items-center justify-center shadow-lg shadow-[#00d4aa]/20">
						<svg className="w-4 h-4 text-[#07070a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
						</svg>
					</div>
					<div>
						<h1 className="text-base font-semibold tracking-tight text-[#e8e8ed]">qbitwebui</h1>
					</div>
				</div>
				<div className="relative flex items-center gap-2">
					<div className="px-3 py-1.5 rounded-lg bg-[#13131a] border border-white/[0.08] text-xs text-[#8b8b9e] font-mono">
						v{__APP_VERSION__}
					</div>
				</div>
			</header>
			<main className="flex-1 overflow-hidden flex flex-col">{children}</main>
			<StatusBar />
		</div>
	)
}
