"use client";
import React, { useState } from "react";

export default function ShareCodeBox({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Share Code</div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Collapse share code" : "Expand share code"}
            className="group inline-flex items-center text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {open ? (
              <svg className="w-4 h-4 transition-transform duration-200 ease-out group-hover:scale-110 active:scale-95" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1.646 11.354a.5.5 0 0 0 .708 0L8 5.707l5.646 5.647a.5.5 0 0 0 .708-.708l-6-6a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 0 .708" />
              </svg>
            ) : (
              <svg className="w-4 h-4 transition-transform duration-200 ease-out group-hover:scale-110 active:scale-95" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
              </svg>
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
            } catch {
              /* ignore */
            }
          }}
          className="inline-flex items-center justify-center rounded-md bg-orange-600 px-2 py-1 text-white text-xs font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Copy
        </button>
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
