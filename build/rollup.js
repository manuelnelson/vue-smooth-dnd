// ------------------------------------------------------------------------------------------
// setup
// ------------------------------------------------------------------------------------------
import path from 'path';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import license from 'rollup-plugin-license';
import uglify from 'rollup-plugin-uglify';


const pkg = require('../package.json')
const external = Object.keys(pkg.dependencies || {})
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())

function output (ext, format = 'umd') {
  return {
    name: className,
    file: `dist/${name}.${ext}`,
    format: format,
    exports: 'named',
    output: {
      globals: {
        'smooth-dnd': 'SmoothDnD'
      }  
    }
  }
}

// ------------------------------------------------------------------------------------------
// build
// ------------------------------------------------------------------------------------------

const umd = {
  input: 'src/main.js',
  external: external,
  output: output('js'),
  plugins: [
    license({
      banner: {
        file: path.join(__dirname, 'banner.txt')
      },
    }),
    commonjs(),
    buble()
  ]
}

const min = Object.assign({}, umd, {
  output: output('min.js'),
  plugins: [...umd.plugins, uglify()]
})

const es = Object.assign({}, umd, {
  output: output('esm.js', 'es')
})

export default [umd, min, es]
