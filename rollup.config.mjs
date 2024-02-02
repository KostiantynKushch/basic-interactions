import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/basic-interactions.js',
      format: 'es',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
};
