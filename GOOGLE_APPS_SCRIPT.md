
# Google Apps Script Setup for Order Management

Follow these steps to connect your website's checkout to a Google Sheet. This will allow you to receive order details in real-time, for free.

## Step 1: Create Your Google Sheet

1.  Go to [sheets.google.com](https://sheets.google.com) and create a **New Blank Spreadsheet**.
2.  Rename it to something you'll remember, like "RakhiStore Orders".
3.  In the first row, create the following headers in cells A1, B1, C1, etc. The names **must match exactly**:
    *   `Timestamp`
    *   `Name`
    *   `Phone`
    *   `Address`
    *   `CartSummary`
    *   `TotalPrice`



## Step 2: Create the Apps Script

1.  In your new spreadsheet, go to **Extensions > Apps Script**.
2.  A new browser tab will open with the script editor.
3.  Delete any existing code in the `Code.gs` file (e.g., `function myFunction() { ... }`).
4.  Copy the entire code block below and paste it into the script editor.

```javascript
// This script logs POST data from the RakhiStore checkout form to a Google Sheet.

// The sheet name to write to.
const SHEET_NAME = "Sheet1"; 

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found.`);
    }

    // Extract data from the POST request
    const name = e.parameter.name || 'N/A';
    const phone = e.parameter.phone || 'N/A';
    const address = e.parameter.address || 'N/A';
    const cartSummary = e.parameter.cartSummary || 'N/A';
    const totalPrice = e.parameter.totalPrice || 'N/A';
    
    // Create the new row data
    const newRow = [
      new Date(), // Timestamp
      name,
      phone,
      address,
      cartSummary,
      totalPrice
    ];
    
    // Append the new row to the sheet
    sheet.appendRow(newRow);

    // Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Order received' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return an error response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy as a Web App

1.  In the Apps Script editor, click the blue **Deploy** button in the top-right corner.
2.  Select **New deployment**.
3.  Click the gear icon next to "Select type" and choose **Web app**.
4.  Configure the deployment:
    *   **Description:** `RakhiStore Order Endpoint` (or anything you like).
    *   **Execute as:** `Me`.
    *   **Who has access:** **Anyone**. This is very important! It allows your website to send data to the script.
5.  Click **Deploy**.
6.  You will be asked to **Authorize access**. Click the button, choose your Google account, and click **"Advanced" > "Go to [Your Project Name] (unsafe)"** and then **Allow**. This is safe because you wrote the code.
7.  After authorizing, a "Deployment successfully updated" window will appear. **Copy the Web app URL**. It will look like `https://script.google.com/macros/s/..../exec`.



## Step 4: Update Your Website Code

1.  Open the file `components/CheckoutModal.tsx` in your project.
2.  Find the line: `const GOOGLE_SCRIPT_URL = '...';`
3.  **Replace the placeholder URL** with the Web app URL you just copied.
4.  Also, make sure to update the `WHATSAPP_NUMBER` constant in the same file with your business's WhatsApp number (including the country code, e.g., `91` for India).
5.  Save the file and deploy your website.

Your checkout form is now connected! New orders will appear in your Google Sheet instantly.
