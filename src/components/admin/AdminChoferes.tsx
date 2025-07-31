import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, User } from "lucide-react";

interface Chofer {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string | null;
  licencia: string;
  fecha_vencimiento_licencia: string | null;
  estado: string;
  created_at: string;
}

const AdminChoferes = () => {
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChofer, setEditingChofer] = useState<Chofer | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    licencia: "",
    fecha_vencimiento_licencia: "",
    estado: "activo"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchChoferes();
  }, []);

  const fetchChoferes = async () => {
    try {
      const { data, error } = await supabase
        .from("choferes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChoferes(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los choferes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const choferData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        telefono: formData.telefono || null,
        licencia: formData.licencia,
        fecha_vencimiento_licencia: formData.fecha_vencimiento_licencia || null,
        estado: formData.estado
      };

      if (editingChofer) {
        const { error } = await supabase
          .from("choferes")
          .update(choferData)
          .eq("id", editingChofer.id);

        if (error) throw error;
        toast({ title: "Éxito", description: "Chofer actualizado correctamente" });
      } else {
        const { error } = await supabase
          .from("choferes")
          .insert([choferData]);

        if (error) throw error;
        toast({ title: "Éxito", description: "Chofer creado correctamente" });
      }

      resetForm();
      setDialogOpen(false);
      fetchChoferes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este chofer?")) return;

    try {
      const { error } = await supabase
        .from("choferes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Éxito", description: "Chofer eliminado correctamente" });
      fetchChoferes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el chofer",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      cedula: "",
      telefono: "",
      licencia: "",
      fecha_vencimiento_licencia: "",
      estado: "activo"
    });
    setEditingChofer(null);
  };

  const openEditDialog = (chofer: Chofer) => {
    setEditingChofer(chofer);
    setFormData({
      nombre: chofer.nombre,
      apellido: chofer.apellido,
      cedula: chofer.cedula,
      telefono: chofer.telefono || "",
      licencia: chofer.licencia,
      fecha_vencimiento_licencia: chofer.fecha_vencimiento_licencia || "",
      estado: chofer.estado
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const isLicenseExpired = (fecha: string | null) => {
    if (!fecha) return false;
    return new Date(fecha) < new Date();
  };

  const isLicenseExpiringSoon = (fecha: string | null) => {
    if (!fecha) return false;
    const expiryDate = new Date(fecha);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysToExpiry <= 30 && daysToExpiry > 0;
  };

  if (loading) {
    return <div className="text-center py-4">Cargando choferes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Choferes</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Chofer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingChofer ? "Editar Chofer" : "Nuevo Chofer"}
              </DialogTitle>
              <DialogDescription>
                {editingChofer 
                  ? "Modifica los datos del chofer" 
                  : "Agrega un nuevo chofer al sistema"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="licencia">Licencia *</Label>
                <Input
                  id="licencia"
                  value={formData.licencia}
                  onChange={(e) => setFormData({...formData, licencia: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha_vencimiento_licencia">Fecha Vencimiento Licencia</Label>
                <Input
                  id="fecha_vencimiento_licencia"
                  type="date"
                  value={formData.fecha_vencimiento_licencia}
                  onChange={(e) => setFormData({...formData, fecha_vencimiento_licencia: e.target.value})}
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
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingChofer ? "Actualizar" : "Crear"}
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
        {choferes.map((chofer) => (
          <Card key={chofer.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">
                      {chofer.nombre} {chofer.apellido}
                    </CardTitle>
                    <CardDescription>
                      Cédula: {chofer.cedula}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(chofer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(chofer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {chofer.telefono && (
                  <p><strong>Teléfono:</strong> {chofer.telefono}</p>
                )}
                <p><strong>Licencia:</strong> {chofer.licencia}</p>
                {chofer.fecha_vencimiento_licencia && (
                  <p><strong>Vencimiento Licencia:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      isLicenseExpired(chofer.fecha_vencimiento_licencia) ? 'bg-red-100 text-red-800' :
                      isLicenseExpiringSoon(chofer.fecha_vencimiento_licencia) ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {new Date(chofer.fecha_vencimiento_licencia).toLocaleDateString()}
                      {isLicenseExpired(chofer.fecha_vencimiento_licencia) && ' (Vencida)'}
                      {isLicenseExpiringSoon(chofer.fecha_vencimiento_licencia) && ' (Por vencer)'}
                    </span>
                  </p>
                )}
                <p><strong>Estado:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    chofer.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    chofer.estado === 'suspendido' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {chofer.estado.charAt(0).toUpperCase() + chofer.estado.slice(1)}
                  </span>
                </p>
                <p><strong>Registrado:</strong> {new Date(chofer.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {choferes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No hay choferes registrados</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminChoferes;