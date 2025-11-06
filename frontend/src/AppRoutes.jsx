import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Shipping from './pages/Shipping';
import Return from './pages/Return';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Calculator from './pages/Calculator';
import ListingDetails from './pages/ListingDetails';
import Listings from './pages/Listings';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/search' element={<Listings />}/>
            <Route path='/listing/:slug' element={<ListingDetails />}/>
            <Route path='/calculator/:priceFromParams' element={<Calculator />}/>
            <Route path='/contact-us' element={<Contact />}/>
            
            <Route path='/shipping' element={<Shipping />}/>
            <Route path='/return-policy' element={<Return />}/>
            <Route path='/privacy-policy' element={<Privacy />}/>

            <Route path="*" element={<Home />} />
        </Routes>
    ) 
}