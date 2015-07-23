var gulp = require('gulp');
var zip = require('gulp-zip');
var git = require('git-rev')


gulp.task('pack', function() {
  git.short(function(str) {
    return gulp.src('dist/*')
      .pipe(zip('threebund-'+ str +'.zip'))
      .pipe(gulp.dest('target'));
  });
});
