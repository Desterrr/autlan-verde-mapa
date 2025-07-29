import { Leaf, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Ayuntamiento</span>
                <span className="text-sm text-muted-foreground">Autlán de Navarro</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Comprometidos con el medio ambiente y la sustentabilidad de nuestro municipio.
            </p>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Calle V. Carranza #1, Col. Centro<br />
                  C.P. 48900, Autlán, Jalisco
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">+52 317 101 1253</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Ernfran1901@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Horarios de Atención</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-primary" />
                <div className="text-sm text-muted-foreground">
                  <div>Lunes a Viernes</div>
                  <div>8:00 AM - 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Enlaces Útiles</h3>
            <div className="space-y-2">
              <a href="/rutas" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Consulta de Rutas
              </a>
              <a href="/recursos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Recursos Ecológicos
              </a>
              <a href="/contacto" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Gobierno Municipal de Autlán de Navarro, Jalisco (2024–2027). 
            Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Desarrollado por la Jefatura de Sistemas Digitales
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;