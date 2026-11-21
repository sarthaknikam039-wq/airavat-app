"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  // Authentication States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // OTP भेजने का फंक्शन
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      setStep("otp");
      setMessage("Testing OTP: 123456 या अपना ईमेल चेक करें");
    } catch (err: any) {
      setStep("otp");
      setMessage("Testing OTP: 123456 का उपयोग करें");
    } finally {
      setLoading(false);
    }
  };

  // OTP वेरीफाई करने का फंक्शन
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setMessage("");

    try {
      // 123456 डालते ही सीधा लॉगिन बाईपास
      if (otp === "123456") {
        if (typeof window !== "undefined") {
          localStorage.setItem("airavat_user", JSON.stringify({ email }));
        }
        setShowAuthModal(false);
        router.push("/apply");
        return;
      }

      // Supabase रियल वेरिफिकेशन
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (data.session) {
        setShowAuthModal(false);
        router.push("/apply");
      }
    } catch (err: any) {
      setMessage("अमान्य OTP! कृपया '123456' डालकर लॉगिन करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-wider text-white">
              AIRAVAT <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-normal">INDIA</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/track")}
              className="text-xs md:text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60"
            >
              Track Request
            </button>
            <button
              onClick={handleApplyClick}
              className="text-xs md:text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-1.5 rounded-lg transition"
            >
              Login / Apply
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-5xl mx-auto px-4 pt-16 pb-20 text-center flex flex-col items-center justify-center">
        <div className="inline-block bg-blue-950/70 border border-blue-800/60 text-blue-300 text-xs px-3 py-1 rounded-full mb-6 font-medium">
          Professional Government & Digital Services
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Complicated Forms? <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            AIRAVAT Team Handles It For You.
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-sm md:text-lg mb-8 leading-relaxed">
          Upload your requirements once. Our expert staff prepares, verifies, and submits your
          applications accurately with end-to-end tracking.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleApplyClick}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition text-base"
          >
            Apply For Service
          </button>
          <button
            onClick={() => router.push("/track")}
            className="border border-slate-700 hover:border-slate-600 bg-slate-900/80 text-slate-200 px-6 py-3.5 rounded-xl transition text-base"
          >
            Track Status
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="font-semibold text-white mb-2">Upload Details</h3>
            <p className="text-sm text-slate-400">
              Submit your basic documents and instructions securely through our portal.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="font-semibold text-white mb-2">Expert Review</h3>
            <p className="text-sm text-slate-400">
              Our specialists verify every parameter to prevent rejection or delays.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="font-semibold text-white mb-2">Instant Delivery</h3>
            <p className="text-sm text-slate-400">
              Get final acknowledgment receipts and submitted files directly to your vault.
            </p>
          </div>
        </div>
      </section>

      {/* Login & OTP Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white text-center mb-1">
              AIRAVAT Portal Login
            </h2>
            <p className="text-slate-400 text-xs text-center mb-6">
              सेवा अर्ज भरण्यासाठी 6-अंकी कोड टाकून लॉगिन करा
            </p>

            {message && (
              <div className="bg-blue-950/80 border border-blue-800 text-blue-300 text-xs p-3 rounded-lg text-center mb-4">
                {message}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition text-sm"
                >
                  {loading ? "Sending..." : "Get OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-center text-lg tracking-widest focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                    (टेस्टिंगसाठी थेट <span className="text-blue-400 font-bold">123456</span> टाका)
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-xl transition text-sm"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-slate-400 hover:text-slate-200 text-xs py-1"
                >
                  Use different email
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © 2026 AIRAVAT INDIA. All rights reserved.
      </footer>
    </div>
  );
}