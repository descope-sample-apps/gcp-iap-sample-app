# Release Console

An internal deploy dashboard. Authentication and authorization happen entirely  
upstream, enforced by Google Cloud IAP with Descope as the identity provider  
via Workforce Identity Federation - before a request ever reaches this  
container.

## Routes


| Route       | Purpose                                            | Who (enforced entirely outside this app) |
| ----------- | -------------------------------------------------- | ---------------------------------------- |
| `/`         | Landing page — explains what this demo shows       | any signed-in user                       |
| `/overview` | Service overview                                   | any signed-in user                       |
| `/releases` | Release history                                    | any signed-in user                       |
| `/deploy`   | Queue a release                                    | `release-manager`                        |
| `/admin`    | Environment policy, service registry, runtime info | `admin`                                  |


The nav shows all four links to everyone, always. IAP blocks *requests*, not  
links — hiding them would misleadingly imply the app is doing the gating.

## Running locally

```bash
npm install
npm start
```