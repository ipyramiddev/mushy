module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  style: {
    postcss: {
      plugins: [
        require("tailwindcss"), 
        require('postcss-nesting'),
        require("autoprefixer"),
      ],
    },
  },
};
