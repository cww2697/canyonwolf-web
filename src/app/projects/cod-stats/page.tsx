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

  /**
   * ChartArea renders a dual Y-axis line chart with zero-aligned axes.
   * - X axis: tick marks for each UTC entry (no labels as requested).
   * - Left Y axis: Skill values (parsed to number when possible).
   * - Right Y axis: K/D Ratio.
   */
  /* moved to components/ChartArea.tsx */
  function ChartArea_OLD({ data }: { data: TransformedRow[]; baseFileName?: string | null }) {
    // Ensure chronological order by UTC for the chart, independent of table sort
    const chron = useMemo(() => {
      const copy = data.slice();
      copy.sort((a, b) => {
        const ad = Date.parse(a.utc);
        const bd = Date.parse(b.utc);
        if (!isNaN(ad) && !isNaN(bd)) return ad - bd;
        const as = (a.utc || '').toString();
        const bs = (b.utc || '').toString();
        if (as < bs) return -1;
        if (as > bs) return 1;
        return 0;
      });
      return copy;
    }, [data]);

    const xCount = chron.length;

    const svgRef = useRef<SVGSVGElement | null>(null);

    const parsedSkill = useMemo(() => chron.map(r => {
      let n = Number((r.skill ?? '').toString().replace(/[^0-9+\-.eE]/g, ''));
      if (!Number.isFinite(n)) n = NaN;
      return n;
    }), [chron]);

    const kdSeries = useMemo(() => chron.map(r => Number.isFinite(r.kdRatio) ? r.kdRatio : NaN), [chron]);

    function seriesExtent(arr: number[]) {
      let min = Infinity, max = -Infinity;
      let seen = false;
      for (const v of arr) {
        if (Number.isFinite(v)) {
          if (v < min) min = v;
          if (v > max) max = v;
          seen = true;
        }
      }
      if (!seen) return { min: -1, max: 1 };
      if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: -1, max: 1 };
      const absMax = Math.max(Math.abs(min), Math.abs(max), 1e-9);
      const baseMin = -absMax;
      const baseMax = absMax;
      const pad = absMax * 0.1;
      return { min: baseMin - pad, max: baseMax + pad };
    }

    const leftExtent = useMemo(() => seriesExtent(parsedSkill), [parsedSkill]);
    const rightExtent = useMemo(() => seriesExtent(kdSeries), [kdSeries]);

    const width = 880; // will scale with CSS container width via viewBox
    const height = 280;
    const margin = { top: 16, right: 44, bottom: 28, left: 44 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const xForIndex = (i: number) => {
      if (xCount <= 1) return margin.left + innerW / 2;
      return margin.left + (i / (xCount - 1)) * innerW;
    };
    const yLeft = (v: number) => {
      const { min, max } = leftExtent;
      const t = (v - min) / (max - min || 1);
      return margin.top + (1 - t) * innerH;
    };
    const yRight = (v: number) => {
      const { min, max } = rightExtent;
      const t = (v - min) / (max - min || 1);
      return margin.top + (1 - t) * innerH;
    };

    const pathFromSeries = (arr: number[], y: (v: number)=>number) => {
      let d = '';
      for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        if (!Number.isFinite(v)) continue;
        const x = xForIndex(i);
        const yv = y(v);
        d += (d ? ' L' : 'M') + x + ' ' + yv;
      }
      return d;
    };

    const zeroLeftY = yLeft(0);
    const zeroRightY = yRight(0);

    // Hover interaction state
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const [locked, setLocked] = useState<boolean>(false);

    const onMove = (evt: React.MouseEvent<SVGRectElement, MouseEvent>) => {
      if (locked) return;
      const pt = svgRef.current;
      if (!pt) return;
      const rect = pt.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      // clamp to plot area
      const plotLeft = margin.left;
      const plotRight = margin.left + innerW;
      const clamped = Math.max(plotLeft, Math.min(plotRight, x));
      const t = innerW > 0 ? (clamped - plotLeft) / innerW : 0;
      const idx = Math.round(t * (xCount - 1));
      setHoverIdx(Number.isFinite(idx) ? Math.max(0, Math.min(xCount - 1, idx)) : null);
    };
    const clearHover = () => { if (!locked) setHoverIdx(null); };
    const onClickOverlay = () => {
      if (hoverIdx === null) return;
      setLocked(l => !l);
      // if turning off lock, resume following cursor (keep current hoverIdx until mouse moves)
    };

    return (
      <div className="w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Skill and K/D Ratio Over Time</div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><span className="inline-block w-3 h-0.5 bg-blue-500"/> Skill (left)</div>
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300"><span className="inline-block w-3 h-0.5 bg-emerald-500"/> K/D Ratio (right)</div>
          </div>
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-[280px]">
          <line x1={margin.left} y1={zeroLeftY} x2={margin.left+innerW} y2={zeroLeftY} stroke="currentColor" className="text-gray-300 dark:text-gray-700"/>

          {chron.map((_, i) => {
            const isTick = (i % 25 === 0) || (i === xCount - 1 && (i % 25 !== 0));
            if (!isTick) return null;
            const x = xForIndex(i);
            return <line key={i} x1={x} y1={zeroLeftY} x2={x} y2={zeroLeftY+6} stroke="currentColor" className="text-gray-300 dark:text-gray-700"/>;
          })}

          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top+innerH} stroke="currentColor" className="text-gray-300 dark:text-gray-700"/>
          <line x1={margin.left+innerW} y1={margin.top} x2={margin.left+innerW} y2={margin.top+innerH} stroke="currentColor" className="text-gray-300 dark:text-gray-700"/>
          <line x1={margin.left} y1={zeroLeftY} x2={margin.left+innerW} y2={zeroLeftY} stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeDasharray="4 4"/>
          <path d={pathFromSeries(parsedSkill, yLeft)} fill="none" stroke="#3b82f6" strokeWidth="2"/>
          {parsedSkill.map((v,i)=> Number.isFinite(v) ? (
            <circle key={'s'+i} cx={xForIndex(i)} cy={yLeft(v)} r={2} fill="#3b82f6"/>
          ) : null)}
          <path d={pathFromSeries(kdSeries, yRight)} fill="none" stroke="#10b981" strokeWidth="2"/>
          {kdSeries.map((v,i)=> Number.isFinite(v) ? (
            <circle key={'k'+i} cx={xForIndex(i)} cy={yRight(v)} r={2} fill="#10b981"/>
          ) : null)}
          <text x={margin.left - 6} y={zeroLeftY} textAnchor="end" dominantBaseline="middle" className="fill-gray-500 text-[10px]">0</text>
          <text x={margin.left+innerW + 6} y={zeroRightY} textAnchor="start" dominantBaseline="middle" className="fill-gray-500 text-[10px]">0</text>

          {hoverIdx !== null && (
            <g pointerEvents="none">
              {/* lock indicator */}
              {locked && (
                <g>
                  <rect x={xForIndex(hoverIdx) - 6} y={margin.top + 6} width={12} height={12} rx={2} ry={2} fill="#f59e0b" opacity={0.95} />
                </g>
              )}
              {/* vertical cursor line */}
              <line x1={xForIndex(hoverIdx)} y1={margin.top} x2={xForIndex(hoverIdx)} y2={margin.top+innerH} stroke="#9ca3af" strokeDasharray="4 2"/>
              {/* highlight circles if finite */}
              {Number.isFinite(parsedSkill[hoverIdx]) && (
                <circle cx={xForIndex(hoverIdx)} cy={yLeft(parsedSkill[hoverIdx])} r={3.5} fill="#3b82f6"/>
              )}
              {Number.isFinite(kdSeries[hoverIdx]) && (
                <circle cx={xForIndex(hoverIdx)} cy={yRight(kdSeries[hoverIdx])} r={3.5} fill="#10b981"/>
              )}
              {(() => {
                const x = xForIndex(hoverIdx);
                const boxW = 160;
                const boxH = 56;
                const pad = 8;
                let bx = x + pad;
                if (bx + boxW > margin.left + innerW) bx = x - pad - boxW; // flip to left if overflow
                const by = Math.max(margin.top, Math.min(margin.top + innerH - boxH, zeroLeftY - boxH - 6));
                const skillVal = parsedSkill[hoverIdx];
                const kdVal = kdSeries[hoverIdx];
                const fmtSkill = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(2);
                const fmtKD = (v: number) => v.toFixed(2);
                return (
                  <g>
                    <rect x={bx} y={by} width={boxW} height={boxH} rx={6} ry={6} fill="#ffffff" stroke="#e5e7eb"/>
                    <text x={bx + 8} y={by + 16} className="fill-gray-900" fontSize={11} fontFamily={'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}>{chron[hoverIdx]?.utc || ''}</text>
                    <g>
                      <rect x={bx + 8} y={by + 22} width={6} height={2} fill="#3b82f6"/>
                      <text x={bx + 18} y={by + 24} dominantBaseline="middle" className="fill-gray-900" fontSize={11}>Skill: {Number.isFinite(skillVal) ? fmtSkill(skillVal) : '—'}</text>
                    </g>
                    <g>
                      <rect x={bx + 8} y={by + 38} width={6} height={2} fill="#10b981"/>
                      <text x={bx + 18} y={by + 40} dominantBaseline="middle" className="fill-gray-900" fontSize={11}>K/D: {Number.isFinite(kdVal) ? fmtKD(kdVal) : '—'}</text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* Invisible interaction overlay */}
          <rect x={margin.left} y={margin.top} width={innerW} height={innerH} fill="transparent" onMouseMove={onMove} onMouseLeave={clearHover} onClick={onClickOverlay} />
        </svg>
        {(() => {
          const statsOf = (arr: number[]) => {
            let min = Infinity, max = -Infinity, sum = 0, n = 0;
            for (const v of arr) {
              if (Number.isFinite(v)) {
                if (v < min) min = v;
                if (v > max) max = v;
                sum += v;
                n++;
              }
            }
            if (n === 0) return null;
            return { min, max, avg: sum / n };
          };
          const skillStats = statsOf(parsedSkill);
          const kdStats = statsOf(kdSeries);
          const fmtSkill = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(2);
          const fmtKD = (v: number) => v.toFixed(2);
          return (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-gray-100 dark:border-gray-800 p-2">
                <div className="mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2"><span className="inline-block w-3 h-0.5 bg-blue-500"/> Skill stats</div>
                <div className="text-gray-700 dark:text-gray-300 flex flex-wrap gap-x-4 gap-y-1">
                  <div>Min: <span className="font-mono">{skillStats ? fmtSkill(skillStats.min) : '—'}</span></div>
                  <div>Avg: <span className="font-mono">{skillStats ? fmtSkill(skillStats.avg) : '—'}</span></div>
                  <div>Max: <span className="font-mono">{skillStats ? fmtSkill(skillStats.max) : '—'}</span></div>
                </div>
              </div>
              <div className="rounded-md border border-gray-100 dark:border-gray-800 p-2">
                <div className="mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2"><span className="inline-block w-3 h-0.5 bg-emerald-500"/> K/D Ratio stats</div>
                <div className="text-gray-700 dark:text-gray-300 flex flex-wrap gap-x-4 gap-y-1">
                  <div>Min: <span className="font-mono">{kdStats ? fmtKD(kdStats.min) : '—'}</span></div>
                  <div>Avg: <span className="font-mono">{kdStats ? fmtKD(kdStats.avg) : '—'}</span></div>
                  <div>Max: <span className="font-mono">{kdStats ? fmtKD(kdStats.max) : '—'}</span></div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // Token encode/decode helpers to rehydrate the same view
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

  // compute or cache the token for current view
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

  /* moved to components/ShareCodeBox.tsx */
  function ShareCodeBox_OLD({ code }: { code: string }) {
    const [open, setOpen] = useState(false);
    return (
      <div className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Share Code</div>
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-label={open ? 'Collapse share code' : 'Expand share code'}
              className="group inline-flex items-center text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {open ? (
                // Bootstrap Icons: chevron-up
                <svg className="w-4 h-4 transition-transform duration-200 ease-out group-hover:scale-110 active:scale-95" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M1.646 11.354a.5.5 0 0 0 .708 0L8 5.707l5.646 5.647a.5.5 0 0 0 .708-.708l-6-6a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 0 .708" />
                </svg>
              ) : (
                // Bootstrap Icons: chevron-down
                <svg className="w-4 h-4 transition-transform duration-200 ease-out group-hover:scale-110 active:scale-95" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={async()=>{ try { await navigator.clipboard.writeText(code); } catch { /* ignore */ } }}
            className="inline-flex items-center justify-center rounded-md bg-orange-600 px-2 py-1 text-white text-xs font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >Copy</button>
        </div>
        {open ? (
          <div className="mt-2 rounded border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/10 p-2">
            <div className="font-mono text-xs break-all select-all text-gray-800 dark:text-gray-200 leading-5 max-h-[100px] overflow-y-auto pr-1">
              {code}
            </div>
          </div>
        ) : (
          <div className="mt-2 font-mono text-xs select-all text-gray-800 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
            {code}
          </div>
        )}
      </div>
    );
  }


  return (
    <main className="p-4 sm:p-6">
      <div className="space-y-6 max-w-5xl mx-auto">
        <header className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Call of Duty Statistics Visualizer</h1>
          {!data && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload a CSV file to get started.</p>
          )}
        </header>

        {!data ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <div className="relative rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors p-6">
                <input
                  id="cod-csv"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv,.html,text/html"
                  onChange={onFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4h4v-8m0 0v-4a4 4 0 00-4-4h-4m4 4l-8-8-8 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {fileName ? fileName : "Drop your CSV file here, or click to select"}
                  </p>
                </div>
              </div>
              {(fileError) && (
                <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">{fileError}</p>
              )}
            </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-800 p-3 mt-4">
            <div className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Paste a share code to load data (optional)</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={hashInput}
                onChange={(e)=> setHashInput(e.target.value)}
                placeholder="Share Code"
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
          </div>
          {codeError && (
            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">{codeError}</p>
          )}
          </div>

            <div className="flex gap-3 justify-center">
                <button
                    type="submit"
                    disabled={!((fileInputRef.current?.files && fileInputRef.current.files.length > 0) || hashInput.trim().length > 0)}
                    className="inline-flex items-center justify-center rounded-md bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    aria-disabled={!((fileInputRef.current?.files && fileInputRef.current.files.length > 0) || hashInput.trim().length > 0)}
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={(e) => { onClear(); (e.currentTarget as HTMLButtonElement).blur(); }}
                    className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
