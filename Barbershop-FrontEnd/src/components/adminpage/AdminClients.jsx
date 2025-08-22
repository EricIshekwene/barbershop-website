import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { FaChevronDown } from "react-icons/fa";
import { MdModeEditOutline, MdDelete, MdEmail } from "react-icons/md";
import ClientMailModal from './admincomponents/AdminSubcomponents/ClientMailModal';
import EditProfileModal from './admincomponents/AdminSubcomponents/EditProfileModal';
import DeleteModal from './admincomponents/AdminSubcomponents/DeleteModal';
const fakeClients = [
  { name: "John Doe", phone: "(555) 123-4567", email: "john.doe@email.com", instagram: "@johndoe", verified: true },
  { name: "Jane Smith", phone: "(555) 987-6543", email: "jane.smith@email.com", instagram: "@janesmith", verified: false },
  { name: "Carlos Rivera", phone: "(555) 222-3333", email: "carlos.rivera@email.com", instagram: "@carlosr", verified: true }
];

export default function AdminClients({  }) {
  const [showClients, setShowClients] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);

  const [mailModal, setMailModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [query, setQuery] = useState(""); // 🔎 search-by-name
  const [deleteModal, setDeleteModal] = useState(false);
  const AvailableTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none";
  const UnavailableVerifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none";

  const handleToggleClients = () => setShowClients((v) => !v);
  const closeModal = () => { setMailModal(false); setEditProfileModal(false); setDeleteModal(false);};
  const toEditPayload = (c) => ({
    name: c?.name ?? "",
    phone: (c?.phone ?? "").replace(/\D/g, ""),
    email: c?.email ?? "",
    instagram: (c?.instagram ?? "").replace(/^@/, ""),
    status: !!c?.verified,
  });
  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/verified-clients', {
        headers: { Accept: 'application/json' },
      });

      const contentType = res.headers.get('content-type') || '';
      const bodyText = await res.text();

      if (!res.ok) {
        if (contentType.includes('application/json')) {
          const err = JSON.parse(bodyText);
          throw new Error(err.error || `HTTP ${res.status}`);
        } else {
          throw new Error(`HTTP ${res.status}. Non-JSON response: ${bodyText.slice(0, 120)}...`);
        }
      }

      if (!contentType.includes('application/json')) {
        throw new Error(`Expected JSON but got: ${contentType}. Snippet: ${bodyText.slice(0, 120)}...`);
      }

      const data = JSON.parse(bodyText);
      setClients(Array.isArray(data.clients) ? data.clients : []);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching clients:', err);
      setError(err.message || 'Failed to fetch clients');
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // 🔁 Data source + filtering (NAME ONLY)
  const clientSource = clients.length ? clients : fakeClients;
  const norm = (v) => (v ?? '').toString().toLowerCase();
  const filteredClients = useMemo(
    () => clientSource.filter(c => norm(c.name).includes(norm(query))),
    [clientSource, query]
  );

  const total = clientSource.length;
  const shown = filteredClients.length;

  return (
    <div className='flex flex-col bg-black'>
      <div className='flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border border-white/20'>

        <div className='flex flex-row items-center gap-2'>
          <p className='text-2xl raleway-bold text-white'>Clients</p>

          {/* Count badge shows filtered/total when searching */}
          <div className={AvailableTimeslotsStyle}>
            <p>{shown}{query ? ` / ${total}` : ''}</p>
          </div>

          <FaChevronDown
            className={`text-white text-2xl transition-transform duration-200 ${showClients ? 'rotate-90' : ''}`}
            onClick={handleToggleClients}
          />

          {showClients && (
            <div className="relative w-1/4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                className="bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-full focus:outline-none"
              />
              {!!query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        {/* Header row */}
        <div className="grid grid-cols-6 bg-white/10 border border-white/20 rounded-lg p-4 gap-5 font-semibold text-[#DDCA7D] raleway-regular items-center">
          <div>Name</div>
          <div>Phone</div>
          <div>Email</div>
          <div>Instagram</div>
          <div>Verified</div>
          <MdEmail
            className="text-white text-2xl justify-self-center cursor-pointer"
            onClick={() => setMailModal(!mailModal)}
          />
        </div>

        {/* Rows container with scroll */}
        {showClients && (
          <div className="max-h-50 overflow-y-auto space-y-2 pr-1">
            {shown ? (
              filteredClients.map((client, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-6 bg-white/5 border border-white/10 rounded-lg p-4 gap-5 font-medium text-[#DDCA7D] raleway-regular items-center"
                >
                  <div>{client.name || "N/A"}</div>
                  <div>{client.phone || "N/A"}</div>
                  <div>{client.email || "N/A"}</div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      const ig = (client.instagram || '').replace(/^@/, '');
                      if (ig) window.open(`https://www.instagram.com/${ig}`, '_blank');
                    }}
                  >
                    {client.instagram || 'N/A'}
                  </div>
                  <div>
                    {client.verified ? (
                      <span className="text-green-400 font-bold">Yes</span>
                    ) : (
                      <span className="text-red-400 font-bold">No</span>
                    )}
                  </div>

                  <div className="flex gap-2 justify-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#DDCA7D] bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-[#DDCA7D]/50 transition-all duration-200"
                    />
                    <MdModeEditOutline
                      className="text-white text-2xl cursor-pointer"
                      onClick={() => {
                        setSelectedClient(toEditPayload(client));
                        setEditProfileModal(true);
                      }}
                    />
                    <MdDelete className="text-red-500 text-2xl cursor-pointer"
                      onClick={() => {
                        setSelectedClient(toEditPayload(client));
                        setDeleteModal(true);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 italic px-1">No matches.</p>
            )}
          </div>
        )}

        {error && (
          <div className={UnavailableVerifiedTimeslotsStyle}>
            <p className='text-center'>{error}</p>
          </div>
        )}
      </div>

      {mailModal && (
        <ClientMailModal closeModal={closeModal} />
      )}
      {editProfileModal && (
        <EditProfileModal
          client={selectedClient}
          closeModal={closeModal}
          onUpdateSuccess={fetchClients}
        />
      )}
      {deleteModal && (
        <DeleteModal
          client={selectedClient}
          closeModal={closeModal}
          onDeleteSuccess={() => {
            fetchClients();
           
          }}
        />
      )}
    </div>
  );
}
