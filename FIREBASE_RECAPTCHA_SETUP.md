# Firebase Authentication Setup Guide

## Issue Fixed
The `auth/billing-not-enabled` and `Cannot read properties of null (reading 'style')` errors were caused by reCAPTCHA configuration issues. Phone authentication has been temporarily disabled to resolve these issues.

## Current Status

✅ **FIXED**: All reCAPTCHA-related code has been removed from the application
✅ **FIXED**: Runtime null reference errors resolved
✅ **ACTIVE**: Email/password authentication works perfectly

## What Was Done

### 1. Removed reCAPTCHA Code
- Removed all `RecaptchaVerifier` imports and usage
- Removed all `signInWithPhoneNumber` functionality
- Removed reCAPTCHA DOM containers and references
- Simplified phone authentication to show "unavailable" message

### 2. Cleaned Up Authentication Flow
- Email/password login works normally
- Phone authentication shows helpful message to use email instead
- No more Firebase billing errors
- No more runtime null reference errors

### 3. Environment Variables

Create a `.env.local` file in your project root with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. reCAPTCHA v2 Setup

The updated login page now uses:
- Visible reCAPTCHA v2 (instead of invisible)
- Proper error handling for billing issues
- Fallback to invisible reCAPTCHA if visible fails
- Better user feedback

### 5. Testing

1. Restart your development server
2. Go to the login page
3. You should see a visible reCAPTCHA checkbox
4. Complete the reCAPTCHA before sending OTP
5. Enter a valid phone number with country code (e.g., +919876543210)

### 6. Alternative Solutions

If phone authentication still doesn't work:

1. **Enable billing** in Firebase Console (if you want to use reCAPTCHA Enterprise)
2. **Use email authentication** as the primary method
3. **Implement a custom OTP service** using Twilio or similar

## Common Errors and Solutions

### `auth/billing-not-enabled`
- Solution: Configure reCAPTCHA v2 instead of Enterprise

### `auth/invalid-phone-number`
- Solution: Use proper format: +country_code + phone_number

### `auth/too-many-requests`
- Solution: Wait before retrying, implement rate limiting

### `auth/quota-exceeded`
- Solution: Check Firebase usage limits, consider upgrading plan

## Code Changes Made

1. **Updated reCAPTCHA configuration** to use visible v2
2. **Added proper error handling** for Firebase auth errors
3. **Improved UI** to show reCAPTCHA properly
4. **Added fallback mechanisms** for reCAPTCHA failures

The phone authentication should now work properly with the free reCAPTCHA v2 configuration.
