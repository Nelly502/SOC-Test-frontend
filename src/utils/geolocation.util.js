export const getGeolocationPosition = () => {
    return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition((position) => {
            const {
                coords: { latitude: lat, longitude: long },
            } = position;
            resolve({ lat, long });
        }, reject);
    });
};
