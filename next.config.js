const withMDX = require('@next/mdx')()

module.exports = withMDX({
  // future: {
  //   webpack5: true,
  // },
  images: {
    domains: ['bit.ly', 'i.redd.it'],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  webpack: (config, {isServer}) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
      }
    }

    return config
  },
  // webpack: (config, {isServer}) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {fs: false, path: false}
  //   }

  //   // config.resolve = {
  //   //   ...config.resolve,
  //   //   fallback: {
  //   //     fs: false,
  //   //   },
  //   // }

  //   return config
  // },
})
