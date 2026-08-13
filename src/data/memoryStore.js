// In-memory data layer. No GCP account, no network calls — just arrays in
// process memory. Data resets whenever the process restarts. This is the
// default backend (DATA_BACKEND unset or "memory"), so a reader can clone
// the repo and run the app with nothing but `npm install && npm start`.

let services = [
  { id: 'checkout-api', name: 'Checkout API', version: '2.4.1', health: 'healthy', deploySuccessRate: 0.98, owner: 'platform-team' },
  { id: 'billing-worker', name: 'Billing Worker', version: '1.12.0', health: 'healthy', deploySuccessRate: 0.95, owner: 'platform-team' },
  { id: 'notifications-svc', name: 'Notifications Service', version: '0.9.3', health: 'degraded', deploySuccessRate: 0.88, owner: 'platform-team' },
];

let releases = [
  { id: 'r-1001', service: 'checkout-api', version: '2.4.0', status: 'deployed', requestedBy: 'alice', notes: 'Routine patch release', requestedAt: '2026-08-01T14:02:00Z' },
  { id: 'r-1002', service: 'billing-worker', version: '1.12.0', status: 'deployed', requestedBy: 'alice', notes: 'Retry-logic fix', requestedAt: '2026-08-03T09:15:00Z' },
  { id: 'r-1003', service: 'notifications-svc', version: '0.9.3', status: 'failed', requestedBy: 'alice', notes: 'Rolled back — webhook timeout regression', requestedAt: '2026-08-05T11:47:00Z' },
];

let nextId = 1004;

async function getServices() {
  return services;
}

async function getReleases() {
  return [...releases].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
}

async function addRelease({ service, version, requestedBy, notes }) {
  const release = {
    id: `r-${nextId++}`,
    service,
    version,
    status: 'queued',
    requestedBy: requestedBy || '(not provided)',
    notes: notes || '',
    requestedAt: new Date().toISOString(),
  };
  releases.push(release);
  return release;
}

async function getEnvironmentPolicy() {
  return {
    requireApproval: true,
    allowedRegions: ['us-central1', 'us-east1'],
    maxConcurrentDeploys: 2,
  };
}

async function getRuntimeInfo() {
  return {
    dataBackend: 'memory',
    nodeVersion: process.version,
    uptimeSeconds: Math.round(process.uptime()),
  };
}

module.exports = { getServices, getReleases, addRelease, getEnvironmentPolicy, getRuntimeInfo };
