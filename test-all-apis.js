// test-all-apis.js - Test all admin APIs
// Run this in your browser console to test all APIs

import { auth } from './lib/firebase';

async function testAllAPIs() {
  console.log('🧪 TESTING ALL ADMIN APIS');
  console.log('==========================');
  
  const user = auth.currentUser;
  if (!user) {
    console.log('❌ Please log in first');
    return;
  }
  
  console.log('✅ User logged in:', user.email);
  
  try {
    const token = await user.getIdToken(true);
    console.log('✅ Token generated');
    
    // Test 1: Test Auth API
    console.log('\n1. Testing /api/test-auth...');
    try {
      const response1 = await fetch('/api/test-auth', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data1 = await response1.json();
      console.log('   Status:', response1.status, response1.ok ? '✅' : '❌');
      console.log('   Response:', data1);
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }
    
    // Test 2: Razorpay Order API
    console.log('\n2. Testing /api/payments/razorpay/order...');
    try {
      const response2 = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: 10000,
          receipt: 'test-receipt-123'
        })
      });
      const data2 = await response2.json();
      console.log('   Status:', response2.status, response2.ok ? '✅' : '❌');
      console.log('   Response:', data2);
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }
    
    // Test 3: Update Student Fee API (without actual student ID)
    console.log('\n3. Testing /api/update-student-fee...');
    try {
      const response3 = await fetch('/api/update-student-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: 'test-student-id',
          addAmount: 1000,
          paymentMethod: 'cash'
        })
      });
      const data3 = await response3.json();
      console.log('   Status:', response3.status);
      console.log('   Response:', data3);
      if (response3.status === 404) {
        console.log('   ✅ Authentication working (404 expected for non-existent student)');
      } else if (response3.ok) {
        console.log('   ✅ API working');
      } else {
        console.log('   ❌ API failed');
      }
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }
    
    // Test 4: Create Student API (without actual data)
    console.log('\n4. Testing /api/create-student...');
    try {
      const response4 = await fetch('/api/create-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test Student',
          classId: 'test-class',
          regdNo: 'TEST001'
        })
      });
      const data4 = await response4.json();
      console.log('   Status:', response4.status);
      console.log('   Response:', data4);
      if (response4.status === 400) {
        console.log('   ✅ Authentication working (400 expected for validation)');
      } else if (response4.ok) {
        console.log('   ✅ API working');
      } else {
        console.log('   ❌ API failed');
      }
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }
    
    // Test 5: Delete Student API (without actual student ID)
    console.log('\n5. Testing /api/delete-student...');
    try {
      const response5 = await fetch('/api/delete-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: 'test-student-id'
        })
      });
      const data5 = await response5.json();
      console.log('   Status:', response5.status);
      console.log('   Response:', data5);
      if (response5.status === 404) {
        console.log('   ✅ Authentication working (404 expected for non-existent student)');
      } else if (response5.ok) {
        console.log('   ✅ API working');
      } else {
        console.log('   ❌ API failed');
      }
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }
    
    console.log('\n==========================');
    console.log('🎯 SUMMARY:');
    console.log('- If you see "Authentication working" messages, your auth is fixed!');
    console.log('- If you see 401/403 errors, there are still auth issues');
    console.log('- Check server console for detailed logs');
    
  } catch (error) {
    console.log('❌ Token generation failed:', error.message);
  }
}

// Run the test
testAllAPIs();
