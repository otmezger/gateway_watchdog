var gulp = require('gulp');
var rsync = require('gulp-rsync');
var watch = require('gulp-watch');



gulp.task('deploy', function() {
  gulp.src('./*')
    .pipe(rsync({
      root: './',
      username: 'energy',
      hostname: '192.168.1.116',
      exclude:['package.json','gulpfile.js','./node_modules'],
      destination: '/home/energy/productive/ipLogger'
    }));
});

gulp.task('watch', function () {
        gulp.watch('./*.py', ['deploy']);
})
