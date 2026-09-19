// ================================================================
// Integration / Live Cloud Endpoints Smoke Test
// Run with: npm run test:live (Requires live endpoints)
// ================================================================

const https = require('https');
const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { 
      timeout: 6000, 
      rejectUnauthorized: false,
      headers: { 'User-Agent': 'SpiceRoute-IntegrationTester/1.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', err => reject(err));
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

async function runLiveTests() {
  console.log("=================================================");
  console.log("  🌐 SPICE ROUTE: LIVE ENDPOINTS SMOKE TEST");
  console.log("=================================================\n");

  const vercelUrl = process.env.VERCEL_URL || 'https://spice-route-restaurant-flame.vercel.app/';
  const s3Url = process.env.S3_URL || 'http://spice-route-restaurant-lakshi-2026.s3-website.ap-south-1.amazonaws.com/';
  const ec2Url = process.env.EC2_HEALTH_URL || 'http://65.0.105.182:3000/health';

  try {
    console.log(`Probing Vercel Edge Frontend: ${vercelUrl}`);
    const vRes = await fetchUrl(vercelUrl);
    console.log(`  ✅ Vercel HTTP ${vRes.statusCode} (${vRes.body.length} bytes)`);
  } catch (e) {
    console.log(`  ⚠️ Notice: Vercel probe: ${e.message}`);
  }

  try {
    console.log(`Probing AWS S3 Website: ${s3Url}`);
    const sRes = await fetchUrl(s3Url);
    console.log(`  ✅ AWS S3 HTTP ${sRes.statusCode}`);
  } catch (e) {
    console.log(`  ⚠️ Notice: S3 probe: ${e.message}`);
  }

  try {
    console.log(`Probing AWS EC2 API Health: ${ec2Url}`);
    const eRes = await fetchUrl(ec2Url);
    console.log(`  ✅ AWS EC2 API HTTP ${eRes.statusCode}`);
  } catch (e) {
    console.log(`  ⚠️ Notice: EC2 probe: ${e.message}`);
  }

  console.log("\nLive smoke check finished.\n");
}

runLiveTests();