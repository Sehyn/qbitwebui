import { useQuery } from '@tanstack/react-query'
import { getTransferInfo } from '../api/qbittorrent'

export function useTransferInfo() {
	return useQuery({
		queryKey: ['transferInfo'],
		queryFn: getTransferInfo,
		refetchInterval: 2000,
	})
}
