// Firestore (Native mode) data layer. Used when DATA_BACKEND=firestore.
//
// `new Firestore()` with no arguments picks up Application Default
// Credentials — on Cloud Run that's the service account attached to the
// service, never a user identity (A4). There is no credential handling
// code here beyond that constructor call.

const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();
const servicesCol = firestore.collection('services');
const releasesCol = firestore.collection('releases');
const configCol = firestore.collection('config');

async function getServices() {
  const snap = await servicesCol.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getReleases() {
  const snap = await releasesCol.orderBy('requestedAt', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function addRelease({ service, version, requestedBy, notes }) {
  const doc = {
    service,
    version,
    status: 'queued',
    requestedBy: requestedBy || '(not provided)',
    notes: notes || '',
    requestedAt: new Date().toISOString(),
  };
  const ref = await releasesCol.add(doc);
  return { id: ref.id, ...doc };
}

async function getEnvironmentPolicy() {
  const doc = await configCol.doc('environment-policy').get();
  return doc.exists
    ? doc.data()
    : { requireApproval: true, allowedRegions: [], maxConcurrentDeploys: 0 };
}

async function getRuntimeInfo() {
  return {
    dataBackend: 'firestore',
    nodeVersion: process.version,
    uptimeSeconds: Math.round(process.uptime()),
  };
}

module.exports = { getServices, getReleases, addRelease, getEnvironmentPolicy, getRuntimeInfo };
