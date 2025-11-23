/**
 * Backend Server for Miros POC
 * This server handles requests from your frontend and talks to Miros API
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

// Create Express app
const app = express();

// Allow frontend to talk to backend (CORS)
app.use(cors());
app.use(express.json());

// Get configuration from environment variables
const MIROS_API_URL = process.env.MIROS_API_URL || 'https://api.miros.services/graphql';
const MIROS_API_KEY = process.env.MIROS_API_KEY;
const MIROS_INTEGRATION_ID = process.env.MIROS_INTEGRATION_ID || 'fb97f7d4-fe95-402f-a81a-402cb062eaa3';
const PORT = process.env.PORT || 3000;

// Check if API key is set
if (!MIROS_API_KEY) {
  console.error('❌ ERROR: MIROS_API_KEY is not set in .env file!');
  console.error('   Please create a .env file and add your API key.');
  process.exit(1);
}

/**
 * Helper function to call Miros GraphQL API
 * This is like making a phone call to Miros and asking for product information
 */
async function callMirosAPI(query, variables) {
  try {
    const response = await fetch(MIROS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MIROS_API_KEY}`,
        'X-Integration-Id': MIROS_INTEGRATION_ID,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Miros API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`Miros API errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  } catch (error) {
    console.error('Error calling Miros API:', error);
    throw error;
  }
}

/**
 * Transform Miros result to match your table format
 * This converts Miros's data into the format your frontend expects
 */
function transformMirosResult(item) {
  return {
    productTitle: item.title || item.name || item.productTitle || '-',
    optionId: item.optionId || item.option_id || item.optionID || '-',
    colourVariantId: item.colourVariantId || item.colour_variant_id || item.colourVariantID || '-',
    url: item.url || item.productUrl || item.product_url || item.uri || '',
    superCategory: item.superCategory || item.super_category || item.category || '-',
    department: item.department || item.cpDepartment || item.cp_department || item.departmentName || '-',
    keySection: item.keySection || item.cpKeySection || item.cp_key_section || item.section || '-',
    preferredCategory: item.preferredCategory || item.cpPrefCategory || item.cp_pref_category || item.prefCategory || '-',
  };
}

/**
 * Extract product information from URL
 * Converts a URL like "https://store.com/products/blue-denim-jacket" 
 * into a search query like "blue denim jacket"
 */
function extractProductInfoFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p && p !== 'products');
    const productSlug = pathParts[pathParts.length - 1];
    
    // Convert URL slug to readable text
    // "blue-denim-jacket" -> "blue denim jacket"
    return productSlug.replace(/-/g, ' ').replace(/_/g, ' ');
  } catch (error) {
    // If URL parsing fails, just use the whole URL as query
    return url;
  }
}

/**
 * Main search endpoint - handles all three search types
 * POST /api/miros/search
 */
app.post('/api/miros/search', async (req, res) => {
  try {
    const { type, url, itemId, query, category, limit = 15 } = req.body;

    console.log(`📥 Received search request: type=${type}`);

    let mirosData = [];

    // Handle URL search
    if (type === 'url') {
      if (!url) {
        return res.status(400).json({ error: 'URL is required for URL search' });
      }

      console.log(`🔍 Processing URL search for: ${url}`);

      // Extract product info from URL and use it as text query
      const urlQuery = extractProductInfoFromUrl(url);

      const searchQuery = `
        query Search($textQuery: String!, $limit: Int!) {
          search(textQuery: $textQuery, limit: $limit) {
            itemId
            title
            url
            optionId
            colourVariantId
            superCategory
            department
            keySection
            preferredCategory
          }
        }
      `;

      const data = await callMirosAPI(searchQuery, {
        textQuery: urlQuery,
        limit: limit,
      });

      mirosData = data.search || [];

    } 
    // Handle SKU/Item search
    else if (type === 'item') {
      if (!itemId) {
        return res.status(400).json({ error: 'itemId is required for item search' });
      }

      console.log(`🔍 Processing item search for: ${itemId}`);

      const itemQuery = `
        query ItemRecommendations($itemId: String!, $limit: Int!) {
          itemRecommendations(itemId: $itemId, limit: $limit) {
            itemId
            title
            url
            optionId
            colourVariantId
            superCategory
            department
            keySection
            preferredCategory
          }
        }
      `;

      const data = await callMirosAPI(itemQuery, {
        itemId: itemId,
        limit: limit,
      });

      mirosData = data.itemRecommendations || [];

    } 
    // Handle text/NLP search
    else if (type === 'nlp') {
      if (!query) {
        return res.status(400).json({ error: 'query is required for NLP search' });
      }

      console.log(`🔍 Processing NLP search for: "${query}"`);

      // Note: If Miros API requires category IDs instead of category names,
      // you'll need to map category names to IDs here
      const categoryIds = category ? [category] : null;

      const searchQuery = `
        query Search($textQuery: String!, $categoryIds: [String!], $limit: Int!) {
          search(textQuery: $textQuery, categoryIds: $categoryIds, limit: $limit) {
            itemId
            title
            url
            optionId
            colourVariantId
            superCategory
            department
            keySection
            preferredCategory
          }
        }
      `;

      const data = await callMirosAPI(searchQuery, {
        textQuery: query,
        categoryIds: categoryIds,
        limit: limit,
      });

      mirosData = data.search || [];

    } 
    // Invalid search type
    else {
      return res.status(400).json({ 
        error: 'Invalid search type. Must be "url", "item", or "nlp"' 
      });
    }

    // Transform results to match your table format
    const items = mirosData
      .slice(0, limit)
      .map(transformMirosResult);

    console.log(`✅ Returning ${items.length} results`);

    res.json({ items });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Miros results',
      message: error.message 
    });
  }
});

/**
 * Image upload endpoint (for future use)
 * POST /api/miros/upload-image
 */
app.post('/api/miros/upload-image', async (req, res) => {
  try {
    // This endpoint is a placeholder for image upload functionality
    // You'll need to implement actual image upload to Miros API based on their documentation
    
    return res.status(501).json({ 
      error: 'Image upload not yet implemented',
      message: 'Check Miros API docs for image upload endpoint' 
    });

    // Future implementation would look like:
    // 1. Receive image file from frontend
    // 2. Upload to Miros API (or their image hosting)
    // 3. Get imageUrl back
    // 4. Use imageUrl for visual search
    // 5. Return results

  } catch (error) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      message: error.message 
    });
  }
});

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('');
  console.log('✅ Backend server running on port', PORT);
  console.log('🚀 Ready to handle requests!');
  console.log('');
  console.log('Endpoints available:');
  console.log(`  POST http://localhost:${PORT}/api/miros/search`);
  console.log(`  POST http://localhost:${PORT}/api/miros/upload-image`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log('');
});

