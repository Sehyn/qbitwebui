import { useState, useMemo, useEffect } from 'react'
import type { TorrentFilter } from '../types/qbittorrent'
import { useTorrents, useStopTorrents, useStartTorrents, useDeleteTorrents } from '../hooks/useTorrents'
import { TorrentRow } from './TorrentRow'
import { FilterBar, SearchInput } from './FilterBar'
import { AddTorrentModal } from './AddTorrentModal'
import { TorrentDetailsModal } from './TorrentDetailsModal'

type SortKey = 'name' | 'size' | 'progress' | 'downloaded' | 'uploaded' | 'dlspeed' | 'upspeed' | 'ratio'

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
	return (
		<svg className={`w-3 h-3 transition-colors ${active ? 'text-[#00d4aa]' : 'text-[#6e6e82]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			{asc ? (
				<path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
			) : (
				<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
			)}
		</svg>
	)
}

export function TorrentList() {
	const [filter, setFilter] = useState<TorrentFilter>('all')
	const [search, setSearch] = useState('')
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [sortKey, setSortKey] = useState<SortKey>('name')
	const [sortAsc, setSortAsc] = useState(true)
	const [deleteModal, setDeleteModal] = useState(false)
	const [addModal, setAddModal] = useState(false)
	const [detailsHash, setDetailsHash] = useState<string | null>(null)

	const { data: torrents = [], isLoading } = useTorrents(filter)
	const stopMutation = useStopTorrents()
	const startMutation = useStartTorrents()
	const deleteMutation = useDeleteTorrents()

	const filtered = useMemo(() => {
		let result = torrents
		if (search) {
			const q = search.toLowerCase()
			result = result.filter((t) => t.name.toLowerCase().includes(q))
		}
		result = [...result].sort((a, b) => {
			const mul = sortAsc ? 1 : -1
			if (sortKey === 'name') return mul * a.name.localeCompare(b.name)
			return mul * (a[sortKey] - b[sortKey])
		})
		return result
	}, [torrents, search, sortKey, sortAsc])

	function handleSelect(hash: string, multi: boolean) {
		setSelected((prev) => {
			if (multi) {
				const next = new Set(prev)
				if (next.has(hash)) next.delete(hash)
				else next.add(hash)
				return next
			}
			if (prev.has(hash) && prev.size === 1) return new Set()
			return new Set([hash])
		})
	}

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') setSelected(new Set())
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	function handleSort(key: SortKey) {
		if (sortKey === key) setSortAsc(!sortAsc)
		else {
			setSortKey(key)
			setSortAsc(true)
		}
	}

	function handleStop() {
		if (selected.size) stopMutation.mutate([...selected])
	}

	function handleStart() {
		if (selected.size) startMutation.mutate([...selected])
	}

	function handleDelete(deleteFiles: boolean) {
		if (selected.size) {
			deleteMutation.mutate({ hashes: [...selected], deleteFiles })
			setSelected(new Set())
		}
		setDeleteModal(false)
	}

	return (
		<div className="flex flex-col flex-1 overflow-hidden bg-[#07070a]">
			<div className="flex items-center gap-3 px-6 py-4 bg-[#0a0a0f] border-b border-white/[0.04]">
				<div className="flex items-center gap-1 p-1 rounded-xl bg-[#13131a] border border-white/[0.08]">
					<button
						onClick={() => setAddModal(true)}
						className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#00d4aa] hover:text-[#00d4aa] hover:bg-white/[0.04] transition-all duration-200"
					>
						<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						Add
					</button>
					<div className="w-px h-5 bg-white/[0.40]" />
					<FilterBar filter={filter} onFilterChange={setFilter} />
				</div>
				<div className="flex-1" />
				<SearchInput value={search} onChange={setSearch} />
			</div>

			{selected.size > 0 && (
				<div className="flex items-center gap-3 px-6 py-3 bg-[#00d4aa]/[0.05] border-b border-[#00d4aa]/20">
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 rounded-md bg-[#00d4aa] flex items-center justify-center">
							<span className="text-xs font-bold text-[#07070a]">{selected.size}</span>
						</div>
						<span className="text-sm text-[#8b8b9e]">selected</span>
					</div>

					<div className="h-5 w-px bg-white/[0.06] mx-2" />

					<div className="flex items-center gap-2">
						<button
							onClick={handleStart}
							className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 text-[#00d4aa] text-xs font-medium transition-colors"
						>
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
							</svg>
							Start
						</button>
						<button
							onClick={handleStop}
							className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f7b731]/10 hover:bg-[#f7b731]/20 text-[#f7b731] text-xs font-medium transition-colors"
						>
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
							</svg>
							Stop
						</button>
						<button
							onClick={() => setDeleteModal(true)}
							className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 text-[#f43f5e] text-xs font-medium transition-colors"
						>
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
							</svg>
							Delete
						</button>
					</div>

					<button
						onClick={() => setSelected(new Set())}
						className="ml-auto text-xs text-[#9090a0] hover:text-[#c0c0cc] transition-colors"
					>
						Clear selection
					</button>
				</div>
			)}

			<div className="flex-1 overflow-auto">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-48 gap-3">
						<div className="w-8 h-8 border-2 border-[#00d4aa]/20 border-t-[#00d4aa] rounded-full animate-spin" />
						<span className="text-sm text-[#8b8b9e]">Loading torrents...</span>
					</div>
				) : filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-48 gap-2">
						<svg className="w-12 h-12 text-[#2a2a34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
						</svg>
						<span className="text-sm text-[#8b8b9e]">No torrents found</span>
					</div>
				) : (
					<table className="w-full table-auto">
						<thead className="sticky top-0 z-10">
							<tr className="bg-[#0a0a0f] border-b border-white/[0.04]">
								<th className="px-4 py-3 text-left">
									<button
										onClick={() => handleSort('name')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										Name
										<SortIcon active={sortKey === 'name'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<button
										onClick={() => handleSort('size')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										Size
										<SortIcon active={sortKey === 'size'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<button
										onClick={() => handleSort('progress')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										Progress
										<SortIcon active={sortKey === 'progress'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<span className="text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e]">Status</span>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<button
										onClick={() => handleSort('downloaded')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										Down
										<SortIcon active={sortKey === 'downloaded'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<button
										onClick={() => handleSort('uploaded')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										Up
										<SortIcon active={sortKey === 'uploaded'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<button
										onClick={() => handleSort('dlspeed')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										<svg className="w-3 h-3 text-[#00d4aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
										</svg>
										Speed
										<SortIcon active={sortKey === 'dlspeed'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<button
										onClick={() => handleSort('upspeed')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										<svg className="w-3 h-3 text-[#f7b731]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
										</svg>
										Speed
										<SortIcon active={sortKey === 'upspeed'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-3 py-3 text-left whitespace-nowrap">
									<button
										onClick={() => handleSort('ratio')}
										className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors"
									>
										Ratio
										<SortIcon active={sortKey === 'ratio'} asc={sortAsc} />
									</button>
								</th>
								<th className="px-2 py-3 w-10" />
							</tr>
						</thead>
						<tbody className="divide-y divide-white/[0.02]">
							{filtered.map((t) => (
								<TorrentRow
									key={t.hash}
									torrent={t}
									selected={selected.has(t.hash)}
									onSelect={handleSelect}
									onViewDetails={setDetailsHash}
								/>
							))}
						</tbody>
					</table>
				)}
			</div>

			{deleteModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="relative w-full max-w-sm mx-4 opacity-0 animate-in">
						<div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#f43f5e]/20 to-transparent" />
						<div className="relative bg-[#0d0d12] rounded-2xl p-6 border border-white/[0.06]">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 rounded-xl bg-[#f43f5e]/10 flex items-center justify-center">
									<svg className="w-5 h-5 text-[#f43f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
									</svg>
								</div>
								<div>
									<h3 className="text-base font-semibold text-[#e8e8ed]">Delete Torrents</h3>
									<p className="text-xs text-[#8b8b9e]">{selected.size} torrent{selected.size > 1 ? 's' : ''} selected</p>
								</div>
							</div>

							<div className="space-y-2">
								<button
									onClick={() => handleDelete(false)}
									className="w-full py-3 rounded-xl bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 border border-[#f43f5e]/20 text-[#f43f5e] text-sm font-medium transition-colors"
								>
									Remove from list
								</button>
								<button
									onClick={() => handleDelete(true)}
									className="w-full py-3 rounded-xl bg-[#f43f5e] hover:bg-[#e11d48] text-white text-sm font-medium transition-colors"
								>
									Delete with files
								</button>
								<button
									onClick={() => setDeleteModal(false)}
									className="w-full py-3 rounded-xl bg-[#13131a] hover:bg-[#1a1a24] border border-white/[0.06] text-[#8b8b9e] text-sm font-medium transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<AddTorrentModal open={addModal} onClose={() => setAddModal(false)} />
			<TorrentDetailsModal
				hash={detailsHash}
				name={torrents.find((t) => t.hash === detailsHash)?.name ?? ''}
				onClose={() => setDetailsHash(null)}
			/>
		</div>
	)
}
