import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Calendar, Clock, Users } from "lucide-react";

interface Asignacion {
  id: string;
  camion_id: string;
  chofer_id: string;
  ruta_id: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  horario_inicio: string;
  horario_fin: string;
  dias_asignados: string[];
  estado: string;
  observaciones: string | null;
  created_at: string;
}

interface Camion {
  id: string;
  placa: string;
  modelo: string;
}

interface Chofer {
  id: string;
  nombre: string;
  apellido: string;
}

interface Ruta {
  id: string;
  colonia: string;
}

const AdminAsignaciones = () => {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [camiones, setCamiones] = useState<Camion[]>([]);
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsignacion, setEditingAsignacion] = useState<Asignacion | null>(null);
  const [formData, setFormData] = useState({
    camion_id: "",
    chofer_id: "",
    ruta_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    horario_inicio: "",
    horario_fin: "",
    dias_asignados: [] as string[],
    estado: "activa",
    observaciones: ""
  });
  const { toast } = useToast();

  const diasSemana = [
    { id: "lunes", label: "Lunes" },
    { id: "martes", label: "Martes" },
    { id: "miercoles", label: "Miércoles" },
    { id: "jueves", label: "Jueves" },
    { id: "viernes", label: "Viernes" },
    { id: "sabado", label: "Sábado" },
    { id: "domingo", label: "Domingo" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [asignacionesResult, camionesResult, choferesResult, rutasResult] = await Promise.all([
        supabase.from("asignaciones").select("*").order("created_at", { ascending: false }),
        supabase.from("camiones").select("id, placa, modelo").eq("estado", "activo"),
        supabase.from("choferes").select("id, nombre, apellido").eq("estado", "activo"),
        supabase.from("routes").select("id, colonia")
      ]);

      if (asignacionesResult.error) throw asignacionesResult.error;
      if (camionesResult.error) throw camionesResult.error;
      if (choferesResult.error) throw choferesResult.error;
      if (rutasResult.error) throw rutasResult.error;

      setAsignaciones(asignacionesResult.data || []);
      setCamiones(camionesResult.data || []);
      setChoferes(choferesResult.data || []);
      setRutas(rutasResult.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const asignacionData = {
        camion_id: formData.camion_id,
        chofer_id: formData.chofer_id,
        ruta_id: formData.ruta_id,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin || null,
        horario_inicio: formData.horario_inicio,
        horario_fin: formData.horario_fin,
        dias_asignados: formData.dias_asignados,
        estado: formData.estado,
        observaciones: formData.observaciones || null
      };

      if (editingAsignacion) {
        const { error } = await supabase
          .from("asignaciones")
          .update(asignacionData)
          .eq("id", editingAsignacion.id);

        if (error) throw error;
        toast({ title: "Éxito", description: "Asignación actualizada correctamente" });
      } else {
        const { error } = await supabase
          .from("asignaciones")
          .insert([asignacionData]);

        if (error) throw error;
        toast({ title: "Éxito", description: "Asignación creada correctamente" });
      }

      resetForm();
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta asignación?")) return;

    try {
      const { error } = await supabase
        .from("asignaciones")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Éxito", description: "Asignación eliminada correctamente" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la asignación",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      camion_id: "",
      chofer_id: "",
      ruta_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      horario_inicio: "",
      horario_fin: "",
      dias_asignados: [],
      estado: "activa",
      observaciones: ""
    });
    setEditingAsignacion(null);
  };

  const openEditDialog = (asignacion: Asignacion) => {
    setEditingAsignacion(asignacion);
    setFormData({
      camion_id: asignacion.camion_id,
      chofer_id: asignacion.chofer_id,
      ruta_id: asignacion.ruta_id,
      fecha_inicio: asignacion.fecha_inicio,
      fecha_fin: asignacion.fecha_fin || "",
      horario_inicio: asignacion.horario_inicio,
      horario_fin: asignacion.horario_fin,
      dias_asignados: asignacion.dias_asignados,
      estado: asignacion.estado,
      observaciones: asignacion.observaciones || ""
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleDiaChange = (dia: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dias_asignados: checked 
        ? [...prev.dias_asignados, dia]
        : prev.dias_asignados.filter(d => d !== dia)
    }));
  };

  const getCamionInfo = (id: string) => {
    const camion = camiones.find(c => c.id === id);
    return camion ? `${camion.placa} - ${camion.modelo}` : "Camión no encontrado";
  };

  const getChoferInfo = (id: string) => {
    const chofer = choferes.find(c => c.id === id);
    return chofer ? `${chofer.nombre} ${chofer.apellido}` : "Chofer no encontrado";
  };

  const getRutaInfo = (id: string) => {
    const ruta = rutas.find(r => r.id === id);
    return ruta ? ruta.colonia : "Ruta no encontrada";
  };

  if (loading) {
    return <div className="text-center py-4">Cargando asignaciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Asignaciones</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Asignación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAsignacion ? "Editar Asignación" : "Nueva Asignación"}
              </DialogTitle>
              <DialogDescription>
                {editingAsignacion 
                  ? "Modifica los datos de la asignación" 
                  : "Asigna un camión y chofer a una ruta específica"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="camion_id">Camión *</Label>
                  <Select value={formData.camion_id} onValueChange={(value) => setFormData({...formData, camion_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar camión" />
                    </SelectTrigger>
                    <SelectContent>
                      {camiones.map(camion => (
                        <SelectItem key={camion.id} value={camion.id}>
                          {camion.placa} - {camion.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="chofer_id">Chofer *</Label>
                  <Select value={formData.chofer_id} onValueChange={(value) => setFormData({...formData, chofer_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar chofer" />
                    </SelectTrigger>
                    <SelectContent>
                      {choferes.map(chofer => (
                        <SelectItem key={chofer.id} value={chofer.id}>
                          {chofer.nombre} {chofer.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="ruta_id">Ruta *</Label>
                <Select value={formData.ruta_id} onValueChange={(value) => setFormData({...formData, ruta_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    {rutas.map(ruta => (
                      <SelectItem key={ruta.id} value={ruta.id}>
                        {ruta.colonia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_inicio">Fecha Inicio *</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fecha_fin">Fecha Fin</Label>
                  <Input
                    id="fecha_fin"
                    type="date"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horario_inicio">Horario Inicio *</Label>
                  <Input
                    id="horario_inicio"
                    type="time"
                    value={formData.horario_inicio}
                    onChange={(e) => setFormData({...formData, horario_inicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="horario_fin">Horario Fin *</Label>
                  <Input
                    id="horario_fin"
                    type="time"
                    value={formData.horario_fin}
                    onChange={(e) => setFormData({...formData, horario_fin: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Días Asignados *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {diasSemana.map(dia => (
                    <div key={dia.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={dia.id}
                        checked={formData.dias_asignados.includes(dia.id)}
                        onCheckedChange={(checked) => handleDiaChange(dia.id, checked === true)}
                      />
                      <Label htmlFor={dia.id} className="text-sm">{dia.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="suspendida">Suspendida</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingAsignacion ? "Actualizar" : "Crear"}
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
        {asignaciones.map((asignacion) => (
          <Card key={asignacion.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Asignación - {getRutaInfo(asignacion.ruta_id)}
                  </CardTitle>
                  <CardDescription>
                    {getCamionInfo(asignacion.camion_id)} | {getChoferInfo(asignacion.chofer_id)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(asignacion)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(asignacion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <strong>Período:</strong> {new Date(asignacion.fecha_inicio).toLocaleDateString()}
                  {asignacion.fecha_fin && ` - ${new Date(asignacion.fecha_fin).toLocaleDateString()}`}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <strong>Horario:</strong> {asignacion.horario_inicio} - {asignacion.horario_fin}
                </p>
                <p><strong>Días:</strong> {asignacion.dias_asignados.map(dia => 
                  diasSemana.find(d => d.id === dia)?.label
                ).join(', ')}</p>
                <p><strong>Estado:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    asignacion.estado === 'activa' ? 'bg-green-100 text-green-800' :
                    asignacion.estado === 'suspendida' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {asignacion.estado.charAt(0).toUpperCase() + asignacion.estado.slice(1)}
                  </span>
                </p>
                {asignacion.observaciones && (
                  <p><strong>Observaciones:</strong> {asignacion.observaciones}</p>
                )}
                <p><strong>Creada:</strong> {new Date(asignacion.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {asignaciones.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No hay asignaciones registradas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAsignaciones;