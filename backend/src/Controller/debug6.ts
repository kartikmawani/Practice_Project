import express from "express";

const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Kartik", role: "admin" },
  { id: 2, name: "Rahul", role: "user" }
];

function authenticate(req: any, res: any, next: any) {
  const token = req.headers.authorization;

  console.log("AUTH TOKEN:", token);

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  req.userId = Number(token);

  console.log("AUTH USER ID:", req.userId);

  next();
}

function loadUser(req: any, res: any, next: any) {
  console.log("LOADING USER:", req.userId);

  const user = users.find(user => user.id === req.userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  req.user = user;

  console.log("LOADED USER:", req.user);

  next();
}

function requireAdmin(req: any, res: any, next: any) {
    console.log(req.user)
  console.log("CHECKING ROLE:", req.user.role);

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
}

app.get(
  "/admin/dashboard",
  authenticate,
  loadUser,
  requireAdmin,
  (req: any, res) => {
    console.log("DASHBOARD HANDLER");

    res.json({
      message: "Welcome to admin dashboard",
      user: req.user
    });
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});