# Hardik Meisheri’s website

A static personal research website, published by GitHub Pages from the root of `master`.

## Local preview

Run `python3 -m http.server 8080` from this directory and visit http://localhost:8080/.
No R, Hugo, npm, or build step is needed.

## Editing

- `index.html`: introduction, work history, research explorer, and contact details.
- `assets/css/`: site styles and responsive layout.
- `assets/js/main.js`: topic filters, publication rendering, theme, and citations.
- `data/publications.json`: publication metadata and links.
- `blog/`: research notes.
- `assets/images/`: research illustrations and publication figures.
- `static/files/`: current CV and linked presentation PDFs.
- `files/`: preserved downloads from the original site, to keep existing links working.

## Archived Academic site

The previous generated Hugo/Academic site is preserved in Git tag
`archive/academic-site-2026-09-13` at commit `813d21b`.
Its template assets, taxonomies, admin interface, and generated indexes are retired
from the active site. The `post/`, `project/`, and `publication/` HTML files are
small redirects for existing URLs.

To inspect the old site separately:

```sh
git worktree add ../academic-site-archive archive/academic-site-2026-09-13
```

The R/blogdown source checkout is separate and was left unchanged during this migration.
