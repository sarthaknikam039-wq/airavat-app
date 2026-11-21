"use client";

import { useState } from "react";
import Link from "next/link";
import { servicesList, brandConfig } from "./servicesdata";
import { translations, Language } from "./translations";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const t = translations[lang];

  const categoryKeys: (keyof typeof t.categories)[] = [
    "All",
    "Government",
    "Education",
    "Schemes",
    "Jobs",
    "Digital",
  ];

  const filteredServices =
    selectedCategory === "All"
      ? servicesList
      : servicesList.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-wider text-teal-400">
              {brandConfig.name}
            </span>
            <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              India
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Switcher Dropdown */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-slate-800 text-teal-300 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-teal-400"
            >
              <option value="en">English (EN)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="hi">हिंदी (HI)</option>
            </select>

            <Link
              href="/vault"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition hidden sm:inline-block"
            >
              {t.vaultBtn}
            </Link>

            <Link
              href="/apply"
              className="text-xs text-slate-300 hover:text-white px-2 py-1.5 transition"
            >
              {t.trackBtn}
            </Link>

            <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition">
              {t.loginBtn}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-[#0f172a] text-white py-14 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block bg-slate-800/90 text-teal-300 border border-teal-500/30 text-xs px-3 py-1 rounded-full font-medium">
            {t.brandTagline}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {t.heroTitle} <br />
            <span className="text-teal-400">{t.heroSubtitle}</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/apply"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition text-sm"
            >
              {t.applyBtn}
            </Link>
            <Link
              href="/vault"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition text-sm"
            >
              {t.vaultBtn} 🔐
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid with Category Filter */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {t.availableServices}
            </h2>
            <p className="text-xs md:text-sm text-slate-600">{t.servicesSub}</p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                  selectedCategory === key
                    ? "bg-teal-500 text-slate-950 font-bold shadow"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {t.categories[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                    {t.categories[item.category as keyof typeof t.categories] || item.category}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      item.status === "Available"
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.status === "Available" ? t.applyNow : t.comingSoon}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{item.desc}</p>

                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100 mb-4 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{t.estFee}</span>
                    <strong className="text-slate-900">{item.charges}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.timeline}</span>
                    <strong className="text-slate-900">{item.processingTime}</strong>
                  </div>
                  <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    <strong>{t.requiredDocs}</strong> {item.requiredDocs.join(", ")}
                  </div>
                </div>
              </div>

              {item.status === "Available" ? (
                <Link
                  href="/apply"
                  className="w-full bg-slate-900 hover:bg-teal-600 text-white font-medium py-2 rounded-lg text-xs transition text-center block"
                >
                  {t.applyNow}
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-medium py-2 rounded-lg text-xs cursor-not-allowed text-center"
                >
                  {t.comingSoon}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Document Vault Notice */}
      <section className="bg-slate-100 border-t border-slate-200 py-8 px-4 mt-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <h4 className="font-bold text-slate-800">{t.vaultBannerTitle}</h4>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto">
            {t.vaultBannerDesc}
          </p>
        </div>
      </section>
    </div>
  );
}