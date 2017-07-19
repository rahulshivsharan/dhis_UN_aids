'use strict';
var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var util = require('util');
var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;
  var routes = null;
  
  // Added logs just to check the values of baseDir and conf.paths.src
  // the reason is after "gulp build",  
  // when I used to run command "gulp serve:dist" it used to break.
  console.log(" Base Dir ",baseDir);
  console.log(" conf.paths.src ",conf.paths.src);
  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1) || baseDir === "dist") { // added last condition baseDir for value "dist" 
    routes = {
      '/bower_components': 'bower_components'
    };
  }
  routes['/manifest.webapp'] = 'gulp/mock.manifest.json';
  var server = {
    baseDir: baseDir,
    routes: routes
  };
  /*
   * You can add a proxy to your backend by uncommenting the line bellow.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
   */
  server.middleware = proxyMiddleware('/api', {
    target: 'http://127.0.0.1:8080/'
  });

  /*
      if you want to change the port of server,
      than add port in below configuration,
      as mentioned below link
      https://stackoverflow.com/questions/36950379/browser-sync-serve-command-with-different-port
  */
  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}
browserSync.use(browserSyncSpa({
  selector: '[ng-app]' // Only needed for angular apps
}));
gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});
gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});
gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});
gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
