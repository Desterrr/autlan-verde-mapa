import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Share2, BookOpen } from "lucide-react";
import { ecoArticles } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const ArticuloPage = () => {
  const { id } = useParams();
  const article = ecoArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Artículo no encontrado</h2>
            <p className="text-muted-foreground mb-4">
              El artículo que buscas no existe o ha sido movido.
            </p>
            <Button asChild>
              <Link to="/recursos">
                Volver a Recursos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.titulo,
          text: article.resumen,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace del artículo se ha copiado al portapapeles",
      });
    }
  };

  const relatedArticles = ecoArticles
    .filter(a => a.id !== article.id && a.categoria === article.categoria)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/recursos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Recursos
              </Link>
            </Button>
            
            <Badge className="mb-4">{article.categoria}</Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.titulo}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              {article.resumen}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(article.fechaPublicacion)}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {article.autor}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="ml-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-8">
                    {/* Article Image */}
                    <img 
                      src={article.imagen} 
                      alt={article.titulo}
                      className="w-full h-64 object-cover rounded-lg mb-8"
                    />
                    
                    {/* Article Content */}
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: article.contenido
                          .split('\n')
                          .map(line => {
                            if (line.startsWith('# ')) {
                              return `<h1 class="text-3xl font-bold text-foreground mt-8 mb-4">${line.substring(2)}</h1>`;
                            } else if (line.startsWith('## ')) {
                              return `<h2 class="text-2xl font-semibold text-foreground mt-6 mb-3">${line.substring(3)}</h2>`;
                            } else if (line.startsWith('### ')) {
                              return `<h3 class="text-xl font-semibold text-foreground mt-4 mb-2">${line.substring(4)}</h3>`;
                            } else if (line.startsWith('- ')) {
                              return `<li class="text-muted-foreground mb-1">${line.substring(2)}</li>`;
                            } else if (line.startsWith('**') && line.endsWith('**')) {
                              return `<h4 class="font-semibold text-foreground mt-4 mb-2">${line.slice(2, -2)}</h4>`;
                            } else if (line.trim() === '') {
                              return '<br>';
                            } else {
                              return `<p class="text-muted-foreground mb-4 leading-relaxed">${line}</p>`;
                            }
                          })
                          .join('')
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Artículos Relacionados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {relatedArticles.map((relatedArticle) => (
                        <Link 
                          key={relatedArticle.id}
                          to={`/recursos/articulo/${relatedArticle.id}`}
                          className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {relatedArticle.titulo}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(relatedArticle.fechaPublicacion)}
                          </p>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link to="/rutas">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Ver Rutas de Recolección
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link to="/contacto">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Contactar Ayuntamiento
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartir Artículo
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">¿Tienes Dudas?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contacta al Departamento de Ecología para más información sobre 
                      programas ambientales en Autlán.
                    </p>
                    <Button asChild variant="eco" size="sm" className="w-full">
                      <Link to="/contacto">
                        Contactar Ahora
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticuloPage;