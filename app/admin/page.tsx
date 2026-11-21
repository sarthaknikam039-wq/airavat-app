"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface ServiceRequest {
  id: number;
  created_at: string;
  tracking_id: string;
  full_name: string;
  mobile_number: string;
  category: string;
  service_name: string;
  notes: string | null;
  document_url: string | null;
  status: string;
}

export default function AdminPage() {
  const router = useRouter();

  // Admin Pin State (डिफॉल्ट सिक्रेट पिन: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Data states
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // 1. डेटाबेस मधून सर्व अर्ज आणणे
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      alert("डेटा आणताना एरर आला: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  // 2. पिन पडताळणी
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1234") {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("चुकीचा ॲडमिन पिन!");
    }
  };

  // 3. स्टेटस बदलणे (Pending <-> Completed)
  const handleStatusChange = async (id: number, currentStatus: string) => {
    setActionLoadingId(id);
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } catch (err: any) {
      alert("स्टेटस बदलता आले नाही: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. रेकॉर्ड डिलीट करणे
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("हा अर्ज कायमचा डिलीट करायचा आहे का?");
    if (!confirmDelete) return;

    setActionLoadingId(id);
    try {
      const { error } = await supabase
        .from("service_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err: any) {
      alert("डिलीट करताना त्रुटी आली: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // जर लॉगिन नसेल तर पिन स्क्रीन दाखवा
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-xs w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
          <h2 className="text-xl font-bold mb-1">AIRAVAT Admin</h2>
          <p className="text-slate-400 text-xs mb-4">फक्त मालकांसाठी (Secret PIN)</p>

          {pinError && (
            <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2 rounded-lg mb-3">
              {pinError}
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="पिन टाका (1234)"
              className="w-full text-center text-lg tracking-widest font-mono px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-xl text-sm transition"
            >
              डॅशबोर्ड उघडा
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ॲडमिन डॅशबोर्ड व्ह्यू
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">AIRAVAT Admin Portal</h1>
            <p className="text-slate-400 text-xs">
              सर्व ग्राहकांचे अर्ज आणि कागदपत्रे व्यवस्थापन
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRequests}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl transition"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-xs border border-slate-800 hover:bg-slate-900 text-slate-400 px-3 py-2 rounded-xl transition"
            >
              होमपेजवर जा
            </button>
          </div>
        </div>

        {/* Requests Table */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            अर्ज लोड होत आहेत...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm bg-slate-900/50 rounded-2xl border border-slate-800/80">
            सध्या कोणताही अर्ज आलेला नाही.
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                  <th className="p-3.5">तारीख</th>
                  <th className="p-3.5">ट्रॅकिंग ID</th>
                  <th className="p-3.5">ग्राहकाचे नांव</th>
                  <th className="p-3.5">मोबाईल नंबर</th>
                  <th className="p-3.5">सेवा</th>
                  <th className="p-3.5">सूचना (Notes)</th>
                  <th className="p-3.5">डॉक्युमेंट</th>
                  <th className="p-3.5">स्टेटस</th>
                  <th className="p-3.5 text-right">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="p-3.5 font-mono text-blue-400 font-semibold whitespace-nowrap">
                      {req.tracking_id}
                    </td>
                    <td className="p-3.5 font-medium text-white whitespace-nowrap">
                      {req.full_name}
                    </td>
                    <td className="p-3.5 font-mono whitespace-nowrap">
                      <a
                        href={`https://wa.me/91${req.mobile_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        {req.mobile_number}
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span className="text-white block font-medium">{req.service_name}</span>
                      <span className="text-[10px] text-slate-500">{req.category}</span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-slate-400">
                      {req.notes || "-"}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {req.document_url ? (
                        <a
                          href={req.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] hover:bg-blue-600 hover:text-white transition inline-block"
                        >
                          फाईल पाहा ↗
                        </a>
                      ) : (
                        <span className="text-slate-600">नाही</span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusChange(req.id, req.status)}
                        disabled={actionLoadingId === req.id}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                          req.status === "Completed"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {req.status}
                      </button>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}