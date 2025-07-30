import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Clock, MapPin } from "lucide-react";

interface Route {
  id: string;
  colonia: string;
  horario: string;
  dias: string[];
  tipo: "organico" | "inorganico" | "mixto";
  ruta: any;
  descripcion?: string;
  created_at: string;
}

const AdminRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [colonias, setColonias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    colonia: "",
    horario: "",
    dias: [] as string[],
    tipo: "organico" as "organico" | "inorganico" | "mixto",
    descripcion: "",
    ruta: { coordinates: [] }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRoute) {
        const { error } = await supabase
          .from('routes')
          .update(formData)
          .eq('id', editingRoute.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Ruta actualizada correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('routes')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Ruta creada correctamente.",
        });
      }

      setDialogOpen(false);
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
      ruta: { coordinates: [] }
    });
  };

  const openEditDialog = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      colonia: route.colonia,
      horario: route.horario,
      dias: route.dias,
      tipo: route.tipo,
      descripcion: route.descripcion || "",
      ruta: route.ruta
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingRoute(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleDiaChange = (dia: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, dias: [...formData.dias, dia] });
    } else {
      setFormData({ ...formData, dias: formData.dias.filter(d => d !== dia) });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando rutas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Rutas ({routes.length})</h3>
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

export default AdminRoutes;