import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { IoMdClose } from "react-icons/io";
import logoNoBg from '../assets/siteImages/logoNoBg.png'
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const ResponsiveMenu = ({ showRespMenu, setShowRespMenu }) => {

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setShowRespMenu(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const linkBase =
        "text-[16px] font-[500] tracking-wider transition-colors duration-100 ease-in"

    return (
        <>
            <div onClick={() => { setShowRespMenu(false); }} style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }} className={`fixed top-0 z-[998] h-[100vh] w-full bg-black/60 ${showRespMenu ? 'left-0' : '-left-full'}  transition-all duration-150 ease-in`}></div>

            <div className={`w-[270px] top-0 fixed z-[999] xxs:w-[300px] cstm:w-[350px] bg-[#171717] h-[100vh] flex flex-col p-[24px] ${showRespMenu ? 'left-0 overflow-y-auto' : '-left-[120%]'}  transition-all duration-150 ease-in`}>
                <IoMdClose onClick={() => { setShowRespMenu(false); }} className='text-3xl min-h-[30px] rounded-full p-[5px] ml-auto bg-[#d5ab63] hover:bg-[#735c36] hover:text-white transition-all duration-100 ease-in cursor-pointer'/>
                
                <NavLink to="/" end onClick={() => { setShowRespMenu(false); }} className={'w-[110px] mx-auto'}>
                    <img src={logoNoBg} alt="Zoom Vintage Classics" className='w-[108px]' />
                </NavLink>
                
                <ul className='flex flex-col font-muli mt-[15px]'>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative text-white'>
                        <NavLink to="/" end className={({ isActive }) => `block w-full py-[15px] ${linkBase} hover:text-[#d5ab63]`} onClick={() => { setShowRespMenu(false); }}>
                            Home
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative text-white'>
                        <NavLink to="/search" end className={({ isActive }) => `block w-full py-[15px] ${linkBase} hover:text-[#d5ab63]`} onClick={() => { setShowRespMenu(false); }}>
                            Listings
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative text-white'>
                        <NavLink to="/shipping" end className={({ isActive }) => `block w-full py-[15px] ${linkBase} hover:text-[#d5ab63]`} onClick={() => { setShowRespMenu(false); }}>
                            Shipping
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative text-white'>
                        <NavLink to="/return-policy" end className={({ isActive }) => `block w-full py-[15px] ${linkBase} hover:text-[#d5ab63]`} onClick={() => { setShowRespMenu(false); }}>
                            Return Policy
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative text-white'>
                        <NavLink to="/contact-us" onClick={() => { setShowRespMenu(false); }} className={({ isActive }) => `block w-full py-[15px] ${linkBase} hover:text-[#d5ab63]`}>
                            Contact Us
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                </ul>

                <div className="flex flex-col">
                    <a href="tel:+16894075222" className="flex justify-end gap-[10px] items-center text-white mt-[50px] font-muli ">
                        <FaPhoneAlt className="text-[#d5ab63]"/>
                        <p className='text-[17px] transition-colors duration-100 ease-in hover:text-[#d5ab63]'>(689) 407-5222</p>
                    </a>

                    <a href="mailto:info@zoom-vintageclassics.com" className="flex justify-end gap-[10px] items-center text-white mt-[15px] font-muli">
                        <IoMail  className="text-[#d5ab63]"/>
                        <p className='text-[17px] transition-colors duration-100 ease-in hover:text-[#d5ab63]'>info@zoom-vintageclassics.com</p>
                    </a>
                </div>
            </div >
        </>
    )
}

export default ResponsiveMenu;
