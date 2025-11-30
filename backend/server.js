// server.js - Updated with MongoDB integration
require("dotenv").config();

// --- 1. Dependencies & Setup ---
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// MongoDB imports
const connectDB = require("./config/database.js");

// Import routes
const eventRoutes = require("./routes/events.js");
const contactRoutes = require("./routes/contacts.js");
const menuItemRoutes = require("./routes/menuItems.js");
const authRoutes = require("./routes/auth.js");
const adminRoutes = require("./routes/admin.js");

const { menuData } = require("./data.js");
const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// --- 2. API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/menu-items", menuItemRoutes);

// --- 3. PDF Generation Logic (keeping existing logic) ---

// Helper function to get logo data URI with fallback
const getLogoDataUri = () => {
  // Priority order for logo locations - PNG first for transparency
  const logoLocations = [
    path.join(__dirname, "logo.png"),
    path.join(__dirname, "logo.jpg"),
    path.join(__dirname, "logo.jpeg"),
    path.join(__dirname, "Assets", "logo.png"),
    path.join(__dirname, "Assets", "logo.jpg"),
  ];

  for (const logoPath of logoLocations) {
    try {
      if (fs.existsSync(logoPath)) {
        const bytes = fs.readFileSync(logoPath);
        if (bytes.length > 0) {
          const mimeType = getImageMimeType(bytes);
          const base64 = Buffer.from(bytes).toString("base64");
          return `data:${mimeType};base64,${base64}`;
        }
      }
    } catch (error) {
      console.warn(`Error reading logo from ${logoPath}:`, error.message);
    }
  }

  console.warn("No logo found in any expected location");
  return null;
};

const getImageMimeType = (bytes) => {
  // Check PNG signature
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }

  // Check JPEG signature
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return "image/jpeg";
  }

  // Default fallback
  return "image/jpeg";
};

// Format currency
const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// Format menu items for display
const formatMenuItems = (items) => {
  if (!items || typeof items !== "object") return "";

  return Object.entries(items)
    .map(([category, categoryItems]) => {
      if (!Array.isArray(categoryItems) || categoryItems.length === 0)
        return "";

      const categoryTitle = category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const itemsList = categoryItems
        .map((item) => {
          // Handle legacy string format
          if (typeof item === "string") {
            // Check for custom item format in string
            if (item.startsWith("__custom__:")) {
              const parts = item.split(":");
              if (parts.length >= 3) {
                const encodedName =
                  parts.length === 4 ? parts[2] : parts.slice(2).join(":");
                return decodeURIComponent(encodedName);
              }
            }
            return item
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          // Handle object format
          let itemName = item.name;

          // Handle custom item object
          if (item.id && item.id.startsWith("__custom__:")) {
            const parts = item.id.split(":");
            if (parts.length >= 3) {
              const encodedName =
                parts.length === 4 ? parts[2] : parts.slice(2).join(":");
              itemName = decodeURIComponent(encodedName);
            }
          }

          // Fallback if name is missing
          if (!itemName && typeof item === "object") {
            const str = item.toString();
            if (str !== "[object Object]") {
              itemName = str;
            }
          }

          if (!itemName) return "";

          // Handle sub-items
          if (item.subItems && item.subItems.length > 0) {
            const subItemsHtml = item.subItems
              .map(
                (sub) =>
                  `<div style="margin-left: 20px; font-size: 0.9em; color: #555;">• ${sub}</div>`
              )
              .join("");
            return `<div style="margin-bottom: 4px;">${itemName}</div>${subItemsHtml}`;
          }

          return `<div style="margin-bottom: 4px;">${itemName}</div>`;
        })
        .join("");

      return `<strong>${categoryTitle}:</strong><br>${itemsList}`;
    })
    .filter((section) => section)
    .join("<br><br>");
};

// Enhanced HTML template with better styling
const generatePDFTemplate = (event, logoDataUri, type = "invoice") => {
  const subEventsHtml = event.subEvents
    .map((subEvent, index) => {
      const pax = parseInt(subEvent.pax) || 0;
      const price = parseFloat(subEvent.price) || 0;
      const total = pax * price;

      return `
        <tr>
          <td style="border: 1px solid #ddd; padding: 12px; text-align: left;">${
            index + 1
          }</td>
          <td style="border: 1px solid #ddd; padding: 12px;">
            <strong>${subEvent.name}</strong><br>
            <small style="color: #666;">${subEvent.date}</small>
          </td>
          <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${pax}</td>
          <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${formatCurrency(
            price
          )}</td>
          <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">${formatCurrency(
            total
          )}</td>
        </tr>`;
    })
    .join("");

  const grandTotal = event.subEvents.reduce((total, subEvent) => {
    const pax = parseInt(subEvent.pax) || 0;
    const price = parseFloat(subEvent.price) || 0;
    return total + pax * price;
  }, 0);

  const title =
    type === "invoice"
      ? "INVOICE"
      : type === "quotation"
      ? "QUOTATION"
      : "ESTIMATE";

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title} - ${event.eventName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #ff6b35;
        }
        .logo-section {
            display: flex;
            align-items: center;
        }
        .logo {
            width: 70px;
            height: 70px;
            margin-right: 15px;
            border-radius: 8px;
        }
        .company-info h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .company-info p {
            color: #7f8c8d;
            margin: 5px 0;
            font-size: 14px;
        }
        .document-title {
            text-align: right;
            color: #ff6b35;
        }
        .document-title h2 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .event-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        .event-details h3 {
            color: #2c3e50;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 20px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        .detail-label {
            font-weight: bold;
            color: #34495e;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .detail-value {
            color: #2c3e50;
            font-size: 14px;
        }
        .table-container {
            margin: 25px 0;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #ddd;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
        }
        td {
            border: 1px solid #ddd;
            padding: 12px;
            font-size: 13px;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .total-row {
            background-color: #e8f5e8 !important;
            font-weight: bold;
        }
        .total-row td {
            border-top: 2px solid #27ae60;
            font-size: 16px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
        }
        .notes {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .notes h4 {
            color: #856404;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .notes p {
            color: #856404;
            margin: 0;
            font-size: 13px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                ${
                  logoDataUri
                    ? `<img src="${logoDataUri}" alt="Company Logo" class="logo">`
                    : ""
                }
                <div class="company-info">
                    <h1>Patel Caterers</h1>
                    <p>Professional Catering Services</p>
                    <p>📍 Junagadh, Gujarat | 📞 +91 91731 08101</p>
                    <p>✉️ patelcaterersjnd13@gmail.com</p>
                </div>
            </div>
            <div class="document-title">
                <h2>${title}</h2>
                <p style="margin: 5px 0; font-size: 14px;">#${
                  event._id
                    ? event._id.toString().slice(-8).toUpperCase()
                    : "N/A"
                }</p>
                <p style="margin: 0; font-size: 12px; color: #7f8c8d;">Date: ${new Date().toLocaleDateString()}</p>
            </div>
        </div>

        <div class="event-details">
            <h3>Event Information</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Event Name</span>
                    <span class="detail-value">${event.eventName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Client Name</span>
                    <span class="detail-value">${event.clientName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Event Date</span>
                    <span class="detail-value">${event.eventDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Contact Info</span>
                    <span class="detail-value">${event.contactInfo}</span>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${event.location}</span>
                </div>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 8%;">Sr.</th>
                        <th style="width: 30%;">Event Details</th>
                        <th style="width: 12%;">Pax</th>
                        <th style="width: 20%;">Rate per Person</th>
                        <th style="width: 20%;">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${subEventsHtml}
                    <tr class="total-row">
                        <td colspan="4" style="text-align: right; padding-right: 20px;">
                            <strong>Grand Total:</strong>
                        </td>
                        <td style="text-align: right; font-size: 18px;">
                            <strong>${formatCurrency(grandTotal)}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        ${
          event.notes
            ? `
        <div class="notes">
            <h4>📝 Additional Notes</h4>
            <p>${event.notes.replace(/\n/g, "<br>")}</p>
        </div>
        `
            : ""
        }

        <div class="footer">
            <p><strong>Thank you for choosing Patel Caterers!</strong></p>
            <p>For any queries, contact us at +91 91731 08101 or patelcaterersjnd13@gmail.com</p>
            <p style="margin-top: 10px; font-size: 11px;">
                This ${title.toLowerCase()} is generated electronically and is valid without signature.
            </p>
        </div>
    </div>
</body>
</html>`;
};

// Menu PDF template (keeping existing)
const generateMenuPDFTemplate = (event, logoDataUri) => {
  const subEventsHtml = event.subEvents
    .map((subEvent, index) => {
      const menuItems = formatMenuItems(subEvent.items);

      return `
        <div class="sub-event">
            <div class="sub-event-header">
                <h3>${subEvent.name}</h3>
                <div class="sub-event-details">
                    <span class="detail">📅 ${subEvent.date}</span>
                    <span class="detail">👥 ${subEvent.pax} Pax</span>
                    <span class="detail">💰 ${formatCurrency(
                      parseFloat(subEvent.price) * parseInt(subEvent.pax)
                    )}</span>
                </div>
            </div>
            <div class="menu-items">
                ${
                  menuItems || '<p class="no-items">No menu items specified</p>'
                }
            </div>
            ${
              subEvent.notes
                ? `<div class="sub-event-notes"><strong>Notes:</strong> ${subEvent.notes}</div>`
                : ""
            }
        </div>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Menu Details - ${event.eventName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #ff6b35;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
            border-radius: 8px;
            display: block;
        }
        .company-name {
            color: #2c3e50;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 5px 0;
        }
        .company-tagline {
            color: #7f8c8d;
            font-size: 14px;
            margin: 0 0 15px 0;
        }
        .document-title {
            color: #ff6b35;
            font-size: 24px;
            font-weight: bold;
            margin: 15px 0 0 0;
        }
        .event-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        .event-info h2 {
            margin: 0 0 15px 0;
            font-size: 22px;
        }
        .event-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .event-detail {
            font-size: 14px;
        }
        .event-detail strong {
            display: block;
            opacity: 0.9;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 2px;
        }
        .sub-event {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-bottom: 25px;
            overflow: hidden;
        }
        .sub-event-header {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            padding: 15px 20px;
        }
        .sub-event-header h3 {
            margin: 0 0 10px 0;
            font-size: 20px;
        }
        .sub-event-details {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .detail {
            font-size: 13px;
            opacity: 0.95;
        }
        .menu-items {
            padding: 20px;
            background: white;
        }
        .menu-items strong {
            color: #2c3e50;
            font-size: 14px;
        }
        .menu-items br + br {
            line-height: 2;
        }
        .no-items {
            color: #7f8c8d;
            font-style: italic;
            margin: 0;
        }
        .sub-event-notes {
            background: #fff3cd;
            border-top: 1px solid #ffeaa7;
            padding: 15px 20px;
            font-size: 13px;
            color: #856404;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
        }
        ${
          event.notes
            ? `
        .main-notes {
            background: #e8f5e8;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .main-notes h3 {
            color: #155724;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .main-notes p {
            color: #155724;
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
        }
        `
            : ""
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${
              logoDataUri
                ? `<img src="${logoDataUri}" alt="Company Logo" class="logo">`
                : ""
            }
            <h1 class="company-name">Patel Caterers</h1>
            <p class="company-tagline">Professional Catering Services | Junagadh, Gujarat</p>
            <h2 class="document-title">📋 Menu Details</h2>
        </div>

        <div class="event-info">
            <h2>${event.eventName}</h2>
            <div class="event-details-grid">
                <div class="event-detail">
                    <strong>Client</strong>
                    ${event.clientName}
                </div>
                <div class="event-detail">
                    <strong>Event Date</strong>
                    ${event.eventDate}
                </div>
                <div class="event-detail">
                    <strong>Location</strong>
                    ${event.location}
                </div>
                <div class="event-detail">
                    <strong>Contact</strong>
                    ${event.contactInfo}
                </div>
            </div>
        </div>

        ${subEventsHtml}

        ${
          event.notes
            ? `
        <div class="main-notes">
            <h3>📝 Additional Notes</h3>
            <p>${event.notes.replace(/\n/g, "<br>")}</p>
        </div>
        `
            : ""
        }

        <div class="footer">
            <p><strong>Patel Caterers - Creating Memorable Culinary Experiences</strong></p>
            <p>📞 +91 91731 08101 | ✉️ patelcaterersjnd13@gmail.com</p>
            <p style="margin-top: 10px;">Thank you for choosing our catering services!</p>
        </div>
    </div>
</body>
</html>`;
};

// PDF generation endpoints (keeping existing logic but will work with MongoDB data)
app.post("/generate-pdf", async (req, res) => {
  try {
    const { eventId, type = "invoice" } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    // Import Event model here to avoid circular dependency
    const Event = require("./models/Event.js");
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const logoDataUri = getLogoDataUri();
    const htmlContent = generatePDFTemplate(event, logoDataUri, type);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    const filename = `${type}-${event.eventName.replace(
      /\s+/g,
      "_"
    )}-${event._id.toString().slice(-8)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF: " + error.message });
  }
});

// Menu PDF generation endpoint
app.post("/generate-menu-pdf", async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const Event = require("./models/Event.js");
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const logoDataUri = getLogoDataUri();
    const htmlContent = generateMenuPDFTemplate(event, logoDataUri);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    const filename = `menu-${event.eventName.replace(/\s+/g, "_")}-${event._id
      .toString()
      .slice(-8)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Menu PDF generation error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate menu PDF: " + error.message });
  }
});

// Keep existing menu data endpoint
app.get("/api/menu-data", (req, res) => {
  res.json(menuData);
});

// Download Menu PDF endpoint
app.get("/api/download-menu", (req, res) => {
  const filePath = path.join(__dirname, "Menu 2022.pdf");
  res.download(filePath, "Menu 2022.pdf", (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Could not download the file.");
    }
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running with MongoDB",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 MongoDB integration enabled`);
  console.log(`🔗 API endpoints:`);
  console.log(`   - Auth: http://localhost:${port}/api/auth`);
  console.log(`   - Admin: http://localhost:${port}/api/admin`);
  console.log(`   - Events: http://localhost:${port}/api/events`);
  console.log(`   - Contacts: http://localhost:${port}/api/contacts`);
  console.log(`   - Menu Items: http://localhost:${port}/api/menu-items`);
  console.log(`   - Health Check: http://localhost:${port}/api/health`);
});
