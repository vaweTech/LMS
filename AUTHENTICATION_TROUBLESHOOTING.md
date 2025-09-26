# 🔧 Authentication Troubleshooting Guide

## ❌ **THE CURRENT ERROR**
```
Invalid or expired token
at handlePayFee (app\Admin\StudentInfo\page.jsx:231:31)
```

## 🔍 **ROOT CAUSE ANALYSIS**

The error is happening because:
1. **Razorpay order API** now requires admin authentication
2. **Token verification** is failing in the server-side middleware
3. **User role** might not be set to "admin" in Firestore

## ✅ **IMMEDIATE FIXES APPLIED**

### 1. **Enhanced Error Messages**
- ✅ Better debugging in authentication middleware
- ✅ Specific error codes and messages
- ✅ Detailed console logging

### 2. **Improved API Security**
- ✅ Razorpay order API now requires admin authentication
- ✅ Better token validation
- ✅ Enhanced error handling

## 🚨 **STEP-BY-STEP TROUBLESHOOTING**

### **Step 1: Check Your Login Status**
```javascript
// Run this in browser console:
import { auth } from './lib/firebase';
console.log('Current user:', auth.currentUser);
```

**Expected Result:** Should show your user object with email and UID

### **Step 2: Verify Admin Role in Firestore**
```javascript
// Run this in browser console:
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './lib/firebase';

const user = auth.currentUser;
const userDocRef = doc(db, 'users', user.uid);
const userDoc = await getDoc(userDocRef);

if (userDoc.exists()) {
  const userData = userDoc.data();
  console.log('User role:', userData.role);
  
  if (userData.role !== 'admin') {
    console.log('❌ PROBLEM: You are not an admin!');
    console.log('Your role:', userData.role);
  } else {
    console.log('✅ You are an admin');
  }
} else {
  console.log('❌ PROBLEM: No user document found in Firestore');
}
```

### **Step 3: Test Token Generation**
```javascript
// Run this in browser console:
import { auth } from './lib/firebase';

const user = auth.currentUser;
try {
  const token = await user.getIdToken(true); // Force refresh
  console.log('✅ Token generated successfully');
  console.log('Token preview:', token.substring(0, 20) + '...');
} catch (error) {
  console.log('❌ Token generation failed:', error.message);
}
```

### **Step 4: Test API Call**
```javascript
// Run this in browser console:
import { makeAuthenticatedRequest } from './lib/authUtils';

try {
  const response = await makeAuthenticatedRequest('/api/admin-test', {
    method: 'GET'
  });
  
  if (response.ok) {
    console.log('✅ API call successful');
  } else {
    const error = await response.json();
    console.log('❌ API call failed:', error);
  }
} catch (error) {
  console.log('❌ API call exception:', error.message);
}
```

## 🛠️ **COMMON SOLUTIONS**

### **Solution 1: Fix Admin Role**
If your role is not "admin":

1. **Go to Firebase Console**
2. **Navigate to Firestore Database**
3. **Find your user document in the "users" collection**
4. **Update the document to have:**
   ```json
   {
     "email": "your-email@example.com",
     "role": "admin",
     "uid": "your-firebase-uid"
   }
   ```

### **Solution 2: Create Missing User Document**
If no user document exists:

1. **Go to Firebase Console**
2. **Navigate to Firestore Database**
3. **Create a new document in "users" collection**
4. **Use your Firebase UID as the document ID**
5. **Add these fields:**
   ```json
   {
     "email": "your-email@example.com",
     "role": "admin",
     "uid": "your-firebase-uid"
   }
   ```

### **Solution 3: Clear Browser Data**
If tokens are corrupted:

1. **Open Developer Tools (F12)**
2. **Go to Application tab**
3. **Clear Local Storage**
4. **Clear Session Storage**
5. **Refresh page and log in again**

### **Solution 4: Check Environment Variables**
Make sure your `.env.local` has all Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🔍 **DEBUGGING TOOLS**

### **Quick Debug Script**
Run this in your browser console:

```javascript
// Copy and paste this entire script
import { auth } from './lib/firebase';
import { makeAuthenticatedRequest } from './lib/authUtils';

async function quickDebug() {
  console.log('🔍 Quick Authentication Debug');
  
  const user = auth.currentUser;
  if (!user) {
    console.log('❌ No user logged in');
    return;
  }
  
  console.log('✅ User logged in:', user.email);
  
  try {
    const token = await user.getIdToken();
    console.log('✅ Token available');
    
    const response = await makeAuthenticatedRequest('/api/admin-test');
    if (response.ok) {
      console.log('✅ API access working');
    } else {
      const error = await response.json();
      console.log('❌ API error:', error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

quickDebug();
```

## 📊 **ERROR CODES REFERENCE**

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/id-token-expired` | Token expired | Refresh page and log in again |
| `auth/invalid-id-token` | Invalid token | Clear browser data and log in |
| `auth/user-disabled` | Account disabled | Contact administrator |
| `auth/user-not-found` | User not in Firestore | Create user document |
| `403` | Not admin | Update role to "admin" in Firestore |

## 🎯 **EXPECTED BEHAVIOR AFTER FIX**

1. **Login as admin** ✅
2. **Navigate to Student Info page** ✅
3. **Click "Cash Payment"** ✅
4. **Enter amount and confirm** ✅
5. **Payment processes successfully** ✅
6. **No "Invalid or expired token" errors** ✅

## 🚀 **NEXT STEPS**

1. **Run the debugging script** above
2. **Check your admin role** in Firestore
3. **Test the cash payment** again
4. **Check server logs** for detailed error messages

**The enhanced error messages will now tell you exactly what's wrong!** 🎯
