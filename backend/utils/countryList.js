import axios from 'axios';

let validCountries = [];

export const fetchCountries = async () => {
    try {
        const res = await axios.get('https://countriesnow.space/api/v0.1/countries');
        validCountries = res.data.data.map(c => c.country);
        console.log('Countries loaded:', validCountries.length);
    } catch (err) {
        console.error('Failed to fetch countries:', err.message);
    }
};

export const getValidCountries = () => validCountries;
