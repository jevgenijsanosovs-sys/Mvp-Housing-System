// =====================================
// FORMAT DATE
// =====================================

export function formatDate(date) {

  if (!date) {
    return "";
  }

  return new Date(date)
    .toISOString()
    .slice(0, 10);

}
