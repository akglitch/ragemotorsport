'use client';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-emerald-900">Message sent</h3>
          <p className="text-emerald-700 mt-1">Thanks, {form.name.split(' ')[0] || 'there'} — our team will get back to you within one business day.</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'General enquiry', message: '' }); }}
            className="mt-4 text-sm font-medium text-emerald-800 underline underline-offset-4 hover:text-emerald-900"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
          <input id="name" type="text" required value={form.name} onChange={update('name')} placeholder="Jane Doe" className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
          <input id="email" type="email" required value={form.email} onChange={update('email')} placeholder="jane@example.com" className="input-field" />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
        <select id="subject" value={form.subject} onChange={update('subject')} className="input-field cursor-pointer">
          <option>General enquiry</option>
          <option>Booking a test drive</option>
          <option>Financing question</option>
          <option>Selling my vehicle</option>
          <option>Support</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea id="message" required rows={5} value={form.message} onChange={update('message')} placeholder="How can we help?" className="input-field resize-none" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto disabled:opacity-70">
        {loading ? 'Sending…' : <>Send message <Send size={16} /></>}
      </button>
    </form>
  );
}
