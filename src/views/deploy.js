const { escapeHtml } = require('./layout');

module.exports = function deploy({ services }) {
  const options = services
    .map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`)
    .join('');

  return `
  <p>This form writes directly to the data layer. There is no gate here in
  application code — whether you can even load this page was decided entirely
  by IAP, before the request reached this container.</p>
  <form method="POST" action="/deploy">
    <label>Service
      <select name="service" required>${options}</select>
    </label>
    <label>Version
      <input type="text" name="version" placeholder="e.g. 1.4.2" required>
    </label>
    <label>Requested by
      <input type="text" name="requestedBy" placeholder="your name — this app has no idea who you are">
    </label>
    <label>Notes
      <textarea name="notes" rows="3" placeholder="optional"></textarea>
    </label>
    <button type="submit">Queue release</button>
  </form>`;
};
