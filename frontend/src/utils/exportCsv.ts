export function downloadCsv(blobContent: Blob | string, filename = "atlas_records_export.csv") {
  const blob = typeof blobContent === "string" ? new Blob([blobContent], { type: "text/csv;charset=utf-8;" }) : blobContent
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
