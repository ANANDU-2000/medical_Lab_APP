# 🔧 Data Sync Troubleshooting Guide

## Problem
Data is not syncing between different browsers because the MongoDB connection is not working yet.

## ✅ What Has Been Fixed

1. **API Endpoint Path** - Updated from `/api` to `/.netlify/functions/api`
2. **Data Structure** - Fixed localStorage keys to match current implementation
3. **Sync Logic** - Added proper bulk upload/download endpoints
4. **MongoDB Integration** - Backend now uses MongoDB instead of temporary memory

## 🚀 Steps to Make It Work

### Step 1: Restart Your Development Server

**IMPORTANT:** The `.env` file was created, but Netlify Dev needs to be restarted to read it.

1. In your terminal where `npx netlify dev` is running:
   - Press `Ctrl + C` to stop the server
2. Wait for it to fully stop
3. Run again: `npx netlify dev`
4. Wait for the message: "Server now ready on http://localhost:8888"

### Step 2: Test the Connection

1. Open your browser and go to: `http://localhost:8888/test-db.html`
2. You should see a test page with buttons
3. Click "Test API Health" - it should show ✅ if the API is working
4. Click "Test Sync (GET)" - it should connect to MongoDB

### Step 3: Verify Data Sync

1. Open the app in Browser 1 (e.g., Chrome): `http://localhost:8888`
2. Add a test patient
3. Open the app in Browser 2 (e.g., Firefox): `http://localhost:8888`
4. Refresh the page - you should see the same patient!

## 🔍 Debugging

### If API Health Check Fails:

**Check 1: Is the server running?**
```powershell
# In a new terminal
curl http://localhost:8888/.netlify/functions/api/health
```

**Check 2: Is MongoDB URI set?**
```powershell
# Check if .env file exists
Get-Content .env
```

You should see:
```
MONGODB_URI=mongodb+srv://suragsunil2023_db_user:RlrH7H0DGAUiTNF4@labdb.qjokknr.mongodb.net/?appName=Labdb
```

**Check 3: Check the terminal logs**
Look for these messages when the server starts:
- ✅ "MongoDB Connected" - Good!
- ⚠️ "MONGODB_URI is not defined" - Restart server
- ❌ "MongoDB connection error" - Check your connection string

### If Data Still Not Syncing:

1. Open Browser Console (F12)
2. Look for these messages:
   - ✅ "Attempting to sync with server..."
   - ✅ "Synced with server successfully"
   - ❌ "Server sync failed" - Check API endpoint

3. Check Network Tab:
   - Look for requests to `/.netlify/functions/api/sync`
   - Status should be 200 (green)
   - If 404 or 500, server needs restart

## 📱 For Netlify Deployment

Once local testing works, deploy to Netlify:

1. Go to Netlify Dashboard → Your Site → Site configuration → Environment variables
2. Add variable:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://suragsunil2023_db_user:RlrH7H0DGAUiTNF4@labdb.qjokknr.mongodb.net/?appName=Labdb`
3. Redeploy your site
4. Test from different devices!

## 🎯 Expected Behavior

**Before Fix:**
- ❌ Data only in one browser
- ❌ Lost when clearing cache
- ❌ Not available on other devices

**After Fix:**
- ✅ Data synced across all browsers
- ✅ Persists even after clearing cache
- ✅ Available on all devices (PC, phone, tablet)
- ✅ Real-time updates when you add/edit data

## 📞 Still Having Issues?

Run this diagnostic command and share the output:

```powershell
# Check environment
Get-Content .env

# Check if mongoose is installed
npm list mongoose

# Test API directly
curl http://localhost:8888/.netlify/functions/api/health
```
