const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CssEntryPlugin = require('css-entry-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    mode: 'development',
    entry: './js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
          {
            test: /\.css$/, 
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader'],
            options: {
                name: './images/[name].[ext]'
            }
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['file-loader']
          },
          {
            test: /\.html$/,
            use: ['html-loader']
          }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new CssEntryPlugin({
        //     output: {
        //         filename: 'bundle.css'
        //     }
        // }),
        new ExtractTextPlugin('css/style.css'),
        new HtmlWebpackPlugin({
            minify: { // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空白符与换行符
                minifyCSS: true// 压缩内联css
            },
            filename: 'index.html', // 输入名
            template: './index.html', // 模版
            inject: 'body'
        })
    ],
    watch: true,
    devServer: {
        port: 9000,
        contentBase: './dist'    //在dist目录，启动服务器
    }
}