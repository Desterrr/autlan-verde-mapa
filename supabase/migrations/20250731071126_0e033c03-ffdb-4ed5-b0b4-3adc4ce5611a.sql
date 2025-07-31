-- Crear tabla de camiones
CREATE TABLE public.camiones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  placa TEXT NOT NULL UNIQUE,
  modelo TEXT NOT NULL,
  año INTEGER,
  capacidad TEXT,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'mantenimiento', 'inactivo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de choferes
CREATE TABLE public.choferes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  cedula TEXT NOT NULL UNIQUE,
  telefono TEXT,
  licencia TEXT NOT NULL,
  fecha_vencimiento_licencia DATE,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de asignaciones
CREATE TABLE public.asignaciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camion_id UUID NOT NULL REFERENCES public.camiones(id) ON DELETE CASCADE,
  chofer_id UUID NOT NULL REFERENCES public.choferes(id) ON DELETE CASCADE,
  ruta_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  horario_inicio TIME NOT NULL,
  horario_fin TIME NOT NULL,
  dias_asignados TEXT[] NOT NULL DEFAULT '{}',
  estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'suspendida', 'finalizada')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_camion_fecha UNIQUE(camion_id, fecha_inicio),
  CONSTRAINT unique_chofer_fecha UNIQUE(chofer_id, fecha_inicio)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.camiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.choferes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para camiones
CREATE POLICY "Admins can manage camiones" 
ON public.camiones 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view camiones" 
ON public.camiones 
FOR SELECT 
USING (true);

-- Políticas para choferes
CREATE POLICY "Admins can manage choferes" 
ON public.choferes 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view choferes" 
ON public.choferes 
FOR SELECT 
USING (true);

-- Políticas para asignaciones
CREATE POLICY "Admins can manage asignaciones" 
ON public.asignaciones 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view asignaciones" 
ON public.asignaciones 
FOR SELECT 
USING (true);

-- Triggers para actualizar timestamps
CREATE TRIGGER update_camiones_updated_at
BEFORE UPDATE ON public.camiones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_choferes_updated_at
BEFORE UPDATE ON public.choferes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_asignaciones_updated_at
BEFORE UPDATE ON public.asignaciones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Agregar columna de puntos específicos a la tabla routes para el mapa
ALTER TABLE public.routes 
ADD COLUMN puntos_especificos JSONB DEFAULT '[]'::jsonb;