import type { ReactNode } from 'react'
import type { TorrentFilter } from '../types/qbittorrent'

const filters: { value: TorrentFilter; label: string; icon: ReactNode }[] = [
	{
		value: 'all',
		label: 'All',
		icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
	},
	{
		value: 'downloading',
		label: 'Downloading',
		icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />,
	},
	{
		value: 'seeding',
		label: 'Seeding',
		icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />,
	},
	{
		value: 'completed',
		label: 'Completed',
		icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
	},
	{
		value: 'stopped',
		label: 'Stopped',
		icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />,
	},
	{
		value: 'active',
		label: 'Active',
		icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />,
	},
]

interface Props {
	filter: TorrentFilter
	onFilterChange: (f: TorrentFilter) => void
}

export function FilterBar({ filter, onFilterChange }: Props) {
	return (
		<>
			{filters.map((f) => (
				<button
					key={f.value}
					onClick={() => onFilterChange(f.value)}
					className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
						filter === f.value
							? 'text-[#07070a]'
							: 'text-[#9090a0] hover:text-[#c0c0cc] hover:bg-white/[0.04]'
					}`}
				>
					{filter === f.value && (
						<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00d4aa] to-[#00a884] shadow-lg shadow-[#00d4aa]/20" />
					)}
					<svg className="relative w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						{f.icon}
					</svg>
					<span className="relative">{f.label}</span>
				</button>
			))}
		</>
	)
}

export function SearchInput({ value, onChange }: { value: string; onChange: (s: string) => void }) {
	return (
		<div className="relative">
			<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e6e82]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
			</svg>
			<input
				type="text"
				placeholder="Search torrents..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-64 pl-10 pr-4 py-2.5 bg-[#13131a] rounded-xl border border-white/[0.08] text-sm text-[#e8e8ed] placeholder-[#6e6e82] transition-all duration-200 focus:border-[#00d4aa]/40 focus:bg-[#16161f]"
			/>
		</div>
	)
}
