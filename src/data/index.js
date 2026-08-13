// Picks the data backend at startup based on DATA_BACKEND ("memory" | "firestore").
// Every route handler in server.js calls only this module — it never knows or
// cares which backend is behind it. This is what makes A5 possible: a reader
// can run the whole app locally with zero GCP account by leaving DATA_BACKEND
// unset (it defaults to "memory").
//
// Both backends implement the exact same five-function shape:
//   getServices()            -> Promise<Service[]>
//   getReleases()             -> Promise<Release[]>
//   addRelease(input)         -> Promise<Release>
//   getEnvironmentPolicy()    -> Promise<Policy>
//   getRuntimeInfo()          -> Promise<RuntimeInfo>

const backend = (process.env.DATA_BACKEND || 'memory').toLowerCase();

let impl;
if (backend === 'firestore') {
  impl = require('./firestoreStore');
} else if (backend === 'memory') {
  impl = require('./memoryStore');
} else {
  throw new Error(
    `Unknown DATA_BACKEND "${backend}" — expected "memory" or "firestore".`
  );
}

module.exports = impl;
