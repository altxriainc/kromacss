import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/js/main.js', 
  output: [
    {
      file: 'dist/js/main.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/js/main.min.js',
      format: 'es',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    css({
      output: 'dist/css/main.css' 
    })
  ],
  watch: {
    include: 'src/**', 
    clearScreen: false
  }
};
