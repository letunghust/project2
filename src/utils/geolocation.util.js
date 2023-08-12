export const getGeolocationPosition = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            // const {
            //     coords: { latitude: lat, longitude: long },
            // } = position;

            const pos = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            };
            resolve(pos);
        }, reject);
    });
};

export const watchGeolocationPosition = () => {
    return new Promise((resolve, reject) => {
        window.navigator.geolocation.watchPosition((position) => {
            const {
                coords: { latitude: lat, longitude: long },
            } = position;
            console.log(position);
            resolve({ lat, long });
        }, reject);
    });
};

export const geolocationToDistance = (p1, p2) => {
    const R = 6371e3; // metres
    const lat1 = (p1.lat * Math.PI) / 180; // φ, λ in radians
    const lat2 = (p2.lat * Math.PI) / 180;
    // const deltaLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    // const deltaLong = ((p2.long - p1.long) * Math.PI) / 180;
    const deltaLat = p2.lat - p1.lat;
    const deltaLong = p2.long - p1.long;

    // const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // const cosD = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLong);

    // const D = Math.acos(cosD);
    // console.log(D);
    // const c = 2 * Math.PI * R;

    const D = Math.sqrt(deltaLat * deltaLat + deltaLong * deltaLong);

    const d = (D * R) / 360; // in metres

    return d;
};
