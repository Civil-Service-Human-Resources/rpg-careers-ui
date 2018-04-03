const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const argv = require('yargs').argv;
const autoprefixer = require('gulp-autoprefixer');
const server = require('gulp-webserver');
const clean = require('gulp-clean');
const watch = require('gulp-watch');

const SASS_ENTRY = './src/scss/screen.scss';
const SASS_SRC = './src/scss/**/*.scss';
const CSS_DEST = './dist';
const CSS_FILENAME = 'style.css';
const MAPS_DEST = './maps';
const ASSET_FOLDERS = ['./src/images/**/*', './src/fonts/**/*', './src/templates/*.html', './src/js/**/*'];

gulp.task('sass', () => {
    const sassConfig = {
        outputStyle: argv.production ? 'compressed' : 'expanded',
        includePaths: ['node_modules/breakpoint-sass/stylesheets/']
    };

    const autoprefixerConfig = {
        browsers: ['last 3 versions'],
        cascade: true
    };

    if(argv.production) {
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

gulp.task('copy-assets', () =>
    gulp.src(ASSET_FOLDERS, {"base": "src"})
        .pipe(gulp.dest('./dist/assets'))
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
            proxies: [
                { source: './assets', target: 'http://localhost:8000/assets' }
            ],
            fallback: './assets/templates/index.html'
        }))
);

gulp.task('dev', ['sass', 'sass:watch', 'watch-files', 'server']);