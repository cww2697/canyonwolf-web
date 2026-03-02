"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-5xl">
      <div className="glass rounded-2xl px-8 py-4 flex items-center justify-between transition-all duration-300">
        <Link href="/" className="text-2xl font-black tracking-tighter hover:text-primary transition-all flex items-center gap-2 group">
          <span className="text-primary group-hover:scale-110 transition-transform">C</span>
          <span className="text-secondary group-hover:scale-110 group-hover:translate-x-0.5 transition-transform">W</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="px-4 py-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-primary transition-all rounded-xl hover:bg-primary/5">
            Home
          </Link>
          
          <div className="relative group/dropdown">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-primary transition-all flex items-center gap-1.5 rounded-xl hover:bg-primary/5 ${open ? "opacity-100 text-primary bg-primary/5" : ""}`}
              onClick={() => setOpen((v) => !v)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
            >
              Projects
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </button>

            {open && (
              <div
                className="absolute right-0 mt-3 w-72 glass rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300"
              >
                <div className="p-2">
                  {[
                    { name: "OOvify", href: "/projects/oovify", desc: "Interactive media tool", tag: "" },
                    { name: "COD Stats", href: "/projects/cod-stats", desc: "Performance visualizer", tag: "" },
                    { name: "Spark Launcher", href: "/projects/spark-launcher", desc: "Modern game library", tag: "BETA", tagColor: "bg-primary/20 text-primary" },
                    { name: "TerraVista", href: "/projects/terravista", desc: "X-Plane addon manager", tag: "COMING SOON", tagColor: "bg-green-500/20 text-green-500" },
                  ].map((project) => (
                    <Link
                      key={project.href}
                      href={project.href}
                      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/10 transition-all group/item"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold group-hover/item:text-primary transition-colors">{project.name}</span>
                        <span className="text-[11px] opacity-50 font-medium">{project.desc}</span>
                      </div>
                      {project.tag && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black tracking-wider ${project.tagColor}`}>
                          {project.tag}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
