// This is the final, simplified server-side function.
// It uses the built-in fetch provided by Netlify's environment and does not need node-fetch.

exports.handler = async function(event) {
    const zip = event.queryStringParameters.zip;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!zip) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'ZIP code is required' }),
        };
    }

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'API key is not configured on the server.' }),
        };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(data.error_message || `Geocoding API error: ${data.status}`);
        }

        const location = data.results[0].geometry.location;

        return {
            statusCode: 200,
            body: JSON.stringify(location),
        };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
