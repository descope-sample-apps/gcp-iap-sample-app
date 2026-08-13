const { escapeHtml } = require('./layout');

module.exports = function admin({ services, policy, runtime }) {
  const registryRows = services
    .map((s) => `<tr><td>${escapeHtml(s.id)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.owner || '—')}</td></tr>`)
    .join('');

  return `
  <section>
    <h2>Environment policy</h2>
    <ul>
      <li>Require approval: <strong>${policy.requireApproval ? 'yes' : 'no'}</strong></li>
      <li>Allowed regions: <strong>${(policy.allowedRegions || []).map(escapeHtml).join(', ') || '—'}</strong></li>
      <li>Max concurrent deploys: <strong>${policy.maxConcurrentDeploys}</strong></li>
    </ul>
  </section>
  <section>
    <h2>Service registry</h2>
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Owner</th></tr></thead>
      <tbody>${registryRows}</tbody>
    </table>
  </section>
  <section>
    <h2>Runtime info</h2>
    <ul>
      <li>Data backend: <strong>${escapeHtml(runtime.dataBackend)}</strong></li>
      <li>Node version: <strong>${escapeHtml(runtime.nodeVersion)}</strong></li>
      <li>Uptime: <strong>${runtime.uptimeSeconds}s</strong></li>
    </ul>
  </section>`;
};
