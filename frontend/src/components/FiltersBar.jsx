import { useMemo } from 'react';
import clsx from 'clsx';
import { TbFilterSearch } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";

export default function FiltersBar({
    active = 'all',                       // 'all' | 'new' | 'used'
    onChangeTab,                          // (next) => void
    search = '',
    onSearchChange,                       // (value) => void
    onSearchSubmit,                       // () => void
    onOpenFilters,                        // () => void
}) {
    const tabs = useMemo(() => ([
        { key: 'all', label: 'All'},
        { key: 'new', label: 'New'},
        { key: 'used', label: 'Used'},
    ]), []);

    return (
        <div className="w-full bg-gray-100 mt-[40px] font-muli">
            <hr className='text-gray-300' />
            <div className="sm:container sm:mx-auto px-4 py-[10px]">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 gap-[30px] lg:gap-0">
                    {/* Left: tabs */}
                    <div className="flex items-center">
                        <div className="block w-px h-5 bg-gray-300" />

                        {tabs.map(t => (
                            <div className='flex items-center' key={t.key}>
                                <button
                                    
                                    type="button"
                                    onClick={() => onChangeTab?.(t.key)}
                                    className={clsx(
                                        'relative pb-1 text-[19px] font-[600] transition-colors cursor-pointer px-6',
                                        active === t.key
                                            ? 'text-[#d5ab63]'
                                            : 'text-[#222732] hover:text-[#d5ab63]'
                                    )}
                                >
                                    <span>{t.label} </span>

                                    {/* active underline */}
                                    {active === t.key && (
                                        <span className="absolute -top-[27px] lg:-top-[37px] left-0 w-full right-0 h-[2px] bg-[#d5ab63]" />
                                    )}
                                </button>

                                <div className="block w-px h-5 bg-gray-300" />
                            </div>
                        ))}
                    </div>

                    {/* Right: Filters button + search */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-[30px]">
                        <button
                            type="button"
                            onClick={onOpenFilters}
                            className="flex items-center order-2 lg:order-1 gap-2 text-[19px] font-[600] text-[#222732] hover:text-[#d5ab63] transition cursor-pointer"
                        >
                            <TbFilterSearch className="text-[22px]" />
                            <span>Filters</span>
                        </button>

                        <form
                            onSubmit={(e) => { e.preventDefault(); onSearchSubmit?.(); }}
                            className="relative text-[#222732] order-1 lg:order-2"
                        >
                            <input
                                value={search}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder="Enter keyword"
                                className=" w-full lg:w-[320px] rounded-lg bg-white py-[13px] pr-[45px] pl-[20px] text-[17px] outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[#d5ab63] transition cursor-pointer"
                                aria-label="Search"
                            >
                                <FaSearch className="text-[22px]" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
