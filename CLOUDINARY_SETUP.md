# Cloudinary Setup for MCQ Image Upload

## Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Sign up or log in to your account
3. Note down your **Cloud Name** from the dashboard

## Step 2: Create an Upload Preset

1. In your Cloudinary Console, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name**: `mcq-images` (or any name you prefer)
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `mcq-images` (optional, for organization)
5. Click **Save**

## Step 3: Configure Environment Variables

Create or update your `.env.local` file in the LMS directory:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=mcq-images

# Keep your existing Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the Admin MCQ page: `/Admin/mcqs`
3. Click the **"Test Cloudinary"** button
4. Check the console for any errors
5. If successful, you'll see a test image uploaded to Cloudinary

## Step 5: Upload Images

1. Create a new MCQ or edit an existing one
2. Upload images for questions and options
3. The images will be automatically uploaded to Cloudinary
4. The Cloudinary URLs will be stored in your Firebase database

## Troubleshooting

### Issue: "Cloudinary configuration missing"
- Check that your `.env.local` file has the correct Cloudinary variables
- Restart your development server after updating environment variables

### Issue: "Upload request failed"
- Verify your Cloud Name is correct
- Check that your Upload Preset is set to "Unsigned"
- Ensure the Upload Preset name matches your environment variable

### Issue: Images not displaying
- Check that the Cloudinary URLs are being saved in the database
- Verify the URLs are accessible in your browser

## Security Notes

- The upload preset is set to "Unsigned" for client-side uploads
- This is suitable for development and small applications
- For production, consider using signed uploads with server-side validation
- You can set upload restrictions in your Cloudinary upload preset settings

## Benefits of Cloudinary

- ✅ **Automatic image optimization**
- ✅ **Multiple format support**
- ✅ **CDN delivery**
- ✅ **Transformations on-the-fly**
- ✅ **No storage limits (with paid plans)**
- ✅ **Better performance than Firebase Storage for images**
