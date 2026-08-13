// Release Console — an internal deploy dashboard with zero auth code.
//
// Every route below does exactly one thing: read or write the data layer and
// render HTML. Nothing here checks who's calling, validates a token, reads a
// cookie, or knows about a session. Who can sign in and who can reach which
// route is decided entirely upstream, in Google Cloud IAP — this file is
// proof of that claim (see scripts/audit-auth.sh).

const path = require('path');
const express = require('express');
const data = require('./src/data');
const layout = require('./src/views/layout');
const landingView = require('./src/views/landing');
const homeView = require('./src/views/home');
const releasesView = require('./src/views/releases');
const deployView = require('./src/views/deploy');
const adminView = require('./src/views/admin');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/healthz', (req, res) => res.status(200).send('ok'));

app.get('/', (req, res) => {
  res.send(layout({ title: 'Release Console — Demo', body: landingView() }));
});

app.get('/overview', async (req, res, next) => {
  try {
    const services = await data.getServices();
    res.send(layout({ title: 'Service Overview', body: homeView({ services }) }));
  } catch (err) {
    next(err);
  }
});

app.get('/releases', async (req, res, next) => {
  try {
    const releases = await data.getReleases();
    res.send(layout({ title: 'Release History', body: releasesView({ releases }) }));
  } catch (err) {
    next(err);
  }
});

app.get('/deploy', async (req, res, next) => {
  try {
    const services = await data.getServices();
    res.send(layout({ title: 'Queue a Release', body: deployView({ services }) }));
  } catch (err) {
    next(err);
  }
});

app.post('/deploy', async (req, res, next) => {
  try {
    const { service, version, requestedBy, notes } = req.body;
    await data.addRelease({ service, version, requestedBy, notes });
    res.redirect('/releases');
  } catch (err) {
    next(err);
  }
});

app.get('/admin', async (req, res, next) => {
  try {
    const [services, policy, runtime] = await Promise.all([
      data.getServices(),
      data.getEnvironmentPolicy(),
      data.getRuntimeInfo(),
    ]);
    res.send(layout({ title: 'Admin', body: adminView({ services, policy, runtime }) }));
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).send(layout({ title: 'Not found', body: '<p>Not found.</p>' }));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(layout({ title: 'Error', body: '<p>Something went wrong.</p>' }));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Release Console listening on :${port} (DATA_BACKEND=${process.env.DATA_BACKEND || 'memory'})`);
});

module.exports = app;
