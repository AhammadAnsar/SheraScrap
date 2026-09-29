// The legacy suite depended on production test-token authentication.
// Run the isolated regression suite that explicitly rejects that bypass.
const { spawnSync } = require('node:child_process');
const result = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'tests/deploy.test.ts'], { stdio: 'inherit', windowsHide: true });
process.exit(result.status ?? 1);
