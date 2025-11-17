// Profile Templates - Seeded Data
export const PROFILES = [
  {
    profileId: 'PROF001',
    name: 'Kidney Function Test (KFT)',
    description: 'Complete kidney health assessment',
    testIds: ['KFT001', 'KFT002', 'KFT003', 'KFT004'],
    packagePrice: 500,
    active: true
  },
  {
    profileId: 'PROF002',
    name: 'Liver Function Test (LFT)',
    description: 'Complete liver health assessment',
    testIds: ['LFT001', 'LFT002', 'LFT003', 'LFT004', 'LFT005', 'LFT006', 'LFT007', 'LFT008'],
    packagePrice: 700,
    active: true
  },
  {
    profileId: 'PROF003',
    name: 'Lipid Profile',
    description: 'Cholesterol and heart health assessment',
    testIds: ['LIP001', 'LIP002', 'LIP003', 'LIP004', 'LIP005'],
    packagePrice: 600,
    active: true
  },
  {
    profileId: 'PROF004',
    name: 'Diabetes Panel',
    description: 'Blood sugar monitoring and diabetes screening',
    testIds: ['DIA001', 'DIA002', 'DIA003'],
    packagePrice: 550,
    active: true
  },
  {
    profileId: 'PROF005',
    name: 'Thyroid Profile',
    description: 'Complete thyroid function assessment',
    testIds: ['THY001', 'THY002', 'THY003', 'THY004', 'THY005'],
    packagePrice: 1200,
    active: true
  },
  {
    profileId: 'PROF006',
    name: 'Complete Blood Count (CBC)',
    description: 'Full blood cell analysis',
    testIds: ['CBC001', 'CBC002', 'CBC003', 'CBC004', 'CBC005', 'CBC006', 'CBC007', 'CBC008'],
    packagePrice: 400,
    active: true
  },
  {
    profileId: 'PROF007',
    name: 'Urine Routine',
    description: 'Complete urine analysis',
    testIds: ['UR001', 'UR002', 'UR003', 'UR004', 'UR005', 'UR006', 'UR007', 'UR008'],
    packagePrice: 300,
    active: true
  },
  {
    profileId: 'PROF008',
    name: 'Vitamin Panel',
    description: 'Essential vitamin deficiency screening',
    testIds: ['VIT001', 'VIT002', 'VIT003'],
    packagePrice: 1800,
    active: true
  },
  {
    profileId: 'PROF009',
    name: 'Electrolyte Panel',
    description: 'Complete electrolyte balance assessment',
    testIds: ['ELEC001', 'ELEC002', 'ELEC003', 'ELEC004', 'ELEC005', 'ELEC006'],
    packagePrice: 650,
    active: true
  },
  {
    profileId: 'PROF010',
    name: 'Cardiac Risk Assessment',
    description: 'Heart health and damage markers',
    testIds: ['CARD001', 'CARD002', 'CARD003', 'LIP001', 'LIP002', 'LIP003', 'LIP004'],
    packagePrice: 2000,
    active: true
  },
  {
    profileId: 'PROF011',
    name: 'Comprehensive Health Checkup',
    description: 'Full body health screening',
    testIds: [
      'CBC001', 'CBC002', 'CBC003', 'CBC004',
      'LFT001', 'LFT002', 'LFT003', 'LFT004',
      'KFT001', 'KFT002', 'KFT003',
      'LIP001', 'LIP002', 'LIP003', 'LIP004',
      'DIA001', 'THY001'
    ],
    packagePrice: 2500,
    active: true
  },
  {
    profileId: 'PROF_CUSTOM',
    name: 'Custom Test Selection',
    description: 'Choose individual tests',
    testIds: [],
    packagePrice: null,
    active: true
  }
];

export default PROFILES;
