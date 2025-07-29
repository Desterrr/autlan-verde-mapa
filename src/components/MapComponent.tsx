import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteData {
  id: string;
  colonia: string;
  horario: string;
  dias: string[];
  ruta: [number, number][];
  tipo: 'organico' | 'inorganico' | 'mixto';
}

interface MapComponentProps {
  routes: RouteData[];
  selectedRoute?: string;
}

const MapComponent = ({ routes, selectedRoute }: MapComponentProps) => {
  // Coordenadas del centro de Autlán de Navarro
  const center: [number, number] = [19.7709, -104.3661];

  const getRouteColor = (tipo: string) => {
    switch (tipo) {
      case 'organico': return '#22c55e';
      case 'inorganico': return '#3b82f6';
      case 'mixto': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  const createCustomIcon = (tipo: string) => {
    const color = getRouteColor(tipo);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const renderRoutes = () => {
    const elements = [];
    
    routes.forEach((route) => {
      // Add polyline
      elements.push(
        <Polyline
          key={`polyline-${route.id}`}
          positions={route.ruta}
          color={getRouteColor(route.tipo)}
          weight={selectedRoute === route.id ? 6 : 4}
          opacity={selectedRoute && selectedRoute !== route.id ? 0.3 : 0.8}
        />
      );
      
      // Add marker if route has positions
      if (route.ruta.length > 0) {
        elements.push(
          <Marker
            key={`marker-${route.id}`}
            position={route.ruta[0]}
            icon={createCustomIcon(route.tipo)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{route.colonia}</h3>
                <p className="text-xs text-gray-600">{route.horario}</p>
                <p className="text-xs text-gray-600">
                  {route.dias.join(', ')}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  Tipo: {route.tipo}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {renderRoutes()}
      </MapContainer>
    </div>
  );
};

export default MapComponent;