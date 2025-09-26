// examples/secure-api-usage.js
// Example of how to use the newly secured APIs from your frontend

import { auth } from '../lib/firebase';

/**
 * Helper function to make authenticated API calls
 */
async function makeAuthenticatedRequest(endpoint, data, method = 'POST') {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be logged in to make this request');
  }
  
  // Get Firebase ID token
  const token = await user.getIdToken();
  
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
}

/**
 * Example 1: Create a new student (Admin only)
 */
export async function createStudent(studentData) {
  try {
    const result = await makeAuthenticatedRequest('/api/create-student', {
      email: studentData.email,
      name: studentData.name,
      classId: studentData.classId,
      regdNo: studentData.regdNo,
      fatherName: studentData.fatherName,
      address: studentData.address,
      phones: studentData.phones,
      education: studentData.education,
      fees: studentData.fees,
      courseTitle: studentData.courseTitle
    });
    
    console.log('Student created successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to create student:', error.message);
    throw error;
  }
}

/**
 * Example 2: Update student fee (Admin only)
 */
export async function updateStudentFee(studentId, amount, paymentMethod = 'online') {
  try {
    const result = await makeAuthenticatedRequest('/api/update-student-fee', {
      id: studentId,
      addAmount: amount,
      paymentMethod: paymentMethod
    });
    
    console.log('Fee updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to update fee:', error.message);
    throw error;
  }
}

/**
 * Example 3: Verify payment (Authenticated users)
 */
export async function verifyPayment(paymentData) {
  try {
    const result = await makeAuthenticatedRequest('/api/verify-payment', {
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_signature: paymentData.razorpay_signature,
      amount: paymentData.amount,
      studentId: paymentData.studentId
    });
    
    console.log('Payment verified successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to verify payment:', error.message);
    throw error;
  }
}

/**
 * Example 4: Compile code (Public with rate limiting)
 */
export async function compileCode(language, sourceCode, stdin = '') {
  try {
    const result = await makeAuthenticatedRequest('/api/compile', {
      language: language,
      source: sourceCode,
      stdin: stdin
    });
    
    console.log('Code compiled successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to compile code:', error.message);
    throw error;
  }
}

/**
 * Example React component usage
 */
export function StudentCreationForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    classId: '',
    regdNo: '',
    fatherName: '',
    address: '',
    phones: '',
    education: '',
    fees: 0,
    courseTitle: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await createStudent(formData);
      alert('Student created successfully!');
      // Reset form or redirect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields here */}
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        required
      />
      
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Full Name"
        required
      />
      
      {/* More form fields... */}
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}

/**
 * Example: Check if user is admin before showing admin features
 */
export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        // Check user role in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  return { isAdmin, loading };
}

/**
 * Example: Admin-only component
 */
export function AdminPanel() {
  const { isAdmin, loading } = useAdminCheck();
  
  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access denied. Admin privileges required.</div>;
  
  return (
    <div>
      <h2>Admin Panel</h2>
      <StudentCreationForm />
      {/* Other admin features */}
    </div>
  );
}
