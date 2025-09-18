"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 ring-1 ring-black/5 dark:ring-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold hover:text-orange-600 transition-colors">
            Canyon Wolf
          </Link>
          <div className="flex items-center gap-6 relative">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center leading-none py-2">
              About
            </Link>

            <div className="relative">
              <button
                type="button"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1 leading-none align-middle py-2"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
              >
                Projects
                <svg
                  className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"} self-center` + ``}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 rounded-md bg-white dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/10 shadow-lg focus:outline-none z-[10000]"
                >
                  <ul className="py-1">
                    <li>
                        <Link
                            href="/projects/oovify"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setOpen(false)}
                        >
                            OOvify
                        </Link>
                    </li>
                    <li>
                      <Link
                        href="/projects/cod-stats"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setOpen(false)}
                      >
                        Call of Duty Statistics Visualizer
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/projects/spark-launcher"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setOpen(false)}
                      >
                        Spark Launcher
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
