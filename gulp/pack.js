var gulp = require('gulp');
var zip = require('gulp-zip');
var shell = require('gulp-shell');
var argv = require('yargs').argv;
var ngConstant = require('gulp-ng-constant');
gulp.task('pack', ['build'], function() {
    return gulp.src('dist/**/*').pipe(zip('spectrum.zip')).pipe(gulp.dest('target'));
});
gulp.task('deploy', ['pack'], function() {
    var username = argv.username || 'admin';
    var password = argv.password || 'district';
    var url = argv.url || 'http://localhost:8080';

    return gulp.src('target/spectrum.zip').pipe(shell(['curl -X DELETE -u ' + username + ':' + password + ' ' + url +
        '/api/apps/spectrum', 'curl -X POST -u' + username + ':' + password + ' -F file=@<%= file.path %> ' + url +
        '/api/apps'
    ]));
});
gulp.task('config', function() {
    var serverPath = argv.srv_path || '';
    gulp.src('gulp/config.json').pipe(ngConstant({
        name: 'threebund.config',
        constants: {
            'serverPath': serverPath
        }
    })).pipe(gulp.dest('src/app'));
});
