type Cell = string | number;

const escapeCell = (cell: Cell) => {
  const text = String(cell);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Build a CSV from rows and trigger a browser download. Client-side only. */
export function downloadCsv(filename: string, rows: Cell[][]) {
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
