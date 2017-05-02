var gulp = require("gulp"),
    less = require("gulp-less"),
    lessGlob = require("gulp-less-glob"),
    minifyCSS = require("gulp-csso"),
    uglify = require("gulp-uglify"),
    googleWebFonts = require("gulp-google-webfonts"),
    htmlreplace = require("gulp-html-replace"),
    replace = require("gulp-replace"),
    clean = require("gulp-clean");

var options = {
    fontsDir: "assets/fonts/",
    cssDir: "assets/css/",
    cssFilename: "fonts.css"
};

var baseAssetsDir = "src/assets";

gulp.task("clean", function () {
    return gulp.src("build/", {read: false})
        .pipe(clean());
});

gulp.task("fonts", ["clean"], function () {
    return gulp.src(baseAssetsDir + "/fonts/fonts.list")
        .pipe(googleWebFonts(options))
        .pipe(gulp.dest("build/"))
});

gulp.task("fontspathfixed", [ "fonts" ], function(){
    gulp.src(["build/assets/css/fonts.css"])
        .pipe(replace("assets/", "../"))
        .pipe(gulp.dest("build/assets/css/"));
});

gulp.task("css", ["fontspathfixed"], function(){
    return gulp.src(baseAssetsDir + "/less/*.less")
        .pipe(lessGlob())
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest("build/assets/css"))
});

gulp.task("js", ["css"], function(){
    gulp.src(baseAssetsDir + "/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("build/assets/js"));
});

gulp.task("html", ["js"], function() {
    gulp.src("src/*.html")
        .pipe(htmlreplace({
            "css": "assets/css/styles.css"
        }))
        .pipe(gulp.dest("build"));
});

gulp.task("copyassets", ["html"], function () {
    gulp.src([
        baseAssetsDir + "/**",
        "!" + baseAssetsDir + "/less{,/**}",
        "!" + baseAssetsDir + "/fonts{,/**}",
        "!" + baseAssetsDir + "/js{,/**}",
    ]).pipe(gulp.dest("build/assets"));
});

gulp.task("build", [ "copyassets" ]);
gulp.task("default", [ "build" ]);