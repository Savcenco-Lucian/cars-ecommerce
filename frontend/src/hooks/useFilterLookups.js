// hooks/useFilterLookups.js
import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { slug } from '../utils/filterUtils';

const mapBySlug = (arr) => {
  const bySlug = new Map();
  const byId = new Map();
  arr.forEach((x) => {
    const label = x.name ?? x.type ?? '';
    bySlug.set(slug(label), x.id);
    byId.set(x.id, label);
  });
  return { bySlug, byId };
};

export default function useFilterLookups() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/filters/');
        setData(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const lookups = useMemo(() => {
    if (!data) return null;

    const makes = mapBySlug(data.makes);
    const colors = mapBySlug(data.colors);
    const transmissions = mapBySlug(data.transmissions);
    const conditions = mapBySlug(data.conditions);
    const fuel = mapBySlug(data.fuel_types);
    const drive = mapBySlug(data.drive_types);
    const carTypes = mapBySlug(data.car_types);
    const features = mapBySlug(data.features);
    const safety = mapBySlug(data.safety_features);

    // models: allow resolving by (make + model)
    const modelsBySlug = new Map();
    const modelsByMakeAndSlug = new Map(); // key `${makeId}:${modelSlug}`
    data.models.forEach((m) => {
      const ms = slug(m.name);
      modelsBySlug.set(ms, m.id);
      modelsByMakeAndSlug.set(`${m.make.id}:${ms}`, m.id);
    });

    return {
      makes,
      colors,
      transmissions,
      conditions,
      fuel,
      drive,
      carTypes,
      features,
      safety,
      models: { modelsBySlug, modelsByMakeAndSlug },
    };
  }, [data]);

  return { lookups, loading };
}
