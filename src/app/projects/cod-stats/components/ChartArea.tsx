"use client";
import React, { useMemo, useRef, useState } from "react";
import { TransformedRow } from "./types";

export default function ChartArea({ data }: { data: TransformedRow[]; baseFileName?: string | null }) {
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
    let min = Infinity, max = -Infinity; let seen = false;
    for (const v of arr) { if (Number.isFinite(v)) { if (v < min) min = v; if (v > max) max = v; seen = true; } }
    if (!seen) return { min: -1, max: 1 };
    if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: -1, max: 1 };
    const absMax = Math.max(Math.abs(min), Math.abs(max), 1e-9);
    const baseMin = -absMax; const baseMax = absMax; const pad = absMax * 0.1;
    return { min: baseMin - pad, max: baseMax + pad };
  }

  const leftExtent = useMemo(() => seriesExtent(parsedSkill), [parsedSkill]);
  const rightExtent = useMemo(() => seriesExtent(kdSeries), [kdSeries]);

  const width = 880;
  const height = 280;
  const margin = { top: 16, right: 44, bottom: 28, left: 44 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xForIndex = (i: number) => {
    if (xCount <= 1) return margin.left + innerW / 2;
    return margin.left + (i / (xCount - 1)) * innerW;
  };
  const yLeft = (v: number) => {
    const { min, max } = leftExtent; const t = (v - min) / (max - min || 1);
    return margin.top + (1 - t) * innerH;
  };
  const yRight = (v: number) => {
    const { min, max } = rightExtent; const t = (v - min) / (max - min || 1);
    return margin.top + (1 - t) * innerH;
  };

  const pathFromSeries = (arr: number[], y: (v: number)=>number) => {
    let d = '';
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i]; if (!Number.isFinite(v)) continue;
      const x = xForIndex(i); const yv = y(v);
      d += (d ? ' L' : 'M') + x + ' ' + yv;
    }
    return d;
  };

  const zeroLeftY = yLeft(0);
  const zeroRightY = yRight(0);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [locked, setLocked] = useState<boolean>(false);

  // Visible window is the entire data when zoom is removed
  const visibleSkill = parsedSkill;
  const visibleKD = kdSeries;

  const onMove = (evt: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (locked) return;
    const pt = svgRef.current; if (!pt) return; const rect = pt.getBoundingClientRect();
    const x = evt.clientX - rect.left; const plotLeft = margin.left; const plotRight = margin.left + innerW;
    const clamped = Math.max(plotLeft, Math.min(plotRight, x)); const t = innerW > 0 ? (clamped - plotLeft) / innerW : 0;
    const idx = Math.round(t * (xCount - 1)); setHoverIdx(Number.isFinite(idx) ? Math.max(0, Math.min(xCount - 1, idx)) : null);
  };
  const clearHover = () => { if (!locked) setHoverIdx(null); };
  const onClickOverlay = () => { if (hoverIdx === null) return; setLocked((l) => !l); };

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
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top+innerH} stroke="currentColor" className="text-gray-300 dark:text-gray-700"/>
          <line x1={margin.left+innerW} y1={margin.top} x2={margin.left+innerW} y2={margin.top+innerH} stroke="currentColor" className="text-gray-300 dark:text-gray-700"/>
          <line x1={margin.left} y1={yLeft(0)} x2={margin.left+innerW} y2={yLeft(0)} stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeDasharray="4 4"/>
          <text x={margin.left - 6} y={yLeft(0)} textAnchor="end" dominantBaseline="middle" className="fill-gray-500 text-[10px]">0</text>
          <text x={margin.left+innerW + 6} y={yRight(0)} textAnchor="start" dominantBaseline="middle" className="fill-gray-500 text-[10px]">0</text>

          {chron.map((_, i) => {
            const isTick = (i % 25 === 0) || (i === xCount - 1 && (i % 25 !== 0));
            if (!isTick) return null; const x = xForIndex(i);
            return <line key={i} x1={x} y1={yLeft(0)} x2={x} y2={yLeft(0)+6} stroke="currentColor" className="text-gray-300 dark:text-gray-700"/>;
          })}
          <path d={pathFromSeries(parsedSkill, yLeft)} fill="none" stroke="#3b82f6" strokeWidth="2"/>
          {parsedSkill.map((v,i)=> Number.isFinite(v) ? (
            <circle key={'s'+i} cx={xForIndex(i)} cy={yLeft(v)} r={2} fill="#3b82f6"/>
          ) : null)}
          <path d={pathFromSeries(kdSeries, yRight)} fill="none" stroke="#10b981" strokeWidth="2"/>
          {kdSeries.map((v,i)=> Number.isFinite(v) ? (
            <circle key={'k'+i} cx={xForIndex(i)} cy={yRight(v)} r={2} fill="#10b981"/>
          ) : null)}

          {hoverIdx !== null && (
            <g pointerEvents="none">
              {locked && (
                <g>
                  <rect x={xForIndex(hoverIdx) - 6} y={margin.top + 6} width={12} height={12} rx={2} ry={2} fill="#f59e0b" opacity={0.95} />
                </g>
              )}
              <line x1={xForIndex(hoverIdx)} y1={margin.top} x2={xForIndex(hoverIdx)} y2={margin.top+innerH} stroke="#9ca3af" strokeDasharray="4 2"/>
              {Number.isFinite(parsedSkill[hoverIdx]) && (
                <circle cx={xForIndex(hoverIdx)} cy={yLeft(parsedSkill[hoverIdx])} r={3.5} fill="#3b82f6"/>
              )}
              {Number.isFinite(kdSeries[hoverIdx]) && (
                <circle cx={xForIndex(hoverIdx)} cy={yRight(kdSeries[hoverIdx])} r={3.5} fill="#10b981"/>
              )}
              {(() => {
                const x = xForIndex(hoverIdx);
                const boxW = 160; const boxH = 56; const pad = 8;
                let bx = x + pad; if (bx + boxW > margin.left + innerW) bx = x - pad - boxW;
                const by = Math.max(margin.top, Math.min(margin.top + innerH - boxH, yLeft(0) - boxH - 6));
                const skillVal = parsedSkill[hoverIdx]; const kdVal = kdSeries[hoverIdx];
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

          <rect x={margin.left} y={margin.top} width={innerW} height={innerH} fill="transparent" onMouseMove={onMove} onMouseLeave={clearHover} onClick={onClickOverlay} />
        </svg>

      {(() => {
        const statsOf = (arr: number[]) => {
          let min = Infinity, max = -Infinity, sum = 0, n = 0;
          for (const v of arr) { if (Number.isFinite(v)) { if (v < min) min = v; if (v > max) max = v; sum += v; n++; } }
          if (n === 0) return null; return { min, max, avg: sum / n };
        };
        const skillStats = statsOf(visibleSkill); const kdStats = statsOf(visibleKD);
        const fmtSkill = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(2);
        const fmtKD = (v: number) => v.toFixed(2);
        return (
          <>
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
          </>
        );
      })()}
    </div>
  );
}
