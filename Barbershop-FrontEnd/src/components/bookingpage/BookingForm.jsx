import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function BookingForm({ service, date, time, emergency }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [instagram, setInstagram] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [instagramError, setInstagramError] = useState('');
    const [formError, setFormError] = useState('');
    const [reason, setReason] = useState('');
    function validateForm({ name, email, phone, instagram, time, date, service, reason, emergency}, setErrors) {
        let hasError = false;

        const errors = {
            name: '',
            email: '',
            phone: '',
            instagram: '',
            form: '',
            reason: ''
        };

        // Name
        if (!name.trim()) {
            errors.name = 'Name is required';
            hasError = true;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            errors.name = 'Name must contain only letters and spaces';
            hasError = true;
        } else if (name.length < 3) {
            errors.name = 'Name must be at least 3 characters long';
            hasError = true;
        } else if (name.length > 20) {
            errors.name = 'Name must be less than 20 characters long';
            hasError = true;
        }

        // Email
        if (!email.trim()) {
            errors.email = 'Email is required';
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email address';
            hasError = true;
        }

        // Phone
        if (!phone.trim()) {
            errors.phone = 'Phone is required';
            hasError = true;
        } else if (!/^[0-9]+$/.test(phone)) {
            errors.phone = 'Phone must contain only numbers';
            hasError = true;
        } else if (phone.length < 10) {
            errors.phone = 'Phone must be at least 10 digits long';
            hasError = true;
        }

        // Instagram (optional)
        if (instagram.trim()) {
            if (!/^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9._]{1,30}$/.test(instagram)) {
                errors.instagram = 'Invalid Instagram username';
                hasError = true;
            }
        }

        // Reason
        if (service === 'Emergency Cut' && !reason.trim()) {
            errors.reason = 'Reason is required for emergency cuts';
            hasError = true;
        }
        if (service === 'Emergency Cut'){
            const picks = emergency.proposals || [];
            if (picks.length === 0) {
                errors.form = 'Please select a time for your emergency cut';
                hasError = true;
            }else{ // Time, Date, Service
                if (!time) {
                    errors.form = 'Time is required';
                    hasError = true;
                } else if (!date) {
                    errors.form = 'Date is required';
                    hasError = true;
                } else if (!service) {
                    errors.form = 'Service is required';
                    hasError = true;
                }
            }}
        

        // Set individual error states
        setErrors(errors);

        return !hasError;
    }
    const toPgTime = (t) => {
        // Make sure it's a 2-digit hour with :00:00
        return String(t).padStart(2, '0') + ':00:00';
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit hit");
        const isValid = validateForm(
            { name, email, phone, instagram, time, date, service, reason, emergency },
            (errors) => {
                setNameError(errors.name);
                setEmailError(errors.email);
                setPhoneError(errors.phone);
                setInstagramError(errors.instagram);
                setFormError(errors.form);
            }
        );

        if (!isValid) return;

        const appointmentData = {
            name,
            email,
            phone,
            instagram,
            time,
            date,
            service,
            reason
        };
        try {
            const res = await fetch('http://localhost:3000/api/client/addClient', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    instagram: instagram || null,
                    reason: reason || null,
                }),
            });

            if (res.status === 201) {
                const clientData = await res.json()
                console.log("✅ Client created:", clientData);

                //email the client a confirmation code

                const emailRes = await fetch('http://localhost:3000/api/confirmation/mail-confirmation', {
                    method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email }),
                  });
                  
                  if (emailRes.ok) {
                    const data = await emailRes.json();
                    const confirmationCode = data.code; 
                  //differentiate between emergency and regular booking
                    console.log("✅ Email sent. Confirmation code:", confirmationCode);
                  
                    if (service === 'Emergency Cut'){
                        navigate('/confirmation', {
                        state: {
                            name,
                            email,
                            phone,
                            instagram,
                            date,
                            time,
                            service,
                            confirmationCode,
                            emergency:{proposals: emergency?.proposals || [], reason},
                        },
                    });
                    }else{
                        navigate('/confirmation', {
                            state: {
                                name,
                                email,
                                phone,
                                instagram,
                                date,
                                time,
                                service,
                                confirmationCode,
                            },
                        });
                    }
                  } else {
                    const error = await emailRes.json(); // <- was res.json(), corrected to emailRes.json()
                    console.error("❌ Email error:", error.error || error.message || "Failed to send email");
                    setFormError("Network error — please try again.");
                  }
                  



            } else if (res.status === 200) {
                if (service === 'Emergency Cut'){
                    const proposals = emergency?.proposals || [];
                    const reqres = await fetch('http://localhost:3000/api/emergency/request', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, service, proposals, reason: reason || null  }),
                    });
                    if (!reqres.ok){
                        const error = await reqres.json();
                        setFormError(error.error || error.message || "Failed to send emergency request");
                        console.error("❌ Error:", error.message);
                        return;
                    }
                    navigate('/emergency-confirmation', {
                        state: {
                            name,
                            email,
                            service,
                            proposals,
                            confirmationCode,
                            message: "Emergency request sent successfully",
                        },
                    });
                }else{
                    const pgTime = toPgTime(time);
                    const addBooking = await fetch('http://localhost:3000/api/confirmation/add-booking', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: 
                        JSON.stringify({ name, email, date, time: pgTime, service, reason: reason || null  }),
                    });
                    if (addBooking.ok){
                        const payload = await addBooking.json();
                        if (payload.booking && payload.booking.id){
                            sessionStorage.setItem("booking", JSON.stringify(payload.booking));
                            navigate('/confirmed', { state: payload.booking });
                        }
                        else{
                            const err = await addBooking.json().catch(() => ({}));
                            setFormError(err.error || "Could not create booking. Error 6");
                            return;
                        }
                    }else{
                        const err = await addBooking.json().catch(() => ({}));
                        setFormError(err.error || "Failed to add booking. Error 7");
                        console.error("❌ Error 7: adding booking:", err.message);
                        return;
                    }
                }
            } else {
                const error = await error.json();
                setFormError(error.error || error.message || "An error occurred. Please try again. Error 8");
                console.error("❌ Error 8:", error.message);
            }
            
        } catch (err) {
            console.error("❌ Network error. Error 9:", err);
        }
    }

    return (
        <div className="w-1/5 mb-10 min-w-[320px] p-2 mt-6  mx-auto rounded-xl border-1 border-white/20 bg-white/10 backdrop-blur-sm">

            <div className="flex flex-col justify-center items-center">
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
                    className="raleway-regular w-full p-2 rounded-md  border-white/20 text-[#DDCA7D]  backdrop-blur-sm focus:outline-none focus:ring-0"
                />
                {nameError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{nameError}</p>}
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="raleway-regular w-full p-2 rounded-md  border-white/20 text-[#DDCA7D]  backdrop-blur-sm focus:outline-none focus:ring-0"
                />
                {emailError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{emailError}</p>}
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="raleway-regular text-[#DDCA7D] w-full p-2 rounded-md  border-white/20  backdrop-blur-sm focus:outline-none focus:ring-0"
                />
                {phoneError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{phoneError}</p>}
                <input
                    type="text"
                    placeholder="Instagram"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    className="raleway-regular w-full p-2 rounded-md  border-white/20 text-[#DDCA7D]  backdrop-blur-sm focus:outline-none focus:ring-0"
                />
                {instagramError && <p className="text-red-500 raleway-regular text-left text-sm font-bold">{instagramError}</p>}
                <p className="text-white raleway-regular text-left text-xs font-bold">Enter instagram to become a verified customer</p>
                {date && service && time !== null && time !== undefined && (
                    <p className="text-white raleway-regular text-left text-sm font-bold">
                        {date} @ {time}:00 || {service}
                    </p>
                )}
                {service === 'Emergency Cut' && <input
                    type="text"
                    placeholder="Reason for emergency cut"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="raleway-regular w-full p-2 rounded-md  border-white/20 text-[#DDCA7D]  backdrop-blur-sm focus:outline-none focus:ring-0"
                />}

                <button type="submit" className="w-full p-2 m-2  raleway-regular rounded-md  border-white/20 text-[#DDCA7D]  backdrop-blur-sm">Submit</button>
            </form>
        </div>
    )
}