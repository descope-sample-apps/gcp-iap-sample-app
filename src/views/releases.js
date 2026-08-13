const { escapeHtml } = require('./layout');

module.exports = function releases({ releases }) {
  const rows = releases.map((r) => `
    <tr>
      <td>${escapeHtml(r.id)}</td>
      <td>${escapeHtml(r.service)}</td>
      <td><code>${escapeHtml(r.version)}</code></td>
      <td><span class="badge badge-${escapeHtml(r.status)}">${escapeHtml(r.status)}</span></td>
      <td>${escapeHtml(r.requestedBy)}</td>
      <td>${escapeHtml(new Date(r.requestedAt).toLocaleString())}</td>
      <td>${escapeHtml(r.notes || '')}</td>
    </tr>`).join('');

  return `
  <table>
    <thead><tr><th>ID</th><th>Service</th><th>Version</th><th>Status</th><th>Requested by</th><th>When</th><th>Notes</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
};
