import { useState, useRef } from 'react'
import { useAddTorrent, useCategories } from '../hooks/useTorrents'

interface Props {
	open: boolean
	onClose: () => void
}

type Tab = 'link' | 'file'

export function AddTorrentModal({ open, onClose }: Props) {
	const [tab, setTab] = useState<Tab>('link')
	const [url, setUrl] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [category, setCategory] = useState('')
	const [savepath, setSavepath] = useState('')
	const [startTorrent, setStartTorrent] = useState(true)
	const [sequential, setSequential] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const { data: categories = {} } = useCategories()
	const addMutation = useAddTorrent()

	if (!open) return null

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (tab === 'link' && !url.trim()) return
		if (tab === 'file' && !file) return

		addMutation.mutate({
			options: {
				urls: tab === 'link' ? url.trim() : undefined,
				category: category || undefined,
				savepath: savepath || undefined,
				paused: !startTorrent,
				sequentialDownload: sequential,
			},
			file: tab === 'file' ? file ?? undefined : undefined,
		}, {
			onSuccess: () => {
				setUrl('')
				setFile(null)
				setCategory('')
				setSavepath('')
				setStartTorrent(true)
				setSequential(false)
				onClose()
			},
		})
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0]
		if (f) setFile(f)
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault()
		const f = e.dataTransfer.files?.[0]
		if (f && f.name.endsWith('.torrent')) {
			setFile(f)
			setTab('file')
		}
	}

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
			<div className="relative w-full max-w-md mx-4 opacity-0 animate-in">
				<div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#00d4aa]/20 to-transparent" />
				<div className="relative bg-[#0d0d12] rounded-2xl border border-white/[0.06]">
					<div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center">
								<svg className="w-5 h-5 text-[#00d4aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
							</div>
							<h3 className="text-base font-semibold text-[#e8e8ed]">Add Torrent</h3>
						</div>
						<button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.04] text-[#8b8b9e] hover:text-[#c0c0cc] transition-colors">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<form onSubmit={handleSubmit} className="p-5 space-y-4">
						<div className="flex p-1 rounded-xl bg-[#0a0a0f] border border-white/[0.06]">
							<button
								type="button"
								onClick={() => setTab('link')}
								className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${tab === 'link' ? 'bg-[#00d4aa] text-[#07070a]' : 'text-[#8b8b9e] hover:text-[#c0c0cc]'}`}
							>
								Magnet / URL
							</button>
							<button
								type="button"
								onClick={() => setTab('file')}
								className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${tab === 'file' ? 'bg-[#00d4aa] text-[#07070a]' : 'text-[#8b8b9e] hover:text-[#c0c0cc]'}`}
							>
								Torrent File
							</button>
						</div>

						{tab === 'link' ? (
							<div>
								<label className="block text-xs font-medium text-[#8b8b9e] mb-2">Magnet link or URL</label>
								<textarea
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									placeholder="magnet:?xt=urn:btih:... or https://..."
									rows={3}
									className="w-full px-4 py-3 bg-[#0a0a0f] rounded-xl border border-white/[0.08] text-sm text-[#e8e8ed] placeholder-[#6e6e82] resize-none focus:border-[#00d4aa]/40 focus:outline-none transition-colors"
								/>
							</div>
						) : (
							<div>
								<label className="block text-xs font-medium text-[#8b8b9e] mb-2">Torrent file</label>
								<input
									ref={fileInputRef}
									type="file"
									accept=".torrent"
									onChange={handleFileChange}
									className="hidden"
								/>
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="w-full py-6 px-4 bg-[#0a0a0f] rounded-xl border border-dashed border-white/[0.12] hover:border-[#00d4aa]/40 text-sm transition-colors"
								>
									{file ? (
										<div className="flex items-center justify-center gap-2 text-[#e8e8ed]">
											<svg className="w-5 h-5 text-[#00d4aa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span className="truncate max-w-[200px]">{file.name}</span>
										</div>
									) : (
										<div className="flex flex-col items-center gap-2 text-[#8b8b9e]">
											<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
											</svg>
											<span>Click or drop .torrent file</span>
										</div>
									)}
								</button>
							</div>
						)}

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-[#8b8b9e] mb-2">Category</label>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="w-full px-3 py-2.5 bg-[#0a0a0f] rounded-xl border border-white/[0.08] text-sm text-[#e8e8ed] focus:border-[#00d4aa]/40 focus:outline-none transition-colors appearance-none cursor-pointer"
								>
									<option value="">None</option>
									{Object.keys(categories).map((cat) => (
										<option key={cat} value={cat}>{cat}</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-xs font-medium text-[#8b8b9e] mb-2">Save path</label>
								<input
									type="text"
									value={savepath}
									onChange={(e) => setSavepath(e.target.value)}
									placeholder="Default"
									className="w-full px-3 py-2.5 bg-[#0a0a0f] rounded-xl border border-white/[0.08] text-sm text-[#e8e8ed] placeholder-[#6e6e82] focus:border-[#00d4aa]/40 focus:outline-none transition-colors"
								/>
							</div>
						</div>

						<div className="flex items-center gap-4 pt-2">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={startTorrent}
									onChange={(e) => setStartTorrent(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-4 h-4 rounded border-2 border-white/20 peer-checked:border-[#00d4aa] peer-checked:bg-[#00d4aa] flex items-center justify-center transition-colors">
									{startTorrent && (
										<svg className="w-2.5 h-2.5 text-[#07070a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
										</svg>
									)}
								</div>
								<span className="text-xs text-[#8b8b9e]">Start torrent</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={sequential}
									onChange={(e) => setSequential(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-4 h-4 rounded border-2 border-white/20 peer-checked:border-[#00d4aa] peer-checked:bg-[#00d4aa] flex items-center justify-center transition-colors">
									{sequential && (
										<svg className="w-2.5 h-2.5 text-[#07070a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
										</svg>
									)}
								</div>
								<span className="text-xs text-[#8b8b9e]">Sequential</span>
							</label>
						</div>

						<div className="flex gap-3 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 py-3 rounded-xl bg-[#13131a] hover:bg-[#1a1a24] border border-white/[0.06] text-[#8b8b9e] text-sm font-medium transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={addMutation.isPending || (tab === 'link' && !url.trim()) || (tab === 'file' && !file)}
								className="flex-1 py-3 rounded-xl bg-[#00d4aa] hover:bg-[#00c49a] disabled:opacity-50 disabled:cursor-not-allowed text-[#07070a] text-sm font-semibold transition-colors"
							>
								{addMutation.isPending ? 'Adding...' : 'Add Torrent'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
