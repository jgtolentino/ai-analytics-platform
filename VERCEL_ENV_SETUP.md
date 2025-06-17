# 🔧 Vercel Environment Variables Setup Guide

## 🚨 **Current Issue**
The frontend at **https://ai-analytics-platform.vercel.app/** loads but fails with:
```
Uncaught Error: Missing Supabase environment variables
```

## ✅ **Solution Applied**

### 1. **Environment Variables Required**

Add these to **Vercel Project Settings** → **Environment Variables**:

| Variable Name | Value Example | Required | Target |
|---------------|---------------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz.supabase.co` | ✅ Yes | Preview, Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | ✅ Yes | Preview, Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `service-role-key...` | 🟡 Optional | Preview, Production |

### 2. **How to Add in Vercel**

1. Go to **Project Settings** → **Environment Variables**
2. Click **"+ Add"** for each variable
3. **Name**: Enter variable name exactly as shown above
4. **Value**: Enter your Supabase project values
5. **Environments**: Select **Preview** and **Production**
6. **💡 Tip**: Click **"Encrypt"** to hide keys from build logs

### 3. **Get Your Supabase Values**

```bash
# Find your Supabase credentials:
1. Go to https://app.supabase.com/projects
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon/public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - service_role key → SUPABASE_SERVICE_ROLE_KEY (optional)
```

## 🔧 **Code Changes Applied**

### New Files Created:
- **`lib/assertEnv.ts`** - Environment validation with clear errors
- **`lib/supabaseClient.ts`** - Centralized Supabase client  
- **`.env.example`** - Template for required variables

### Updated Files:
- **`src/hooks/useDataWithFallback.ts`** - Uses centralized client

### Error Improvements:
**Before:** Silent white screen  
**After:** Clear error message with setup instructions

## 🚀 **Deployment Steps**

1. **✅ Code fixes pushed** to `v2.1-clean-deployment` branch
2. **⚠️ Add environment variables** in Vercel (see table above)
3. **🔄 Redeploy** from Vercel dashboard
4. **✅ Verify** frontend loads without errors

## 🔍 **Verification Commands**

After adding environment variables and redeploying:

```bash
# Check if site loads without console errors
curl -sSf https://ai-analytics-platform.vercel.app/

# Check if environment is properly configured  
# (Should not see "Missing Supabase environment variables")
```

## 📋 **Checklist**

- [ ] **Add NEXT_PUBLIC_SUPABASE_URL** to Vercel environment
- [ ] **Add NEXT_PUBLIC_SUPABASE_ANON_KEY** to Vercel environment  
- [ ] **Set target environments** to Preview + Production
- [ ] **Encrypt sensitive keys** in Vercel settings
- [ ] **Trigger redeploy** from Vercel dashboard
- [ ] **Verify site loads** without console errors
- [ ] **Test dashboard functionality** with real data

## 🎯 **Expected Result**

✅ **Before Fix:**
- Frontend loads → **Runtime Error: Missing Supabase environment variables**
- White screen or console errors

✅ **After Fix:**
- Frontend loads → **Dashboard with data or graceful fallback**
- Clear error messages if something is misconfigured

---

**Next:** Once environment variables are added in Vercel, the dashboard should load properly with either real Supabase data or fallback mock data.