import { db } from './lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Test function to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test 1: Add a test document
    const testDoc = {
      testName: 'Firebase Connection Test',
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
    const docRef = await addDoc(collection(db, 'testCollection'), testDoc);
    console.log('✅ Test document added with ID:', docRef.id);
    
    // Test 2: Read the document back
    const q = query(collection(db, 'testCollection'), where('testName', '==', 'Firebase Connection Test'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('✅ Successfully read from Firestore!');
      querySnapshot.forEach((doc) => {
        console.log('Document data:', doc.data());
      });
    } else {
      console.log('⚠️ No documents found');
    }
    
    console.log('🎉 Firebase connection test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};

// Run the test
testFirebaseConnection();