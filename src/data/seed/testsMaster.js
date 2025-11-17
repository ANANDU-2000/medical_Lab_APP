// Master Test List - Seeded Data
export const TESTS_MASTER = [
  // Kidney Function Tests (KFT)
  { testId: 'KFT001', code: 'CREAT', name: 'Creatinine', unit: 'mg/dL', inputType: 'number', refLow: 0.6, refHigh: 1.2, refText: 'Normal kidney function', price: 150, category: 'Kidney Function', active: true },
  { testId: 'KFT002', code: 'UREA', name: 'Urea', unit: 'mg/dL', inputType: 'number', refLow: 10, refHigh: 45, refText: 'Metabolic waste product', price: 120, category: 'Kidney Function', active: true },
  { testId: 'KFT003', code: 'BUN', name: 'Blood Urea Nitrogen', unit: 'mg/dL', inputType: 'number', refLow: 7, refHigh: 20, refText: 'Kidney filtration marker', price: 130, category: 'Kidney Function', active: true },
  { testId: 'KFT004', code: 'URIC', name: 'Uric Acid', unit: 'mg/dL', inputType: 'number', refLow: 3.5, refHigh: 7.2, refText: 'Gout & kidney stone risk', price: 140, category: 'Kidney Function', active: true },

  // Liver Function Tests (LFT)
  { testId: 'LFT001', code: 'SGOT', name: 'SGOT (AST)', unit: 'U/L', inputType: 'number', refLow: 0, refHigh: 40, refText: 'Liver enzyme', price: 120, category: 'Liver Function', active: true },
  { testId: 'LFT002', code: 'SGPT', name: 'SGPT (ALT)', unit: 'U/L', inputType: 'number', refLow: 0, refHigh: 41, refText: 'Liver enzyme - primary marker', price: 120, category: 'Liver Function', active: true },
  { testId: 'LFT003', code: 'ALP', name: 'Alkaline Phosphatase', unit: 'U/L', inputType: 'number', refLow: 30, refHigh: 120, refText: 'Bile duct function', price: 130, category: 'Liver Function', active: true },
  { testId: 'LFT004', code: 'BILI_T', name: 'Bilirubin Total', unit: 'mg/dL', inputType: 'number', refLow: 0.3, refHigh: 1.2, refText: 'Liver & bile duct health', price: 110, category: 'Liver Function', active: true },
  { testId: 'LFT005', code: 'BILI_D', name: 'Bilirubin Direct', unit: 'mg/dL', inputType: 'number', refLow: 0, refHigh: 0.3, refText: 'Conjugated bilirubin', price: 110, category: 'Liver Function', active: true },
  { testId: 'LFT006', code: 'PROT_T', name: 'Total Protein', unit: 'g/dL', inputType: 'number', refLow: 6.0, refHigh: 8.3, refText: 'Protein synthesis', price: 100, category: 'Liver Function', active: true },
  { testId: 'LFT007', code: 'ALB', name: 'Albumin', unit: 'g/dL', inputType: 'number', refLow: 3.5, refHigh: 5.2, refText: 'Main blood protein', price: 100, category: 'Liver Function', active: true },
  { testId: 'LFT008', code: 'GLOB', name: 'Globulin', unit: 'g/dL', inputType: 'number', refLow: 2.0, refHigh: 3.5, refText: 'Immune proteins', price: 100, category: 'Liver Function', active: true },

  // Lipid Profile
  { testId: 'LIP001', code: 'CHOL', name: 'Total Cholesterol', unit: 'mg/dL', inputType: 'number', refLow: 0, refHigh: 200, refText: 'Desirable: <200, Borderline: 200-239, High: ≥240', price: 150, category: 'Lipid Profile', active: true },
  { testId: 'LIP002', code: 'TG', name: 'Triglycerides', unit: 'mg/dL', inputType: 'number', refLow: 0, refHigh: 150, refText: 'Normal: <150, Borderline: 150-199, High: ≥200', price: 150, category: 'Lipid Profile', active: true },
  { testId: 'LIP003', code: 'HDL', name: 'HDL Cholesterol', unit: 'mg/dL', inputType: 'number', refLow: 40, refHigh: 60, refText: 'Good cholesterol - Higher is better', price: 150, category: 'Lipid Profile', active: true },
  { testId: 'LIP004', code: 'LDL', name: 'LDL Cholesterol', unit: 'mg/dL', inputType: 'number', refLow: 0, refHigh: 100, refText: 'Bad cholesterol - Lower is better', price: 150, category: 'Lipid Profile', active: true },
  { testId: 'LIP005', code: 'VLDL', name: 'VLDL Cholesterol', unit: 'mg/dL', inputType: 'number', refLow: 0, refHigh: 30, refText: 'Very low density cholesterol', price: 120, category: 'Lipid Profile', active: true },

  // Diabetes Panel
  { testId: 'DIA001', code: 'FBS', name: 'Fasting Blood Sugar', unit: 'mg/dL', inputType: 'number', refLow: 70, refHigh: 100, refText: 'Normal: 70-100, Prediabetes: 100-125, Diabetes: ≥126', price: 80, category: 'Diabetes', active: true },
  { testId: 'DIA002', code: 'PPBS', name: 'Post Prandial Blood Sugar', unit: 'mg/dL', inputType: 'number', refLow: 70, refHigh: 140, refText: 'After 2 hours meal', price: 80, category: 'Diabetes', active: true },
  { testId: 'DIA003', code: 'HBA1C', name: 'HbA1c (Glycated Hemoglobin)', unit: '%', inputType: 'number', refLow: 4.0, refHigh: 5.6, refText: 'Normal: <5.7%, Prediabetes: 5.7-6.4%, Diabetes: ≥6.5%', price: 450, category: 'Diabetes', active: true },
  { testId: 'DIA004', code: 'RBS', name: 'Random Blood Sugar', unit: 'mg/dL', inputType: 'number', refLow: 70, refHigh: 140, refText: 'Any time blood sugar', price: 70, category: 'Diabetes', active: true },

  // Thyroid Panel
  { testId: 'THY001', code: 'TSH', name: 'TSH (Thyroid Stimulating Hormone)', unit: 'μIU/mL', inputType: 'number', refLow: 0.4, refHigh: 4.0, refText: 'Primary thyroid marker', price: 300, category: 'Thyroid', active: true },
  { testId: 'THY002', code: 'T3', name: 'T3 (Triiodothyronine)', unit: 'ng/dL', inputType: 'number', refLow: 80, refHigh: 200, refText: 'Active thyroid hormone', price: 250, category: 'Thyroid', active: true },
  { testId: 'THY003', code: 'T4', name: 'T4 (Thyroxine)', unit: 'μg/dL', inputType: 'number', refLow: 5.0, refHigh: 12.0, refText: 'Thyroid hormone storage', price: 250, category: 'Thyroid', active: true },
  { testId: 'THY004', code: 'FT3', name: 'Free T3', unit: 'pg/mL', inputType: 'number', refLow: 2.3, refHigh: 4.2, refText: 'Unbound T3', price: 300, category: 'Thyroid', active: true },
  { testId: 'THY005', code: 'FT4', name: 'Free T4', unit: 'ng/dL', inputType: 'number', refLow: 0.8, refHigh: 1.8, refText: 'Unbound T4', price: 300, category: 'Thyroid', active: true },

  // Complete Blood Count (CBC)
  { testId: 'CBC001', code: 'HB', name: 'Hemoglobin', unit: 'g/dL', inputType: 'number', refLow: 12.0, refHigh: 16.0, refText: 'Oxygen carrying protein', price: 100, category: 'Hematology', active: true },
  { testId: 'CBC002', code: 'RBC', name: 'RBC Count', unit: 'million/μL', inputType: 'number', refLow: 4.5, refHigh: 5.5, refText: 'Red blood cell count', price: 80, category: 'Hematology', active: true },
  { testId: 'CBC003', code: 'WBC', name: 'WBC Count', unit: 'thousand/μL', inputType: 'number', refLow: 4.0, refHigh: 11.0, refText: 'White blood cell count', price: 80, category: 'Hematology', active: true },
  { testId: 'CBC004', code: 'PLT', name: 'Platelet Count', unit: 'lakh/μL', inputType: 'number', refLow: 1.5, refHigh: 4.5, refText: 'Blood clotting cells', price: 100, category: 'Hematology', active: true },
  { testId: 'CBC005', code: 'PCV', name: 'PCV (Hematocrit)', unit: '%', inputType: 'number', refLow: 36, refHigh: 46, refText: 'Red blood cell volume', price: 80, category: 'Hematology', active: true },
  { testId: 'CBC006', code: 'MCV', name: 'MCV', unit: 'fL', inputType: 'number', refLow: 80, refHigh: 100, refText: 'Mean corpuscular volume', price: 80, category: 'Hematology', active: true },
  { testId: 'CBC007', code: 'MCH', name: 'MCH', unit: 'pg', inputType: 'number', refLow: 27, refHigh: 32, refText: 'Mean corpuscular hemoglobin', price: 80, category: 'Hematology', active: true },
  { testId: 'CBC008', code: 'MCHC', name: 'MCHC', unit: 'g/dL', inputType: 'number', refLow: 32, refHigh: 36, refText: 'Mean corpuscular Hb concentration', price: 80, category: 'Hematology', active: true },

  // Urine Routine
  { testId: 'UR001', code: 'U_COLOR', name: 'Urine Color', unit: '', inputType: 'text', refText: 'Pale yellow to amber', price: 50, category: 'Urine Analysis', active: true },
  { testId: 'UR002', code: 'U_APP', name: 'Appearance', unit: '', inputType: 'text', refText: 'Clear', price: 50, category: 'Urine Analysis', active: true },
  { testId: 'UR003', code: 'U_PH', name: 'pH', unit: '', inputType: 'number', refLow: 4.5, refHigh: 8.0, refText: 'Acidity/Alkalinity', price: 50, category: 'Urine Analysis', active: true },
  { testId: 'UR004', code: 'U_SG', name: 'Specific Gravity', unit: '', inputType: 'number', refLow: 1.005, refHigh: 1.030, refText: 'Concentration measure', price: 50, category: 'Urine Analysis', active: true },
  { testId: 'UR005', code: 'U_PROT', name: 'Protein', unit: '', inputType: 'select', dropdownOptions: ['Nil', 'Trace', '+', '++', '+++'], refText: 'Should be Nil', price: 60, category: 'Urine Analysis', active: true },
  { testId: 'UR006', code: 'U_GLUC', name: 'Glucose', unit: '', inputType: 'select', dropdownOptions: ['Nil', 'Trace', '+', '++', '+++'], refText: 'Should be Nil', price: 60, category: 'Urine Analysis', active: true },
  { testId: 'UR007', code: 'U_KET', name: 'Ketones', unit: '', inputType: 'select', dropdownOptions: ['Nil', 'Trace', '+', '++'], refText: 'Should be Nil', price: 60, category: 'Urine Analysis', active: true },
  { testId: 'UR008', code: 'U_BILI', name: 'Bilirubin', unit: '', inputType: 'select', dropdownOptions: ['Nil', 'Trace', '+', '++'], refText: 'Should be Nil', price: 60, category: 'Urine Analysis', active: true },

  // Vitamins
  { testId: 'VIT001', code: 'VIT_D', name: 'Vitamin D (25-OH)', unit: 'ng/mL', inputType: 'number', refLow: 30, refHigh: 100, refText: 'Deficient: <20, Insufficient: 20-30, Sufficient: 30-100', price: 800, category: 'Vitamins', active: true },
  { testId: 'VIT002', code: 'VIT_B12', name: 'Vitamin B12', unit: 'pg/mL', inputType: 'number', refLow: 200, refHigh: 900, refText: 'Deficient: <200', price: 650, category: 'Vitamins', active: true },
  { testId: 'VIT003', code: 'FOLATE', name: 'Folate (Vitamin B9)', unit: 'ng/mL', inputType: 'number', refLow: 3, refHigh: 17, refText: 'Essential for DNA synthesis', price: 600, category: 'Vitamins', active: true },

  // Electrolytes
  { testId: 'ELEC001', code: 'NA', name: 'Sodium (Na)', unit: 'mEq/L', inputType: 'number', refLow: 136, refHigh: 145, refText: 'Electrolyte balance', price: 120, category: 'Electrolytes', active: true },
  { testId: 'ELEC002', code: 'K', name: 'Potassium (K)', unit: 'mEq/L', inputType: 'number', refLow: 3.5, refHigh: 5.0, refText: 'Heart & muscle function', price: 120, category: 'Electrolytes', active: true },
  { testId: 'ELEC003', code: 'CL', name: 'Chloride (Cl)', unit: 'mEq/L', inputType: 'number', refLow: 98, refHigh: 107, refText: 'Acid-base balance', price: 120, category: 'Electrolytes', active: true },
  { testId: 'ELEC004', code: 'CA', name: 'Calcium (Ca)', unit: 'mg/dL', inputType: 'number', refLow: 8.5, refHigh: 10.5, refText: 'Bone & nerve health', price: 130, category: 'Electrolytes', active: true },
  { testId: 'ELEC005', code: 'MG', name: 'Magnesium (Mg)', unit: 'mg/dL', inputType: 'number', refLow: 1.7, refHigh: 2.2, refText: 'Muscle & nerve function', price: 140, category: 'Electrolytes', active: true },
  { testId: 'ELEC006', code: 'PHOS', name: 'Phosphorus', unit: 'mg/dL', inputType: 'number', refLow: 2.5, refHigh: 4.5, refText: 'Bone & energy metabolism', price: 130, category: 'Electrolytes', active: true },

  // Cardiac Markers
  { testId: 'CARD001', code: 'TROP_I', name: 'Troponin I', unit: 'ng/mL', inputType: 'number', refLow: 0, refHigh: 0.04, refText: 'Heart attack marker', price: 800, category: 'Cardiac', active: true },
  { testId: 'CARD002', code: 'CK_MB', name: 'CK-MB', unit: 'U/L', inputType: 'number', refLow: 0, refHigh: 25, refText: 'Heart muscle enzyme', price: 500, category: 'Cardiac', active: true },
  { testId: 'CARD003', code: 'LDH', name: 'LDH (Lactate Dehydrogenase)', unit: 'U/L', inputType: 'number', refLow: 140, refHigh: 280, refText: 'Tissue damage marker', price: 200, category: 'Cardiac', active: true },
];

export default TESTS_MASTER;
