import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const RecursosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = articles.map(article => article.categoria);
    return [...new Set(cats)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = 
        article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.resumen.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === "all" || article.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Recursos <span className="text-primary">Ecológicos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Aprende sobre reciclaje, compostaje y cuidado ambiental para contribuir 
              a un Autlán más sustentable
            </p>
          </div>

          {/* Search Controls */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
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
        {/* Articles Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            Artículos Disponibles ({filteredArticles.length})
          </h2>
          
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No se encontraron artículos para los criterios seleccionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={article.imagen} 
                      alt={article.titulo}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                      {article.categoria}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {article.titulo}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                      {article.resumen}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                       <div className="flex items-center">
                         <Calendar className="h-4 w-4 mr-1" />
                         {formatDate(article.fecha_publicacion)}
                       </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.autor}
                      </div>
                    </div>
                    
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={`/recursos/articulo/${article.id}`}>
                        Leer Artículo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Consejos Rápidos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <CardTitle className="text-lg text-green-800">Reduce</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 text-center">
                  Disminuye el consumo de productos innecesarios y elige opciones duraderas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <CardTitle className="text-lg text-blue-800">Reutiliza</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 text-center">
                  Dale una segunda vida a los objetos antes de desecharlos.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <CardTitle className="text-lg text-purple-800">Recicla</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700 text-center">
                  Separa correctamente los materiales para su procesamiento.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <CardTitle className="text-lg text-orange-800">Responsabiliza</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700 text-center">
                  Comparte conocimientos y educa a otros sobre el cuidado ambiental.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Quieres Contribuir?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Únete a nuestra comunidad ecológica. Comparte tus conocimientos, 
                implementa prácticas sustentables y ayuda a construir un Autlán más verde.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="eco">
                  <Link to="/contacto">
                    Contactar Departamento de Ecología
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/rutas">
                    Ver Rutas de Recolección
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecursosPage;