import path from 'path'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

export default [
    {
        input: ['./src/index.ts'],
        output: {
            dir: 'dist',
            format: 'cjs',
            preserveModules: true,
        },
        external: [
            ...Object.keys(pkg.dependencies),
            ...Object.keys(pkg.devDependencies),
            /@babel\/runtime/,
        ],
        plugins: [
            resolve({ extensions: ['.ts', '.js'] }),
            babel({
                configFile: path.resolve(__dirname, '.babelrc'),
                extensions: ['.ts', '.js'],
                babelHelpers: 'runtime',
                skipPreflightCheck: true,
                include: ['src/**/*'],
            }),
        ],
    },
]
