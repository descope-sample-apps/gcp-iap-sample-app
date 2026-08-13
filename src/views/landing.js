module.exports = function landing() {
  return `
  <section>
    <p class="lede">This app shows how to put <strong>Google Cloud
    Identity-Aware Proxy (IAP)</strong> in front of an ordinary web app as a
    reverse proxy, use <strong>Descope</strong> as the identity provider, and
    map Descope claims onto real GCP identities — all without changing a
    single line of the app itself.</p>
  </section>

  <section>
    <h2>How it works</h2>
    <ol>
      <li>IAP sits in front of this app on Cloud Run and requires sign-in
      before any request reaches it.</li>
      <li>Descope handles that sign-in as an OIDC identity provider, wired to
      Google Cloud through Workforce Identity Federation.</li>
      <li>Descope issues a token carrying a custom role claim, for example
      <code>release-manager</code> or <code>admin</code>. Google Cloud maps
      that claim onto a real IAM identity.</li>
      <li>That identity is checked against IAM policies attached to this
      Cloud Run service — rules like "only <code>release-manager</code> may
      reach <code>/deploy</code>." Those rules live entirely in GCP
      configuration, not in this app's code, and IAP enforces them before the
      request ever arrives here.</li>
    </ol>
  </section>

  <section>
    <h2>Try it</h2>
    <ul>
      <li><a href="/overview">Overview</a> and <a href="/releases">Releases</a> — any signed-in user</li>
      <li><a href="/deploy">Deploy</a> — only if your role is <code>release-manager</code></li>
      <li><a href="/admin">Admin</a> — only if your role is <code>admin</code></li>
    </ul>
  </section>`;
};
