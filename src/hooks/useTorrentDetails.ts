import { useQuery } from '@tanstack/react-query'
import * as api from '../api/qbittorrent'

export function useTorrentProperties(hash: string | null) {
	return useQuery({
		queryKey: ['torrent-properties', hash],
		queryFn: () => api.getTorrentProperties(hash!),
		enabled: !!hash,
		refetchInterval: 2000,
	})
}

export function useTorrentTrackers(hash: string | null) {
	return useQuery({
		queryKey: ['torrent-trackers', hash],
		queryFn: () => api.getTorrentTrackers(hash!),
		enabled: !!hash,
		refetchInterval: 5000,
	})
}

export function useTorrentPeers(hash: string | null) {
	return useQuery({
		queryKey: ['torrent-peers', hash],
		queryFn: () => api.getTorrentPeers(hash!),
		enabled: !!hash,
		refetchInterval: 2000,
	})
}

export function useTorrentFiles(hash: string | null) {
	return useQuery({
		queryKey: ['torrent-files', hash],
		queryFn: () => api.getTorrentFiles(hash!),
		enabled: !!hash,
	})
}

export function useTorrentWebSeeds(hash: string | null) {
	return useQuery({
		queryKey: ['torrent-webseeds', hash],
		queryFn: () => api.getTorrentWebSeeds(hash!),
		enabled: !!hash,
	})
}
