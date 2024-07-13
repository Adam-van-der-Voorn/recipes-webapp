// @ts-nocheck
const path = require('path');

const base = {
    entry: {
        "main": {
            import: './src/index.tsx',
            filename: 'js/main.bundle.js'
        },
        "service-worker": {
            import: './src/service-worker.js',
            // service worker bundle _must_ have this fn
            filename: 'service-worker.js'
        }
    },
    output: {
        // needed as default hash fn has now been deemed insecure
        hashFunction: 'xxhash64',
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
}

module.exports = (env, argv) => {
    console.log("using args: ", argv)
    return base;
};