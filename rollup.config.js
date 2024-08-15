// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: './index.js',
  output: {
    file: 'build/bundle.js',
    format: 'esm',
    strict: false,
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: ['node_modules/**/*'],
      babelrc: false,
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          // {
          //   targets: {
          //     browsers: '> 0.5%, ie >= 11',
          //   },
          //   useBuiltIns: 'usage',
          //   corejs: 3,
          // },
        ],
      ],
      plugins: ['@babel/runtime', {
        absoluteRuntime: false,
        corejs: 3,
        helpers: true,
        regenerator: true,
        version: '7.0.0-beta.0',
      }],
    }),
  ],
};
