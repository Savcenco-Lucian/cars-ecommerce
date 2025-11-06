import { Helmet } from '@vuer-ai/react-helmet-async';
import office from '../assets/siteImages/office.jpg'

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | Zoom Vintage Classics</title>
                <meta name="description" content="Zoom Vintage Classics Skyway respects your privacy and is committed to protecting your personal information." />
            </Helmet>
            <section className='relative'>
                <div className='absolute inset-0 bg-[url(/shipping.jpg)] bg-cover bg-center'></div>

                <div className='absolute inset-0 bg-black/70'></div>

                <div className="relative flex justify-center h-full w-full pt-[150px] pb-[100px] ">
                    <h1 className='text-[45px] sm:text-[61px] px-[15px] text-white font-muli font-[900] tracking-wide text-center'>
                        Privacy Policy
                    </h1>
                </div>
            </section>

            <section className="pt-[70px] sm:pt-[90px] pb-[100px] sm:container sm:mx-auto px-[10px] font-muli lg:grid lg:grid-cols-3 lg:grid-rows-1 gap-[50px]">
                <div className="flex flex-col gap-[50px] lg:col-span-2">
                    <p className='text-[20px] text-gray-500 font-[600]'>Zoom Vintage Classics ("we," "our," or "us") is dedicated to safeguarding your personal data and values your privacy. When you visit our website, <a href="https://zoomvintageclassics.com" className='!text-black'>https://zoomvintageclassics.com</a>, we gather, use, disclose, and protect your information as described in this Privacy Policy, along with any associated services or features. <u>You accept the terms of this Privacy Policy by using our website.</u></p>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>1. Information We Collect</p>
                        <p className='text-[16px]'>We collect both <b>personal information</b> and <b>non-personal information</b> from users.</p>
                        <p className='text-[19px]'>Personal Information:</p>
                        <ul className='flex flex-col gap-[15px]'>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Name</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Email address</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Phone number</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Mailing address</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Vehicle preferences or inquiries number</p>
                            </li>
                        </ul>
                        <p className='text-[19px]'>Non-Personal Information:</p>
                        <ul className='flex flex-col gap-[15px]'>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Browser type</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Device information</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>IP address</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Pages visited</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Time and date of visit</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Referral source</p>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>2. How We Use Your Information</p>
                        <p className='text-[16px]'>We use the collected information to:</p>
                        <ul className='flex flex-col gap-[15px]'>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Respond to inquiries or requests</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Process vehicle purchases or sales</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Improve our website and services</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Ensure website security and detect fraud or abuse</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Send updates, promotions, or newsletters (only if subscribed)</p>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>3. Sharing Your Information</p>
                        <p className='text-[16px]'><b>We do not sell or rent</b> your personal information. However, we may share information with:</p>
                        <ul className='flex flex-col gap-[15px]'>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Service providers assisting with website functionality, communication, or analytics</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Law enforcement or authorities when required by law</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Business partners, in the case of a merger, acquisition, or sale</p>
                            </li>
                        </ul>
                        <p className='text-[16px]'>All third-party service providers are contractually obligated to protect your data.</p>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>4. Cookies and Tracking Technologies</p>
                        <p className='text-[16px]'>We use cookies and similar technologies to:</p>
                        <ul className='flex flex-col gap-[15px]'>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Improve website functionality</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Analyze traffic and user behavior</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Personalize user experience</p>
                            </li>
                        </ul>
                        <p className='text-[16px]'>You can control or disable cookies through your browser settings.</p>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>5. Data Security</p>
                        <p className='text-[16px]'>We take appropriate technical and organizational measures to secure your information against unauthorized access, alteration, disclosure, or destruction.</p>
                        <p className='text-[16px]'>Despite our efforts, no method of transmission over the internet is 100% secure.</p>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>6. Third-Party Links</p>
                        <p className='text-[16px]'>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites. We encourage you to read their privacy policies.</p>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>7. Your Privacy Rights</p>
                        <p className='text-[16px]'>Depending on your location, you may have the right to:</p>
                        <ul className='flex flex-col gap-[15px]'>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Access the personal data we hold about you</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Request correction or deletion of your data</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Opt-out of marketing communications</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>Withdraw consent for data processing</p>
                            </li>
                            <li className='flex gap-[10px] items-center group'>
                                <span className='w-[8px] h-[8px] rounded-full bg-[#d5ab63]'></span>
                                <p>To exercise your rights, please contact us at: <br /> <a href="mailto:info@zoom-vintageclassics.com">📧 info@zoom-vintageclassics.com</a></p>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>8. Children’s Privacy</p>
                        <p className='text-[16px]'>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If we learn that a child has provided us with personal information, we will delete it promptly.</p>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>9. Changes to This Policy</p>
                        <p className='text-[16px]'>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date at the top. Please review it regularly.</p>
                    </div>

                    <div className="flex flex-col gap-[25px] text-gray-500">
                        <p className='text-[24px]'>10. Contact Us</p>
                        <p className='text-[16px]'>If you have questions about this Privacy Policy or how we handle your data, contact us at:
                            <br /><b>Zoom Vintage Classics</b>
                            <br />📍 <a href="https://maps.app.goo.gl/TgJTz1A19MnYYKCq8">4317 35th St, <br />Orlando, FL 32811</a>
                            <br />📧 <a href="mailto:info@zoom-vintageclassics.com">info@zoom-vintageclassics.com</a>
                            <br />📞 <a href="tel:+16894075222">(689) 407-5222</a></p>
                    </div>
                </div>
                <img src={office} alt="" className='rounded-xl mt-[50px] lg:mt-0' />
            </section>
        </>
    )
}

export default Privacy
