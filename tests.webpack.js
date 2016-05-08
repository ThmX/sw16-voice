var context = require.context('./src/javascripts', true, /\.js$/);
context.keys().forEach(context);