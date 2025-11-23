# Product Requirements Document (PRD)
## Similar Products Recommendation Dashboard

---

## 1. Product Overview

### 1.1 What Are We Building?
A web-based dashboard that helps category managers find similar products in an e-commerce catalog. Users can search by typing keywords, pasting product URLs, entering SKU codes, or uploading product images. The system returns up to 12 similar products in an easy-to-read table format.

### 1.2 Who Is This For?
**Primary User:** Category Managers working in e-commerce  
**Their Goal:** Quickly find similar products to help with merchandising, catalog organization, and product recommendations

### 1.3 The Problem We're Solving
Category managers need to manually browse through thousands of products to find similar items. This is time-consuming and inefficient. This tool automates the process using AI-powered visual similarity search.

---

## 2. Core Features

### 2.1 Search Functionality (Phase 1 - Current)

**Three Search Methods:**

1. **Text Search**
   - User types product name, description, or keywords
   - Example: "red summer dress" or "wireless headphones"

2. **SKU Search**
   - User enters the unique product code
   - Example: "SKU-12345"

3. **URL Search**
   - User pastes a product page link
   - Example: "https://yourstore.com/products/blue-jeans"

**How It Works:**
- User enters search term in the text input field
- User selects category from dropdown (currently showing "Fashion")
- User clicks "Search" button
- System calls Miros API with search parameters
- Results display in table below

### 2.2 Image Upload Search (Phase 2 - Future)

**How It Works:**
- User clicks "Upload Image" button
- User selects image file from their computer
- System sends image to Miros API for visual analysis
- Miros identifies product features (color, style, pattern, etc.)
- System returns top 10-12 visually similar products

**Category Selection:**
- Dropdown menu allows user to filter by product category
- Helps narrow down results to relevant department
- Example: Searching within "Women's Apparel" vs "Home Decor"

### 2.3 Results Display

**Results Table Shows:**

| Column Name | What It Shows | Example |
|------------|---------------|---------|
| Product Title | Full name of the product | "Blue Denim Jacket - Medium Wash" |
| Product Image | Small thumbnail photo | [thumbnail] |
| Option ID | Unique identifier for product variant | "OPT-789456" |
| Colour Variant ID | Specific color option code | "CV-BLUE-01" |
| CP Product URL | Direct link to product page | "https://..." |
| Super Category | Highest level category | "Clothing" |
| CP Department | Department classification | "Women's Fashion" |
| CP Key Section | Subsection within department | "Outerwear" |
| CP Pref Category | Preferred merchandising category | "Jackets & Coats" |

**Additional Features:**
- "Clear Results" button - Removes current search results
- "Download" button - Exports table data to CSV/Excel file
- Status message: "Waiting for your first search..." (before first search)
- Status message: "Showing up to the top 12 matched items from Miros" (after search)

---

## 3. Technical Architecture

### 3.1 System Components

**Frontend (What User Sees):**
- Web interface built with HTML/CSS/JavaScript
- Search form with input fields and buttons
- Results table that updates dynamically
- Loading indicators during API calls

**Backend (Behind the Scenes):**
- Server that receives user requests
- Handles API authentication with Miros
- Processes and formats search results
- Manages data flow between frontend and Miros API

**External Service:**
- Miros API - Third-party service that performs visual similarity search

### 3.2 How the System Works (User Flow)

```
1. User enters search → 
2. Frontend sends request to your backend → 
3. Backend calls Miros API → 
4. Miros processes request and finds similar products → 
5. Miros sends results back to backend → 
6. Backend formats results → 
7. Frontend displays results in table
```



## 6. User Interface Requirements

### 6.1 Current UI Components (As Shown in Image)

**Top Section - Search Bar:**
- Text input field: "Enter search term or SKU"
- Dropdown: Category selector (currently "Fashion")
- Button: "Upload Image" (grey, secondary action)
- Button: "Search" (dark grey, primary action)

**Middle Section - Results Area:**
- Heading: "Search Results for Similar Products Recommendation"
- Subheading: "Showing up to the top 12 matched items from Miros"
- Button: "Clear Results" (top right)
- Instruction text: "Enter a search term, SKU ID, or upload an image to see product-level recommendations here."

**Results Table:**
- Headers: Product Title | Option ID | Colour Variant ID | CP Product URL | Super Category | CP Department | CP Key Section | CP Pref Category
- Empty state shows: "Waiting for your first search..."

**Bottom Section:**
- Button: "Download" (bottom right)

### 6.2 UI States

**State 1: Initial Load**
- Search bar ready for input
- Table shows placeholder text
- All buttons active

**State 2: Searching**
- Show loading spinner
- Disable search button
- Show message: "Searching for similar products..."

**State 3: Results Displayed**
- Table populated with product data
- Show result count
- Enable Download and Clear Results buttons
- Product images display as thumbnails

**State 4: No Results**
- Show message: "No similar products found. Try a different search term."
- Keep search bar active
- Suggest alternative searches

**State 5: Error**
- Show friendly error message
- Examples: "Something went wrong. Please try again."
- Keep search bar active
- Log detailed error in console/backend

### 6.3 Interactive Elements

**Product URLs:**
- Make product URLs clickable
- Open in new tab when clicked

**Product Images:**
- Show thumbnail in table
- Click to view larger version (optional future feature)

**Sort/Filter (Future Feature):**
- Allow sorting by category
- Filter by department

---

