/* eslint-disable */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'classic',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    esbuild: {
        loader: 'jsx',
        jsxInject: "import PropTypes from 'prop-types'",
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        },
    },
    build: {
        chunkSizeWarningLimit: 600,
        cssCodeSplit: false,
    },
})
