import esbuild from 'esbuild'

esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/blockchain-rpc.js',
    format: 'cjs',
    bundle: true,
    platform: "node"
})
