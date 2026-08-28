export const mockAnalyticsStats = {
  totalAnalyzed: 24890,
  authenticCount: 18920,   // 0-15% Score -> AUTHENTIC
  suspiciousCount: 4210,   // 16-84% Score -> SUSPICIOUS
  forgeryCount: 1760,      // 85-100% Score -> FORGERY
  accuracyRate: "99.96%",
  avgPipelineLatency: "119 ms",
  activeMonitors: 48,
  sectors: [
    { id: "hr", name: "HR & Resumes", docTypes: "Resumes, Employment Certificates", count: 4210, riskCount: 92, icon: "badge" },
    { id: "kyc", name: "KYC & Passports", docTypes: "Passports, National IDs", count: 7420, riskCount: 412, icon: "fingerprint" },
    { id: "finance", name: "Finance & Bills", docTypes: "Invoices, Bank Statements", count: 6890, riskCount: 820, icon: "receipt_long" },
    { id: "academic", name: "Academic & Diplomas", docTypes: "Diplomas, Transcripts", count: 2840, riskCount: 38, icon: "school" },
    { id: "legal", name: "Legal & Contracts", docTypes: "NDAs, Agreements", count: 1980, riskCount: 44, icon: "gavel" },
    { id: "medical", name: "Medical Claims", docTypes: "Insurance Claims, Prescriptions", count: 1550, riskCount: 154, icon: "health_and_safety" }
  ]
};

export const mockSampleDocuments = [
  {
    id: "sample-finance-1",
    name: "TechCorp_Commercial_Invoice_Forged.pdf",
    sector: "Finance",
    sectorId: "finance",
    type: "Commercial Invoice",
    verdict: "FORGERY",
    riskScore: 88.5,
    softwareFootprint: "Adobe Photoshop CC 2023",
    summary: "Layer 1 detected Photoshop EXIF tags. Layer 4 Benford's Law flagged non-standard number distribution. Layer 6 Gemini LLM caught math disparity ($1,200 + $120 != $1,800).",
    preview: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
    layers: {
      layer1Exif: { score: 95, detail: "Software Tag: 'Adobe Photoshop CC 2023 (Macintosh)' detected in EXIF byte header.", passed: false },
      layer2Ela: { score: 92, detail: "Error Level Analysis: High-frequency compression anomaly around Total Amount box.", passed: false },
      layer3Sharpness: { score: 88, detail: "Laplacian Edge Analysis: Text overlay sharpness mismatch (Font re-rendered over scan).", passed: false },
      layer4Benford: { score: 82, detail: "Benford's Law First-Digit Audit: Numeric distribution Chi-Square score 14.2 (Deviates from log distribution).", passed: false },
      layer5Checksum: { score: 0, detail: "No structured ID present on invoice (Checksum Skipped).", passed: true },
      layer6Gemini: { score: 98, detail: "Gemini Multimodal AI: Mathematical parity fail. Line items ($1,200) + Tax ($120) = $1,320, but declared total is $1,800.", passed: false }
    }
  },
  {
    id: "sample-kyc-1",
    name: "US_Passport_JohnDoe_Tampered.jpg",
    sector: "KYC",
    sectorId: "kyc",
    type: "Passport & National ID",
    verdict: "SUSPICIOUS",
    riskScore: 58.4,
    softwareFootprint: "Apple iOS 17.5 Camera",
    summary: "Layer 5 Cryptographic Checksum passed (Luhn Mod-10 valid), but Layer 3 Laplacian Sharpness flagged photo edge overlay. Requires human reviewer confirmation.",
    preview: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60",
    layers: {
      layer1Exif: { score: 10, detail: "ExifRead: Native mobile capture software footprint.", passed: true },
      layer2Ela: { score: 48, detail: "ELA Engine: Minor re-compression variance near facial photo border.", passed: true },
      layer3Sharpness: { score: 76, detail: "Laplacian Inspector: Edge sharpness discrepancy on photo boundary.", passed: false },
      layer4Benford: { score: 0, detail: "Benford Law: Not applicable for ID document.", passed: true },
      layer5Checksum: { score: 0, detail: "Verhoeff & Luhn Checksum: Passport MRZ line 2 checksum algorithms VALID.", passed: true },
      layer6Gemini: { score: 45, detail: "Gemini Multimodal: Expiration date 2030 lines up with issue date 2020.", passed: true }
    }
  },
  {
    id: "sample-academic-1",
    name: "Stanford_University_Diploma_Authentic.pdf",
    sector: "Academic",
    sectorId: "academic",
    type: "Degree Certificate",
    verdict: "AUTHENTIC",
    riskScore: 3.8,
    softwareFootprint: "Native PDF / Registrar Signature",
    summary: "100% authentic document. All 6 forensic layers passed with zero anomalies. Vector signatures and metadata intact.",
    preview: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
    layers: {
      layer1Exif: { score: 0, detail: "ExifRead: Official university digital seal PKI header.", passed: true },
      layer2Ela: { score: 4, detail: "ELA Engine: Uniform compression grid throughout document.", passed: true },
      layer3Sharpness: { score: 2, detail: "Laplacian Inspector: Smooth uniform text rendering.", passed: true },
      layer4Benford: { score: 0, detail: "Benford Law: Passed.", passed: true },
      layer5Checksum: { score: 0, detail: "Checksum Audit: Student ID format matches Stanford registrar standard.", passed: true },
      layer6Gemini: { score: 1, detail: "Gemini Multimodal: Degree title, honors, and graduation date structurally consistent.", passed: true }
    }
  }
];

export const mockWorklistQueue = [
  {
    id: "CASE-2026-8801",
    documentName: "TechCorp_Commercial_Invoice_Forged.pdf",
    sector: "Finance",
    sectorId: "finance",
    documentType: "Commercial Invoice",
    verdict: "FORGERY",
    verdictColor: "bg-red-500/20 text-red-400 border-red-500/40",
    riskScore: 88.5,
    submittedBy: "Customer App Ingestion",
    timestamp: "2026-08-28 18:20:10 UTC",
    software: "Adobe Photoshop CC 2023",
    assignedReviewer: "Unassigned Queue",
    layersFailed: ["Layer 1 (EXIF)", "Layer 2 (ELA)", "Layer 3 (Sharpness)", "Layer 4 (Benford)", "Layer 6 (Gemini Math)"],
    easyExplanation: "This invoice was edited using Photoshop! The math doesn't add up ($1,200 subtotal + $120 tax is declared as $1,800 total).",
    preview: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "CASE-2026-8802",
    documentName: "US_Passport_JohnDoe_Tampered.jpg",
    sector: "KYC",
    sectorId: "kyc",
    documentType: "Passport & ID",
    verdict: "SUSPICIOUS",
    verdictColor: "bg-[#FFAB00]/20 text-[#FFAB00] border-[#FFAB00]/40",
    riskScore: 58.4,
    submittedBy: "Mobile KYC Portal",
    timestamp: "2026-08-28 17:55:00 UTC",
    software: "Apple iOS Camera",
    assignedReviewer: "Reviewer Desk #4",
    layersFailed: ["Layer 3 (Sharpness Edge)"],
    easyExplanation: "The photo area on this ID has abnormal edge sharpness, suggesting a photo swap attempt. Checksum math passed.",
    preview: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "CASE-2026-8803",
    documentName: "Employment_Verification_Letter.pdf",
    sector: "HR",
    sectorId: "hr",
    documentType: "Resumes & HR",
    verdict: "SUSPICIOUS",
    verdictColor: "bg-[#FFAB00]/20 text-[#FFAB00] border-[#FFAB00]/40",
    riskScore: 42.1,
    submittedBy: "HR Talent Portal",
    timestamp: "2026-08-28 16:40:12 UTC",
    software: "Canva Pro v2.4",
    assignedReviewer: "Reviewer Desk #2",
    layersFailed: ["Layer 1 (Canva EXIF)", "Layer 6 (Date Consistency)"],
    easyExplanation: "Created in Canva instead of company template. Dates of employment overlap impossibly with university degree dates.",
    preview: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "CASE-2026-8804",
    documentName: "Stanford_University_Diploma_Authentic.pdf",
    sector: "Academic",
    sectorId: "academic",
    documentType: "Diplomas & Degrees",
    verdict: "AUTHENTIC",
    verdictColor: "bg-[#97d700]/20 text-[#97d700] border-[#97d700]/40",
    riskScore: 3.8,
    submittedBy: "Academic Portal",
    timestamp: "2026-08-28 15:10:04 UTC",
    software: "Stanford Digital Registrar",
    assignedReviewer: "Auto-Approved",
    layersFailed: [],
    easyExplanation: "Everything is genuine! High resolution, digital signatures valid, and no editing tools detected.",
    preview: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60"
  }
];

export const plainEnglishTooltips = {
  exifScanner: "Checks the invisible digital fingerprint inside the file. It tells us the exact software used to create or edit it (like Photoshop or Canva).",
  elaForensics: "Error Level Analysis acts like an X-ray for images. It highlights regions that were resaved or edited at different compression levels.",
  laplacianSharpness: "Measures edge sharpness across text and images. If text was pasted onto an existing document scan, its edges won't match the background.",
  benfordLaw: "A mathematical principle stating that in genuine financial numbers, 1 appears as the first digit 30% of the time. Fabricated numbers break this pattern!",
  checksumAudit: "Validates ID numbers using standard mathematical algorithms (Verhoeff & Luhn) to catch fake or structurally impossible ID card numbers.",
  geminiAi: "Uses Google Gemini AI to read the document like a human expert, checking if dates line up logically and math calculations match perfectly."
};
