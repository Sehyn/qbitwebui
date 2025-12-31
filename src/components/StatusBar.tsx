import { useTransferInfo } from '../hooks/useTransferInfo'
import { formatSpeed } from '../utils/format'

export function StatusBar() {
	const { data } = useTransferInfo()

	const statusConfig = {
		connected: { color: 'bg-[#00d4aa]', glow: 'shadow-[#00d4aa]/50', label: 'Connected' },
		firewalled: { color: 'bg-[#f7b731]', glow: 'shadow-[#f7b731]/50', label: 'Firewalled' },
		disconnected: { color: 'bg-[#f43f5e]', glow: 'shadow-[#f43f5e]/50', label: 'Disconnected' },
	}[data?.connection_status ?? 'disconnected']

	return (
		<div className="relative flex items-center justify-between px-6 py-3 bg-[#0d0d12]/80 backdrop-blur-md border-t border-white/[0.06]">
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d4aa]/[0.01] to-transparent" />

			<div className="relative flex items-center gap-6">
				<div className="flex items-center gap-2.5">
					<div className={`w-2 h-2 rounded-full ${statusConfig.color} shadow-lg ${statusConfig.glow}`} />
					<span className="text-xs font-medium text-[#8b8b9e]">{statusConfig.label}</span>
				</div>

				<div className="h-4 w-px bg-white/[0.06]" />

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<svg className="w-3.5 h-3.5 text-[#00d4aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
						</svg>
						<span className="text-xs font-mono font-medium text-[#00d4aa]">
							{formatSpeed(data?.dl_info_speed ?? 0)}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<svg className="w-3.5 h-3.5 text-[#f7b731]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
						</svg>
						<span className="text-xs font-mono font-medium text-[#f7b731]">
							{formatSpeed(data?.up_info_speed ?? 0)}
						</span>
					</div>
				</div>
			</div>

			<div className="relative flex items-center gap-4">
				<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#13131a] border border-white/[0.08]">
					<span className="text-[10px] font-medium text-[#8b8b9e] uppercase tracking-wider">DHT</span>
					<span className="text-xs font-mono font-medium text-[#a0a0b2]">{data?.dht_nodes ?? 0}</span>
				</div>
			</div>
		</div>
	)
}
