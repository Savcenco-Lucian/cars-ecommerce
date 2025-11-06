import logoNoBg from '../assets/siteImages/logoNoBg.png'
import { Link } from 'react-router'

const Footer = () => {
  return (
    <footer className='bg-[#222732] font-muli'>
      <div className="sm:container sm:mx-auto px-[25px] pt-[100px] pb-[30px] flex flex-col gap-[30px]">
        <div className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-between gap-[40px]">
          <img src={logoNoBg} alt="Zoom Vintage Classics" className='w-[140px]' />
          <p className='text-white max-w-[265px] sm:text-start text-center'>At Zoom Vintage Classics, we don’t just offer classic cars – we offer experiences, nostalgia, and a connection to the past. Every vehicle in our collection is handpicked, thoroughly checked, and ready to hit the road or become a treasured part of your collection.</p>
          <ul className='flex flex-wrap gap-[35px] text-[17px] max-w-[265px] text-white'>
            <li><Link to={'/search'} className='flex gap-[10px] items-center group'>
              <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
              <p className='group-hover:text-[#d5ab63] group-hover:translate-x-[7%] transition-all duration-75 ease-in'>Listings</p>
            </Link></li>
            <li><Link to={'/return-policy'} className='flex gap-[10px] items-center group'>
              <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
              <p className='group-hover:text-[#d5ab63] group-hover:translate-x-[7%] transition-all duration-75 ease-in'>Return Policy</p>
            </Link></li>
            <li><Link to={'/privacy-policy'} className='flex gap-[10px] items-center group'>
              <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
              <p className='group-hover:text-[#d5ab63] group-hover:translate-x-[7%] transition-all duration-75 ease-in'>Privacy Policy</p>
            </Link></li>
            <li><Link to={'/shipping'} className='flex gap-[10px] items-center group'>
              <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
              <p className='group-hover:text-[#d5ab63] group-hover:translate-x-[7%] transition-all duration-75 ease-in'>Shipping</p>
            </Link></li>
            <li><Link to={'/contact-us'} className='flex gap-[10px] items-center group'>
              <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
              <p className='group-hover:text-[#d5ab63] group-hover:translate-x-[7%] transition-all duration-75 ease-in'>Contact Us</p>
            </Link></li>
          </ul>
          <div className="flex flex-col gap-[30px] lg:ml-auto xl:ml-0">
            <a href="tel:+16894075222" className="flex items-center gap-[10px] items-center text-white">
              <p className='text-[30px] font-[900] '>(689) <span className='text-[#d5ab63]'>407-5222</span> </p>              
            </a>

            <a href="mailto:info@zoom-vintageclassics.com" className="flex justify-center sm:justify-end gap-[10px] items-center text-white">
              <p className='text-[17px]'>info@zoom-vintageclassics.com</p>
            </a>

            <a href="https://maps.app.goo.gl/TgJTz1A19MnYYKCq8" className="flex flex-col items-center sm:items-end text-white">
              <p className='text-[17px]'>4317 35th St</p>
                <p className='text-[17px]'>Orlando, FL 32811</p>
            </a>
          </div>
        </div>

        <hr className='text-gray-600' />

        <p className='text-white sm:text-start text-center'>Copyright © 2025. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
