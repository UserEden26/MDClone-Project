import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const envFilePath =
        mode === 'development'
            ? path.resolve(__dirname, '.env.example')
            : path.resolve(__dirname, '.env');

    if (fs.existsSync(envFilePath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envFilePath));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
    return {
        plugins: [react()],
        base: '/',
        server: {
            host: true,
            port: 8000,
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                shared: path.resolve(__dirname, '../shared'),
            },
        },
        define: {
            'process.env': process.env,
        },
    };
});
