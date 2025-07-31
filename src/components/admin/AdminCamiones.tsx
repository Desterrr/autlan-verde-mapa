import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Camion {
  id: string;
  placa: string;
  modelo: string;
  año: number | null;
  capacidad: string | null;
  estado: string;
  created_at: string;
}

const AdminCamiones = () => {
  const [camiones, setCamiones] = useState<Camion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCamion, setEditingCamion] = useState<Camion | null>(null);
  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    año: "",
    capacidad: "",
    estado: "activo"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCamiones();
  }, []);

  const fetchCamiones = async () => {
    try {
      const { data, error } = await supabase
        .from("camiones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCamiones(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los camiones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const camionData = {
        placa: formData.placa,
        modelo: formData.modelo,
        año: formData.año ? parseInt(formData.año) : null,
        capacidad: formData.capacidad || null,
        estado: formData.estado
      };

      if (editingCamion) {
        const { error } = await supabase
          .from("camiones")
          .update(camionData)
          .eq("id", editingCamion.id);

        if (error) throw error;
        toast({ title: "Éxito", description: "Camión actualizado correctamente" });
      } else {
        const { error } = await supabase
          .from("camiones")
          .insert([camionData]);

        if (error) throw error;
        toast({ title: "Éxito", description: "Camión creado correctamente" });
      }

      resetForm();
      setDialogOpen(false);
      fetchCamiones();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este camión?")) return;

    try {
      const { error } = await supabase
        .from("camiones")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Éxito", description: "Camión eliminado correctamente" });
      fetchCamiones();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el camión",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      placa: "",
      modelo: "",
      año: "",
      capacidad: "",
      estado: "activo"
    });
    setEditingCamion(null);
  };

  const openEditDialog = (camion: Camion) => {
    setEditingCamion(camion);
    setFormData({
      placa: camion.placa,
      modelo: camion.modelo,
      año: camion.año?.toString() || "",
      capacidad: camion.capacidad || "",
      estado: camion.estado
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-4">Cargando camiones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Camiones</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Camión
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCamion ? "Editar Camión" : "Nuevo Camión"}
              </DialogTitle>
              <DialogDescription>
                {editingCamion 
                  ? "Modifica los datos del camión" 
                  : "Agrega un nuevo camión al sistema"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="placa">Placa *</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => setFormData({...formData, placa: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo *</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="año">Año</Label>
                <Input
                  id="año"
                  type="number"
                  value={formData.año}
                  onChange={(e) => setFormData({...formData, año: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="capacidad">Capacidad</Label>
                <Input
                  id="capacidad"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                  placeholder="ej: 10 toneladas"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCamion ? "Actualizar" : "Crear"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {camiones.map((camion) => (
          <Card key={camion.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{camion.placa}</CardTitle>
                  <CardDescription>
                    {camion.modelo} {camion.año && `- ${camion.año}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(camion)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(camion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {camion.capacidad && (
                  <p><strong>Capacidad:</strong> {camion.capacidad}</p>
                )}
                <p><strong>Estado:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    camion.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    camion.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {camion.estado.charAt(0).toUpperCase() + camion.estado.slice(1)}
                  </span>
                </p>
                <p><strong>Registrado:</strong> {new Date(camion.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {camiones.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No hay camiones registrados</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCamiones;