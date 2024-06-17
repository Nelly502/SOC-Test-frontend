import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { antdDayjs } from 'antd-dayjs-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgrPlugin(), antdDayjs()],
    base: process.env.VITE_BASE_PATH,
    server: {
        open: true,
        port: 3000,
        host: '0.0.0.0',
    },
    build: {
        outDir: 'build',
    },
});
