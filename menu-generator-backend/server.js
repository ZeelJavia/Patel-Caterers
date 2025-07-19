// server.js (FINAL version with DUAL PDF support)

// --- 1. Dependencies & Setup ---
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { menuData } = require("./data.js");
const app = express();
const port = 5000;
const DB_FILE = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

// --- 2. Database Helper Functions ---
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ events: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- 3. PDF Generation Logic ---

/**
 * PDF Generator #1: Category-Based (The Original Format)
 * This function now cleverly re-assembles the data from the new format.
 */
const generateCategoryBasedPDFHTML = (event) => {
  // Check if event has the old format (selectedItems) or new format (subEvents)
  let allSelectedItems = {};

  if (event.selectedItems) {
    // Old format - use selectedItems directly
    allSelectedItems = event.selectedItems;
  } else if (event.subEvents && event.subEvents.length > 0) {
    // New format - aggregate all items from all sub-events into one master list
    event.subEvents.forEach((subEvent) => {
      for (const categoryId in subEvent.items) {
        if (!allSelectedItems[categoryId]) {
          allSelectedItems[categoryId] = [];
        }
        allSelectedItems[categoryId] = [
          ...new Set([
            ...allSelectedItems[categoryId],
            ...subEvent.items[categoryId],
          ]),
        ];
      }
    });
  } else {
    // No items found, return empty structure
    allSelectedItems = {};
  }

  // Use the proven, original PDF logic
  return generateOriginalMenuHTML(allSelectedItems, event);
};

/**
 * PDF Generator #2: Event-Based (The New Quotation Format)
 * This function generates the new layout based on the user's images.
 */
const generateEventBasedPDFHTML = (event) => {
  const logoPath = path.join(__dirname, "logo.jpg");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoDataUri = `data:image/jpeg;base64,${logoBase64}`;

  let html = `
    <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Quotation for ${
      event.eventName
    }</title>
    <style>
        body { font-family: sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { font-size: 28px; color: #D32F2F; margin: 0; }
        .header p { font-size: 18px; margin: 5px 0; }
        .sub-event { margin-bottom: 40px; page-break-inside: avoid; }
        .sub-event-header { display: flex; justify-content: space-between; align-items: flex-start; background-color: #fce4ec; border-left: 5px solid #D32F2F; padding: 10px 15px; }
        .sub-event-header h2 { font-size: 22px; color: #D32F2F; margin: 0; }
        .sub-event-header p { font-size: 16px; margin: 0; }
        .sub-event-header div p { font-size: 14px; color: #666; margin-top: 5px; }
        .item-list { padding: 15px; }
        .item-list ul { list-style-type: none; padding-left: 0; }
        .item-list li { padding: 5px 0; border-bottom: 1px dashed #ccc; }
        .item-list li::before { content: '➤'; margin-right: 10px; color: #555; }
    </style>
    </head><body>
        <div class="header">
            <h1>PATEL CATERERS JUNAGADH</h1>
            <p>${new Date(event.eventDate).toLocaleDateString("en-GB")}</p>
        </div>
    `;

  (event.subEvents || []).forEach((subEvent) => {
    const categoryMap = {}; // Group items by their original category
    for (const categoryId in subEvent.items) {
      const categoryInfo = menuData.find((c) => c.id === categoryId);
      if (categoryInfo) {
        const items = subEvent.items[categoryId]
          .map((itemId) => categoryInfo.items.find((i) => i.id === itemId))
          .filter(Boolean);
        if (items.length > 0) {
          categoryMap[categoryInfo.name] = items;
        }
      }
    }

    // Format the sub-event date
    const subEventDate = subEvent.date
      ? new Date(subEvent.date).toLocaleDateString("en-GB")
      : new Date(event.eventDate).toLocaleDateString("en-GB");

    html += `
        <div class="sub-event">
            <div class="sub-event-header">
                <div>
                    <h2>${subEvent.name.toUpperCase()}</h2>
                    <p style="font-size: 14px; color: #666; margin-top: 5px;">Date: ${subEventDate}</p>
                </div>
                <p><strong>PAX - ${subEvent.pax}</strong> | <strong>P.P - ${
      subEvent.price
    }/-</strong></p>
            </div>
            <div class="item-list"><ul>`;

    // Loop through the grouped items and list them
    for (const categoryName in categoryMap) {
      categoryMap[categoryName].forEach((item) => {
        html += `<li>${item.name}</li>`;
      });
    }

    html += `</ul></div></div>`;
  });

  html += `</body></html>`;
  return html;
};

// This is your original PDF generator, now used as a helper.
function generateOriginalMenuHTML(selections, event) {
  const resolvedData = {};
  for (const categoryId in selections) {
    const itemIds = selections[categoryId];
    if (!itemIds || itemIds.length === 0) continue;
    const categoryInfo = menuData.find((c) => c.id === categoryId);
    if (!categoryInfo) continue;
    resolvedData[categoryId] = {
      name: categoryInfo.name,
      nameGujarati: categoryInfo.nameGujarati,
      items: itemIds
        .map((itemId) => categoryInfo.items.find((item) => item.id === itemId))
        .filter(Boolean),
    };
  }

  const logoPath = path.join(__dirname, "logo.jpg");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoDataUri = `data:image/jpeg;base64,${logoBase64}`;

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Menu for ${event.eventName || event.clientName}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700&family=Poppins:wght@400;700&display=swap');
            body { font-family: 'Poppins', sans-serif; color: #333; margin: 40px; font-size: 16px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { max-height: 80px; }
            .event-details { background-color: #f9f9f9; border: 1px solid #eee; padding: 20px; margin-bottom: 30px; text-align: center; border-radius: 8px; }
            .event-details h1 { margin: 0; font-size: 28px; font-weight: 700; color: #c62828; }
            .event-details h2 { margin: 5px 0 10px 0; font-size: 20px; color: #333; font-weight: 400; }
            .event-details p { margin: 5px 0 0 0; font-size: 16px; color: #555; }
            .category { margin-bottom: 35px; break-inside: avoid; }
            .category-title { display: flex; align-items: baseline; border-bottom: 2px solid #e53935; padding-bottom: 8px; margin-bottom: 15px; }
            .category-title h2 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: #333; margin: 0; margin-right: 15px; }
            .category-title .gujarati { font-family: 'Noto Sans Gujarati', sans-serif; font-size: 20px; color: #666; }
            .item-list { columns: 2; column-gap: 40px; }
            .item { display: block; padding: 10px 0; border-bottom: 1px dashed #ccc; break-inside: avoid; }
            .item .name { font-size: 16px; font-weight: 600; color: #444; }
            .item .gujarati-name { font-family: 'Noto Sans Gujarati', sans-serif; font-size: 14px; color: #777; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="${logoDataUri}" alt="The Grand - Patel Caters">
        </div>
        <div class="event-details">
            <h1>${event.eventName}</h1>
            <h2>Client: ${event.clientName}</h2>
            <p><strong>Date:</strong> ${new Date(
              event.eventDate
            ).toLocaleDateString()} | <strong>Location:</strong> ${
    event.location
  }</p>
        </div>
    `;

  for (const categoryId in resolvedData) {
    const category = resolvedData[categoryId];
    html += `
        <div class="category">
            <div class="category-title">
                <h2>${category.name}</h2>
                <span class="gujarati">${category.nameGujarati}</span>
            </div>
            <div class="item-list">
        `;

    category.items.forEach((item) => {
      html += `
            <div class="item">
                <div class="name">${item.name}</div>
                <div class="gujarati-name">${item.nameGujarati}</div>
            </div>
            `;
    });

    html += `</div></div>`;
  }

  html += `<div class="footer"><p>Custom Menu Generated by The Grand - Patel Caters</p></div></body></html>`;
  return html;
}

// --- 4. API Endpoints ---
// GET all events
app.get("/api/events", (req, res) => {
  res.json(
    readDB().events.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  );
});

// POST a new event
app.post("/api/events", (req, res) => {
  const db = readDB();
  const newEvent = {
    _id: crypto.randomUUID(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db.events.push(newEvent);
  writeDB(db);
  res.status(201).json({ message: "Event added!", event: newEvent });
});

// GET a single event
app.get("/api/events/:id", (req, res) => {
  const event = readDB().events.find((e) => e._id === req.params.id);
  event
    ? res.json(event)
    : res.status(404).json({ message: "Event not found" });
});

// PUT (Update) an event
app.put("/api/events/:id", (req, res) => {
  const db = readDB();
  const eventIndex = db.events.findIndex((e) => e._id === req.params.id);
  if (eventIndex !== -1) {
    db.events[eventIndex] = {
      ...db.events[eventIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    res.json({ message: "Event updated!", event: db.events[eventIndex] });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// DELETE an event
app.delete("/api/events/:id", (req, res) => {
  const db = readDB();
  const initialLength = db.events.length;
  db.events = db.events.filter((e) => e._id !== req.params.id);
  if (db.events.length < initialLength) {
    writeDB(db);
    res.json({ message: "Event deleted." });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// GET PDF #1 (Category-Based)
app.get("/api/events/:id/category-pdf", async (req, res) => {
  const event = readDB().events.find((e) => e._id === req.params.id);
  if (!event) return res.status(404).send("Event not found");

  console.log("Generating Category-Based PDF for event:", event.eventName);
  console.log("Event data structure:", {
    hasSelectedItems: !!event.selectedItems,
    hasSubEvents: !!(event.subEvents && event.subEvents.length > 0),
    subEventsCount: event.subEvents ? event.subEvents.length : 0,
  });

  try {
    const htmlContent = generateCategoryBasedPDFHTML(event);
    console.log(
      "HTML content generated successfully, length:",
      htmlContent.length
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", right: "40px", bottom: "40px", left: "40px" },
    });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Category-Menu-${event.eventName}.pdf"`
    );
    res.send(pdfBuffer);

    console.log(
      "Category-Based PDF generated successfully for:",
      event.eventName
    );
  } catch (error) {
    console.error("Error generating Category-Based PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

// GET PDF #2 (Event-Based)
app.get("/api/events/:id/event-pdf", async (req, res) => {
  const event = readDB().events.find((e) => e._id === req.params.id);
  if (!event) return res.status(404).send("Event not found");

  console.log("Generating Event-Based PDF for event:", event.eventName);

  try {
    const htmlContent = generateEventBasedPDFHTML(event);
    console.log(
      "Event-Based HTML content generated successfully, length:",
      htmlContent.length
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", right: "40px", bottom: "40px", left: "40px" },
    });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Event-Quotation-${event.eventName}.pdf"`
    );
    res.send(pdfBuffer);

    console.log("Event-Based PDF generated successfully for:", event.eventName);
  } catch (error) {
    console.error("Error generating Event-Based PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

// --- 5. Start Server ---
app.listen(port, () => {
  console.log(`✅ Backend server running on port: ${port}`);
});
