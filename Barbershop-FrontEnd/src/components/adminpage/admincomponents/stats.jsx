import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import NewUsersStats from './AdminSubcomponents/stats/NewUserCount';
import AppointmentCount from './AdminSubcomponents/stats/AppointmentCount';
import CutsCompleted from './AdminSubcomponents/stats/CutsCompleted';

export default function Stats() {
    const [open, setOpen] = useState(true);

    const HeaderPill =
        "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D]";

    return (
        <div className="flex hidden flex-col bg-black m-8 mt-4 p-4 rounded-lg gap-4 border border-white/20">
            {/* Top bar with chevron */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setOpen(v => !v)}>
                <p className="text-2xl raleway-bold text-white">Stats</p>
                <FaChevronDown
                    className={`text-white text-2xl transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                />
            </div>

            {/* Collapsible body */}
            {open && (
                <div className="flex flex-row gap-6 p-2 items-start justify-center">
                    <div className="flex flex-col gap-6">
                        <NewUsersStats />
                        <AppointmentCount />
                    </div>
                    <CutsCompleted />
                </div>
            )}
        </div>
    );
}
