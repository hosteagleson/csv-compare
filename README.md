# CSV Compare

A dependency-free, browser-local CSV comparison MVP. Serve `dist/` with any static host or open `dist/index.html` directly. No build step.

## Features

Two-file comparison using a shared unique key; selectable comparison columns; added, removed, changed and unchanged records; search, filters, pagination and complete CSV report export. Synthetic sample data included. UTF-8 CSV, comma/semicolon/tab separators, maximum 10 MB and 50,000 rows per file. Values compare as text. Added/removed report lines contain keys, not full source rows.

## Privacy

No external libraries, fonts, analytics, network calls, persistent storage or backend. Files are held in page memory until cleared or the page closes. Only the files explicitly selected by the visitor are read. The report is generated on demand locally. CSV formula-like cells receive an apostrophe prefix on export. Content is rendered as plain text.

## Validation

Run `node test.cjs`. Test files use synthetic data only. This beta needs user feedback before charging customers. No payments or license enforcement included.
