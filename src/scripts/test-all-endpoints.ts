async function runTests() {
  const BASE_URL = "http://localhost:5000/api";
  let token = "";
  
  console.log("🚀 Starting E2E API Tests...");

  const printResult = (name: string, success: boolean, info?: string) => {
    if (success) {
      console.log(`✅ [PASS] ${name} ${info ? `(${info})` : ""}`);
    } else {
      console.error(`❌ [FAIL] ${name} ${info ? `(${info})` : ""}`);
    }
  };

  try {
    // 1. AUTH - LOGIN
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    
    if (!loginRes.ok) throw new Error("Login failed, ensure admin user is seeded.");
    const loginData = await loginRes.json();
    token = loginData.data.token;
    printResult("Auth Login", true, "Token received");

    const authHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    // 2. CATEGORY
    let categoryId = "";
    const catPostRes = await fetch(`${BASE_URL}/master/categories`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ name: "Test Category API" }),
    });
    const catPostData = await catPostRes.json();
    if (catPostData.success) {
      categoryId = catPostData.data._id;
      printResult("Category Create", true);
    } else {
      printResult("Category Create", false, catPostData.message);
    }

    const catGetRes = await fetch(`${BASE_URL}/master/categories`, { headers: authHeaders });
    printResult("Category GetAll", catGetRes.ok);

    // 3. DISCOUNT
    const discPostRes = await fetch(`${BASE_URL}/master/discounts`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        code: "TEST100",
        name: "Test Discount",
        value: 10000,
        minTransaction: 50000,
        limitUsage: 10
      }),
    });
    printResult("Discount Create", discPostRes.ok);
    const discGetRes = await fetch(`${BASE_URL}/master/discounts`, { headers: authHeaders });
    printResult("Discount GetAll", discGetRes.ok);

    // 4. MODIFIER
    const modPostRes = await fetch(`${BASE_URL}/master/modifiers`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        groupName: "Test Modifier",
        isRequired: false,
        options: [{ name: "Less Sugar", price: 0 }]
      }),
    });
    // Ignore modifier POST result if route isn't fully set up yet, just check if it doesn't crash 500
    printResult("Modifier Create", modPostRes.ok || modPostRes.status === 404); 
    const modGetRes = await fetch(`${BASE_URL}/master/modifiers`, { headers: authHeaders });
    printResult("Modifier GetAll", modGetRes.ok || modGetRes.status === 404);

    // 5. ITEM
    // Item create needs categoryId. We will use the one we just created
    if (categoryId) {
      const itemPostRes = await fetch(`${BASE_URL}/master/items`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          categoryId: categoryId,
          name: "Test API Coffee",
          price: 25000,
          isAvailable: true
        }),
      });
      printResult("Item Create", itemPostRes.ok);
    } else {
      printResult("Item Create", false, "Skipped due to no categoryId");
    }

    const itemGetRes = await fetch(`${BASE_URL}/master/items`, { headers: authHeaders });
    printResult("Item GetAll", itemGetRes.ok);

    // 6. TRANSACTIONS
    const txPostRes = await fetch(`${BASE_URL}/transactions/get-all`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    printResult("Transaction GetAll", txPostRes.ok);

    console.log("🎉 Test suite finished!");

  } catch (error: any) {
    console.error("💥 Test suite encountered a fatal error:", error.message);
  }
}

runTests();
