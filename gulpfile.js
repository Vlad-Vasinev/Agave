const { src, dest, series, watch } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const browserSync = require("browser-sync").create();
const sass = require("sass");
const pug = require("gulp-pug");
const concat = require("gulp-concat");
const bulk = require("gulp-sass-bulk-importer");
const gulpSass = require("gulp-sass");
const svgSprite = require("gulp-svg-sprite");
const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");
const fileInclude = require("gulp-file-include");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const revDel = require("gulp-rev-delete-original");
const htmlmin = require("gulp-htmlmin");
const gulpif = require("gulp-if");
const notify = require("gulp-notify");
const image = require("gulp-imagemin");
const { readFileSync } = require("fs");
// const typograf = require('gulp-typograf');
const webp = require("gulp-webp");
const mainSass = gulpSass(sass);
const webpackStream = require("webpack-stream");
const plumber = require("gulp-plumber");
const path = require("path");
const zip = require("gulp-zip");
const rootFolder = path.basename(path.resolve());

// paths
const srcFolder = "./src";
const buildFolder = "./app";
const paths = {
  srcSvg: `${srcFolder}/img/svg/**.svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcScss: [`${srcFolder}/scss/**/*.scss`, `${srcFolder}/scss/**/*.sass`],
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/**/*.{js,ts}`,
  srcMainJs: `${srcFolder}/js/main.js`,
  buildJsFolder: `${buildFolder}/js`,
  buildApiFolder: `${buildFolder}/api`,
  srcComponentsFolder: `${srcFolder}/components`,
  resourcesFolder: `${srcFolder}/resources`,
  apiFolder: `${srcFolder}/resources/api`,
};

let isProd = false; // dev by default

const clean = () => {
  return del([buildFolder]);
};

//svg sprite
const svgSprites = () => {
  return src(paths.srcSvg)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: {
          xmlMode: true,
        },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest(paths.buildImgFolder));
};

const Sprites = () => {
  return src('./src/img/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../GG.svg"
        }
      },
    }
    ))
    .pipe(dest('./app/img/svg'));
}

// scss styles
const styles = () => {
  return src(paths.srcScss, { sourcemaps: !isProd })
    .pipe(
      plumber(
        notify.onError({
          title: "SCSS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(bulk())
    .pipe(mainSass())
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: ["last 5 versions"],
      })
    )
    .pipe(
      gulpif(
        isProd,
        cleanCSS({
          level: 2,
        })
      )
    )
    .pipe(dest(paths.buildCssFolder, { sourcemaps: "." }))
    .pipe(browserSync.stream());
};

// styles backend
const stylesBackend = () => {
  return src(paths.srcScss)
    .pipe(
      plumber(
        notify.onError({
          title: "SCSS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(bulk())
    .pipe(mainSass())
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: ["last 5 versions"],
      })
    )
    .pipe(dest(paths.buildCssFolder))
    .pipe(browserSync.stream());
};


// 
// const TerserPlugin = require('terser-webpack-plugin');

// module.exports = {
//   //...
//   optimization: {
//     minimize: true,
//     minimizer: [new TerserPlugin()],
//   },
// };


// scripts
const scripts = () => {
  return src(paths.srcMainJs)
    .pipe(
      plumber(
        notify.onError({
          title: "JS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'main.js',
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      // optimization: {
      // TODO добавить terser
      // СТРОЧКА 154
      // },
      module: {
        rules: [
          // jQuery expose loader
          {
            test: require.resolve('jquery'),
            loader: 'expose-loader',
            options: {
              exposes: ['$', 'jQuery'],
            },
          },
          // TypeScript loader
          {
            test: /\.m?ts$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript'],
              },
            },
          },
          // JavaScript loader (for any additional JS files)
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: 'defaults',
                    },
                  ],
                ],
              },
            },
          }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
};

// const scripts = () => {
//   return src(paths.srcMainJs)
//     .pipe(plumber(
//       notify.onError({
//         title: "JS",
//         message: "Error: <%= error.message %>"
//       })
//     ))
//     .pipe(webpackStream({
//       mode: isProd ? 'production' : 'development',
//       output: {
//         filename: 'main.js',
//       },
//       module: {
//         rules: [{
//           test: /\.m?js$/,
//           exclude: /node_modules/,
//           use: {
//             loader: 'babel-loader',
//             options: {
//               presets: [
//                 ['@babel/preset-env', {
//                   targets: "defaults"
//                 }]
//               ]
//             }
//           }
//         }]
//       },
//       devtool: !isProd ? 'source-map' : false
//     }))
//     .on('error', function (err) {
//       console.error('WEBPACK ERROR', err);
//       this.emit('end');
//     })
//     .pipe(dest(paths.buildJsFolder))
//     .pipe(browserSync.stream());
// }

// scripts backend
const scriptsBackend = () => {
  return src(paths.srcMainJs)
    .pipe(
      plumber(
        notify.onError({
          title: "JS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      webpackStream({
        mode: "development",
        output: {
          filename: "main.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        targets: "defaults",
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
        devtool: false,
      })
    )
    .on("error", function (err) {
      console.error("WEBPACK ERROR", err);
      this.emit("end");
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
};

const resources = () => {
  return src(`${paths.resourcesFolder}/**`).pipe(dest(buildFolder));
};

const images = () => {
  return (
    src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg,mp4,webm,webp}`])
      // .pipe(gulpif(isProd, image([
      //   image.mozjpeg({
      //     quality: 80,
      //     progressive: true
      //   }),
      //   image.optipng({
      //     optimizationLevel: 2
      //   }),
      // ])))
      .pipe(dest(paths.buildImgFolder))
  );
};
const api = () => {
  return src([`${paths.apiFolder}/**/**.{json}`]).pipe(
    dest(paths.buildApiFolder)
  );
};

const webpImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(webp())
    .pipe(dest(paths.buildImgFolder));
};

const pugHtml = () => {
  return src([`${srcFolder}/pages/*.pug`, `!${srcFolder}/components/**/*.pug`])
    .pipe(pug({ pretty: true }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
};
// const htmlInclude = () => {
//   return src([`${srcFolder}/*.html`])
//     .pipe(fileInclude({
//       prefix: '@',
//       basepath: '@file'
//     }))
//     .pipe(typograf({
//       locale: ['ru', 'en-US']
//     }))
//     .pipe(dest(buildFolder))
//     .pipe(browserSync.stream());
// }

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`,
      serveStaticOptions: {
        extensions: ["html"],
      },
      online: false,
    },
  });

  watch(paths.srcScss, styles);
  watch(paths.srcFullJs, scripts);
  // watch(`${paths.srcComponentsFolder}/*.html`, htmlInclude);
  // watch(`${srcFolder}/*.html`, htmlInclude);
  watch(`${srcFolder}/**/*.pug`, pugHtml);
  watch(`${paths.resourcesFolder}/**`, resources);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg,webm,webp,mp4}`, images);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, webpImages);
  watch(paths.srcSvg, svgSprites);
  watch("./src/img/svg/*.svg", Sprites);
};

const cache = () => {
  return src(`${buildFolder}/**/*.{css,js,svg,png,jpg,jpeg,webp,woff2}`, {
    base: buildFolder,
  })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest(buildFolder))
    .pipe(rev.manifest("rev.json"))
    .pipe(dest(buildFolder));
};

const rewrite = () => {
  const manifest = readFileSync("app/rev.json");
  src(`${paths.buildCssFolder}/*.css`)
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(dest(paths.buildCssFolder));
  return src(`${buildFolder}/**/*.html`)
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(dest(buildFolder));
};

// const htmlMinify = () => {
//   return src(`${buildFolder}/**/*.html`)
//     .pipe(htmlmin({
//       collapseWhitespace: true
//     }))
//     .pipe(dest(buildFolder));
// }

const zipFiles = (done) => {
  del.sync([`${buildFolder}/*.zip`]);
  return src(`${buildFolder}/**/*.*`, {})
    .pipe(
      plumber(
        notify.onError({
          title: "ZIP",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(zip(`${rootFolder}.zip`))
    .pipe(dest(buildFolder));
};

const toProd = (done) => {
  isProd = true;
  done();
};

// exports.default = series(clean, htmlInclude, scripts, styles, resources, images, webpImages, svgSprites, watchFiles);
exports.default = series(clean, pugHtml, scripts, styles, resources, images, svgSprites, Sprites, watchFiles);

// exports.backend = series(clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, webpImages, svgSprites)
exports.backend = series(
  clean,
  pugHtml,
  scriptsBackend,
  stylesBackend,
  resources,
  images,
  svgSprites,
  Sprites
);

// exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, webpImages, svgSprites, htmlMinify);
exports.build = series(
  toProd,
  clean,
  pugHtml,
  scripts,
  styles,
  resources,
  images,
  svgSprites,
  Sprites
);

exports.style = series(toProd, styles);

exports.script = series(toProd, scripts);

exports.html = series(toProd, pugHtml);

exports.cache = series(cache, rewrite);

exports.zip = zipFiles;
