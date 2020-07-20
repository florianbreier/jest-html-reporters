
const plugins = [
  ['import-separation', { 'libraryName': 'antd', 'style': true }],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-transform-runtime',
  'react-hot-loader/babel',
]

module.exports = function(api) {
  const envOptions = {
    useBuiltIns: 'usage',
    corejs: 3
  }
  if (api.env('production')) {
    envOptions.targets = "defaults"
  }
  const presets = [
    ['@babel/env', {
      ...envOptions
    }],
    '@babel/react',
  ]

  return { presets, plugins }
}
