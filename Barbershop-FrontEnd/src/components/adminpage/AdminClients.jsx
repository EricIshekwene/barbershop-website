import React, { useState, useEffect} from 'react'
import AdminTitle from './admincomponents/AdminTitle'
import { FaChevronDown } from "react-icons/fa";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import MailModal from './admincomponents/AdminSubcomponents/MailModal'
import EditProfileModal from './admincomponents/AdminSubcomponents/EditProfileModal'

const fakeClients = [
    {
        name: "John Doe",
        phone: "(555) 123-4567",
        email: "john.doe@email.com",
        instagram: "@johndoe",
        verified: true
    },
    {
        name: "Jane Smith",
        phone: "(555) 987-6543",
        email: "jane.smith@email.com",
        instagram: "@janesmith",
        verified: false
    },
    {
        name: "Carlos Rivera",
        phone: "(555) 222-3333",
        email: "carlos.rivera@email.com",
        instagram: "@carlosr",
        verified: true
    }
];


export default function AdminClients() {
    const [showClients, setShowClients] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [error, setError] = useState('');
    const [clients, setClients] = useState([]);
    const handleToggleClients = () => {
        setShowClients(!showClients);
    }
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "
    
    const [clientCount, setClientCount] = useState(0);
    const [mailModal, setMailModal] = useState(false)
    const [editProfileModal, setEditProfileModal] = useState(false)
    const closeModal = () => {
        setMailModal(false)
        setEditProfileModal(false)
    }
    useEffect(() => {
  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/verified-clients', {
        headers: { Accept: 'application/json' },
        // credentials: 'include', // uncomment if your API uses cookies/session
      });

      const contentType = res.headers.get('content-type') || '';
      const bodyText = await res.text(); // read raw first for diagnostics

      if (!res.ok) {
        // backend returned an error page or message
        if (contentType.includes('application/json')) {
          const err = JSON.parse(bodyText);
          throw new Error(err.error || `HTTP ${res.status}`);
        } else {
          // Likely HTML; show a short snippet
          throw new Error(`HTTP ${res.status}. Non-JSON response: ${bodyText.slice(0, 120)}...`);
        }
      }

      if (!contentType.includes('application/json')) {
        // 200 but HTML? probably hit the wrong server/route or got SPA index.html
        throw new Error(`Expected JSON but got: ${contentType}. Snippet: ${bodyText.slice(0, 120)}...`);
      }

      const data = JSON.parse(bodyText);
      setClients(data.clients);
      setClientCount(data.count);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching clients:', err);
      setError(err.message || 'Failed to fetch clients');
    }
  };

  fetchClients();
}, []);

    return (
        <div className='flex flex-col  bg-black'>        
            <div className='flex flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border-1 border-white/20'>
                <div className='flex flex-row items-center gap-2'>
                    <p className='text-2xl raleway-bold text-white'>Clients</p> 
                    <div className={AvailableTimeslotsStyle}>
                        <p>{clientCount}</p>
                    </div>
                    <FaChevronDown className={`text-white text-2xl transition-transform duration-200 ${showClients ? 'rotate-90' : ''}`}
                    onClick={handleToggleClients}
                    />
                    {showClients && <input type="text" placeholder='Search' className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-2 w-1/4 focus:outline-none' />}
                </div>
                <div className='flex flex-row bg-white/10 border border-white/20 rounded-lg p-4 gap-5 font-semibold text-[#DDCA7D] raleway-regular'>
                    <div className="w-7/40">Name</div>
                    <div className="w-7/40">Phone</div>
                    <div className="w-7/40">Email</div>
                    <div className="w-7/40">Instagram</div>
                    <div className="w-7/40">Verified</div>
                    <MdEmail className='text-white text-2xl'
                    onClick={() => setMailModal(!mailModal)}
                    />
                </div>
                {showClients && clients.map((client, idx) => (
                    <div 
                        key={idx}
                        className='flex flex-row bg-white/5 border border-white/10 rounded-lg p-4 gap-5 font-medium text-[#DDCA7D] raleway-regular items-center'
                    >
                        <div className="w-7/40">{client.name}</div>
                        <div className="w-7/40">{client.phone}</div>
                        <div className="w-7/40">{client.email}</div>
                        <div className="w-7/40">{client.instagram}</div>
                        <div className="w-7/40">
                            {client.verified ? (
                                <span className="text-green-400 font-bold">Yes</span>
                            ) : (
                                <span className="text-red-400 font-bold">No</span>
                            )}
                        </div>
                       
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#DDCA7D] bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-[#DDCA7D]/50 transition-all duration-200"
                        />
                        <MdModeEditOutline className='text-white text-2xl'
                        onClick={() => setEditProfileModal(!editProfileModal)}
                        />
                        <MdDelete className='text-red-500 text-2xl' />
                        
                    </div>
                ))}
                {error && <div 
                        
                        className={UnavailableVerifiedTimeslotsStyle}
                    >
                        <p className='text-center'>{error}</p>
                        
                    </div>
                }
            </div>
            {mailModal && <MailModal name={selectedClient ? selectedClient.name : "Everyone"} closeModal={closeModal} />}
            {editProfileModal && <EditProfileModal name={selectedClient ? selectedClient.name : "Everyone"} closeModal={closeModal} />}
        </div>
    )
}