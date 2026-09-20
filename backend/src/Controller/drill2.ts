import express from "express";

const app = express();

app.use(express.json());
console.log("========== DRILL2 STARTED ==========");
const users = [
  { id: 1, name: "Kartik", email: "kartik@gmail.com" },
  { id: 2, name: "Rahul", email: "rahul@gmail.com" },
  { id: 3, name: "Aman", email: "aman@gmail.com" }
];

app.get("/users/:id", (req, res) => {
    console.log("========== USERS ROUTE HIT ==========");
    console.log("PARAM:", req.params.id);
    console.log("PARAM TYPE:", typeof req.params.id);
  
    const convertedId = Number(req.params.id);
  
    console.log("CONVERTED:", convertedId);
    console.log("CONVERTED TYPE:", typeof convertedId);
  
    console.log("USERS:", users);
  const user = users.find(user => user.id ===Number(req.params.id));

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});