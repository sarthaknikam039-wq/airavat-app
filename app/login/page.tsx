'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert("Error: " + error.message);
    } else {
      setOtpSent(true);
      alert("तुमच्या ईमेलवर ६ अंकी OTP पाठवला आहे!");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      alert("चुकीचा OTP: " + error.message);
    } else if (data.session) {
      alert("लॉगिन यशस्वी झाले!");
      router.push('/apply'); // लॉगिन झाल्यावर थेट अर्ज भरण्याच्या पानावर नेईल
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', padding: '16px' }}>
      <div style={{ maxWidth: '380px', width: '100%', padding: '28px', borderRadius: '16px', background: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>AIRAVAT Seva</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>अर्ज करण्यासाठी आपले खाते लॉगिन करा</p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              required
              placeholder="आपला ईमेल आयडी टाका"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }}
            />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
              {loading ? 'OTP पाठवत आहे...' : 'OTP मिळवा'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              required
              placeholder="ईमेलवरील ६ अंकी OTP टाका"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '16px', boxSizing: 'border-box', outline: 'none', textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
            />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
              {loading ? 'तपासत आहे...' : 'लॉगिन करा'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}