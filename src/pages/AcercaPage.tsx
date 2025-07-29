import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Users, Target, Award, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const AcercaPage = () => {
  const team = [
    {
      name: "Ernesto Francisco Reyes Viramontes",
      position: "Jefe de Sistemas Digitales",
      email: "Ernfran1901@gmail.com",
      phone: "+52 317 101 1253",
      description: "Responsable del desarrollo e implementación de soluciones digitales para el municipio."
    }
  ];

  const values = [
    {
      icon: Leaf,
      title: "Sustentabilidad",
      description: "Promovemos prácticas que aseguren un futuro sostenible para las próximas generaciones."
    },
    {
      icon: Users,
      title: "Transparencia",
      description: "Brindamos información clara y accesible sobre los servicios municipales."
    },
    {
      icon: Target,
      title: "Eficiencia",
      description: "Optimizamos los procesos para ofrecer servicios de calidad a nuestros ciudadanos."
    },
    {
      icon: Award,
      title: "Compromiso",
      description: "Trabajamos dedicadamente por el bienestar y desarrollo de nuestra comunidad."
    }
  ];

  const achievements = [
    { number: "10+", label: "Colonias Atendidas" },
    { number: "1000+", label: "Familias Beneficiadas" },
    { number: "50+", label: "Toneladas Recicladas Mensualmente" },
    { number: "24/7", label: "Información Disponible" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4">Gobierno Municipal 2024-2027</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Acerca del <span className="text-primary">Ayuntamiento de Autlán</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conoce nuestra misión, visión y compromiso con el medio ambiente y 
              el bienestar de la comunidad de Autlán de Navarro, Jalisco.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Proporcionar servicios públicos eficientes y transparentes que mejoren la calidad de vida 
                de los ciudadanos de Autlán de Navarro, promoviendo la sustentabilidad ambiental, 
                la participación ciudadana y el desarrollo integral de nuestro municipio.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Ser un municipio modelo en gestión ambiental y gobierno digital, donde la tecnología 
                y la transparencia se combinen para crear una comunidad próspera, sustentable y 
                comprometida con el cuidado del medio ambiente.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían nuestro trabajo diario para servir mejor a la comunidad
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16 bg-muted/30 py-12 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Nuestros Logros</h2>
            <p className="text-muted-foreground">
              Resultados que demuestran nuestro compromiso con la comunidad
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{achievement.number}</div>
                <div className="text-sm text-muted-foreground">{achievement.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Equipo de Trabajo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conoce al equipo responsable del desarrollo y mantenimiento de esta plataforma
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{member.name}</CardTitle>
                      <Badge variant="secondary">{member.position}</Badge>
                      <CardDescription className="mt-2">{member.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      <a href={`tel:${member.phone}`} className="hover:text-primary transition-colors">
                        {member.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ubicación</h2>
            <p className="text-muted-foreground">
              Visítanos en nuestras oficinas del centro de Autlán
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ayuntamiento Constitucional</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <div>Calle V. Carranza #1</div>
                        <div>Col. Centro, C.P. 48900</div>
                        <div>Autlán de Navarro, Jalisco, México</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-primary" />
                      <span>+52 317 101 1253</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-primary" />
                      <span>Ernfran1901@gmail.com</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Horarios de Atención</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>Lunes a Viernes: 8:00 AM - 5:00 PM</div>
                    <div>Sábados: 9:00 AM - 1:00 PM</div>
                    <div>Domingos: Cerrado</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Quieres Saber Más?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explora nuestros servicios, consulta las rutas de recolección o ponte en contacto 
                con nosotros para más información sobre nuestros programas ambientales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="eco">
                  <Link to="/rutas">
                    <MapPin className="mr-2 h-4 w-4" />
                    Consultar Rutas
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/recursos">
                    <Leaf className="mr-2 h-4 w-4" />
                    Recursos Ecológicos
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contacto">
                    <Phone className="mr-2 h-4 w-4" />
                    Contactar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AcercaPage;