# Database Setup Guide

To enable data persistence across devices, you need to connect your application to a MongoDB database.

## Step 1: Create a MongoDB Atlas Account (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Sign up for a free account.
3. Create a new **Cluster** (the free tier M0 Sandbox is sufficient).
4. Create a **Database User** (username and password). Remember these!
5. Allow access from **Anywhere** (0.0.0.0/0) in the Network Access tab.

## Step 2: Get Connection String
1. Click **Connect** on your cluster.
2. Choose **Drivers** (Node.js).
3. Copy the connection string. It looks like:
   `mongodb+srv://suragsunil2023_db_user:RlrH7H0DGAUiTNF4@labdb.qjokknr.mongodb.net/?appName=Labdb`
4. Replace `<username>` and `<password>` with the user you created in Step 1.

## Step 3: Configure Environment Variables

### For Local Development
1. Create or edit the `.env` file in the root of your project.
2. Add the following line:
   ```
   MONGODB_URI=your_connection_string_here
   ```

### For Netlify Deployment
1. Go to your Netlify Dashboard.
2. Select your site.
3. Go to **Site configuration** > **Environment variables**.
4. Add a new variable:
   - Key: `MONGODB_URI`
   - Value: `your_connection_string_here`
5. Redeploy your site.

## How it Works
- The application now attempts to sync data from the database when it loads.
- Any changes you make (adding patients, results, etc.) are saved to both your local browser and the database.
- This ensures that if you open the app on another device, you will see the same data.

**Note:** If you do not provide a `MONGODB_URI`, the application will continue to work using only local browser storage (data will not sync).
