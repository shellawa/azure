/**
 * Convert a byte count into a human-readable string.
 *
 * @param {number} bytes The number of bytes.
 * @param {number} decimals Number of decimal places (default: 2).
 * @returns {string}
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = Math.max(0, decimals)
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))

  return `${value} ${sizes[i]}`
}
