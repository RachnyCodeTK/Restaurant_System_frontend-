
const BASE_URL = "https://restaurant-system-backend-ue3n.onrender.com/api";
// fetch('https://restaurant-system-backend...render.com/api/products')
//   .then(response => {
//     if (!response.ok) {
//       // បើ Server តបមកវិញនូវ Error 404 ឬ 500 វានឹងលោតមកទីនេះភ្លាម ដោយមិនទាន់ parse JSON ឡើយ
//       throw new Error(`Server responded with status ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(data => console.log(data))
//   .catch(error => console.error("Fetch error:", error));
// // GENERIC API REQUEST

const apiRequest = async (
    endpoint,
    options = {}
) => {

    try {

        const response = await fetch(
            `${BASE_URL}${endpoint}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                ...options,
            }
        );

        const data = await response.json();

        // ERROR
        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "API Request Failed"
            );
        }

        return data;

    } catch (error) {

        console.error("API ERROR:", error);

        throw error;
    }
};

// GET
const get = (endpoint) =>
    apiRequest(endpoint);

// POST
const post = (endpoint, data) =>
    apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });

// PUT
const put = (endpoint, data) =>
    apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    });

// DELETE
const remove = (endpoint) =>
    apiRequest(endpoint, {
        method: "DELETE",
    });

// AUTH APIs

// USER LOGIN
export const login = (credentials) =>
    post("/login", credentials);

// CUSTOMER LOGIN
export const loginCustomer = (credentials) =>
    post("/customer/login", credentials);

// PRODUCT APIs

// GET PRODUCTS
export const getProducts = () =>
    get("/product");

// CREATE PRODUCT
export const createProduct = (productData) =>
    post("/product", productData);

// CREATE PRODUCT WITH IMAGE
export const createProductWithFile = async (
    formData
) => {

    try {

        const response = await fetch(
            `${BASE_URL}/product`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Product Upload Failed"
            );
        }

        return data;

    } catch (error) {

        console.error(error);

        throw error;
    }
};


// DELETE PRODUCT
export const deleteProduct = (id) =>
    remove(`/product/${id}`);


// SEARCH PRODUCTS
export const searchProducts = (q) =>
    get(
        `/product/search?q=${encodeURIComponent(q)}`
    );


// STOCK ADJUSTMENT
export const adjustProduct = (data) =>
    post("/product/adjustment", data);

// CATEGORY APIs

// GET CATEGORIES
export const getCategories = () =>
    get("/category");

// ORDER APIs

// PLACE ORDER
export const placeOrder = (orderData) =>
    post("/customer/order", orderData);

// GET ALL ORDERS
export const getAllOrders = () =>
    get("/orders");

// TRACK ORDER BY EMAIL
export const getOrderByEmail = (email) =>
    get(
        `/customer/orders/track?email=${encodeURIComponent(email)}`
    );


// PURCHASE APIs


// GET PURCHASES
export const getPurchases = async () => {
    return await get("/purchase");
};

// CREATE PURCHASE
export const createPurchase = async (purchaseData) => {
    return await post("/purchase", purchaseData);
};

// UPDATE PURCHASE
export const updatePurchase = async (purchaseData) => {
    return await put("/purchase", purchaseData);
};

// DELETE PURCHASE
export const deletePurchase = async (pur_id) => {
    return await remove(`/purchase/${pur_id}`);
};


export { apiRequest };

export const createKHQR = async (amount) => {
  const response = await fetch("http://localhost:3000/api/khqr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });

  return response.json();
};