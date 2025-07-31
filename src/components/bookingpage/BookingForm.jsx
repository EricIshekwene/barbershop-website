import React, { useState } from 'react';

export default function BookingForm({service, date, time}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [instagram, setInstagram] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [instagramError, setInstagramError] = useState('');
    const [formError, setFormError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
       let hasError = false;

       //name
       if(name.trim() === '') {
        setNameError('Name is required');
        hasError = true;
        }else if(!/^[a-zA-Z\s]+$/.test(name)){
            setNameError('Name must contain only letters and spaces');
            hasError = true;
        }else if(name.length < 3){
            setNameError('Name must be at least 3 characters long');
            hasError = true;
        }else if(name.length > 20){
            setNameError('Name must be less than 20 characters long');
            hasError = true;
        }
        else{
            setNameError('');
        }
       //email
       if(email.trim() === '') {
        setEmailError('Email is required');
        hasError = true;
       }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        setEmailError('Invalid email address');
        hasError = true;
       }else{
        setEmailError('');
       }
       //phone
       if(phone.trim() === '') {
        setPhoneError('Phone is required');
        hasError = true;
       }else if(!/^[0-9]+$/.test(phone)){
        setPhoneError('Phone must contain only numbers');
        hasError = true;
       }else if(phone.length < 10){
        setPhoneError('Phone must be at least 10 digits long');
        hasError = true;
       }else{
        setPhoneError('');
       }
       // Instagram (optional)
        if (instagram.trim() !== '') {
            if (!/^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9._]{1,30}$/.test(instagram)) {
            setInstagramError('Invalid Instagram username');
            hasError = true;
            } else {
            setInstagramError('');
            }
        } else {
            setInstagramError('');
        }
        //if time is not selected, show error
        if(time === ''){
            setFormError('Time is required');
            hasError = true;
        }
        // if date is not selected, show error
        else if(date === ''){
            setFormError('Date is required');
            hasError = true;
        }
        // if service is not selected, show error
        else if(service === ''){
            setFormError('Service is required');
            hasError = true;
        }
        else{
            setFormError('');
        }
        if (name !== '' && email !== '' && phone !== '' && instagram !== '' && time !== '' && date !== '' && service !== '') {
            console.log(name, email, phone, instagram, date, time, service);
        }
    }
    return (
        <div className="w-1/4  min-w-[320px] p-2 mt-6 mx-auto rounded-xl border-1 border-[#DDCA7D]">

            <div className="flex flex-col ml-1 mr-5">
                <p className="text-white raleway-bold text-left text-2xl mt-5 font-bold">Booking Form</p>
                {formError ? <p className="text-red-500 raleway-regular text-left text-sm font-bold">{formError}</p> : 
                <p className="text-white raleway-regular text-left text-sm font-bold">Complete the your booking details</p>}
            </div>

            <form className="flex flex-col ml-1 mr-5 mt-2 gap-4 rounded-xl" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="raleway-regular w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                {nameError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{nameError}</p>}
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="raleway-regular w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                {emailError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{emailError}</p>}
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="raleway-regular w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                {phoneError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{phoneError}</p>}
                <input
                    type="text"
                    placeholder="Instagram"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    className="raleway-regular w-full p-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c] focus:outline-none focus:ring-0"
                />
                {instagramError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{instagramError}</p>}
                <p className="text-white raleway-regular text-left text-sm font-bold">Enter your instagram to become a verified customer</p>
                <button type="submit" className="w-full p-2 m-2 rounded-md border-2 border-[#DDCA7D] text-white bg-[#1c1c1c]">Submit</button>
            </form>
        </div>
    )
}