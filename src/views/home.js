const { escapeHtml } = require('./layout');

module.exports = function home({ services }) {
  const cards = services.map((s) => `
    <div class="stat-card badge-${escapeHtml(s.health)}">
      <h3>${escapeHtml(s.name)}</h3>
      <div class="version"><code>${escapeHtml(s.version)}</code></div>
      <span class="badge badge-${escapeHtml(s.health)}">${escapeHtml(s.health)}</span>
      <div class="rate">${Math.round(s.deploySuccessRate * 100)}%</div>
      <div class="muted">deploy success rate</div>
    </div>`).join('');

  return `<div class="card-grid">${cards}</div>`;
};
