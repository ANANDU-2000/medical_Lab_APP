// Complete Test Master Data - Preloaded Tests
export const TEST_CATEGORIES = {
  HAEMATOLOGY: 'HAEMATOLOGY',
  BIOCHEMISTRY: 'BIOCHEMISTRY',
  LIPID_PROFILE: 'LIPID PROFILE',
  LIVER_FUNCTION: 'LIVER FUNCTION TEST (LFT)',
  KIDNEY_FUNCTION: 'KIDNEY FUNCTION TEST (KFT)',
  THYROID: 'THYROID PROFILE',
  DIABETES: 'DIABETES PROFILE',
  VITAMINS: 'VITAMINS',
  ELECTROLYTES: 'ELECTROLYTES',
  CARDIAC: 'CARDIAC MARKERS',
  URINE: 'URINE ANALYSIS'
};

export const TEST_MASTER = [
  // HAEMATOLOGY
  {
    id: 'HB001',
    name: 'Haemoglobin',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'g/dL',
    referenceRange: '12 - 16',
    genderSpecific: true,
    maleRange: '13 - 17',
    femaleRange: '12 - 16',
    description: 'Measures oxygen-carrying protein in blood',
    visible: true
  },
  {
    id: 'RBC001',
    name: 'RBC Count',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'mill/cumm',
    referenceRange: '4.5 - 5.5',
    genderSpecific: true,
    maleRange: '4.5 - 5.5',
    femaleRange: '3.8 - 4.8',
    visible: true
  },
  {
    id: 'WBC001',
    name: 'WBC Count',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'cumm',
    referenceRange: '4000 - 11000',
    visible: true
  },
  {
    id: 'PLT001',
    name: 'Platelet Count',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'lakhs/cumm',
    referenceRange: '1.5 - 4.5',
    visible: true
  },
  {
    id: 'PCV001',
    name: 'PCV / Haematocrit',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: '%',
    referenceRange: '40 - 50',
    genderSpecific: true,
    maleRange: '40 - 50',
    femaleRange: '36 - 46',
    visible: true
  },
  {
    id: 'MCV001',
    name: 'MCV',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'fL',
    referenceRange: '83 - 101',
    visible: true
  },
  {
    id: 'MCH001',
    name: 'MCH',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'pg',
    referenceRange: '27 - 32',
    visible: true
  },
  {
    id: 'MCHC001',
    name: 'MCHC',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'g/dL',
    referenceRange: '31.5 - 34.5',
    visible: true
  },
  {
    id: 'NEU001',
    name: 'Neutrophils',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: '%',
    referenceRange: '40 - 80',
    visible: true
  },
  {
    id: 'LYM001',
    name: 'Lymphocytes',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: '%',
    referenceRange: '20 - 40',
    visible: true
  },
  {
    id: 'EOS001',
    name: 'Eosinophils',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: '%',
    referenceRange: '1 - 6',
    visible: true
  },
  {
    id: 'MON001',
    name: 'Monocytes',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: '%',
    referenceRange: '2 - 10',
    visible: true
  },
  {
    id: 'BAS001',
    name: 'Basophils',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: '%',
    referenceRange: '0 - 2',
    visible: true
  },
  {
    id: 'ESR001',
    name: 'ESR',
    category: TEST_CATEGORIES.HAEMATOLOGY,
    unit: 'mm/hr',
    referenceRange: '0 - 20',
    genderSpecific: true,
    maleRange: '0 - 15',
    femaleRange: '0 - 20',
    visible: true
  },

  // BIOCHEMISTRY
  {
    id: 'GLU001',
    name: 'Blood Glucose Fasting',
    category: TEST_CATEGORIES.BIOCHEMISTRY,
    unit: 'mg/dL',
    referenceRange: '70 - 110',
    visible: true
  },
  {
    id: 'GLU002',
    name: 'Blood Glucose PP',
    category: TEST_CATEGORIES.BIOCHEMISTRY,
    unit: 'mg/dL',
    referenceRange: 'Up to 140',
    visible: true
  },
  {
    id: 'GLU003',
    name: 'Blood Glucose Random',
    category: TEST_CATEGORIES.BIOCHEMISTRY,
    unit: 'mg/dL',
    referenceRange: '70 - 140',
    visible: true
  },
  {
    id: 'HBA1C001',
    name: 'HbA1c',
    category: TEST_CATEGORIES.DIABETES,
    unit: '%',
    referenceRange: '< 5.7',
    description: 'Normal: < 5.7%, Prediabetes: 5.7-6.4%, Diabetes: ≥ 6.5%',
    visible: true
  },
  {
    id: 'CREAT001',
    name: 'Creatinine',
    category: TEST_CATEGORIES.BIOCHEMISTRY,
    unit: 'mg/dL',
    referenceRange: '0.6 - 1.2',
    genderSpecific: true,
    maleRange: '0.7 - 1.3',
    femaleRange: '0.6 - 1.1',
    visible: true
  },
  {
    id: 'UREA001',
    name: 'Blood Urea',
    category: TEST_CATEGORIES.BIOCHEMISTRY,
    unit: 'mg/dL',
    referenceRange: '15 - 40',
    visible: true
  },
  {
    id: 'URIC001',
    name: 'Uric Acid',
    category: TEST_CATEGORIES.BIOCHEMISTRY,
    unit: 'mg/dL',
    referenceRange: '3.5 - 7.2',
    genderSpecific: true,
    maleRange: '3.5 - 7.2',
    femaleRange: '2.6 - 6.0',
    visible: true
  },
  {
    id: 'CAL001',
    name: 'Calcium',
    category: TEST_CATEGORIES.BIOCHEMISTRY,
    unit: 'mg/dL',
    referenceRange: '8.5 - 10.5',
    visible: true
  },

  // LIPID PROFILE
  {
    id: 'CHOL001',
    name: 'Total Cholesterol',
    category: TEST_CATEGORIES.LIPID_PROFILE,
    unit: 'mg/dL',
    referenceRange: 'Up to 200',
    description: 'Desirable: < 200, Borderline: 200-239, High: ≥ 240',
    visible: true
  },
  {
    id: 'TG001',
    name: 'Triglycerides',
    category: TEST_CATEGORIES.LIPID_PROFILE,
    unit: 'mg/dL',
    referenceRange: '60 - 150',
    visible: true
  },
  {
    id: 'HDL001',
    name: 'HDL Cholesterol',
    category: TEST_CATEGORIES.LIPID_PROFILE,
    unit: 'mg/dL',
    referenceRange: '35 - 55',
    genderSpecific: true,
    maleRange: '35 - 55',
    femaleRange: '45 - 65',
    visible: true
  },
  {
    id: 'LDL001',
    name: 'LDL Cholesterol',
    category: TEST_CATEGORIES.LIPID_PROFILE,
    unit: 'mg/dL',
    referenceRange: 'Up to 100',
    description: 'Optimal: < 100, Near Optimal: 100-129, Borderline: 130-159, High: ≥ 160',
    visible: true
  },
  {
    id: 'VLDL001',
    name: 'VLDL',
    category: TEST_CATEGORIES.LIPID_PROFILE,
    unit: 'mg/dL',
    referenceRange: '15 - 35',
    visible: true
  },
  {
    id: 'RATIO001',
    name: 'TC/HDL Ratio',
    category: TEST_CATEGORIES.LIPID_PROFILE,
    unit: 'ratio',
    referenceRange: '< 4.5',
    visible: true
  },

  // LIVER FUNCTION TEST (LFT)
  {
    id: 'BIL001',
    name: 'Bilirubin Total',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'mg/dL',
    referenceRange: '0.3 - 1.2',
    visible: true
  },
  {
    id: 'BIL002',
    name: 'Bilirubin Direct',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'mg/dL',
    referenceRange: '0 - 0.3',
    visible: true
  },
  {
    id: 'BIL003',
    name: 'Bilirubin Indirect',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'mg/dL',
    referenceRange: '0.2 - 0.9',
    visible: true
  },
  {
    id: 'SGOT001',
    name: 'SGOT (AST)',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'U/L',
    referenceRange: 'Up to 40',
    visible: true
  },
  {
    id: 'SGPT001',
    name: 'SGPT (ALT)',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'U/L',
    referenceRange: 'Up to 41',
    visible: true
  },
  {
    id: 'ALP001',
    name: 'Alkaline Phosphatase',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'U/L',
    referenceRange: '30 - 120',
    visible: true
  },
  {
    id: 'TP001',
    name: 'Total Protein',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'g/dL',
    referenceRange: '6.0 - 8.3',
    visible: true
  },
  {
    id: 'ALB001',
    name: 'Albumin',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'g/dL',
    referenceRange: '3.5 - 5.0',
    visible: true
  },
  {
    id: 'GLOB001',
    name: 'Globulin',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'g/dL',
    referenceRange: '2.0 - 3.5',
    visible: true
  },
  {
    id: 'AG001',
    name: 'A/G Ratio',
    category: TEST_CATEGORIES.LIVER_FUNCTION,
    unit: 'ratio',
    referenceRange: '0.9 - 2.0',
    visible: true
  },

  // KIDNEY FUNCTION TEST (KFT)
  {
    id: 'KFT001',
    name: 'Blood Urea',
    category: TEST_CATEGORIES.KIDNEY_FUNCTION,
    unit: 'mg/dL',
    referenceRange: '15 - 40',
    visible: true
  },
  {
    id: 'KFT002',
    name: 'Creatinine',
    category: TEST_CATEGORIES.KIDNEY_FUNCTION,
    unit: 'mg/dL',
    referenceRange: '0.6 - 1.2',
    visible: true
  },
  {
    id: 'KFT003',
    name: 'Uric Acid',
    category: TEST_CATEGORIES.KIDNEY_FUNCTION,
    unit: 'mg/dL',
    referenceRange: '3.5 - 7.2',
    visible: true
  },
  {
    id: 'KFT004',
    name: 'Sodium (Na+)',
    category: TEST_CATEGORIES.KIDNEY_FUNCTION,
    unit: 'mEq/L',
    referenceRange: '135 - 145',
    visible: true
  },
  {
    id: 'KFT005',
    name: 'Potassium (K+)',
    category: TEST_CATEGORIES.KIDNEY_FUNCTION,
    unit: 'mEq/L',
    referenceRange: '3.5 - 5.0',
    visible: true
  },
  {
    id: 'KFT006',
    name: 'Chloride (Cl-)',
    category: TEST_CATEGORIES.KIDNEY_FUNCTION,
    unit: 'mEq/L',
    referenceRange: '96 - 106',
    visible: true
  },

  // THYROID PROFILE
  {
    id: 'T3001',
    name: 'T3 (Triiodothyronine)',
    category: TEST_CATEGORIES.THYROID,
    unit: 'ng/mL',
    referenceRange: '0.8 - 2.0',
    visible: true
  },
  {
    id: 'T4001',
    name: 'T4 (Thyroxine)',
    category: TEST_CATEGORIES.THYROID,
    unit: 'μg/dL',
    referenceRange: '4.5 - 12.0',
    visible: true
  },
  {
    id: 'TSH001',
    name: 'TSH',
    category: TEST_CATEGORIES.THYROID,
    unit: 'μIU/mL',
    referenceRange: '0.5 - 5.0',
    visible: true
  },

  // VITAMINS
  {
    id: 'VITD001',
    name: 'Vitamin D (25-OH)',
    category: TEST_CATEGORIES.VITAMINS,
    unit: 'ng/mL',
    referenceRange: '30 - 100',
    description: 'Deficient: < 20, Insufficient: 20-29, Sufficient: 30-100',
    visible: true
  },
  {
    id: 'VITB12001',
    name: 'Vitamin B12',
    category: TEST_CATEGORIES.VITAMINS,
    unit: 'pg/mL',
    referenceRange: '200 - 900',
    visible: true
  },

  // ELECTROLYTES
  {
    id: 'NA001',
    name: 'Sodium (Na+)',
    category: TEST_CATEGORIES.ELECTROLYTES,
    unit: 'mEq/L',
    referenceRange: '135 - 145',
    visible: true
  },
  {
    id: 'K001',
    name: 'Potassium (K+)',
    category: TEST_CATEGORIES.ELECTROLYTES,
    unit: 'mEq/L',
    referenceRange: '3.5 - 5.0',
    visible: true
  },
  {
    id: 'CL001',
    name: 'Chloride (Cl-)',
    category: TEST_CATEGORIES.ELECTROLYTES,
    unit: 'mEq/L',
    referenceRange: '96 - 106',
    visible: true
  },

  // CARDIAC MARKERS
  {
    id: 'TROP001',
    name: 'Troponin I',
    category: TEST_CATEGORIES.CARDIAC,
    unit: 'ng/mL',
    referenceRange: '< 0.04',
    visible: true
  },
  {
    id: 'CK001',
    name: 'CPK (Creatine Kinase)',
    category: TEST_CATEGORIES.CARDIAC,
    unit: 'U/L',
    referenceRange: '24 - 195',
    genderSpecific: true,
    maleRange: '24 - 195',
    femaleRange: '24 - 170',
    visible: true
  },
  {
    id: 'CKMB001',
    name: 'CK-MB',
    category: TEST_CATEGORIES.CARDIAC,
    unit: 'U/L',
    referenceRange: '< 25',
    visible: true
  }
];

// Test Packages (Common combinations)
export const TEST_PACKAGES = [
  {
    id: 'PKG001',
    name: 'Complete Blood Count (CBC)',
    tests: ['HB001', 'RBC001', 'WBC001', 'PLT001', 'PCV001', 'MCV001', 'MCH001', 'MCHC001', 'NEU001', 'LYM001', 'EOS001', 'MON001', 'BAS001', 'ESR001'],
    price: 250,
    visible: true
  },
  {
    id: 'PKG002',
    name: 'Lipid Profile',
    tests: ['CHOL001', 'TG001', 'HDL001', 'LDL001', 'VLDL001', 'RATIO001'],
    price: 400,
    visible: true
  },
  {
    id: 'PKG003',
    name: 'Liver Function Test (LFT)',
    tests: ['BIL001', 'BIL002', 'BIL003', 'SGOT001', 'SGPT001', 'ALP001', 'TP001', 'ALB001', 'GLOB001', 'AG001'],
    price: 500,
    visible: true
  },
  {
    id: 'PKG004',
    name: 'Kidney Function Test (KFT)',
    tests: ['KFT001', 'KFT002', 'KFT003', 'KFT004', 'KFT005', 'KFT006'],
    price: 450,
    visible: true
  },
  {
    id: 'PKG005',
    name: 'Thyroid Profile',
    tests: ['T3001', 'T4001', 'TSH001'],
    price: 600,
    visible: true
  },
  {
    id: 'PKG006',
    name: 'Diabetes Profile',
    tests: ['GLU001', 'GLU002', 'HBA1C001'],
    price: 550,
    visible: true
  },
  {
    id: 'PKG007',
    name: 'Master Health Checkup',
    tests: ['HB001', 'RBC001', 'WBC001', 'PLT001', 'ESR001', 'GLU001', 'HBA1C001', 'CHOL001', 'TG001', 'HDL001', 'LDL001', 'CREAT001', 'UREA001', 'URIC001', 'SGOT001', 'SGPT001', 'TSH001'],
    price: 1500,
    visible: true
  }
];

// Helper function to get test by ID
export const getTestById = (testId) => {
  return TEST_MASTER.find(test => test.id === testId);
};

// Helper function to get tests by category
export const getTestsByCategory = (category) => {
  return TEST_MASTER.filter(test => test.category === category && test.visible);
};

// Helper function to get package by ID
export const getPackageById = (packageId) => {
  return TEST_PACKAGES.find(pkg => pkg.id === packageId);
};
