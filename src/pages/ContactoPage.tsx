import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ContactoPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    tipo: "",
    mensaje: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Mensaje enviado exitosamente",
        description: "Nos pondremos en contacto contigo en las próximas 24 horas.",
      });

      // Reset form
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        tipo: "",
        mensaje: ""
      });
    } catch (error) {
      toast({
        title: "Error al enviar mensaje",
        description: "Por favor intenta nuevamente o contáctanos directamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      details: ["Calle V. Carranza #1", "Col. Centro, C.P. 48900", "Autlán de Navarro, Jalisco"],
      action: "Ver en mapa"
    },
    {
      icon: Phone,
      title: "Teléfono",
      details: ["+52 317 101 1253"],
      action: "Llamar ahora"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["Ernfran1901@gmail.com"],
      action: "Enviar email"
    },
    {
      icon: Clock,
      title: "Horarios",
      details: ["Lunes a Viernes: 8:00 AM - 5:00 PM", "Sábados: 9:00 AM - 1:00 PM"],
      action: ""
    }
  ];

  const departments = [
    { value: "ecologia", label: "Departamento de Ecología" },
    { value: "sistemas", label: "Sistemas Digitales" },
    { value: "servicios", label: "Servicios Públicos" },
    { value: "atencion", label: "Atención Ciudadana" },
    { value: "otro", label: "Otro" }
  ];

  const subjects = [
    { value: "ruta-recoleccion", label: "Consulta sobre rutas de recolección" },
    { value: "horarios", label: "Información sobre horarios" },
    { value: "reporte-problema", label: "Reportar problema con recolección" },
    { value: "sugerencia", label: "Sugerencia o mejora" },
    { value: "programa-ambiental", label: "Programas ambientales" },
    { value: "otro", label: "Otro asunto" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-primary">Contacto</span> y Atención Ciudadana
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Ponte en contacto con nosotros para resolver 
              tus dudas sobre recolección de residuos y servicios municipales.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <MessageSquare className="mr-3 h-6 w-6 text-primary" />
                  Envíanos un Mensaje
                </CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo en las próximas 24 horas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="+52 317 123 4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Departamento *</Label>
                      <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Select value={formData.asunto} onValueChange={(value) => handleInputChange("asunto", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el asunto de tu mensaje" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => handleInputChange("mensaje", e.target.value)}
                      placeholder="Describe tu consulta, sugerencia o problema con detalle..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Información importante:</p>
                        <ul className="space-y-1">
                          <li>• Responderemos en un plazo máximo de 24 horas</li>
                          <li>• Para emergencias, llama directamente al +52 317 101 1253</li>
                          <li>• Todos los campos marcados con * son obligatorios</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="eco"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{info.title}</h3>
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-sm text-muted-foreground">
                                {detail}
                              </p>
                            ))}
                            {info.action && (
                              <Button variant="link" className="p-0 h-auto mt-1 text-xs">
                                {info.action}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Enlaces Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/rutas">
                    <MapPin className="mr-2 h-4 w-4" />
                    Consultar Rutas de Recolección
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/recursos">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Recursos Ecológicos
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/acerca">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Acerca del Ayuntamiento
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">Emergencias</h4>
                    <p className="text-sm text-orange-700">
                      Para reportes urgentes de acumulación de basura o problemas graves 
                      con la recolección, llama directamente al teléfono de atención.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactoPage;