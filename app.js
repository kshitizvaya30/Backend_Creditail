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

app.post('/api/addInvoices', async (req, res) => {
  try {
    const { amount, invoice_date, bill_no, pending_amount, collection_date, retailer_id, brand_id, sales_rep_id } = req.body;

    // Perform any necessary validation or data transformation here

    const query = `
      INSERT INTO Invoice (amount, invoice_date, bill_no, pending_amount, collection_date, retailer_id, brand_id, sales_rep_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [amount, invoice_date, bill_no, pending_amount, collection_date, retailer_id, brand_id, sales_rep_id];

    await pool.query(query, values);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error inserting invoice:', error);
    res.sendStatus(500);
  }
});



//Server Settings
app.use((err, req, res, next) => {
  res.status(500).send("!Something Broke");
});


app.listen(PORT, () => {
  console.log(`Server is Listening on Port ${PORT}`);
});
