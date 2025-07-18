// --- 1. Import Dependencies ---
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const img = path.join(__dirname, "logo.jpg"); // Path to your logo image
// Import the menu data from our separate file
const { menuData } = require("./data.js");

// --- 2. Initialize Express App ---
const app = express();
const port = 5000;

// --- 3. Middleware Setup ---
app.use(cors()); // Allows your React frontend to communicate with this server
app.use(express.json()); // Tells Express to automatically parse JSON request bodies

/**
 * --- 4. PDF Generation Logic ---
 * This function takes the selected items, finds their full details from menuData,
 * and builds a complete HTML page as a string.
 */
const generateMenuHTML = (selections) => {
  // First, convert the IDs from the frontend into full objects from our menuData
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
        .filter((item) => item), // Filter out nulls if an item ID is invalid
    };
  }
  // Convert logo to base64 for embedding in HTML
  const logoBase64 = fs.readFileSync(img).toString("base64");
  const logoDataUri = `data:image/jpeg;base64,${logoBase64}`;

  // Now, build the HTML string with embedded CSS for styling
  // Using a template literal (`) for easy multiline strings and variable injection
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Custom Menu by Patel Caters</title>
        <style>
            /* Import Google Fonts for English and Gujarati text */
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700&family=Poppins:wght@400;700&display=swap');
            
            body {
                font-family: 'Poppins', sans-serif;
                color: #333;
                margin: 40px;
                font-size: 16px;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #d32f2f;
                padding-bottom: 20px;
                margin-bottom: 40px;
            }
            .header h1 {
                font-family: 'Poppins', sans-serif;
                font-weight: 700;
                font-size: 36px;
                color: #c62828;
                margin: 0;
            }
            .header p {
                font-family: 'Noto Sans Gujarati', sans-serif;
                font-size: 24px;
                color: #1565c0; /* Blue color for Patel Caters */
                margin: 5px 0 0 0;
            }
            .category {
                margin-bottom: 35px;
                break-inside: avoid; /* Important: Prevents a category from splitting across two pages */
            }
            .category-title {
                display: flex;
                align-items: baseline;
                border-bottom: 2px solid #e53935;
                padding-bottom: 8px;
                margin-bottom: 15px;
            }
            .category-title h2 {
                font-family: 'Poppins', sans-serif;
                font-size: 28px;
                font-weight: 700;
                color: #333;
                margin: 0 15px 0 0;
            }
            .category-title .gujarati {
                font-family: 'Noto Sans Gujarati', sans-serif;
                font-size: 20px;
                color: #555;
            }
            .item-list {
                columns: 2; /* Creates a two-column layout for the items */
                column-gap: 40px;
            }
            .item {
                padding: 10px 0;
                border-bottom: 1px dashed #ccc;
                break-inside: avoid; /* Important: Prevents an item from splitting across columns or pages */
            }
            .item:last-child {
                border-bottom: none;
            }
            .item .name {
                font-size: 16px;
                font-weight: 600;
                color: #444;
            }
            .item .gujarati-name {
                font-family: 'Noto Sans Gujarati', sans-serif;
                font-size: 14px;
                color: #777;
            }
            .footer {
                text-align: center;
                margin-top: 50px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="${logoDataUri}" alt="The Grand - Patel Caters">
        </div>
    `;

  // Loop through the resolved data and append HTML for each category and its items
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

  html += `
        <div class="footer">
            <p>Custom Menu Generated by The Grand - Patel Caters</p>
        </div>
    </body>
    </html>`;
  return html;
};

/**
 * --- 5. API Endpoint ---
 * This is the route that your React app will call.
 * It's an async function because Puppeteer operations are asynchronous.
 */
app.post("/generate-pdf", async (req, res) => {
  console.log("Received request to generate PDF. Data:", req.body);

  try {
    // 1. Generate the HTML using the data from the request body
    const htmlContent = generateMenuHTML(req.body);

    // 2. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      // These arguments are crucial for running in many server environments (like Docker, Heroku)
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // 3. Set the HTML content and wait for network activity to be idle (ensures fonts load)
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // 4. Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", right: "40px", bottom: "40px", left: "40px" },
    });

    // 5. Close the browser to free up resources
    await browser.close();

    // 6. Set HTTP headers to tell the browser this is a downloadable PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="The-Grand-Custom-Menu.pdf"'
    );

    // 7. Send the generated PDF back to the client
    res.send(pdfBuffer);

    console.log("PDF generated and sent successfully.");
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .send("An error occurred on the server while generating the PDF.");
  }
});

// --- 6. Start the Server ---
app.listen(port, () => {
  console.log(
    `✅ Backend server is running and listening at http://localhost:${port}`
  );
});
