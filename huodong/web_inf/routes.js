var app = require('../app').app;

//首页
app.get('/', require('./controller').index);