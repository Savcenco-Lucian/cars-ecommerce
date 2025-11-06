import { useState, useEffect, useRef } from 'react';
import Combobox from '../components/Combobox'
import api from '../api'
import ListingCard from '../components/ListingCard';
import { Link } from 'react-router';
import { Helmet } from '@vuer-ai/react-helmet-async';
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowBack, IoIosArrowForward  } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";

import "swiper/css";
import '../styles/index.css'

const Home = () => {
  const [activeSearchFilter, setActiveSearchFilter] = useState('All');
  const [listings, setListings] = useState([]);

  const [topMakes, setTopMakes] = useState([]);
  const [activeMakeFilter, setActiveMakeFilter] = useState(null);

  const [windowWidth, setWindowWidth] = useState(0);

  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/car-listings/');
        setListings(res.data.results)
      } catch (error) {
        console.error('Error fetching listings');
      }
    }

    const fetchTopMakes = async () => {
      try {
        const res = await api.get('/top-makes/');
        setTopMakes(res.data);
        setActiveMakeFilter(res.data[0]);
      } catch (error) {
        console.error('Error fetching top-makes');
      }
    }

    fetchListings();
    fetchTopMakes();
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Zoom Vintage Classics | Classic Cars Dealership</title>
        <meta name="description" content="Find your ideal dream car. Zoom Vintage Classics gives you the oportunity to buy your dream classic muscle car!" />
      </Helmet>

      {/*Hero Section*/}
      <section className='relative'>
        <div className='absolute inset-0 bg-[url(/homeBanner.jpg)] bg-cover bg-center'></div>

        <div className='absolute inset-0 bg-black/45'></div>

        <div className="relative flex justify-center h-full w-full">
          <div className="flex flex-col gap-[60px] pt-[180px] pb-[190px] px-[15px] sm:container sm:mx-auto">
            <h1 className='text-[30px] lg:text-[61px] text-white font-muli font-[900] tracking-wide text-center'>
              Discover Your <span className='text-[#d5ab63]'>Ideal</span> Car
            </h1>
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-center gap-[50px] font-muli text-white text-[17px]">
                <p onClick={() => setActiveSearchFilter('All')} className={`${activeSearchFilter === 'All' ? 'text-[#d5ab63]' : ''} font-[700] cursor-pointer hover:text-[#d5ab63] transition-all duration-200 ease-in-out`}>All</p>
                <p onClick={() => setActiveSearchFilter('New')} className={`${activeSearchFilter === 'New' ? 'text-[#d5ab63]' : ''} font-[700] cursor-pointer hover:text-[#d5ab63] transition-all duration-200 ease-in-out`}>New</p>
                <p onClick={() => setActiveSearchFilter('Used')} className={`${activeSearchFilter === 'Used' ? 'text-[#d5ab63]' : ''} font-[700] cursor-pointer hover:text-[#d5ab63] transition-all duration-200 ease-in-out`}>Used</p>
              </div>


              <div className="relative">
                <span className={`${activeSearchFilter === 'All' ? 'translate-x-[-590%]' : `${activeSearchFilter === 'New' ? 'translate-x-[-100%]' : 'translate-x-[460%]'}`} transition duration-200 ease-in-out absolute top-[2px] left-[50%] transform w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-b-white border-transparent`}></span>
              </div>

              <div className="bg-white rounded-[20px] py-[15px] px-[20px] shadow-[0px_9px_0px_0px_rgba(255,_255,_255,_0.45)] w-full max-w-[800px] mx-auto flex flex-col md:flex-row justify-between gap-[10px]">
                <Combobox conditionFilter={activeSearchFilter} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Grid Section*/}
      <section className='sm:container sm:mx-auto flex flex-col gap-[5px] items-center justify-center py-[40px] px-[15px] font-muli'>
        <p className='text-[22px] text-[#d5ab63] text-center'>Handy picked</p>
        <p className='text-[38px] md:text-[60px] font-[900] mb-[15px] text-center text-[#222732]'>Newest Listings</p>
        <div className="hidden lg:grid grid-cols-8 grid-rows-2 gap-4 min-h-[100px]">
          {
            listings.length !== 0 &&
            <Link to={`/listing/${listings[0].title.toLowerCase().replace(/\s+/g, '-')}-${listings[0].id}`} className='shadow-md rounded-md flex flex-col overflow-hidden  w-full group col-span-4 row-span-2'>
              <div className="bg-gray-200 min-h-[100px] h-full">
                <img
                  src={listings[0].listing_images[0].path}
                  alt={`${listings[0].make.name} ${listings[0].model.name} ${listings[0].year}`}
                  className='h-full w-full object-cover group-hover:scale-[1.1] z-14 transition-all duration-[0.7s] ease-in-out cursor-pointer'
                />
              </div>
              <div className="bg-[#222732] px-[35px] py-[30px] flex flex-col gap-[10px] font-muli text-white z-[15] ">
                <p className='text-[22px] font-[700] tracking-wide truncate mb-[10px]'>{listings[0].title}</p>
                <hr />

                <div className="flex justify-between mt-[10px] items-center gap-[30px]">
                  <div className="flex flex-wrap items-center gap-[20px] text-[17px] font-[600] tracking-wide h-[35px] overflow-hidden">
                    <p className='px-[12px] py-[5px] bg-[#d5ab63] rounded-md'>{listings[0].year}</p>
                    <p className='text-gray-400'>{listings[0].mileage.toLocaleString()} miles</p>
                    <p className='text-gray-400'>{listings[0].transmission.type}</p>
                    <p className='text-gray-400'>{listings[0].fuel_type.type} </p>
                  </div>
                  <p className='text-[28px] font-[800] tracking-wide'>${listings[0].price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          }
          {
            listings.length !== 0 && listings.map((item, idx) => {
              if (idx >= 5) return;
              if (idx > 0)
                return (
                  <div key={idx} className="col-span-2 lg:block">
                    <ListingCard listing={item} />
                  </div>
                );
            })
          }
        </div>
        <div className="grid lg:hidden grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-4">
          {
            listings.length !== 0 && listings.map((item, idx) => {
              if (idx >= (windowWidth >= 640 ? 4 : 3)) return;
              return (
                <div key={idx} className="col-span-2 lg:block">
                  <ListingCard listing={item} />
                </div>
              );
            })
          }
        </div>
        <Link to={'/search'} className='my-[20px] py-[10px] w-full sm:mr-auto sm:max-w-[200px] bg-[#d5ab63] text-white flex justify-center items-center rounded-md text-[17px] hover:bg-[#735c36] cursor-pointer transition-all duration-75 ease-in'>
          View All Listings
        </Link>
      </section>

      {/*Swiper Section*/}
      <section className='py-[70px] px-[15px] font-muli bg-gray-200 min-h-[300px]'>
        {
          activeMakeFilter && (
            <div className="sm:container sm:mx-auto flex flex-col gap-[25px] w-full">
              <div className="flex flex-col xl:flex-row gap-[20px] items-center xl:justify-between ">
                <p className='text-[38px] md:text-[60px] text-center font-[900] tracking-wide text-[#222732]'>Popular Makes</p>

                <div className="flex gap-[15px] flex-wrap justify-center items-center">
                  {
                    topMakes.map((item, idx) => (
                      <div onClick={() => setActiveMakeFilter(item)} key={idx} className={`min-w-[115px] border-[1px] ${activeMakeFilter.name === item.name ? '!text-[#d5ab63] border-[#d5ab63] bg-[#faf5eb]' : 'border-white bg-white hover:border-[#d5ab63] hover:bg-[#faf5eb]'} rounded-md px-[30px] py-[10px] flex flex-col items-center justify-center gap-[2px] cursor-pointer transition-all duration-100 ease-in-out`}>
                        <p className='text-[17px] font-[600]'>{item.name}</p>
                        <p className='text-[12px] text-gray-400'>{item.count} Listings</p>
                      </div>
                    ))
                  }
                </div>
              </div>

              <Swiper
                key={activeMakeFilter.id}
                slidesPerView={1}
                spaceBetween={30}
                ref={swiperRef}
                loop={true}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                  1280: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                className="mySwiper min-h-[310px] !h-full"
              >
                {topMakes.map((item, idx) => {
                  if (item.id === activeMakeFilter.id) {
                    return item.limited_listings.map((newItem, idx) => (
                      <SwiperSlide key={idx} className='w-full !h-auto'>
                        <ListingCard listing={newItem} />
                      </SwiperSlide>
                    ));
                  }
                  return null;
                })}
              </Swiper>

              <div className="flex flex-col xl:flex-row gap-[20px] items-center xl:justify-between w-full">
                <div className="flex justify-center gap-[15px] mt-[20px]">
                  <button
                    onClick={() => swiperRef.current.swiper.slidePrev()}
                    className="p-[12px] text-[24px] bg-[#d5ab63] rounded-full text-white hover:bg-[#735c36] transition-all cursor-pointer"
                  >
                    <IoIosArrowBack />
                  </button>
                  <button
                    onClick={() => swiperRef.current.swiper.slideNext()}
                    className="p-[12px] text-[24px] bg-[#d5ab63] rounded-full text-white hover:bg-[#735c36] transition-all cursor-pointer"
                  >
                    <IoIosArrowForward />
                  </button>
                </div>

                <Link to={`/search?make=${encodeURIComponent(activeMakeFilter.name.toLowerCase())}`} className='my-[10px] py-[10px] w-full max-w-[200px] bg-[#d5ab63] text-white flex justify-center items-center rounded-md text-[17px] hover:bg-[#735c36] cursor-pointer transition-all duration-75 ease-in'>
                  View {activeMakeFilter.count} {activeMakeFilter.name}
                </Link>
              </div>
            </div>
          )
        }
      </section>

      {/*Why Section*/}
      <section className='sm:container sm:mx-auto flex flex-col gap-[100px] pt-[100px] pb-[200px] px-[15px] font-muli'>
        <p className='text-[50px] font-[900] tracking wide text-center text-[#222732]'>Why choose us?</p>
        <div className="flex flex-col md:flex-row justify-evenly gap-[50px]">
          <div className="flex flex-col gap-[35px] items-center justify-center max-w-[470px] mx-auto md:mx-0">
            <div className="rounded-full bg-green-100 p-[20px] mb-[15px] text-green-400 text-[34px]">
              <FaUserFriends />
            </div>
            <p className='text-[24px] font-[700] text-center'>Trusted by our clients</p>
            <p className='text-gray-500 text-center'>For over three decades, passionate collectors and car enthusiasts have trusted us to find, authenticate, and secure rare vintage automobiles with absolute certainty.</p>
          </div>

          <div className="flex flex-col gap-[35px] items-center justify-center max-w-[470px] mx-auto md:mx-0">
            <div className="rounded-full bg-blue-100 p-[20px] mb-[15px] text-blue-400 text-[34px]">
              <GiTakeMyMoney />
            </div>
            <p className='text-[24px] font-[700] text-center'>Fast & easy financing</p>
            <p className='text-gray-500 text-center'>We’re here to assist with your financing options and provide expert tips and tricks. No matter your credit history, we can help you drive off in the car of your dreams.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
