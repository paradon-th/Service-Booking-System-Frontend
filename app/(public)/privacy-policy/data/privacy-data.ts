export interface PolicySection {
  id: string;
  title: string;
  points: string[];
}

export const policyData: PolicySection[] = [
  {
    id: "1",
    title: "1. Introduction and Scope of Policy",
    points: [
      "Explanation that this policy covers the collection, use, and disclosure of personal data within the PC_Reforming system.",
      "Relationship with DENSO's main Data Privacy Policy / PDPA."
    ]
  },
  {
    id: "2",
    title: "2. Types of Personal Data Collected",
    points: [
      "Employee Information: Employee ID, Name-Surname, Email, Department, Position.",
      "System Access Data: User Account, Login/Logout times.",
      "Usage Data: Accessed screens, Plan approvals/edits, Transaction logs.",
      "Other personal data potentially entered by the user (if any)."
    ]
  },
  {
    id: "3",
    title: "3. Sources of Personal Data",
    points: [
      "Internal HR Systems / Active Directory / SSO.",
      "Information voluntarily entered by the user in the system.",
      "Automatically generated system data (Logs, Events, etc.)."
    ]
  },
  {
    id: "4",
    title: "4. Purposes of Personal Data Processing",
    points: [
      "To verify identity and define system access rights.",
      "To support production planning and approval processes.",
      "To create evidence and work trails (Audit Trail).",
      "To maintain system security and improve system performance.",
      "To comply with relevant laws or internal regulations."
    ]
  },
  {
    id: "5",
    title: "5. Legal Basis for Data Processing",
    points: [
      "Performance of contract / Job duties.",
      "Legitimate Interests of the company (e.g., system security).",
      "Compliance with relevant laws and regulations."
    ]
  },
  {
    id: "6",
    title: "6. Disclosure and Sharing of Personal Data",
    points: [
      "Internal departments that may access data, such as PC, Production, IT, Audit/Compliance.",
      "External service providers (e.g., IT infrastructure or Cloud providers), if any.",
      "Confirmation that personal data is not sold."
    ]
  },
  {
    id: "7",
    title: "7. Personal Data Retention Period",
    points: [
      "Specify retention principles or periods (e.g., Keep Logs for X years per regulations/policies).",
      "Upon expiration, data will be deleted, anonymized, or stored in a more restricted format."
    ]
  },
  {
    id: "8",
    title: "8. Data Security Measures",
    points: [
      "Role-based Access Control.",
      "Technical measures such as encryption, data backup, and system monitoring.",
      "Organizational measures such as Security policies and employee training."
    ]
  },
  {
    id: "9",
    title: "9. Rights of the Data Subject (Employees)",
    points: [
      "Right to access their own personal data (as appropriate).",
      "Right to request correction of inaccurate data.",
      "Channels for submitting requests or inquiries regarding personal data.",
      "Reference to procedures under DENSO's Data Privacy / PDPA policy."
    ]
  },
  {
    id: "10",
    title: "10. Cookies and Other Technical Data",
    points: [
      "If Cookies / Session Storage / other tracking techniques are used, summarize their purpose.",
      "Recording of IP address, device type, or browser for security purposes."
    ]
  },
  {
    id: "11",
    title: "11. Cross-Border Data Transfer (If Applicable)",
    points: [
      "If data is stored or processed abroad, specify the country/region and protection measures."
    ]
  },
  {
    id: "12",
    title: "12. Updates to the Privacy Policy",
    points: [
      "Notification of policy changes.",
      "Effective date of each version."
    ]
  },
  {
    id: "13",
    title: "13. Contact Channels Regarding Personal Data",
    points: [
      "Contact information of the Data Protection Officer (DPO) / relevant department.",
      "Methods for reporting complaints or inquiries."
    ]
  }
];