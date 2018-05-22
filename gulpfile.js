const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const argv = require('yargs').argv;
const autoprefixer = require('gulp-autoprefixer');
const server = require('gulp-webserver');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');

const SASS_ENTRY = './src/scss/screen.scss';
const SASS_SRC = './src/scss/**/*.scss';
const CSS_DEST = './dist';
const CSS_FILENAME = 'style.css';
const MAPS_DEST = './maps';
const ASSET_FOLDERS = ['./src/images/**/*', './src/fonts/**/*', './src/templates/*.html'];

gulp.task('sass', () => {
    const sassConfig = {
        outputStyle: argv.production ? 'compressed' : 'expanded',
        includePaths: ['node_modules/breakpoint-sass/stylesheets/']
    };

    const autoprefixerConfig = {
        browsers: ['last 3 versions'],
        cascade: true
    };

    if (argv.production) {
        return gulp.src(SASS_ENTRY)
            .pipe(sass(sassConfig).on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerConfig))
            .pipe(rename(CSS_FILENAME))
            .pipe(gulp.dest(CSS_DEST))
    }

    return gulp.src(SASS_ENTRY)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerConfig))
        .pipe(sourcemaps.write(MAPS_DEST))
        .pipe(rename(CSS_FILENAME))
        .pipe(gulp.dest(CSS_DEST))
});

gulp.task('sass:watch', () =>
    gulp.watch(SASS_SRC, ['sass'])
);

gulp.task('watch-files', () =>
    watch(ASSET_FOLDERS, () =>
        gulp.start('copy-assets')
    )
);

gulp.task('watch', () => {
    gulp.watch(['./src/js/*.js', './src/js/**/*.js'], ['compile-js']);
    gulp.watch([ASSET_FOLDERS], ['copy-assets']);
});

gulp.task('copy-assets', () =>
    gulp.src(ASSET_FOLDERS, {"base": "src"})
        .pipe(gulp.dest('./dist/assets'))
);

gulp.task('clean-dist', () =>
    gulp.src('./dist', {read: false})
        .pipe(clean())
);

gulp.task('compile-js', () => {
    gulp.src('./src/js/scripts.js')
        .pipe(babel({
            presets: [["env", {
                "targets": {
                    "browsers": ["last 4 versions"]
                },
                "modules": false,
                "useBuiltIns": true
            }],
                "ES2015"]
        }))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('server', () =>
    gulp.src('dist')
        .pipe(server({
            livereload: false,
            open: 'http://localhost:8000/assets/templates/',
            proxies: [
                {source: './assets', target: 'http://localhost:8000/assets'}
            ]
        }))
);

gulp.task('dev', ['sass', 'sass:watch', 'compile-js', 'watch']);