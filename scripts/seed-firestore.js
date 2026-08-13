// One-off script: seeds Firestore with the same starter data memoryStore.js
// ships with, so a fresh Cloud Run deployment isn't just an empty console.
// Run once, locally, with GCP credentials available: `node scripts/seed-firestore.js`

const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

const services = [
  { id: 'checkout-api', name: 'Checkout API', version: '2.4.1', health: 'healthy', deploySuccessRate: 0.98, owner: 'platform-team' },
  { id: 'billing-worker', name: 'Billing Worker', version: '1.12.0', health: 'healthy', deploySuccessRate: 0.95, owner: 'platform-team' },
  { id: 'notifications-svc', name: 'Notifications Service', version: '0.9.3', health: 'degraded', deploySuccessRate: 0.88, owner: 'platform-team' },
];

const policy = {
  requireApproval: true,
  allowedRegions: ['us-central1', 'us-east1'],
  maxConcurrentDeploys: 2,
};

async function main() {
  const batch = firestore.batch();
  for (const svc of services) {
    const { id, ...rest } = svc;
    batch.set(firestore.collection('services').doc(id), rest);
  }
  batch.set(firestore.collection('config').doc('environment-policy'), policy);
  await batch.commit();
  console.log(`Seeded ${services.length} services + environment policy into Firestore.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
