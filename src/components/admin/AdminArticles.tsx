import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

interface Article {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  contenido: string;
  resumen: string;
  imagen?: string;
  published: boolean;
  fecha_publicacion?: string;
  created_at: string;
}

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    categoria: "",
    contenido: "",
    resumen: "",
    imagen: "",
    published: true,
    fecha_publicacion: new Date().toISOString().split('T')[0]
  });

  const categorias = [
    "Educación Ambiental",
    "Noticias",
    "Consejos de Reciclaje",
    "Eventos",
    "Políticas Ambientales"
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los artículos.",
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
      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(formData)
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Artículo actualizado correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Artículo creado correctamente.",
        });
      }

      setDialogOpen(false);
      setEditingArticle(null);
      resetForm();
      fetchArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el artículo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Artículo eliminado correctamente.",
      });
      fetchArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el artículo.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      autor: "",
      categoria: "",
      contenido: "",
      resumen: "",
      imagen: "",
      published: true,
      fecha_publicacion: new Date().toISOString().split('T')[0]
    });
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      titulo: article.titulo,
      autor: article.autor,
      categoria: article.categoria,
      contenido: article.contenido,
      resumen: article.resumen,
      imagen: article.imagen || "",
      published: article.published,
      fecha_publicacion: article.fecha_publicacion || new Date().toISOString().split('T')[0]
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingArticle(null);
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando artículos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Artículos ({articles.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Editar Artículo" : "Nuevo Artículo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="autor">Autor</Label>
                  <Input
                    id="autor"
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_publicacion">Fecha de Publicación</Label>
                  <Input
                    id="fecha_publicacion"
                    type="date"
                    value={formData.fecha_publicacion}
                    onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen">URL de Imagen</Label>
                <Input
                  id="imagen"
                  type="url"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumen">Resumen</Label>
                <Textarea
                  id="resumen"
                  value={formData.resumen}
                  onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea
                  id="contenido"
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Publicado</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingArticle ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{article.titulo}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>Por: {article.autor}</span>
                    <span>•</span>
                    <span>{article.categoria}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.fecha_publicacion || article.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      article.published 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {article.published ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(article)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{article.resumen}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminArticles;