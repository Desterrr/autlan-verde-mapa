import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";

interface Colonia {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

const AdminColonias = () => {
  const [colonias, setColonias] = useState<Colonia[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingColonia, setEditingColonia] = useState<Colonia | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchColonias();
  }, []);

  const fetchColonias = async () => {
    try {
      const { data, error } = await supabase
        .from('colonias')
        .select('*')
        .order('name');

      if (error) throw error;
      setColonias(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las colonias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingColonia) {
        const { error } = await supabase
          .from('colonias')
          .update(formData)
          .eq('id', editingColonia.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Colonia actualizada correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('colonias')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Colonia creada correctamente.",
        });
      }

      setDialogOpen(false);
      setEditingColonia(null);
      resetForm();
      fetchColonias();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la colonia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta colonia?")) return;

    try {
      const { error } = await supabase
        .from('colonias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Colonia eliminada correctamente.",
      });
      fetchColonias();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la colonia.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  const openEditDialog = (colonia: Colonia) => {
    setEditingColonia(colonia);
    setFormData({
      name: colonia.name,
      description: colonia.description || "",
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingColonia(null);
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando colonias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Colonias ({colonias.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Colonia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingColonia ? "Editar Colonia" : "Nueva Colonia"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Colonia</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Centro Histórico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Información adicional sobre la colonia..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingColonia ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {colonias.map((colonia) => (
          <Card key={colonia.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {colonia.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Creada: {new Date(colonia.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(colonia)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(colonia.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {colonia.description && (
              <CardContent>
                <p className="text-muted-foreground">{colonia.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminColonias;