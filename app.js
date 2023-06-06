import express from "express";
import bodyParser from "body-parser";
import { getAllInvoices,  updateInvoicePrice} from "./database.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/api/getCustomers", async (req, res) => {
  const items = await getAllInvoices();
  // console.log(items);
  if (!items) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.status(200).send(items);
});

app.put("/api/updatePendingAmount", async (req, res) => {
  // console.log(req.body);
  try {
    const newPendingAmount = req.body.pendingAmount;
    const invoiceId = req.body.id;
    const result = await updateInvoicePrice(invoiceId, newPendingAmount);
    if (result) {
      res.status(200).json({ message: "Pending Amount updated successfully" });
    } else {
      res.status(400).json({ message: "Error occurred while updating the Pending Amount" });
    }
  } catch (error) {
    console.error("Error updating Pending Amount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//Server Settings
app.use((err, req, res, next) => {
  res.status(500).send("!Something Broke");
});


app.listen(PORT, () => {
  console.log(`Server is Listening on Port ${PORT}`);
});
