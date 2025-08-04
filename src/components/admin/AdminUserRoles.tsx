import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Plus, Trash2 } from "lucide-react";

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  profiles?: {
    email: string;
    display_name: string;
  };
}

interface FormData {
  email: string;
  role: 'admin' | 'moderator' | 'user';
}

const AdminUserRoles = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    role: 'user'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately to avoid relation issues
      const userRolesWithProfiles = [];
      if (data) {
        for (const role of data) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, display_name')
            .eq('id', role.user_id)
            .single();
          
          userRolesWithProfiles.push({
            ...role,
            profiles: profile || { email: 'Unknown', display_name: 'Unknown' }
          });
        }
      }

      setUserRoles(userRolesWithProfiles);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los roles de usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Find user by email from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();
      
      if (profileError || !profileData) {
        toast({
          title: "Error",
          description: "No se encontró un usuario con ese email.",
          variant: "destructive",
        });
        return;
      }

      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('role', formData.role)
        .single();

      if (existingRole) {
        toast({
          title: "Error",
          description: "El usuario ya tiene este rol asignado.",
          variant: "destructive",
        });
        return;
      }

      // Insert the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: profileData.id,
          role: formData.role
        });

      if (insertError) throw insertError;

      toast({
        title: "Éxito",
        description: "Rol asignado correctamente al usuario.",
      });

      setDialogOpen(false);
      resetForm();
      fetchUserRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el rol al usuario.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este rol?')) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Rol eliminado correctamente.",
      });
      
      fetchUserRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el rol.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      role: 'user'
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando roles de usuario...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Gestión de Roles de Usuario</h2>
          <p className="text-muted-foreground">Asigna y gestiona roles de administrador y moderador</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Asignar Rol
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar Rol a Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email del Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'admin' | 'moderator' | 'user') => 
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="moderator">Moderador</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Asignar Rol
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {userRoles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay roles asignados</p>
            </CardContent>
          </Card>
        ) : (
          userRoles.map((userRole) => (
            <Card key={userRole.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {userRole.profiles?.display_name || userRole.profiles?.email}
                    </CardTitle>
                    <CardDescription>
                      {userRole.profiles?.email}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userRole.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : userRole.role === 'moderator'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userRole.role === 'admin' ? 'Administrador' : 
                       userRole.role === 'moderator' ? 'Moderador' : 'Usuario'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRole(userRole.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUserRoles;