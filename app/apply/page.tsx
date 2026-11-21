"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    applicant_name: "",
    phone_number: "",
    service_name: "नवीन पॅन कार्ड",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.from("applications").insert([
        {
          applicant_name: formData.applicant_name,
          phone_number: formData.phone_number,
          service_name: formData.service_name,
          notes: formData.notes,
          status: "Pending",
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage("अर्ज यशस्वीरीत्या जमा झाला आहे! आम्ही लवकरच संपर्क करू.");
      setFormData({
        applicant_name: "",
        phone_number: "",
        service_name: "नवीन पॅन कार्ड",
        notes: "",
      });
    } catch (err: any) {
      setMessage(`त्रुटी आली: ${err.message || "काहीतरी चूक झाली"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-slate-800">AIRAVAT सेवा अर्ज</h1>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
            ← मागे जा
          </Link>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm font-medium ${
              message.includes("त्रुटी")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              पूर्ण नाव *
            </label>
            <input
              type="text"
              name="applicant_name"
              required
              value={formData.applicant_name}
              onChange={handleChange}
              placeholder="तुमचे नाव टाका"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              मोबाईल नंबर *
            </label>
            <input
              type="tel"
              name="phone_number"
              required
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="१० अंकी मोबाईल नंबर"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              आवश्यक सेवा निवडा *
            </label>
            <select
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="नवीन पॅन कार्ड">नवीन पॅन कार्ड</option>
              <option value="उत्पन्न दाखला">उत्पन्न दाखला</option>
              <option value="नवीन आधार कार्ड">नवीन आधार कार्ड</option>
              <option value="रेशन कार्ड सेवा">रेशन कार्ड सेवा</option>
              <option value="इतर अर्ज">इतर अर्ज</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              अधिक माहिती किंवा टीप (पर्यायी)
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="काही विशेष सूचना असल्यास इथे लिहा..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow transition-all ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "अर्ज जमा होत आहे..." : "अर्ज जमा करा (Submit)"}
          </button>
        </form>
      </div>
    </div>
  );
}