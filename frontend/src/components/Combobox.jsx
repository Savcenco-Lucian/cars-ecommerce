import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import api from '../api'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router'

export default function Example({ conditionFilter }) {
    const [query, setQuery] = useState('')
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedMake, setSelectedMake] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/makes/');
                setMakes(res.data);
            } catch (error) {
                console.error('Error fetching makes');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchModels = async () => {
            if (selectedMake) {
                try {
                    setModels([]);
                    setSelectedModel(null);
                    const res = await api.get(`/models/${selectedMake.id}/`);
                    setModels(res.data);
                } catch (error) {
                    console.error('Error fetching models');
                }
            } else {
                setModels([]);
                setSelectedModel(null);
            }
        };
        fetchModels();
    }, [selectedMake]);

    const filteredMakes = query === '' ? makes : makes.filter((make) => make.name.toLowerCase().includes(query.toLowerCase()));
    const filteredModels = query === '' ? models : models.filter((model) => model.name.toLowerCase().includes(query.toLowerCase()));

    const search = () => {
        let url = '/search?make=';

        if (selectedMake) {
            url += encodeURIComponent(selectedMake.name.toLowerCase());
        } else {
            return;
        }

        if (selectedModel) {
            url += `&model=${encodeURIComponent(selectedModel.name.toLowerCase())}`;
        }

        if (conditionFilter !== 'All') {
            url += `&condition=${encodeURIComponent(conditionFilter.toLowerCase())}`;
        }

        navigate(url);
    };

    return (
        <div className="bg-white rounded-[20px] py-[5px] px-[5px] cstmvvv:py-[15px] cstmvvv:px-[20px] shadow-[0px_9px_0px_0px_rgba(255,_255,_255,_0.45)] w-full max-w-[800px] mx-auto flex flex-col md:flex-row justify-between gap-[10px]">

            {
                makes && (
                    <>
                        <Combobox value={selectedMake} onChange={setSelectedMake} onClose={() => setQuery('')}>
                            <div className="relative z-[34]">
                                <ComboboxButton className="w-full">
                                    <ComboboxInput
                                        className={clsx(
                                            `w-full pointer-events-none cursor-pointer rounded-lg border-2 ${selectedMake ? 'border-[#d5ab63]' : 'border-gray-100'} bg-white py-1.5 pr-8 pl-3 text-sm/6 text-black h-[50px] xs:min-w-[300px] lg:min-w-[320px]`,
                                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 font-muli'
                                        )}
                                        displayValue={(make) => make?.name || ''}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder='Select Make'
                                        disabled
                                    />
                                </ComboboxButton>
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                    <ChevronDownIcon className="size-4 fill-black group-data-hover:fill-black cursor-pointer" />
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    'w-(--input-width) rounded-b-xl border border-gray-300 bg-white p-1 z-[33]',
                                    'transition duration-100 ease-in data-leave:data-closed:opacity-0 [--anchor-gap:--spacing(-1.5)]'
                                )}
                            >
                                {filteredMakes.map((make) => (
                                    <ComboboxOption
                                        key={make.id}
                                        value={make}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:cursor-pointer data-selected:bg-[#f5efe4]"
                                    >
                                        <CheckIcon className="invisible size-4 fill-[#d5ab63] group-data-selected:visible" />
                                        <div className="text-sm/6 text-black group-data-selected:text-[#d5ab63] group-data-focus:text-[#d5ab63] font-muli">{make.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>

                        <Combobox value={selectedModel} onChange={setSelectedModel} onClose={() => setQuery('')} disabled={models.length === 0}>
                            <div className="relative z-[31]">
                                <ComboboxButton className="w-full">
                                    <ComboboxInput
                                        className={clsx(
                                            `w-full pointer-events-none cursor-pointer rounded-lg border-2 ${selectedModel ? 'border-[#d5ab63]' : 'border-gray-100'} transition-all duration-150 ease-in-out ${!selectedMake ? 'bg-gray-100' : 'bg-white'} py-1.5 pr-8 pl-3 text-sm/6 text-black h-[50px] xs:min-w-[300px] lg:min-w-[320px]`,
                                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 font-muli'
                                        )}
                                        displayValue={(model) => model?.name || ''}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder='Select Model'
                                        disabled
                                    />
                                </ComboboxButton>
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                    <ChevronDownIcon className="size-4 fill-black group-data-hover:fill-black cursor-pointer" />
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    'w-(--input-width) rounded-b-xl border border-gray-300 bg-white p-1 z-[30]',
                                    'transition duration-100 ease-in data-leave:data-closed:opacity-0 [--anchor-gap:--spacing(-1.5)]'
                                )}
                            >
                                {filteredModels.map((model) => (
                                    <ComboboxOption
                                        key={model.id}
                                        value={model}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:cursor-pointer data-selected:bg-[#f5efe4]"
                                    >
                                        <CheckIcon className="invisible size-4 fill-[#d5ab63] group-data-selected:visible" />
                                        <div className="text-sm/6 text-black group-data-selected:text-[#d5ab63] group-data-focus:text-[#d5ab63] font-muli">{model.name}</div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>

                        <button onClick={() => search()} className="py-[10px] w-full bg-[#d5ab63] text-white flex justify-center items-center rounded-lg text-[16px] md:text-[22px] hover:bg-[#735c36] cursor-pointer transition-all duration-75 ease-in">
                            <p className='md:hidden '>Search &nbsp;</p>
                            <FaSearch />
                        </button>
                    </>
                )
            }

        </div>
    );
}
