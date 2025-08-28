// gulpfile.js — Gulp v4 + Dart Sass + PostCSS + Puppeteer PDF
const { src, dest, series, parallel, watch } = require('gulp');
const path = require('path');
const fs = require('fs');

const dartSass = require('sass');
const gulpSass = require('gulp-sass')(dartSass);
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const through = require('through2');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');

const mustache = require('mustache');
const puppeteer = require('puppeteer');

const isProd = process.env.NODE_ENV === 'production';
const distPath = 'build';

const paths = {
  htmlTpl: 'src/index.template',
  htmlRuTpl: 'src/index.ru.template',
  pdfTpl: 'src/pdf.template',
  pdfRuTpl: 'src/pdf.ru.template',
  stylesEntry: 'src/scss/main.scss',
  stylesWatch: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  icons: 'src/icons/**',
  fonts: 'src/fonts/**'
};

const resumeJson = require('./src/resume.json');
const resumeRuJson = require('./src/resume.ru.json');

// del@7 — ESM only: используем динамический импорт
async function clean() {
  const { deleteAsync } = await import('del');
  return deleteAsync(
    [
      `${distPath}/css`,
      `${distPath}/js`,
      `${distPath}/webfonts`,
      `${distPath}/fonts`,
      `${distPath}/index*.html`,
      `${distPath}/resume*.pdf`
    ],
    { force: true }
  );
}

// ---------- HTML ----------
function html() {
  return src(paths.htmlTpl)
    .pipe(
      through.obj((file, _, cb) => {
        const template = file.contents.toString();
        file.contents = Buffer.from(mustache.render(template, resumeJson));
        cb(null, file);
      })
    )
    .pipe(rename('index.html'))
    .pipe(dest(distPath));
}

function htmlRu() {
  return src(paths.htmlRuTpl)
    .pipe(
      through.obj((file, _, cb) => {
        const template = file.contents.toString();
        file.contents = Buffer.from(mustache.render(template, resumeRuJson));
        cb(null, file);
      })
    )
    .pipe(rename('index.ru.html'))
    .pipe(dest(distPath));
}

// ---------- PDF (Puppeteer) ----------
async function renderPdfFromTemplate({ templatePath, data, outPath, baseHrefDir }) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const html = `<base href="file://${baseHrefDir.replace(/\\/g, '/')}/">\n${mustache.render(
    template,
    data
  )}`;

  const launchArgs = process.env.PPTR_NO_SANDBOX
    ? { headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    : { headless: 'new' };

  const browser = await puppeteer.launch(launchArgs);
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '10mm', right: '10mm', bottom: '12mm', left: '10mm' }
    });
  } finally {
    await browser.close();
  }
}

async function pdfEn() {
  await renderPdfFromTemplate({
    templatePath: paths.pdfTpl,
    data: resumeJson,
    outPath: path.join(distPath, 'resume.pdf'),
    baseHrefDir: path.resolve(distPath)
  });
}

async function pdfRu() {
  await renderPdfFromTemplate({
    templatePath: paths.pdfRuTpl,
    data: resumeRuJson,
    outPath: path.join(distPath, 'resume.ru.pdf'),
    baseHrefDir: path.resolve(distPath)
  });
}

// ---------- Assets ----------
function webfonts() {
  // Font Awesome webfonts → build/webfonts
  return src('node_modules/@fortawesome/fontawesome-free/webfonts/*').pipe(
    dest(`${distPath}/webfonts`)
  );
}

function icons() {
  return src(paths.icons).pipe(dest(`${distPath}/`));
}
function fonts() {
  return src(paths.fonts).pipe(dest(`${distPath}/fonts`));
}

// ---------- Styles ----------
function styles() {
  return src(paths.stylesEntry, { allowEmpty: true })
    .pipe(!isProd ? sourcemaps.init() : through.obj())
    .pipe(
      gulpSass
        .sync({
          quietDeps: true,
          // чтобы @use "normalize.css/..." и @use "@fortawesome/..." работали без относительных путей
          includePaths: ['node_modules']
        })
        .on('error', gulpSass.logError)
    )
    .pipe(postcss([autoprefixer(), ...(isProd ? [cssnano()] : [])]))
    .pipe(rename({ basename: 'app', suffix: '.min' }))
    .pipe(!isProd ? sourcemaps.write('.') : through.obj())
    .pipe(dest(`${distPath}/css`));
}

// ---------- Scripts ----------
function scripts() {
  return src(paths.js, { allowEmpty: true })
    .pipe(!isProd ? sourcemaps.init() : through.obj())
    .pipe(
      terser().on('error', function (err) {
        console.error('JS error:', err);
        this.emit('end');
      })
    )
    .pipe(rename({ basename: 'app', suffix: '.min' }))
    .pipe(!isProd ? sourcemaps.write('.') : through.obj())
    .pipe(dest(`${distPath}/js`));
}

// ---------- Watch ----------
function devWatch() {
  watch([paths.htmlTpl, paths.htmlRuTpl], parallel(html, htmlRu));
  watch([paths.pdfTpl, paths.pdfRuTpl], parallel(pdfEn, pdfRu));
  watch(paths.stylesWatch, styles);
  watch(paths.js, scripts);
}

// ---------- Pipelines ----------
const build = series(
  clean,
  parallel(html, htmlRu, styles, scripts, webfonts, icons, fonts),
  parallel(pdfEn, pdfRu)
);
const dev = series(build, devWatch);

exports.clean = clean;
exports.html = html;
exports['html-ru'] = htmlRu;
exports.pdf = pdfEn;
exports['pdf-ru'] = pdfRu;
exports.styles = styles;
exports.scripts = scripts;
exports.webfonts = webfonts;
exports.icons = icons;
exports.fonts = fonts;
exports.build = build;
exports.dev = dev;
exports.watch = devWatch;
exports.default = build;