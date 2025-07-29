-- Crear enum para tipos de residuos
CREATE TYPE public.waste_type AS ENUM ('organico', 'inorganico', 'mixto');

-- Crear enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Crear tabla de roles de usuario
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Habilitar RLS en user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Crear tabla de colonias
CREATE TABLE public.colonias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en colonias
ALTER TABLE public.colonias ENABLE ROW LEVEL SECURITY;

-- Crear tabla de rutas
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colonia TEXT NOT NULL,
  horario TEXT NOT NULL,
  dias TEXT[] NOT NULL,
  ruta JSONB NOT NULL, -- Array de coordenadas [lat, lng]
  tipo waste_type NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en routes
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Crear tabla de artículos
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  resumen TEXT NOT NULL,
  contenido TEXT NOT NULL,
  imagen TEXT,
  categoria TEXT NOT NULL,
  fecha_publicacion DATE DEFAULT CURRENT_DATE,
  autor TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Función para verificar roles (evita recursión en RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para user_roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para colonias
CREATE POLICY "Anyone can view colonias" ON public.colonias
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage colonias" ON public.colonias
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para routes
CREATE POLICY "Anyone can view routes" ON public.routes
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage routes" ON public.routes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para articles
CREATE POLICY "Anyone can view published articles" ON public.articles
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all articles" ON public.articles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_colonias_updated_at
  BEFORE UPDATE ON public.colonias
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar datos iniciales de colonias
INSERT INTO public.colonias (name, description) VALUES
  ('Centro', 'Centro histórico de Autlán de Navarro'),
  ('La Ladrillera', 'Colonia La Ladrillera'),
  ('Los Volcanes', 'Colonia Los Volcanes'),
  ('El Vergel', 'Colonia El Vergel'),
  ('Guadalupe', 'Colonia Guadalupe'),
  ('El Zapote', 'Colonia El Zapote'),
  ('San José', 'Colonia San José'),
  ('Las Flores', 'Colonia Las Flores'),
  ('Santa Rita', 'Colonia Santa Rita'),
  ('La Guadalupana', 'Colonia La Guadalupana');