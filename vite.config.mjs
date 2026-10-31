import { defineConfig, loadEnv, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
    const publicNames = ['REACT_APP_SUPABASE_URL', 'REACT_APP_SUPABASE_ANON_KEY', 'REACT_APP_ALUMNI_ADMIN_EMAILS', 'REACT_APP_ALUMNI_PREVIEW_INVITE_CODE'];
    if (mode === 'test') env.REACT_APP_SUPABASE_URL = 'https://community.example.test';
    return {
        plugins: [
            // Existing components use .js filenames for JSX.
            {
                name: 'jsx-in-source-js',
                enforce: 'pre',
                transform(code, id) {
                    if (/\/src\/.*\.js$/.test(id)) return transformWithOxc(code, id.replace(/\.js$/, '.jsx'), { jsx: { runtime: 'automatic' } });
                }
            },
            react()
        ],
        // Keep the existing public configuration names and deployment secrets.
        define: Object.fromEntries(publicNames.map(key => [`process.env.${key}`, JSON.stringify(env[key] || '')])),
        build: {
            outDir: process.env.BUILD_PATH || 'build',
            // Portrait crop settings use the original filename before the first dot.
            rolldownOptions: { output: { assetFileNames: 'assets/[name].[hash][extname]' } }
        },
        test: {
            globals: true,
            environment: 'jsdom',
            include: ['src/**/*.test.{js,jsx}'],
            env: { REACT_APP_SUPABASE_URL: 'https://community.example.test' }
        }
    };
});
