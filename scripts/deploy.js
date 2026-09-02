const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env file automatically
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      const val = vals.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error('❌ Error: CLOUDFLARE_API_TOKEN not found in environment or .env file.');
  process.exit(1);
}

console.log('🚀 Deploying CalculatorBowl to Cloudflare Workers...');
try {
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'cmd.exe /c npx wrangler deploy' : 'npx wrangler deploy';
  execSync(cmd, {
    stdio: 'inherit',
    env: process.env,
    cwd: path.resolve(__dirname, '..')
  });
  console.log('✅ Deployment finished successfully!');
} catch (err) {
  console.error('❌ Deployment failed:', err.message);
  process.exit(1);
}
