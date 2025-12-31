export function formatSpeed(bytes: number, showZero = true): string {
	if (bytes === 0 && !showZero) return '—'
	if (bytes < 1024) return `${bytes} B/s`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`
	return `${(bytes / 1024 / 1024).toFixed(2)} MB/s`
}

export function formatSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
	return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export function formatEta(seconds: number): string {
	if (seconds < 0 || seconds === 8640000) return '∞'
	if (seconds < 60) return `${seconds}s`
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
	return `${Math.floor(seconds / 86400)}d`
}

export function formatDate(timestamp: number): string {
	if (timestamp <= 0 || timestamp === -1) return '—'
	return new Date(timestamp * 1000).toLocaleString()
}

export function formatDuration(seconds: number): string {
	if (seconds < 0) return '—'
	const d = Math.floor(seconds / 86400)
	const h = Math.floor((seconds % 86400) / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = seconds % 60
	if (d > 0) return `${d}d ${h}h ${m}m`
	if (h > 0) return `${h}h ${m}m ${s}s`
	if (m > 0) return `${m}m ${s}s`
	return `${s}s`
}
