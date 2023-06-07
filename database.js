import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();


export async function getAllInvoices() {
  try {
    const result = await pool.query(`
      SELECT Invoice.*, Retailer.*
      FROM Invoice
      INNER JOIN Retailer ON Invoice.retailer_id = Retailer.id
    `);
    return result[0];
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    return null;
  }
}

export async function updateInvoicePrice(invoiceId, newPrice) {
  try {
    const query = `UPDATE Invoice SET pending_amount = ${newPrice} WHERE id = ${invoiceId}`;
    const params = [newPrice, invoiceId];

    const result = await pool.query(query);
    // console.log(result[0].affectedRows);
    if (result && result[0].affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating invoice price:", error);
    throw error;
  }
}


async function insertInvoice(invoiceData) {
  try {
    const { Brand, SalesRepId, SalesmanName, InvoiceAmount, RetailerId, RetailerName, RetailerPhno, InvoiceDate, BillNo, PendingAmount, CollectionDate } = invoiceData;

    const query = "INSERT INTO Invoice (Brand, SalesRepId, SalesmanName, InvoiceAmount, RetailerId, RetailerName, RetailerPhno, InvoiceDate, BillNo, PendingAmount, CollectionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [Brand, SalesRepId, SalesmanName, InvoiceAmount, RetailerId, RetailerName, RetailerPhno, InvoiceDate, BillNo, PendingAmount, CollectionDate];

    const result = await pool.query(query, values);
    if (result && result.affectedRows === 1) {
      return result.insertId;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error inserting invoice:", error);
    throw error;
  }
}
