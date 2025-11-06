import React, { useEffect, useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import '../styles/select.css'
import { Checkbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'

// slug helper to match URL slugs to option labels
const slug = (s) => (s ?? '').trim().toLowerCase().replace(/\s+/g, '-');

export default function CarFiltersModal({
  open,
  onClose,
  options,   // { makes, models, colors, transmissions, conditions, fuel_types, drive_types, car_types, features, safety_features }
  value,     // current URL filters (names/slugs/numbers) from useFiltersUrl().filters
  onApply,   // (draftObject) => void  <-- commit changes to URL when user clicks Apply
}) {
  // ---------- local "draft" state (hooks must come first) ----------
  const [draft, setDraft] = useState({
    make: '',
    model: '',
    color: '',
    transmission: '',
    condition: '',
    fuel_type: '',
    drive_type: '',
    car_type: '',
    doors: '',
    price_min: '',
    price_max: '',
    mileage_min: '',
    mileage_max: '',
    cylinders_min: '',
    cylinders_max: '',
    year_min: '',
    year_max: '',
    vin: '',
    features: [],          // array of label slugs
    safety_features: [],   // array of label slugs
    ordering: '',          // e.g. '-created_at'
  });

  // Safe destructuring even when options is undefined/null
  const {
    makes = [],
    models = [],
    colors = [],
    transmissions = [],
    conditions = [],
    fuel_types = [],
    drive_types = [],
    car_types = [],
    features = [],
    safety_features = [],
  } = options || {};

  // when modal opens, copy current URL filters into local draft
  useEffect(() => {
    if (!open || !value) return;
    setDraft({
      make: value.make || '',
      model: value.model || '',
      color: value.color || '',
      transmission: value.transmission || '',
      condition: value.condition || '',
      fuel_type: value.fuel_type || '',
      drive_type: value.drive_type || '',
      car_type: value.car_type || '',
      doors: value.doors || '',
      price_min: value.price_min || '',
      price_max: value.price_max || '',
      mileage_min: value.mileage_min || '',
      mileage_max: value.mileage_max || '',
      cylinders_min: value.cylinders_min || '',
      cylinders_max: value.cylinders_max || '',
      year_min: value.year_min || '',
      year_max: value.year_max || '',
      vin: value.vin || '',
      features: value.features || [],
      safety_features: value.safety_features || [],
      ordering: value.ordering || '',
    });
  }, [open, value]);

  // filter models by currently selected make in the DRAFT
  const filteredModels = useMemo(() => {
    if (!draft.make) return models;
    return models.filter((m) => slug(m?.make?.name) === draft.make);
  }, [models, draft.make]);

  const labelFromSlug = (list, currentSlug) => {
    if (!currentSlug) return '';
    const item = list.find((x) => slug(x.name ?? x.type) === currentSlug);
    return item ? (item.name ?? item.type) : '';
  };

  // field helpers
  const setStr = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  const setNumLike = (key) => (e) => {
    const numeric = e.target.value.replace(/\D/g, '');
    setDraft((d) => ({ ...d, [key]: numeric }));
  };
  const setSelectByLabel = (key) => (e) => {
    const label = e.target.value; // a human label, e.g., "Dodge"
    setDraft((d) => ({ ...d, [key]: label ? slug(label) : '' }));
    if (key === 'make') setDraft((d) => ({ ...d, model: '' })); // reset model when make changes
  };
  const toggleInArray = (key, label) => {
    const s = slug(label);
    setDraft((d) => {
      const present = d[key].includes(s);
      return {
        ...d,
        [key]: present ? d[key].filter((x) => x !== s) : [...d[key], s],
      };
    });
  };

  const clearLocal = () => {
    setDraft({
      make: '', model: '', color: '', transmission: '', fuel_type: '', drive_type: '', car_type: '', doors: '',
      price_min: '', price_max: '', mileage_min: '', mileage_max: '', cylinders_min: '', cylinders_max: '', year_min: '', year_max: '',
      vin: '', features: [], safety_features: [],
    });

    onApply?.({
      make: '', model: '', color: '', transmission: '', fuel_type: '', drive_type: '', car_type: '', doors: '',
      price_min: '', price_max: '', mileage_min: '', mileage_max: '', cylinders_min: '', cylinders_max: '', year_min: '', year_max: '',
      vin: '', features: [], safety_features: [],
    })
  };

  const onBackdropClick = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  // ---------- AFTER hooks: bail out early if closed or no options ----------
  if (!open) return null;
  if (!options) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60" style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }}
      onClick={onBackdropClick}
    >
      <div
        className="w-full max-w-[680px] max-h-[90vh] bg-white rounded-[8px] flex flex-col overflow-hidden text-[#222732]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-[20px] font-[800] tracking-wide text-[#222732] font-muli ">Filters</h2>
          <button
            onClick={onClose}
            className="text-2xl bg-gray-200 rounded-full p-[4px] hover:bg-black hover:text-white transition cursor-pointer"
            aria-label="Close filters"
          >
            <IoMdClose />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 pt-4 pb-3 flex flex-col gap-4">
          {/* Make / Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Make</label>
              <select
                value={labelFromSlug(makes, draft.make)}
                onChange={setSelectByLabel('make')}
                className="font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px]"
              >
                <option value="">Any</option>
                {makes.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Model</label>
              <select
                value={labelFromSlug(models, draft.model)}
                onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value ? slug(e.target.value) : '' }))}
                className={`font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px] ${!draft.make || filteredModels.length === 0 ? 'bg-gray-300' : ''}`}
                disabled={!draft.make || filteredModels.length === 0}
              >
                <option value="">Any</option>
                {filteredModels.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color / Transmission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Color</label>
              <select
                value={labelFromSlug(colors, draft.color)}
                onChange={setSelectByLabel('color')}
                className="font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px]"
              >
                <option value="">Any</option>
                {colors.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Transmission</label>
              <select
                value={labelFromSlug(transmissions, draft.transmission)}
                onChange={(e) => setDraft((d) => ({ ...d, transmission: e.target.value ? slug(e.target.value) : '' }))}
                className="font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px]"
              >
                <option value="">Any</option>
                {transmissions.map((t) => (
                  <option key={t.id} value={t.type}>{t.type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition / Fuel Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Car Type</label>
              <select
                value={labelFromSlug(car_types, draft.car_type)}
                onChange={(e) => setDraft((d) => ({ ...d, car_type: e.target.value ? slug(e.target.value) : '' }))}
                className="font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px]"
              >
                <option value="">Any</option>
                {car_types.map((t) => (
                  <option key={t.id} value={t.type}>{t.type}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Fuel Type</label>
              <select
                value={labelFromSlug(fuel_types, draft.fuel_type)}
                onChange={(e) => setDraft((d) => ({ ...d, fuel_type: e.target.value ? slug(e.target.value) : '' }))}
                className="font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px]"
              >
                <option value="">Any</option>
                {fuel_types.map((t) => (
                  <option key={t.id} value={t.type}>{t.type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drive Type / Car Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Drive Type</label>
              <select
                value={labelFromSlug(drive_types, draft.drive_type)}
                onChange={(e) => setDraft((d) => ({ ...d, drive_type: e.target.value ? slug(e.target.value) : '' }))}
                className="font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px]"
              >
                <option value="">Any</option>
                {drive_types.map((t) => (
                  <option key={t.id} value={t.type}>{t.type}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Doors</label>
              <input
                type="text" inputMode="numeric"
                value={draft.doors}
                onChange={setNumLike('doors')}
                className="font-muli text-[14px] px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                placeholder="e.g. 2 or 4"
              />
            </div>
          </div>

          {/* Price / Mileage */}
          <div className="grid filters:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Price min-max (€)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text" inputMode="numeric"
                  value={draft.price_min}
                  onChange={setNumLike('price_min')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="From"
                />
                <input
                  type="text" inputMode="numeric"
                  value={draft.price_max}
                  onChange={setNumLike('price_max')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="To"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Mileage min-max (mi)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text" inputMode="numeric"
                  value={draft.mileage_min}
                  onChange={setNumLike('mileage_min')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="From"
                />
                <input
                  type="text" inputMode="numeric"
                  value={draft.mileage_max}
                  onChange={setNumLike('mileage_max')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Cylinders / Year */}
          <div className="grid filters:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Cylinders (min–max)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text" inputMode="numeric"
                  value={draft.cylinders_min}
                  onChange={setNumLike('cylinders_min')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="Min"
                />
                <input
                  type="text" inputMode="numeric"
                  value={draft.cylinders_max}
                  onChange={setNumLike('cylinders_max')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Year (min–max)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text" inputMode="numeric"
                  value={draft.year_min}
                  onChange={setNumLike('year_min')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="Min"
                />
                <input
                  type="text" inputMode="numeric"
                  value={draft.year_max}
                  onChange={setNumLike('year_max')}
                  className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Doors / VIN */}
          <div className="grid grid-cols-2 gap-4">


            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">VIN</label>
              <input
                type="text"
                value={draft.vin}
                onChange={setStr('vin')}
                className="font-muli text-[14px]  px-[24px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300"
                placeholder="Search VIN"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-muli font-[700]">Sort by</label>
              <select
                value={draft.ordering}
                onChange={(e) => setDraft((d) => ({ ...d, ordering: e.target.value }))}
                className="font-muli px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[14px]"
              >
                <option value="">Default</option>
                <option value="-created_at">Data Listed: Newest</option>
                <option value="created_at">Data Listed: Oldest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="mileage">Mileage: Low to High</option>
                <option value="-mileage">Mileage: High to Low</option>
              </select>
            </div>
          </div>

          {/* Features (multi) */}
          <div className="flex flex-col gap-2 ">
            <label className="text-sm font-muli font-[700]">Features</label>
            <div className="grid filters:grid-cols-2 gap-2">
              {features.map((f) => {
                const s = slug(f.name);
                const checked = draft.features.includes(s);
                return (
                  <label key={f.id} className="flex font-muli items-center text-sm">
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleInArray('features', f.name)}
                      className="group  cursor-pointer size-6 rounded-md  bg-gray-300 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-[#d5ab63]  data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
                    >
                      <CheckIcon className="hidden size-4 fill-white group-data-checked:block" />
                    </Checkbox>
                    <span onClick={() => toggleInArray('features', f.name)} className=' cursor-pointer pl-2'>{f.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Safety Features (multi) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-muli font-[700]">Safety Features</label>
            <div className="grid filters:grid-cols-2 gap-2">
              {safety_features.map((f) => {
                const s = slug(f.name);
                const checked = draft.safety_features.includes(s);
                return (
                  <label key={f.id} className="flex font-muli items-center text-sm">
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleInArray('safety_features', f.name)}
                      className="group  cursor-pointer size-6 rounded-md  bg-gray-300 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-[#d5ab63]  data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
                    >
                      <CheckIcon className="hidden size-4 fill-white group-data-checked:block" />
                    </Checkbox>
                    <span onClick={() => toggleInArray('safety_features', f.name)} className=' cursor-pointer pl-2'>{f.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
          <button className="text-[#222732] hover:text-black cursor-pointer underline" onClick={clearLocal}>
            Clear Filters
          </button>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 cursor-pointer rounded-md border border-gray-300 text-[#222732] hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 cursor-pointer rounded-md bg-[#d5ab63] text-white hover:bg-[#735c36] transition"
              onClick={() => {
                onApply?.(draft); // commit to URL
                onClose?.();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
