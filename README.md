# Miros POC - Backend Setup

Quick start guide to get your backend running.

## Prerequisites

- **Node.js** installed (v16 or higher recommended)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

## Quick Setup (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server framework
- `cors` - Allows frontend to talk to backend
- `dotenv` - Loads environment variables
- `node-fetch` - Makes HTTP requests to Miros API

### 2. Configure API Keys

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Miros API key
# Open .env in a text editor and replace YOUR_API_KEY_HERE
```

**Required in `.env`:**
- `MIROS_API_KEY` - Your Miros API key (get from Miros dashboard)
- `MIROS_API_URL` - Usually `https://api.miros.services/graphql`
- `MIROS_INTEGRATION_ID` - You already have this: `fb97f7d4-fe95-402f-a81a-402cb062eaa3`

### 3. Start the Server

```bash
node server.js
```

You should see:
```
✅ Backend server running on port 3000
🚀 Ready to handle requests!
```

### 4. Test It

Open your browser and visit:
- Health check: http://localhost:3000/api/health

Or use your frontend (`index.html`) to test search functionality.

## File Structure

```
├── server.js          # Main backend server
├── package.json       # Dependencies and scripts
├── .env.example       # Template for environment variables
├── .env               # Your actual API keys (don't commit this!)
├── index.html         # Frontend (already created)
└── SIMPLE_GUIDE.md    # Super simple explanation guide
```

## API Endpoints

### POST `/api/miros/search`

Search for products using Miros API.

**Request body:**
```json
{
  "type": "url",           // or "item" or "nlp"
  "url": "https://...",    // for URL search
  "itemId": "SKU-123",     // for item search
  "query": "red dress",    // for NLP search
  "category": "Fashion",   // optional
  "limit": 15              // optional, default 15
}
```

**Response:**
```json
{
  "items": [
    {
      "productTitle": "...",
      "optionId": "...",
      "colourVariantId": "...",
      "url": "...",
      "superCategory": "...",
      "department": "...",
      "keySection": "...",
      "preferredCategory": "..."
    }
  ]
}
```

### POST `/api/miros/upload-image`

Image upload endpoint (placeholder - needs implementation based on Miros API docs).

### GET `/api/health`

Health check endpoint to verify server is running.

## Troubleshooting

**Problem:** `Cannot find module 'express'`
- **Solution:** Run `npm install`

**Problem:** `Port 3000 already in use`
- **Solution:** Change `PORT` in `.env` to a different number (e.g., 3001)

**Problem:** `MIROS_API_KEY is not set`
- **Solution:** Make sure you created `.env` file and added your API key

**Problem:** `Error: Invalid API key` or `401 Unauthorized`
- **Solution:** Check your API key in `.env` file - it might be incorrect or expired

**Problem:** Frontend can't connect to backend
- **Solution:** 
  1. Make sure backend is running (`node server.js`)
  2. Check that frontend is calling the correct URL (should be `/api/miros/search` for relative URLs)
  3. If frontend is on different port, ensure CORS is enabled (already done in `server.js`)

## Development Notes

- The server uses CORS to allow requests from any origin (fine for development, restrict for production)
- All Miros API calls are logged to console for debugging
- Error messages are returned to frontend for easier debugging

## Next Steps

1. ✅ Get Miros API credentials
2. ✅ Test all three search types (URL, SKU, text)
3. ✅ Implement image upload endpoint (if needed)
4. ✅ Deploy to production (when ready)

## Need Help?

- Check `SIMPLE_GUIDE.md` for a super simple explanation
- Check `BACKEND_SETUP.md` for detailed documentation
- Review Miros API documentation for endpoint details

