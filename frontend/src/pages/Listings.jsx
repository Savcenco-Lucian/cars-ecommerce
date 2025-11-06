import { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from '@vuer-ai/react-helmet-async';

import useListingFilters from '../hooks/useListingFilters';
import useFiltersUrl from '../hooks/useFiltersUrl';
import { fetchListingsWithFilters } from '../services/listings';
import api from '../api';

import ListingCard from '../components/ListingCard';
import CarFiltersModal from '../components/CarFiltersModal';
import scrollContext from '../contexts/scrollContext';
import '../styles/select.css';
import FiltersBar from '../components/FiltersBar';

const PAGE_SIZE_DEFAULT = 12; // keep for your testing

const humanize = (slug) =>
    (slug || '')
        .split('-')
        .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
        .join(' ');

/** ------------------- Helpers to normalize modal draft -> URL slugs ------------------- */
const labelOf = (obj) => obj?.name ?? obj?.type ?? obj?.label ?? obj?.title ?? '';
const buildIdMaps = (opts) => {
    // Build fast id->label maps for all option groups we care about
    const map = (arr) => {
        const m = new Map();
        (arr || []).forEach((x) => x?.id != null && m.set(x.id, labelOf(x)));
        return m;
    };
    return {
        make: map(opts?.makes),
        model: map(opts?.models), // if your API gives models flat; works with your /filters/ sample code
        color: map(opts?.colors),
        transmission: map(opts?.transmissions),
        condition: map(opts?.conditions),
        fuel_type: map(opts?.fuel_types),
        drive_type: map(opts?.drive_types),
        car_type: map(opts?.car_types),
        features: map(opts?.features),
        safety_features: map(opts?.safety_features),
    };
};

const toStringOrLookup = (val, idMap) => {
    if (val == null || val === '') return null;
    if (typeof val === 'string') return val;              // already a label
    if (typeof val === 'number') return idMap.get(val) || null; // id -> label
    if (typeof val === 'object') {
        // object with id or name/type
        if (val.id != null) return idMap.get(val.id) || labelOf(val) || null;
        return labelOf(val) || null;
    }
    return null;
};

const toMultiStrings = (vals, idMap) => {
    if (!Array.isArray(vals)) return [];
    return vals
        .map((v) => toStringOrLookup(v, idMap))
        .filter(Boolean);
};

// Map modal sort → DRF ordering (accept DRF values as-is too)
const normalizeOrdering = (val) => {
    const allowed = new Set(['created_at', '-created_at', 'price', '-price', 'mileage', '-mileage']);
    if (allowed.has(val)) return val;
    const map = {
        default: '',
        created_at_asc: 'created_at',
        created_at_desc: '-created_at',
        price_asc: 'price',
        price_desc: '-price',
        mileage_asc: 'mileage',
        mileage_desc: '-mileage',
    };
    return map[val] ?? '';
};

/** Convert modal draft (IDs/objects/strings) -> names your URL uses */
const normalizeDraftToUrlPayload = (draft, options) => {
    if (!draft) return {};
    const ids = buildIdMaps(options || {});
    return {
        // singles (names)
        make: toStringOrLookup(draft.make, ids.make),
        model: toStringOrLookup(draft.model, ids.model),
        color: toStringOrLookup(draft.color, ids.color),
        transmission: toStringOrLookup(draft.transmission, ids.transmission),
        condition: toStringOrLookup(draft.condition, ids.condition), // "New"/"Used"
        fuel_type: toStringOrLookup(draft.fuel_type, ids.fuel_type),
        drive_type: toStringOrLookup(draft.drive_type, ids.drive_type),
        car_type: toStringOrLookup(draft.car_type, ids.car_type),
        doors: draft.doors ?? null,

        // search text
        search: draft.search ?? undefined,

        // ranges
        price_min: draft.price_min ?? null,
        price_max: draft.price_max ?? null,
        mileage_min: draft.mileage_min ?? null,
        mileage_max: draft.mileage_max ?? null,
        cylinders_min: draft.cylinders_min ?? null,
        cylinders_max: draft.cylinders_max ?? null,
        year_min: draft.year_min ?? null,
        year_max: draft.year_max ?? null,

        // text
        vin: draft.vin ?? '',

        // multis (names)
        features: toMultiStrings(draft.features, ids.features),
        safety_features: toMultiStrings(draft.safety_features, ids.safety_features),

        // ordering
        ordering: normalizeOrdering(draft.ordering),
    };
};
/** ------------------------------------------------------------------------ */

export default function Listings() {
    const { loading, apiArgs } = useListingFilters();
    const { filters, set } = useFiltersUrl(); // includes search, ordering, page

    const [results, setResults] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState(null);

    // breadcrumb read only
    const [searchParams] = useSearchParams();
    const { enableScroll, disableScroll } = useContext(scrollContext);

    // in-flight state + request guard
    const [isFetching, setIsFetching] = useState(false);
    const reqIdRef = useRef(0);

    // page from the hook
    const page = filters.page || 1;
    const setPage = (p) => set.page(p);
    const resetToFirstPage = () => setPage(1);

    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    // Tabs <-> URL
    const activeTab = useMemo(() => {
        if (!hydrated) return 'all';
        const c = (filters.condition || '').toLowerCase();
        if (c === 'new') return 'new';
        if (c === 'used') return 'used';
        return 'all';
    }, [hydrated, filters.condition]);

    const handleChangeTab = (next) => {
        if (next === 'all') {
            set.setMany({ condition: null, page: 1 });
            return;
        }
        if (next === 'new') {
            set.setMany({ condition: 'New', page: 1 });
            return;
        }
        if (next === 'used') {
            set.setMany({ condition: 'Used', page: 1 });
            return;
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page]);


    // Search field <-> URL
    const [q, setQ] = useState(filters.search || '');
    useEffect(() => setQ(filters.search || ''), [filters.search]);
    const handleSearchSubmit = () => {
        set.search(q); // hook resets page
    };

    useEffect(() => {
        if (!filtersOpen) enableScroll();
        else disableScroll();
    }, [filtersOpen, enableScroll, disableScroll]);

    // hydration guard for breadcrumb
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const makeSlug = mounted ? searchParams.get('make') : null;
    const modelSlug = mounted ? searchParams.get('model') : null;

    const { makeLink, modelLink } = useMemo(() => {
        const searchBase = '/search';
        const makeLinkVal = makeSlug
            ? `${searchBase}?make=${encodeURIComponent(makeSlug)}`
            : null;

        const modelLinkVal = modelSlug
            ? `${searchBase}?${[
                makeSlug ? `make=${encodeURIComponent(makeSlug)}` : null,
                `model=${encodeURIComponent(modelSlug)}`,
            ]
                .filter(Boolean)
                .join('&')}`
            : null;

        return { makeLink: makeLinkVal, modelLink: modelLinkVal };
    }, [makeSlug, modelSlug]);

    // fetch listings when URL-derived API params ready (append page)
    useEffect(() => {
        if (loading || !apiArgs) return;

        const myReqId = ++reqIdRef.current;
        setIsFetching(true);

        let cancelled = false;
        (async () => {
            try {
                const data = await fetchListingsWithFilters({
                    ...apiArgs,
                    params: { ...(apiArgs.params || {}), page },
                });
                if (!cancelled && myReqId === reqIdRef.current) {
                    setResults(data);
                }
            } finally {
                if (!cancelled && myReqId === reqIdRef.current) {
                    setIsFetching(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [loading, apiArgs, page]);

    // fetch /filters/ once (for options for the modal)
    useEffect(() => {
        (async () => {
            const res = await api.get('/filters/');
            setFilterOptions(res.data);
        })();
    }, []);

    // pagination calculations
    const totalCount = results?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE_DEFAULT));
    const canPrev = page > 1;
    const canNext = page < totalPages;
    const windowSize = 5;
    const start = Math.max(1, page - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    const fromIdx = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE_DEFAULT + 1;
    const toIdx = Math.min(page * PAGE_SIZE_DEFAULT, totalCount);
    const rangeText =
        totalCount === 0
            ? '0 results'
            : `${fromIdx}–${toIdx} of ${totalCount} ${totalCount === 1 ? 'result' : 'results'}`;

    return (
        <>
            <Helmet>
                <title>{`Listings | Zoom Vintage Classics`}</title>
                <meta
                    name="description"
                    content="Find your ideal dream car. Zoom Vintage Classics gives you the opportunity to buy your dream classic muscle car!"
                />
            </Helmet>

            <section className="pt-[121px] lg:pt-[119px] lg:pb-[17px] bg-[#222732]">
                <div className="flex justify-center h-full w-full">
                    <nav
                        className="text-[14px] text-gray-400 font-muli tracking-wide text-center gap-[30px] hidden lg:flex z-[51]"
                        aria-label="Breadcrumb"
                    >
                        <Link to="/home">Home</Link>
                        <p>/</p>
                        <Link to="/search">Search</Link>
                        {makeSlug && (
                            <>
                                <p>/</p>
                                <Link to={makeLink}>{humanize(makeSlug)}</Link>
                            </>
                        )}
                        {modelSlug && (
                            <>
                                <p>/</p>
                                <Link to={modelLink}>{humanize(modelSlug)}</Link>
                            </>
                        )}
                    </nav>
                </div>
            </section>

            {/* Filters bar */}
            <FiltersBar
                active={activeTab}
                onChangeTab={handleChangeTab}
                search={q}
                onSearchChange={setQ}
                onSearchSubmit={handleSearchSubmit}
                onOpenFilters={() => setFiltersOpen(true)}
            />

            {/* Header with range + sort */}
            <section className="sm:container sm:mx-auto px-4 py-8 flex sm:flex-row flex-col sm:justify-between gap-[20px] text-[#222732] font-muli">
                <p className="font-[800] text-[30px]">{rangeText}</p>

                <div className="flex gap-[25px] items-center w-full sm:max-w-[300px]">
                    <p className="hidden lg:block text-[15px] font-[700] ">Sort By:</p>
                    <select
                        value={filters.ordering || ''}
                        onChange={(e) => {
                            set.ordering(e.target.value); // hook resets page for you
                        }}
                        className="font-muli px-[24px] py-[10px] text-[#181616] font-[700] w-full lg:w-auto rounded-lg shadow outline-none border-[1px] border-gray-300 text-[14px]"
                    >
                        <option value="">Default</option>
                        <option value="-created_at">Date Listed: Newest</option>
                        <option value="created_at">Date Listed: Oldest</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="mileage">Mileage: Low to High</option>
                        <option value="-mileage">Mileage: High to Low</option>
                    </select>
                </div>
            </section>

            {/* Results */}
            <section className="sm:container sm:mx-auto px-4 py-8 -mt-[20px]">
                {!results ? (
                    // Initial load spinner (no data yet)
                    <div className="flex justify-center items-center rounded-2xl z-10 scale-[0.4] max-h-[300px]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#D5AB63" stroke="#D5AB63" strokeWidth="1" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4" /></circle><circle fill="#D5AB63" stroke="#D5AB63" strokeWidth="1" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2" /></circle><circle fill="#D5AB63" stroke="#D5AB63" strokeWidth="1" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0" /></circle></svg>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Overlay while refreshing */}
                        {isFetching && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-md z-10">
                                <div className="scale-[0.4]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#D5AB63" stroke="#D5AB63" strokeWidth="1" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4" /></circle><circle fill="#D5AB63" stroke="#D5AB63" strokeWidth="1" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2" /></circle><circle fill="#D5AB63" stroke="#D5AB63" strokeWidth="1" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0" /></circle></svg>
                                </div>
                            </div>
                        )}

                        {totalCount === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center px-4 py-16 border-2 border-[#222732] rounded-lg bg-white font-muli">
                                <p className="text-[20px] font-semibold text-[#222732]">No results match your filters.</p>
                                <p className="text-[14px] text-gray-500 mt-2">Try clearing filters to see all listings.</p>
                                <button
                                    className="mt-5 px-4 py-2 rounded bg-[#d5ab63] text-white hover:bg-[#b28b4f] transition cursor-pointer"
                                    onClick={() => set.clearAll()}
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {results.results?.map((item) => (
                                    <ListingCard key={item.id} listing={item} />
                                ))}
                            </div>
                        )}

                        { }
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-4 select-none text-[#222732] font-muli">
                                <button
                                    className="disabled:hidden cursor-pointer"
                                    onClick={() => setPage(1)}
                                    disabled={!canPrev}
                                >
                                    «
                                </button>
                                <button
                                    className="disabled:hidden cursor-pointer"
                                    onClick={() => setPage(page - 1)}
                                    disabled={!canPrev}
                                >
                                    ‹
                                </button>

                                {/* windowed page numbers */}
                                {start > 1 && (
                                    <button className="w-[50px] h-[50px] bg-[#222732] text-white rounded-full cursor-pointer hover:scale-[1.02] hover:text-[#d5ab63] transition" onClick={() => setPage(1)}>
                                        1
                                    </button>
                                )}
                                {start > 2 && <span className="px-2">…</span>}

                                {pages.map((p) => (
                                    <button
                                        key={p}
                                        className={`w-[50px] h-[50px] bg-[#222732] text-white rounded-full cursor-pointer ${p === page ? 'bg-[#d5ab63]  hover:scale-[1.02]  transition ' : ' hover:scale-[1.02] hover:text-[#d5ab63] transition'
                                            }`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}

                                {end < totalPages - 1 && <span className="px-2">…</span>}
                                {end < totalPages && (
                                    <button
                                        className="w-[50px] h-[50px] bg-[#222732] text-white rounded-full cursor-pointer hover:scale-[1.02] hover:text-[#d5ab63] transition"
                                        onClick={() => setPage(totalPages)}
                                    >
                                        {totalPages}
                                    </button>
                                )}

                                <button
                                    className="disabled:hidden cursor-pointer"
                                    onClick={() => setPage(page + 1)}
                                    disabled={!canNext}
                                >
                                    ›
                                </button>
                                <button
                                    className="disabled:hidden cursor-pointer"
                                    onClick={() => setPage(totalPages)}
                                    disabled={!canNext}
                                >
                                    »
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Modal — normalize IDs -> names before setMany */}
            <CarFiltersModal
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                options={filterOptions}
                value={filters}
                onApply={(draft) => {
                    const payload = normalizeDraftToUrlPayload(draft, filterOptions);
                    // Now URL gets nice slugs; hook will reset page for non-page updates.
                    set.setMany({ ...draft, page: 1 });
                    setFiltersOpen(false);
                }}
            />
        </>
    );
}
