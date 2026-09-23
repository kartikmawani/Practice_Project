import express from "express";

const app = express();

app.use(express.json());
//Before debugging current User was declared here
interface TypeUser{
  id: number;
  name: string;
}  

const users = [
  { id: 1, name: "Kartik" },
  { id: 2, name: "Rahul" },
  { id: 3, name: "Aman" },
  { id: 4, name: "CHamna" },
  { id: 5, name: "Vin" },
  { id: 6, name: "Apple" }
];

function findUser(id: number) {
  return new Promise<{ id: number; name: string } | undefined>((resolve) => {
    const delay = Math.floor(Math.random() * 2000);

    setTimeout(() => {
      const user = users.find(user => user.id === id);
      resolve(user);
    }, delay);
  });
}

app.get("/profile/:id", async (req, res) => {
  const id = Number(req.params.id);

  console.log("REQUEST START:", id);
 // If multiple request hit the server they can access currenUser before but now since we declared it in the route
 //This won't happen again it is a scope bug 
  const currentUser:TypeUser = await findUser(id);

  console.log("USER FOUND:", currentUser);

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("SENDING:", currentUser);

  if (!currentUser) {
    return res.status(404).json({
      message: "User not found"
    });
  }
   console.log("Procees Id",id)
  res.json(currentUser);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});