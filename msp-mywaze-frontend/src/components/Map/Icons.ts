import { Icon } from 'leaflet';

export const customMarkerIcon = new Icon({
  iconUrl: '/map-marker.webp', // relative to public/
  iconSize: [32, 32], // adjust size if needed
  iconAnchor: [16, 32], // point of the icon which corresponds to marker's location (middle bottom)
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

export const hazardMarkerIcon = new Icon({
  iconUrl: '/hazards/generic.png', // relative to public/
  iconSize: [32, 32], // adjust size if needed
  iconAnchor: [16, 16], // point of the icon which corresponds to marker's location (middle bottom)
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

export const constructionMarkerIcon = new Icon({
  iconUrl: '/hazards/construction.png', // relative to public/
  iconSize: [32, 32], // adjust size if needed
  iconAnchor: [16, 16], // point of the icon which corresponds to marker's location (middle bottom)
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

export const accidentMarkerIcon = new Icon({
  iconUrl: '/hazards/accident.png', // relative to public/
  iconSize: [32, 32], // adjust size if needed
  iconAnchor: [16, 16], // point of the icon which corresponds to marker's location (middle bottom)
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

export const policeMarkerIcon = new Icon({
  iconUrl: '/hazards/police.png', // relative to public/
  iconSize: [32, 32], // adjust size if needed
  iconAnchor: [16, 16], // point of the icon which corresponds to marker's location (middle bottom)
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});