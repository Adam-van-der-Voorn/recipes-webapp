// @ts-nocheck
import path, { dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Getting the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const base = {
    entry: {
        "main": {
            import: path.resolve(__dirname, 'src', 'index.tsx'),
            filename: [`js`, `main.bundle.js`].join(sep)

        },
        "service-worker": {
            import: path.resolve(__dirname, 'src', 'service-worker.js'),
            // service worker bundle _must_ have this filename
            filename: 'service-worker.js'
        }
    },
    output: {
        // needed as default hash fn has now been deemed insecure
        hashFunction: 'xxhash64',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        roots: ["src"],
    },
    optimization: {
        // minimize: false
    },
    performance: {
        hints: false,
    }
}

export default (env, argv) => {
    console.log("using args: ", argv)
    return base;
};