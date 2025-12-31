import { useState } from 'react'
import { login } from '../api/qbittorrent'

interface Props {
	onSuccess: () => void
}

export function LoginForm({ onSuccess }: Props) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const ok = await login(username, password)
			if (ok) {
				onSuccess()
			} else {
				setError('Invalid credentials')
			}
		} catch {
			setError('Connection failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f1922] via-[#07070a] to-[#07070a]" />
			<div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00d4aa]/5 rounded-full blur-3xl" />
			<div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />

			<form
				onSubmit={handleSubmit}
				className="relative w-full max-w-sm opacity-0 animate-in"
			>
				<div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent" />
				<div className="relative bg-[#0d0d12]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06]">
					<div className="flex items-center gap-3 mb-8">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#00a884] flex items-center justify-center">
							<svg className="w-5 h-5 text-[#07070a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
							</svg>
						</div>
						<div>
							<h1 className="text-lg font-semibold tracking-tight">qbitwebui</h1>
						</div>
					</div>

					{error && (
						<div className="mb-6 px-4 py-3 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e] text-sm font-medium">
							{error}
						</div>
					)}

					<div className="space-y-4">
						<div className="group">
							<label className="block text-xs font-medium text-[#8b8b9e] mb-2 uppercase tracking-wider">
								Username
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full px-4 py-3 bg-[#0a0a0f] rounded-lg border border-white/[0.08] text-[#e8e8ed] placeholder-[#6e6e82] transition-all duration-200 focus:border-[#00d4aa]/50 focus:bg-[#0c0c12] font-mono text-sm"
								placeholder="admin"
								autoComplete="username"
							/>
						</div>

						<div className="group">
							<label className="block text-xs font-medium text-[#8b8b9e] mb-2 uppercase tracking-wider">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 bg-[#0a0a0f] rounded-lg border border-white/[0.08] text-[#e8e8ed] placeholder-[#6e6e82] transition-all duration-200 focus:border-[#00d4aa]/50 focus:bg-[#0c0c12] font-mono text-sm"
								placeholder="••••••••"
								autoComplete="current-password"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="relative w-full mt-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-[#00d4aa] to-[#00a884] transition-transform duration-200 group-hover:scale-[1.02]" />
						<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-[#00e4b8] to-[#00b894]" />
						<span className="relative text-[#07070a] font-semibold">
							{loading ? 'Connecting...' : 'Sign In'}
						</span>
					</button>

					<p className="mt-6 text-center text-xs text-[#6e6e82]">
						Secure connection to your qBittorrent instance
					</p>
				</div>
			</form>
		</div>
	)
}
