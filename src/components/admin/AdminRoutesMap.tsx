import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Clock, MapPin, Map, Save, RotateCcw } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Route {
  id: string;
  colonia: string;
  horario: string;
  dias: string[];
  tipo: "organico" | "inorganico" | "mixto";
  ruta: any;
  puntos_especificos?: any;
  descripcion?: string;
  created_at: string;
}

const AdminRoutesMap = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [colonias, setColonias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [mapPoints, setMapPoints] = useState<L.LatLng[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    colonia: "",
    horario: "",
    dias: [] as string[],
    tipo: "organico" as "organico" | "inorganico" | "mixto",
    descripcion: "",
    ruta: { coordinates: [] },
    puntos_especificos: [] as any[]
  });

  const diasSemana = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  const tiposResiduos = [
    "organico", "inorganico", "mixto"
  ];

  useEffect(() => {
    fetchRoutes();
    fetchColonias();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las rutas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchColonias = async () => {
    try {
      const { data, error } = await supabase
        .from('colonias')
        .select('name')
        .order('name');

      if (error) throw error;
      setColonias(data?.map(c => c.name) || []);
    } catch (error) {
      console.error("Error fetching colonias:", error);
    }
  };

  const initializeMap = () => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [18.4861, -69.9312], // Dominican Republic center
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add click handler for adding points
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const newPoint = e.latlng;
        setMapPoints(prev => [...prev, newPoint]);
        
        // Add marker
        const marker = L.marker(newPoint)
          .addTo(mapRef.current!)
          .bindPopup(`Punto ${mapPoints.length + 1}`);
        
        markersRef.current.push(marker);
        
        // Update polyline
        updatePolyline([...mapPoints, newPoint]);
      });
    }
  };

  const updatePolyline = (points: L.LatLng[]) => {
    if (mapRef.current) {
      // Remove existing polyline
      if (polylineRef.current) {
        mapRef.current.removeLayer(polylineRef.current);
      }
      
      // Add new polyline if there are at least 2 points
      if (points.length >= 2) {
        polylineRef.current = L.polyline(points, {
          color: 'blue',
          weight: 4,
          opacity: 0.7
        }).addTo(mapRef.current);
      }
    }
  };

  const clearMapPoints = () => {
    // Clear markers
    markersRef.current.forEach(marker => {
      if (mapRef.current) {
        mapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
    
    // Clear polyline
    if (polylineRef.current && mapRef.current) {
      mapRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
    
    setMapPoints([]);
  };

  const loadExistingPoints = (route: Route) => {
    if (route.puntos_especificos && Array.isArray(route.puntos_especificos) && route.puntos_especificos.length > 0) {
      const points = route.puntos_especificos.map((point: any) => L.latLng(point.lat, point.lng));
      setMapPoints(points);
      
      // Add markers and polyline
      if (mapRef.current) {
        points.forEach((point, index) => {
          const marker = L.marker(point)
            .addTo(mapRef.current!)
            .bindPopup(`Punto ${index + 1}`);
          markersRef.current.push(marker);
        });
        
        updatePolyline(points);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const routeData = {
        ...formData,
        puntos_especificos: mapPoints.map(point => ({ lat: point.lat, lng: point.lng }))
      };

      if (editingRoute) {
        const { error } = await supabase
          .from('routes')
          .update(routeData)
          .eq('id', editingRoute.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Ruta actualizada correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('routes')
          .insert([routeData]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Ruta creada correctamente.",
        });
      }

      setDialogOpen(false);
      setMapDialogOpen(false);
      setEditingRoute(null);
      resetForm();
      fetchRoutes();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la ruta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta ruta?")) return;

    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Ruta eliminada correctamente.",
      });
      fetchRoutes();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la ruta.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      colonia: "",
      horario: "",
      dias: [],
      tipo: "organico" as "organico" | "inorganico" | "mixto",
      descripcion: "",
      ruta: { coordinates: [] },
      puntos_especificos: []
    });
    setMapPoints([]);
    clearMapPoints();
  };

  const openEditDialog = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      colonia: route.colonia,
      horario: route.horario,
      dias: route.dias,
      tipo: route.tipo,
      descripcion: route.descripcion || "",
      ruta: route.ruta,
      puntos_especificos: route.puntos_especificos || []
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingRoute(null);
    resetForm();
    setDialogOpen(true);
  };

  const openMapDialog = () => {
    setMapDialogOpen(true);
    setTimeout(() => {
      initializeMap();
      if (editingRoute) {
        loadExistingPoints(editingRoute);
      }
    }, 100);
  };

  const handleDiaChange = (dia: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, dias: [...formData.dias, dia] });
    } else {
      setFormData({ ...formData, dias: formData.dias.filter(d => d !== dia) });
    }
  };

  const saveMapPoints = () => {
    setFormData(prev => ({
      ...prev,
      puntos_especificos: mapPoints.map(point => ({ lat: point.lat, lng: point.lng }))
    }));
    setMapDialogOpen(false);
    toast({
      title: "Puntos guardados",
      description: `Se guardaron ${mapPoints.length} puntos en la ruta.`,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Cargando rutas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Rutas con Mapas ({routes.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Ruta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? "Editar Ruta" : "Nueva Ruta"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="colonia">Colonia</Label>
                  <Select
                    value={formData.colonia}
                    onValueChange={(value) => setFormData({ ...formData, colonia: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una colonia" />
                    </SelectTrigger>
                    <SelectContent>
                      {colonias.map((colonia) => (
                        <SelectItem key={colonia} value={colonia}>
                          {colonia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Residuos</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value as "organico" | "inorganico" | "mixto" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposResiduos.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario">Horario</Label>
                <Input
                  id="horario"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  placeholder="ej: 8:00 AM - 12:00 PM"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Días de Recolección</Label>
                <div className="grid grid-cols-3 gap-2">
                  {diasSemana.map((dia) => (
                    <div key={dia} className="flex items-center space-x-2">
                      <Checkbox
                        id={dia}
                        checked={formData.dias.includes(dia)}
                        onCheckedChange={(checked) => handleDiaChange(dia, checked as boolean)}
                      />
                      <Label htmlFor={dia} className="text-sm">
                        {dia}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Puntos Específicos de la Ruta</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openMapDialog}
                    className="flex-1"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {mapPoints.length > 0 ? `Editar Mapa (${mapPoints.length} puntos)` : "Abrir Mapa"}
                  </Button>
                  {mapPoints.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearMapPoints}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {mapPoints.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {mapPoints.length} puntos marcados en el mapa
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  placeholder="Información adicional sobre la ruta..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingRoute ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Map Dialog */}
      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Marcar Puntos de la Ruta</DialogTitle>
            <DialogDescription>
              Haz clic en el mapa para marcar los puntos específicos por donde pasará el camión.
              Los puntos se conectarán automáticamente para formar la ruta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Puntos marcados: {mapPoints.length}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearMapPoints}
                  disabled={mapPoints.length === 0}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
                <Button
                  type="button"
                  onClick={saveMapPoints}
                  disabled={mapPoints.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Puntos
                </Button>
              </div>
            </div>
            <div
              ref={mapContainerRef}
              style={{ height: '400px', width: '100%' }}
              className="border rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {routes.map((route) => (
          <Card key={route.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {route.colonia}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {route.horario}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{route.tipo}</span>
                    <span>•</span>
                    <span>{route.dias.join(", ")}</span>
                    {route.puntos_especificos && route.puntos_especificos.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Map className="h-3 w-3" />
                          {route.puntos_especificos.length} puntos
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(route)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(route.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {route.descripcion && (
              <CardContent>
                <p className="text-muted-foreground">{route.descripcion}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminRoutesMap;