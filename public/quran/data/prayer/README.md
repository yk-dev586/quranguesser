# Local prayer data

Core offline mode does not call AlAdhan or any other prayer API.

Optional monthly files use this structure:
`data/prayer/YYYY-MM.json`

The JSON may be an array of day objects or `{ "data": [...] }`. Existing reader settings are preserved.

Without a local month file, the prayer screen shows a local-data notice and the Quran/quiz features continue to work.
