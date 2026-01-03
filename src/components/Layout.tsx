import type { ReactNode } from 'react'
import { StatusBar } from './StatusBar'
import { ThemeSwitcher } from './ThemeSwitcher'

interface Props {
	children: ReactNode
	instanceLabel?: string
	onBackToInstances?: () => void
}

export function Layout({ children, instanceLabel, onBackToInstances }: Props) {

	return (
		<div className="flex flex-col h-screen scanlines" style={{ backgroundColor: 'var(--bg-primary)' }}>
			<header className="relative z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 80%, transparent)' }}>
				<div className="absolute inset-0" style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--accent) 2%, transparent), transparent)' }} />
				<div className="relative flex items-center gap-3">
					{onBackToInstances && (
						<button
							onClick={onBackToInstances}
							className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
							style={{ color: 'var(--text-muted)' }}
							title="Back to instances"
						>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
							</svg>
						</button>
					)}
					<div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to bottom right, var(--accent), color-mix(in srgb, var(--accent) 70%, black))', boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--accent) 20%, transparent)' }}>
						<svg className="w-4 h-4" style={{ color: 'var(--accent-contrast)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
						</svg>
					</div>
					<div>
						<h1 className="text-base font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
							{instanceLabel || 'qbitwebui'}
						</h1>
					</div>
				</div>
				<div className="relative flex items-center gap-3">
					<ThemeSwitcher />
				</div>
			</header>
			<main className="flex-1 overflow-hidden flex flex-col">{children}</main>
			<StatusBar />
		</div>
	)
}
