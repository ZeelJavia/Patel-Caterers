const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

// Helper function to get logo data URI with fallback
const getLogoDataUri = () => {
  // Priority order for logo locations - PNG first for transparency
  const logoLocations = [
    path.join(__dirname, "..", "logo.png"),
    path.join(__dirname, "..", "logo.jpg"),
    path.join(__dirname, "..", "logo.jpeg"),
    path.join(__dirname, "..", "Assets", "logo.png"),
    path.join(__dirname, "..", "Assets", "logo.jpg"),
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

  console.warn(
    "No logo found in any expected location, creating embedded test logo"
  );
  return createEmbeddedTestLogo();
};

const createEmbeddedTestLogo = () => {
  // Create a simple test logo as SVG (matches C# implementation)
  const svgLogo = `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="100" fill="#c62828" stroke="#000" stroke-width="2"/>
    <text x="100" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">THE GRAND</text>
    <text x="100" y="55" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14">PATEL CATERERS</text>
    <text x="100" y="75" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">JUNAGADH</text>
  </svg>`;

  const svgBytes = Buffer.from(svgLogo, "utf8");
  const base64 = svgBytes.toString("base64");
  console.log("Created embedded test logo");
  return `data:image/svg+xml;base64,${base64}`;
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

// Utility functions to match C# implementation
const htmlEncode = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const tryParseDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return htmlEncode(dateStr);
    // Format as DD/MM/YYYY to match UK culture in C#
    return date.toLocaleDateString("en-GB");
  } catch {
    return htmlEncode(dateStr);
  }
};

const sanitizeFilename = (str) => {
  if (!str) return "Event";
  return str.replace(/[<>:"/\\|?*]/g, "");
};

// Generate Category PDF - matches C# BuildCategoryBasedHtml
const buildCategoryBasedHtml = (event, menuData, logoDataUri) => {
  // Aggregate selections from subEvents (simulate menu loading logic)
  const allSelected = {};
  if (event.subEvents) {
    event.subEvents.forEach((se) => {
      if (se.items) {
        Object.entries(se.items).forEach(([catId, itemIds]) => {
          if (!allSelected[catId]) allSelected[catId] = new Set();
          itemIds.forEach((id) => allSelected[catId].add(id));
        });
      }
    });
  }

  // Build resolved categories with items
  const resolved = {};
  Object.keys(allSelected).forEach((catId) => {
    const items = [];
    Array.from(allSelected[catId]).forEach((itemRaw) => {
      // Handle both string and object format
      const itemId = typeof itemRaw === "string" ? itemRaw : itemRaw?.id || "";
      const itemSubItems =
        typeof itemRaw === "object" && itemRaw ? itemRaw.subItems || [] : [];
      let itemName = typeof itemRaw === "object" && itemRaw ? itemRaw.name : "";

      if (String(itemId).startsWith("__custom__:")) {
        const parts = String(itemId).split(":");
        if (parts.length >= 3) {
          const encodedName =
            parts.length === 4 ? parts[2] : parts.slice(2).join(":");
          const name = decodeURIComponent(encodedName);
          items.push({
            id: itemId,
            name,
            nameGujarati: "",
            subItems: itemSubItems,
          });
        }
      } else {
        // Look up actual menu item from menuData
        const menuItem = menuData.find(
          (item) =>
            item._id.toString() === String(itemId) ||
            item.originalId === String(itemId)
        );
        if (menuItem) {
          items.push({
            id: itemId,
            name: menuItem.name,
            nameGujarati: menuItem.nameGujarati || "",
            subItems: itemSubItems,
          });
        } else {
          // Fallback if menu item not found
          items.push({
            id: itemId,
            name: itemName || String(itemId).replace(/_/g, " "),
            nameGujarati: "",
            subItems: itemSubItems,
          });
        }
      }
    });

    if (items.length > 0) {
      if (catId === "custom" || catId.startsWith("__custom__")) {
        resolved[catId] = {
          name: "Custom Items",
          nameGujarati: "કસ્ટમ આઇટમ્સ",
          items,
        };
      } else {
        // Try to get category name from first menu item in that category
        const firstMenuItem = menuData.find((item) => item.category === catId);
        resolved[catId] = {
          name: firstMenuItem
            ? firstMenuItem.categoryName || catId.replace(/_/g, " ")
            : catId.replace(/_/g, " "),
          nameGujarati: firstMenuItem
            ? firstMenuItem.categoryNameGujarati || ""
            : "",
          items,
        };
      }
    }
  });

  const evDate = tryParseDate(event.eventDate);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Menu for ${htmlEncode(event.eventName || event.clientName)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700&family=Poppins:wght@400;700&display=swap');
body { font-family: 'Poppins', sans-serif; color: #333; margin: 40px; font-size: 16px; background-color: #ffffff; }
.header { text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #c62828; background-color: transparent; }
.header img { max-height: 150px; width: auto; display: block; margin: 0 auto; }
.event-details { background-color: #f9f9f9; border: 1px solid #eee; padding: 20px; margin: 0 auto 30px auto; text-align: center; border-radius: 8px; max-width: 760px; }
.event-details h1 { margin: 0; font-size: 28px; font-weight: 700; color: #c62828; }
.event-details h2 { margin: 5px 0 10px 0; font-size: 20px; color: #333; font-weight: 400; }
.event-details p { margin: 5px 0 0 0; font-size: 16px; color: #555; }
.company-name { font-size: 32px; font-weight: 700; color: #c62828; margin: 10px 0 5px 0; }
.company-tagline { font-size: 16px; color: #666; margin: 0; }
.category { margin-bottom: 35px; break-inside: avoid; }
.category-title { display: flex; align-items: baseline; border-bottom: 2px solid #e53935; padding-bottom: 8px; margin-bottom: 15px; }
.category-title h2 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: #333; margin: 0; margin-right: 15px; }
.category-title .gujarati { font-family: 'Noto Sans Gujarati', sans-serif; font-size: 20px; color: #666; }
.item-list { columns: 2; column-gap: 40px; }
.item { display: block; padding: 10px 0; border-bottom: 1px dashed #ccc; break-inside: avoid; }
.item .name { font-size: 16px; font-weight: 600; color: #444; }
.item .gujarati-name { font-family: 'Noto Sans Gujarati', sans-serif; font-size: 14px; color: #777; }
.notes { margin-top: 24px; }
.notes h3 { font-size: 18px; color: #c62828; margin: 0 0 8px 0; }
.notes ul { margin: 6px 0 0 18px; padding: 0; }
.notes li { margin: 4px 0; }
.footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; }
</style>
</head>
<body>`;

  // Header section with logo
  html += `<div class="header">
<img src="${logoDataUri}" alt="Logo" />
<div class="company-name">PATEL CATERERS</div>
<div class="company-tagline">Professional Catering Services | Junagadh</div>
</div>`;

  html += `<div class="event-details">
<h1>${htmlEncode(event.eventName)}</h1>
<h2>Client: ${htmlEncode(event.clientName)}</h2>
<p><strong>Date:</strong> ${evDate} | <strong>Location:</strong> ${htmlEncode(
    event.location
  )}</p>
</div>`;

  // Categories
  Object.entries(resolved).forEach(([catId, cat]) => {
    html += `<div class="category">
<div class="category-title">
<h2>${htmlEncode(cat.name)}</h2>
<span class="gujarati">${htmlEncode(cat.nameGujarati || "")}</span>
</div>
<div class="item-list">`;

    cat.items.forEach((item) => {
      html += `<div class="item">
<div class="name">${htmlEncode(item.name)}</div>
<div class="gujarati-name">${htmlEncode(item.nameGujarati || "")}</div>`;

      if (item.subItems && item.subItems.length > 0) {
        html += `<ul style="margin: 5px 0 0 15px; padding: 0; list-style-type: disc; font-size: 0.9em; color: #666;">`;
        item.subItems.forEach((sub) => {
          html += `<li>${htmlEncode(sub)}</li>`;
        });
        html += `</ul>`;
      }

      html += `</div>`;
    });

    html += `</div></div>`;
  });

  // Notes section
  if (event.notes) {
    const lines = event.notes
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n");
    const bulletLines = lines.map((l) => l.trim()).filter((l) => l);
    if (bulletLines.length > 0) {
      html += `<div class="notes">
<h3>Notes</h3>
<ul>`;
      bulletLines.forEach((line) => {
        html += `<li>${htmlEncode(line)}</li>`;
      });
      html += `</ul></div>`;
    }
  }

  html += `</body></html>`;
  return html;
};

// Generate Event PDF - matches C# BuildEventBasedHtml (Quotation format)
const buildEventBasedHtml = (event, menuData, logoDataUri) => {
  const evDate = tryParseDate(event.eventDate);

  let html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Quotation for ${htmlEncode(
    event.eventName
  )}</title><style>`;

  html += `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
body { font-family: 'Poppins', sans-serif; margin: 40px; color: #333; background-color: #ffffff; font-size: 16px; }
.header { text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #c62828; background-color: transparent; }
.header img { max-height: 120px; width: auto; display: block; margin: 0 auto 10px auto; }
.company-name { font-size: 32px; font-weight: 700; color: #c62828; margin: 6px 0 4px 0; }
.company-tagline { font-size: 16px; color: #666; margin: 0; }
.company-phones { font-size: 14px; color: #444; margin-top: 6px; display: flex; gap: 10px; justify-content: center; align-items: center; }
.company-phones .sep { color: #999; }
.estimate-badge { display: inline-block; background: #2e7d32; color: #fff; font-weight: 700; letter-spacing: 1px; padding: 6px 14px; border-radius: 14px; font-size: 13px; margin-bottom: 10px; }
.event-details { background-color: #f9f9f9; border: 1px solid #eee; padding: 20px; margin: 0 auto 30px auto; text-align: center; border-radius: 8px; max-width: 760px; }
.event-details h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 700; color: #c62828; }
.event-details h2 { margin: 0 0 6px 0; font-size: 20px; color: #333; font-weight: 600; }
.event-details .row { display: grid; grid-template-columns: auto auto; justify-content: center; column-gap: 12px; margin: 6px 0; }
.event-details .row .label, .event-details .row .value { text-align: center; }
.sub-event { margin-bottom: 40px; page-break-inside: avoid; }
.sub-event-header { display: flex; justify-content: space-between; align-items: flex-start; background-color: #fce4ec; border-left: 5px solid #D32F2F; padding: 10px 15px; }
.sub-event-header h2 { font-size: 22px; color: #D32F2F; margin: 0; }
.sub-event-header p { font-size: 16px; margin: 0; }
.sub-event-header div p { font-size: 14px; color: #666; margin-top: 5px; }
.item-list { padding: 15px; }
.item-list ul { list-style-type: none; padding-left: 0; margin: 0; }
.item-list li { padding: 5px 0; border-bottom: 1px dashed #ccc; text-align: left; }
.item-list li::before { content: '➤'; margin-right: 10px; color: #555; }
.notes-section { margin-bottom: 40px; page-break-inside: avoid; }
.notes-header { background-color: #fce4ec; border-left: 5px solid #D32F2F; padding: 10px 15px; }
.notes-header h2 { font-size: 22px; color: #D32F2F; margin: 0; }
.notes-content { padding: 15px; }
.notes-content ul { list-style-type: none; padding-left: 0; margin: 0; }
.notes-content li { padding: 5px 0; border-bottom: 1px dashed #ccc; text-align: left; }
.notes-content li::before { content: '➤'; margin-right: 10px; color: #555; }
</style></head><body>`;

  // Header with logo and company info
  html += `<div class='header'>`;
  if (logoDataUri) {
    html += `<img src="${logoDataUri}" alt="Logo" />`;
  }
  html += `<div class="estimate-badge">ESTIMATE</div>
<div class="company-name">PATEL CATERERS</div>
<div class="company-tagline">Professional Catering Services | Junagadh</div>
<div class="company-phones"><span>Contact: +91 91731 08101</span><span class="sep">|</span><span> +91 98257 27140</span></div>
</div>`;

  // Centered event details
  html += `<div class="event-details">
<h1>${htmlEncode(event.eventName)}</h1>
<div class="row"><span class="label"><strong>Client Name:</strong></span><span class="value">${htmlEncode(
    event.clientName
  )}</span></div>
<div class="row"><span class="label"><strong>Event Date:</strong></span><span class="value">${evDate}</span></div>
<div class="row"><span class="label"><strong>Location:</strong></span><span class="value">${htmlEncode(
    event.location
  )}</span></div>
</div>`;

  // Sub-events sections
  if (event.subEvents) {
    event.subEvents.forEach((se) => {
      const seDate = tryParseDate(se.date || event.eventDate);
      html += `<div class='sub-event'><div class='sub-event-header'><div><h2>${htmlEncode(
        (se.name || "").toUpperCase()
      )}</h2><p style='font-size: 14px; color: #666; margin-top: 5px;'>Date: ${seDate}</p></div><p><strong>PAX - ${htmlEncode(
        se.pax
      )}</strong> | <strong>P.P - ${htmlEncode(
        se.price
      )}/-</strong></p></div><div class='item-list'><ul>`;

      // Resolve menu items for sub-event from menuData
      if (se.items) {
        Object.values(se.items)
          .flat()
          .forEach((itemRaw) => {
            // Handle both string and object format
            const itemId =
              typeof itemRaw === "string" ? itemRaw : itemRaw?.id || "";
            const itemSubItems =
              typeof itemRaw === "object" && itemRaw
                ? itemRaw.subItems || []
                : [];
            let itemName =
              typeof itemRaw === "object" && itemRaw ? itemRaw.name : "";

            if (!itemName) {
              itemName = String(itemId).replace(/_/g, " ");
            }

            // Handle custom items
            if (String(itemId).startsWith("__custom__:")) {
              const parts = itemId.split(":");
              if (parts.length >= 3) {
                const encodedName =
                  parts.length === 4 ? parts[2] : parts.slice(2).join(":");
                itemName = decodeURIComponent(encodedName);
              }
            } else {
              // Look up actual menu item from menuData
              const menuItem = menuData.find(
                (item) =>
                  item._id.toString() === itemId || item.originalId === itemId
              );
              if (menuItem) {
                itemName = menuItem.name;
              }
            }

            html += `<li>${htmlEncode(itemName)}`;
            if (itemSubItems && itemSubItems.length > 0) {
              html += `<ul style="list-style-type: circle; margin-top: 2px; margin-bottom: 2px; padding-left: 20px; color: #555; font-size: 0.9em;">`;
              itemSubItems.forEach((sub) => {
                html += `<li style="border-bottom: none; padding: 2px 0;">${htmlEncode(
                  sub
                )}</li>`;
              });
              html += `</ul>`;
            }
            html += `</li>`;
          });
      }

      html += `</ul></div></div>`;
    });
  }

  // Notes section
  if (event.notes) {
    const lines = event.notes
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n");
    const bulletLines = lines.map((l) => l.trim()).filter((l) => l);
    if (bulletLines.length > 0) {
      html += `<div class="notes-section">
<div class="notes-header">
<h2>NOTES</h2>
</div>
<div class="notes-content">
<ul>`;
      bulletLines.forEach((line) => {
        html += `<li>${htmlEncode(line)}</li>`;
      });
      html += `</ul></div></div>`;
    }
  }

  html += `</body></html>`;
  return html;
};

// Generate Billing PDF - matches C# BuildBillingHtml
const buildBillingHtml = (event, logoDataUri) => {
  const evDate = tryParseDate(event.eventDate);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Bill for ${htmlEncode(event.eventName || event.clientName)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
body { font-family: 'Poppins', sans-serif; color: #333; margin: 40px; font-size: 14px; background-color: #ffffff; line-height: 1.4; }
.header { text-align: center; margin-bottom: 24px; padding: 16px 0; border-bottom: 3px solid #c62828; position: relative; }
.header .header-inner { max-width: 820px; margin: 0 auto; }
.header img { max-height: 120px; width: auto; display: block; margin: 0 auto 10px auto; }
.company-name { font-size: 32px; font-weight: 700; color: #c62828; margin: 6px 0 4px 0; }
.company-tagline { font-size: 16px; color: #666; margin: 0; }
.company-phones { font-size: 14px; color: #444; margin-top: 6px; display: flex; gap: 12px; justify-content: center; align-items: center; }
.company-phones .sep { color: #999; }
.estimate-badge { display: inline-block; background: #2e7d32; color: #fff; font-weight: 700; letter-spacing: 1px; padding: 6px 14px; border-radius: 14px; font-size: 13px; margin: 4px 0 10px 0; }
.bill-title { text-align: center; font-size: 28px; font-weight: 700; color: #c62828; margin: 18px 0 18px 0; text-transform: uppercase; letter-spacing: 2px; }
.event-info { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; margin: 0 auto 24px auto; border-radius: 8px; max-width: 760px; text-align: center; }
.event-info h2 { font-size: 24px; color: #c62828; margin: 0 0 12px 0; font-weight: 700; }
.event-info .row { display: grid; grid-template-columns: auto auto; justify-content: center; column-gap: 12px; margin: 6px 0; }
.event-info .row .label, .event-info .row .value { text-align: center; }
.billing-table { width: 100%; border-collapse: collapse; margin: 0 auto 24px auto; max-width: 900px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.billing-table th { background-color: #c62828; color: white; padding: 12px 10px; text-align: left; font-weight: 600; font-size: 16px; }
.billing-table td { padding: 10px; border-bottom: 1px solid #eee; }
.billing-table tbody tr:nth-child(even) { background-color: #fafafa; }
.billing-table .sub-event-name { font-weight: 600; color: #c62828; }
.billing-table .number { text-align: center; font-weight: 600; }
.billing-table .currency { text-align: right; font-weight: 600; }
.grand-total { max-width: 900px; margin: 0 auto; background: linear-gradient(135deg, #c62828, #d32f2f); color: white; padding: 16px; border-radius: 8px; }
.grand-total .total-row { display: flex; justify-content: space-between; align-items: center; }
.grand-total .total-label { font-size: 22px; font-weight: 700; }
.grand-total .total-amount { font-size: 26px; font-weight: 700; }
.footer { text-align: center; margin-top: 28px; padding-top: 16px; border-top: 2px solid #dee2e6; color: #666; font-size: 12px; }
.footer p { margin: 5px 0; }
</style>
</head>
<body>`;

  // Header
  html += `<div class="header">
<div class="header-inner">`;
  if (logoDataUri) {
    html += `<img src="${logoDataUri}" alt="Patel Caters Logo" />`;
  }
  html += `<div class="estimate-badge">ESTIMATE</div>
<div class="company-name">PATEL CATERERS</div>
<div class="company-tagline">Professional Catering Services | Junagadh</div>
<div class="company-phones"><span>Contact: +91 91731 08101</span><span class="sep">|</span><span> +91 98257 27140</span></div>
</div>
</div>`;

  // Title
  html += `<div class="bill-title">CATERING BILL</div>`;

  // Event info
  html += `<div class="event-info">
<h2>${htmlEncode(event.eventName)}</h2>
<div class="row"><span class="label"><strong>Client Name:</strong></span><span class="value">${htmlEncode(
    event.clientName
  )}</span></div>
<div class="row"><span class="label"><strong>Event Date:</strong></span><span class="value">${evDate}</span></div>
<div class="row"><span class="label"><strong>Location:</strong></span><span class="value">${htmlEncode(
    event.location
  )}</span></div>
<div class="row"><span class="label"><strong>Bill Date:</strong></span><span class="value">${new Date().toLocaleDateString(
    "en-GB"
  )}</span></div>
</div>`;

  // Table
  html += `<table class="billing-table">
<thead>
<tr>
<th>Sub Event</th>
<th>Date</th>
<th>PAX</th>
<th>Price per Person</th>
<th>Total Amount</th>
</tr>
</thead>
<tbody>`;

  let grandTotal = 0;
  if (event.subEvents) {
    event.subEvents.forEach((se) => {
      const seDate = tryParseDate(se.date || event.eventDate);
      const pax = parseInt(se.pax) || 0;
      const price = parseFloat(se.price) || 0;
      const subEventTotal = pax * price;
      grandTotal += subEventTotal;

      html += `<tr>
<td class="sub-event-name">${htmlEncode(se.name)}</td>
<td>${seDate}</td>
<td class="number">${pax.toLocaleString()}</td>
<td class="currency">₹ ${price.toFixed(2)}</td>
<td class="currency">₹ ${subEventTotal.toFixed(2)}</td>
</tr>`;
    });
  }

  html += `</tbody>
</table>`;

  // Total
  html += `<div class="grand-total">
<div class="total-row"><span class="total-label">GRAND TOTAL:</span><span class="total-amount">₹ ${grandTotal.toFixed(
    2
  )}</span></div>
</div>`;

  // Footer
  html += `<div class="footer">
<p><strong>Thank you for choosing Patel Caterers!</strong></p>
<p>For any queries, please contact us | Professional Catering Services</p>
</div>`;

  html += `</body></html>`;
  return html;
};

// Helper function to get niyamo PDF path
const getNiyamoPdfPath = () => {
  const niyamoLocations = [
    path.join(__dirname, "..", "niyamo.pdf"),
    path.join(__dirname, "..", "Niyamo.pdf"),
    path.join(__dirname, "..", "assets", "niyamo.pdf"),
    path.join(__dirname, "..", "Assets", "niyamo.pdf"),
    path.join(__dirname, "..", "Assets", "Niyamo.pdf"),
    path.join(__dirname, "..", "public", "niyamo.pdf"),
    path.join(__dirname, "..", "public", "Niyamo.pdf"),
  ];

  for (const niyamoPath of niyamoLocations) {
    try {
      if (fs.existsSync(niyamoPath)) {
        console.log(`Found niyamo PDF at: ${niyamoPath}`);
        return niyamoPath;
      }
    } catch (error) {
      console.warn(
        `Error checking niyamo PDF at ${niyamoPath}:`,
        error.message
      );
    }
  }

  console.warn("Niyamo PDF not found in any expected location");
  return null;
};

// Function to merge PDF with niyamo.pdf
const mergePdfWithNiyamo = async (mainPdfBuffer) => {
  try {
    const niyamoPdfPath = getNiyamoPdfPath();
    if (!niyamoPdfPath) {
      console.warn(
        "Niyamo PDF not found, returning original PDF without terms"
      );
      return mainPdfBuffer;
    }

    // Read the niyamo PDF
    const niyamoPdfBytes = fs.readFileSync(niyamoPdfPath);

    // Create PDFDocument instances
    const mainPdf = await PDFDocument.load(mainPdfBuffer);
    const niyamoPdf = await PDFDocument.load(niyamoPdfBytes);

    // Copy pages from niyamo PDF to main PDF
    const niyamoPages = await mainPdf.copyPages(
      niyamoPdf,
      niyamoPdf.getPageIndices()
    );

    // Add niyamo pages to the end of main PDF
    niyamoPages.forEach((page) => mainPdf.addPage(page));

    // Return the merged PDF as buffer
    const mergedPdfBytes = await mainPdf.save();
    return Buffer.from(mergedPdfBytes);
  } catch (error) {
    console.error("Error merging PDF with niyamo:", error);
    console.warn("Returning original PDF without terms due to merge error");
    return mainPdfBuffer;
  }
};

// Generate PDF function - matches C# service structure
const generatePDF = async (event, type, logoDataUri, menuItems = []) => {
  let htmlContent;
  let filename;

  // Determine which template to use based on type (matches C# implementation)
  if (type === "category") {
    htmlContent = buildCategoryBasedHtml(event, menuItems, logoDataUri);
    filename = `Category-Menu-${sanitizeFilename(event.eventName)}.pdf`;
  } else if (type === "event") {
    htmlContent = buildEventBasedHtml(event, menuItems, logoDataUri);
    filename = `Event-Quotation-${sanitizeFilename(event.eventName)}.pdf`;
  } else if (type === "billing") {
    htmlContent = buildBillingHtml(event, logoDataUri);
    filename = `Bill-${sanitizeFilename(event.eventName)}-${sanitizeFilename(
      event.clientName
    )}.pdf`;
  } else {
    // Default to event/quotation format
    htmlContent = buildEventBasedHtml(event, menuItems, logoDataUri);
    filename = `Event-Quotation-${sanitizeFilename(event.eventName)}.pdf`;
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  let pdfBuffer = await page.pdf({
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

  // For event PDFs, merge with niyamo.pdf
  if (type === "event") {
    pdfBuffer = await mergePdfWithNiyamo(pdfBuffer);
  }

  return { pdfBuffer, filename };
};

module.exports = {
  getLogoDataUri,
  generatePDF,
};
