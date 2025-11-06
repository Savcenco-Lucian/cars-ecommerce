// services/listings.js
import api from '../api';

export async function fetchListingsWithFilters({ params, featureIds, safetyIds }) {
  const sp = new URLSearchParams();

  // base params (includes `ordering` if provided)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) sp.append(k, String(v));
  });

  // repeat keys for multi-selects
  featureIds.forEach((id) => sp.append('features', String(id)));
  safetyIds.forEach((id) => sp.append('safety_features', String(id)));

  const url = `/car-listings/?${sp.toString()}`;
  const res = await api.get(url);
  return res.data;
}
