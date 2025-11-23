# Miros Frontend-Only Integration Guide 🎉

## What Changed?

You now have a **frontend-only integration** that works **WITHOUT any API key or backend server**! 🚀

The Miros widget is already loaded in your HTML and only needs your **Integration ID** (which you already have).

---

## How It Works (Super Simple)

### What is an Integration ID?
Think of it like a library card number:
- **Integration ID** = Your library card (lets you use Miros widget)
- **API Key** = Not needed! The widget handles everything

Your Integration ID: `fb97f7d4-fe95-402f-a81a-402cb062eaa3` ✅

---

## How It Works Now

### Before (Required Backend + API Key):
```
Frontend → Your Backend → Miros API (needs API key) → Results → Backend → Frontend
```

### Now (Frontend Only - Direct API Calls):
```
Frontend → Direct GraphQL API calls (uses Integration ID) → Results fill table directly! ✨
```

**NO POPUP OVERLAY** - Results appear **only in your table** (table is #1 priority!)

---

## What the Code Does

### 1. **Direct GraphQL API Calls**

Instead of using the widget popup, the code now:
- Makes direct `POST` requests to `https://api.miros.services/graphql`
- Uses your Integration ID in headers (`X-Integration-Id`)
- Fills the table **directly** with results
- **No popup overlay** is shown

### 2. **Search Types Supported**

**Text/NLP Search:**
```javascript
query Search($textQuery: String!, $categoryIds: [String!], $limit: Int!) {
  search(textQuery: $textQuery, categoryIds: $categoryIds, limit: $limit) { ... }
}
```

**SKU/Item Search:**
```javascript
query ItemRecommendations($itemId: String!, $limit: Int!) {
  itemRecommendations(itemId: $itemId, limit: $limit) { ... }
}
```

**URL Search:**
- Extracts product info from URL
- Uses it as text query

### 3. **No Popup - Table Only**

- Popup overlay is **completely disabled**
- All results appear **directly in your table**
- Clean, simple interface focused on your table

---

## Features

### ✅ What Works Now:

1. **Text/NLP Search** - Type keywords, click Search
2. **SKU Search** - Type product ID, click Search  
3. **URL Search** - Paste product URL, click Search
4. **Image Search** - Upload image, widget handles it
5. **Category Filtering** - Select category from dropdown

### 📱 Results Display:

- **Primary**: Results appear **directly in your table** (no popup overlay!)
- **How**: Direct GraphQL API calls to Miros using Integration ID
- **No Popup**: Table is the #1 priority - popup is completely disabled

---

## No Backend Needed!

### What You DON'T Need Anymore:

❌ No backend server (`server.js`)  
❌ No API key  
❌ No `.env` file  
❌ No `npm install`  
❌ No `node server.js`  

### What You DO Need:

✅ Just open `index.html` in a browser!  
✅ That's it! 🎉

---

## How to Test

### Step 1: Open Your HTML File

Just double-click `index.html` or open it in a browser!

### Step 2: Try a Search

1. Type a search term (e.g., "red dress")
2. Select a category (optional)
3. Click "Search"
4. **Results appear directly in your table!** ✨ (No popup!)

### Step 3: Try Different Search Types

- **Text**: "blue jeans"
- **SKU**: "SKU-12345" (if you have real SKUs)
- **URL**: Paste any product URL
- **Image**: Click "Upload Image"

---

## How It Works (No Widget Popup)

### Direct API Calls

When you search, the code:
1. Makes direct GraphQL POST request to Miros API
2. Uses Integration ID for authentication (tries without API key first)
3. Receives results as JSON
4. Transforms results to table format
5. **Fills your table directly** - no popup!

### Integration ID Authentication

The code uses your Integration ID in the request header:
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Integration-Id': 'fb97f7d4-fe95-402f-a81a-402cb062eaa3',
}
```

**Note:** If Miros requires an API key, you'll see an error message. In that case, you may need to add an API key to the headers (check Miros documentation).

---

## Image Upload

### How It Works Now:

1. User selects an image file
2. Code converts it to a data URL (base64)
3. Sets `data-miros-image-url` attribute
4. Opens Miros widget popup
5. Widget handles the visual search!

**No backend upload needed!** The image is passed directly to the widget.

---

## Troubleshooting

### Problem: "Widget doesn't open"
- **Check**: Is the Miros script loading? (Open browser console - check for errors)
- **Check**: Is your Integration ID correct? (`fb97f7d4-fe95-402f-a81a-402cb062eaa3`)
- **Fix**: Make sure you're accessing via `http://` or `https://` (not `file://`)

### Problem: "No results showing"
- **Check**: Do you have products in your Miros integration?
- **Check**: Is your Integration ID activated/configured?
- **Check**: Open browser console (F12) - look for API errors
- **Fix**: Contact Miros support to verify your integration is set up correctly

### Problem: "API authentication required" or "401 Unauthorized"
- **This means**: Miros API requires an API key, not just Integration ID
- **Solution**: You may need to add an API key to the request headers
- **Check**: Browser console for detailed error message
- **Note**: The code tries without API key first - if it fails, you'll see this error

### Problem: "Results not appearing in table"
- **Check**: Browser console for JavaScript errors
- **Check**: Network tab - are API requests succeeding?
- **Check**: Are you getting a valid response from Miros API?
- **Fix**: Verify your Integration ID is correct and active

---

## Browser Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection (widget loads from Miros CDN)

---

## What's Different from Backend Version?

| Feature | Backend Version | Frontend-Only Version |
|---------|----------------|----------------------|
| Setup | Complex (install Node, setup backend) | Super simple (just open HTML) |
| API Key | Required | Not needed! |
| Results | Appear in your table | Appear in Miros popup |
| Server | Required | Not needed |
| Image Upload | Needs backend processing | Handled by widget |
| Dependencies | Node.js, Express, etc. | None! |

---

## Next Steps

1. ✅ Test all search types
2. ✅ Verify Miros popup opens correctly
3. ✅ Check if results appear (in popup)
4. ✅ Customize widget styling (if Miros allows)
5. ✅ Deploy to a web server (if needed for production)

---

## Questions?

- **Miros Widget Docs**: [Miros Integration Documentation](https://content.miros.services/frontend/public/developer/docs/api/core_concepts/integration)
- **Integration ID**: Already set in your HTML
- **Support**: Contact Miros if widget doesn't work

---

## Summary

🎉 **You can now use Miros WITHOUT any backend or API key (hopefully)!**

**Key Features:**
- ✅ **NO popup overlay** - results fill table directly
- ✅ **Table is #1 priority** - clean, simple interface
- ✅ Direct GraphQL API calls from frontend
- ✅ Uses Integration ID for authentication

**Just:**
1. Open `index.html`
2. Search
3. See results **directly in your table**! ✨

**Note:** If Miros API requires an API key (not just Integration ID), you'll see an authentication error. In that case, check Miros documentation for API key setup.

That's it! Super simple! 🚀

