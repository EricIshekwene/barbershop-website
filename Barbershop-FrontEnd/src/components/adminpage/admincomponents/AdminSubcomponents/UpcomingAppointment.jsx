import React, { useState } from 'react'
import { FaInstagram } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import MailModal from './MailModal'
import EditProfileModal from './EditProfileModal'
import CancelAppointment from './CancelAppointment'
import ApproveAppointment from './ApproveAppointment'

export default function UpcomingAppointment({ onCancelled, name, email, time, date, service, instagram, bookingStatus, status, refreshAppointments }) {
    const AvailableTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-white/10 backdrop-blur-sm border border-white/20 text-[#DDCA7D] hover:bg-white/20 hover:shadow-md transition-all duration-300 focus:outline-none"
    const UnavailableVerifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 opacity-70 hover:bg-red-500/30 transition-all duration-300 focus:outline-none"
    const UnavailableUnverifiedTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-yellow-400/10 backdrop-blur-sm border border-yellow-300 text-yellow-300 hover:bg-yellow-400/20 hover:shadow transition-all duration-30 focus:outline-none"
    const UpdateTimeslotsStyle = "px-4 py-2 rounded-xl text-sm font-semibold montserrat-navbar-btn bg-green-500/20 backdrop-blur-sm border border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-md transition-all duration-300 focus:outline-none "
    const [mailModal, setMailModal] = useState(false)
    const [cancelAppointmentModal, setCancelAppointmentModal] = useState(false)
    const [approveAppointmentModal, setApproveAppointmentModal] = useState(false)
    const closeModal = () => {
        setMailModal(false)
        setCancelAppointmentModal(false)
        setApproveAppointmentModal(false)
        refreshAppointments()
    }
    const emergencyCutStyle = "flex flex-row justify-start items-start bg-red-500/10  border border-red-400/20 rounded-lg p-4 gap-4"
    const regularCutStyle = "flex flex-row justify-start items-start bg-white/10  border border-white/20 rounded-lg p-4 gap-4"
     const formatDate = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    const formatTime = (timeStr) =>
        timeStr ? timeStr.slice(0, 5) : "";
    return (
        <div className={service === 'Low Taper' ? regularCutStyle : emergencyCutStyle}>
            <div className='flex flex-col gap-1'>
                <div className='flex flex-row items-center gap-2'>
                    <p className='text-white raleway-bold text-4xl'>{name}</p>
                    {status === true && <button className={UpdateTimeslotsStyle} >  <TiTick className='text-green-300 text-xl' /> </button>}
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-white text-xs raleway-regular'>{formatTime(time)}</p>
                    <p className='text-white text-xs raleway-regular'>{formatDate(date)}</p>
                    <p className='text-white text-xs raleway-regular'>{service}</p>
                </div>
            </div>
            <div className='flex flex-row items-center  rounded-lg p-2 gap-4 ml-auto self-center'>
                <div className='flex flex-row items-center gap-1 cursor-pointer' onClick={() =>
                    window.open(`https://www.instagram.com/${instagram.replace(/^@/, '')}`, '_blank')
                }>
                    <FaInstagram className='text-[#DDCA7D] text-xl' />
                    <p className='text-[#DDCA7D] text-xl raleway-regular'>{instagram}</p>
                </div>
                <button className={AvailableTimeslotsStyle}
                    onClick={() => setMailModal(!mailModal)}
                >Mail</button>
                {bookingStatus === "pending" ? <button className={UpdateTimeslotsStyle} onClick={() => setApproveAppointmentModal(!approveAppointmentModal)}>Approve</button> : <button className={UnavailableVerifiedTimeslotsStyle} >Approved</button>}
                <button className={UnavailableVerifiedTimeslotsStyle}
                    onClick={() => setCancelAppointmentModal(!cancelAppointmentModal)}
                >Cancel</button>


            </div>
            {mailModal && <MailModal name={name} email={email} closeModal={closeModal}  date={date} time={time} service={service} />}
            {cancelAppointmentModal && <CancelAppointment name={name} email={email} date={date} time={time} closeModal={closeModal} service={service} onCancelled={onCancelled} />}
            {approveAppointmentModal && <ApproveAppointment name={name} email={email} date={date} time={time} service={service} closeModal={closeModal} />}
        </div>
    )
}