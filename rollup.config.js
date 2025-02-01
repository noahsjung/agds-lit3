import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import summary from 'rollup-plugin-summary';
import replace from '@rollup/plugin-replace';

export default {
  input: './src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    typescript(),
    resolve(),
    commonjs(),
    summary(),
  ],
  preserveEntrySignatures: 'strict',
}; 