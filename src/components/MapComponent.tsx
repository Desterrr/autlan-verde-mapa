import React, { useEffect, useRef } from 'react';
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
  ruta: [number, number][] | string; // Can be array or JSON string
  tipo: 'organico' | 'inorganico' | 'mixto';
}

interface MapComponentProps {
  routes: RouteData[];
  selectedRoute?: string;
}

const MapComponent = ({ routes, selectedRoute }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);

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

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([19.7709, -104.3661], 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing layers
    layersRef.current.forEach(layer => {
      mapInstanceRef.current?.removeLayer(layer);
    });
    layersRef.current = [];

    // Add new route layers
    routes.forEach((route) => {
      // Parse ruta data safely
      let rutaCoordinates: [number, number][] = [];
      
      try {
        if (typeof route.ruta === 'string') {
          rutaCoordinates = JSON.parse(route.ruta);
        } else if (Array.isArray(route.ruta)) {
          rutaCoordinates = route.ruta;
        }
      } catch (error) {
        console.error('Error parsing ruta coordinates:', error);
        return;
      }

      if (!rutaCoordinates || rutaCoordinates.length === 0) return;

      // Validate coordinates
      const validCoordinates = rutaCoordinates.filter(coord => 
        Array.isArray(coord) && 
        coord.length === 2 && 
        typeof coord[0] === 'number' && 
        typeof coord[1] === 'number' &&
        !isNaN(coord[0]) && !isNaN(coord[1])
      );

      if (validCoordinates.length === 0) return;

      // Add polyline
      const polyline = L.polyline(validCoordinates, {
        color: getRouteColor(route.tipo),
        weight: selectedRoute === route.id ? 6 : 4,
        opacity: selectedRoute && selectedRoute !== route.id ? 0.3 : 0.8
      });
      
      polyline.addTo(mapInstanceRef.current!);
      layersRef.current.push(polyline);

      // Add marker at first coordinate
      const marker = L.marker(validCoordinates[0], {
        icon: createCustomIcon(route.tipo)
      });

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${route.colonia}</h3>
          <p class="text-xs text-gray-600">${route.horario}</p>
          <p class="text-xs text-gray-600">${route.dias.join(', ')}</p>
          <p class="text-xs text-gray-600 capitalize">Tipo: ${route.tipo}</p>
        </div>
      `);

      marker.addTo(mapInstanceRef.current!);
      layersRef.current.push(marker);
    });
  }, [routes, selectedRoute]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;