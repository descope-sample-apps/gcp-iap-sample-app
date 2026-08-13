function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Shared page shell. The nav always shows all four links, with their
// required role shown as a badge, to everyone — the app has no idea who's
// signed in or what they're allowed to do (A8). IAP blocks requests before
// they reach this container; it doesn't hide links.
//
// The identity shown at the bottom of the sidebar is not an app feature —
// it's a client-side fetch to a special query parameter IAP itself
// intercepts and answers directly (gcp-iap-mode=IDENTITY). This file never
// reads a header, a cookie, or a token; it only points the browser at IAP's
// own endpoint, which is why this still audits clean (scripts/audit-auth.sh).
// Docs: https://cloud.google.com/iap/docs/query-parameters-and-headers-howto
//
// (An earlier version also linked gcp-iap-mode=CLEAR_LOGIN_COOKIE as a
// "Sign out" button. Removed: it only clears IAP's own cookie, not the
// underlying Descope browser session, so on this single-page-per-service
// app — where every route requires sign-in and there's no public page to
// land on — the very next request just silently re-authenticates via SSO.
// The button looked broken because, for a live session, it functionally is.)
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
