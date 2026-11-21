'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Application {
  id: string | number;
  created_at: string;
  applicant_name: string;
  phone?: string;
  mobile?: string;
  service_name: string;
  status: string;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(id: string | number, newStatus: string) {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } else {
      alert('Status badaltana truti aali!');
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AIRAVAT Seva - Admin Panel</h1>
            <p className="text-sm text-slate-500">Jama zalele sarv arj ani sthiti vyavasthapan</p>
          </div>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-slate-600">Mahiti load hot ahe...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center text-slate-500">
            Kontaahi arj uplabdh nahi.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-sm">
                  <th className="p-4">Tarikh</th>
                  <th className="p-4">Nav</th>
                  <th className="p-4">Seva</th>
                  <th className="p-4">Sadyachi Sthiti</th>
                  <th className="p-4 text-right">Kruti (Status Badla)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-500">
                      {new Date(app.created_at).toLocaleDateString('mr-IN')}
                    </td>
                    <td className="p-4 font-medium">{app.applicant_name}</td>
                    <td className="p-4">{app.service_name}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'Approved' || app.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : app.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {app.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => updateStatus(app.id, 'Approved')}
                        className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-md hover:bg-green-100 text-xs font-medium cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, 'Rejected')}
                        className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 text-xs font-medium cursor-pointer"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}