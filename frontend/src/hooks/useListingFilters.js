// hooks/useListingFilters.js
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFilterLookups from './useFilterLookups';
import { getMultiFromSearchParams, slug, toNum } from '../utils/filterUtils';

// Accept only what DRF exposes via `ordering_fields`
const ALLOWED_ORDERING = new Set([
  'created_at', '-created_at',
  'price', '-price',
  'mileage', '-mileage',
]);

export default function useListingFilters() {
  const [searchParams] = useSearchParams();
  const { lookups, loading } = useFilterLookups();

  const apiArgs = useMemo(() => {
    if (!lookups) return null;

    // singles (names in URL)
    const makeName = searchParams.get('make');
    const modelName = searchParams.get('model');
    const colorName = searchParams.get('color');
    const transName = searchParams.get('transmission');
    const condName  = searchParams.get('condition');
    const fuelName  = searchParams.get('fuel_type');
    const driveName = searchParams.get('drive_type');
    const carTypeName = searchParams.get('car_type');
    const doors = toNum(searchParams.get('doors'));

    const searchText = searchParams.get('search') || undefined;

    const makeId = makeName ? lookups.makes.bySlug.get(slug(makeName)) : undefined;

    let modelId;
    if (modelName) {
      const ms = slug(modelName); // e.g. "M8 Competition" -> "m8-competition"
      if (makeId) modelId = lookups.models.modelsByMakeAndSlug.get(`${makeId}:${ms}`);
      if (!modelId) modelId = lookups.models.modelsBySlug.get(ms);
    }

    const colorId = colorName ? lookups.colors.bySlug.get(slug(colorName)) : undefined;
    const transmissionId = transName ? lookups.transmissions.bySlug.get(slug(transName)) : undefined;
    const conditionId = condName ? lookups.conditions.bySlug.get(slug(condName)) : undefined;
    const fuelId = fuelName ? lookups.fuel.bySlug.get(slug(fuelName)) : undefined;
    const driveId = driveName ? lookups.drive.bySlug.get(slug(driveName)) : undefined;
    const carTypeId = carTypeName ? lookups.carTypes.bySlug.get(slug(carTypeName)) : undefined;

    // multi (names in URL) -> ids
    const featureNames = getMultiFromSearchParams(searchParams, 'features');
    const safetyNames  = getMultiFromSearchParams(searchParams, 'safety_features');

    const featureIds = featureNames
      .map((n) => lookups.features.bySlug.get(slug(n)))
      .filter((x) => Number.isInteger(x));

    const safetyIds = safetyNames
      .map((n) => lookups.safety.bySlug.get(slug(n)))
      .filter((x) => Number.isInteger(x));

    // ranges + text
    const priceMin = toNum(searchParams.get('price_min'));
    const priceMax = toNum(searchParams.get('price_max'));
    const mileageMin = toNum(searchParams.get('mileage_min'));
    const mileageMax = toNum(searchParams.get('mileage_max'));
    const cylindersMin = toNum(searchParams.get('cylinders_min'));
    const cylindersMax = toNum(searchParams.get('cylinders_max'));
    const yearMin = toNum(searchParams.get('year_min'));
    const yearMax = toNum(searchParams.get('year_max'));
    const vin = searchParams.get('vin') || undefined;

    // DRF ordering (already supported by your ViewSet)
    const orderingRaw = searchParams.get('ordering');
    const ordering = ALLOWED_ORDERING.has(orderingRaw) ? orderingRaw : undefined;

    // assemble exactly what your API expects
    const params = {
      ...(makeId && { make: makeId }),
      ...(modelId && { model: modelId }),
      ...(colorId && { color: colorId }),
      ...(transmissionId && { transmission: transmissionId }),
      ...(conditionId && { condition: conditionId }),
      ...(fuelId && { fuel_type: fuelId }),
      ...(driveId && { drive_type: driveId }),
      ...(carTypeId && { car_type: carTypeId }),
      ...(doors !== undefined && { doors }),

      ...(priceMin !== undefined && { price_min: priceMin }),
      ...(priceMax !== undefined && { price_max: priceMax }),
      ...(mileageMin !== undefined && { mileage_min: mileageMin }),
      ...(mileageMax !== undefined && { mileage_max: mileageMax }),
      ...(cylindersMin !== undefined && { cylinders_min: cylindersMin }),
      ...(cylindersMax !== undefined && { cylinders_max: cylindersMax }),
      ...(yearMin !== undefined && { year_min: yearMin }),
      ...(yearMax !== undefined && { year_max: yearMax }),

      ...(vin && { vin }),

      ...(searchText && { search: searchText }),

      ...(ordering && { ordering }), // ✅ use DRF ordering
    };

    return { params, featureIds, safetyIds };
  }, [searchParams, lookups]);

  return { loading, apiArgs };
}
