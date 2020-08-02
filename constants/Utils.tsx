function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function distanceBetween(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  var earthRadiusKm = 6371;

  var dLat = toRadians(lat2 - lat1);
  var dLon = toRadians(lon2 - lon1);

  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function destinationPointGivenDistanceAndBearingFromSource(
  sLat: number,
  sLng: number,
  distance: number,
  bearing: number,
) {
  var radius = 6371e3;
  const δ = distance / radius; // angular distance in radians
  const θ = toRadians(bearing);

  const φ1 = toRadians(sLat);
  const λ1 = toRadians(sLng);

  const sinφ2 =
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);
  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
  const x = Math.cos(δ) - Math.sin(φ1) * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  const dLat = toDegrees(φ2);
  const dLng = toDegrees(λ2);

  return { latitude: dLat, longitude: dLng };
}

// Extend Number object with methods to convert between degrees & radians
function toRadians(degree: number) {
  return (degree * Math.PI) / 180;
}
function toDegrees(radian: number) {
  return (radian * 180) / Math.PI;
}

function kmToMeter(km: number) {
  return Math.round(km * 1000);
}

export {
  degreesToRadians,
  distanceBetween as distanceInKmBetweenEarthCoordinates,
  destinationPointGivenDistanceAndBearingFromSource,
  kmToMeter,
};
