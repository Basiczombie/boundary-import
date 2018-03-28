import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import pkgInfo from 'pkginfo'

pkgInfo(module)

module.exports = {
    mode: 'production',
    node: {
        fs: 'empty'
    },
    entry: {
        index: './src/scripts/boundary-import/js/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: 'css/[name].bundle.css'
        })
    ],
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, `dist/web_root/scripts/${module.exports.name}/`),
        library: 'boundary'
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-es2015-modules-amd']
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    collapseWhitespace: true
                }
            },
            {
                test: /\.css$/,
                loader: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js']
    }
}
