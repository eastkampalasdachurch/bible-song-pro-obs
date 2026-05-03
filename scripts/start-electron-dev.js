const { spawn, exec } = require('child_process');

console.log('Building Next.js...');
exec('bun run build:next', (err) => {
  if (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
  console.log('Building Electron...');
  exec('bun run build:electron', (err) => {
    if (err) {
      console.error('Electron build failed:', err);
      process.exit(1);
    }

    console.log('Starting Next.js dev server...');
    spawn('bun', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      detached: true
    });

    console.log('Waiting for Next.js server...');
    setTimeout(() => {
      console.log('Starting Electron...');
      spawn('npx', ['electron', '.'], {
        stdio: 'inherit',
        shell: true
      });
    }, 6000);
  });
});