import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { LogOut, FileText, MapPin, Route, Users, Truck, UserCheck, Calendar, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminArticles from "@/components/admin/AdminArticles";
import AdminRoutesMap from "@/components/admin/AdminRoutesMap";
import AdminColonias from "@/components/admin/AdminColonias";
import AdminCamiones from "@/components/admin/AdminCamiones";
import AdminChoferes from "@/components/admin/AdminChoferes";
import AdminAsignaciones from "@/components/admin/AdminAsignaciones";
import AdminUserRoles from "@/components/admin/AdminUserRoles";

const AdminPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasAdminRole, setHasAdminRole] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error) {
          console.error('Error checking admin role:', error);
          setHasAdminRole(false);
        } else {
          setHasAdminRole(data);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setHasAdminRole(false);
      } finally {
        setCheckingRole(false);
      }
    };

    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión.",
        variant: "destructive",
      });
    }
  };

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (hasAdminRole === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle className="text-destructive">Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos de administrador para acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/")} variant="outline">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Panel Administrativo</h1>
            <p className="text-muted-foreground">Gestión de contenido del sistema</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 max-w-5xl">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Artículos
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Rutas
            </TabsTrigger>
            <TabsTrigger value="colonias" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Colonias
            </TabsTrigger>
            <TabsTrigger value="camiones" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Camiones
            </TabsTrigger>
            <TabsTrigger value="choferes" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Choferes
            </TabsTrigger>
            <TabsTrigger value="asignaciones" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Asignaciones
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Gestión de Artículos
                </CardTitle>
                <CardDescription>
                  Administra los artículos educativos y de noticias del sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminArticles />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Gestión de Rutas
                </CardTitle>
                <CardDescription>
                  Administra las rutas de recolección de residuos por colonia.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRoutesMap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colonias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Gestión de Colonias
                </CardTitle>
                <CardDescription>
                  Administra las colonias y sus descripciones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminColonias />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="camiones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Gestión de Camiones
                </CardTitle>
                <CardDescription>
                  Administra los camiones de recolección de residuos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCamiones />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="choferes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Gestión de Choferes
                </CardTitle>
                <CardDescription>
                  Administra los choferes de los camiones de recolección.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminChoferes />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="asignaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Gestión de Asignaciones
                </CardTitle>
                <CardDescription>
                  Asigna camiones y choferes a rutas específicas con horarios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminAsignaciones />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Gestión de Roles de Usuario
                </CardTitle>
                <CardDescription>
                  Asigna y gestiona roles de administrador para el acceso al panel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminUserRoles />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;