export interface RouteData {
  id: string;
  colonia: string;
  horario: string;
  dias: string[];
  ruta: [number, number][];
  tipo: 'organico' | 'inorganico' | 'mixto';
  descripcion: string;
}

export interface Article {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string;
  categoria: string;
  fechaPublicacion: string;
  autor: string;
}

export const mockRoutes: RouteData[] = [
  {
    id: '1',
    colonia: 'Centro',
    horario: '6:00 AM - 8:00 AM',
    dias: ['Lunes', 'Miércoles', 'Viernes'],
    tipo: 'mixto',
    descripcion: 'Recolección de residuos orgánicos e inorgánicos en el centro histórico',
    ruta: [
      [19.7709, -104.3661],
      [19.7720, -104.3650],
      [19.7730, -104.3640],
      [19.7725, -104.3655],
      [19.7715, -104.3665]
    ]
  },
  {
    id: '2',
    colonia: 'La Ladrillera',
    horario: '7:00 AM - 9:00 AM',
    dias: ['Martes', 'Jueves', 'Sábado'],
    tipo: 'organico',
    descripcion: 'Recolección especializada de residuos orgánicos para compostaje',
    ruta: [
      [19.7650, -104.3700],
      [19.7660, -104.3690],
      [19.7670, -104.3680],
      [19.7665, -104.3695]
    ]
  },
  {
    id: '3',
    colonia: 'Los Volcanes',
    horario: '8:00 AM - 10:00 AM',
    dias: ['Lunes', 'Miércoles', 'Viernes'],
    tipo: 'inorganico',
    descripcion: 'Recolección de materiales reciclables: plástico, vidrio, papel',
    ruta: [
      [19.7800, -104.3600],
      [19.7810, -104.3590],
      [19.7820, -104.3580],
      [19.7815, -104.3595]
    ]
  },
  {
    id: '4',
    colonia: 'El Vergel',
    horario: '6:30 AM - 8:30 AM',
    dias: ['Martes', 'Jueves', 'Sábado'],
    tipo: 'mixto',
    descripcion: 'Recolección general de residuos domésticos',
    ruta: [
      [19.7750, -104.3720],
      [19.7760, -104.3710],
      [19.7770, -104.3700],
      [19.7765, -104.3715]
    ]
  },
  {
    id: '5',
    colonia: 'Guadalupe',
    horario: '7:30 AM - 9:30 AM',
    dias: ['Lunes', 'Miércoles', 'Viernes'],
    tipo: 'organico',
    descripcion: 'Recolección de residuos orgánicos y podas de jardín',
    ruta: [
      [19.7680, -104.3580],
      [19.7690, -104.3570],
      [19.7700, -104.3560],
      [19.7695, -104.3575]
    ]
  }
];

export const ecoArticles: Article[] = [
  {
    id: '1',
    titulo: 'Cómo Reducir Residuos en Casa',
    resumen: 'Aprende técnicas sencillas para minimizar la generación de basura en tu hogar y contribuir al cuidado del medio ambiente.',
    categoria: 'Reducción de Residuos',
    fechaPublicacion: '2024-01-15',
    autor: 'Departamento de Ecología',
    imagen: '/src/assets/recycle-icon.jpg',
    contenido: `
# Cómo Reducir Residuos en Casa

La reducción de residuos en el hogar es una de las formas más efectivas de contribuir al cuidado del medio ambiente. Aquí te compartimos estrategias prácticas:

## 1. Compra Consciente
- Elige productos con menos empaque
- Prefiere envases retornables o reutilizables
- Compra solo lo necesario para evitar desperdicios

## 2. Reutilización Creativa
- Transforma frascos en organizadores
- Usa periódicos como papel de regalo
- Convierte ropa vieja en trapos de limpieza

## 3. Compostaje Doméstico
- Convierte residuos orgánicos en abono
- Reduce hasta un 40% de tu basura doméstica
- Mejora la calidad del suelo de tus plantas

## Beneficios
- Menor impacto ambiental
- Ahorro económico
- Hogar más organizado y sustentable
    `
  },
  {
    id: '2',
    titulo: 'Beneficios del Reciclaje',
    resumen: 'Descubre cómo el reciclaje transforma nuestra comunidad y protege el medio ambiente para las futuras generaciones.',
    categoria: 'Reciclaje',
    fechaPublicacion: '2024-01-10',
    autor: 'Departamento de Ecología',
    imagen: '/src/assets/recycle-icon.jpg',
    contenido: `
# Beneficios del Reciclaje

El reciclaje es una práctica fundamental para la sostenibilidad ambiental y el desarrollo de nuestra comunidad.

## Beneficios Ambientales
- Reducción de la contaminación del aire y agua
- Conservación de recursos naturales
- Disminución de gases de efecto invernadero
- Protección de ecosistemas

## Beneficios Económicos
- Creación de empleos verdes
- Reducción de costos de gestión de residuos
- Desarrollo de industrias sustentables
- Ahorro en materias primas

## Beneficios Sociales
- Comunidades más limpias y saludables
- Educación ambiental
- Participación ciudadana activa
- Calidad de vida mejorada

## Materiales Reciclables en Autlán
- **Papel y cartón**: Periódicos, revistas, cajas
- **Plástico**: Botellas, envases, bolsas
- **Vidrio**: Botellas, frascos
- **Metal**: Latas de aluminio y acero
    `
  },
  {
    id: '3',
    titulo: 'Guía de Compostaje Casero',
    resumen: 'Transforma tus residuos orgánicos en rico abono para tus plantas con esta guía paso a paso de compostaje doméstico.',
    categoria: 'Compostaje',
    fechaPublicacion: '2024-01-08',
    autor: 'Departamento de Ecología',
    imagen: '/src/assets/recycle-icon.jpg',
    contenido: `
# Guía de Compostaje Casero

El compostaje es un proceso natural que convierte los residuos orgánicos en un abono rico en nutrientes.

## ¿Qué Compostar?
### SÍ puedes compostar:
- Restos de frutas y verduras
- Cáscaras de huevo
- Hojas secas
- Restos de poda
- Café molido y bolsitas de té

### NO compostes:
- Carnes y pescados
- Productos lácteos
- Aceites y grasas
- Excrementos de mascotas

## Proceso Paso a Paso
1. **Preparación**: Elige un lugar con sombra parcial
2. **Capas**: Alterna materiales verdes (húmedos) y marrones (secos)
3. **Volteo**: Mezcla cada 2-3 semanas
4. **Humedad**: Mantén como esponja húmeda
5. **Tiempo**: Espera 3-6 meses para compost maduro

## Beneficios
- Reduce hasta 40% de residuos domésticos
- Mejora la calidad del suelo
- Ahorra dinero en fertilizantes
- Contribuye al medio ambiente
    `
  },
  {
    id: '4',
    titulo: 'Separación Correcta de Residuos',
    resumen: 'Aprende la forma correcta de separar tus residuos para maximizar el reciclaje y facilitar la recolección.',
    categoria: 'Separación',
    fechaPublicacion: '2024-01-05',
    autor: 'Departamento de Ecología',
    imagen: '/src/assets/recycle-icon.jpg',
    contenido: `
# Separación Correcta de Residuos

La separación adecuada de residuos es el primer paso para un reciclaje efectivo.

## Categorías de Separación

### Orgánicos (Verde)
- Restos de comida
- Cáscaras de frutas y verduras
- Hojas y restos de jardín
- Restos de café y té

### Inorgánicos Reciclables (Azul)
- Papel y cartón limpio
- Plásticos con símbolo de reciclaje
- Vidrio (botellas y frascos)
- Metales (latas de aluminio)

### Inorgánicos No Reciclables (Gris)
- Papel higiénico usado
- Pañales y toallas sanitarias
- Colillas de cigarro
- Chicles y envolturas metalizadas

## Consejos Importantes
- Limpia los envases antes de reciclar
- Retira etiquetas y tapas cuando sea posible
- No mezcles materiales
- Usa bolsas diferentes para cada categoría

## Horarios de Recolección en Autlán
Consulta nuestra sección de rutas para conocer los horarios específicos de tu colonia.
    `
  },
  {
    id: '5',
    titulo: 'Plantas Nativas de Jalisco para tu Jardín',
    resumen: 'Conoce las plantas nativas de Jalisco que puedes cultivar en tu jardín para apoyar la biodiversidad local.',
    categoria: 'Biodiversidad',
    fechaPublicacion: '2024-01-03',
    autor: 'Departamento de Ecología',
    imagen: '/src/assets/recycle-icon.jpg',
    contenido: `
# Plantas Nativas de Jalisco para tu Jardín

Las plantas nativas son ideales para crear jardines sustentables que requieren menos agua y mantenimiento.

## Beneficios de las Plantas Nativas
- Requieren menos agua y cuidados
- Atraen fauna local (mariposas, abejas, aves)
- Se adaptan mejor al clima regional
- Contribuyen a la biodiversidad

## Plantas Recomendadas

### Árboles
- **Parota**: Sombra excelente, resistente a sequías
- **Guamúchil**: Flores aromáticas, frutos comestibles
- **Mezquite**: Muy resistente, buena para cortinas rompevientos

### Arbustos
- **Hierba del golpe**: Medicinal, flores amarillas
- **Salvia**: Atrae polinizadores, aromática
- **Lantana**: Flores coloridas todo el año

### Plantas de Ornato
- **Agave**: Bajo mantenimiento, arquitectura natural
- **Nopal**: Comestible y decorativo
- **Yuca**: Resistente, flores espectaculares

## Consejos de Cultivo
- Planta al inicio de la temporada de lluvias
- Agrupa plantas con necesidades similares de agua
- Usa mantillo para conservar humedad
- Evita fertilizantes químicos
    `
  }
];

export const colonias = [
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
];