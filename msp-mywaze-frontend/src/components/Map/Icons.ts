import { Icon } from 'leaflet';

export const customMarkerIcon = new Icon({
  iconUrl: '/map-marker.webp', // relative to public/
  iconSize: [32, 32], // adjust size if needed
  iconAnchor: [16, 32], // point of the icon which corresponds to marker's location (middle bottom)
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});