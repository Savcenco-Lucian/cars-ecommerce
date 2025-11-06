import { Helmet } from '@vuer-ai/react-helmet-async';
import { IoMail } from "react-icons/io5";
import { Checkbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react';
import api from '../api'
import { Link } from 'react-router';
import { IoIosSend } from "react-icons/io";

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [checked, setChecked] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        checked: '',
    });

    const validateName = (raw) => {
        const value = raw.trim();
        if (!value) return 'Name is required.';
        if (!/^[A-Za-z .'-]+$/.test(value)) {
            return "Only letters, space, hyphen (-), dot (.), and apostrophe (') are allowed.";
        }
        return '';
    };

    const validateEmail = (raw) => {
        const value = raw.trim();
        if (!value) return 'Email is required.';
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            return 'Enter a valid email (e.g., name@example.com).';
        }
        return '';
    };

    const validatePhone = (raw) => {
        const value = raw.trim();
        if (!value) return 'Phone is required.';
        if (!/^\+?\d+$/.test(value)) {
            return 'Phone must contain digits only and may start with +.';
        }
        return '';
    };

    const validateMessage = (raw) => {
        const value = raw.trim();
        if (!value) return 'Message is required.';
        return '';
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setErrors((prev) => ({ ...prev, name: '' }));
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrors((prev) => ({ ...prev, email: '' }));
    };

    const handlePhoneChange = (e) => {
        const input = e.target.value;
        const digitsOnly = input.replace(/(?!^\+)[^\d]/g, '');
        setPhone(digitsOnly);
        setErrors((prev) => ({ ...prev, phone: '' }));
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        setErrors((prev) => ({ ...prev, message: '' }));
    };

    const handleBlurTrim = (field) => {
        if (field === 'name') setName((s) => s.trim());
        if (field === 'email') setEmail((s) => s.trim());
        if (field === 'phone') setPhone((s) => s.trim());
        if (field === 'message') setMessage((s) => s.trim());
    };

    useEffect(() => {
        setErrors((prev) => ({ ...prev, checked: '' }));
    }, [checked])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const phoneErr = validatePhone(phone);
        const msgErr = validateMessage(message);
        const checkedErr = checked ? '' : 'You must accept the Privacy Policy.';

        const nextErrors = {
            name: nameErr,
            email: emailErr,
            phone: phoneErr,
            message: msgErr,
            checked: checkedErr,
        };

        setErrors(nextErrors);

        const hasErrors = Object.values(nextErrors).some(Boolean);
        if (hasErrors) return;

        setLoading(true);

        const apiObject = {
            listing: null,
            name,
            email,
            phone,
            message
        }

        try {
            await api.post('/inquiry/', apiObject)
            setName(''); setEmail(''); setPhone(''); setMessage(''); setChecked(false);
        } catch (error) {
            if (error?.response?.data) {
                setErrors(error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us | Zoom Vintage Classics</title>
                <meta
                    name="description"
                    content="Known for our dedication to quality and client pleasure, we take pride in being among the biggest and safest businesses that specialize in the selling of vintage automobiles."
                />
            </Helmet>

            <section className='relative'>
                <div className='absolute inset-0 bg-[url(/shipping.jpg)] bg-cover bg-center'></div>
                <div className='absolute inset-0 bg-black/70'></div>
                <div className="relative flex justify-center h-full w-full pt-[150px] pb-[100px]">
                    <h1 className='text-[45px] sm:text-[61px] px-[15px] text-white font-muli font-[900] tracking-wide text-center'>
                        Contact Us
                    </h1>
                </div>
            </section>

            <section className="pt-[70px] sm:pt-[90px] pb-[100px] sm:container sm:mx-auto px-[10px] font-muli lg:grid lg:grid-cols-2 lg:grid-rows-1 gap-[50px]">
                <div className="flex flex-col gap-[50px]">
                    <p className='text-[20px] text-gray-500 font-[700]'>Known for our dedication to quality and client pleasure, we take pride in being among the biggest and safest businesses that specialize in the selling of vintage automobiles.</p>
                    <p className='text-gray-500'>At Zoom Vintage Classics, we don’t just offer classic cars – we offer experiences, nostalgia, and a connection to the past. Every vehicle in our collection is handpicked, thoroughly checked, and ready to hit the road or become a treasured part of your collection.</p>

                    <a href="https://maps.app.goo.gl/TgJTz1A19MnYYKCq8" className='text-[#222732] w-full max-w-[180px]'>4317 35th St, <br />Orlando, FL 32811</a>

                    <a href="tel:+16894075222" className="flex items-center gap-[10px] text-[#222732] w-full max-w-[280px]">
                        <p className='text-[30px] font-[900] '>+(333) <span className='text-[#d5ab63]'>(689) 407-5222</span> </p>
                    </a>

                    <a href="mailto:info@zoom-vintageclassics.com" className="flex items-center gap-[10px] text-white -mt-[30px] font-muli w-full max-w-[280px]">
                        <IoMail className="text-[#d5ab63]" />
                        <p className='text-[#222732] transition-colors duration-100 ease-in hover:text-[#d5ab63]'>info@zoom-vintageclassics.com</p>
                    </a>
                </div>

                <form onSubmit={handleSubmit} noValidate className="bg-gray-200 p-[20px] formcstm:p-[60px] flex flex-col gap-[15px] rounded-2xl mt-[50px] lg:mt-0 relative">
                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                        onBlur={() => {
                            handleBlurTrim('name');
                            setErrors((prev) => ({ ...prev, name: validateName(name) }));
                        }}
                        placeholder="Name*"
                        className='p-[15px] outline-none bg-white rounded-lg'
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
                    />
                    {errors.name && <p id="name-error" className="text-red-600 text-sm -mt-2">{errors.name}</p>}

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => {
                            handleBlurTrim('email');
                            setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
                        }}
                        placeholder="Email*"
                        className='p-[15px] outline-none bg-white rounded-lg'
                        aria-invalid={!!errors.email}
                        aria-describedby="email-error"
                    />
                    {errors.email && <p id="email-error" className="text-red-600 text-sm -mt-2">{errors.email}</p>}

                    {/* Phone */}
                    <input
                        type="tel"
                        inputMode="numeric"
                        name="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={() => {
                            handleBlurTrim('phone');
                            setErrors((prev) => ({ ...prev, phone: validatePhone(phone) }));
                        }}
                        placeholder="Phone*"
                        className='p-[15px] outline-none bg-white rounded-lg'
                        aria-invalid={!!errors.phone}
                        aria-describedby="phone-error"
                    />
                    {errors.phone && <p id="phone-error" className="text-red-600 text-sm -mt-2">{errors.phone}</p>}

                    {/* Message */}
                    <textarea
                        name="message"
                        className='p-[15px] outline-none bg-white rounded-lg min-h-[130px]'
                        placeholder='Message*'
                        value={message}
                        onChange={handleMessageChange}
                        onBlur={() => {
                            handleBlurTrim('message');
                            setErrors((prev) => ({ ...prev, message: validateMessage(message) }));
                        }}
                        aria-invalid={!!errors.message}
                        aria-describedby="message-error"
                    />
                    {errors.message && <p id="message-error" className="text-red-600 text-sm -mt-2">{errors.message}</p>}

                    <div className="flex flex-col gap-[15px] sm:flex-row justify-between sm:items-center">
                        <div className="flex flex-col">
                            <div className="flex gap-[10px] cursor-pointer items-center">
                                <Checkbox
                                    checked={checked}
                                    onChange={setChecked}
                                    className="group size-6 rounded-md bg-white p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-[#d5ab63]  data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
                                >
                                    <CheckIcon className="hidden size-4 fill-white group-data-checked:block" />
                                </Checkbox>
                                <p onClick={() => setChecked(!checked)} className='text-[14px] text-[#222732]'>
                                    I accept the <Link to={'/privacy-policy'} className='text-[#d5ab63] hover:underline'>Privacy Policy</Link>
                                </p>
                            </div>
                            {errors.checked && <p className="text-red-600 text-sm mt-1">{errors.checked}</p>}
                        </div>

                        <button
                            type="submit"
                            className='py-[12px] w-full sm:max-w-[150px] bg-[#d5ab63] text-white flex justify-center items-center gap-[5px] rounded-md text-[17px] hover:bg-[#735c36] cursor-pointer transition-all duration-75 ease-in'
                        >
                            Send
                            <IoIosSend className='text-xl'/>
                        </button>
                    </div>

                    {loading && (
                        <div className="absolute inset-0 bg-[#222732] flex justify-center items-center rounded-2xl z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#D5AB63" stroke="#D5AB63" stroke-width="1" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#D5AB63" stroke="#D5AB63" stroke-width="1" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#D5AB63" stroke="#D5AB63" stroke-width="1" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
                        </div>
                    )}
                </form>
            </section>
        </>
    );
};

export default Contact;
