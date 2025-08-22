import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function DeleteModal({ client, closeModal, onDeleteSuccess }) {
  const AvailableTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none";
  const UnavailableVerifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none";
  const UnavailableUnverifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleDelete = async () => {
    if (!client?.email) {
      setError("Missing client email.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/admin/delete-client', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete client');

      toast.success(`Deleted ${client.name}`);
      onDeleteSuccess?.();  
      closeModal();         
    } catch (err) {
      console.error('❌ Delete failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="flex flex-col gap-6 justify-center items-center rounded-lg p-6 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6 justify-center items-center">
          <p className="bg-white/10 text-white text-center focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4">
            Are you sure you want to delete <span className="text-[#DDCA7D]">{client?.name}</span>?
          </p>
          {error && <p className={UnavailableVerifiedTimeslotsStyle}>{error}</p>}
          <div className="flex flex-row justify-center items-center gap-4 w-full">
            <button onClick={closeModal} className={UnavailableUnverifiedTimeslotsStyle}>
              Back
            </button>
            <button
              onClick={handleDelete}
              className={`${UnavailableVerifiedTimeslotsStyle} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Deleting…' : 'Delete Client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
