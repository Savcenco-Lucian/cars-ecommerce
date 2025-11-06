import { useParams } from 'react-router';
import { Helmet } from '@vuer-ai/react-helmet-async';
import { useEffect, useState, useRef } from 'react';
import api from '../api'
import { Link } from 'react-router';
import { IoIosSend } from "react-icons/io";
import ListingCard from '../components/ListingCard'
import useScrollDirection from '../hooks/useScrollDirection'

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../styles/gallery.css'

import Lightbox from 'yet-another-react-lightbox';
import { Zoom } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';

import { Checkbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'

const ListingDetails = () => {
    const { slug } = useParams();

    const parts = slug.split('-');
    const id = parts.pop();

    const [listing, setListing] = useState(null);
    const [otherListings, setOtherListings] = useState([]);

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const swiperRef = useRef(null);

    const dir = useScrollDirection({ threshold: 4 });

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/car-listings/${id}/`)
                setListing(res.data);
            } catch (error) {
                console.error("Error fetching listing")
            }
        }

        const fetchOther = async () => {
            try {
                const res = await api.get(`/car-listings/${id}/other/`)
                setOtherListings(res.data);
            } catch (error) {
                console.error("Error fetching other listings")
            }
        }

        fetchListing();
        fetchOther();
    }, [id])

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
            listing: listing.id,
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

    const title = listing ? `${listing.title} | Zoom Vintage Classics` : 'For Sale | Zoom Vintage Classics';
    const description = listing ? listing.title : 'Find your ideal dream car. Zoom Vintage Classics offers the best collection of classic muscle cars!';
    const image = listing && listing.listing_images.length > 0 ? listing.listing_images[0].path : 'https://zoomvintageclassics.com/assets/logoNoBg-ClutNe1u.png';

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
            </Helmet>

            <section className='pt-[121px] lg:pt-[119px] lg:pb-[17px] bg-[#222732]'>
                <div className=" flex justify-center  h-full w-full ">
                    <div className='text-[14px] text-gray-400 font-muli tracking-wide text-center gap-[30px] hidden lg:flex z-[51]'>
                        <Link to={'/home'}>Home</Link><p>/</p><Link to={'/search'}>Search</Link><p>/</p><Link to={`/search?make=${listing?.make.name.toLowerCase().replace(/\s+/g, '-')}`}>{listing?.make.name}</Link><p>/</p><Link to={`/search?make=${listing?.make.name.toLowerCase().replace(/\s+/g, '-')}&model=${listing?.model.name.toLowerCase().replace(/\s+/g, '-')}`}>{listing?.model.name}</Link><p>/</p><p className='text-[#d5ab63]'>{listing?.title}</p>
                    </div>
                </div>
            </section>

            <section className="py-[60px] sm:py-[80px] px-[12px] sm:container flex flex-col gap-[35px] sm:mx-auto font-muli">
                <div className=" xl:grid xl:grid-cols-12 xl:grid-rows-1 justify-between gap-[40px]">
                    <div className=" xl:col-span-8 flex flex-col gap-[45px] w-full">
                        <div className="flex xl:hidden flex-col gap-[15px]">
                            <p className='text-[30px] text-[#222732]'>{listing?.title}</p>

                            <div className="flex gap-[13px] items-center">
                                <p className='text-gray-500'>{listing?.year}</p>
                                <span className='p-[3px] rounded-full bg-[#d5ab63]'></span>
                                <p className='text-gray-500'>{listing?.mileage.toLocaleString()} miles</p>
                                <span className='p-[3px] rounded-full bg-[#d5ab63]'></span>
                                <p className='text-gray-500'>{listing?.car_type.type}</p>
                                <span className='p-[3px] rounded-full bg-[#d5ab63]'></span>
                                <p className='text-gray-500'>{listing?.fuel_type.type}</p>
                            </div>

                            <span className='w-full h-[1px] bg-gray-300 '></span>
                        </div>

                        <div className="gallery w-full -mt-[20px] xl:mt-0">
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                }}
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2 w-full rounded-xl"
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                            >
                                {
                                    listing?.listing_images.map((img, idx) => (
                                        <SwiperSlide key={idx} onClick={() => { setIndex(idx); setOpen(true); }}>
                                            <img src={img.path} alt={`${listing?.title}`} className='min-h-[200px] cursor-pointer ' />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {
                                    listing?.listing_images.map((img, idx) => (
                                        <SwiperSlide key={idx} className='rounded-xl overflow-hidden'>
                                            <img src={img.path} alt={`${listing?.title}`} className='min-h-[60px] cursor-pointer ' />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>

                        <div className="flex flex-wrap justify-between items-center gap-[20px] -mt-[30px] xl:mt-0 xl:hidden">
                            <p className='text-[35px] font-[800] text-[#d5ab63]'>$ {listing?.price.toLocaleString()}</p>
                            <div>
                                <Link to={`/calculator/${listing?.price}`} target="_blank" rel="noopener noreferrer" className='text-gray-500 hover:text-[#d5ab63] transition-all duration-75 ease-in underline'>Loan Calculator</Link>
                            </div>
                        </div>

                        <div className="px-[30px] py-[20px] rounded-lg bg-gray-200 grid grid-cols-2 md:grid-cols-5 grid-rows-15 md:grid-rows-8 text-[#222732] md:gap-2 mt-[15px] xl:hidden">
                            <p className='font-[700]'>Make:</p> <p>{listing?.make.name}</p> <p className='md:block hidden'></p>
                            <p className='font-[700]'>Model:</p> <p>{listing?.model.name}</p> 
                            <p className='font-[700]'>Color:</p> <p>{listing?.color.name}</p> <p className='md:block hidden'></p>
                            <p className='font-[700]'>Transmission:</p> <p>{listing?.transmission.type}</p>
                            <p className='font-[700]'>Car Type:</p> <p>{listing?.car_type.type}</p> <p className='md:block hidden'></p>
                            <p className='font-[700]'>Condition:</p> <p>{listing?.condition.type}</p>
                            <p className='font-[700]'>Year:</p> <p>{listing?.year}</p> <p className='md:block hidden'></p>
                            <p className='font-[700]'>Mileage:</p> <p>{listing?.mileage.toLocaleString()} miles</p>
                            <p className='font-[700]'>Fuel Type:</p> <p>{listing?.fuel_type.type}</p> <p className='md:block hidden'></p>
                            <p className='font-[700]'>Drive Type:</p> <p>{listing?.drive_type.type}</p>
                            <p className='font-[700]'>Engine Size:</p> <p>{listing?.engine_size}L</p> <p className='md:block hidden'></p>
                            <p className='font-[700]'>Cylinders:</p> <p>{listing?.cylinders}</p>
                            <p className='font-[700]'>Doors:</p> <p>{listing?.doors}-door</p> <p className='md:block hidden'></p>
                            {/* <p className='font-[700]'>Safety Features:</p> <p>{listing?.features?.map(f => f.name).join(', ') || '—'}</p>
                                    <p className='font-[700]'>Features: {listing?.features?.map(f => f.name).join(', ') || '—'}</p> <p></p> */}
                            <p className='font-[700]'>VIN:</p> <p>{listing?.vin}</p>
                            <a
                                href='#sendMessage'
                                className='col-span-2 md:col-span-5 py-[7px] md:py-[12px] w-full bg-[#d5ab63] text-white flex justify-center items-center gap-[5px] rounded-lg text-[17px] hover:bg-[#735c36] cursor-pointer transition-all duration-75 ease-in'
                            >
                                Send message
                            </a>
                        </div>

                        <div className="flex flex-col gap-[25px] -mt-[10px] xl:mt-0">
                            <p className="text-[22px] col-span-7 font-muli font-[800] ">
                                Description
                            </p>
                            {listing?.description}
                        </div>

                        <span className='w-full h-[1px] bg-gray-300 '></span>

                        <div className="flex flex-col gap-[25px]">
                            <p className="text-[22px] col-span-7 font-muli font-[800] ">
                                Features
                            </p>
                            <div className=" flex flex-wrap gap-[20px]">
                                {
                                    listing?.features.map((item, idx) => (
                                        <div key={idx} className='flex gap-[5px] items-center'>
                                            <span className='h-[7px] w-[7px] rounded-full bg-[#d5ab63]'></span>
                                            <p className='text-gray-500'>{item.name}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <span className='w-full h-[1px] bg-gray-300 '></span>

                        <div className="flex flex-col gap-[25px]">
                            <p className="text-[22px] col-span-7 font-muli font-[800] ">
                                Safety Features
                            </p>
                            <div className=" flex flex-wrap gap-[20px]">
                                {
                                    listing?.safety_features.map((item, idx) => (
                                        <div key={idx} className='flex gap-[5px] items-center'>
                                            <span className='h-[7px] w-[7px] rounded-full bg-[#d5ab63]'></span>
                                            <p className='text-gray-500'>{item.name}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="pt-[55px] -mt-[50px]" id='sendMessage'></div>

                        <form onSubmit={handleSubmit} noValidate className="bg-gray-200 p-[20px] formcstm:p-[60px] flex flex-col gap-[15px] rounded-2xl relative">
                            <p className='font-[800] text-[22px]'>Send message</p>

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

                            <div className="flex rounded-lg flex-col gap-[15px] sm:flex-row justify-between sm:items-center">
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
                                    <IoIosSend className='text-xl' />
                                </button>
                            </div>

                            {loading && (
                                <div className="absolute inset-0 bg-[#222732] flex justify-center items-center rounded-2xl z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#D5AB63" stroke="#D5AB63" stroke-width="1" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#D5AB63" stroke="#D5AB63" stroke-width="1" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#D5AB63" stroke="#D5AB63" stroke-width="1" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="h-full col-span-4 hidden xl:block w-auto relative w-full ">
                        <div className={`block sticky ${dir === 'up' ? 'top-[100px]' : 'top-[calc(100vh-830px)]'} [@media(min-height:922px)]:!top-[100px] transition-all duration-[0.75s] ease-in-out`}>
                            <div className="flex flex-col gap-[15px] px-[20px]">
                                <p className='text-[30px] text-[#222732]'>{listing?.title}</p>

                                <div className="flex gap-[13px] items-center">
                                    <p className='text-gray-500'>{listing?.year}</p>
                                    <span className='p-[3px] rounded-full bg-[#d5ab63]'></span>
                                    <p className='text-gray-500'>{listing?.mileage.toLocaleString()} miles</p>
                                    <span className='p-[3px] rounded-full bg-[#d5ab63]'></span>
                                    <p className='text-gray-500'>{listing?.car_type.type}</p>
                                    <span className='p-[3px] rounded-full bg-[#d5ab63]'></span>
                                    <p className='text-gray-500'>{listing?.fuel_type.type}</p>
                                </div>

                                <span className='w-full h-[1px] bg-gray-300 '></span>

                                <div className="flex flex-col">
                                    <p className='text-[35px] font-[800] text-[#d5ab63]'>$ {listing?.price.toLocaleString()}</p>
                                    <div>
                                        <Link to={`/calculator/${listing?.price}`} target="_blank" rel="noopener noreferrer" className='text-gray-500 hover:text-[#d5ab63] transition-all duration-75 ease-in underline'>Loan Calculator</Link>
                                    </div>
                                </div>

                                <div className="px-[30px] py-[20px] rounded-lg bg-gray-200 grid grid-cols-2 grid-rows-14 text-[#222732] gap-2 mt-[15px]">
                                    <p className='font-[700]'>Make:</p> <p>{listing?.make.name}</p>
                                    <p className='font-[700]'>Model:</p> <p>{listing?.model.name}</p>
                                    <p className='font-[700]'>Color:</p> <p>{listing?.color.name}</p>
                                    <p className='font-[700]'>Transmission:</p> <p>{listing?.transmission.type}</p>
                                    <p className='font-[700]'>Car Type:</p> <p>{listing?.car_type.type}</p>
                                    <p className='font-[700]'>Condition:</p> <p>{listing?.condition.type}</p>
                                    <p className='font-[700]'>Year:</p> <p>{listing?.year}</p>
                                    <p className='font-[700]'>Mileage:</p> <p>{listing?.mileage.toLocaleString()} miles</p>
                                    <p className='font-[700]'>Fuel Type:</p> <p>{listing?.fuel_type.type}</p>
                                    <p className='font-[700]'>Drive Type:</p> <p>{listing?.drive_type.type}</p>
                                    <p className='font-[700]'>Engine Size:</p> <p>{listing?.engine_size}L</p>
                                    <p className='font-[700]'>Cylinders:</p> <p>{listing?.cylinders}</p>
                                    <p className='font-[700]'>Doors:</p> <p>{listing?.doors}-door</p>
                                    {/* <p className='font-[700]'>Safety Features:</p> <p>{listing?.features?.map(f => f.name).join(', ') || '—'}</p>
                                    <p className='font-[700]'>Features: {listing?.features?.map(f => f.name).join(', ') || '—'}</p> <p></p> */}
                                    <p className='font-[700]'>VIN:</p> <p>{listing?.vin}</p>
                                </div>

                                <a
                                    href='#sendMessage'
                                    className='py-[12px] w-full bg-[#d5ab63] text-white flex justify-center items-center gap-[5px] rounded-lg text-[17px] hover:bg-[#735c36] cursor-pointer transition-all duration-75 ease-in'
                                >
                                    Send message
                                </a>
                            </div>
                        </div>


                    </div>
                </div>

                <span className='w-full h-[1px] bg-gray-300 -mt-[15px]'></span>

                <div className="flex flex-col gap-[10px]">
                    <p className="text-[22px] col-span-7 font-muli font-[800] ">
                        Other listings
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[30px] text-black">
                        {
                            otherListings.map((item, idx) => (
                                <ListingCard key={idx} listing={item} />
                            ))
                        }
                    </div>
                    <div className="mt-[15px]">
                        <Link to={`/search`} className='mx-auto  py-[12px] w-full md:max-w-[200px] bg-[#d5ab63] text-white flex justify-center items-center gap-[5px] rounded-md text-[17px] hover:bg-[#735c36] cursor-pointer transition-all duration-75 ease-in'>
                            Start a new search
                        </Link>
                    </div>
                </div>
            </section>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                on={{
                    view: ({ index: newIndex }) => {
                        setIndex(newIndex);
                        swiperRef.current?.slideTo(newIndex);
                    },
                }}
                slides={listing?.listing_images.map((img) => ({ src: img.path }))}
                plugins={[Zoom]}
            />
        </>
    )
}

export default ListingDetails
