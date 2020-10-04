import typescript from '@rollup/plugin-typescript'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import pkg from './package.json'

export default [
    {
        input: './src/index.ts',
        output: {
            dir: pkg.main,
            format: 'cjs',
            plugins: getBabelOutputPlugin({
                presets: ['@babel/preset-env'],
            }),
        },
        plugins: [typescript()],
    },
]
