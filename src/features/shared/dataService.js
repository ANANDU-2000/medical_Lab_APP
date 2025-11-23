// Firebase Data Service - Replaces LocalStorage with Cloud Database
import PROFILES from '../../data/seed/profiles';
import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

const STORAGE_KEYS = {
  TESTS_MASTER: 'healit_tests_master',
  PROFILES: 'healit_profiles',
  PATIENTS: 'healit_patients',
  VISITS: 'healit_visits',
  RESULTS: 'healit_results',
  INVOICES: 'healit_invoices',
  SETTINGS: 'healit_settings',
  AUDIT_LOGS: 'healit_audit_logs'
};

const API_URL = '/.netlify/functions/api';

// Helper for API calls (DISABLED - Using Firebase Firestore instead)
// const apiCall = async (endpoint, method, body) => {
//   try {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: body ? JSON.stringify(body) : undefined
//     });
//     return await res.json();
//   } catch (error) {
//     console.error(`API Call ${method} ${endpoint} failed:`, error);
//     return null;
//   }
// };

// Event dispatcher for real-time updates
const dispatchDataUpdate = (type) => {
  window.dispatchEvent(new CustomEvent('healit-data-update', { detail: { type } }));
};

// Initialize seed data on first load
export const initializeSeedData = async () => {
  try {
    // Check if Firebase data exists, if not, seed it
    const profilesRef = collection(db, 'profiles');
    const profilesSnapshot = await getDocs(profilesRef);
    
    if (profilesSnapshot.empty) {
      console.log('Seeding Firebase with initial data...');
      
      // Seed profiles
      for (const profile of PROFILES) {
        const profileRef = doc(db, 'profiles', profile.profileId);
        await setDoc(profileRef, profile);
      }
      
      // Seed tests master
      const testMap = new Map();
      PROFILES.forEach(profile => {
        if (profile.tests && Array.isArray(profile.tests)) {
          profile.tests.forEach(test => {
            if (!testMap.has(test.testId)) {
              testMap.set(test.testId, {
                testId: test.testId,
                name: test.name,
                description: test.description || '',
                code: test.testId,
                unit: test.unit || '',
                bioReference: test.bioReference || '',
                refLow: null,
                refHigh: null,
                refText: test.bioReference || '',
                inputType: 'number',
                dropdownOptions: [],
                price: test.price || 0,
                category: test.testId.match(/^([A-Z]+)/)?.[1] || 'General',
                active: true,
                createdAt: new Date().toISOString()
              });
            }
          });
        }
      });
      
      const testsMaster = Array.from(testMap.values());
      for (const test of testsMaster) {
        const testRef = doc(db, 'testsMaster', test.testId);
        await setDoc(testRef, test);
      }
      
      // Seed default settings
      const settingsRef = doc(db, 'settings', 'labSettings');
      const defaultSettings = {
        allowStaffInlineCreate: false,
        allowStaffEditPrice: false,
        labName: 'HEALit Med Laboratories',
        labAddress: 'Kunnathpeedika Centre',
        labPhone: '7356865161',
        labEmail: 'info@healitlab.com',
        lastUpdated: new Date().toISOString()
      };
      await setDoc(settingsRef, defaultSettings);
      
      console.log('Firebase seeding complete!');
    } else {
      console.log('Firebase data already exists');
    }
    
    // Update local version
    const currentVersion = '2.0';
    localStorage.setItem('healit_data_version', currentVersion);
    
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
    
    // Fallback to local seed data logic...
    const currentVersion = '2.0';
    const storedVersion = localStorage.getItem('healit_data_version');

    if (storedVersion !== currentVersion) {
      console.log('Data structure updated, reloading profiles...');
      localStorage.removeItem(STORAGE_KEYS.PROFILES);
      localStorage.removeItem(STORAGE_KEYS.TESTS_MASTER);
      localStorage.setItem('healit_data_version', currentVersion);
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(PROFILES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.TESTS_MASTER)) {
      const testMap = new Map();
      PROFILES.forEach(profile => {
        if (profile.tests && Array.isArray(profile.tests)) {
          profile.tests.forEach(test => {
            if (!testMap.has(test.testId)) {
              testMap.set(test.testId, {
                testId: test.testId,
                name: test.name,
                description: test.description || '',
                code: test.testId,
                unit: test.unit || '',
                bioReference: test.bioReference || '',
                refLow: null,
                refHigh: null,
                refText: test.bioReference || '',
                inputType: 'number',
                dropdownOptions: [],
                price: test.price || 0,
                category: test.testId.match(/^([A-Z]+)/)?.[1] || 'General',
                active: true,
                createdAt: new Date().toISOString()
              });
            }
          });
        }
      });

      const testsMaster = Array.from(testMap.values());
      localStorage.setItem(STORAGE_KEYS.TESTS_MASTER, JSON.stringify(testsMaster));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      const defaultSettings = {
        allowStaffInlineCreate: false,
        allowStaffEditPrice: false,
        labName: 'HEALit Med Laboratories',
        labAddress: 'Kunnathpeedika Centre',
        labPhone: '7356865161',
        labEmail: 'info@healitlab.com'
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
  }
};;

// Clear all data and start fresh
export const clearAllData = async () => {
  try {
    // Clear Firebase collections
    const collections = ['patients', 'visits', 'results', 'invoices', 'auditLogs'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
    }
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.VISITS);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.TESTS_MASTER);
    localStorage.removeItem('healit_financial_expenses');
    localStorage.removeItem('healit_financial_categories');
    localStorage.removeItem('healit_financial_reminders');
    localStorage.removeItem('healit_data_version');

    await initializeSeedData();
    dispatchDataUpdate('all');
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    // Fallback to localStorage clear
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.VISITS);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.TESTS_MASTER);
    localStorage.removeItem('healit_financial_expenses');
    localStorage.removeItem('healit_financial_categories');
    localStorage.removeItem('healit_financial_reminders');
    localStorage.removeItem('healit_data_version');

    initializeSeedData();
    dispatchDataUpdate('all');
    return true;
  }
};

// Test Master Operations
export const getTestsMaster = async (searchTerm = '') => {
  try {
    const testsRef = collection(db, 'testsMaster');
    const testsSnapshot = await getDocs(testsRef);
    let tests = [];
    
    testsSnapshot.forEach((doc) => {
      tests.push({ id: doc.id, ...doc.data() });
    });
    
    if (!searchTerm) return tests.filter(t => t.active);
    
    const term = searchTerm.toLowerCase();
    return tests.filter(t =>
      t.active && (
        t.name.toLowerCase().includes(term) ||
        t.code.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      )
    );
  } catch (error) {
    console.error('Error fetching tests master:', error);
    // Fallback to localStorage
    const tests = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS_MASTER) || '[]');
    if (!searchTerm) return tests.filter(t => t.active);
    
    const term = searchTerm.toLowerCase();
    return tests.filter(t =>
      t.active && (
        t.name.toLowerCase().includes(term) ||
        t.code.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      )
    );
  }
};

export const getTestById = async (testId) => {
  try {
    const testRef = doc(db, 'testsMaster', testId);
    const testDoc = await getDoc(testRef);
    
    if (testDoc.exists()) {
      return { id: testDoc.id, ...testDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching test by ID:', error);
    // Fallback to localStorage
    const tests = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS_MASTER) || '[]');
    return tests.find(t => t.testId === testId);
  }
};

export const addTestToMaster = async (test) => {
  try {
    const newTest = {
      ...test,
      testId: `CUSTOM_${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    const testRef = doc(db, 'testsMaster', newTest.testId);
    await setDoc(testRef, newTest);
    
    return { id: newTest.testId, ...newTest };
  } catch (error) {
    console.error('Error adding test to master:', error);
    // Fallback to localStorage
    const tests = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS_MASTER) || '[]');
    const newTest = {
      ...test,
      testId: `CUSTOM_${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString()
    };
    tests.push(newTest);
    localStorage.setItem(STORAGE_KEYS.TESTS_MASTER, JSON.stringify(tests));
    
    return newTest;
  }
};

// Profile Operations
export const getProfiles = async () => {
  try {
    const profilesRef = collection(db, 'profiles');
    const profilesSnapshot = await getDocs(profilesRef);
    let profiles = [];
    
    profilesSnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    
    return profiles.filter(p => p.active);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    // Fallback to localStorage
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    return profiles.filter(p => p.active);
  }
};

export const getProfileById = async (profileId) => {
  try {
    const profileRef = doc(db, 'profiles', profileId);
    const profileDoc = await getDoc(profileRef);
    
    if (profileDoc.exists()) {
      return { id: profileDoc.id, ...profileDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile by ID:', error);
    // Fallback to localStorage
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    return profiles.find(p => p.profileId === profileId);
  }
};

export const getProfileWithTests = async (profileId) => {
  try {
    const profile = await getProfileById(profileId);
    if (!profile) return null;

    // Fetch all tests from master
    const testsMaster = await getTestsMaster();
    const tests = profile.testIds.map(testId => {
      const test = testsMaster.find(t => t.testId === testId);
      return test || null;
    }).filter(Boolean);

    return { ...profile, tests };
  } catch (error) {
    console.error('Error fetching profile with tests:', error);
    // Fallback to localStorage
    const profile = getProfileById(profileId);
    if (!profile) return null;

    const testsMaster = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS_MASTER) || '[]');
    const tests = profile.testIds.map(testId => {
      const test = testsMaster.find(t => t.testId === testId);
      return test || null;
    }).filter(Boolean);

    return { ...profile, tests };
  }
};

export const addProfile = async (profileData) => {
  try {
    const newProfile = {
      ...profileData,
      profileId: `PROF_${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    const profileRef = doc(db, 'profiles', newProfile.profileId);
    await setDoc(profileRef, newProfile);
    
    return { id: newProfile.profileId, ...newProfile };
  } catch (error) {
    console.error('Error adding profile:', error);
    // Fallback to localStorage
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const newProfile = {
      ...profileData,
      profileId: `PROF_${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    
    return newProfile;
  }
};

// Patient Operations
export const getPatients = async () => {
  try {
    const patientsRef = collection(db, 'patients');
    const patientsSnapshot = await getDocs(patientsRef);
    let patients = [];
    
    patientsSnapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });
    
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  }
};

export const getPatientById = async (patientId) => {
  try {
    const patientRef = doc(db, 'patients', patientId);
    const patientDoc = await getDoc(patientRef);
    
    if (patientDoc.exists()) {
      return { id: patientDoc.id, ...patientDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    // Fallback to localStorage
    const patients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
    return patients.find(p => p.patientId === patientId);
  }
};

export const addPatient = async (patientData) => {
  try {
    const newPatient = {
      ...patientData,
      patientId: `PAT_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const patientRef = doc(db, 'patients', newPatient.patientId);
    await setDoc(patientRef, newPatient);
    
    dispatchDataUpdate('patients');
    return { id: newPatient.patientId, ...newPatient };
  } catch (error) {
    console.error('Error adding patient:', error);
    // Fallback to localStorage
    const patients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
    const newPatient = {
      ...patientData,
      patientId: `PAT_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    dispatchDataUpdate('patients');
    
    return newPatient;
  }
};

export const updatePatient = async (patientId, updates) => {
  try {
    const patientRef = doc(db, 'patients', patientId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(patientRef, updateData);
    
    const updatedPatient = await getPatientById(patientId);
    dispatchDataUpdate('patients');
    return updatedPatient;
  } catch (error) {
    console.error('Error updating patient:', error);
    // Fallback to localStorage
    const patients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
    const index = patients.findIndex(p => p.patientId === patientId);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      dispatchDataUpdate('patients');
      return patients[index];
    }
    return null;
  }
};

export const deletePatient = async (patientId) => {
  try {
    // Delete patient document
    const patientRef = doc(db, 'patients', patientId);
    await deleteDoc(patientRef);
    
    // Also delete related visits, results, and invoices
    const visits = await getVisits();
    const patientVisits = visits.filter(v => v.patientId === patientId);
    const visitIds = patientVisits.map(v => v.visitId || v.id);
    
    // Delete related visits
    for (const visitId of visitIds) {
      const visitRef = doc(db, 'visits', visitId);
      await deleteDoc(visitRef);
      
      // Delete related results
      const resultsRef = doc(db, 'results', visitId);
      await deleteDoc(resultsRef);
      
      // Delete related invoices
      const invoicesQuery = query(collection(db, 'invoices'), where('visitId', '==', visitId));
      const invoicesSnapshot = await getDocs(invoicesQuery);
      for (const invoiceDoc of invoicesSnapshot.docs) {
        await deleteDoc(invoiceDoc.ref);
      }
    }
    
    dispatchDataUpdate('patients');
    return true;
  } catch (error) {
    console.error('Error deleting patient:', error);
    // Fallback to localStorage
    const patients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
    const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES) || '[]');

    const updatedPatients = patients.filter(p => p.patientId !== patientId);
    const patientVisits = visits.filter(v => v.patientId === patientId);
    const visitIds = patientVisits.map(v => v.visitId);
    const updatedVisits = visits.filter(v => v.patientId !== patientId);
    const updatedResults = results.filter(r => !visitIds.includes(r.visitId));
    const updatedInvoices = invoices.filter(i => !visitIds.includes(i.visitId));

    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updatedPatients));
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(updatedVisits));
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updatedResults));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updatedInvoices));

    dispatchDataUpdate('patients');
    return true;
  }
};

// Visit Operations
export const getVisits = async () => {
  try {
    const visitsRef = collection(db, 'visits');
    const visitsSnapshot = await getDocs(visitsRef);
    let visits = [];
    
    visitsSnapshot.forEach((doc) => {
      visits.push({ id: doc.id, ...doc.data() });
    });
    
    return visits;
  } catch (error) {
    console.error('Error fetching visits:', error);
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
  }
};

export const getVisitById = async (visitId) => {
  try {
    const visitRef = doc(db, 'visits', visitId);
    const visitDoc = await getDoc(visitRef);
    
    if (visitDoc.exists()) {
      return { id: visitDoc.id, ...visitDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching visit by ID:', error);
    // Fallback to localStorage
    const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
    return visits.find(v => v.visitId === visitId || v.id === visitId);
  }
};

export const getVisitsByPatientId = async (patientId) => {
  try {
    const visitsRef = collection(db, 'visits');
    const q = query(visitsRef, where('patientId', '==', patientId));
    const visitsSnapshot = await getDocs(q);
    let visits = [];
    
    visitsSnapshot.forEach((doc) => {
      visits.push({ id: doc.id, ...doc.data() });
    });
    
    return visits;
  } catch (error) {
    console.error('Error fetching visits by patient ID:', error);
    // Fallback to localStorage
    const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
    return visits.filter(v => v.patientId === patientId);
  }
};

export const createVisit = async (visitData) => {
  try {
    const newVisit = {
      ...visitData,
      visitId: `VISIT_${Date.now()}`,
      status: 'tests_selected',
      pdfGenerated: false,
      invoiceGenerated: false,
      paymentStatus: 'unpaid',
      paidAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const visitRef = doc(db, 'visits', newVisit.visitId);
    await setDoc(visitRef, newVisit);
    
    dispatchDataUpdate('visits');
    return { id: newVisit.visitId, ...newVisit };
  } catch (error) {
    console.error('Error creating visit:', error);
    // Fallback to localStorage
    const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
    const newVisit = {
      ...visitData,
      visitId: `VISIT_${Date.now()}`,
      status: 'tests_selected',
      pdfGenerated: false,
      invoiceGenerated: false,
      paymentStatus: 'unpaid',
      paidAt: null,
      createdAt: new Date().toISOString()
    };
    visits.push(newVisit);
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
    dispatchDataUpdate('visits');
    
    return newVisit;
  }
};

export const updateVisit = async (visitId, updates) => {
  try {
    const visitRef = doc(db, 'visits', visitId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(visitRef, updateData);
    
    const updatedVisit = await getVisitById(visitId);
    dispatchDataUpdate('visits');
    return updatedVisit;
  } catch (error) {
    console.error('Error updating visit:', error);
    // Fallback to localStorage
    const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
    const index = visits.findIndex(v => v.visitId === visitId);
    if (index !== -1) {
      visits[index] = { ...visits[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
      dispatchDataUpdate('visits');
      return visits[index];
    }
    return null;
  }
};

export const markPDFGenerated = async (visitId) => {
  return await updateVisit(visitId, {
    pdfGenerated: true,
    pdfGeneratedAt: new Date().toISOString()
  });
};

export const markInvoiceGenerated = async (visitId) => {
  return await updateVisit(visitId, {
    invoiceGenerated: true,
    invoiceGeneratedAt: new Date().toISOString(),
    paymentStatus: 'paid',
    paidAt: new Date().toISOString()
  });
};

export const updatePaymentStatus = async (visitId, status) => {
  const updates = { paymentStatus: status };
  if (status === 'paid') {
    updates.paidAt = new Date().toISOString();
  }
  return await updateVisit(visitId, updates);
};

// Result Operations
export const saveResults = async (visitId, results) => {
  try {
    const newResults = {
      visitId,
      results,
      savedAt: new Date().toISOString()
    };
    
    const resultsRef = doc(db, 'results', visitId);
    await setDoc(resultsRef, newResults);
    
    return { id: visitId, ...newResults };
  } catch (error) {
    console.error('Error saving results:', error);
    // Fallback to localStorage
    const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    const filtered = allResults.filter(r => r.visitId !== visitId);
    const newResults = {
      visitId,
      results,
      savedAt: new Date().toISOString()
    };
    filtered.push(newResults);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(filtered));
    
    return newResults;
  }
};

export const updateVisitResults = async (visitId, testsWithResults) => {
  try {
    const visitRef = doc(db, 'visits', visitId);
    const updateData = {
      tests: testsWithResults,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(visitRef, updateData);
    
    const updatedVisit = await getVisitById(visitId);
    dispatchDataUpdate('visits');
    return updatedVisit;
  } catch (error) {
    console.error('Error updating visit results:', error);
    // Fallback to localStorage
    const visits = JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || '[]');
    const visitIndex = visits.findIndex(v => v.visitId === visitId);
    
    if (visitIndex !== -1) {
      visits[visitIndex].tests = testsWithResults;
      visits[visitIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
      dispatchDataUpdate('visits');
      return visits[visitIndex];
    }
    return null;
  }
};

export const getResultsByVisitId = async (visitId) => {
  try {
    const resultsRef = doc(db, 'results', visitId);
    const resultsDoc = await getDoc(resultsRef);
    
    if (resultsDoc.exists()) {
      return { id: resultsDoc.id, ...resultsDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching results by visit ID:', error);
    // Fallback to localStorage
    const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    return allResults.find(r => r.visitId === visitId);
  }
};

// Invoice Operations
export const createInvoice = async (invoiceData) => {
  try {
    const newInvoice = {
      ...invoiceData,
      invoiceId: `INV_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const invoiceRef = doc(db, 'invoices', newInvoice.invoiceId);
    await setDoc(invoiceRef, newInvoice);
    
    return { id: newInvoice.invoiceId, ...newInvoice };
  } catch (error) {
    console.error('Error creating invoice:', error);
    // Fallback to localStorage
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES) || '[]');
    const newInvoice = {
      ...invoiceData,
      invoiceId: `INV_${Date.now()}`,
      generatedAt: new Date().toISOString()
    };
    invoices.push(newInvoice);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    
    return newInvoice;
  }
};

export const getInvoicesByVisitId = async (visitId) => {
  try {
    const invoicesRef = collection(db, 'invoices');
    const q = query(invoicesRef, where('visitId', '==', visitId));
    const invoicesSnapshot = await getDocs(q);
    let invoices = [];
    
    invoicesSnapshot.forEach((doc) => {
      invoices.push({ id: doc.id, ...doc.data() });
    });
    
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices by visit ID:', error);
    // Fallback to localStorage
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES) || '[]');
    return invoices.filter(inv => inv.visitId === visitId);
  }
};

// Settings Operations
export const getSettings = async () => {
  try {
    const settingsRef = doc(db, 'settings', 'labSettings');
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      return { id: settingsDoc.id, ...settingsDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
  }
};

export const updateSettings = async (updates) => {
  try {
    const settingsRef = doc(db, 'settings', 'labSettings');
    const updateData = {
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    await updateDoc(settingsRef, updateData);
    
    const updatedSettings = await getSettings();
    return updatedSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    // Fallback to localStorage
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    const updatedSettings = { ...settings, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    
    return updatedSettings;
  }
};

// Audit Log
export const logAudit = async (action, details) => {
  try {
    const newLog = {
      logId: `LOG_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    const logRef = doc(db, 'auditLogs', newLog.logId);
    await setDoc(logRef, newLog);
  } catch (error) {
    console.error('Error logging audit:', error);
    // Fallback to localStorage
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
    logs.push({
      logId: `LOG_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }
};

// Search with debounce helper
export const searchTests = (searchTerm) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getTestsMaster(searchTerm));
    }, 300);
  });
};

export default {
  initializeSeedData,
  clearAllData,
  getTestsMaster,
  getTestById,
  addTestToMaster,
  getProfiles,
  getProfileById,
  getProfileWithTests,
  addProfile,
  getPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
  getVisits,
  getVisitById,
  getVisitsByPatientId,
  createVisit,
  updateVisit,
  saveResults,
  getResultsByVisitId,
  createInvoice,
  getInvoicesByVisitId,
  getSettings,
  updateSettings,
  logAudit,
  searchTests
};
