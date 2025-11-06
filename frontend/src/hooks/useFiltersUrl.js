// src/hooks/useFiltersUrl.js
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// same slug logic you already use elsewhere
const slug = (s) => (s ?? '').trim().toLowerCase().replace(/\s+/g, '-');

const ensureArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

// Read multi values from URL (supports repeated keys and CSV)
const getMulti = (sp, key) => {
  const items = ensureArray(sp.getAll(key)).flatMap((v) =>
    String(v)
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
  );
  return [...new Set(items)];
};

// Set a single param (name/slug) — remove if falsy
const setSingle = (sp, key, value) => {
  if (!value) {
    sp.delete(key);
  } else {
    sp.set(key, slug(value));
  }
};

// Set a numeric param — remove if undefined / null / ''
const setNumber = (sp, key, value) => {
  if (value === undefined || value === null || value === '') {
    sp.delete(key);
  } else {
    sp.set(key, String(value));
  }
};

// Replace an entire multi param list (names/slugs)
const setMulti = (sp, key, values) => {
  sp.delete(key);
  const items = (values || [])
    .map((v) => slug(typeof v === 'string' ? v : v?.name || v?.type || ''))
    .filter(Boolean);
  // Use repeated keys (features=a&features=b)
  items.forEach((val) => sp.append(key, val));
};

// Toggle one value in a multi param
const toggleInMulti = (sp, key, value) => {
  const val = slug(typeof value === 'string' ? value : value?.name || value?.type || '');
  if (!val) return;
  const current = getMulti(sp, key);
  const exists = current.includes(val);
  const next = exists ? current.filter((x) => x !== val) : [...current, val];
  setMulti(sp, key, next);
};

const ALLOWED_ORDERING = new Set([
  'created_at', '-created_at',
  'price', '-price',
  'mileage', '-mileage',
]);

export default function useFiltersUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    // Read names (slugs) directly from URL
    return {
      page: (Number.parseInt(searchParams.get('page')) || null),
      make: searchParams.get('make') || null,
      model: searchParams.get('model') || null,
      color: searchParams.get('color') || null,
      transmission: searchParams.get('transmission') || null,
      condition: searchParams.get('condition') || null,
      fuel_type: searchParams.get('fuel_type') || null,
      drive_type: searchParams.get('drive_type') || null,
      car_type: searchParams.get('car_type') || null,
      doors: searchParams.get('doors') || null,

      search: searchParams.get('search') || '',

      // ranges
      price_min: searchParams.get('price_min') || null,
      price_max: searchParams.get('price_max') || null,
      mileage_min: searchParams.get('mileage_min') || null,
      mileage_max: searchParams.get('mileage_max') || null,
      cylinders_min: searchParams.get('cylinders_min') || null,
      cylinders_max: searchParams.get('cylinders_max') || null,
      year_min: searchParams.get('year_min') || null,
      year_max: searchParams.get('year_max') || null,

      // text
      vin: searchParams.get('vin') || '',

      // multis (names in URL)
      features: getMulti(searchParams, 'features'),
      safety_features: getMulti(searchParams, 'safety_features'),

      // ordering (DRF native)
      ordering: searchParams.get('ordering') && ALLOWED_ORDERING.has(searchParams.get('ordering'))
        ? searchParams.get('ordering')
        : null,
    };
  }, [searchParams]);

  // helper to reset page when filters change
  const resetPage = (sp) => { sp.delete('page'); };

  // All setters update the URL (and thus trigger your fetch effect)
  const set = useMemo(() => ({
    // pagination
    page: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'page', num);
      return sp;
    }),

    // singles (accept a string name, or an object with name/type)
    make: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'make', typeof v === 'string' ? v : v?.name || v?.type);
      if (!v) sp.delete('model'); // clear model if make cleared
      resetPage(sp);
      return sp;
    }),
    model: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'model', typeof v === 'string' ? v : v?.name || v?.type);
      resetPage(sp);
      return sp;
    }),
    color: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'color', typeof v === 'string' ? v : v?.name || v?.type);
      resetPage(sp);
      return sp;
    }),
    transmission: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'transmission', typeof v === 'string' ? v : v?.name || v?.type);
      resetPage(sp);
      return sp;
    }),
    condition: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'condition', typeof v === 'string' ? v : v?.name || v?.type);
      resetPage(sp);
      return sp;
    }),
    fuel_type: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'fuel_type', typeof v === 'string' ? v : v?.name || v?.type);
      resetPage(sp);
      return sp;
    }),
    drive_type: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'drive_type', typeof v === 'string' ? v : v?.name || v?.type);
      resetPage(sp);
      return sp;
    }),
    car_type: (v) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setSingle(sp, 'car_type', typeof v === 'string' ? v : v?.name || v?.type);
      resetPage(sp);
      return sp;
    }),
    doors: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'doors', num);
      resetPage(sp);
      return sp;
    }),

    search: (s) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      if (!s) sp.delete('search');
      else sp.set('search', String(s).trim());
      resetPage(sp);
      return sp;
    }),

    // ranges
    priceMin: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'price_min', num);
      resetPage(sp);
      return sp;
    }),
    priceMax: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'price_max', num);
      resetPage(sp);
      return sp;
    }),
    mileageMin: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'mileage_min', num);
      resetPage(sp);
      return sp;
    }),
    mileageMax: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'mileage_max', num);
      resetPage(sp);
      return sp;
    }),
    cylindersMin: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'cylinders_min', num);
      resetPage(sp);
      return sp;
    }),
    cylindersMax: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'cylinders_max', num);
      resetPage(sp);
      return sp;
    }),
    yearMin: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'year_min', num);
      resetPage(sp);
      return sp;
    }),
    yearMax: (num) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      setNumber(sp, 'year_max', num);
      resetPage(sp);
      return sp;
    }),

    // text
    vin: (s) => setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      if (!s) sp.delete('vin');
      else sp.set('vin', s.trim());
      resetPage(sp);
      return sp;
    }),

    // multi
    setFeatures: (values /* array of names or objects */) =>
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);
        setMulti(sp, 'features', values);
        resetPage(sp);
        return sp;
      }),
    toggleFeature: (value) =>
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);
        toggleInMulti(sp, 'features', value);
        resetPage(sp);
        return sp;
      }),
    setSafetyFeatures: (values) =>
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);
        setMulti(sp, 'safety_features', values);
        resetPage(sp);
        return sp;
      }),
    toggleSafetyFeature: (value) =>
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);
        toggleInMulti(sp, 'safety_features', value);
        resetPage(sp);
        return sp;
      }),

    // ordering (expects a DRF-valid value)
    ordering: (value /* 'created_at' | '-created_at' | 'price' | '-price' | 'mileage' | '-mileage' */) =>
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);
        if (!value || !ALLOWED_ORDERING.has(value)) sp.delete('ordering');
        else sp.set('ordering', value);
        resetPage(sp);
        return sp;
      }),

    // bulk replace from an object of partial filters (names, numbers, arrays)
    setMany: (obj = {}) =>
      setSearchParams((prev) => {
        const sp = new URLSearchParams(prev);
        // singles
        if ('make' in obj) setSingle(sp, 'make', obj.make);
        if ('model' in obj) setSingle(sp, 'model', obj.model);
        if ('color' in obj) setSingle(sp, 'color', obj.color);
        if ('transmission' in obj) setSingle(sp, 'transmission', obj.transmission);
        if ('condition' in obj) setSingle(sp, 'condition', obj.condition);
        if ('fuel_type' in obj) setSingle(sp, 'fuel_type', obj.fuel_type);
        if ('drive_type' in obj) setSingle(sp, 'drive_type', obj.drive_type);
        if ('car_type' in obj) setSingle(sp, 'car_type', obj.car_type);
        if ('doors' in obj) setNumber(sp, 'doors', obj.doors);
        if ('search' in obj) {
          if (!obj.search) sp.delete('search');
          else sp.set('search', String(obj.search).trim());
        }

        // ranges
        if ('price_min' in obj) setNumber(sp, 'price_min', obj.price_min);
        if ('price_max' in obj) setNumber(sp, 'price_max', obj.price_max);
        if ('mileage_min' in obj) setNumber(sp, 'mileage_min', obj.mileage_min);
        if ('mileage_max' in obj) setNumber(sp, 'mileage_max', obj.mileage_max);
        if ('cylinders_min' in obj) setNumber(sp, 'cylinders_min', obj.cylinders_min);
        if ('cylinders_max' in obj) setNumber(sp, 'cylinders_max', obj.cylinders_max);
        if ('year_min' in obj) setNumber(sp, 'year_min', obj.year_min);
        if ('year_max' in obj) setNumber(sp, 'year_max', obj.year_max);

        // text
        if ('vin' in obj) {
          if (!obj.vin) sp.delete('vin');
          else sp.set('vin', String(obj.vin).trim());
        }

        // multis
        if ('features' in obj) setMulti(sp, 'features', obj.features);
        if ('safety_features' in obj) setMulti(sp, 'safety_features', obj.safety_features);

        // ordering
        if ('ordering' in obj) {
          const v = obj.ordering;
          if (!v || !ALLOWED_ORDERING.has(v)) sp.delete('ordering');
          else sp.set('ordering', v);
        }

        // pagination
        if ('page' in obj) setNumber(sp, 'page', obj.page);
        else sp.delete('page'); // reset to first page when filters change

        return sp;
      }),

    // reset everything
    clearAll: () => setSearchParams(new URLSearchParams()),
  }), [setSearchParams]);

  return { filters, set };
}
