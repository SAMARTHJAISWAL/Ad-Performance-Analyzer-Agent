# Ad Performance Analyzer

A small web app for checking which ad keywords are pulling their weight. Upload a CSV export of
keyword metrics. The backend sorts each keyword into **high-performing** or **low-performing** using
fixed ROAS / ACOS / CTR thresholds. If a Gemini API key is set, it also writes a short summary with
suggested next steps.

## Features

- **CSV upload** (`.csv` only, 10 MB limit by default) through a React page or `POST /api/upload`.
- **Rule-based classification.** A keyword is high-performing when **ROAS > 5**, **ACOS < 30** and
  **CTR > 0.1**. Every other keyword is low-performing. Rows with no keyword or with non-numeric
  metrics are skipped and counted.
- **Flexible headers.** Header matching ignores case, quotes and the BOM. The keyword can be in a
  `keyword`, `Matched product`, `Search term` or `Targeting` column. Values such as `12%` or
  `$1,200` are parsed as numbers.
- **Optional AI summary.** When `GEMINI_API_KEY` is set, `/api/analyze` asks Gemini (via
  [`@google/genai`](https://www.npmjs.com/package/@google/genai), model `gemini-flash-latest` by
  default) for a short list of strengths, weaknesses and actions. Without a key, or if the call
  fails, you still get the rule-based results.

## Tech stack

| Part     | Stack                                                                  |
| -------- | ---------------------------------------------------------------------- |
| Frontend | React 19, React Router 6, axios, Create React App (`react-scripts` 5)  |
| Backend  | Node.js (>= 20), Express 4, express-fileupload, csv-parser, dotenv     |
| AI       | Google Gen AI SDK (`@google/genai`), optional                          |
| Tests    | Node's built-in test runner (`node --test`)                            |

## Architecture

```
React (CRA, :3000)                Express API (:5005)
  /upload  ── multipart CSV ──▶  POST /api/upload   → backend/uploads/<name>.csv
  /analyze ── { fileName } ───▶  POST /api/analyze  → csv-parser
                                                      → lib/performance.js (thresholds)
                                                      → lib/summary.js (Gemini, if key set)
```

- `backend/lib/performance.js`: pure classification logic, covered by unit tests.
- `backend/lib/uploads.js`: reduces client-supplied names to a plain `.csv` base name inside the
  upload directory, which blocks path traversal.
- `backend/lib/summary.js`: builds the prompt and makes the optional Gemini call.

## Environment variables

Backend (`backend/.env`; copy from `backend/.env.example`):

| Variable         | Required | Default                | Purpose                                         |
| ---------------- | -------- | ---------------------- | ----------------------------------------------- |
| `PORT`           | no       | `5005`                 | API port                                        |
| `GEMINI_API_KEY` | no       | none                   | Turns on the AI summary in `/api/analyze`       |
| `GEMINI_MODEL`   | no       | `gemini-flash-latest`  | Gemini model id                                 |
| `CORS_ORIGIN`    | no       | allow all              | Comma-separated list of allowed origins         |
| `MAX_UPLOAD_MB`  | no       | `10`                   | Upload size limit                               |
| `UPLOAD_DIR`     | no       | `backend/uploads`      | Where uploaded CSVs are stored                  |

Frontend (`frontend/.env`; copy from `frontend/.env.example`):

| Variable            | Required | Default                 | Purpose                                     |
| ------------------- | -------- | ----------------------- | ------------------------------------------- |
| `REACT_APP_API_URL` | no       | `http://localhost:5005` | Backend base URL (read at build/start time) |

## Getting started

Requires Node.js 20 or newer (tested with Node 26).

```bash
# Backend
cd backend
npm install
cp .env.example .env        # optionally add GEMINI_API_KEY
npm start                   # http://127.0.0.1:5005

# Frontend (in a second terminal)
cd frontend
npm install
npm start                   # http://localhost:3000
```

Then go to **Upload Ad Data**, choose a CSV (for example `backend/sample/ad-data.csv`) and the
results page opens.

### Scripts

| Location   | Command         | What it does                         |
| ---------- | --------------- | ------------------------------------ |
| `backend`  | `npm start`     | Start the API                        |
| `backend`  | `npm run dev`   | Start the API with `node --watch`    |
| `backend`  | `npm test`      | Run the unit tests                   |
| `frontend` | `npm start`     | CRA dev server                       |
| `frontend` | `npm run build` | Production build into `frontend/build` |

## CSV format

```csv
keyword,clicks,CTR,ACOS,ROAS
running shoes,100,0.2,25,6
trail sneakers,50,0.15,35,4
```

Required columns: a keyword column (see above), `clicks`, `CTR`, `ACOS`, `ROAS`. Header case does
not matter.

## API

### `POST /api/upload`

`multipart/form-data` with a `file` field holding a `.csv` file.

```bash
curl -F file=@backend/sample/ad-data.csv http://localhost:5005/api/upload
# File uploaded successfully: ad-data.csv
```

Errors: `400` when no file is sent or the file is not a `.csv`; `413` when it is over the size limit.

### `POST /api/analyze`

```bash
curl -X POST http://localhost:5005/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"fileName":"ad-data.csv"}'
```

```json
{
  "message": "Analysis completed.",
  "totalKeywords": 4,
  "skippedRows": 0,
  "highPerforming": ["running shoes", "waterproof boots"],
  "lowPerforming": ["trail sneakers", "cheap sandals"],
  "keywords": [{ "keyword": "running shoes", "clicks": 100, "CTR": 0.2, "ACOS": 25, "ROAS": 6 }],
  "summary": null
}
```

`summary` holds the Gemini text when a key is set. If the Gemini call fails, `summaryError` is
included as well. Errors: `400` for a missing or invalid `fileName`; `404` when that file has not
been uploaded.

### `GET /`

Health check that returns a plain-text message.

## Project structure

```
backend/
  index.js            Express app (exports app; listens when run directly)
  routes/upload.js    POST /api/upload
  routes/analyze.js   POST /api/analyze
  lib/performance.js  Classification logic
  lib/summary.js      Optional Gemini summary
  lib/uploads.js      Upload path handling
  sample/ad-data.csv  Example input
  test/               node:test unit tests
frontend/
  src/api.js          axios instance (REACT_APP_API_URL)
  src/pages/          Dashboard, UploadPage, AnalyzePage
  src/components/     FileUpload, AnalysisResults
.github/workflows/ci.yml  Backend tests + frontend build
```

## Deployment notes

- Uploaded files are written to the server's local disk (`UPLOAD_DIR`). On hosts with ephemeral
  disks, files can disappear between the upload request and the analyze request. There is no
  authentication and no clean-up of old uploads.
- Build the frontend with `REACT_APP_API_URL` set to the deployed API URL, and set `CORS_ORIGIN`
  on the backend to the frontend's origin.
- `npm audit` reports advisories in the frontend's `react-scripts` 5 toolchain (build-time
  dependencies). Fixing them means moving off Create React App (for example to Vite). That move is
  not done here.
