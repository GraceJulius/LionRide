//autocomplete logic for pickup

"use client";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function LocationInput({ label, value, setValue, onPlaceSelect }) {
  const {
    ready,
    value: internalValue,
    setValue: setInternalValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    setValue(e.target.value);
  };

  const handleSelect = async (description) => {
    setInternalValue(description, false);
    setValue(description);
    clearSuggestions();

    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);

    onPlaceSelect({ lat, lng });
  };

  return (
    <div className="bg-gray-100 rounded-md px-3 py-2">
      <input
        placeholder={label}
        disabled={!ready}
        value={internalValue}
        onChange={handleChange}
        className="bg-transparent w-full px-2 py-2 outline-none text-sm placeholder:text-gray-500"
      />
      {status === "OK" && (
        <ul className="mt-1 bg-white border rounded shadow text-sm z-10 relative">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
