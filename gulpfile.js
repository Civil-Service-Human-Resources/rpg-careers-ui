const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const argv = require('yargs').argv;
const autoprefixer = require('gulp-autoprefixer');
const server = require('gulp-webserver');
const clean = require('gulp-clean');

const SASS_ENTRY = './src/sass/screen.scss';
const SASS_SRC = './src/sass/**/*.scss';
const CSS_DEST = './dist/css';
const CSS_MAPS_DEST = './maps';
const CSS_FILENAME = argv.production ? 'style.min.css' : 'style.css';
const ASSET_FOLDERS = ['./src/images/**/*', './src/fonts/**/*', './src/templates/*.html'];

gulp.task('sass', () => {
    const sassConfig = {
        outputStyle: argv.production ? 'compressed' : 'expanded'
    };

    const autoprefixerConfig = {
        browsers: ['last 3 versions'],
        cascade: true
    };

    return gulp.src(SASS_ENTRY)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerConfig))
        .pipe(sourcemaps.write(CSS_MAPS_DEST))
        .pipe(rename(CSS_FILENAME))
        .pipe(gulp.dest(CSS_DEST))
});

gulp.task('sass:watch', () =>
    gulp.watch(SASS_SRC, ['sass'])
);

gulp.task('copy-assets', () =>
    gulp.src(ASSET_FOLDERS, {"base": "src"})
        .pipe(gulp.dest('./dist'))
);

gulp.task('clean-dist', () =>
    gulp.src('./dist', { read: false })
        .pipe(clean())
);

gulp.task('server', () =>
    gulp.src('dist')
        .pipe(server({
            livereload: true,
            open: true,
            fallback: './templates/index.html'
        }))
);

gulp.task('sass:dev', ['sass', 'sass:watch']);