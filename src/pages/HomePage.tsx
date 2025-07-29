import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Leaf, BookOpen, Clock, Recycle, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-eco.jpg";
import mapIcon from "@/assets/map-icon.jpg";
import recycleIcon from "@/assets/recycle-icon.jpg";

const HomePage = () => {
  const features = [
    {
      icon: MapPin,
      title: "Consulta de Rutas",
      description: "Encuentra los horarios y rutas de recolección de tu colonia",
      href: "/rutas",
      image: mapIcon
    },
    {
      icon: BookOpen,
      title: "Recursos Ecológicos",
      description: "Aprende sobre reciclaje, compostaje y cuidado ambiental",
      href: "/recursos",
      image: recycleIcon
    },
    {
      icon: Leaf,
      title: "Cultura Ecológica",
      description: "Únete al movimiento verde de Autlán de Navarro",
      href: "/recursos",
      image: recycleIcon
    }
  ];

  const stats = [
    { number: "10+", label: "Colonias Atendidas", icon: MapPin },
    { number: "50+", label: "Toneladas Recicladas", icon: Recycle },
    { number: "1000+", label: "Familias Participando", icon: Users },
    { number: "24/7", label: "Información Disponible", icon: Clock }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            Gobierno Municipal 2024-2027
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ayuntamiento Constitucional de
            <span className="text-accent block">Autlán de Navarro</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Consulta rutas de recolección de residuos y únete a la cultura ecológica de nuestra comunidad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="eco" size="lg">
              <Link to="/rutas">
                <MapPin className="mr-2 h-5 w-5" />
                Consultar Rutas
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20">
              <Link to="/recursos">
                <BookOpen className="mr-2 h-5 w-5" />
                Recursos Ecológicos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Servicios para <span className="text-primary">Nuestra Comunidad</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Facilitamos el acceso a información sobre recolección de residuos y promovemos 
              la educación ambiental para un Autlán más sustentable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30">
                  <CardHeader className="text-center">
                    <div className="relative mb-4">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-20 h-20 mx-auto rounded-full object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                        <Icon className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button asChild variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={feature.href}>
                        Explorar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Leaf className="h-16 w-16 text-primary mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Nuestro Compromiso Ambiental
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              En el Ayuntamiento de Autlán de Navarro estamos comprometidos con la transparencia, 
              la sustentabilidad y el bienestar de nuestra comunidad. A través de este portal, 
              facilitamos el acceso a información crucial sobre la recolección de residuos y 
              promovemos una cultura ecológica que beneficie a las futuras generaciones.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary mb-3">Transparencia Municipal</h3>
                <p className="text-muted-foreground">
                  Brindamos información clara y actualizada sobre los servicios de recolección 
                  de residuos para facilitar la planificación ciudadana.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary mb-3">Educación Ambiental</h3>
                <p className="text-muted-foreground">
                  Promovemos la conciencia ecológica a través de recursos educativos que 
                  fomentan prácticas sustentables en nuestra comunidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Contribuir?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete al movimiento ecológico de Autlán de Navarro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/rutas">
                Consultar Mi Ruta
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contacto">
                Contactar Ayuntamiento
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;