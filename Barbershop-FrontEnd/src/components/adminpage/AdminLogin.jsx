import React from 'react' 
import { MdLogin } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
export default function AdminLogin() {
    const UnavailableVerifiedTimeslotsStyle =
    "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none";
 
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log(email, password);
            const res = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            console.log(res);
            const data = await res.json();

            if (res.ok) {
                console.log(data);
                navigate('/admin');
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className='flex flex-col bg-black items-center justify-center h-screen gap-4'>
            <MdLogin className='text-6xl text-[#DDCA7D]' />
            {error && <div className={UnavailableVerifiedTimeslotsStyle}>{error}</div>}
            <form className='flex flex-col items-center justify-center gap-4' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Email'
                    className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-4 w-80 text-lg'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder='Password'
                    className='bg-white/10 text-white raleway-regular border border-white/20 rounded-lg p-4 w-80 text-lg'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'
                    className='bg-[#DDCA7D] raleway-bold text-[#1c1808] px-16 py-4 rounded-lg text-xl font-bold uppercase tracking-wide shadow-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-2'
                >Login</button>
            </form>
        </div>
    )
}