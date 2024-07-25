import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        // Resolve the path relative to the current directory
        path: resolve(__dirname, 'dist'),
    }
}
