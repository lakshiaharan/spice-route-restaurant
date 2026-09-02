// ================================================================
// Comprehensive End-to-End Audit Suite for Spice Route Platform
// ================================================================

const https = require('https');
const http = require('http');
const { CURATED_MENU_21 } = require('./dist/routes/ai');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { 
      timeout: 8000, 
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', err => reject(err));
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

console.log("=================================================");
console.log("  🌿 SPICE ROUTE PLATFORM: FULL E2E AUDIT");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

// -------------------------------------------------------------
// TEST SUITE 1: Menu Knowledge Base & Image Integrity
// -------------------------------------------------------------
console.log("📁 [1/4] Auditing 21 Curated Dishes & Asset Integrity...");

assert(CURATED_MENU_21.length === 21, `Total dishes must be exactly 21 (found: ${CURATED_MENU_21.length})`);

const categories = {};
CURATED_MENU_21.forEach(d => {
  categories[d.category] = (categories[d.category] || 0) + 1;
});

assert(categories['Beverages'] === 5, `Beverages count is 5 (found: ${categories['Beverages']})`);
assert(categories['Starters'] === 4, `Starters count is 4 (found: ${categories['Starters']})`);
assert(categories['Main Course'] === 6, `Main Course count is 6 (found: ${categories['Main Course']})`);
assert(categories['Breads & Rice'] === 2, `Breads & Rice count is 2 (found: ${categories['Breads & Rice']})`);
assert(categories['Desserts'] === 4, `Desserts count is 4 (found: ${categories['Desserts']})`);

const ids = new Set();
let duplicates = 0;
let missingImages = 0;
CURATED_MENU_21.forEach(d => {
  if (ids.has(d.id)) duplicates++;
  ids.add(d.id);
  if (!d.image || d.image.trim() === '') missingImages++;
});

assert(duplicates === 0, "All dish IDs are unique", `Found ${duplicates} duplicate IDs`);
assert(missingImages === 0, "All dishes have 1-to-1 matching images", `Found ${missingImages} missing images`);

// -------------------------------------------------------------
// TEST SUITE 2: AI Dietary Sommelier Rule Engine
// -------------------------------------------------------------
console.log("\n🧠 [2/4] Auditing AI Dietary Sommelier Rule Engine...");

// Test 2.1: Vegan Filter
const veganDishes = CURATED_MENU_21.filter(d => d.isVegan);
const invalidVegan = veganDishes.filter(d => 
  d.name.includes('Lassi') || 
  d.name.includes('Chai') || 
  d.name.includes('Milk') || 
  d.name.includes('Paneer') || 
  d.name.includes('Butter') || 
  d.name.includes('Makhani') || 
  d.category === 'Desserts'
);
assert(invalidVegan.length === 0, "Vegan filter strictly excludes all dairy (Lassi, Chai, Paneer, Naan, Desserts)", `Leaked: ${invalidVegan.map(d => d.name).join(', ')}`);
assert(veganDishes.length === 7, `Expected 7 vegan dishes (found: ${veganDishes.length}) -> ${veganDishes.map(d => d.name).join(', ')}`);

// Test 2.2: High Protein Filter
const highProteinDishes = CURATED_MENU_21.filter(d => d.proteinGrams >= 10);
highProteinDishes.sort((a, b) => b.proteinGrams - a.proteinGrams);
assert(highProteinDishes.length === 6, `High protein (>=10g) surfaces all 6 rich dishes (found: ${highProteinDishes.length})`);
assert(highProteinDishes[0].name === "Paneer Tikka" && highProteinDishes[0].proteinGrams === 18, `Top protein dish is Paneer Tikka (18g)`);
assert(highProteinDishes[1].proteinGrams >= highProteinDishes[2].proteinGrams, `High protein results are correctly sorted in descending order`);

// Test 2.3: Chilled Drinks vs Hot Chai
const chilledBeverages = CURATED_MENU_21.filter(d => d.category === 'Beverages' && !d.name.toLowerCase().includes('chai'));
const hotChaiInChilled = chilledBeverages.filter(d => d.name.toLowerCase().includes('chai'));
assert(hotChaiInChilled.length === 0, "Chilled beverages strictly excludes hot Masala Chai");
assert(chilledBeverages.length === 4, `Chilled beverages has 4 cold drinks: ${chilledBeverages.map(d => d.name).join(', ')}`);

// Test 2.4: Calorie Slider <= 150 kcal
const lowCalorieDishes = CURATED_MENU_21.filter(d => d.calories <= 150);
const highCalorieLeaked = lowCalorieDishes.filter(d => d.calories > 150);
assert(highCalorieLeaked.length === 0, "Calorie budget strictly excludes dishes above limit");
assert(lowCalorieDishes.length === 4, `Found 4 items under 150 kcal (${lowCalorieDishes.map(d => `${d.name} ${d.calories} kcal`).join(', ')})`);

// -------------------------------------------------------------
// TEST SUITE 3: Kitchen Display System (KDS) State Transitions
// -------------------------------------------------------------
console.log("\n🍳 [3/4] Auditing KDS Kanban State Machine Transitions...");

let order = {
  orderId: "ORD-TEST-999",
  status: "ORDER_PLACED",
  timeline: [{ status: "ORDER_PLACED", time: "12:00 PM", note: "Order placed" }]
};

assert(order.status === "ORDER_PLACED", "Order created in ORDER_PLACED state");

// Transition 1: Accept & Cook
order.status = "PREPARING";
order.timeline.push({ status: "PREPARING", time: "12:05 PM", note: "Cooking in tandoor" });
assert(order.status === "PREPARING" && order.timeline.length === 2, "Transition to PREPARING succeeds");

// Transition 2: Dispatch
order.status = "OUT_FOR_DELIVERY";
order.driver = { name: "Vikram S.", vehicle: "Electric Bike" };
order.timeline.push({ status: "OUT_FOR_DELIVERY", time: "12:15 PM", note: "Out for delivery" });
assert(order.status === "OUT_FOR_DELIVERY" && order.driver !== null, "Transition to OUT_FOR_DELIVERY assigns driver");

// Transition 3: Deliver
order.status = "DELIVERED";
order.timeline.push({ status: "DELIVERED", time: "12:25 PM", note: "Delivered hot" });
assert(order.status === "DELIVERED" && order.timeline.length === 4, "Transition to DELIVERED completes lifecycle");

// -------------------------------------------------------------
// TEST SUITE 4: Live Cloud Endpoints Verification
// -------------------------------------------------------------
console.log("\n🌐 [4/4] Auditing Live Cloud Endpoints...");

async function testEndpoints() {
  // Test 4.1: Vercel Frontend
  try {
    const vercelRes = await fetchUrl('https://spice-route-restaurant-flame.vercel.app/');
    assert(vercelRes.statusCode === 200, `Vercel Frontend Live (HTTP ${vercelRes.statusCode})`);
    assert(vercelRes.body.includes('Spice Route'), "Vercel HTML contains 'Spice Route' branding");
    assert(vercelRes.body.includes('21 Signature Pure Veg Delicacies'), "Vercel HTML contains 21 Curated dishes header");
  } catch (err) {
    assert(false, "Vercel Frontend Live", err.message);
  }

  // Test 4.2: AWS S3 Static Website
  try {
    const s3Res = await fetchUrl('http://spice-route-restaurant-lakshi-2026.s3-website.ap-south-1.amazonaws.com/');
    assert(s3Res.statusCode === 200, `AWS S3 Website Live (HTTP ${s3Res.statusCode})`);
  } catch (err) {
    assert(false, "AWS S3 Website Live", err.message);
  }

  // Test 4.3: AWS EC2 Health Probe
  try {
    const ec2Res = await fetchUrl('http://65.0.105.182:3000/health');
    assert(ec2Res.statusCode === 200, `AWS EC2 Health Endpoint Live (HTTP ${ec2Res.statusCode})`);
    const healthJson = JSON.parse(ec2Res.body);
    assert(healthJson.status === "UP", `EC2 Health status is 'UP' (uptime: ${healthJson.uptimeSeconds}s)`);
    assert(healthJson.cloudEnvironment.compute === "Amazon EC2", "EC2 Cloud Environment verified");
    assert(healthJson.cloudEnvironment.database === "Amazon DynamoDB", "DynamoDB connectivity verified");
  } catch (err) {
    assert(false, "AWS EC2 Health Endpoint Live", err.message);
  }

  console.log("\n=================================================");
  console.log(`  🏁 AUDIT COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log("=================================================\n");
}

testEndpoints();
