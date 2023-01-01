import esbuild from 'esbuild';

esbuild.buildSync(
    {
        entryPoints: ['src/index.js'],
        bundle: true,
        minify: true,
        outfile: 'dist/pfinder.js'
    }
);