import { useState, useEffect, useContext } from 'react'
import { CgMenuRight } from "react-icons/cg";
import { NavLink, useLocation } from 'react-router-dom'
import scrollContext from '../contexts/scrollContext'
import logoNoBg from '../assets/siteImages/logoNoBg.png'
import ResponsiveMenu from './ResponsiveMenu'

const Navbar = () => {
  const [showRespMenu, setShowRespMenu] = useState(false)
  const [isFixedVisible, setIsFixedVisible] = useState(false)
  const { enableScroll, disableScroll } = useContext(scrollContext)
  const location = useLocation().pathname

  useEffect(() => {
    if (!showRespMenu) {
      enableScroll()
    } else {
      disableScroll()
    }
  }, [showRespMenu])

  useEffect(() => {
    const handleScroll = () => {
      setIsFixedVisible(window.scrollY > 1)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkBase =
    "text-[16px] font-[600] tracking-wide transition-colors duration-100 ease-in"

  const NavContent = ({ isTransparent }) => {
    const textColorClass = isTransparent ? `text-white` : "text-[#222732]"

    return (
      <nav className={`sm:container sm:mx-auto flex justify-between  bg-transparent px-[20px]  ${isTransparent ? 'items-center lg:items-start lg:py-[5px]' : 'items-center'}`}>
        <NavLink to="/" className="inline-block">
          <img
            src={logoNoBg}
            alt="Zoom Vintage Classics"
            className={`${isTransparent ? 'h-[120px] lg:h-[145px]' : 'h-[80px]'}  rounded-[5px]`}
          />
        </NavLink>

        <ul className={`hidden lg:flex gap-[35px] xl:gap-[55px] ${isTransparent ? 'pt-[45px]' : ''}`}>
          <li className="group relative">
            <NavLink 
              to="/" 
              end 
              className={`${linkBase} ${textColorClass} hover:text-[#d5ab63]`}>
              Home
            </NavLink>
            <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
          </li>

          <li className="group relative">
            <NavLink 
              to="/search" 
              end 
              className={`${linkBase} ${textColorClass} hover:text-[#d5ab63]`}>
              Listings
            </NavLink>
            <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
          </li>

          <li className="group relative">
            <NavLink 
              to="/shipping" 
              end 
              className={`${linkBase} ${textColorClass} hover:text-[#d5ab63]`}>
              Shipping
            </NavLink>
            <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
          </li>

          <li className="group relative">
            <NavLink 
              to="/return-policy" 
              end 
              className={`${linkBase} ${textColorClass} hover:text-[#d5ab63]`}>
              Return Policy
            </NavLink>
            <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
          </li>

          <li className="group relative">
            <NavLink 
              to="/contact-us" 
              end 
              className={`${linkBase} ${textColorClass} hover:text-[#d5ab63]`}>
              Contact Us
            </NavLink>
            <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
          </li>
        </ul>

         <img
            src={logoNoBg}
            alt=""
            className={`${isTransparent ? 'h-[120px] lg:h-[145px]' : 'h-[80px]'} hidden lg:block opacity-0 rounded-[5px]`}
          />
        <CgMenuRight className={`lg:hidden text-4xl cursor-pointer text-[#d5ab63]`} onClick={() => setShowRespMenu(true)} />
      </nav>
    )
  }

  return (
    <>
      <header className={`font-muli py-[0px] fixed top-0 left-0 z-50 transition-transform duration-[2s] ease-in-out bg-transparent w-full ${isFixedVisible ? 'opacity-0 hidden' : 'opacity-100'}`}>
        {NavContent({ isTransparent: true })}
      </header>

      <header className={`font-muli py-[0px] bg-white py-[5px] w-full fixed top-0 left-0 z-52 shadow-md transition-transform duration-[1s] ease-in-out ${isFixedVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        {NavContent({ isTransparent: false })}
      </header>

      <ResponsiveMenu showRespMenu={showRespMenu} setShowRespMenu={setShowRespMenu}/>
    </>
  )
}

export default Navbar
