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

## Деплой

Пуш в `master` → GitHub Actions собирает образ `ghcr.io/fattakhov/resume`
(nginx со статикой) и катит его на vps-01 (`deploy-app.sh resume`).
Vhost и compose-обвязка — в репо `soos-labs/ansible` (caddy + compose/resume).
