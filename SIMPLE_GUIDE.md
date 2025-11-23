# Super Simple Backend Setup Guide 🚀

## What is a Backend? (Like You're 5 Years Old)

Imagine you're ordering pizza:
- **Frontend** = The menu you see and the button you click
- **Backend** = The kitchen that makes your pizza and sends it back
- **Miros API** = The special ingredient supplier

Your website frontend (the menu) is ready! But you need a backend (the kitchen) to talk to Miros API (the supplier) and send back the results.

---

## Step 1: Install Node.js (The Engine)

**What is Node.js?** It's like a motor that runs JavaScript on your computer (not just in the browser).

1. Go to https://nodejs.org/
2. Download the LTS version (the green button)
3. Install it (just click Next, Next, Next)
4. Open Terminal (Mac) or Command Prompt (Windows)
5. Type: `node --version`
6. If you see a number (like v18.17.0), you're done! ✅

---

## Step 2: Create the Backend Files

**What we're making:**
- `package.json` = A recipe card that lists what we need
- `server.js` = The actual kitchen (server) that does all the work
- `.env` = A secret note with your API keys (don't share this!)

Don't worry - I'll create these files for you! 🎉

---

## Step 3: Get Your Miros API Key

**What is an API Key?** It's like a password that lets your backend talk to Miros.

1. Log into your Miros account
2. Find the "API Keys" or "Developer Settings" section
3. Create a new API key or copy an existing one
4. Save it somewhere safe (you'll need it in Step 5)

**Don't have an API key?** Contact Miros support or check your dashboard.

---

## Step 4: Install Dependencies (Get the Ingredients)

Open Terminal in your project folder and type:

```bash
npm install
```

**What this does:** Downloads all the tools your backend needs (Express, node-fetch, etc.)

Wait for it to finish. You'll see a `node_modules` folder appear - that's normal!

---

## Step 5: Set Up Your API Keys (The Secret Sauce)

1. Copy `.env.example` and rename it to `.env`
2. Open `.env` in a text editor
3. Replace `YOUR_API_KEY_HERE` with your actual Miros API key
4. Save the file

**Important:** Never share your `.env` file! It has secrets!

---

## Step 6: Start Your Backend Server (Start the Kitchen)

In Terminal, type:

```bash
node server.js
```

You should see:
```
✅ Backend server running on port 3000
🚀 Ready to handle requests!
```

**Yay! Your backend is now running!** 🎊

Keep this Terminal window open - if you close it, your backend stops working.

---

## Step 7: Test It (Make Sure It Works)

1. Make sure your backend is running (Step 6)
2. Open your `index.html` in a browser
3. Or, use a tool like Postman to test

If everything works, when you search in the frontend, you should see results appear!

---

## What Each File Does (Simple Explanation)

| File | What It Does |
|------|--------------|
| `server.js` | The main kitchen - handles all requests and talks to Miros |
| `package.json` | The recipe card - lists what we need |
| `.env` | Secret sauce - stores your API keys |
| `.env.example` | A template showing what keys you need |

---

## Common Problems & Fixes

**Problem:** "Cannot find module 'express'"
- **Fix:** Run `npm install` again

**Problem:** "Port 3000 already in use"
- **Fix:** Change the port number in `server.js` (look for `PORT = 3000`)

**Problem:** "Error: Invalid API key"
- **Fix:** Check your `.env` file - make sure your API key is correct

**Problem:** "Cannot connect to backend"
- **Fix:** Make sure your backend is running (Step 6) and check the URL in your frontend

---

## Next Steps

Once everything works:
1. ✅ Test URL search
2. ✅ Test SKU search  
3. ✅ Test text search
4. ✅ Test image upload (if implemented)

**Need Help?**
- Check the console for error messages
- Make sure all steps above are completed
- Verify your API key is correct

---

## That's It! 🎉

You now have a working backend! Your frontend can talk to Miros API through your backend, and everything should work smoothly.

