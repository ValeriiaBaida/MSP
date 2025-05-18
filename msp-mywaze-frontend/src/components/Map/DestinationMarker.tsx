import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Marker as LeafletMarker } from 'leaflet';
import { customMarkerIcon } from './Icons';
import './DestinationMarker.css';

interface DestinationMarkerProps {
  coords: [number, number];
  name: string;
  eta: string | null;
  onBookmarkClick: () => void;
  markerRef: React.RefObject<LeafletMarker | null>;
}

const DestinationMarker: React.FC<DestinationMarkerProps> = ({ coords, name, eta, onBookmarkClick, markerRef }) => (
  <Marker
    position={coords}
    icon={customMarkerIcon}
    ref={(marker) => {
      if (marker) {
        markerRef.current = marker;
        marker.openPopup();
      }
    }}
  >
    <Popup>
    <div>
    <img
      src="/bookmark.png"
      alt="Bookmark"
      className="popup-bookmark-icon"
      onClick={onBookmarkClick}
    />
    <div>{name}</div>
        {eta && (
        <div style={{ color: '#3388ff', fontWeight: 'bold', marginTop: '4px' }}>
            ETA: {eta}
        </div>
        )}
    </div>
    </Popup>
  </Marker>
);

export default DestinationMarker;