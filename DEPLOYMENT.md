# Deployment Guide for CraftYourTrip

This guide explains how to deploy CraftYourTrip to production environments. We recommend **Vercel** for the Frontend and **Render** for the Backend, but any modern PaaS will work.

---

## 1. Deploying the Backend (Render)

Render provides a seamless deployment pipeline for Node.js applications.

### Prerequisites
- A GitHub repository containing the `backend/` folder.
- A Render account.
- Your Google Gemini API Key.

### Steps
1. Log in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Fill in the deployment settings:
   - **Name**: `craftyourtrip-api` (or similar)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click on **Advanced** to add Environment Variables:
   - `GEMINI_API_KEY`: (Your actual API key)
   - `PORT`: (Render usually provides this automatically, but setting `5000` is safe)
6. Click **Create Web Service**. 
7. Once the build finishes, Render will provide a URL (e.g., `https://craftyourtrip-api.onrender.com`). **Copy this URL**, you will need it for the frontend.

---

## 2. Deploying the Frontend (Vercel)

Vercel is the optimal hosting platform for Vite/React applications.

### Prerequisites
- The same GitHub repository containing the `frontend/` folder.
- A Vercel account.
- The URL of your successfully deployed backend.

### Steps
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** section:
   - **Root Directory**: Click `Edit` and select `frontend`.
   - **Framework Preset**: Vercel should auto-detect `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://craftyourtrip-api.onrender.com/api` *(Replace with your actual Render URL + `/api`)*
6. Click **Deploy**.
7. Once finished, Vercel will provide your live frontend URL!

---

## 3. Post-Deployment Checks

1. Visit your live Vercel URL.
2. Fill out the Trip Form and hit "Generate".
3. Wait up to 60 seconds (the backend might need to wake up if using Render's free tier).
4. Verify the itinerary is generated and that Dark Mode and Export buttons work flawlessly.

**Congratulations! CraftYourTrip is now live.**
