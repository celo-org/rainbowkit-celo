const withTM = require("next-transpile-modules")(["@celo/rainbowkit-celo"]);
const withMDX = require("@next/mdx")()
module.exports = withMDX(
  withTM({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { webpack }) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        child_process: false,
        readline: false,
        // crypto: false,
        // http: false,
        // https: false,
        // url: false,
        // zlib: false,
        // stream: false,
        // tls: false,
      }
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^electron$/ })
      )
      return config
    },

    async rewrites() {
      return [
        {
          source: "/:path*",
          destination: "/",
        },
      ]
    },
  })
)
