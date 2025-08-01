-- Eliminar datos mock de colonias
DELETE FROM public.colonias WHERE name IN (
  'Centro',
  'La Ladrillera',
  'Los Volcanes', 
  'El Vergel',
  'Guadalupe',
  'El Zapote',
  'San José',
  'Las Flores',
  'Santa Rita',
  'La Guadalupana'
);

-- Eliminar artículos mock/ejemplo
DELETE FROM public.articles WHERE autor = 'Departamento de Ecología';

-- Eliminar rutas mock si las hay
DELETE FROM public.routes WHERE descripcion LIKE '%recolección%' OR descripcion LIKE '%residuos%';