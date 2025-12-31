import { useState, useEffect } from 'react'
import { useTorrentProperties, useTorrentTrackers, useTorrentPeers, useTorrentFiles, useTorrentWebSeeds } from '../hooks/useTorrentDetails'
import { formatSize, formatSpeed, formatDate, formatDuration, formatEta } from '../utils/format'
import type { Tracker, Peer, TorrentFile } from '../types/torrentDetails'

interface Props {
	hash: string | null
	name: string
	onClose: () => void
}

type Tab = 'general' | 'trackers' | 'peers' | 'http' | 'content'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
	{ id: 'general', label: 'General', icon: <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /> },
	{ id: 'trackers', label: 'Trackers', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /> },
	{ id: 'peers', label: 'Peers', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /> },
	{ id: 'http', label: 'HTTP Sources', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /> },
	{ id: 'content', label: 'Content', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /> },
]

function getTrackerStatus(status: number): { label: string; color: string; bg: string } {
	const statuses: Record<number, { label: string; color: string; bg: string }> = {
		0: { label: 'Disabled', color: 'text-[#6e6e82]', bg: 'bg-[#6e6e82]/10' },
		1: { label: 'Not contacted', color: 'text-[#8b8b9e]', bg: 'bg-[#8b8b9e]/10' },
		2: { label: 'Working', color: 'text-[#00d4aa]', bg: 'bg-[#00d4aa]/10' },
		3: { label: 'Updating', color: 'text-[#f7b731]', bg: 'bg-[#f7b731]/10' },
		4: { label: 'Error', color: 'text-[#f43f5e]', bg: 'bg-[#f43f5e]/10' },
	}
	return statuses[status] ?? { label: 'Unknown', color: 'text-[#8b8b9e]', bg: 'bg-[#8b8b9e]/10' }
}

function LoadingSkeleton() {
	return (
		<div className="p-6 space-y-4 animate-pulse">
			<div className="grid grid-cols-2 gap-4">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="h-16 rounded-lg bg-white/[0.04]" />
				))}
			</div>
		</div>
	)
}

function EmptyState({ message }: { message: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-[#6e6e82]">
			<svg className="w-10 h-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
			</svg>
			<span className="text-sm">{message}</span>
		</div>
	)
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
			<div className="px-4 py-2 border-b border-white/[0.04] bg-white/[0.02]">
				<h4 className="text-xs font-medium text-[#8b8b9e] uppercase tracking-wider">{title}</h4>
			</div>
			<div className="p-4">{children}</div>
		</div>
	)
}

function InfoRow({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
	return (
		<div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
			<span className="text-[#6e6e82] text-sm">{label}</span>
			<span className={`text-sm font-mono ${accent ? 'text-[#00d4aa]' : 'text-[#e8e8ed]'}`}>{value}</span>
		</div>
	)
}

function GeneralTab({ hash }: { hash: string }) {
	const { data: p, isLoading } = useTorrentProperties(hash)
	if (isLoading) return <LoadingSkeleton />
	if (!p) return <EmptyState message="Failed to load properties" />
	return (
		<div className="p-6 space-y-4 max-h-[400px] overflow-auto modal-content">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<SectionCard title="Transfer">
					<InfoRow label="Downloaded" value={formatSize(p.total_downloaded)} accent />
					<InfoRow label="Uploaded" value={formatSize(p.total_uploaded)} />
					<InfoRow label="Wasted" value={formatSize(p.total_wasted)} />
					<InfoRow label="Share Ratio" value={p.share_ratio.toFixed(2)} />
				</SectionCard>
				<SectionCard title="Speed">
					<InfoRow label="Download" value={formatSpeed(p.dl_speed)} accent />
					<InfoRow label="Upload" value={formatSpeed(p.up_speed)} />
					<InfoRow label="Avg Download" value={formatSpeed(p.dl_speed_avg)} />
					<InfoRow label="Avg Upload" value={formatSpeed(p.up_speed_avg)} />
				</SectionCard>
				<SectionCard title="Peers">
					<InfoRow label="Seeds" value={`${p.seeds} (${p.seeds_total} total)`} accent />
					<InfoRow label="Peers" value={`${p.peers} (${p.peers_total} total)`} />
					<InfoRow label="Connections" value={`${p.nb_connections} / ${p.nb_connections_limit}`} />
					<InfoRow label="ETA" value={formatEta(p.eta)} />
				</SectionCard>
				<SectionCard title="Time">
					<InfoRow label="Added On" value={formatDate(p.addition_date)} />
					<InfoRow label="Completed On" value={formatDate(p.completion_date)} />
					<InfoRow label="Last Seen" value={formatDate(p.last_seen)} />
					<InfoRow label="Seeding Time" value={formatDuration(p.seeding_time)} />
				</SectionCard>
				<SectionCard title="Torrent">
					<InfoRow label="Total Size" value={formatSize(p.total_size)} />
					<InfoRow label="Pieces" value={`${p.pieces_have} / ${p.pieces_num}`} />
					<InfoRow label="Piece Size" value={formatSize(p.piece_size)} />
					<InfoRow label="Reannounce In" value={`${p.reannounce}s`} />
				</SectionCard>
				<SectionCard title="Location">
					<div className="text-sm text-[#e8e8ed] font-mono break-all">{p.save_path}</div>
				</SectionCard>
			</div>
			{p.comment && (
				<SectionCard title="Comment">
					<div className="text-sm text-[#8b8b9e]">{p.comment}</div>
				</SectionCard>
			)}
		</div>
	)
}

function TrackersTab({ hash }: { hash: string }) {
	const { data: trackers, isLoading } = useTorrentTrackers(hash)
	if (isLoading) return <LoadingSkeleton />
	const filtered = trackers?.filter((t: Tracker) => !t.url.startsWith('** [')) ?? []
	if (filtered.length === 0) return <EmptyState message="No trackers" />
	return (
		<div className="overflow-auto max-h-[400px] modal-content">
			<table className="w-full text-sm">
				<thead className="sticky top-0 bg-[#0d0d12] border-b border-white/[0.06]">
					<tr className="text-[#6e6e82] text-left">
						<th className="px-6 py-3 font-medium w-12">Tier</th>
						<th className="px-6 py-3 font-medium">URL</th>
						<th className="px-6 py-3 font-medium w-28">Status</th>
						<th className="px-6 py-3 font-medium text-right w-20">Seeds</th>
						<th className="px-6 py-3 font-medium text-right w-20">Peers</th>
						<th className="px-6 py-3 font-medium">Message</th>
					</tr>
				</thead>
				<tbody>
					{filtered.map((t: Tracker, i: number) => {
						const status = getTrackerStatus(t.status)
						return (
							<tr key={i} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
								<td className="px-6 py-3 text-[#8b8b9e] font-mono">{t.tier}</td>
								<td className="px-6 py-3 text-[#e8e8ed] font-mono truncate max-w-[300px]" title={t.url}>{t.url}</td>
								<td className="px-6 py-3">
									<span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${status.color} ${status.bg}`}>
										<span className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text-', 'bg-')}`} />
										{status.label}
									</span>
								</td>
								<td className="px-6 py-3 text-[#00d4aa] text-right font-mono">{t.num_seeds}</td>
								<td className="px-6 py-3 text-[#8b8b9e] text-right font-mono">{t.num_peers}</td>
								<td className="px-6 py-3 text-[#6e6e82] truncate max-w-[200px]" title={t.msg}>{t.msg || '—'}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

function PeersTab({ hash }: { hash: string }) {
	const { data, isLoading } = useTorrentPeers(hash)
	if (isLoading) return <LoadingSkeleton />
	const peers = Object.values(data?.peers || {}) as Peer[]
	if (peers.length === 0) return <EmptyState message="No peers connected" />
	return (
		<div className="overflow-auto max-h-[400px] modal-content">
			<table className="w-full text-sm">
				<thead className="sticky top-0 bg-[#0d0d12] border-b border-white/[0.06]">
					<tr className="text-[#6e6e82] text-left">
						<th className="px-6 py-3 font-medium">IP Address</th>
						<th className="px-6 py-3 font-medium">Client</th>
						<th className="px-6 py-3 font-medium w-20">Flags</th>
						<th className="px-6 py-3 font-medium text-right w-24">Progress</th>
						<th className="px-6 py-3 font-medium text-right w-28">Down Speed</th>
						<th className="px-6 py-3 font-medium text-right w-28">Up Speed</th>
					</tr>
				</thead>
				<tbody>
					{peers.map((p: Peer, i: number) => (
						<tr key={i} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
							<td className="px-6 py-3 font-mono">
								<span className="text-[#e8e8ed]">{p.ip}</span>
								<span className="text-[#6e6e82]">:{p.port}</span>
							</td>
							<td className="px-6 py-3 text-[#8b8b9e] truncate max-w-[180px]" title={p.client}>{p.client}</td>
							<td className="px-6 py-3 text-[#6e6e82] font-mono" title={p.flags_desc}>{p.flags || '—'}</td>
							<td className="px-6 py-3 text-right">
								<div className="flex items-center justify-end gap-2">
									<div className="w-16 h-1.5 rounded-full bg-[#1a1a24] overflow-hidden">
										<div
											className="h-full bg-[#00d4aa] rounded-full"
											style={{ width: `${p.progress * 100}%` }}
										/>
									</div>
									<span className="text-[#8b8b9e] font-mono w-10 text-right">{(p.progress * 100).toFixed(0)}%</span>
								</div>
							</td>
							<td className="px-6 py-3 text-[#00d4aa] text-right font-mono">{formatSpeed(p.dl_speed, false)}</td>
							<td className="px-6 py-3 text-[#f7b731] text-right font-mono">{formatSpeed(p.up_speed, false)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

function HttpSourcesTab({ hash }: { hash: string }) {
	const { data: seeds, isLoading } = useTorrentWebSeeds(hash)
	if (isLoading) return <LoadingSkeleton />
	if (!seeds || seeds.length === 0) return <EmptyState message="No HTTP sources" />
	return (
		<div className="p-6 space-y-3 max-h-[400px] overflow-auto modal-content">
			{seeds.map((s, i) => (
				<div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
					<div className="shrink-0 w-8 h-8 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center">
						<svg className="w-4 h-4 text-[#00d4aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
						</svg>
					</div>
					<span className="text-sm font-mono text-[#e8e8ed] break-all">{s.url}</span>
				</div>
			))}
		</div>
	)
}

function ContentTab({ hash }: { hash: string }) {
	const { data: files, isLoading } = useTorrentFiles(hash)
	if (isLoading) return <LoadingSkeleton />
	if (!files || files.length === 0) return <EmptyState message="No files" />
	return (
		<div className="overflow-auto max-h-[400px] modal-content">
			<table className="w-full text-sm">
				<thead className="sticky top-0 bg-[#0d0d12] border-b border-white/[0.06]">
					<tr className="text-[#6e6e82] text-left">
						<th className="px-6 py-3 font-medium">Name</th>
						<th className="px-6 py-3 font-medium text-right w-28">Size</th>
						<th className="px-6 py-3 font-medium text-right w-32">Progress</th>
						<th className="px-6 py-3 font-medium text-right w-20">Priority</th>
					</tr>
				</thead>
				<tbody>
					{files.map((f: TorrentFile, i: number) => {
						const progress = f.progress * 100
						const done = progress >= 100
						return (
							<tr key={i} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
								<td className="px-6 py-3">
									<div className="flex items-center gap-3">
										{done ? (
											<div className="shrink-0 w-6 h-6 rounded-md bg-[#00d4aa]/10 flex items-center justify-center">
												<svg className="w-3.5 h-3.5 text-[#00d4aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
												</svg>
											</div>
										) : (
											<div className="shrink-0 w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
												<svg className="w-3.5 h-3.5 text-[#6e6e82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
												</svg>
											</div>
										)}
										<span className="text-[#e8e8ed] truncate max-w-[350px]" title={f.name}>{f.name}</span>
									</div>
								</td>
								<td className="px-6 py-3 text-[#8b8b9e] text-right font-mono">{formatSize(f.size)}</td>
								<td className="px-6 py-3 text-right">
									<div className="flex items-center justify-end gap-2">
										<div className="w-20 h-1.5 rounded-full bg-[#1a1a24] overflow-hidden">
											<div
												className={`h-full rounded-full transition-all ${done ? 'bg-[#00d4aa]' : 'bg-[#8b8b9e]'}`}
												style={{ width: `${progress}%` }}
											/>
										</div>
										<span className={`font-mono w-14 text-right ${done ? 'text-[#00d4aa]' : 'text-[#8b8b9e]'}`}>
											{progress.toFixed(1)}%
										</span>
									</div>
								</td>
								<td className="px-6 py-3 text-[#6e6e82] text-right font-mono">{f.priority}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export function TorrentDetailsModal({ hash, name, onClose }: Props) {
	const [tab, setTab] = useState<Tab>('general')

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [onClose])

	if (!hash) return null

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
			<div className="relative w-full max-w-4xl mx-4 opacity-0 animate-in" onClick={(e) => e.stopPropagation()}>
				<div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#00d4aa]/20 via-transparent to-transparent" />
				<div className="relative bg-[#0d0d12] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
					<div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] bg-gradient-to-r from-[#00d4aa]/[0.03] to-transparent">
						<div className="shrink-0 w-10 h-10 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
							<svg className="w-5 h-5 text-[#00d4aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
							</svg>
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="text-base font-semibold text-[#e8e8ed] truncate" title={name}>{name}</h3>
							<p className="text-xs text-[#6e6e82] font-mono mt-0.5">{hash}</p>
						</div>
						<button
							onClick={onClose}
							className="shrink-0 p-2 rounded-lg hover:bg-white/[0.06] text-[#6e6e82] hover:text-white transition-colors"
						>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div className="flex gap-2 px-6 py-3 border-b border-white/[0.06] bg-[#0a0a0f]/50">
						{TABS.map((t) => (
							<button
								key={t.id}
								onClick={() => setTab(t.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
									tab === t.id
										? 'bg-[#00d4aa] text-[#07070a] shadow-lg shadow-[#00d4aa]/20'
										: 'text-[#8b8b9e] hover:text-white hover:bg-white/[0.04]'
								}`}
							>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									{t.icon}
								</svg>
								{t.label}
							</button>
						))}
					</div>
					<div className="min-h-[300px]">
						{tab === 'general' && <GeneralTab hash={hash} />}
						{tab === 'trackers' && <TrackersTab hash={hash} />}
						{tab === 'peers' && <PeersTab hash={hash} />}
						{tab === 'http' && <HttpSourcesTab hash={hash} />}
						{tab === 'content' && <ContentTab hash={hash} />}
					</div>
				</div>
			</div>
		</div>
	)
}
