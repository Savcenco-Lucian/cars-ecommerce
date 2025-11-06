import { Link } from 'react-router';

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/listing/${listing.title.toLowerCase().replace(/\s+/g, '-')}-${listing.id}`} className='shadow-md rounded-md flex flex-col overflow-hidden h-full  w-full group'>
        <div className="bg-gray-200 min-h-[100px] h-full">
          <img 
               src={listing.listing_images[0].path} 
               alt={`${listing.make.name} ${listing.model.name} ${listing.year}`} 
               className='group-hover:scale-[1.1] h-full z-14 transition-all duration-[0.7s] ease-in-out cursor-pointer relative top-1/2 left-1/2 w-full max-h-full object-cover transform -translate-x-1/2 -translate-y-1/2'
          />
        </div>
        <div className="bg-[#222732] px-[20px] py-[15px] flex flex-col gap-[10px] font-muli text-white z-[15]">
          <p className='text-[17px] font-[700] tracking-wide truncate'>{listing.title}</p>
          <p className='text-[20px] font-[800] tracking-wide'>${listing.price.toLocaleString()}</p>
          <hr />
          <div className="flex flex-wrap items-center gap-[20px] text-[14px] font-[600] tracking-wide  h-[31px] mt-[5px]">
            <p className='px-[12px] py-[5px] bg-[#d5ab63] rounded-md'>{listing.year}</p>
            <p className='text-gray-400'>{listing.mileage.toLocaleString()} miles</p>
            <p className='text-gray-400'>{listing.transmission.type}</p>
            <p className='text-gray-400'>{listing.fuel_type.type} </p>
          </div>
        </div>
    </Link>
  )
}

export default ListingCard;
