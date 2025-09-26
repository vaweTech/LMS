# 🔧 Final Debug Guide - Admin Authentication Issue

## ✅ **YOUR FIRESTORE IS CORRECT**
Your user document is properly set up:
```json
{
  "email": "admin@gmail.com",
  "role": "admin"
}
```

## 🔍 **STEP-BY-STEP DEBUGGING**

### **Step 1: Run the Debug Script**
Copy and paste this into your browser console:

```javascript
// Complete debug script
import { auth } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

async function completeDebug() {
  console.log('🔍 COMPLETE AUTHENTICATION DEBUG');
  console.log('================================');
  
  // 1. Check current user
  const user = auth.currentUser;
  console.log('1. Current User:', user ? {
    email: user.email,
    uid: user.uid
  } : '❌ No user');
  
  if (!user) {
    console.log('❌ Please log in first');
    return;
  }
  
  // 2. Check Firestore
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('2. Firestore User:', {
        email: userData.email,
        role: userData.role,
        uid: userData.uid
      });
    } else {
      console.log('2. Firestore: ❌ User document not found');
    }
  } catch (error) {
    console.log('2. Firestore Error:', error.message);
  }
  
  // 3. Test token
  try {
    const token = await user.getIdToken(true);
    console.log('3. Token: ✅ Generated successfully');
    console.log('   Length:', token.length);
  } catch (error) {
    console.log('3. Token: ❌ Failed:', error.message);
  }
  
  // 4. Test simple API
  try {
    const token = await user.getIdToken(true);
    const response = await fetch('/api/test-auth', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('4. Test API Status:', response.status);
    const data = await response.json();
    console.log('4. Test API Response:', data);
  } catch (error) {
    console.log('4. Test API Error:', error.message);
  }
  
  // 5. Test Razorpay API
  try {
    const token = await user.getIdToken(true);
    const response = await fetch('/api/payments/razorpay/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: 10000,
        receipt: 'test-123'
      })
    });
    
    console.log('5. Razorpay API Status:', response.status);
    const data = await response.json();
    console.log('5. Razorpay API Response:', data);
  } catch (error) {
    console.log('5. Razorpay API Error:', error.message);
  }
}

completeDebug();
```

### **Step 2: Check Server Logs**
After running the debug script, check your server console for detailed error messages. You should see logs like:
- `Token verified for user: admin@gmail.com`
- `Admin access granted to: admin@gmail.com`
- Or specific error messages

### **Step 3: Check Network Tab**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try the cash payment again
4. Look for the `/api/payments/razorpay/order` request
5. Check the response status and error message

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: "Missing authorization header"**
**Solution:** The token is not being sent properly
```javascript
// Check if this is working in your frontend:
const token = await user.getIdToken();
console.log('Token being sent:', token ? 'Yes' : 'No');
```

### **Issue 2: "Invalid token format"**
**Solution:** Token is corrupted or empty
```javascript
// Force refresh the token:
const token = await user.getIdToken(true);
```

### **Issue 3: "User not found in system"**
**Solution:** UID mismatch between Firebase Auth and Firestore
```javascript
// Check if UIDs match:
console.log('Firebase Auth UID:', user.uid);
console.log('Firestore UID:', userData.uid);
```

### **Issue 4: "Admin access required"**
**Solution:** Role is not exactly "admin"
```javascript
// Check the exact role value:
console.log('Role value:', JSON.stringify(userData.role));
console.log('Role type:', typeof userData.role);
```

## 🔧 **QUICK FIXES TO TRY**

### **Fix 1: Clear Browser Data**
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### **Fix 2: Force Token Refresh**
```javascript
// Run this in console:
import { auth } from './lib/firebase';
const user = auth.currentUser;
await user.getIdToken(true); // Force refresh
```

### **Fix 3: Check Environment Variables**
Make sure your `.env.local` has:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vawetechnology
```

### **Fix 4: Restart Development Server**
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## 📊 **EXPECTED DEBUG OUTPUT**

If everything is working, you should see:
```
🔍 COMPLETE AUTHENTICATION DEBUG
================================
1. Current User: {email: "admin@gmail.com", uid: "ow76ahrb8uRiFKRkuO9N7msYNV23"}
2. Firestore User: {email: "admin@gmail.com", role: "admin", uid: "ow76ahrb8uRiFKRkuO9N7msYNV23"}
3. Token: ✅ Generated successfully
4. Test API Status: 200
4. Test API Response: {success: true, message: "Authentication successful"}
5. Razorpay API Status: 200
5. Razorpay API Response: {id: "order_...", amount: 10000, ...}
```

## 🎯 **NEXT STEPS**

1. **Run the debug script** above
2. **Check server console** for detailed logs
3. **Check network tab** for API responses
4. **Try the cash payment** again
5. **Report the exact error messages** you see

**The simplified authentication should now work properly!** 🚀
