# Just Think It — गडचिरोली न्यूज़ वेबसाइट

## Step 1 — Firebase config भरें
`src/firebase.js` खोलें और Firebase Console से मिला हुआ config paste करें
(Project Settings → General → Your apps → Web app → SDK setup and configuration).

## Step 2 — Firestore की Security Rules सेट करें
Firebase Console → Firestore Database → **Rules** tab में जाकर यह paste करें और **Publish** दबाएं
(वरना 30 दिन बाद test mode अपने आप बंद हो जाएगा):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/{document} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> ⚠️ नोट: यह website का admin login सिर्फ frontend पर एक password-check है (सुरक्षा की दृष्टि से बुनियादी है)।
> यह छोटी community news site के लिए ठीक है, लेकिन कोई तकनीकी व्यक्ति चाहे तो सीधे database में लिख सकता है।
> ज़्यादा सुरक्षा चाहिए तो आगे चलकर Firebase Authentication जोड़ा जा सकता है — बताइए तो मैं वो भी कर दूंगा।

## Step 3 — GitHub पर push करें
1. github.com पर नया repository बनाएं (नाम: `justthinkit`)
2. इस पूरे folder को उसमें push करें:
```
git init
git add .
git commit -m "Just Think It website"
git branch -M main
git remote add origin https://github.com/<आपका-username>/justthinkit.git
git push -u origin main
```

## Step 4 — Vercel पर Deploy करें
1. vercel.com पर GitHub account से login करें
2. **"Add New Project"** → अपनी `justthinkit` repository चुनें → **Deploy**
3. 1-2 मिनट में साइट live हो जाएगी (जैसे `justthinkit.vercel.app`)

## Step 5 — अपना Domain जोड़ें
1. Vercel project → **Settings → Domains** → अपना domain (जैसे `justthinkit.com`) डालें
2. Vercel जो दो DNS values (A record / CNAME) देगा, उन्हें अपने domain provider (Hostinger/GoDaddy) के DNS settings में जाकर डालें
3. कुछ घंटों में domain live हो जाएगा

## Admin Panel
वेबसाइट पर `Admin` बटन दबाकर password डालें: `gadchiroli2026`
(चाहें तो `src/App.jsx` में `ADMIN_PASSWORD` बदल सकते हैं)

## Local Testing (optional)
```
npm install
npm run dev
```
