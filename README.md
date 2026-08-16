# Release Console — GCP IAP × Descope


<img width="2094" height="324" alt="descope-gcp-banner" src="https://github.com/user-attachments/assets/56656c2d-ad79-4d3e-9305-04da15377165" />

An internal deploy dashboard with **zero auth code**. No login route, no session, no cookie, no token validation, no user model, and no auth dependency of any kind.

Sign-in and access control happen entirely upstream: Google Cloud IAP sits in front of the app, Descope handles the actual sign-in as an OIDC provider, and Workforce Identity Federation maps Descope's claims onto real Google Cloud IAM identities. IAM decides who reaches which route - before a request ever reaches this container.

## How it works

<img width="2294" height="3045" alt="GCP-IAP-Descope-Flow" src="https://github.com/user-attachments/assets/7e16e8c7-dff5-4dfc-ade1-896c2b678dcc" />

A user hits the app. IAP intercepts the request and redirects them to Descope if they aren't signed in. Descope issues a token carrying a `descope_role` claim. A Workforce Identity Pool maps that claim to an IAM attribute, and IAM allows or denies the request by path. Only approved requests reach the app.

Change a user's role in Descope and their access changes on next sign-in - no redeploy, no code change.

## Routes

| Route | Purpose | Who (enforced outside the app) |
|---|---|---|
| `/` | Landing page | any signed-in user |
| `/overview` | Service overview | any signed-in user |
| `/releases` | Release history | any signed-in user |
| `/deploy` | Queue a release | `release-manager` |
| `/admin` | Policy, registry, runtime info | `admin` |

The nav shows all links to everyone. IAP blocks requests, not links - hiding them would imply the app is doing the gating.

## Run locally

```bash
npm install
npm start
```

Defaults to an in-memory store, so no GCP account is needed. Visit `http://localhost:8080`.

## Run against Firestore

```bash
export DATA_BACKEND=firestore
export GOOGLE_CLOUD_PROJECT=your-project-id
node scripts/seed-firestore.js   # one-time seed
npm start
```

## Deploy

Deploy to Cloud Run with `Require authentication` and `Identity-Aware Proxy (IAP)` enabled, set `DATA_BACKEND=firestore`, and seed Firestore once. The IAP, Workforce Identity Federation, and IAM setup is covered step by step in the blog post.

On a new project, grant the Compute Engine default service account `roles/datastore.user` - otherwise the deployed app can't read Firestore.

## Read more

Full walkthrough: [blog post link]
