/**
 * Haiegoo.com Inc.
 * Copyright (c) 2014-2015 All Rights Reserved.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var velocity = require('velocityjs')
var fs = require('fs')
var config = require('./config')

var app = express();
exports.app = app;

// all environments
app.set('port', config.app.port);
app.set('views', path.join(__dirname, 'web_inf/views'));
app.set('view engine', 'vm');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('cookie'));
app.use(express.session());
app.use(express.csrf());
app.use(express.static(path.join(__dirname, 'web_res')));

// velocity template engine
app.engine('vm', function(fpath, options, fn) {
	try {
		if (!options)
			options = {}
		if ('function' == typeof options) {
			fn = options
			options = {}
		}
		var vm = fs.readFileSync(fpath, {
			encoding : 'utf8'
		})
		var macros = {
			'parse' : function(file) {
				var p = path.join(__dirname, 'web_inf/views/', file)
				if (fs.existsSync(p)) {
					return this.eval(fs.readFileSync(p, {
						encoding : 'utf8'
					}), options)
				} else {
					debug('Template not found: %s', p)
					throw new Error('Template not found: ' + p)
				}
			}
		}
		fn && fn(null, velocity.render(vm, options, macros))
	} catch (err) {
		fn && fn(err)
	}
})

// routes
require('./web_inf/routes');

// start server
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'))
})
