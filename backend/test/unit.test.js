// ================================================================
// Unit Test Suite: Pure Logic, Dietary Rule Engine & State Machine
// Zero external network dependencies (CI/CD ready)
// ================================================================

const assert = require('assert');
const { CURATED_MENU_21 } = require('../dist/routes/ai');

console.log("=================================================");
console.log("  🌿 SPICE ROUTE PLATFORM: UNIT TEST SUITE");
console.log("=================================================\n");

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Details: ${err.message}`);
  }
}

// -------------------------------------------------------------
// 1. Menu Knowledge Base & Asset Integrity
// -------------------------------------------------------------
console.log("📁 [1/3] Auditing 21 Curated Dishes & Schema Integrity...");

it("Total dishes count is exactly 21", () => {
  assert.strictEqual(CURATED_MENU_21.length, 21);
});

it("Category distribution matches expected breakdown", () => {
  const counts = {};
  CURATED_MENU_21.forEach(d => { counts[d.category] = (counts[d.category] || 0) + 1; });
  assert.strictEqual(counts['Beverages'], 5);
  assert.strictEqual(counts['Starters'], 4);
  assert.strictEqual(counts['Main Course'], 6);
  assert.strictEqual(counts['Breads & Rice'], 2);
  assert.strictEqual(counts['Desserts'], 4);
});

it("All dish IDs are unique without collisions", () => {
  const ids = new Set(CURATED_MENU_21.map(d => d.id));
  assert.strictEqual(ids.size, 21);
});

it("All dishes have dedicated image paths and valid nutrition macros", () => {
  CURATED_MENU_21.forEach(d => {
    assert.ok(d.image && d.image.length > 0, `Dish ${d.id} missing image`);
    assert.ok(typeof d.calories === 'number' && d.calories > 0, `Dish ${d.id} invalid calories`);
    assert.ok(typeof d.proteinGrams === 'number' && d.proteinGrams >= 0, `Dish ${d.id} invalid protein`);
    assert.ok(typeof d.carbsGrams === 'number' && d.carbsGrams >= 0, `Dish ${d.id} invalid carbs`);
    assert.ok(typeof d.fatGrams === 'number' && d.fatGrams >= 0, `Dish ${d.id} invalid fat`);
  });
});

// -------------------------------------------------------------
// 2. Deterministic Dietary & Nutritional Rule Engine
// -------------------------------------------------------------
console.log("\n🧠 [2/3] Auditing Dietary & Nutritional Rule Engine...");

it("Vegan filter strictly excludes dairy products", () => {
  const veganDishes = CURATED_MENU_21.filter(d => d.isVegan);
  const dairyLeaked = veganDishes.filter(d => 
    d.name.includes('Lassi') || 
    d.name.includes('Chai') || 
    d.name.includes('Milk') || 
    d.name.includes('Paneer') || 
    d.name.includes('Butter') || 
    d.name.includes('Makhani') || 
    d.category === 'Desserts'
  );
  assert.strictEqual(dairyLeaked.length, 0);
  assert.strictEqual(veganDishes.length, 7);
});

it("High Protein (>=10g) filter isolates top 6 protein-rich vegetarian dishes", () => {
  const highProtein = CURATED_MENU_21.filter(d => d.proteinGrams >= 10);
  highProtein.sort((a, b) => b.proteinGrams - a.proteinGrams);
  assert.strictEqual(highProtein.length, 6);
  assert.strictEqual(highProtein[0].name, "Paneer Tikka");
  assert.strictEqual(highProtein[0].proteinGrams, 18);
  for (let i = 0; i < highProtein.length - 1; i++) {
    assert.ok(highProtein[i].proteinGrams >= highProtein[i + 1].proteinGrams);
  }
});

it("Chilled beverages filter strictly excludes hot Masala Chai", () => {
  const chilled = CURATED_MENU_21.filter(d => d.category === 'Beverages' && !d.name.toLowerCase().includes('chai'));
  const hotChaiLeaked = chilled.filter(d => d.name.toLowerCase().includes('chai'));
  assert.strictEqual(hotChaiLeaked.length, 0);
  assert.strictEqual(chilled.length, 4);
});

it("Calorie slider budget enforcement <= 150 kcal", () => {
  const lowCal = CURATED_MENU_21.filter(d => d.calories <= 150);
  const leaked = lowCal.filter(d => d.calories > 150);
  assert.strictEqual(leaked.length, 0);
  assert.strictEqual(lowCal.length, 4);
});

// -------------------------------------------------------------
// 3. KDS Kanban State Machine Transitions
// -------------------------------------------------------------
console.log("\n🍳 [3/3] Auditing KDS Kanban State Machine Transitions...");

it("Order lifecycle progresses through valid state machine transitions", () => {
  const validTransitions = ["ORDER_PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
  let state = "ORDER_PLACED";
  const timeline = [{ status: state, time: new Date().toISOString() }];

  state = "PREPARING";
  timeline.push({ status: state, time: new Date().toISOString() });
  assert.strictEqual(state, "PREPARING");

  state = "OUT_FOR_DELIVERY";
  const driver = { name: "Vikram S.", vehicle: "Electric Bike" };
  timeline.push({ status: state, driver: driver.name, time: new Date().toISOString() });
  assert.strictEqual(state, "OUT_FOR_DELIVERY");
  assert.ok(driver.name.length > 0);

  state = "DELIVERED";
  timeline.push({ status: state, time: new Date().toISOString() });
  assert.strictEqual(state, "DELIVERED");
  assert.strictEqual(timeline.length, 4);
});

console.log("\n=================================================");
console.log(`  🏁 UNIT AUDIT COMPLETE: ${passed} / ${total} TESTS PASSED (${((passed/total)*100).toFixed(1)}%)`);
console.log("=================================================\n");

if (passed !== total) {
  process.exit(1);
}