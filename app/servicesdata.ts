export interface ServiceItem {
  id: string;
  name: string;
  category: "Government" | "Education" | "Schemes" | "Jobs" | "Digital";
  desc: string;
  charges: string;
  processingTime: string;
  requiredDocs: string[];
  status: "Available" | "Coming Soon";
}

export const brandConfig = {
  name: "AIRAVAT",
  tagline: "Professional Government & Digital Services",
};

export const servicesList: ServiceItem[] = [
  {
    id: "income-cert",
    name: "Income Certificate (उत्पन्न दाखला)",
    category: "Government",
    desc: "1 Year / 3 Years official income certificate for college & schemes.",
    charges: "₹100 - ₹150",
    processingTime: "3 to 5 Days",
    requiredDocs: ["Ration Card", "Identity Proof", "Talathi Income Report"],
    status: "Available",
  },
  {
    id: "domicile-cert",
    name: "Domicile & Nationality (अधिवास प्रमाणपत्र)",
    category: "Government",
    desc: "Proof of residence in Maharashtra for admissions & govt exams.",
    charges: "₹120 - ₹180",
    processingTime: "5 to 7 Days",
    requiredDocs: ["Birth Certificate / LC", "Identity Proof", "Residence Proof"],
    status: "Available",
  },
  {
    id: "caste-cert",
    name: "Caste Certificate (जात प्रमाणपत्र)",
    category: "Government",
    desc: "Official caste document for reserved category benefits.",
    charges: "₹150 - ₹200",
    processingTime: "7 to 15 Days",
    requiredDocs: ["Father's LC / TC", "Identity Proof", "Caste Proof"],
    status: "Available",
  },
  {
    id: "pan-service",
    name: "PAN Card (New / Correction)",
    category: "Government",
    desc: "Apply for fresh PAN or correct name, DOB and photo.",
    charges: "₹120 - ₹200",
    processingTime: "7 to 10 Days",
    requiredDocs: ["Identity Proof", "Address Proof", "Passport Photo"],
    status: "Available",
  },
  {
    id: "non-creamy",
    name: "Non-Creamy Layer (नॉन-क्रिमिलेअर)",
    category: "Government",
    desc: "OBC / VJNT / NT categories non-creamy layer validation.",
    charges: "₹150 - ₹200",
    processingTime: "5 to 7 Days",
    requiredDocs: ["3 Years Income Proof", "Caste Certificate", "Identity Proof"],
    status: "Coming Soon",
  },
  {
    id: "mahadbt",
    name: "MahaDBT Scholarship Form",
    category: "Education",
    desc: "Post-matric scholarship, tuition fee waiver & hostel allowance.",
    charges: "₹150 - ₹250",
    processingTime: "Same Day Submission",
    requiredDocs: ["Allotment Letter", "College Fee Receipt", "Income & Caste", "Marksheets"],
    status: "Available",
  },
  {
    id: "college-admission",
    name: "College & University Admission Forms",
    category: "Education",
    desc: "CAP round option form filling, university portal registration.",
    charges: "₹100 - ₹200",
    processingTime: "1 to 2 Hours",
    requiredDocs: ["Scorecard / Merit list", "HSC / SSC Marksheets"],
    status: "Available",
  },
  {
    id: "exam-forms",
    name: "Entrance & Semester Exam Forms",
    category: "Education",
    desc: "MHT-CET, JEE, NEET, University regular / backlog exam forms.",
    charges: "₹50 - ₹100",
    processingTime: "1 Hour",
    requiredDocs: ["Hall Ticket / PRN Number", "Photo & Signature"],
    status: "Available",
  },
  {
    id: "pm-kisan",
    name: "PM Kisan / Farmer Services",
    category: "Schemes",
    desc: "Farmer registration, eKYC & installment tracking.",
    charges: "₹50",
    processingTime: "Instant",
    requiredDocs: ["7/12 Extract", "Bank Passbook", "Identity Proof"],
    status: "Available",
  },
  {
    id: "ayushman-card",
    name: "Ayushman Bharat Card Assistance",
    category: "Schemes",
    desc: "₹5 Lakh health cover registration and e-card download.",
    charges: "₹50",
    processingTime: "Same Day",
    requiredDocs: ["Ration Card", "Identity Proof"],
    status: "Coming Soon",
  },
  {
    id: "police-bharti",
    name: "Maharashtra Police Bharti Application",
    category: "Jobs",
    desc: "Accurate form submission with photo-sign format specs.",
    charges: "₹100 - ₹150",
    processingTime: "Same Day",
    requiredDocs: ["12th Marksheet", "Domicile", "Caste (if applicable)"],
    status: "Available",
  },
  {
    id: "ssc-railway",
    name: "SSC / Railway / Banking Forms",
    category: "Jobs",
    desc: "Central & state competitive exam online form filling.",
    charges: "₹100 - ₹150",
    processingTime: "Same Day",
    requiredDocs: ["Graduation / 12th Details", "Photo & Signature"],
    status: "Available",
  },
  {
    id: "resume-pdf",
    name: "Resume Making & PDF Tools",
    category: "Digital",
    desc: "Clean professional resume builder, document size compressor.",
    charges: "₹50 - ₹100",
    processingTime: "Instant",
    requiredDocs: ["Bio details / Old Resume"],
    status: "Available",
  },
];