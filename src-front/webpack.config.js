const path = require('path');

const config = {
    context: path.resolve(__dirname, '.'),
    entry: {
        game: './game.ts',
    },
    mode: 'production',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            }
                        }
                    }],

            }]
    },
    output: {
        path: path.resolve(__dirname, '../public/js')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map';
        config.mode = 'development';

        delete (config.externals);
    }

    return config;
};