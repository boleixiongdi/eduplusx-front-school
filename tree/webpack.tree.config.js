var path = require('path');

module.exports={
	entry:path.resolve(__dirname,'tree.jsx'),
	output:{
		/*path:path.resolve(__dirname,'./tree'),*/
		filename:'build.js',
	},
	
	module: {
	    loaders:[
	      { test: /\.(css|less)$/, loader: 'style-loader!css-loader?localIdentName=[hash:base64:8]!less-loader' },
	      { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader' },
	      { test: /\.(ttf|eot|woff|woff2|otf|svg)/, loader: 'file-loader?name=./font/[name].[ext]' },
      	  { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=10000&name=./images/[name].[ext]' }
	    ]
	  },
	  watch: true
};