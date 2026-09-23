import express from "express";

const app = express();

app.use(express.json());

type Product = {
  id: number;
  name: string;
  price: number;
};

let products: Product[] = [
  { id: 1, name: "Keyboard", price: 2000 },
  { id: 2, name: "Mouse", price: 800 }
];

const cache = new Map<number, Product>();

function getProductFromDB(id: number): Promise<Product | undefined> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("DB QUERY:", id);

      const product = products.find(product => product.id === id);

      resolve(product);
    }, 500);
  });
}

app.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  console.log("\nGET PRODUCT:", id);

  if (cache.has(id)) {
    console.log("CACHE HIT:", id);

    return res.json(cache.get(id));
  }

  console.log("CACHE MISS:", id);

  const product = await getProductFromDB(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  cache.set(id, product);

  console.log("CACHE SET:", product);

  res.json(product);
});

app.put("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { price } = req.body;

  console.log("\nUPDATE PRODUCT:", id);
  console.log("New price:", price);

  const product = products.find(product => product.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  product.price = price;
  const  cachedProduct=cache.get(id)
  if(!cachedProduct){
    return res.status(200).json({
        message:"Product not available"
    })
  }
  cachedProduct.price=price
  cache.set(id,cachedProduct)
  console.log("DATABASE UPDATED:", product);

  res.json(product);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});