# Проверка индексации резюме — #2

17.11.2026 проверены точный sitemap резюме, URL Inspection и публичные HTTP-ответы. Нового дефекта не найдено; изменения кода, настроек поиска и повторные запросы индексации не выполнялись.

## Отчёт Google

Page indexing с фильтром именно https://mansur.expert/sitemap.xml, обновление 13.11.2026:2 indexed, 0 not indexed, исключений нет. Общий отчёт sc-domain:mansur.expert включает блог на другом хосте, поэтому его 186 indexed / 47 not indexed нельзя приписывать резюме.

Sitemaps API: карта резюме перечитана 11.11.2026 23:52:47UTC, submitted 2, errors 0 / warnings 0. XML публичного sitemap содержит ровно два конечных адреса: / и /en/. Deprecated indexed из Sitemaps API не используется как число страниц в индексе.

| Адрес | URL Inspection | Последний обход UTC | Google canonical |
|---|---|---|---|
| https://mansur.expert/ | PASS, Submitted and indexed | 13.11.2026 20:24:41 | https://mansur.expert/ |
| https://mansur.expert/en/ | PASS, Submitted and indexed | 07.11.2026 07:35:33 | https://mansur.expert/en/ |

У обеих страниц Google разрешает robots/indexing и успешно получил HTML. Текущий публичный ответ 200, self-canonical и отсутствие meta noindex подтверждены отдельно.

## Старые адреса и алиас

- http://mansur.expert/ → 301 на https://mansur.expert/ → 200.
- https://mansur.expert/index.ru.html → 301 с Location:/ → 200 канонической главной.
- https://mansur.pro/ → 301 на https://mansur.expert/ → 200.

Перенаправляемые старые URL сами по себе не должны индексироваться. Цель письма 23.09 — страницы sitemap — сейчас без исключений, поэтому #2 закрывается проверкой, без новой правки. Другие исторические URL общего доменного свойства в этой проверке не объявляются исправленными.

Артефакты: .state/seo-control/2026-11-17-complete/resume-2/ в общем рабочем пространстве: raw API, public.json и UI-срез. Регулярный контроль остаётся в #5, следующий недельный проход 23.11. Отсутствие раскрытых запросов по хосту резюме не равно отсутствию спроса и не заменяется статистикой блога.
