# 🚀 HEALit Lab - Complete Deployment Guide

## 📋 PREREQUISITES
- Git installed on your computer
- GitHub account (free)
- Netlify account (free)
- Firebase account (free)

---

## 🔥 STEP 1: SETUP FIREBASE (DATABASE & AUTH)

### 1.1 Create Firebase Project
```
1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Enter project name: "healit-lab-production"
4. Disable Google Analytics (optional)
5. Click "Create Project"
```

### 1.2 Enable Firestore Database
```
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location: asia-south1 (Mumbai) - closest to India
5. Click "Enable"
```

### 1.3 Setup Firestore Security Rules
```
Go to Rules tab and paste:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

Click "Publish"
```

### 1.4 Enable Authentication
```
1. Go to "Authentication" > "Sign-in method"
2. Enable "Email/Password"
3. Click "Save"
```

### 1.5 Enable Firebase Storage
```
1. Go to "Storage"
2. Click "Get Started"
3. Use production rules
4. Choose same location as Firestore
5. Click "Done"
```

### 1.6 Get Firebase Config
```
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "</>" (Web app icon)
4. Register app: "HEALit Lab Web"
5. Copy the config values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
   - measurementId

6. Paste these into .env.production file
```

---

## 📦 STEP 2: PREPARE CODE FOR PRODUCTION

### 2.1 Update .env.production
```bash
# Open .env.production and fill in your Firebase values
VITE_FIREBASE_API_KEY=AIzaSy...your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=healit-lab-production.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=healit-lab-production
VITE_FIREBASE_STORAGE_BUCKET=healit-lab-production.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2.2 Test Production Build Locally
```bash
# Build the app
npm run build

# Preview the production build
npm run preview

# Visit http://localhost:4173 to test
# Make sure everything works!
```

---

## 🌐 STEP 3: DEPLOY TO NETLIFY

### 3.1 Create GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready"

# Create new repo on GitHub:
# 1. Go to https://github.com/new
# 2. Name: healit-lab-app
# 3. Keep it Private (recommended for hospital data)
# 4. Don't initialize with README
# 5. Click "Create repository"

# Link local to GitHub
git remote add origin https://github.com/YOUR_USERNAME/healit-lab-app.git

# Push code
git branch -M main
git push -u origin main
```

### 3.2 Deploy on Netlify
```
1. Go to https://app.netlify.com/
2. Click "Add new site" > "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access your repos
5. Select "healit-lab-app" repository
6. Build settings (auto-detected from netlify.toml):
   - Build command: npm run build
   - Publish directory: dist
7. Click "Deploy site"
```

### 3.3 Add Environment Variables to Netlify
```
1. Go to Site settings > Environment variables
2. Add each variable from .env.production:
   
   Key: VITE_FIREBASE_API_KEY
   Value: AIzaSy...your_actual_key
   
   Key: VITE_FIREBASE_AUTH_DOMAIN
   Value: healit-lab-production.firebaseapp.com
   
   (Repeat for all VITE_* variables)

3. Click "Save"
4. Trigger redeploy: Deploys > Trigger deploy > Deploy site
```

### 3.4 Setup Custom Domain (Optional)
```
1. In Netlify, go to Domain settings
2. Click "Add custom domain"
3. Enter: healitlab.com (or your domain)
4. Follow DNS configuration steps
5. Netlify provides free SSL certificate automatically!
```

---

## 👤 STEP 4: CREATE ADMIN USER

### 4.1 Register First Admin
```
1. Visit your deployed site: https://your-site.netlify.app
2. You'll see login page
3. First user automatically becomes admin
4. Register with:
   - Email: admin@healitlab.com
   - Password: (strong password)
   - Full Name: Admin User
   - Role: Will auto-set to admin
```

### 4.2 Add Additional Staff (Optional)
```
1. Login as admin
2. Go to Settings > User Management
3. Add staff members with their emails
4. They'll receive invite links
```

---

## 🔒 STEP 5: SECURITY SETUP

### 5.1 Firebase Security Rules (IMPORTANT!)
```javascript
// Firestore Rules - Update in Firebase Console
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isAdmin() || request.auth.uid == userId;
    }
    
    // Patients collection
    match /patients/{patientId} {
      allow read, write: if isSignedIn();
    }
    
    // Visits collection
    match /visits/{visitId} {
      allow read, write: if isSignedIn();
    }
    
    // Settings (admin only)
    match /settings/{document=**} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Profiles (admin only)
    match /profiles/{document=**} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

### 5.2 Storage Security Rules
```javascript
// Storage Rules - Update in Firebase Console
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📊 STEP 6: DATA MIGRATION (LocalStorage to Firebase)

### 6.1 Option A: Fresh Start (Recommended for New Users)
```
Just use the app! Firebase is already configured.
Start adding patients directly.
```

### 6.2 Option B: Migrate Existing Data
```javascript
// Run this in browser console on your deployed site
// After logging in as admin

async function migrateToFirebase() {
  const db = firebase.firestore();
  
  // Get localStorage data
  const patients = JSON.parse(localStorage.getItem('PATIENTS') || '[]');
  const visits = JSON.parse(localStorage.getItem('VISITS') || '[]');
  const profiles = JSON.parse(localStorage.getItem('PROFILES') || '[]');
  
  // Migrate patients
  for (const patient of patients) {
    await db.collection('patients').doc(patient.patientId).set(patient);
  }
  
  // Migrate visits
  for (const visit of visits) {
    await db.collection('visits').doc(visit.visitId).set(visit);
  }
  
  // Migrate profiles
  for (const profile of profiles) {
    await db.collection('profiles').doc(profile.profileId).set(profile);
  }
  
  console.log('✅ Migration complete!');
}

// Run migration
migrateToFirebase();
```

---

## 🔄 STEP 7: CONTINUOUS DEPLOYMENT

### Automatic Deploys
```
Every time you push to GitHub main branch:
1. Netlify automatically detects changes
2. Runs npm run build
3. Deploys new version
4. Usually takes 1-2 minutes

To deploy updates:
git add .
git commit -m "feat: your changes"
git push origin main
```

---

## 📱 STEP 8: PWA INSTALLATION (Already Configured!)

### Desktop Installation
```
1. Visit your site in Chrome/Edge
2. Look for install icon (⊕) in address bar
3. Click "Install HEALit Lab"
4. App opens in standalone window
```

### Mobile Installation (Android)
```
1. Open site in Chrome
2. Tap menu (⋮)
3. Tap "Add to Home Screen"
4. Tap "Install"
```

### Mobile Installation (iOS)
```
1. Open site in Safari
2. Tap Share button (□↑)
3. Tap "Add to Home Screen"
4. Tap "Add"
```

---

## 💰 FREE TIER LIMITS

### Netlify Free Plan
```
✅ 100GB bandwidth/month
✅ 300 build minutes/month
✅ Unlimited sites
✅ Free SSL certificates
✅ Custom domains
✅ Automatic deploys from Git

Enough for: 1000+ daily visitors
```

### Firebase Free Plan (Spark)
```
✅ 1GB Firestore storage
✅ 50,000 reads/day
✅ 20,000 writes/day
✅ 20,000 deletes/day
✅ 5GB Storage
✅ Unlimited Authentication users

Enough for: 200-300 patients/day easily
```

### Upgrade if Needed
```
If you exceed free tier:
- Netlify Pro: $19/month
- Firebase Blaze: Pay-as-you-go (still very cheap)
```

---

## 🛠️ TROUBLESHOOTING

### Issue: Build Fails
```bash
# Check build logs in Netlify
# Common fixes:

# 1. Clear cache and rebuild
netlify build --clear-cache

# 2. Check Node version (should be 18+)
# Add to netlify.toml:
[build.environment]
  NODE_VERSION = "18"
```

### Issue: Environment Variables Not Working
```
1. Check spelling (must start with VITE_)
2. Redeploy after adding variables
3. Hard refresh browser (Ctrl+Shift+R)
```

### Issue: Firebase Connection Fails
```
1. Check Firebase config in .env.production
2. Verify Firestore is enabled
3. Check security rules
4. Ensure domain is authorized in Firebase Console:
   Authentication > Settings > Authorized domains
   Add: your-site.netlify.app
```

### Issue: 404 on Page Refresh
```
Make sure netlify.toml redirects are configured (already done!)
```

---

## 📈 MONITORING & MAINTENANCE

### Netlify Dashboard
```
Monitor:
- Deploy status
- Bandwidth usage
- Error logs
- Performance metrics

Access: https://app.netlify.com/
```

### Firebase Console
```
Monitor:
- Database reads/writes
- Storage usage
- Authentication users
- Performance

Access: https://console.firebase.google.com/
```

### Backups
```
Firestore automatic backups:
1. Go to Firestore > Data
2. Click "Export"
3. Select collections
4. Export to Cloud Storage
5. Schedule weekly backups
```

---

## 🎯 QUICK COMMAND REFERENCE

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build

# Git & Deploy
git add .                      # Stage changes
git commit -m "message"        # Commit
git push origin main           # Deploy to Netlify (auto)

# Check Status
git status                     # Check git status
npm run build                  # Test build locally

# Clean Install (if issues)
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Firebase project created
- [ ] Firestore enabled with security rules
- [ ] Authentication enabled
- [ ] Storage enabled
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify site deployed
- [ ] Environment variables added to Netlify
- [ ] Custom domain configured (optional)
- [ ] Admin user created
- [ ] PWA installable on devices
- [ ] Firebase security rules applied
- [ ] Backups scheduled
- [ ] Team members added

---

## 🎉 CONGRATULATIONS!

Your HEALit Lab app is now live at:
**https://your-site.netlify.app**

**Free for 3 years?** YES!
- Netlify free tier: Forever
- Firebase free tier: Forever (with limits)
- Combined: Perfect for small-medium labs

**For 4 systems only?** 
Just install the PWA on 4 computers/tablets!
Each user logs in with their credentials.

**Questions?**
- Netlify Docs: https://docs.netlify.com/
- Firebase Docs: https://firebase.google.com/docs
- React Docs: https://react.dev/

---

## 🔐 IMPORTANT SECURITY NOTES

1. **Never commit .env.production to GitHub** (already in .gitignore)
2. **Use strong passwords** for admin accounts
3. **Enable 2FA** on Firebase and Netlify accounts
4. **Review Firebase security rules** regularly
5. **Monitor usage** to prevent unexpected charges
6. **Backup data** weekly from Firestore
7. **Keep dependencies updated** for security patches

---

**Ready to go live! 🚀**
