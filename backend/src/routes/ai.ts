import { Router, Request, Response } from "express";

const router = Router();

export interface DishNutrition {
  id: string;
  name: string;
  category: "Beverages" | "Starters" | "Main Course" | "Breads & Rice" | "Desserts";
  price: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  isVegan: boolean;
  isGlutenFree: boolean;
  isNutFree: boolean;
  isJainFriendly: boolean;
  isDiabeticFriendly: boolean;
  allergens: string[];
  ingredients: string[];
  healthBenefit: string;
  image: string;
}

// 21 Curated Signature Dishes with 1-to-1 Image Match
export const CURATED_MENU_21: DishNutrition[] = [
  // --- BEVERAGES (5) ---
  {
    id: "bev-1",
    name: "Mango Lassi",
    category: "Beverages",
    price: 90,
    calories: 180,
    proteinGrams: 5,
    carbsGrams: 32,
    fatGrams: 4,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: true,
    isDiabeticFriendly: false,
    allergens: ["Dairy (Curd)"],
    ingredients: ["Fresh Curd", "Alphonso Mango Pulp", "Cardamom", "Sugar"],
    healthBenefit: "Active probiotics promote healthy gut microbiome and natural digestion.",
    image: "images/mango_lassi_1788090345225.jpg"
  },
  {
    id: "bev-2",
    name: "Masala Chai",
    category: "Beverages",
    price: 50,
    calories: 85,
    proteinGrams: 3,
    carbsGrams: 12,
    fatGrams: 2,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: true,
    isDiabeticFriendly: true,
    allergens: ["Dairy (Milk)"],
    ingredients: ["Assam CTC Tea", "Crushed Ginger", "Cloves", "Cardamom", "Milk"],
    healthBenefit: "Ginger and cloves stimulate digestive enzymes and boost immunity.",
    image: "images/masala_chai_1788090358437.jpg"
  },
  {
    id: "bev-3",
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 60,
    calories: 35,
    proteinGrams: 0,
    carbsGrams: 8,
    fatGrams: 0,
    isVegan: true,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: true,
    isDiabeticFriendly: true,
    allergens: [],
    ingredients: ["Fresh Lemon Juice", "Sparkling Soda", "Black Rock Salt", "Mint Leaves"],
    healthBenefit: "Zero fat, alkalizing, high Vitamin C, instant cellular rehydration.",
    image: "images/fresh_lime_soda_1788090897344.jpg"
  },
  {
    id: "bev-4",
    name: "Jaljeera",
    category: "Beverages",
    price: 50,
    calories: 45,
    proteinGrams: 1,
    carbsGrams: 10,
    fatGrams: 0,
    isVegan: true,
    isGlutenFree: false,
    isNutFree: true,
    isJainFriendly: true,
    isDiabeticFriendly: true,
    allergens: ["Gluten (Gram Boondi)"],
    ingredients: ["Roasted Cumin", "Dry Mint", "Black Salt", "Tamarind", "Boondi"],
    healthBenefit: "Roasted cumin soothes acid reflux and regulates internal body heat.",
    image: "images/jaljeera_1788090909633.jpg"
  },
  {
    id: "bev-5",
    name: "Kesar Badam Milk",
    category: "Beverages",
    price: 110,
    calories: 190,
    proteinGrams: 7,
    carbsGrams: 22,
    fatGrams: 8,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: false,
    isJainFriendly: true,
    isDiabeticFriendly: false,
    allergens: ["Dairy (Milk)", "Nuts (Almonds)"],
    ingredients: ["Full Cream Milk", "Crushed Almonds", "Kashmiri Saffron", "Cardamom"],
    healthBenefit: "Saffron and almond flavonoids nourish the nervous system and cognitive focus.",
    image: "images/badam_milk.jpg"
  },

  // --- STARTERS & CHAAT (4) ---
  {
    id: "str-1",
    name: "Paneer Tikka",
    category: "Starters",
    price: 220,
    calories: 310,
    proteinGrams: 18,
    carbsGrams: 12,
    fatGrams: 20,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: false,
    isDiabeticFriendly: true,
    allergens: ["Dairy (Paneer)"],
    ingredients: ["Cottage Cheese", "Hung Curd", "Kashmiri Chili", "Bell Peppers", "Onions"],
    healthBenefit: "High protein, calcium-rich, low-glycemic, and ideal for lean muscle growth.",
    image: "images/paneer_tikka_1788088652488.jpg"
  },
  {
    id: "str-2",
    name: "Punjabi Samosa (2 pcs)",
    category: "Starters",
    price: 80,
    calories: 260,
    proteinGrams: 5,
    carbsGrams: 34,
    fatGrams: 12,
    isVegan: true,
    isGlutenFree: false,
    isNutFree: false,
    isJainFriendly: false,
    isDiabeticFriendly: false,
    allergens: ["Gluten (Wheat)", "Nuts (Cashews)"],
    ingredients: ["Wheat Crust", "Spiced Potatoes", "Green Peas", "Cashew Bits", "Mint Chutney"],
    healthBenefit: "Savory comfort food spiced with cumin and dry mango powder for satiety.",
    image: "images/samosa_1788090332194.jpg"
  },
  {
    id: "str-3",
    name: "Gobi Manchurian",
    category: "Starters",
    price: 180,
    calories: 220,
    proteinGrams: 6,
    carbsGrams: 28,
    fatGrams: 9,
    isVegan: true,
    isGlutenFree: false,
    isNutFree: true,
    isJainFriendly: false,
    isDiabeticFriendly: false,
    allergens: ["Gluten", "Soy"],
    ingredients: ["Cauliflower Florets", "Garlic", "Ginger", "Dark Soy Sauce", "Spring Onions"],
    healthBenefit: "Glucosinolates in cauliflower provide cellular detox and rich dietary fiber.",
    image: "images/gobi_manchurian.jpg"
  },
  {
    id: "str-4",
    name: "Street Pani Puri (8 pcs)",
    category: "Starters",
    price: 80,
    calories: 140,
    proteinGrams: 3,
    carbsGrams: 28,
    fatGrams: 2,
    isVegan: true,
    isGlutenFree: false,
    isNutFree: true,
    isJainFriendly: false,
    isDiabeticFriendly: false,
    allergens: ["Gluten (Wheat Puris)"],
    ingredients: ["Crisp Semolina Puris", "Spiced Mint Water", "Tamarind Chutney", "Boiled Moong"],
    healthBenefit: "Mint, rock salt, and tamarind water stimulate gastric juices and digestion.",
    image: "images/pani_puri.jpg"
  },

  // --- ROYAL MAIN COURSE (6) ---
  {
    id: "main-1",
    name: "Palak Paneer",
    category: "Main Course",
    price: 280,
    calories: 340,
    proteinGrams: 16,
    carbsGrams: 10,
    fatGrams: 24,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: false,
    isDiabeticFriendly: true,
    allergens: ["Dairy (Paneer & Cream)"],
    ingredients: ["Spinach Puree", "Cottage Cheese", "Garlic", "Tomato Gravy", "Desi Butter"],
    healthBenefit: "Iron-rich spinach and lean paneer support blood oxygenation and bone strength.",
    image: "images/palak_paneer_1788090373703.jpg"
  },
  {
    id: "main-2",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 290,
    calories: 390,
    proteinGrams: 17,
    carbsGrams: 18,
    fatGrams: 28,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: false,
    isJainFriendly: false,
    isDiabeticFriendly: false,
    allergens: ["Dairy", "Nuts (Cashew Puree)"],
    ingredients: ["Paneer", "Slow-Simmered Tomato Gravy", "Cashew Paste", "Butter", "Kasuri Methi"],
    healthBenefit: "Lycopene from cooked tomatoes combines with paneer protein and healthy fats.",
    image: "images/paneer_butter_masala.jpg"
  },
  {
    id: "main-3",
    name: "Dal Makhani",
    category: "Main Course",
    price: 260,
    calories: 360,
    proteinGrams: 14,
    carbsGrams: 42,
    fatGrams: 15,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: false,
    isDiabeticFriendly: true,
    allergens: ["Dairy (Butter & Cream)"],
    ingredients: ["Black Urad Lentils", "Red Kidney Beans", "Tomato Puree", "Cream", "Kasuri Methi"],
    healthBenefit: "Slow-cooked black lentils deliver plant protein, dietary fiber, and magnesium.",
    image: "images/dal_makhani_1788090387085.jpg"
  },
  {
    id: "main-4",
    name: "Shahi Malai Kofta",
    category: "Main Course",
    price: 290,
    calories: 420,
    proteinGrams: 11,
    carbsGrams: 36,
    fatGrams: 26,
    isVegan: false,
    isGlutenFree: false,
    isNutFree: false,
    isJainFriendly: false,
    isDiabeticFriendly: false,
    allergens: ["Dairy", "Nuts (Cashews)", "Gluten"],
    ingredients: ["Paneer Potato Dumplings", "Rich Cashew Cream", "Cardamom Infused Gravy"],
    healthBenefit: "Royal Mughlai preparation rich in energy and monounsaturated healthy fats.",
    image: "images/malai_kofta.jpg"
  },
  {
    id: "main-5",
    name: "Vegetable Dum Biryani",
    category: "Main Course",
    price: 250,
    calories: 380,
    proteinGrams: 9,
    carbsGrams: 58,
    fatGrams: 11,
    isVegan: true,
    isGlutenFree: true,
    isNutFree: false,
    isJainFriendly: false,
    isDiabeticFriendly: false,
    allergens: ["Nuts (Fried Cashews)"],
    ingredients: ["Aged Basmati Rice", "Carrots", "Beans", "Peas", "Kashmir Saffron", "Whole Spices"],
    healthBenefit: "Complex slow-release carbohydrates packed with vitamins from seasonal veggies.",
    image: "images/veg_biryani_1788088678926.jpg"
  },
  {
    id: "main-6",
    name: "Yellow Dal Tadka",
    category: "Main Course",
    price: 200,
    calories: 210,
    proteinGrams: 12,
    carbsGrams: 30,
    fatGrams: 5,
    isVegan: true,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: false,
    isDiabeticFriendly: true,
    allergens: [],
    ingredients: ["Yellow Toor Dal", "Cumin", "Garlic", "Desi Ghee / Mustard Tempering", "Asafoetida"],
    healthBenefit: "Easily digestible legume protein with zero cholesterol and gut-friendly spices.",
    image: "images/yellow_dal_tadka.jpg"
  },

  // --- BREADS & RICE (2) ---
  {
    id: "brd-1",
    name: "Butter Naan",
    category: "Breads & Rice",
    price: 50,
    calories: 210,
    proteinGrams: 6,
    carbsGrams: 38,
    fatGrams: 4,
    isVegan: false,
    isGlutenFree: false,
    isNutFree: true,
    isJainFriendly: true,
    isDiabeticFriendly: false,
    allergens: ["Gluten", "Dairy"],
    ingredients: ["Wheat Flour", "Yogurt", "Salted Butter", "Nigella Seeds"],
    healthBenefit: "Clay tandoor flatbread with golden flaky texture.",
    image: "images/butter_naan.jpg"
  },
  {
    id: "brd-2",
    name: "South Indian Curd Rice",
    category: "Breads & Rice",
    price: 140,
    calories: 210,
    proteinGrams: 6,
    carbsGrams: 34,
    fatGrams: 5,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: true,
    isJainFriendly: true,
    isDiabeticFriendly: true,
    allergens: ["Dairy", "Mustard"],
    ingredients: ["Soft Boiled Rice", "Fresh Curd", "Mustard Seeds", "Curry Leaves", "Pomegranate"],
    healthBenefit: "Ultimate cooling gut medicine rich in lactic acid bacteria and antioxidants.",
    image: "images/curd_rice.jpg"
  },

  // --- ROYAL DESSERTS (4) ---
  {
    id: "des-1",
    name: "Gulab Jamun (2 pcs)",
    category: "Desserts",
    price: 120,
    calories: 290,
    proteinGrams: 4,
    carbsGrams: 48,
    fatGrams: 9,
    isVegan: false,
    isGlutenFree: false,
    isNutFree: true,
    isJainFriendly: true,
    isDiabeticFriendly: false,
    allergens: ["Dairy", "Gluten"],
    ingredients: ["Reduced Khoya", "Rose Cardamom Syrup", "Pure Desi Ghee"],
    healthBenefit: "Classic Indian dessert providing immediate glucose energy and delight.",
    image: "images/gulab_jamun_1788088693631.jpg"
  },
  {
    id: "des-2",
    name: "Royal Rasmalai (2 pcs)",
    category: "Desserts",
    price: 150,
    calories: 220,
    proteinGrams: 7,
    carbsGrams: 28,
    fatGrams: 8,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: false,
    isJainFriendly: true,
    isDiabeticFriendly: false,
    allergens: ["Dairy", "Nuts (Pistachios)"],
    ingredients: ["Poached Chhena Patties", "Thickened Saffron Milk", "Pistachio Slivers"],
    healthBenefit: "Saffron infused pure cow's milk protein and antioxidant flavonoids.",
    image: "images/rasmalai_1788090470498.jpg"
  },
  {
    id: "des-3",
    name: "Gajar Ka Halwa",
    category: "Desserts",
    price: 140,
    calories: 260,
    proteinGrams: 5,
    carbsGrams: 36,
    fatGrams: 10,
    isVegan: false,
    isGlutenFree: true,
    isNutFree: false,
    isJainFriendly: false,
    isDiabeticFriendly: false,
    allergens: ["Dairy", "Nuts (Almonds & Cashews)"],
    ingredients: ["Red Carrots", "Desi Ghee", "Condensed Milk", "Almonds", "Cashews", "Silver Vark"],
    healthBenefit: "Abundant Beta-Carotene (Vitamin A) and lutein for vision and skin health.",
    image: "images/gajar_halwa.jpg"
  },
  {
    id: "des-4",
    name: "Crispy Jalebi with Rabri",
    category: "Desserts",
    price: 160,
    calories: 380,
    proteinGrams: 6,
    carbsGrams: 64,
    fatGrams: 12,
    isVegan: false,
    isGlutenFree: false,
    isNutFree: false,
    isJainFriendly: true,
    isDiabeticFriendly: false,
    allergens: ["Gluten", "Dairy", "Nuts (Pistachio Garnish)"],
    ingredients: ["Fermented Batter", "Saffron Sugar Syrup", "Slow-Reduced Rabri", "Cardamom"],
    healthBenefit: "Celebrated North Indian festival pairing of hot crisp jalebi and cold rabri.",
    image: "images/jalebi_rabri.jpg"
  }
];

// POST /ai/dietary-assistant
router.post("/dietary-assistant", (req: Request, res: Response) => {
  try {
    const { query, preferences, maxCalories, category } = req.body;
    const selectedTags: string[] = preferences || [];
    const queryLower = (query || "").toLowerCase().trim();
    const calorieLimit = maxCalories ? Number(maxCalories) : 9999;

    let filtered = CURATED_MENU_21.filter(dish => {
      // 1. Strict Category Filter
      if (category && category !== "All" && dish.category !== category) return false;

      // 2. Strict Calorie Limit
      if (dish.calories > calorieLimit) return false;

      // 3. Strict Diet Flags
      if (selectedTags.includes("vegan") && !dish.isVegan) return false;
      if (selectedTags.includes("gluten-free") && !dish.isGlutenFree) return false;
      if (selectedTags.includes("nut-free") && !dish.isNutFree) return false;
      if (selectedTags.includes("high-protein") && dish.proteinGrams < 10) return false;
      if (selectedTags.includes("diabetic-friendly") && !dish.isDiabeticFriendly) return false;
      if (selectedTags.includes("jain") && !dish.isJainFriendly) return false;

      // 4. Query text matching
      if (queryLower) {
        if (queryLower.includes("vegan") && !dish.isVegan) return false;
        if ((queryLower.includes("gluten free") || queryLower.includes("gluten-free") || queryLower.includes("gluten")) && !dish.isGlutenFree) return false;
        if ((queryLower.includes("nut free") || queryLower.includes("nut-free") || queryLower.includes("nut")) && !dish.isNutFree) return false;
        if ((queryLower.includes("protein") || queryLower.includes("high protein")) && dish.proteinGrams < 10) return false;
        if ((queryLower.includes("diabetic") || queryLower.includes("sugar")) && !dish.isDiabeticFriendly) return false;
        if (queryLower.includes("jain") && !dish.isJainFriendly) return false;
        if (queryLower.includes("chilled") || queryLower.includes("cold") || queryLower.includes("cooler")) {
          if (dish.category !== "Beverages" || dish.name.toLowerCase().includes("chai") || dish.name.toLowerCase().includes("tea")) return false;
        }
        if (queryLower.includes("hot") || queryLower.includes("tea") || queryLower.includes("chai")) {
          if (!dish.name.toLowerCase().includes("chai") && !dish.name.toLowerCase().includes("tea")) return false;
        }
        if (queryLower.includes("paneer") && !dish.name.toLowerCase().includes("paneer")) return false;
        if ((queryLower.includes("dessert") || queryLower.includes("sweet") || queryLower.includes("halwa") || queryLower.includes("kulfi") || queryLower.includes("jamun") || queryLower.includes("rabri")) && dish.category !== "Desserts") return false;
        if (queryLower.includes("drink") && dish.category !== "Beverages") return false;
        if ((queryLower.includes("starter") || queryLower.includes("chaat") || queryLower.includes("snack")) && dish.category !== "Starters") return false;
        if (queryLower.includes("rice") || queryLower.includes("biryani")) {
          if (!dish.name.toLowerCase().includes("rice") && !dish.name.toLowerCase().includes("biryani")) return false;
        }
      }

      return true;
    });

    if (selectedTags.includes("high-protein") || queryLower.includes("protein")) {
      filtered.sort((a, b) => b.proteinGrams - a.proteinGrams);
    }

    // Score remaining matching dishes
    const scored = filtered.map(dish => {
      let score = 90;
      let reasons: string[] = [];

      if (dish.isVegan) reasons.push("100% Plant-Based Vegan");
      if (dish.isGlutenFree) reasons.push("Gluten-Free Certified");
      if (dish.isNutFree) reasons.push("Nut-Free Allergen Safe");
      if (dish.proteinGrams >= 10) reasons.push(`High Protein (${dish.proteinGrams}g)`);
      if (dish.isDiabeticFriendly) reasons.push("Low Glycemic / Diabetic Safe");
      if (dish.isJainFriendly) reasons.push("Jain Friendly (No Root Veggies)");
      if (dish.calories <= 200) reasons.push(`Low Calorie (${dish.calories} kcal)`);

      return {
        ...dish,
        score,
        matchConfidence: 95,
        reasons: reasons.length ? reasons : ["Safe & Nutritious Selection"],
        warnings: dish.allergens.map(a => `Contains ${a}`)
      };
    });

    const avgCalories = scored.length > 0 ? Math.round(scored.reduce((sum, d) => sum + d.calories, 0) / scored.length) : 0;

    return res.json({
      aiAnalysis: {
        analyzedAt: new Date().toISOString(),
        totalMatches: scored.length,
        averageCalories: avgCalories,
        safetyVerdict: scored.length > 0 ? `Found ${scored.length} Safe Matches` : "No dishes strictly match all selected criteria"
      },
      recommendations: scored
    });
  } catch (err) {
    return res.status(500).json({ error: "AI Assistant Error" });
  }
});

router.get("/menu-nutrition", (_req: Request, res: Response) => {
  return res.json(CURATED_MENU_21);
});

export default router;
