import React, { useState } from 'react';
import toast from 'react-hot-toast';
export default function ClientMailModal({ closeModal }) {
  const AvailableTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none";
  const UnavailableVerifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none";
  const UnavailableUnverifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none";
  const UpdateTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none";

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required');
      return;
    }

    try {
      setError('');
      setSending(true);

      const res = await fetch('http://localhost:3000/api/admin/mail-all-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      toast.success('Emails sent successfully');
      closeModal();
    } catch (e) {
      setError(e.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="flex flex-col justify-center items-center rounded-lg p-6 w-[90%] max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white raleway-bold text-2xl mb-4">Mail to Everyone</p>

        {error && <p className={UnavailableVerifiedTimeslotsStyle}>{error}</p>}

        <input
          type="text"
          placeholder="Subject"
          className="bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full mb-4"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Message"
          className="bg-white/10 focus:outline-none text-[#DDCA7D] raleway-regular border border-white/20 rounded-lg p-2 w-full h-32 resize-none mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex flex-row justify-end items-center gap-4 w-full">
          <button className={UnavailableUnverifiedTimeslotsStyle} onClick={closeModal}>
            Cancel
          </button>
          <button
            className={`${UpdateTimeslotsStyle} ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
