import express from "express";

const app = express();
app.use(express.json());

const orders = [
  { id: 1, userId: 101, product: "Keyboard", status: "pending" },
  { id: 2, userId: 102, product: "Mouse", status: "shipped" },
  { id: 3, userId: 101, product: "Monitor", status: "delivered" }
];
 
app.get("/orders/:userId", async (req, res) => {
  const IncomingId = req.params.userId;
  console.log("Incoming",IncomingId)
  console.log("orders",orders[0]?.userId)
  const userOrders = orders.filter(order => {
     return order?.userId === Number(IncomingId);
  });
  const newable=orders.filter(order=>{
   return  order.userId>2
  })
  console.log(newable)

  const type =orders[1]?.userId
  console.log("orders",typeof type)
  console.log("Incoming ID",typeof IncomingId)
  console.log(userOrders)
  
  if (userOrders.length === 0) {   
    return res.status(404).json({
      message: "No orders found"
    });
     
  }
  res.json(userOrders);
   
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});