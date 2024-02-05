import gulp from 'gulp';
import uglify from 'gulp-uglify';
import inlineImport from 'gulp-inline-import';
import babel from 'gulp-babel';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';

import source from 'vinyl-source-stream';

console.error(process.env.NODE_ENV);

function buildFarm(cb) {
    browserify({
        entries: './src/farm/farm.js',
        debug: true
        // defining transforms here will avoid crashing your stream
        // transform: [babel({
        //     presets: [['@babel/env']]
        // })]
    }).transform('babelify', {
        presets: [['@babel/env', {
            targets: {
                esmodules: true,
                browsers: ['last 2 versions', 'ie >= 11']
            },
            modules: false
        }]]
    })
        .bundle()
        .pipe(source('farm.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist2'))
        .on('end', cb);

    // gulp.src('src/farm/farm.js')
    //     // .pipe(uglify())
    //     .pipe(babel({
    //         presets: [
    //             ['@babel/env', {
    //                 targets: {
    //                     esmodules: false,
    //                     browsers: ['last 2 versions', 'ie >= 11']
    //                 },
    //                 modules: false
    //             }]
    //         ]
    //         // targets: { chrome: 100 }
    //     }))
    //     // .pipe(inlineImport())
    //     // .pipe(inlineImport({ verbose: true }))
    //     // .pipe(uglify())
    //     .pipe(gulp.dest('dist2'))
    //     .on('end', cb);
}

function buildFarmInjected(cb) {
    gulp.src('src/farm/farmInjected.js')
        .pipe(uglify())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(inlineImport())
        .pipe(gulp.dest('dist2'))
        .on('end', cb);
}

function buildFarmBootstrap(cb) {
    gulp.src('src/farm/farmBootstrap.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist2'))
        .on('end', cb);
}

// gulp.task('default', (cb) => {
//     gulp.src('src/farm/farm.js')
//         .pipe(uglify())
//         .pipe(gulp.dest('dist2'))
//         .on('end', cb);
// });

export default gulp.series(buildFarm, buildFarmBootstrap, buildFarmInjected);

// if (process.env.NODE_ENV === 'production') {
//     export const build = gulp.series(buildFarm, buildFarmBootstrap, buildFarmInjected);
// } else {
//     exports.build = gulp.series(transpile, livereload);
// }
