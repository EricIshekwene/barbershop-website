import React from 'react'
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EditProfileModal({ closeModal, client: initialClient, onUpdateSuccess }) {
  const [client, setClient] = useState(
    initialClient || { name: "", phone: "", email: "", status: false, instagram: "" }
  );
  const [error, setError] = useState("");

  // If the parent re-opens the modal with a new client, keep state in sync:
  React.useEffect(() => {
    setClient(initialClient || { name: "", phone: "", email: "", status: false, instagram: "" });
  }, [initialClient]);

  const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
  const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
  const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
  const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn  bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "

  const validateClient = (client) => {
    // Name: only letters + spaces (first and last)
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
    if (!nameRegex.test(client.name.trim())) {
      return "Name must contain first and last, letters only";
    }
  
    // Phone: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(client.phone)) {
      return "Phone must be a valid 10-digit number";
    }
  
    // Instagram: 1–30 chars, letters/numbers/._ allowed, no @
    const instaRegex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/;
    if (!instaRegex.test(client.instagram)) {
      return "Instagram must be 1–30 chars, letters/numbers/._ only, no @";
    }
  
    return null; 
  };
  
  const handleUpdate = async () => {
    const validationError = validateClient(client);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/admin/update-client`, {
        method: 'PATCH',
        body: JSON.stringify(client),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error("Failed to update client");
      }
      const data = await response.json();
      console.log("data", data);
      toast.success("Client updated successfully");
      if (onUpdateSuccess) onUpdateSuccess();
      closeModal();
    } catch (error) {
      console.error("❌ Error updating client:", error);
      setError("Failed to update client");
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={() => closeModal()}
    >

      <div
        className=' flex flex-col justify-center '
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-row items-center gap-2 self-center'>
          <p className='text-white self-center raleway-bold text-2xl'>Editing {client.name}</p>
          {client.status ? <button className={UpdateTimeslotsStyle} >  <TiTick className='text-green-300 text-xl' /> </button> : <button className={UnavailableVerifiedTimeslotsStyle} >  <ImCross className='text-red-300 text-xl' /> </button>}
        </div>
        {error && <p className={UnavailableVerifiedTimeslotsStyle}
        >{error}</p>}
        <div className='flex flex-col justify-center items-center gap-2'>
          <div className='flex flex-col justify-center items-center w-full'>
            <input type="text" placeholder='Name' value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })}
              className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
            <input type="text" placeholder='Phone' value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })}
              className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
            <input type="text" placeholder='Instagram' value={client.instagram} onChange={(e) => setClient({ ...client, instagram: e.target.value })}
              className='bg-white/10 text-[#DDCA7D] focus:outline-none raleway-regular border border-white/20 rounded-lg p-2 w-full m-4' />
          </div>

        </div>
        <div className='flex flex-row justify-end items-center gap-4 w-full'>
          <button className={UnavailableUnverifiedTimeslotsStyle}
            onClick={() => {
              console.log(client);
              client.status ? setClient({ ...client, status: false }) : setClient({ ...client, status: true });
            }}
          >{client.status ? "Unverify" : "Verify"}</button>
          <button className={UnavailableVerifiedTimeslotsStyle}
            onClick={() => closeModal()}
          >Close</button>
          <button onClick={handleUpdate} className={UpdateTimeslotsStyle}>Update</button>
        </div>
      </div>

    </div>

  )
}
