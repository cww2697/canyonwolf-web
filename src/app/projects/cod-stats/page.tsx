"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

export const dynamic = 'force-dynamic';

import ShareCodeBox from "./components/ShareCodeBox";
import ChartArea from "./components/ChartArea";
import { CsvRow, SortKey, TransformedRow } from "./components/types";

function parseCsv(text: string): CsvRow[] {
  const rows: CsvRow[] = [];
  let cur: string[] = [];
  let cell = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;

        } else {
          inQuotes = false;
          i++;
        }
      } else {
        cell += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ',') {
        cur.push(cell);
        cell = "";
        i++;
        continue;
      }
      if (ch === '\n') {
        cur.push(cell);
        rows.push(cur);
        cur = [];
        cell = "";
        i++;
        continue;
      }
      if (ch === '\r') {
        cur.push(cell);
        rows.push(cur);
        cur = [];
        cell = "";
        if (text[i + 1] === '\n') i++;
        i++;
        continue;
      }
      cell += ch;
      i++;
    }
  }
  if (cell.length > 0 || cur.length > 0) {
    cur.push(cell);
    rows.push(cur);
  }
  if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    rows.pop();
  }
  return rows;
}

export default function CodStatsPage() {
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const b64uEncode = (bin: Uint8Array) => {
    let str = '';
    for (let i = 0; i < bin.length; i++) str += String.fromCharCode(bin[i]);
    const b64 = btoa(str);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
  };
  const b64uDecode = (txt: string) => {
    const b64 = txt.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(txt.length/4)*4, '=');
    const str = atob(b64);
    const out = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
    return out;
  };
  // 32-bit FNV-1a hash for integrity (not cryptographic)
  const fnv32 = (bytes: Uint8Array): number => {
    let hash = 0x811c9dc5 >>> 0; // FNV offset basis 32
    const prime = 0x01000193;    // FNV prime 32
    for (let i = 0; i < bytes.length; i++) {
      hash ^= bytes[i];
      // 32-bit overflow math
      hash = Math.imul(hash, prime) >>> 0;
    }
    return hash >>> 0;
  };
  const textEncode = (s: string) => new TextEncoder().encode(s);
  const textDecode = (u: Uint8Array) => new TextDecoder().decode(u);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [data, setData] = useState<CsvRow[] | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [hashInput, setHashInput] = useState<string>("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeError(null);
    setFileError(null);
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFileName(null);
      return;
    }
    if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Please select a valid CSV file.");
      e.target.value = "";
      setFileName(null);
      return;
    }
    setFileName(file.name);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(null);
    setCodeError(null);
    const input = fileInputRef.current;
    const file = input?.files?.[0];

    if (!file) {
      const t = hashInput.trim();
      if (t) {
        const payload = decodeToken(t);
        if (!payload) { setCodeError('Invalid or corrupted code.'); return; }
        setData(payload.data);
        setFileName(payload.fileName || 'from-code.csv');
        setGeneratedToken(t);
        setSortKey(payload.sortKey);
        setSortDir(payload.sortDir);
        return;
      }
      setCodeError("Please paste a share code or choose a CSV file before submitting.");
      return;
    }
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (!rows.length || (rows.length === 1 && rows[0].every((c) => c.trim() === ""))) {
        setFileError("The CSV appears to be empty.");
        return;
      }
      // Validate required columns exist before proceeding
      const hdr = rows[0] || [];
      const norm = hdr.map((h) => (h || "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim());
      const find = (aliases: string[]) => {
        const set = new Set(aliases.map((a) => a.toLowerCase()));
        for (let i = 0; i < norm.length; i++) {
          if (set.has(norm[i])) return i;
        }
        return -1;
      };
      const utcIdx = find(["utc timestamp", "timestamp utc", "utc", "time utc", "time", "date time", "datetime"]);
      const killsIdx = find(["kills", "kill", "k"]);
      const deathsIdx = find(["deaths", "death", "d"]);
      const skillIdx = find(["skill", "skill rating", "sr", "mmr", "skill score"]);
      const missing: string[] = [];
      if (utcIdx < 0) missing.push("UTC timestamp");
      if (killsIdx < 0) missing.push("Kills");
      if (deathsIdx < 0) missing.push("Deaths");
      if (skillIdx < 0) missing.push("Skill");
      if (missing.length) {
        setFileError(`The CSV is missing required column(s): ${missing.join(", ")}.`);
        return;
      }
      // Filter out any data rows that have an empty UTC timestamp before processing further
      const filtered = [rows[0], ...rows.slice(1).filter(r => {
        const utcVal = (r[utcIdx] ?? "").toString().trim();
        return utcVal.length > 0;
      })];
      setData(filtered);
            // clear previous token on new upload
            setGeneratedToken(null);
            setHashInput('');
    } catch (err) {
      console.error(err);
      setFileError("Failed to read or parse the CSV file.");
    }
  };

  const onClear = () => {
      setGeneratedToken(null);
      setHashInput("");
      setFileError(null);
      setCodeError(null);
      setFileName(null);
      const input = fileInputRef.current;
      if (input) {
          input.value = "";
      }
  };

  const startOver = () => {
    setData(null);
    setFileError(null);
    setCodeError(null);
    setFileName(null);
    setGeneratedToken(null);
    setHashInput("");
    const input = fileInputRef.current;
    if (input) input.value = "";
  };

  const header = useMemo(() => (data && data.length ? data[0] : null), [data]);
  const rows = useMemo(() => (data && data.length ? data.slice(1) : []), [data]);


  const normalizedHeader = useMemo(() => {
    if (!header) return null;
    return header.map((h) => (h || "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim());
  }, [header]);

  const columnIndex = useMemo(() => {
    if (!normalizedHeader) return null;
    // Known aliases for robustness
    const findIdx = (aliases: string[]) => {
      const set = new Set(aliases.map((a) => a.toLowerCase()));
      for (let i = 0; i < normalizedHeader.length; i++) {
        const h = normalizedHeader[i];
        if (set.has(h)) return i;
      }
      return -1;
    };

    const utcIdx = findIdx(["utc timestamp", "timestamp utc", "utc", "time utc", "time", "date time", "datetime"]);
    const killsIdx = findIdx(["kills", "kill", "k" ]);
    const deathsIdx = findIdx(["deaths", "death", "d" ]);
    const skillIdx = findIdx(["skill", "skill rating", "sr", "mmr", "skill score"]);

    return { utcIdx, killsIdx, deathsIdx, skillIdx };
  }, [normalizedHeader]);

  const requiredColsPresent = useMemo(() => {
    if (!columnIndex) return false;
    const { utcIdx, killsIdx, deathsIdx, skillIdx } = columnIndex;
    return utcIdx >= 0 && killsIdx >= 0 && deathsIdx >= 0 && skillIdx >= 0;
  }, [columnIndex]);

  const transformed = useMemo<TransformedRow[] | null>(() => {
    if (!rows.length || !columnIndex || !requiredColsPresent) return null;
    const { utcIdx, killsIdx, deathsIdx, skillIdx } = columnIndex;

    return rows.map((r) => {
      const utc = (r[utcIdx] ?? "").toString();
      const killsRaw = (r[killsIdx] ?? "").toString().trim();
      const deathsRaw = (r[deathsIdx] ?? "").toString().trim();
      const skill = (r[skillIdx] ?? "").toString();
      const kills = Number(killsRaw === "" ? 0 : Number(killsRaw));
      const deaths = Number(deathsRaw === "" ? 0 : Number(deathsRaw));
      const kdRatio = deaths > 0 ? kills / deaths : kills;
      return { utc, kills: isNaN(kills) ? 0 : kills, deaths: isNaN(deaths) ? 0 : deaths, skill, kdRatio };
    });
  }, [rows, columnIndex, requiredColsPresent]);

  const [sortKey, setSortKey] = useState<SortKey>("utc");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo<TransformedRow[]>(() => {
    const list = (transformed ?? []).slice();
    const dir = sortDir === "asc" ? 1 : -1;

    const cmp = (a: TransformedRow, b: TransformedRow): number => {
      switch (sortKey) {
        case "kills":
          return dir * ((a.kills || 0) - (b.kills || 0));
        case "deaths":
          return dir * ((a.deaths || 0) - (b.deaths || 0));
        case "kdRatio":
          return dir * (((Number.isFinite(a.kdRatio) ? a.kdRatio : 0)) - ((Number.isFinite(b.kdRatio) ? b.kdRatio : 0)));
        case "skill": {
          const as = (a.skill || "").toString().toLowerCase();
          const bs = (b.skill || "").toString().toLowerCase();
          if (as < bs) return -1 * dir;
          if (as > bs) return 1 * dir;
          return 0;
        }
        case "utc":
        default: {
          // try Date parse; fallback to string compare
          const ad = Date.parse(a.utc);
          const bd = Date.parse(b.utc);
          if (!isNaN(ad) && !isNaN(bd)) return dir * (ad - bd);
          const as = (a.utc || "").toString();
          const bs = (b.utc || "").toString();
          if (as < bs) return -1 * dir;
          if (as > bs) return 1 * dir;
          return 0;
        }
      }
    };

    return list.sort(cmp);
  }, [transformed, sortKey, sortDir]);

  const pageSizeOptions = [10, 15, 20, 25, 50, 100] as const;
  const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>(10);
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [sortKey, sortDir, pageSize]);

  const totalRows = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sorted.slice(start, end);
  }, [sorted, currentPage, pageSize]);

  const onSort = (key: SortKey) => {
      setGeneratedToken(null); // invalidate cached token on sort change
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  type SharePayload = { v: 1; fileName?: string | null; data: CsvRow[]; sortKey: SortKey; sortDir: 'asc'|'desc' };
  const encodeToken = (p: SharePayload): string => {
    const json = JSON.stringify(p);
    const bytes = textEncode(json);
    // prefix 4-byte FNV32 (little-endian)
    const h = fnv32(bytes) >>> 0;
    const buf = new Uint8Array(4 + bytes.length);
    buf[0] = h & 0xff;
    buf[1] = (h >>> 8) & 0xff;
    buf[2] = (h >>> 16) & 0xff;
    buf[3] = (h >>> 24) & 0xff;
    buf.set(bytes, 4);
    return b64uEncode(buf);
  };
  const decodeToken = (token: string): SharePayload | null => {
    try {
      const buf = b64uDecode(token.trim());
      if (buf.length < 5) return null; // need at least 4 bytes hash + 1 byte payload
      const h = (buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24)) >>> 0;
      const body = buf.slice(4);
      const calc = fnv32(body) >>> 0;
      if (calc !== h) return null;
      const json = textDecode(body);
      const obj = JSON.parse(json);
      if (!obj || obj.v !== 1 || !Array.isArray(obj.data)) return null;
      return obj as SharePayload;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (data && data.length) {
      const payload: SharePayload = { v: 1, fileName, data, sortKey, sortDir };
      const token = encodeToken(payload);
      setGeneratedToken(token);
    } else {
      setGeneratedToken(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fileName, sortKey, sortDir]);


  return (
    <main className="p-6 sm:p-10">
      <div className="space-y-12 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">COD Stats</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Visualize your Call of Duty performance. Upload your Activision data export to see trends in K/D, kills, and skill rating.
            </p>
          </div>

        {!data ? (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6">
              {/* Instructions accordion */}
              <div className="glass rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setShowInstructions((v)=>!v)}
                  aria-expanded={showInstructions}
                  aria-controls="csv-instructions-panel"
                  className="w-full flex items-center justify-between gap-2 px-6 py-4 text-left text-lg font-bold text-gray-900 dark:text-gray-100 hover:bg-primary/5 transition-colors"
                >
                  <span className="tracking-wide flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Instructions
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 w-5 h-5 grid place-items-center" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={showInstructions ? "transform rotate-180 transition-transform duration-300" : "transform rotate-0 transition-transform duration-300"}><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </button>
                {showInstructions && (
                  <div id="csv-instructions-panel" className="px-6 pb-6 text-sm text-gray-700 dark:text-gray-300 animate-in fade-in slide-in-from-top-2">
                    <div className="mt-2 mb-4 text-xs font-bold uppercase tracking-widest text-primary">Before you upload</div>
                    <p className="mb-4 leading-relaxed">Create a simple CSV from your Activision data using the steps below. This helps the app read your matches correctly.</p>
                    <ul className="space-y-3">
                      <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary grid place-items-center text-xs font-bold">1</span> <span>Open your Activision SAR export (HTML) and locate the <span className="font-bold text-secondary">Multiplayer Statistics</span> table.</span></li>
                      <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary grid place-items-center text-xs font-bold">2</span> <span>Select the entire table, <em>including the header row</em>, and paste it into Excel or Google Sheets.</span></li>
                      <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary grid place-items-center text-xs font-bold">3</span> <span>Export or download that sheet as a <span className="font-bold text-secondary">CSV file</span>.</span></li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors p-10 bg-primary/5 group">
                <input
                  id="cod-csv"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={onFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {fileName ? fileName : "Drop your CSV file here, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">CSV files only</p>
                </div>
              </div>
              
              {fileError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {fileError}
                </div>
              )}
            </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="text-sm font-bold uppercase tracking-widest text-secondary">Paste a share code (optional)</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={hashInput}
                onChange={(e)=> setHashInput(e.target.value)}
                placeholder="Enter share code..."
                className="flex-1 rounded-xl border border-primary/20 bg-white/80 dark:bg-black/40 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            {codeError && (
              <p className="text-sm text-red-500 font-medium">{codeError}</p>
            )}
          </div>

            <div className="flex gap-4 justify-center">
                <button
                    type="submit"
                    disabled={!((fileInputRef.current?.files && fileInputRef.current.files.length > 0) || hashInput.trim().length > 0)}
                    className="inline-flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 px-8 py-3 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    Visualize Data
                </button>
                <button
                    type="button"
                    onClick={(e) => { onClear(); (e.currentTarget as HTMLButtonElement).blur(); }}
                    className="inline-flex items-center justify-center rounded-xl glass px-8 py-3 text-gray-900 dark:text-gray-100 text-sm font-bold transition-all hover:bg-white/20 active:scale-95"
                >
                    Clear
                </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {sorted && sorted.length > 0 && (
              <ChartArea data={sorted} baseFileName={fileName} />
            )}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const rowsToExport = (sorted || []) as TransformedRow[];
                      const headerRow = ["UTC timestamp","Kills","Deaths","Skill","K/D Ratio"];
                      const escape = (val: unknown) => {
                        const s = (val ?? "").toString();
                        if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
                        return s;
                      };
                      const lines: string[] = [];
                      lines.push(headerRow.map(escape).join(","));
                      for (const r of rowsToExport) {
                        const kd = Number.isFinite(r.kdRatio) ? r.kdRatio.toFixed(2) : "0.00";
                        lines.push([r.utc, r.kills, r.deaths, r.skill, kd].map(escape).join(","));
                      }
                      const csvContent = "\uFEFF" + lines.join("\r\n");
                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      const base = (fileName && fileName.toLowerCase().endsWith('.csv')) ? fileName.replace(/\.csv$/i, '') : (fileName || 'cod-stats');
                      a.download = `${base}-export.csv`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } catch (err) {
                      console.error('Export failed', err);
                      alert('Failed to export CSV.');
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-800 px-3 py-1.5 text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Export Data
                </button>
                <label htmlFor="cod-page-size" className="text-xs text-gray-600 dark:text-gray-400">Rows per page:</label>
              </div>
              <select
                id="cod-page-size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value) as (typeof pageSizeOptions)[number])}
                className="text-sm rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" aria-sort={sortKey === "utc" ? (sortDir === "asc" ? "ascending" : "descending") : undefined} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider select-none">
                      <button type="button" onClick={() => onSort("utc")} className="inline-flex items-center gap-1 hover:text-orange-600">
                        UTC timestamp
                        <span className="text-[10px]">{sortKey === "utc" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
                      </button>
                    </th>
                    <th scope="col" aria-sort={sortKey === "kills" ? (sortDir === "asc" ? "ascending" : "descending") : undefined} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider select-none">
                      <button type="button" onClick={() => onSort("kills")} className="inline-flex items-center gap-1 hover:text-orange-600">
                        Kills
                        <span className="text-[10px]">{sortKey === "kills" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
                      </button>
                    </th>
                    <th scope="col" aria-sort={sortKey === "deaths" ? (sortDir === "asc" ? "ascending" : "descending") : undefined} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider select-none">
                      <button type="button" onClick={() => onSort("deaths")} className="inline-flex items-center gap-1 hover:text-orange-600">
                        Deaths
                        <span className="text-[10px]">{sortKey === "deaths" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
                      </button>
                    </th>
                    <th scope="col" aria-sort={sortKey === "skill" ? (sortDir === "asc" ? "ascending" : "descending") : undefined} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider select-none">
                      <button type="button" onClick={() => onSort("skill")} className="inline-flex items-center gap-1 hover:text-orange-600">
                        Skill
                        <span className="text-[10px]">{sortKey === "skill" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
                      </button>
                    </th>
                    <th scope="col" aria-sort={sortKey === "kdRatio" ? (sortDir === "asc" ? "ascending" : "descending") : undefined} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider select-none">
                      <button type="button" onClick={() => onSort("kdRatio")} className="inline-flex items-center gap-1 hover:text-orange-600">
                        K/D Ratio
                        <span className="text-[10px]">{sortKey === "kdRatio" ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {(paged || []).map((r, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 ? "bg-gray-50/40 dark:bg-gray-800/40" : undefined}>
                      <td className="px-3 py-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{r.utc}</td>
                      <td className="px-3 py-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{r.kills}</td>
                      <td className="px-3 py-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{r.deaths}</td>
                      <td className="px-3 py-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{r.skill}</td>
                      <td className="px-3 py-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{Number.isFinite(r.kdRatio) ? r.kdRatio.toFixed(2) : "0.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {totalRows > 0 ? (
                  (() => {
                    const start = (currentPage - 1) * pageSize + 1;
                    const end = Math.min(totalRows, currentPage * pageSize);
                    return <span>Rows {start}–{end} of {totalRows}</span>;
                  })()
                ) : (
                  <span>No rows</span>
                )}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  aria-label="Previous page"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300 select-none">Page {currentPage} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
            
            {generatedToken && (
              <ShareCodeBox code={generatedToken} />
            )}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={startOver}
                className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-white text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
