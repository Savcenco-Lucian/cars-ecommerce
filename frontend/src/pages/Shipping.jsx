import { Helmet } from '@vuer-ai/react-helmet-async';
import office from '../assets/siteImages/office.jpg'

const Shipping = () => {
    return (
        <>
            <Helmet>
                <title>Shipping | Zoom Vintage Classics</title>
                <meta name="description" content="Zoom Vintage Classics offers hassle-free, transparent, and dependable international shipping." />
            </Helmet>
            <section className='relative'>
                <div className='absolute inset-0 bg-[url(/shipping.jpg)] bg-cover bg-center'></div>

                <div className='absolute inset-0 bg-black/70'></div>

                <div className="relative flex justify-center h-full w-full pt-[150px] pb-[100px]">
                    <h1 className='text-[45px] sm:text-[61px] px-[15px] text-white font-muli font-[900] tracking-wide text-center'>
                        Shipping
                    </h1>
                </div>
            </section>

            <section className="pt-[70px] sm:pt-[90px] pb-[100px] sm:container sm:mx-auto px-[10px] font-muli lg:grid lg:grid-cols-3 lg:grid-rows-1 gap-[50px]">
                <div className="flex flex-col gap-[50px] lg:col-span-2">
                    <p className='text-[20px] text-gray-500 font-[700]'>Zoom Vintage Classics offers hassle-free, transparent, and dependable international shipping.</p>

                    <p className='text-gray-500'>No matter where you are in the world, we think your ideal vehicle should get to you without incident, safely, or securely. For this reason, we have established a reliable shipping procedure that makes both local and international delivery easy and completely transparent.</p>

                    <ul className='pl-[25px] border-l-6 border-[#d5ab63] py-[15px]'>
                        <li className='font-[600] text-[18px] text-gray-500'>📦 Door-to-Door Service - <span className='!font-[400]'>From our garage to your driveway.</span></li>
                        <li className='font-[600] text-[18px] mt-[5px] text-gray-500'>🚛 Only Enclosed Shipping - <span className='!font-[400]'>Complete protection each and every time.</span></li>
                        <li className='font-[600] text-[18px] mt-[5px] text-gray-500'>🛡️ Insured Transport - <span className='!font-[400]'>Complete insurance coverage is included with every shipment.</span></li>
                        <li className='font-[600] text-[18px] mt-[5px] text-gray-500'>🌍 Global Reach - <span className='!font-[400]'>We ship to more than 50 nations.</span></li>
                    </ul>

                    <p className='text-gray-500'>We only collaborate with logistical companies who are insured, licensed, and have experience working with antique and classic cars. All automobiles are transported in covered transport trucks, which provide the best defense against inclement weather, road debris, and onlookers.</p>

                    <p className='text-gray-500'>Our staff handles all aspects of the delivery procedure after your car is bought, including collection, inspection, customs paperwork, and door-to-door delivery. At every step, you'll get real-time help and comprehensive tracking updates.</p>

                    <p className='text-gray-500'>Because we genuinely care about our customers, we make it our mission to make sure every automobile comes in flawless condition and just as promised—no shortcuts, no surprises.</p>

                    <p className='text-gray-500'>Our shipping services make shipping simple, secure, and worry-free, whether you're across the state or the ocean.</p>
                </div>
                <img src={office} alt="" className='rounded-xl mt-[50px] lg:mt-0' />
            </section>
        </>
    )
}

export default Shipping
