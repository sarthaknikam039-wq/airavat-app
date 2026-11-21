"use client";

import { useState } from "react";
import Link from "next/link";

interface VaultDoc {
  id: string;
  name: string;
  category: "Identity" | "Academic" | "Income/Caste";
  fileName: string;
  updatedAt: string;
}

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState<VaultDoc[]>([
    {
      id: "doc-1",
      name: "Identity Proof (Aadhaar / Voter)",
      category: "Identity",
      fileName: "aadhaar_card_verified.pdf",
      updatedAt: "2026-11-15",
    },
    {
      id: "doc-2",
      name: "PAN Card",
      category: "Identity",
      fileName: "pan_card_front.jpg",
      updatedAt: "2026-11-10",
    },
    {
      id: "doc-3",
      name: "10th / 12th Marksheet",
      category: "Academic",
      fileName: "hsc_marksheet.pdf",
      updatedAt: "2026-10-05",
    },
  ]);

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Header */}
      <header className="bg-[#0f172a] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-wider text-teal-400">
              AIRAVAT
            </span>
            <span className="text-xs bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
              Vault 🔐
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-300 hover:text-white transition"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {/* Info Card */}
        <div className="bg-teal-900 text-white rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Document Vault</h1>
            <p className="text-sm text-teal-200 mt-1">
              कागदपत्रे एकदाच सेव्ह करा. पुढील अर्जांसाठी पुन्हा-पुन्हा अपलोड करण्याची गरज नाही.
            </p>
          </div>
          <span className="text-xs bg-teal-800 text-teal-200 px-3 py-1.5 rounded-lg border border-teal-700">
            🔒 100% Encrypted & Reusable
          </span>
        </div>

        {/* Upload Mock Box */}
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 mb-8 text-center hover:bg-slate-50 transition cursor-pointer">
          <div className="text-3xl mb-2">📁</div>
          <h3 className="text-sm font-bold text-slate-800">
            Upload New Document to Vault
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            PDF, JPG, PNG (जास्तीत जास्त 5MB). सेव्ह केलेले डॉक्युमेंट पुढील सर्व सर्व्हिसेसमध्ये वापरता येईल.
          </p>
          <button className="mt-3 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition">
            Choose File
          </button>
        </div>

        {/* Saved Documents List */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Saved Documents ({documents.length})
          </h2>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-teal-400 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
                    📄
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-xs text-slate-500">
                      {doc.fileName} • {doc.category} • Updated: {doc.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className="text-xs text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md font-medium">
                    Verified
                  </span>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}