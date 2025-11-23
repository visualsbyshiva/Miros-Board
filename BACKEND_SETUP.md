# Backend Setup Guide

## What's Been Done (Frontend)

✅ **URL Detection**: The frontend now detects URLs (starting with `http://` or `https://`)  
✅ **Limit Set to 15**: All search requests now request 15 results  
✅ **UI Updated**: Text updated from "12" to "15" results  
✅ **Placeholder Text**: Input field now mentions URL support  

The frontend is ready and will send requests to your backend at `/api/miros/search`.

---

## What You Need to Do (Backend)

### 1. **Set Up Backend Server**

You need to create a backend server that:
- Receives POST requests at `/api/miros/search`
- Authenticates with Miros API
- Calls Miros API with the correct parameters
- Transforms Miros response to your table format
- Returns JSON with `{ items: [...] }`

**Recommended Stack:**
- **Node.js/Express** (easiest if you know JavaScript)
- **Python/Flask or FastAPI** (good for data processing)
- **Any backend framework** that can make HTTP requests

---

### 2. **Get Miros API Credentials**

You need from Miros:
1. **API Key** - For authenticating requests
2. **Integration ID** - You already have this: `fb97f7d4-fe95-402f-a81a-402cb062eaa3`
3. **API Endpoint URL** - Usually `https://api.miros.services/graphql` (GraphQL) or REST endpoint
4. **API Documentation** - To understand request/response format

**Where to get these:**
- Check your Miros dashboard/account
- Contact Miros support if you don't have API access yet
- Review Miros API documentation

---

### 3. **Implement `/api/miros/search` Endpoint**

Your backend endpoint should handle three types of requests:

#### **Request Format (from frontend):**

```json
// URL Search
{
  "type": "url",
  "url": "https://yourstore.com/products/blue-jeans",
  "category": "Fashion",
  "limit": 15
}

// SKU/Item Search
{
  "type": "item",
  "itemId": "SKU-12345",
  "limit": 15
}

// Text/NLP Search
{
  "type": "nlp",
  "query": "red summer dress",
  "category": "Fashion",
  "limit": 15
}
```

#### **Response Format (to frontend):**

```json
{
  "items": [
    {
      "productTitle": "Blue Denim Jacket - Medium Wash",
      "optionId": "OPT-789456",
      "colourVariantId": "CV-BLUE-01",
      "url": "https://yourstore.com/products/blue-jacket",
      "superCategory": "Clothing",
      "department": "Women's Fashion",
      "keySection": "Outerwear",
      "preferredCategory": "Jackets & Coats"
    },
    // ... up to 15 items
  ]
}
```

---

### 4. **Miros API Integration Strategy**

Based on Miros API documentation, here's how to handle each search type:

#### **A. URL Search** (New Feature)
Since Miros doesn't have a direct "search by URL" endpoint, you have two options:

**Option 1: Extract Product Info from URL**
- Parse the URL to extract product ID/SKU
- Use that ID with Miros `itemRecommendations` query
- Example: `https://store.com/products/12345` → extract `12345` → use as `itemId`

**Option 2: Use URL as Text Query**
- Extract product name/title from the URL path
- Use that as a text query with Miros `search` query
- Example: `https://store.com/products/blue-denim-jacket` → extract "blue denim jacket" → use as `text_query`

**Option 3: Your Own Product Database**
- If you have a product database, look up the product by URL
- Get the product's Miros `itemId` or attributes
- Use that to search Miros

#### **B. SKU/Item Search**
Use Miros GraphQL `itemRecommendations` query:

```graphql
query ItemRecommendations($itemId: String!, $limit: Int!) {
  itemRecommendations(itemId: $itemId, limit: $limit) {
    itemId
    title
    url
    imageUrl
    # ... other fields
  }
}
```

#### **C. Text/NLP Search**
Use Miros GraphQL `search` query:

```graphql
query Search($textQuery: String!, $categoryIds: [String!], $limit: Int!) {
  search(textQuery: $textQuery, categoryIds: $categoryIds, limit: $limit) {
    itemId
    title
    url
    imageUrl
    # ... other fields
  }
}
```

---

### 5. **Backend Code Example (Node.js/Express)**

Here's a skeleton implementation:

```javascript
const express = require('express');
const fetch = require('node-fetch'); // or use axios
const app = express();

app.use(express.json());

const MIROS_API_URL = 'https://api.miros.services/graphql';
const MIROS_API_KEY = 'YOUR_API_KEY_HERE';
const MIROS_INTEGRATION_ID = 'fb97f7d4-fe95-402f-a81a-402cb062eaa3';

// Helper to call Miros GraphQL API
async function callMirosAPI(query, variables) {
  const response = await fetch(MIROS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MIROS_API_KEY}`, // Check Miros docs for auth format
      'X-Integration-Id': MIROS_INTEGRATION_ID,
    },
    body: JSON.stringify({ query, variables }),
  });
  
  if (!response.ok) {
    throw new Error(`Miros API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (data.errors) {
    throw new Error(`Miros API errors: ${JSON.stringify(data.errors)}`);
  }
  
  return data.data;
}

// Transform Miros result to your table format
function transformMirosResult(item) {
  return {
    productTitle: item.title || item.name || '-',
    optionId: item.optionId || item.option_id || '-',
    colourVariantId: item.colourVariantId || item.colour_variant_id || '-',
    url: item.url || item.productUrl || item.product_url || '',
    superCategory: item.superCategory || item.super_category || '-',
    department: item.department || item.cpDepartment || item.cp_department || '-',
    keySection: item.keySection || item.cpKeySection || item.cp_key_section || '-',
    preferredCategory: item.preferredCategory || item.cpPrefCategory || item.cp_pref_category || '-',
  };
}

// Main search endpoint
app.post('/api/miros/search', async (req, res) => {
  try {
    const { type, url, itemId, query, category, limit = 15 } = req.body;
    
    let mirosData;
    
    if (type === 'url') {
      // TODO: Implement URL handling strategy
      // Option 1: Extract product ID from URL
      // Option 2: Use URL as text query
      // Option 3: Look up in your product database
      
      // For now, treating URL as text query (you'll need to adjust)
      const urlQuery = extractProductInfoFromUrl(url); // Implement this
      
      const searchQuery = `
        query Search($textQuery: String!, $limit: Int!) {
          search(textQuery: $textQuery, limit: $limit) {
            itemId
            title
            url
            # Add all fields you need from Miros
          }
        }
      `;
      
      mirosData = await callMirosAPI(searchQuery, {
        textQuery: urlQuery,
        limit: limit,
      });
      
      mirosData = mirosData.search || [];
      
    } else if (type === 'item') {
      const itemQuery = `
        query ItemRecommendations($itemId: String!, $limit: Int!) {
          itemRecommendations(itemId: $itemId, limit: $limit) {
            itemId
            title
            url
            # Add all fields you need from Miros
          }
        }
      `;
      
      mirosData = await callMirosAPI(itemQuery, {
        itemId: itemId,
        limit: limit,
      });
      
      mirosData = mirosData.itemRecommendations || [];
      
    } else if (type === 'nlp') {
      // Map your category names to Miros category IDs if needed
      const categoryIds = mapCategoryToMirosIds(category); // Implement this
      
      const searchQuery = `
        query Search($textQuery: String!, $categoryIds: [String!], $limit: Int!) {
          search(textQuery: $textQuery, categoryIds: $categoryIds, limit: $limit) {
            itemId
            title
            url
            # Add all fields you need from Miros
          }
        }
      `;
      
      mirosData = await callMirosAPI(searchQuery, {
        textQuery: query,
        categoryIds: categoryIds,
        limit: limit,
      });
      
      mirosData = mirosData.search || [];
    } else {
      return res.status(400).json({ error: 'Invalid search type' });
    }
    
    // Transform results to your table format
    const items = mirosData
      .slice(0, limit)
      .map(transformMirosResult);
    
    res.json({ items });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Miros results',
      message: error.message 
    });
  }
});

// Helper function to extract product info from URL (implement based on your URL structure)
function extractProductInfoFromUrl(url) {
  // Example: Extract product name from URL path
  // https://store.com/products/blue-denim-jacket -> "blue denim jacket"
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/').filter(p => p);
  const productSlug = pathParts[pathParts.length - 1];
  return productSlug.replace(/-/g, ' ');
}

// Helper function to map your categories to Miros category IDs
function mapCategoryToMirosIds(category) {
  // TODO: Map your category names to Miros category IDs
  // This depends on how Miros categorizes products
  // Return array of category IDs or null/undefined if not filtering
  return null; // or ['category-id-1', 'category-id-2']
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

---

### 6. **Key Implementation Tasks**

1. **Install Dependencies**
   ```bash
   npm install express node-fetch
   # or
   pip install flask requests
   ```

2. **Get Miros API Credentials**
   - API Key
   - Verify API endpoint URL
   - Understand authentication method (Bearer token, API key header, etc.)

3. **Understand Miros Response Structure**
   - What fields does Miros return?
   - Map Miros fields to your table columns
   - Update `transformMirosResult()` function accordingly

4. **Implement URL Handling**
   - Decide on strategy (extract ID, use as text, or database lookup)
   - Implement `extractProductInfoFromUrl()` function
   - Test with real product URLs

5. **Map Categories**
   - Your categories: "Fashion", "Womenswear", "Menswear", etc.
   - Miros category IDs (need to find these)
   - Implement `mapCategoryToMirosIds()` function

6. **Handle Errors**
   - Invalid URLs
   - API rate limits
   - Network failures
   - Missing data fields

7. **Test Each Search Type**
   - URL search with real product URLs
   - SKU search with valid item IDs
   - Text search with keywords

---

### 7. **Environment Variables**

Create a `.env` file (don't commit to git):

```env
MIROS_API_KEY=your_api_key_here
MIROS_API_URL=https://api.miros.services/graphql
MIROS_INTEGRATION_ID=fb97f7d4-fe95-402f-a81a-402cb062eaa3
PORT=3000
```

---

### 8. **CORS Configuration**

If your frontend and backend are on different ports/domains, enable CORS:

```javascript
const cors = require('cors');
app.use(cors()); // Allow all origins (adjust for production)
```

---

### 9. **Testing**

Test your backend with curl or Postman:

```bash
# Test URL search
curl -X POST http://localhost:3000/api/miros/search \
  -H "Content-Type: application/json" \
  -d '{
    "type": "url",
    "url": "https://yourstore.com/products/test-product",
    "category": "Fashion",
    "limit": 15
  }'

# Test SKU search
curl -X POST http://localhost:3000/api/miros/search \
  -H "Content-Type: application/json" \
  -d '{
    "type": "item",
    "itemId": "SKU-12345",
    "limit": 15
  }'

# Test text search
curl -X POST http://localhost:3000/api/miros/search \
  -H "Content-Type: application/json" \
  -d '{
    "type": "nlp",
    "query": "red dress",
    "category": "Fashion",
    "limit": 15
  }'
```

---

### 10. **Next Steps Checklist**

- [ ] Set up backend server (Node.js/Python/etc.)
- [ ] Get Miros API credentials
- [ ] Review Miros API documentation
- [ ] Implement `/api/miros/search` endpoint
- [ ] Map Miros response fields to your table format
- [ ] Implement URL extraction/handling strategy
- [ ] Map your categories to Miros category IDs
- [ ] Add error handling
- [ ] Test all three search types
- [ ] Deploy backend (or run locally for development)
- [ ] Update frontend API URL if backend is on different port/domain

---

## Questions to Answer

1. **Do you have Miros API credentials?** (API key, endpoint URL)
2. **What's your product URL structure?** (to extract product info)
3. **Do you have a product database?** (to look up products by URL)
4. **What backend technology do you prefer?** (Node.js, Python, etc.)
5. **Where will you host the backend?** (local dev, cloud, etc.)

Once you have these answers, you can implement the backend endpoint and connect everything together!

