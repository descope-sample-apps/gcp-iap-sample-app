function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Shared page shell. Every nav link is shown to everyone, with role badges
// on /deploy and /admin, because the app doesn't know who's signed in.
// IAP blocks requests the user isn't allowed to make before they reach
// this container.
//
// The signed-in identity in the sidebar comes from IAP, not the app: the
// browser fetches /?gcp-iap-mode=IDENTITY, which IAP answers directly. This
// file never reads a header, cookie, or token.
// Docs: https://cloud.google.com/iap/docs/query-parameters-and-headers-howto
function layout({ title, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Release Console</title>
<link rel="stylesheet" href="/public/style.css">
</head>
<body>
<aside class="sidebar">
  <a class="brand" href="/">Release Console</a>
  <div class="tagline">IAP × Descope demo</div>

  <nav>
    <a href="/overview">Overview</a>
    <a href="/releases">Releases</a>
    <a href="/deploy">Deploy <span class="role-badge">release-manager</span></a>
    <a href="/admin">Admin <span class="role-badge">admin</span></a>
  </nav>

  <div class="sidebar-footer">
    <span class="user-email" id="iap-identity">signed in</span>
  </div>
</aside>
<main>
  <h1>${escapeHtml(title)}</h1>
  ${body}
</main>
<script>
(function () {
  fetch('/?gcp-iap-mode=IDENTITY', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      var el = document.getElementById('iap-identity');
      if (!el || !data || !data.email) return;
      var match = String(data.email).match(/[^\\s:]+@[^\\s:]+/);
      el.textContent = match ? match[0] : data.email;
    })
    .catch(function () { /* leave the placeholder text as-is */ });
})();
</script>
</body>
</html>`;
}

module.exports = layout;
module.exports.escapeHtml = escapeHtml;
