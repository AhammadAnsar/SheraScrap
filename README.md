# Shera Scrap Haraj

Arabic/English multi-page website with React SSR, full-document public navigation, and a persistent Express CMS/API.

## Run

Requires Node.js 22.14+.

```sh
npm ci
npm run dev
```

## Production

```sh
npm run lint
npm run build
npm test
npm start
```

Read [DEPLOYMENT.md](DEPLOYMENT.md) for Node/Docker hosting, Firebase CMS access, persistent data, reverse proxy and launch checks. See [RELEASE-NOTES.md](RELEASE-NOTES.md) for audit fixes and validation scope.

Serve through Express, not a static index.html rewrite. `npm test` uses an isolated temporary store; it never changes the client's dataset.
