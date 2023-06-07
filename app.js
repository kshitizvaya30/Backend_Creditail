import express from "express";
import bodyParser from "body-parser";
import { getAllInvoices,  updateInvoicePrice, insertInvoice} from "./database.js";
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


app.get("/api/check", async (req, res) => {
  try{
  res.status(200).send("API Working");
  }catch {
    res.status(404).json({ error: "Something Went Wrong" });
  }
});

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

app.post("/api/invoices", async (req, res) => {
  try {
    const invoiceData = req.body;
    const invoiceId = await insertInvoice(invoiceData);

    if (invoiceId) {
      res.status(200).json({ message: "Invoice inserted successfully", invoiceId });
    } else {
      res.status(400).json({ message: "Error occurred while inserting the invoice" });
    }
  } catch (error) {
    console.error("Error inserting invoice:", error);
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
