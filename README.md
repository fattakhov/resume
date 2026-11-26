# resume

Сайт-резюме + PDF (EN/RU): mansur.expert. Данные — `src/resume*.json`,
шаблоны Mustache, сборка Gulp, PDF — Puppeteer.

## Локально

```shell
nvm use
npm install
npm run build   # build/: index*.html + resume*.pdf
npm run watch
```

Если puppeteer не находит браузер: `npx puppeteer browsers install chrome-headless-shell`
и `PUPPETEER_EXECUTABLE_PATH=<путь к бинарнику> npm run build`.

## Русская версия отдельно

Содержимое сайта и PDF берётся из `src/resume.ru.json`. Верстка сайта —
`src/index.ru.template`, печатная верстка с Montserrat — `src/pdf.ru.template`.

```shell
npx gulp html-ru pdf-ru
```

Результат: `build/index.html` и `build/resume.ru.pdf`. Эта команда не меняет
английскую версию и не публикует сайт. После изменения печатного шаблона
проверьте обе страницы PDF и кликабельность контактов в шапке.

## Языковые версии

Русский сайт — `/`, английский — `/en/`. В шапке каждой версии доступны
переключение языка и оба PDF: `/resume.ru.pdf` и `/resume.pdf`.
Содержание английской версии — `src/resume.json`, шаблоны —
`src/index.template` и `src/pdf.template`. Общие стили сайта находятся
в `src/scss/main.scss`; печатные стили хранятся в PDF-шаблонах.

`npm run build` собирает обе версии сайта и оба PDF. Перед публикацией
проверьте две страницы каждого PDF, мобильную верстку, смену языка и ссылки
скачивания.

## Деплой

Пуш в `master` → GitHub Actions собирает образ `ghcr.io/fattakhov/resume`
(nginx со статикой) и катит его на vps-01 (`deploy-app.sh resume`).
Vhost и compose-обвязка — в репо `soos-labs/ansible` (caddy + compose/resume).
