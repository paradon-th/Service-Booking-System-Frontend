// terms-data.ts

export interface TermSection {
  id: string;
  title: string;
  points: string[];
}

export const TERMS_DATA: TermSection[] = [
  {
    id: 'section-1',
    title: '1. Introduction & Acceptance of Terms',
    points: [
      'The "PC_Reforming" platform is an internal production planning and simulation tool designed exclusively for authorized personnel within DENSO Group and its affiliated plants.',
      'By accessing or using the Platform, you agree to comply with these Terms of Service and all applicable internal IT security policies.',
      'These terms apply to all users, including but not limited to Planners, Approvers, Administrators, and Viewers.',
    ],
  },
  {
    id: 'section-2',
    title: '2. Scope of Service',
    points: [
      'PC_Reforming provides tools for production line simulation, capacity planning, and resource allocation analysis.',
      'The simulation results provided by the Platform are estimates based on input parameters and historical data. They should be used as a support tool for decision-making, not as the sole determinant for actual production execution.',
      'The System Administrator reserves the right to modify, suspend, or discontinue any part of the Service for maintenance or updates without prior notice.',
    ],
  },
  {
    id: 'section-3',
    title: '3. User Accounts & Security',
    points: [
      'Users are strictly prohibited from sharing their login credentials (Username/Password) with anyone, including other employees.',
      'Access rights are granted based on the user’s role. Attempting to access data or functions outside of your assigned permissions is a violation of company policy.',
      'Users must immediately notify the IT Department or System Administrator of any unauthorized use of their account or security breach.',
    ],
  },
  {
    id: 'section-4',
    title: '4. Data Accuracy & Responsibility',
    points: [
      'Users are responsible for the accuracy and integrity of the data they input into the Platform (e.g., Cycle Time, Manpower, Machine Availability).',
      'Intentional falsification of production data or simulation parameters is strictly prohibited and may result in disciplinary action.',
      'Users must ensure that any data exported from the Platform is handled according to the company’s Data Classification Policy.',
    ],
  },
  {
    id: 'section-5',
    title: '5. Confidentiality & Intellectual Property',
    points: [
      'All data contained within PC_Reforming, including production logic, simulation algorithms, and plant layout data, is classified as "Strictly Confidential."',
      'Users shall not disclose, copy, or distribute any screenshots, reports, or data from the Platform to external parties without explicit written approval.',
      'All intellectual property rights related to the Platform and its generated content belong solely to the Company.',
    ],
  },
  {
    id: 'section-6',
    title: '6. Prohibited Activities',
    points: [
      'Reverse engineering, decompiling, or disassembling any portion of the Platform code.',
      'Using the Platform to store or transmit malicious code, viruses, or harmful data.',
      'Conducting load testing or penetration testing without prior authorization from the IT Security Team.',
    ],
  },
  {
    id: 'section-7',
    title: '7. Limitation of Liability',
    points: [
      'The Company makes no warranties regarding the absolute accuracy of simulation predictions vs. actual production results.',
      'The Development Team shall not be liable for any operational delays or losses resulting from system downtime, data errors, or misuse of the Platform.',
    ],
  },
];