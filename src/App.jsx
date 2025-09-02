import React, { useEffect, useMemo, useState } from "react";

/** StickerLog v3.6 — sin hologramas
 * - Quita todo lo relacionado a Holo (checkbox, icono, configuración, export CSV)
 * - Mantiene: múltiples álbumes, progreso, agregar rápido, compartir, grid con cantidades,
 *   renombrar/eliminar, exportar/importar JSON, exportar CSV (sin columna holo).
 * - Compatibilidad: si tu localStorage aún tiene `isHolo` u `holograms`, simplemente se ignoran.
 */

const LS_KEY = "stickerlog.albums.v34";

// ===== Utils =====
function loadAlbums() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveAlbums(a) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(a));
  } catch {}
}
function parseRanges(text, max = Infinity) {
  if (!text?.trim()) return [];
  const parts = text.split(/[\s,]+/).filter(Boolean);
  const set = new Set();
  for (const p of parts) {
    if (/^\d+-\d+$/.test(p)) {
      const [a, b] = p.split("-").map(Number);
      const [min, maxv] = a <= b ? [a, b] : [b, a];
      for (let n = min; n <= maxv; n++) if (n >= 1 && n <= max) set.add(n);
    } else {
      const n = Number(p);
      if (Number.isFinite(n) && n >= 1 && n <= max) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}

// ===== App =====
export default function App() {
  const [albums, setAlbums] = useState(loadAlbums);
  const [name, setName] = useState("");
  const [total, setTotal] = useState(200);
  const [selectedId, setSelectedId] = useState(albums[0]?.id ?? null);
  const selected = useMemo(
    () => albums.find((a) => a.id === selectedId) ?? null,
    [albums, selectedId]
  );
  useEffect(() => saveAlbums(albums), [albums]);

  function createAlbum() {
    if (!name.trim() || total < 1) return alert("Completa nombre y total");
    const album = {
      id: crypto.randomUUID?.() || String(Date.now()),
      name: name.trim(),
      total: Number(total),
      // figures: { "5": { count: 2 } }
      figures: {},
      // Los siguientes campos podrían existir en datos antiguos; ya no se usan.
      holograms: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setAlbums((p) => [...p, album]);
    setSelectedId(album.id);
    setName("");
  }

  function renameAlbum(id, newName) {
    if (!newName.trim()) return;
    setAlbums((p) =>
      p.map((a) => (a.id === id ? { ...a, name: newName.trim(), updatedAt: Date.now() } : a))
    );
  }

  function deleteAlbum(id) {
    if (!confirm("¿Eliminar este álbum? Esta acción no se puede deshacer.")) return;
    setAlbums((p) => p.filter((a) => a.id !== id));
    if (id === selectedId) setSelectedId(null);
  }

  function setFigureCount(num, cnt) {
    if (!selected) return;
    const n = Number(num);
    const c = Math.max(0, Number(cnt) || 0);
    setAlbums((p) =>
      p.map((a) => {
        if (a.id !== selected.id) return a;
        const figs = { ...(a.figures || {}) };
        if (c === 0) delete figs[String(n)];
        else figs[String(n)] = { count: c };
        return { ...a, figures: figs, updatedAt: Date.now() };
      })
    );
  }

  function addMany(text) {
    if (!selected) return;
    const nums = parseRanges(text, selected.total);
    if (!nums.length) return;
    setAlbums((p) =>
      p.map((a) => {
        if (a.id !== selected.id) return a;
        const figs = { ...(a.figures || {}) };
        for (const n of nums) {
          const cur = figs[String(n)]?.count ?? 0;
          figs[String(n)] = { count: cur + 1 };
        }
        return { ...a, figures: figs, updatedAt: Date.now() };
      })
    );
  }

  function updateAlbumTotal(id, newTotal) {
    setAlbums((p) =>
      p.map((a) => {
        if (a.id !== id) return a;
        const nt = Math.max(1, Number(newTotal));
        const figs = Object.fromEntries(
          Object.entries(a.figures || {}).filter(([num]) => {
            const n = Number(num);
            return n >= 1 && n <= nt;
          })
        );
        return { ...a, total: nt, figures: figs, updatedAt: Date.now() };
      })
    );
  }

  function exportCSV() {
    if (!selected) return alert("Selecciona un álbum");
    const a = selected;
    const rows = [["album", "total", "numero", "cantidad"].join(",")]; // SIN columna holo
    for (let i = 1; i <= a.total; i++) {
      const e = a.figures[String(i)];
      const c = e?.count ?? 0;
      if (c > 0) rows.push([JSON.stringify(a.name), a.total, i, c].join(","));
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stickerlog_${a.name.replace(/[^a-z0-9_-]+/gi, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    const payload = JSON.stringify(albums, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stickerlog_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target?.result || ""));
        if (!Array.isArray(data)) throw new Error("Formato inválido");
        setAlbums(data);
        setSelectedId(data[0]?.id ?? null);
      } catch {
        alert("No se pudo importar el archivo JSON");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl p-4">
        {/* Header: crear álbum */}
        <header className="mb-4 flex flex-wrap items-center gap-2">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-3 py-3 text-base"
            placeholder="Nombre del álbum"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            inputMode="numeric"
            min={1}
            className="w-24 rounded-lg border border-slate-300 px-3 py-3 text-base text-center"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
          />
          <button
            onClick={createAlbum}
            className="rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Crear álbum
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
            >
              Exportar CSV
            </button>
            <button
              onClick={exportJSON}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
            >
              Exportar JSON
            </button>
            <label className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer">
              Importar JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJSON(f);
                }}
              />
            </label>
          </div>
        </header>

        {/* Selector de álbumes */}
        {albums.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {albums.map((a) => (
              <div
                key={a.id}
                className={`min-w-[12rem] rounded-xl border px-3 py-2 ${
                  selectedId === a.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedId(a.id)}
                    title={`${a.name} (${a.total})`}
                    className="truncate text-left text-sm font-medium flex-1"
                  >
                    {a.name}
                  </button>
                  <button
                    className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                    title="Renombrar"
                    onClick={() => {
                      const nn = prompt("Nuevo nombre del álbum:", a.name);
                      if (nn != null) renameAlbum(a.id, nn);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    title="Eliminar"
                    onClick={() => deleteAlbum(a.id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Únicas: {Object.keys(a.figures || {}).length}/{a.total}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenido */}
        {!selected ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
            Crea tu primer álbum para empezar 👉
          </div>
        ) : (
          <AlbumDetail
            album={selected}
            onSetCount={setFigureCount}
            onAddMany={addMany}
            onUpdateTotal={updateAlbumTotal}
          />
        )}
      </div>
    </div>
  );
}

// ===== Subcomponentes =====
function AlbumDetail({ album, onSetCount, onAddMany, onUpdateTotal }) {
  const ownedSet = useMemo(
    () => new Set(Object.keys(album.figures || {}).map((k) => Number(k))),
    [album.figures]
  );
  const missing = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= album.total; i++) if (!ownedSet.has(i)) arr.push(i);
    return arr;
  }, [album.total, ownedSet]);

  const duplicates = useMemo(
    () => Object.values(album.figures || {}).reduce((s, x) => s + Math.max(0, (x.count || 0) - 1), 0),
    [album.figures]
  );

  const progress = Math.round((ownedSet.size / album.total) * 100);
  const progColor =
    progress < 30 ? "bg-red-500" : progress < 70 ? "bg-amber-500" : "bg-emerald-500";

  const shareMissing = missing.join(", ");
  const repesList = Object.entries(album.figures || {})
    .filter(([, v]) => (v.count || 0) > 1)
    .map(([k, v]) => `${k}(x${(v.count || 0) - 1})`)
    .join(", ");
  const shareText = `Álbum: ${album.name}
Avance: ${ownedSet.size}/${album.total} (${progress}%)
Faltan: ${shareMissing || "—"}
Repetidas: ${repesList || "—"}`;

  return (
    <div className="space-y-4">
      {/* Encabezado + configurar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{album.name}</h2>
          <p className="text-sm text-slate-600">
            {album.total} figuras · {ownedSet.size} únicas
          </p>
        </div>
        <AlbumSettings album={album} onUpdateTotal={onUpdateTotal} />
      </div>

      {/* Progreso */}
      <div>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
          <span>Progreso</span>
          <span>
            Avance: <b>{ownedSet.size}</b> / {album.total} (<b>{progress}%</b>) · Faltan:{" "}
            <b>{album.total - ownedSet.size}</b>
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className={`h-2 rounded-full ${progColor}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <CardStat title="Únicas" value={ownedSet.size} />
        <CardStat title="Faltantes" value={album.total - ownedSet.size} />
        <CardStat title="Repetidas" value={duplicates} />
      </div>

      {/* Agregar rápido */}
      <QuickAdd album={album} onAddMany={onAddMany} />

      {/* Compartir */}
      <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-700">Compartir lista (faltantes y repetidas)</div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
              onClick={() => navigator.clipboard?.writeText(shareText)}
            >
              Copiar texto
            </button>
            <a
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Faltantes (toggle) */}
      <MissingToggle missing={missing} />

      {/* Grid */}
      <GridPanel album={album} onSetCount={onSetCount} />
    </div>
  );
}

function CardStat({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function QuickAdd({ album, onAddMany }) {
  const [bulk, setBulk] = useState("");
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
        <input
          className="sm:col-span-5 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Agregar rápido (1-50, 55, 80-90)"
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
        />
        <button
          className="sm:col-span-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          onClick={() => {
            onAddMany(bulk);
            setBulk("");
          }}
        >
          Sumar +1 a cada uno
        </button>
      </div>
    </div>
  );
}

function MissingToggle({ missing }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-slate-700">
          Faltan <b>{missing.length}</b> figuritas
        </div>
        <button
          className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-100"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Ocultar" : "Ver lista"}
        </button>
      </div>
      {open && (
        <div className="max-h-56 overflow-auto rounded-md border border-slate-200 p-2 text-sm leading-7 select-all">
          {missing.join(", ") || "—"}
        </div>
      )}
    </div>
  );
}

function GridPanel({ album, onSetCount }) {
  const [query, setQuery] = useState("");
  const numbers = useMemo(() => {
    const all = Array.from({ length: album.total }, (_, i) => i + 1);
    if (!query.trim()) return all;
    const parts = query.split(/[\s,]+/).filter(Boolean);
    const sel = new Set();
    for (const p of parts) {
      if (/^\d+-\d+$/.test(p)) {
        const [a, b] = p.split("-").map(Number);
        const [min, maxv] = a <= b ? [a, b] : [b, a];
        for (let n = min; n <= maxv; n++) if (n >= 1 && n <= album.total) sel.add(n);
      } else {
        const n = Number(p);
        if (Number.isFinite(n) && n >= 1 && n <= album.total) sel.add(n);
      }
    }
    return Array.from(sel).sort((a, b) => a - b);
  }, [album.total, query]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Filtrar (1-20, 5, 50-60)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="sm:col-span-2 text-sm text-slate-500">
          Toca para sumar 1. Edita la cantidad.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {numbers.map((n) => {
          const entry = (album.figures || {})[String(n)];
          const count = entry?.count ?? 0;
          const isOwned = count > 0;
          return (
            <div
              key={n}
              className={`group rounded-xl border p-2 text-center text-sm ${
                isOwned ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="rounded bg-slate-100 px-1">#{n}</span>
              </div>

              <button
                className="mb-1 block w-full rounded-lg bg-slate-100 py-1 text-xs hover:bg-slate-200"
                onClick={() => onSetCount(n, count + 1)}
                title="Sumar 1"
              >
                {isOwned ? `x${count}` : "Agregar"}
              </button>

              <div className="flex items-center justify-center gap-1">
                <input
                  className="w-14 rounded-lg border border-slate-300 px-2 py-1 text-xs text-center"
                  type="number"
                  min={0}
                  value={count}
                  onChange={(e) => onSetCount(n, Number(e.target.value))}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlbumSettings({ album, onUpdateTotal }) {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(album.total);

  useEffect(() => {
    setTotal(album.total);
  }, [album.id]);

  return (
    <div className="relative">
      <button
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
        onClick={() => setOpen((v) => !v)}
      >
        Configurar
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-[22rem] max-w-[90vw] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
          <h4 className="mb-2 text-sm font-medium text-slate-700">Configuración del álbum</h4>
          <label className="text-sm">
            Total de figuras
            <input
              type="number"
              inputMode="numeric"
              min={1}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
            />
          </label>
          <div className="mt-3 flex justify-end gap-2">
            <button
              className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => {
                onUpdateTotal(album.id, total);
                setOpen(false);
              }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
