import { Helmet } from '@vuer-ai/react-helmet-async';
import office from '../assets/siteImages/office.jpg'

const Return = () => {
    return (
        <>
            <Helmet>
                <title>Return Policy | Zoom Vintage Classics</title>
                <meta name="description" content="At Zoom Vintage Classics, we put your comfort first." />
            </Helmet>
            <section className='relative'>
                <div className='absolute inset-0 bg-[url(/shipping.jpg)] bg-cover bg-center'></div>

                <div className='absolute inset-0 bg-black/70'></div>

                <div className="relative flex justify-center h-full w-full pt-[150px] pb-[100px]">
                    <h1 className='text-[45px] sm:text-[61px] px-[15px] text-white font-muli font-[900] tracking-wide text-center'>
                        Return Policy
                    </h1>
                </div>
            </section>

            <section className="pt-[70px] sm:pt-[90px] pb-[100px] sm:container sm:mx-auto px-[10px] font-muli lg:grid lg:grid-cols-3 lg:grid-rows-1 gap-[50px]">
                <div className="flex flex-col gap-[50px] lg:col-span-2">
                    <p className='text-[20px] text-gray-500 font-[700]'>Purchase with assurance—30 days or 300 miles are guaranteed.</p>

                    <p className='text-gray-500'>At <b>Zoom Vintage Classics</b>, we put your comfort first. <br />For this reason, we provide a 30-day or 300-mile satisfaction guarantee on every car you buy from us, whichever comes first.</p>

                    <p className='text-gray-500'>We recognize that purchasing a vintage vehicle is more than simply a business deal; it's a declaration of passion and a personal desire. During the warranty period, just get in touch with us if your car doesn't live up to your expectations. <br />We'll help you return it or professionally and honorably handle the situation.</p>

                    <ul className='pl-[25px] border-l-6 border-[#d5ab63] py-[15px]'>
                        <li className='font-[600] text-[18px] text-gray-500'>✅ No unstated fine print</li>
                        <li className='font-[600] text-[18px] mt-[5px] text-gray-500'>✅ Contractually covered</li>
                        <li className='font-[600] text-[18px] mt-[5px] text-gray-500'>✅ Tailored assistance from our committed staff</li>
                    </ul>

                    <p className='text-gray-500'>We can assure you that you will never be traveling alone. We treat our customers with respect, meticulous attention to detail, and complete openness, just as we do our own cars.</p>
                </div>
                <img src={office} alt=""  className='rounded-xl mt-[50px] lg:mt-0' />
            </section>
        </>
    )
}

export default Return
