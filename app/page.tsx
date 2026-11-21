'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function AiravatApp() {
  // Screens: 'loading' | 'email_otp' | 'set_pin' | 'enter_pin' | 'dashboard'
  const [screen, setScreen] = useState<'loading' | 'email_otp' | 'set_pin' | 'enter_pin' | 'dashboard'>('loading');

  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // PIN states
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    applicant_name: '',
    phone_number: '',
    service_name: 'नवीन पॅन कार्ड',
    notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [myApplications, setMyApplications] = useState<any[]>([]);

  // 1. App सुरू झाल्यावर session आणि PIN तपासणे (Persistent Login)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleInitialAuth(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSession(null);
        setScreen('email_otp');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleInitialAuth = (currentSession: any) => {
    if (!currentSession) {
      setScreen('email_otp');
    } else {
      setSession(currentSession);
      const savedPin = localStorage.getItem(`airavat_pin_${currentSession.user.id}`);
      if (savedPin) {
        setScreen('enter_pin'); // PIN आधीच सेट असेल तर PIN मागणे
      } else {
        setScreen('set_pin'); // नसेल तर नवा PIN सेट करायला सांगणे
      }
    }
  };

  // 2. Email वर OTP पाठवणे
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert('त्रुटी: ' + error.message);
    } else {
      setOtpSent(true);
      alert('तुमच्या ईमेलवर ६ अंकी OTP पाठवला आहे!');
    }
    setLoading(false);
  };

  // 3. OTP Verify करणे
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      alert('चुकीचा OTP: ' + error.message);
    } else if (data.session) {
      setSession(data.session);
      const savedPin = localStorage.getItem(`airavat_pin_${data.session.user.id}`);
      if (savedPin) {
        setScreen('dashboard');
        fetchUserApplications(data.session.user.id);
      } else {
        setScreen('set_pin');
      }
    }
    setLoading(false);
  };

  // 4. नवा ४ अंकी PIN सेट करणे
  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4) {
      alert('पिन फक्त ४ अंकांचा असावा!');
      return;
    }
    if (pinInput !== confirmPinInput) {
      alert('दोन्ही पिन जुळत नाहीत!');
      return;
    }
    if (session) {
      localStorage.setItem(`airavat_pin_${session.user.id}`, pinInput);
      alert('पिन यशस्वीरीत्या सेट झाला!');
      setScreen('dashboard');
      fetchUserApplications(session.user.id);
    }
  };

  // 5. सेव्ह केलेला PIN तपासून आत जाणे
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    const savedPin = localStorage.getItem(`airavat_pin_${session.user.id}`);
    if (pinInput === savedPin) {
      setScreen('dashboard');
      fetchUserApplications(session.user.id);
    } else {
      alert('चुकीचा पिन! पुन्हा प्रयत्न करा.');
      setPinInput('');
    }
  };

  // 6. User चा जुना डेटा Supabase मधून आणणे (Cloud Backup)
  const fetchUserApplications = async (userId: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMyApplications(data);
    }
  };

  // 7. अर्ज सबमिट करणे (User ID जोडून)
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setFormLoading(true);
    setFormMsg('');

    try {
      const { error } = await supabase.from('applications').insert([
        {
          user_id: session.user.id,
          applicant_name: formData.applicant_name,
          phone_number: formData.phone_number,
          service_name: formData.service_name,
          notes: formData.notes,
          status: 'Pending',
        },
      ]);

      if (error) throw error;

      setFormMsg('अर्ज यशस्वीरीत्या जमा झाला आहे!');
      setFormData({ applicant_name: '', phone_number: '', service_name: 'नवीन पॅन कार्ड', notes: '' });
      fetchUserApplications(session.user.id);
    } catch (err: any) {
      setFormMsg(`त्रुटी: ${err.message || 'काहीतरी चूक झाली'}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setOtpSent(false);
    setEmail('');
    setOtp('');
    setPinInput('');
    setScreen('email_otp');
  };

  // --- RENDERING SCREENS ---

  if (screen === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#475569', fontWeight: 600 }}>ॲप सुरू होत आहे...</p>
      </div>
    );
  }

  // SCREEN 1: EMAIL OTP
  if (screen === 'email_otp') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: '16px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '360px', width: '100%', padding: '28px', borderRadius: '16px', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>AIRAVAT Seva</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>सुरू करण्यासाठी आपला ईमेल व्हेरिफाय करा</p>

          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                required
                placeholder="आपला ईमेल आयडी टाका"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '14px', boxSizing: 'border-box' }}
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? 'OTP पाठवत आहे...' : 'OTP मिळवा'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                required
                placeholder="६ अंकी OTP टाका"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '14px', boxSizing: 'border-box', textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? 'तपासत आहे...' : 'लॉगिन करा'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // SCREEN 2: SET 4-DIGIT PIN
  if (screen === 'set_pin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: '16px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '360px', width: '100%', padding: '28px', borderRadius: '16px', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>४ अंकी पिन सेट करा</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>पुढच्या वेळी ॲप उघडताना थेट पिनने लॉगिन करता येईल</p>

          <form onSubmit={handleSaveNewPin}>
            <input
              type="password"
              maxLength={4}
              required
              placeholder="नवा ४ अंकी पिन"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px', boxSizing: 'border-box', textAlign: 'center', fontSize: '20px' }}
            />
            <input
              type="password"
              maxLength={4}
              required
              placeholder="पिन पुन्हा टाका"
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', boxSizing: 'border-box', textAlign: 'center', fontSize: '20px' }}
            />
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              पिन सेव्ह करा
            </button>
          </form>
        </div>
      </div>
    );
  }

  // SCREEN 3: ENTER 4-DIGIT PIN
  if (screen === 'enter_pin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: '16px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '360px', width: '100%', padding: '28px', borderRadius: '16px', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>AIRAVAT लॉक</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>ॲप उघडण्यासाठी आपला ४ अंकी पिन टाका</p>

          <form onSubmit={handleVerifyPin}>
            <input
              type="password"
              maxLength={4}
              required
              autoFocus
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', boxSizing: 'border-box', textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
            />
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              उघडा
            </button>
          </form>

          <button onClick={handleLogout} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}>
            दुसऱ्या खात्याने लॉगिन करा
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 4: DASHBOARD & APPLICATION FORM
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>AIRAVAT सेवा</h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>{session?.user?.email}</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            लॉगआउट
          </button>
        </div>

        {formMsg && (
          <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', background: formMsg.includes('त्रुटी') ? '#fef2f2' : '#f0fdf4', color: formMsg.includes('त्रुटी') ? '#991b1b' : '#166534' }}>
            {formMsg}
          </div>
        )}

        <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>पूर्ण नाव *</label>
            <input
              type="text"
              required
              value={formData.applicant_name}
              onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
              placeholder="नाव टाका"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>मोबाईल नंबर *</label>
            <input
              type="tel"
              required
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="१० अंकी नंबर"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>आवश्यक सेवा *</label>
            <select
              value={formData.service_name}
              onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#fff' }}
            >
              <option value="नवीन पॅन कार्ड">नवीन पॅन कार्ड</option>
              <option value="उत्पन्न दाखला">उत्पन्न दाखला</option>
              <option value="नवीन आधार कार्ड">नवीन आधार कार्ड</option>
              <option value="रेशन कार्ड सेवा">रेशन कार्ड सेवा</option>
              <option value="इतर अर्ज">इतर अर्ज</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>टीप (पर्यायी)</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="काही सूचना असल्यास..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" disabled={formLoading} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {formLoading ? 'अर्ज जमा होत आहे...' : 'अर्ज जमा करा (Submit)'}
          </button>
        </form>

        {/* User Che Purane Arj (Cloud Backup) */}
        <div style={{ marginTop: '28px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>माझे आधीचे अर्ज</h3>
          {myApplications.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>अजून कोणताही अर्ज भरलेला नाही.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myApplications.map((app) => (
                <div key={app.id} style={{ padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#334155' }}>{app.service_name}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{app.applicant_name} ({app.phone_number})</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: app.status === 'Approved' ? '#dcfce7' : '#fef9c3', color: app.status === 'Approved' ? '#15803d' : '#854d0e' }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}