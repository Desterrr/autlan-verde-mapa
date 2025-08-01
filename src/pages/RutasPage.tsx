import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Calendar, Recycle } from "lucide-react";
import MapComponent from "@/components/MapComponent";
import { supabase } from "@/integrations/supabase/client";

const RutasPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColonia, setSelectedColonia] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [colonias, setColonias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching routes:', error);
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
      setColonias(data?.map(col => col.name) || []);
    } catch (error) {
      console.error('Error fetching colonias:', error);
    }
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const matchesSearch = route.colonia.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesColonia = !selectedColonia || selectedColonia === "all" || route.colonia === selectedColonia;
      return matchesSearch && matchesColonia;
    });
  }, [routes, searchTerm, selectedColonia]);

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'organico': return 'bg-green-100 text-green-800 border-green-200';
      case 'inorganico': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mixto': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (tipo: string) => {
    return <Recycle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando rutas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Consulta de <span className="text-primary">Rutas de Recolección</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Encuentra los horarios y rutas de recolección de residuos de tu colonia en Autlán de Navarro
            </p>
          </div>

          {/* Search Controls */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por colonia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedColonia} onValueChange={setSelectedColonia}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las colonias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las colonias</SelectItem>
                  {colonias.map((colonia) => (
                    <SelectItem key={colonia} value={colonia}>
                      {colonia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedColonia("all");
                  setSelectedRoute("");
                }}
                variant="outline"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Routes List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Rutas Disponibles ({filteredRoutes.length})
            </h2>
            
            {filteredRoutes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No se encontraron rutas para los criterios seleccionados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredRoutes.map((route) => (
                <Card 
                  key={route.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRoute === route.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedRoute(selectedRoute === route.id ? "" : route.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{route.colonia}</CardTitle>
                      <Badge className={getTypeColor(route.tipo)}>
                        {getTypeIcon(route.tipo)}
                        <span className="ml-1 capitalize">{route.tipo}</span>
                      </Badge>
                    </div>
                    <CardDescription>{route.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{route.horario}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{route.dias.join(", ")}</span>
                      </div>
                    </div>
                    
                    {selectedRoute === route.id && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Información Adicional:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Coloca tus residuos 30 minutos antes del horario</li>
                          <li>• Usa bolsas apropiadas según el tipo de residuo</li>
                          <li>• Mantén los residuos en lugar seguro hasta la recolección</li>
                          {route.tipo === 'organico' && (
                            <li>• Los residuos orgánicos se procesan para compostaje</li>
                          )}
                          {route.tipo === 'inorganico' && (
                            <li>• Limpia los envases antes de colocarlos</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Map */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Mapa de Rutas</h2>
            <Card>
              <CardContent className="p-0">
                <MapComponent 
                  routes={filteredRoutes} 
                  selectedRoute={selectedRoute}
                />
              </CardContent>
            </Card>
            
            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leyenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Residuos Orgánicos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Residuos Inorgánicos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm">Residuos Mixtos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Información Importante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Horarios de Recolección</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Los horarios pueden variar por condiciones climáticas</li>
                    <li>• En días festivos el servicio puede suspenderse</li>
                    <li>• Coloca tus residuos máximo 30 minutos antes</li>
                    <li>• No saques la basura después de que pasó el camión</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Contacto</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Teléfono: +52 317 101 1253</li>
                    <li>• Email: Ernfran1901@gmail.com</li>
                    <li>• Reporta camiones que no pasaron</li>
                    <li>• Solicita servicios especiales</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RutasPage;