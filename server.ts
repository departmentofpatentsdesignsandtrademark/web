import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Send Order Confirmation Email
  app.post("/api/send-confirmation", async (req, res) => {
    const { customer, items, totalAmount } = req.body;

    if (!customer || !items || !totalAmount) {
      return res.status(400).json({ error: "Missing order data" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.ADMIN_EMAIL || 'ali.islam.officials@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const itemsList = items
        .map((item: any) => `<li>${item.name} ${item.selectedSize ? `(${item.selectedSize})` : ''} x ${item.quantity} - ৳${(item.price * item.quantity).toLocaleString()}</li>`)
        .join("");

      const customerHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h1 style="text-align: center; color: #111; letter-spacing: -1px; text-transform: uppercase;">SHOUKHIN - শৌখিন</h1>
          <h2 style="color: #10b981; text-align: center;">Order Confirmed!</h2>
          <p>Dear ${customer.name},</p>
          <p>Thank you for choosing <strong>Shoukhin</strong>. Your order has been placed successfully and is being processed.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <h3 style="text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Order Summary:</h3>
          <ul style="list-style: none; padding: 0;">${itemsList}</ul>
          <p style="font-size: 18px;"><strong>Total Amount: ৳${totalAmount.toLocaleString()}</strong></p>
          <p><strong>Delivery Address:</strong><br/>${customer.address}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery (৳200 delivery charge applicable)</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p style="font-size: 12px; color: #666;">Our team will call you at <strong>${customer.phone}</strong> to confirm the delivery schedule. If you have any questions, WhatsApp us at 01609705949.</p>
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
            Shop no: 06 Mohammad Ali Prodhan Plaza, Boberchor, Gazaria, Munshiganj
          </div>
        </div>
      `;

      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #111;">New Order Received!</h2>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Customer:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
          </div>
          <h3 style="text-transform: uppercase; font-size: 14px;">Items:</h3>
          <ul>${itemsList}</ul>
          <p style="font-size: 18px;"><strong>Total: ৳${totalAmount.toLocaleString()}</strong></p>
          <p><a href="${process.env.APP_URL || '#'}/admin/orders" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">View in Dashboard</a></p>
        </div>
      `;

      if (process.env.EMAIL_PASSWORD) {
        // Send to Customer
        await transporter.sendMail({
          from: `"Shoukhin - শৌখিন" <${process.env.ADMIN_EMAIL || 'ali.islam.officials@gmail.com'}>`,
          to: customer.email,
          subject: `Order Confirmation #${Math.floor(Math.random() * 10000)} - Shoukhin`,
          html: customerHtml,
        });

        // Send to Admin
        await transporter.sendMail({
          from: `"Shoukhin System" <${process.env.ADMIN_EMAIL || 'ali.islam.officials@gmail.com'}>`,
          to: process.env.ADMIN_EMAIL || 'ali.islam.officials@gmail.com',
          subject: `🚨 NEW ORDER: ৳${totalAmount.toLocaleString()} from ${customer.name}`,
          html: adminHtml,
        });
      }

      console.log("Email notification processed for order:", customer.name);
      res.json({ success: true, message: "Emails sent" });
    } catch (error) {
      console.error("Email processing error:", error);
      res.status(500).json({ error: "Failed to process emails" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
