const gulp = require("gulp");
const config = require("./gulp-config")();
const env = require("./gulp-env")();
const browserSync = require("browser-sync").create();
const runSequence = require("run-sequence").use(gulp);
const $ = require("gulp-load-plugins")({ lazy: true });
const del = require("del");

////////////////
// Default Tasks
gulp.task("default", ["help"]);
gulp.task("help", $.taskListing);

///////////////
// Global Jobs
gulp.task("__start-local__", () => {
    runSequence(
        // "clean:build",
        "task:start-node",
        "task:compile-styles",
        "task:compile-scripts",
        "task:compile-html",
        "task:compile-images",
        "task:start-watch"
    );
});
gulp.task("__compile-assets__", () => {
    runSequence(
        // "clean:build",
        "task:compile-styles",
        "task:compile-scripts",
        "task:compile-html",
        "task:compile-images"
    );
});
gulp.task("__lint-everything__", () => {
    runSequence("_lint-styles_", "_lint-scripts_");
});

////////////////
// Local Tasks
gulp.task("clean:build", () => {
    return del([env.buildPath]);
});

gulp.task("task:start-node", cb => {
    var called = false;
    return $.nodemon({
        script: "app.js",
        ignore: ["gulpfile.js", "node_modules/"]
    })
        .on("start", () => {
            if (!called) {
                called = true;
                cb();
            }
        })
        .on("restart", () => {
            setTimeout(() => {
                reload({ stream: false });
            }, 500);
        });
});

gulp.task("task:compile-styles", () => {
    return gulp
        .src(config.styles.source)
        .pipe(errorHandler())
        .pipe($.sourcemaps.init())
        .pipe($.sass(config.options.sass))
        .pipe($.autoprefixer(config.options.autoPrefixerOptions))
        .pipe($.sourcemaps.write("./"))
        .pipe(gulp.dest(config.styles.build))
        .pipe(browserSync.stream());
});

gulp.task("task:compile-scripts", () => {
    return gulp
        .src(config.scripts.source)
        .pipe(errorHandler())
        .pipe($.changed(config.scripts.build))
        .pipe($.babel(config.options.babelEnvOptions))
        .pipe(gulp.dest(config.scripts.build))
        .pipe(browserSync.stream());
});

gulp.task("task:compile-html", () => {
    return gulp
        .src(config.html.source)
        .pipe($.changed(config.html.build))
        .pipe(gulp.dest(config.html.build));
});

gulp.task("task:compile-images", () => {
    return gulp
        .src(config.images.source)
        .pipe($.changed(config.images.build))
        .pipe(gulp.dest(config.images.build));
});

gulp.task("task:start-watch", ["task:start-browser-sync"], () => {
    gulp.watch(config.styles.source, () => {
        runSequence("task:compile-styles");
    });
    gulp.watch(config.html.source, () => {
        runSequence("task:compile-html", "task:page-reload");
    });
    gulp.watch(config.scripts.source, () => {
        runSequence("task:compile-scripts", "task:page-reload");
    });
    gulp.watch(config.images.source, () => {
        runSequence("task:compile-images", "task:page-reload");
    });
});

gulp.task("task:start-browser-sync", () => {
    if (env.devURL == "./") {
        config.browserSync["server"] = {
            baseDir: `${env.buildPath}/`
        };
    } else {
        config.browserSync["proxy"] = env.devURL;
    }
    browserSync.init(null, config.browserSync);
});

gulp.task("task:page-reload", () => {
    browserSync.reload();
});

///////////////////
// Linting Tasks

gulp.task("_lint-styles", () => {
    runSequence("clean:sass", "lint:sass");
});

gulp.task("clean:sass", () => {
    return gulp
        .src(config.styles.source)
        .pipe($.changed(config.styles.source[0]))
        .pipe($.jsbeautifier(config.options.formatting))
        .pipe($.jsbeautifier.reporter())
        .pipe(gulp.dest(`${env.basePath}/Styles`));
});

gulp.task("lint:sass", () => {
    return gulp
        .src(config.styles.source)
        .pipe($.sassLint(config.options.lint.sass))
        .pipe($.sassLint.format());
});

gulp.task("_lint-scripts_", () => {
    runSequence("clean:js", "lint:js");
});

gulp.task("clean:js", () => {
    return gulp
        .src(config.scripts.source)
        .pipe($.changed(config.scripts.source))
        .pipe($.jsbeautifier(config.options.formatting))
        .pipe($.jsbeautifier.reporter())
        .pipe(gulp.dest(`${env.srcPath}/scripts`));
});

gulp.task("lint:js", () => {
    return gulp
        .src(config.scripts.source)
        .pipe($.eslint(config.options.lint.js))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

///////////////////////////
// Functions
///////////////////////////
function errorHandler() {
    return $.plumber({
        errorHandler: function(err) {
            $.notify.onError({
                title: `Error : ${err.plugin}`,
                message: `Issue : ${err}`,
                sound: false
            })(err);

            console.log(`
/////////////////////////////////////
/////////////////////////////////////
Error: ${err.plugin}
Issue : ${err}
/////////////////////////////////////
/////////////////////////////////////
`);
            this.emit("end");
        }
    });
}
