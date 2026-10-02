import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

if (!existsSync('node_modules')) {
  console.log('Installing dependencies for the first run...');
  run('npm', ['install']);
}

if (!existsSync('.next')) {
  console.log('Preparing the production build...');
  run('npm', ['run', 'build']);
}

run(process.platform === 'win32' ? 'node_modules\\.bin\\next.cmd' : './node_modules/.bin/next', ['start']);
