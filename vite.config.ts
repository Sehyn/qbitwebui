import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const target = env.QBITTORRENT_URL || 'http://localhost:8080'

	return {
		plugins: [react(), tailwindcss()],
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version),
		},
		server: {
			proxy: {
				'/api': {
					target,
					changeOrigin: true,
					secure: false,
					headers: {
						Referer: target,
						Origin: target,
					},
				},
			},
		},
	}
})
