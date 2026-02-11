import { useEffect, useState } from 'react';
import { useCity } from '../context/CityContext';
import { ChevronDown } from 'lucide-react';

const CitySelector = () => {
    const { selectedCity, setSelectedCity } = useCity();
    const [cities, setCities] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/cities');
                const data = await res.json();
                setCities(data);
                if (!selectedCity && data.length > 0) {
                    setSelectedCity('Hyderabad'); // Default to Hyderabad
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, [selectedCity, setSelectedCity]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            >
                <span className="text-sm font-medium">{selectedCity || 'Select City'}</span>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 py-1 max-h-64 overflow-y-auto">
                    {cities.map(city => (
                        <button
                            key={city._id}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${selectedCity === city.name ? 'text-red-500 font-bold' : 'text-gray-300'}`}
                            onClick={() => {
                                setSelectedCity(city.name);
                                setIsOpen(false);
                            }}
                        >
                            {city.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CitySelector;
