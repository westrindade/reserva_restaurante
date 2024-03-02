import gulp from 'gulp';
import dartSass from 'sass';
import ts from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import del from 'delete';
import uglify from 'gulp-uglify';
import gulpSass from 'gulp-sass';
import rev from 'gulp-rev';
import concat from 'gulp-concat';
import { create as bsCreate } from 'browser-sync';
import * as dotenv from 'dotenv';
import nodemon from 'gulp-nodemon';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';

const { series, parallel, src, dest, watch } = gulp;
const sync = bsCreate();
const sass = gulpSass(dartSass);

const tsProject = ts.createProject('tsconfig.json');

const paths = {
  images: {
    src: 'src/public/images/*',
    dest: 'dist/public/images',
  },
  appJs: {
    src: 'src/public/js/app/*.js',
    dest: 'dist/public/js/app',
  },
  views: {
    src: ['src/views/**/*.pug'],
    dest: 'dist/views',
  },
  scss: {
    src: 'src/scss/*.scss',
    dest: 'dist/public/css',
  },
}

// export function generateCSS() {
//   return gulp.src(paths.scss.src).pipe(gulp.dest(paths.scss.dest));
// }

export function generateCSS() {
  return gulp
    .src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest));
}

export function copyEnvs() {
  return src('.env*').pipe(dest('./dist'));
}

export function copyImages() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
}

export function copyViews() {
  return gulp.src(paths.views.src).pipe(gulp.dest(paths.views.dest));
}

export function copyNodeModules() {
  var modules = ['bootstrap', 'axios', 'jquery', 'inputmask'];
  return gulp.src(modules.map(m => `node_modules/${m}*/**/*`), { base: 'node_modules' }).pipe(gulp.dest('dist/node_modules'));
}

export function compileTS() {
  return tsProject.src().pipe(sourcemaps.init()).pipe(tsProject()).js.pipe(uglify()).pipe(sourcemaps.write()).pipe(gulp.dest('./dist'));
}

// Pack js and copy
export function packJs() {
  return src(paths.appJs.src)
    .pipe(concat('bundle.js'))
    .pipe(rev())
    .pipe(uglify())
    .pipe(dest(paths.appJs.dest))
    .pipe(
      rev.manifest('rev-manifest.json', {
        merge: true,
      }),
    )
    .pipe(dest('./src'))
    .pipe(dest('./dist'));
}

export function copyRevManifest() {
  return src('./src/rev-manifest.json').pipe(dest('./dist'));
}

export function clean() {
  return del(['./dist/**', './dist/.env*', '!dist/']);
}

export function watchFiles(cb) {
  watch(['./src/*.ts', './src/**/*.ts'], compileTS);
  watch('./src/public/js/app/*', packJs);
  watch('./src/scss', generateCSS);
  watch('./src/public/images', copyImages);
  watch('./src/views', copyViews);
  watch('./src').on('change', sync.reload);
  cb();
}

// Run Browser Sync
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true, override: true });
export function browserSync() {
  return sync.init({
    port: 3000,
    proxy: `http://localhost:${process.env.PORT}`,
    open: false,
    reloadDelay: 1000, // Wait one second before refreshing.
  });
}

// Run server
export function server(cb) {
  let started = false;
  const stream = nodemon({
    script: './dist/index.js',
    watch: ['./dist/*.js', './dist/**/*.js'],
    env: { NODE_ENV: process.env.NODE_ENV || 'development' },
    ignore: ['./node_modules/**', './dist/modules/**', './src/**'],
  });
  stream
    .on('start', () => {
      if (!started) {
        console.info('Application started!');
        started = true;
        cb();
      }
    })
    .on('crash', function () {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10); // restart the server in 10 seconds
    });
}

export const build = series(
  clean,
  packJs,
  parallel(copyEnvs, generateCSS, copyViews, copyImages, copyNodeModules),
  compileTS
);

export const dev = series(
  clean,
  packJs,
  parallel(copyEnvs, generateCSS, copyViews, copyImages, copyNodeModules),
  compileTS,
  server,
  watchFiles,
  browserSync 
);