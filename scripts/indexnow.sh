#!/usr/bin/env bash
# Сообщает Яндексу и Bing про адреса сайта после выката (протокол IndexNow).
# Ключ и список адресов берутся с живого сайта: /indexnow-key.txt и sitemap.xml,
# поэтому скрипту не нужны ни секреты, ни настройки — только адрес сайта.
# Стандарт — ai-assist workspace/domains/projects/rules/seo.md. Скрипт одинаковый
# во всех репо, исходник — ansible/scripts/indexnow.sh.
#
#   scripts/indexnow.sh https://example.com          # отправить
#   DRY_RUN=1 scripts/indexnow.sh https://example.com # показать запрос
set -euo pipefail

base=${1:?usage: indexnow.sh https://host}
base=${base%/}
host=${base#https://}

# С ретраями: сразу после выката край сети может ещё отвечать прежней версией
fetch() {
  for _ in 1 2 3 4 5; do
    curl -fsS -m 30 "$1" && return 0
    sleep 5
  done
  echo "не получилось скачать $1" >&2
  return 1
}

key=$(fetch "$base/indexnow-key.txt" | tr -d '[:space:]')
[[ $key =~ ^[A-Za-z0-9-]{8,128}$ ]] || { echo "ключ на $base/indexnow-key.txt не похож на ключ IndexNow" >&2; exit 1; }

locs() { grep -o '<loc>[^<]*</loc>' | sed -e 's|<loc>||' -e 's|</loc>||' -e 's|&amp;|\&|g'; }

sitemap=$(fetch "$base/sitemap.xml")
if grep -q '<sitemapindex' <<<"$sitemap"; then
  urls=$(locs <<<"$sitemap" | while read -r m; do fetch "$m" | locs; done)
else
  urls=$(locs <<<"$sitemap")
fi
# В IndexNow можно слать только адреса своего хоста, не больше 10 000 за раз
urls=$(grep "^https://$host/" <<<"$urls" | sort -u | head -n 10000 || true)
[ -n "$urls" ] || { echo "в sitemap нет адресов $host" >&2; exit 1; }

list=$(sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/.*/"&"/' <<<"$urls" | paste -sd, -)
body="{\"host\":\"$host\",\"key\":\"$key\",\"keyLocation\":\"$base/indexnow-key.txt\",\"urlList\":[$list]}"

echo "IndexNow: $host, адресов $(wc -l <<<"$urls" | tr -d ' ')"
if [ -n "${DRY_RUN:-}" ]; then
  echo "$body"
  exit 0
fi

# 200 — принято, 202 — принято, ключ ещё проверяется
code=$(curl -sS -o /dev/stderr -w '%{http_code}' -m 60 -X POST https://api.indexnow.org/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' --data-binary "$body")
echo "ответ $code"
case $code in 200|202) ;; *) exit 1 ;; esac
