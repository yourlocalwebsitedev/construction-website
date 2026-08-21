import { Project, Service, Review, ServiceCategory, Language, BeforeAfterItem, VideoItem, ServiceArea } from '../types';

// ==================================================
// COMPANY / BRAND CONFIGURATION
// ==================================================
// NOTE: Contact details below are development placeholders.
// Replace with verified K&L Pro-Finish Plastering LLC business information
// before launch. Values intentionally left generic/null where real data
// (license #, warranty length, Google rating) has not been supplied.
export const COMPANY = {
  name: 'K&L Pro-Finish Plastering LLC',
  shortName: 'K&L Pro-Finish',
  phone: '+14028027647',
  phoneDisplay: '(402) 802-7647',
  whatsapp: '14028027647',
  email: 'info@klprofinish.com', // placeholder
  address: '', // placeholder — add real service address if applicable
  primaryCity: '', // placeholder — set primary service city
  hoursEn: 'Mon–Sat: 8am–6pm',
  hoursEs: 'Lun–Sáb: 8am–6pm',
  licenseNumber: null as string | null, // e.g. '#GC-9821' — set when available
  insuranceInfo: null as string | null, // set when available
  warrantyYears: null as number | null, // set when available
  warrantyInfo: null as string | null, // set when available
  googleRating: null as number | null, // set when available
  googleReviewCount: null as number | null, // set when available
  googleReviewUrl: null as string | null, // set when available
  logoUrl: null as string | null, // set when a hosted logo asset is available
  social: {
    instagram: '#',
    facebook: '#',
    youtube: '',
    tiktok: '',
  }
};

export const SERVICE_AREAS: ServiceArea[] = [
  // Placeholder architecture for local SEO — replace with real service cities.
  { city: 'Your City', state: 'ST' },
];

// ==================================================
// SERVICES
// ==================================================
export const INITIAL_SERVICES: Service[] = [
  // ==================================================
  // PILLAR 1: TRADITIONAL PLASTERING (3-Coat System)
  // ==================================================
  {
    id: 's-plastering',
    slug: 'plastering',
    isPillar: true,
    title: { en: 'Traditional Plastering', es: 'Enyesado Tradicional' },
    shortDescription: {
      en: '3-coat systems, restoration, repair and finish work.',
      es: 'Sistemas de 3 capas, restauración, reparación y acabado.'
    },
    description: {
      en: 'A cementitious wall finish built up in layers over a properly prepared substrate. Three-coat plastering builds the wall finish progressively — base, leveling, and finish — to create a durable and refined final surface.',
      es: 'Un acabado de pared cementicio construido en capas sobre un sustrato debidamente preparado. El enyesado de tres capas construye el acabado progresivamente — base, nivelación y acabado — para crear una superficie final duradera y refinada.'
    },
    category: ServiceCategory.RESIDENTIAL,
    imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
    assemblySummary: { en: 'Scratch Coat → Brown Coat → Finish Coat', es: 'Capa Rasqueteada → Capa Base → Capa de Acabado' },
    processSteps: [
      {
        title: { en: '1. Substrate Preparation', es: '1. Preparación del Sustrato' },
        description: {
          en: 'Inspect the wall or sheathing, verify that it is sound and properly secured, clean the surface, install the required water-resistive barrier or drainage layer, and install metal lath or another approved reinforcement where required.',
          es: 'Inspeccionamos la pared o el revestimiento, verificamos que esté sólido y bien asegurado, limpiamos la superficie e instalamos la barrera resistente al agua y el metal lath necesarios.'
        }
      },
      {
        title: { en: '2. Scratch Coat', es: '2. Capa Rasqueteada' },
        description: {
          en: 'Apply the first/base plaster coat. While workable, scratch or groove the surface to create a mechanical bond for the next layer. Allow the coat to cure according to the applicable system requirements.',
          es: 'Aplicamos la primera capa de yeso. Mientras está trabajable, rasqueteamos la superficie para crear una unión mecánica con la siguiente capa.'
        }
      },
      {
        title: { en: '3. Brown Coat', es: '3. Capa Base' },
        description: {
          en: 'Apply the second coat to build thickness, straighten the wall, establish the finished plane, and create a uniform surface. Proper floating and shaping at this stage have a major impact on the final appearance.',
          es: 'Aplicamos la segunda capa para dar espesor, nivelar la pared y establecer el plano final con una superficie uniforme.'
        }
      },
      {
        title: { en: '4. Finish Coat', es: '4. Capa de Acabado' },
        description: {
          en: 'Apply the final thinner coat to create the desired texture, color, and appearance. Depending on the system, the finish may be cementitious, acrylic, or another approved material.',
          es: 'Aplicamos la capa final más delgada para crear la textura, color y apariencia deseados.'
        }
      },
    ],
    problems: [
      { en: 'Cracked or crumbling plaster', es: 'Yeso agrietado o desmoronado' },
      { en: 'Water-damaged walls or ceilings', es: 'Paredes o techos dañados por agua' },
      { en: 'Loose or bulging plaster sections', es: 'Secciones de yeso sueltas o abultadas' },
    ],
    benefits: [
      { en: 'Seamless, invisible repairs', es: 'Reparaciones perfectas e invisibles' },
      { en: 'Matched textures and finishes', es: 'Texturas y acabados igualados' },
      { en: 'Durable, professionally built-up wall system', es: 'Sistema de pared duradero y construido profesionalmente' },
    ],
    faqs: [
      { question: { en: 'How long does plaster repair take?', es: '¿Cuánto tarda la reparación de yeso?' }, answer: { en: 'Most repairs are completed within 1-3 days depending on size and drying time.', es: 'La mayoría de las reparaciones se completan en 1-3 días según el tamaño y el tiempo de secado.' } },
    ]
  },
  {
    id: 's-plaster-repair',
    slug: 'plaster-repair',
    parentSlug: 'plastering',
    title: { en: 'Plaster Repair', es: 'Reparación de Yeso' },
    shortDescription: {
      en: 'Cracks, holes and damaged plaster repaired with care.',
      es: 'Grietas, agujeros y yeso dañado reparados con cuidado.'
    },
    description: {
      en: 'From hairline cracks to major structural damage, we restore plaster walls and ceilings to a smooth, seamless finish that blends with your existing surfaces.',
      es: 'Desde grietas finas hasta daños estructurales importantes, restauramos paredes y techos de yeso a un acabado liso y uniforme.'
    },
    category: ServiceCategory.RESIDENTIAL,
    imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
    problems: [
      { en: 'Cracked or crumbling plaster', es: 'Yeso agrietado o desmoronado' },
      { en: 'Water-damaged walls or ceilings', es: 'Paredes o techos dañados por agua' },
      { en: 'Loose or bulging plaster sections', es: 'Secciones de yeso sueltas o abultadas' },
    ],
    benefits: [
      { en: 'Seamless, invisible repairs', es: 'Reparaciones perfectas e invisibles' },
      { en: 'Matched textures and finishes', es: 'Texturas y acabados igualados' },
      { en: 'Long-lasting, durable results', es: 'Resultados duraderos' },
    ],
    faqs: [
      { question: { en: 'How long does plaster repair take?', es: '¿Cuánto tarda la reparación de yeso?' }, answer: { en: 'Most repairs are completed within 1-3 days depending on size and drying time.', es: 'La mayoría de las reparaciones se completan en 1-3 días según el tamaño y el tiempo de secado.' } },
    ]
  },
  {
    id: 's-ceiling-repair',
    slug: 'ceiling-repair',
    parentSlug: 'plastering',
    title: { en: 'Ceiling Repair', es: 'Reparación de Techos' },
    shortDescription: {
      en: 'Water damage, cracks and sagging ceilings restored.',
      es: 'Daños de agua, grietas y techos hundidos restaurados.'
    },
    description: {
      en: 'We repair water-stained, cracked, and sagging ceilings, restoring structural integrity and a clean finish ready for paint.',
      es: 'Reparamos techos manchados de agua, agrietados y hundidos, restaurando la integridad estructural y un acabado listo para pintar.'
    },
    category: ServiceCategory.RESIDENTIAL,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    problems: [
      { en: 'Water stains and leak damage', es: 'Manchas de agua y daños por fugas' },
      { en: 'Sagging or bulging ceiling sections', es: 'Secciones de techo hundidas o abultadas' },
      { en: 'Cracking near seams and corners', es: 'Grietas cerca de uniones y esquinas' },
    ],
    benefits: [
      { en: 'Restored structural integrity', es: 'Integridad estructural restaurada' },
      { en: 'Smooth, paint-ready surface', es: 'Superficie lisa lista para pintar' },
    ],
    faqs: []
  },
  {
    id: 's-drywall-repair',
    slug: 'drywall-repair',
    parentSlug: 'plastering',
    title: { en: 'Drywall Repair & Finishing', es: 'Reparación y Acabado de Drywall' },
    shortDescription: {
      en: 'Patching, seams, holes and smooth finishing.',
      es: 'Parcheo, uniones, agujeros y acabado liso.'
    },
    description: {
      en: 'From small patches to full-room finishing, our drywall repair delivers smooth, blemish-free walls and ceilings ready for paint.',
      es: 'Desde pequeños parches hasta el acabado de toda una habitación, nuestra reparación de drywall ofrece paredes y techos lisos.'
    },
    category: ServiceCategory.RESIDENTIAL,
    imageUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80',
    problems: [
      { en: 'Holes, dents and nail pops', es: 'Agujeros, abolladuras y clavos salidos' },
      { en: 'Visible seams and tape lines', es: 'Uniones y cinta visibles' },
    ],
    benefits: [
      { en: 'Invisible seams and patches', es: 'Uniones y parches invisibles' },
      { en: 'Paint-ready smooth finish', es: 'Acabado liso listo para pintar' },
    ],
    faqs: []
  },
  {
    id: 's-skim-coating',
    slug: 'skim-coating',
    parentSlug: 'plastering',
    title: { en: 'Skim Coating', es: 'Enlucido / Skim Coating' },
    shortDescription: {
      en: 'Smooth, even surfaces over textured walls.',
      es: 'Superficies lisas y uniformes sobre paredes texturizadas.'
    },
    description: {
      en: 'Skim coating transforms uneven, textured or damaged walls and ceilings into a clean, modern, smooth surface.',
      es: 'El enlucido transforma paredes y techos desiguales, texturizados o dañados en una superficie limpia, moderna y lisa.'
    },
    category: ServiceCategory.INTERIOR,
    imageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80',
    problems: [
      { en: 'Outdated or rough wall texture', es: 'Textura de pared anticuada o rugosa' },
      { en: 'Multiple patch marks and inconsistencies', es: 'Múltiples marcas de parches e inconsistencias' },
    ],
    benefits: [
      { en: 'Modern, smooth wall finish', es: 'Acabado de pared moderno y liso' },
      { en: 'Even surface for paint or wallpaper', es: 'Superficie uniforme para pintura o papel tapiz' },
    ],
    faqs: []
  },
  {
    id: 's-popcorn-ceiling-removal',
    slug: 'popcorn-ceiling-removal',
    parentSlug: 'plastering',
    title: { en: 'Popcorn Ceiling Removal', es: 'Eliminación de Techo de Palomitas' },
    shortDescription: {
      en: 'Removal and refinishing for a modern look.',
      es: 'Eliminación y reacabado para un look moderno.'
    },
    description: {
      en: 'We safely remove dated popcorn texture and refinish ceilings smooth, instantly modernizing any room.',
      es: 'Eliminamos de forma segura la textura de palomitas anticuada y reacabamos los techos lisos, modernizando al instante cualquier habitación.'
    },
    category: ServiceCategory.INTERIOR,
    imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
    problems: [
      { en: 'Outdated popcorn texture', es: 'Textura de palomitas anticuada' },
      { en: 'Difficulty cleaning textured ceilings', es: 'Dificultad para limpiar techos texturizados' },
    ],
    benefits: [
      { en: 'Clean, modern smooth ceilings', es: 'Techos lisos, limpios y modernos' },
      { en: 'Improved lighting reflection', es: 'Mejor reflexión de la luz' },
    ],
    faqs: []
  },
  {
    id: 's-wall-ceiling-restoration',
    slug: 'wall-ceiling-restoration',
    parentSlug: 'plastering',
    title: { en: 'Wall & Ceiling Restoration', es: 'Restauración de Paredes y Techos' },
    shortDescription: {
      en: 'Restoring older or damaged interior surfaces.',
      es: 'Restauración de superficies interiores antiguas o dañadas.'
    },
    description: {
      en: 'Comprehensive restoration for aging plaster and drywall systems, bringing historic and older homes back to a polished, modern condition.',
      es: 'Restauración integral de sistemas de yeso y drywall envejecidos, devolviendo a las casas históricas y antiguas una condición pulida y moderna.'
    },
    category: ServiceCategory.RESIDENTIAL,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    problems: [
      { en: 'Aging plaster systems', es: 'Sistemas de yeso envejecidos' },
      { en: 'Multiple layers of past repairs', es: 'Múltiples capas de reparaciones pasadas' },
    ],
    benefits: [
      { en: 'Preserves character while modernizing', es: 'Conserva el carácter mientras moderniza' },
      { en: 'Long-term structural stability', es: 'Estabilidad estructural a largo plazo' },
    ],
    faqs: []
  },

  // ==================================================
  // PILLAR 2: STUCCO SYSTEMS
  // ==================================================
  {
    id: 's-stucco',
    slug: 'stucco',
    isPillar: true,
    title: { en: 'Stucco Systems', es: 'Sistemas de Estuco' },
    shortDescription: {
      en: 'Lath, scratch/brown coats, finish coats and related exterior stucco work.',
      es: 'Lath, capas rasqueteada/base, capas de acabado y trabajo de estuco exterior relacionado.'
    },
    description: {
      en: 'Exterior cement-based cladding and finish system. Stucco is not the building\'s waterproofing system on its own — its performance depends heavily on the properly designed and installed water-management system behind it. We approach every stucco project with attention to the full assembly, not just the visible finish.',
      es: 'Sistema exterior de revestimiento y acabado a base de cemento. El estuco no es, por sí solo, el sistema de impermeabilización del edificio — su desempeño depende en gran medida del sistema de manejo de agua correctamente diseñado e instalado detrás de él.'
    },
    category: ServiceCategory.RESIDENTIAL,
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    assemblySummary: { en: 'WRB → Lath → Scratch Coat → Brown Coat → Finish Coat', es: 'BRA → Lath → Capa Rasqueteada → Capa Base → Capa de Acabado' },
    processSteps: [
      {
        title: { en: 'Water-Resistive Barrier / Drainage', es: 'Barrera Resistente al Agua / Drenaje' },
        description: {
          en: 'Before stucco is installed, the underlying wall assembly must properly manage water. Critical details include overlaps, flashing, penetrations, window and door integration, transitions, and drainage.',
          es: 'Antes de instalar el estuco, el conjunto de pared subyacente debe manejar correctamente el agua: traslapes, tapajuntas, penetraciones, integración de ventanas y puertas, transiciones y drenaje.'
        }
      },
      {
        title: { en: 'Lath', es: 'Lath (Malla Metálica)' },
        description: {
          en: 'Metal lath or another approved reinforcement creates the mechanical support for the stucco system.',
          es: 'La malla metálica u otro refuerzo aprobado crea el soporte mecánico para el sistema de estuco.'
        }
      },
      {
        title: { en: 'Scratch Coat', es: 'Capa Rasqueteada' },
        description: {
          en: 'The first cementitious coat is applied and scratched to create a mechanical key.',
          es: 'Se aplica la primera capa cementicia y se rasquetea para crear una llave mecánica.'
        }
      },
      {
        title: { en: 'Brown Coat', es: 'Capa Base' },
        description: {
          en: 'The second coat establishes wall thickness, straightness, flatness, and the final surface plane.',
          es: 'La segunda capa establece el espesor de la pared, rectitud, planitud y el plano de superficie final.'
        }
      },
      {
        title: { en: 'Finish Coat', es: 'Capa de Acabado' },
        description: {
          en: 'The final texture and/or color is applied. Potential finishes include smooth, fine sand, lace, dash, and specialty textures.',
          es: 'Se aplica la textura y/o color final. Los acabados posibles incluyen liso, arena fina, encaje, salpicado y texturas especiales.'
        }
      },
    ],
    problems: [
      { en: 'Cracked, stained or damaged stucco', es: 'Estuco agrietado, manchado o dañado' },
      { en: 'Poor drainage behind the stucco assembly', es: 'Drenaje deficiente detrás del conjunto de estuco' },
      { en: 'Failed transitions at windows, doors and penetrations', es: 'Transiciones fallidas en ventanas, puertas y penetraciones' },
    ],
    benefits: [
      { en: 'Attention to the full wall assembly, not just the finish', es: 'Atención al conjunto completo de la pared, no solo al acabado' },
      { en: 'Durable exterior cladding built to last', es: 'Revestimiento exterior duradero hecho para durar' },
      { en: 'Range of textures and finishes available', es: 'Variedad de texturas y acabados disponibles' },
    ],
    faqs: [
      { question: { en: 'Does stucco waterproof my home by itself?', es: '¿El estuco impermeabiliza mi casa por sí solo?' }, answer: { en: 'No. Stucco is an exterior cladding and finish system — the water-resistive barrier and drainage plane behind it are what actually manage water. We install and detail both correctly as part of every stucco project.', es: 'No. El estuco es un sistema de revestimiento y acabado exterior — la barrera resistente al agua y el plano de drenaje detrás de él son los que realmente manejan el agua. Instalamos y detallamos ambos correctamente en cada proyecto.' } },
    ]
  },

  // ==================================================
  // PILLAR 3: EIFS (EXTERIOR INSULATION AND FINISH SYSTEM)
  // ==================================================
  {
    id: 's-eifs',
    slug: 'eifs',
    isPillar: true,
    title: { en: 'EIFS', es: 'EIFS (Sistema de Aislamiento y Acabado Exterior)' },
    shortDescription: {
      en: 'Continuous-insulation exterior finishing systems with base coat, reinforcement and finish.',
      es: 'Sistemas de acabado exterior con aislamiento continuo, capa base, refuerzo y acabado.'
    },
    description: {
      en: 'Exterior Insulation and Finish System — an exterior wall system combining continuous exterior insulation with reinforced base and finish coats. EIFS differs significantly from traditional stucco because insulation is an integral part of the exterior assembly. Continuous exterior insulation can reduce thermal bridging and contribute to improved building-envelope performance when the overall assembly is properly designed and installed.',
      es: 'Sistema de Aislamiento y Acabado Exterior — un sistema de pared exterior que combina aislamiento exterior continuo con capas base y de acabado reforzadas. El aislamiento continuo puede reducir los puentes térmicos y contribuir a un mejor desempeño de la envolvente del edificio.'
    },
    category: ServiceCategory.COMMERCIAL,
    imageUrl: 'https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=800&q=80',
    assemblySummary: { en: 'Air/Water Control → EPS Insulation → Base Coat → Reinforcing Mesh → Finish Coat', es: 'Control de Aire/Agua → Aislamiento EPS → Capa Base → Malla de Refuerzo → Capa de Acabado' },
    processSteps: [
      {
        title: { en: '1. Wall Preparation', es: '1. Preparación de la Pared' },
        description: {
          en: 'Inspect the sheathing, verify installation and condition, ensure reasonable flatness, and prepare openings and transitions.',
          es: 'Inspeccionamos el revestimiento, verificamos su instalación y condición, aseguramos planitud razonable y preparamos aberturas y transiciones.'
        }
      },
      {
        title: { en: '2. Air/Water Control Layer', es: '2. Capa de Control de Aire/Agua' },
        description: {
          en: 'Install the specified water-resistive and/or air-barrier system, with particular attention to windows, doors, penetrations, roof-to-wall transitions, wall intersections, and changes in material/system.',
          es: 'Instalamos el sistema de barrera resistente al agua y/o aire especificado, con atención particular a ventanas, puertas, penetraciones y transiciones.'
        }
      },
      {
        title: { en: '3. Insulation Installation', es: '3. Instalación del Aislamiento' },
        description: {
          en: 'Typically install EPS insulation boards according to the manufacturer\'s system requirements.',
          es: 'Instalamos paneles de aislamiento EPS según los requisitos del sistema del fabricante.'
        }
      },
      {
        title: { en: '4. Rasping / Shaping', es: '4. Raspado / Perfilado' },
        description: {
          en: 'The insulation can be rasped or shaped to eliminate uneven joints, establish a consistent plane, and form architectural details.',
          es: 'El aislamiento puede raspar se o perfilarse para eliminar uniones desiguales, establecer un plano consistente y formar detalles arquitectónicos.'
        }
      },
      {
        title: { en: '5. Base Coat', es: '5. Capa Base' },
        description: {
          en: 'Apply the cementitious/polymer-modified base coat.',
          es: 'Aplicamos la capa base cementicia/modificada con polímero.'
        }
      },
      {
        title: { en: '6. Reinforcing Mesh', es: '6. Malla de Refuerzo' },
        description: {
          en: 'Embed fiberglass reinforcing mesh into the wet base coat.',
          es: 'Incrustamos malla de fibra de vidrio en la capa base húmeda.'
        }
      },
      {
        title: { en: '7. Finish Coat', es: '7. Capa de Acabado' },
        description: {
          en: 'After the base system is properly prepared/cured, apply the specified exterior finish.',
          es: 'Después de que el sistema base esté debidamente preparado/curado, aplicamos el acabado exterior especificado.'
        }
      },
    ],
    problems: [
      { en: 'Cracked or damaged EIFS finish', es: 'Acabado de EIFS agrietado o dañado' },
      { en: 'Poor insulation continuity or thermal bridging', es: 'Continuidad deficiente del aislamiento o puentes térmicos' },
      { en: 'Failed transitions at windows, doors and roof lines', es: 'Transiciones fallidas en ventanas, puertas y líneas de techo' },
    ],
    benefits: [
      { en: 'Continuous exterior insulation for better envelope performance', es: 'Aislamiento exterior continuo para mejor desempeño de la envolvente' },
      { en: 'Reinforced, durable base and finish system', es: 'Sistema base y de acabado reforzado y duradero' },
      { en: 'Wide range of architectural finish options', es: 'Amplia gama de opciones de acabado arquitectónico' },
    ],
    faqs: []
  },

  // ==================================================
  // PILLAR 4: AIR BARRIER & WATERPROOFING
  // ==================================================
  {
    id: 's-air-barrier-waterproofing',
    slug: 'air-barrier-waterproofing',
    isPillar: true,
    title: { en: 'Air Barrier & Waterproofing', es: 'Barrera de Aire e Impermeabilización' },
    shortDescription: {
      en: 'Substrate preparation, transitions, openings, membranes and building-envelope water/air management.',
      es: 'Preparación de sustrato, transiciones, aberturas, membranas y manejo de agua/aire de la envolvente del edificio.'
    },
    description: {
      en: 'This work manages air and water movement through the building envelope. Unlike plaster, stucco, or EIFS finishes, this work is primarily about building-envelope protection rather than appearance — and it is what actually determines whether the wall assembly performs over the long term.',
      es: 'Este trabajo maneja el movimiento de aire y agua a través de la envolvente del edificio. A diferencia del yeso, el estuco o los acabados de EIFS, este trabajo se trata principalmente de la protección de la envolvente del edificio más que de la apariencia.'
    },
    category: ServiceCategory.COMMERCIAL,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    assemblySummary: { en: 'Substrate → Detailing → Membrane → Cladding', es: 'Sustrato → Detallado → Membrana → Revestimiento' },
    processSteps: [
      {
        title: { en: '1. Substrate Preparation', es: '1. Preparación del Sustrato' },
        description: {
          en: 'The substrate may include sheathing, concrete, masonry, or other approved surfaces. Preparation can include cleaning, repairing damaged areas, treating cracks, checking compatibility, and ensuring the substrate is suitable for the specified membrane/system. The performance of an air/water barrier depends heavily on substrate preparation and detailing.',
          es: 'El sustrato puede incluir revestimiento, concreto, mampostería u otras superficies aprobadas. La preparación puede incluir limpieza, reparación de áreas dañadas, tratamiento de grietas y verificación de compatibilidad.'
        }
      },
      {
        title: { en: '2. Joints and Transitions', es: '2. Juntas y Transiciones' },
        description: {
          en: 'Address critical conditions before installing the field membrane — sheathing joints, inside/outside corners, fasteners, penetrations, control joints, changes in substrate, and wall-to-foundation/roof transitions — using sealants, tapes, reinforcing mesh, transition membranes, flashing, or liquid-applied detailing products as specified.',
          es: 'Abordamos condiciones críticas antes de instalar la membrana de campo: juntas de revestimiento, esquinas, sujetadores, penetraciones, juntas de control y transiciones.'
        }
      },
      {
        title: { en: '3. Windows and Doors', es: '3. Ventanas y Puertas' },
        description: {
          en: 'These are among the most critical areas of the enclosure. The air/water barrier must properly integrate with the window and door flashing system to maintain a continuous drainage and air-control plane.',
          es: 'Estas son algunas de las áreas más críticas de la envolvente. La barrera de aire/agua debe integrarse correctamente con el sistema de tapajuntas de ventanas y puertas.'
        }
      },
      {
        title: { en: '4. Main Air/Water Barrier', es: '4. Barrera Principal de Aire/Agua' },
        description: {
          en: 'Depending on the design/specification, systems may include fluid-applied membranes, sheet membranes, self-adhered membranes, cementitious waterproofing, or other manufacturer-approved systems. Fluid-applied products may be installed using rollers, brushes, squeegees, or spray equipment.',
          es: 'Según el diseño/especificación, los sistemas pueden incluir membranas líquidas aplicadas, membranas en lámina, membranas autoadheribles o impermeabilización cementicia.'
        }
      },
      {
        title: { en: '5. Quality Control', es: '5. Control de Calidad' },
        description: {
          en: 'Check coverage, required thickness, pinholes, voids, missed areas, penetration detailing, transitions, and window/door interfaces. Where applicable, wet-film thickness or other specified measurements may be used to verify installation.',
          es: 'Verificamos cobertura, espesor requerido, orificios, vacíos, áreas perdidas, detallado de penetraciones y transiciones.'
        }
      },
      {
        title: { en: '6. Protection / Cladding', es: '6. Protección / Revestimiento' },
        description: {
          en: 'After completion, the wall\'s exterior system is installed over or integrated with the control layer — for example, Sheathing → Air/Water Barrier → EIFS, or Sheathing → Air/Water Barrier → Lath → Stucco.',
          es: 'Después de completar, el sistema exterior de la pared se instala sobre o se integra con la capa de control — por ejemplo, Revestimiento → Barrera de Aire/Agua → EIFS, o Revestimiento → Barrera de Aire/Agua → Lath → Estuco.'
        }
      },
    ],
    problems: [
      { en: 'Water intrusion through the wall assembly', es: 'Intrusión de agua a través del conjunto de pared' },
      { en: 'Poorly detailed windows, doors or penetrations', es: 'Ventanas, puertas o penetraciones mal detalladas' },
      { en: 'Missing or failed air/water control layer', es: 'Capa de control de aire/agua faltante o fallida' },
    ],
    benefits: [
      { en: 'Protects the long-term performance of the building envelope', es: 'Protege el desempeño a largo plazo de la envolvente del edificio' },
      { en: 'Careful detailing at the most vulnerable transitions', es: 'Detallado cuidadoso en las transiciones más vulnerables' },
      { en: 'Compatible integration with stucco, EIFS or other cladding', es: 'Integración compatible con estuco, EIFS u otro revestimiento' },
    ],
    faqs: []
  },
];

// ==================================================
// BEFORE & AFTER
// ==================================================
export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    id: 'ba1',
    title: { en: 'Ceiling Water Damage Repair', es: 'Reparación de Daño de Agua en Techo' },
    service: { en: 'Ceiling Repair', es: 'Reparación de Techos' },
    location: 'Residential Home',
    category: 'Ceiling Repair',
    beforeImage: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ba2',
    title: { en: 'Living Room Plaster Restoration', es: 'Restauración de Yeso en Sala' },
    service: { en: 'Plaster Repair', es: 'Reparación de Yeso' },
    location: 'Residential Home',
    category: 'Plaster Repair',
    beforeImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ba3',
    title: { en: 'Wall Crack Repair', es: 'Reparación de Grietas en Pared' },
    service: { en: 'Wall Crack Repair', es: 'Reparación de Grietas' },
    location: 'Residential Home',
    category: 'Wall Crack Repair',
    beforeImage: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ba4',
    title: { en: 'Drywall Patch & Finish', es: 'Parcheo y Acabado de Drywall' },
    service: { en: 'Drywall Repair', es: 'Reparación de Drywall' },
    location: 'Residential Home',
    category: 'Drywall Repair',
    beforeImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ba5',
    title: { en: 'Historic Home Restoration', es: 'Restauración de Casa Histórica' },
    service: { en: 'Restoration', es: 'Restauración' },
    location: 'Residential Home',
    category: 'Restoration',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ba6',
    title: { en: 'Textured Wall Skim Coat', es: 'Enlucido de Pared Texturizada' },
    service: { en: 'Skim Coating', es: 'Enlucido' },
    location: 'Residential Home',
    category: 'Skim Coating',
    beforeImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
  },
];

// ==================================================
// PROJECTS
// ==================================================
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: { en: 'Sunset Villa Renovation', es: 'Renovación Villa Sunset' },
    description: {
      en: 'A full interior plaster restoration including ceiling medallion repair and wall crack remediation.',
      es: 'Una restauración interior completa de yeso incluyendo reparación de medallón de techo y remediación de grietas en paredes.'
    },
    images: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    category: ServiceCategory.RESIDENTIAL,
    featured: true,
    completionDate: '2024-11-15',
    location: 'Residential Home',
    services: [{ en: 'Plaster Repair', es: 'Reparación de Yeso' }, { en: 'Ceiling Repair', es: 'Reparación de Techos' }],
  },
  {
    id: 'p2',
    title: { en: 'Modern Home Makeover', es: 'Renovación de Hogar Moderno' },
    description: {
      en: 'Skim coating and drywall finishing throughout the main living areas for a clean, modern look.',
      es: 'Enlucido y acabado de drywall en las áreas principales para un look limpio y moderno.'
    },
    images: [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80'
    ],
    category: ServiceCategory.RESIDENTIAL,
    featured: true,
    completionDate: '2025-01-20',
    location: 'Residential Home',
    services: [{ en: 'Skim Coating', es: 'Enlucido' }, { en: 'Drywall Repair & Finishing', es: 'Acabado de Drywall' }],
  },
  {
    id: 'p3',
    title: { en: 'Downtown Office Complex', es: 'Complejo de Oficinas Centro' },
    description: {
      en: 'Ceiling and wall restoration for a commercial office space, including popcorn ceiling removal.',
      es: 'Restauración de techos y paredes para un espacio de oficina comercial, incluyendo eliminación de techo de palomitas.'
    },
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
    category: ServiceCategory.COMMERCIAL,
    featured: true,
    completionDate: '2025-02-10',
    location: 'Commercial Property',
    services: [{ en: 'Popcorn Ceiling Removal', es: 'Eliminación de Palomitas' }],
  }
];

// ==================================================
// VIDEOS (lazy-loaded, thumbnails only until opened)
// ==================================================
export const INITIAL_VIDEOS: VideoItem[] = [
  // Placeholder architecture — add real project videos (≈2 min each, ~10 max).
];

// ==================================================
// REVIEWS
// ==================================================
// Marked clearly as placeholders until real Google reviews are supplied.
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Placeholder Customer',
    rating: 5,
    text: {
      en: '[Placeholder review — replace with a real customer testimonial]',
      es: '[Reseña de ejemplo — reemplazar con un testimonio real de cliente]'
    },
    date: '2024-12-01',
    source: 'Google',
    isPlaceholder: true,
  },
  {
    id: 'r2',
    author: 'Placeholder Customer',
    rating: 5,
    text: {
      en: '[Placeholder review — replace with a real customer testimonial]',
      es: '[Reseña de ejemplo — reemplazar con un testimonio real de cliente]'
    },
    date: '2025-02-14',
    source: 'Google',
    isPlaceholder: true,
  }
];

export const TRANSLATIONS = {
  [Language.EN]: {
    nav: { home: 'Home', services: 'Services', projects: 'Projects', beforeAfter: 'Before & After', ourWork: 'Our Work', about: 'About', reviews: 'Reviews', contact: 'Contact' },
    home: {
      eyebrow: 'PLASTERING • STUCCO • EIFS • AIR BARRIER & WATERPROOFING',
      heroTitleLine1: 'BEAUTIFUL FINISHES.',
      heroTitleLine2: 'BUILT TO LAST.',
      heroSubtitle: 'Expert plastering, stucco, EIFS and air/water barrier work — built on proper substrate preparation, not just the visible finish.',
      ctaEstimate: 'GET A FREE ESTIMATE',
      ctaViewWork: 'VIEW OUR WORK',
      cta: 'Get a Free Estimate',
      whatsapp: 'WhatsApp',
      trust: {
        licensed: 'Licensed & Insured',
        warranty: 'Workmanship Warranty',
        rating: 'Google Reviews',
        craftsmanship: 'Quality Craftsmanship',
        service: 'Professional Service',
        freeEstimates: 'Free Estimates',
      },
      moreThanFinish: {
        eyebrow: 'THE COMPLETE ASSEMBLY',
        title: 'More Than the Finish',
        body: 'A high-quality exterior wall depends on the complete assembly — not just the visible surface. K&L approaches plastering, stucco, EIFS and air/water barrier work with attention to substrate preparation, transitions, reinforcement, drainage, and the finished appearance.',
        diagram: ['SUBSTRATE', 'AIR/WATER CONTROL', 'REINFORCEMENT / INSULATION', 'BASE COATS', 'FINISH'],
      },
      beforeAfter: {
        eyebrow: 'BEFORE & AFTER',
        title: 'SEE THE DIFFERENCE',
        subtitle: 'Real repairs. Real transformations.',
        viewAll: 'VIEW ALL TRANSFORMATIONS',
      },
      services: {
        eyebrow: 'OUR SERVICES',
        title: 'Plastering, Stucco, EIFS & Waterproofing',
        viewAll: 'View All Services',
        learnMore: 'Learn More',
      },
      featuredProjects: 'FEATURED PROJECTS',
      viewAllProjects: 'View All Projects',
      viewProject: 'View Project',
      photos: 'Photos',
      videos: 'Videos',
      videosSection: {
        title: 'SEE OUR WORK IN ACTION',
      },
      whyUs: {
        eyebrow: 'WHY K&L',
        title: 'Why Homeowners Choose K&L',
        items: {
          quality: 'Quality Craftsmanship',
          prep: 'Proper Surface Preparation',
          detail: 'Attention to Detail',
          comm: 'Professional Communication',
          clean: 'Clean Work Areas',
          results: 'Results You Can See',
        }
      },
      testimonials: 'What Our Clients Say',
      verifiedClient: 'Verified Client',
      viewGoogleReviews: 'VIEW OUR GOOGLE REVIEWS',
      finalCta: {
        title1: 'READY TO TRANSFORM YOUR',
        title2: 'WALLS OR CEILINGS?',
        subtitle: 'Tell us about your project and send us a few photos to get started.',
        estimate: 'GET A FREE ESTIMATE',
        call: 'CALL NOW',
      },
      serviceArea: {
        title: 'Service Area',
        subtitle: 'Proudly serving our local community.',
      }
    },
    common: {
      bookNow: 'Get Quote',
      getEstimate: 'GET A FREE ESTIMATE',
      call: 'Call',
      callUs: 'Call Us',
      whatsapp: 'WhatsApp',
      getQuote: 'Get Quote',
      readMore: 'Read More',
      loading: 'Loading...',
      submit: 'Send Request',
      speaking: 'Hablamos Español',
      hours: 'Mon-Sat: 8am-6pm',
      licenseShort: 'Licensed',
      backToTop: 'Back to top',
    },
    portfolio: {
      title: 'Recent Projects',
      eyebrow: 'OUR PROJECTS',
      filterAll: 'All',
      filterResidential: 'Residential',
      filterCommercial: 'Commercial',
      filterInterior: 'Interior',
      loadingPortfolio: 'Loading portfolio...',
      viewProject: 'View Project',
    },
    services: {
      title: 'Plastering & Finishing Services',
      bookService: 'Get a Quote',
      commonProblems: 'Common Problems',
      benefits: 'Benefits',
      faq: 'Frequently Asked Questions',
      relatedProjects: 'Related Projects',
      getEstimateCta: 'Have a similar project? Get a free estimate.',
    },
    admin: { title: 'Admin Dashboard', login: 'Login', projects: 'Projects', bookings: 'Bookings', services: 'Services' },
    booking: { selectService: 'Select Service', selectDate: 'Select Date & Time', yourInfo: 'Your Information', confirm: 'Confirm Booking' },
    estimate: {
      title: 'Get a Free Estimate',
      steps: { service: 'Service', location: 'Location', project: 'Project', photos: 'Photos', contact: 'Contact' },
      step1Title: 'What can we help with?',
      step1Sub: 'Select the service closest to your project.',
      serviceOther: 'Other',
      step2Title: 'Where is the project?',
      step2Sub: "We'll use this to confirm we serve your area.",
      zip: 'ZIP Code', city: 'City',
      step3Title: 'Tell us about the project',
      step3Sub: 'The more detail, the more accurate your estimate.',
      descriptionPlaceholder: 'Describe the issue, size of area, materials, timeline...',
      step4Title: 'Show us the problem',
      step4Sub: 'Upload a few photos (optional but recommended).',
      addPhotos: 'Add Photos', remove: 'Remove',
      maxPhotos: `Up to ${8} photos, 10MB each`,
      uploading: 'Uploading photos…',
      step5Title: 'Contact information',
      step5Sub: "We'll reach out to confirm details and schedule your estimate.",
      name: 'Full Name', phone: 'Phone Number', email: 'Email Address',
      preferredContact: 'Preferred Contact Method',
      contactOpts: { call: 'Call', text: 'Text', email: 'Email', whatsapp: 'WhatsApp' },
      bestTime: 'Best time to contact (optional)',
      back: 'Back', next: 'Next', submit: 'Submit Request', submitting: 'Submitting…',
      errors: {
        required: 'This field is required',
        invalidEmail: 'Enter a valid email address',
        invalidPhone: 'Enter a valid phone number',
        invalidZip: 'Enter a valid ZIP code',
        selectService: 'Please select a service',
        fileType: 'Unsupported file type — use JPG, PNG, WEBP or HEIC',
        fileSize: 'File is too large (max 10MB)',
        generic: 'Something went wrong. Please try again.',
        network: 'Network error — check your connection and try again.',
        spam: 'Submission could not be processed. Please try again or call us directly.',
      },
      successTitle: 'THANK YOU.',
      successSubtitle: "WE'VE RECEIVED YOUR PROJECT REQUEST.",
      successBody: 'A member of K & L Pro-Finish Plastering LLC will contact you regarding your project.',
      reference: 'Reference Number',
      returnHome: 'Return Home',
    },
    contact: {
      title: 'Get a Free Estimate',
      subtitle: 'Tell us about your project. We typically reply within 2 hours.',
      phone: 'Phone', text: 'Text', whatsapp: 'WhatsApp', email: 'Email', hours: 'Business Hours', area: 'Service Area',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        zip: 'Project Zip Code',
        serviceType: 'Service Needed',
        timeline: 'Project Timeline',
        timelineOpts: { asap: 'Immediately', month: '1-3 Months', planning: 'Just Planning' },
        preferred: 'Preferred Contact',
        methodOpts: { call: 'Phone Call', email: 'Email', text: 'Text Message' },
        details: 'Project Details'
      }
    },
    about: {
      title: 'BUILT ON SKILL.',
      titleLine2: 'DRIVEN BY QUALITY.',
      subtitle: 'Building trust, one wall at a time.',
      storyTitle: 'Our Story',
      storyText: 'K&L Pro-Finish Plastering LLC was founded on a simple idea: deliver plastering and finishing work that looks flawless and lasts. From small repairs to full interior restorations, we bring craftsmanship and care to every project, treating every home like our own.',
      missionTitle: 'Our Mission',
      missionText: 'To deliver exceptional plastering and finishing work that exceeds client expectations, with honest communication, clean job sites, and results our customers are proud to show off.',
      craftsmanshipTitle: 'Craftsmanship',
      craftsmanshipText: 'Every crack, seam, and surface is treated with the same attention to detail — because the difference is in the details.',
      teamTitle: 'Our Team',
      teamText: 'A dedicated crew of finishing professionals focused on quality workmanship and respectful, reliable service.',
      serviceAreaTitle: 'Service Area',
      values: {
        quality: { title: 'Quality', desc: 'We never compromise on materials or workmanship.' },
        integrity: { title: 'Integrity', desc: 'Honest pricing, transparent timelines, and no hidden fees.' },
        safety: { title: 'Care', desc: 'Careful protection of your home and belongings on every job.' },
        innovation: { title: 'Craftsmanship', desc: 'Time-tested techniques paired with modern materials.' }
      },
      stats: {
        years: 'Trusted',
        projects: 'Completed',
        clients: 'Estimates',
        team: 'Status'
      }
    }
  },
  [Language.ES]: {
    nav: { home: 'Inicio', services: 'Servicios', projects: 'Proyectos', beforeAfter: 'Antes y Después', ourWork: 'Nuestro Trabajo', about: 'Nosotros', reviews: 'Reseñas', contact: 'Contacto' },
    home: {
      eyebrow: 'YESO • ESTUCO • EIFS • BARRERA DE AIRE Y IMPERMEABILIZACIÓN',
      heroTitleLine1: 'ACABADOS HERMOSOS.',
      heroTitleLine2: 'HECHOS PARA DURAR.',
      heroSubtitle: 'Yeso, estuco, EIFS y barreras de aire/agua expertos — construidos sobre una preparación adecuada del sustrato, no solo el acabado visible.',
      ctaEstimate: 'PRESUPUESTO GRATIS',
      ctaViewWork: 'VER NUESTRO TRABAJO',
      cta: 'Presupuesto Gratis',
      whatsapp: 'WhatsApp',
      trust: {
        licensed: 'Licencia y Seguro',
        warranty: 'Garantía de Trabajo',
        rating: 'Reseñas de Google',
        craftsmanship: 'Calidad Artesanal',
        service: 'Servicio Profesional',
        freeEstimates: 'Presupuestos Gratis',
      },
      moreThanFinish: {
        eyebrow: 'EL CONJUNTO COMPLETO',
        title: 'Más Que el Acabado',
        body: 'Una pared exterior de alta calidad depende del conjunto completo — no solo de la superficie visible. K&L aborda el yeso, estuco, EIFS y el trabajo de barrera de aire/agua con atención a la preparación del sustrato, transiciones, refuerzo, drenaje y la apariencia final.',
        diagram: ['SUSTRATO', 'CONTROL DE AIRE/AGUA', 'REFUERZO / AISLAMIENTO', 'CAPAS BASE', 'ACABADO'],
      },
      beforeAfter: {
        eyebrow: 'ANTES Y DESPUÉS',
        title: 'MIRA LA DIFERENCIA',
        subtitle: 'Reparaciones reales. Transformaciones reales.',
        viewAll: 'VER TODAS LAS TRANSFORMACIONES',
      },
      services: {
        eyebrow: 'NUESTROS SERVICIOS',
        title: 'Yeso, Estuco, EIFS e Impermeabilización',
        viewAll: 'Ver Todos los Servicios',
        learnMore: 'Aprender Más',
      },
      featuredProjects: 'PROYECTOS DESTACADOS',
      viewAllProjects: 'Ver Todos los Proyectos',
      viewProject: 'Ver Proyecto',
      photos: 'Fotos',
      videos: 'Videos',
      videosSection: {
        title: 'MIRA NUESTRO TRABAJO EN ACCIÓN',
      },
      whyUs: {
        eyebrow: 'POR QUÉ K&L',
        title: 'Por Qué los Propietarios Eligen K&L',
        items: {
          quality: 'Calidad Artesanal',
          prep: 'Preparación Adecuada de Superficies',
          detail: 'Atención al Detalle',
          comm: 'Comunicación Profesional',
          clean: 'Áreas de Trabajo Limpias',
          results: 'Resultados que se Notan',
        }
      },
      testimonials: 'Lo Que Dicen Nuestros Clientes',
      verifiedClient: 'Cliente Verificado',
      viewGoogleReviews: 'VER NUESTRAS RESEÑAS DE GOOGLE',
      finalCta: {
        title1: '¿LISTO PARA TRANSFORMAR TUS',
        title2: 'PAREDES O TECHOS?',
        subtitle: 'Cuéntanos sobre tu proyecto y envíanos algunas fotos para comenzar.',
        estimate: 'PRESUPUESTO GRATIS',
        call: 'LLAMAR AHORA',
      },
      serviceArea: {
        title: 'Área de Servicio',
        subtitle: 'Sirviendo con orgullo a nuestra comunidad local.',
      }
    },
    common: {
      bookNow: 'Presupuesto',
      getEstimate: 'PRESUPUESTO GRATIS',
      call: 'Llamar',
      callUs: 'Llamar',
      whatsapp: 'WhatsApp',
      getQuote: 'Presupuesto',
      readMore: 'Leer Más',
      loading: 'Cargando...',
      submit: 'Enviar Solicitud',
      speaking: 'Hablamos Español',
      hours: 'Lun-Sáb: 8am-6pm',
      licenseShort: 'Licencia',
      backToTop: 'Volver arriba',
    },
    portfolio: {
      title: 'Proyectos Recientes',
      eyebrow: 'NUESTROS PROYECTOS',
      filterAll: 'Todos',
      filterResidential: 'Residencial',
      filterCommercial: 'Comercial',
      filterInterior: 'Interior',
      loadingPortfolio: 'Cargando portafolio...',
      viewProject: 'Ver Proyecto',
    },
    services: {
      title: 'Servicios de Yeso y Acabados',
      bookService: 'Obtener Presupuesto',
      commonProblems: 'Problemas Comunes',
      benefits: 'Beneficios',
      faq: 'Preguntas Frecuentes',
      relatedProjects: 'Proyectos Relacionados',
      getEstimateCta: '¿Tienes un proyecto similar? Obtén un presupuesto gratis.',
    },
    admin: { title: 'Panel de Administración', login: 'Acceso', projects: 'Proyectos', bookings: 'Reservas', services: 'Servicios' },
    booking: { selectService: 'Seleccionar Servicio', selectDate: 'Seleccionar Fecha y Hora', yourInfo: 'Su Información', confirm: 'Confirmar Reserva' },
    estimate: {
      title: 'Obtener Presupuesto Gratis',
      steps: { service: 'Servicio', location: 'Ubicación', project: 'Proyecto', photos: 'Fotos', contact: 'Contacto' },
      step1Title: '¿En qué podemos ayudarte?',
      step1Sub: 'Selecciona el servicio más cercano a tu proyecto.',
      serviceOther: 'Otro',
      step2Title: '¿Dónde está el proyecto?',
      step2Sub: 'Usaremos esto para confirmar que servimos tu área.',
      zip: 'Código Postal', city: 'Ciudad',
      step3Title: 'Cuéntanos sobre el proyecto',
      step3Sub: 'Cuanto más detalle, más preciso será tu presupuesto.',
      descriptionPlaceholder: 'Describe el problema, tamaño del área, materiales, cronograma...',
      step4Title: 'Muéstranos el problema',
      step4Sub: 'Sube algunas fotos (opcional pero recomendado).',
      addPhotos: 'Agregar Fotos', remove: 'Quitar',
      maxPhotos: `Hasta ${8} fotos, 10MB cada una`,
      uploading: 'Subiendo fotos…',
      step5Title: 'Información de contacto',
      step5Sub: 'Nos comunicaremos para confirmar detalles y programar tu presupuesto.',
      name: 'Nombre Completo', phone: 'Número de Teléfono', email: 'Correo Electrónico',
      preferredContact: 'Método de Contacto Preferido',
      contactOpts: { call: 'Llamada', text: 'Mensaje de Texto', email: 'Correo', whatsapp: 'WhatsApp' },
      bestTime: 'Mejor horario para contactar (opcional)',
      back: 'Atrás', next: 'Siguiente', submit: 'Enviar Solicitud', submitting: 'Enviando…',
      errors: {
        required: 'Este campo es obligatorio',
        invalidEmail: 'Ingresa un correo electrónico válido',
        invalidPhone: 'Ingresa un número de teléfono válido',
        invalidZip: 'Ingresa un código postal válido',
        selectService: 'Por favor selecciona un servicio',
        fileType: 'Tipo de archivo no compatible — usa JPG, PNG, WEBP o HEIC',
        fileSize: 'El archivo es demasiado grande (máx. 10MB)',
        generic: 'Algo salió mal. Por favor intenta de nuevo.',
        network: 'Error de red — verifica tu conexión e intenta de nuevo.',
        spam: 'No se pudo procesar la solicitud. Intenta de nuevo o llámanos directamente.',
      },
      successTitle: 'GRACIAS.',
      successSubtitle: 'HEMOS RECIBIDO TU SOLICITUD DE PROYECTO.',
      successBody: 'Un miembro de K & L Pro-Finish Plastering LLC se pondrá en contacto contigo sobre tu proyecto.',
      reference: 'Número de Referencia',
      returnHome: 'Volver al Inicio',
    },
    contact: {
      title: 'Obtenga un Estimado Gratis',
      subtitle: 'Cuéntenos sobre su proyecto. Respondemos generalmente en 2 horas.',
      phone: 'Teléfono', text: 'Mensaje', whatsapp: 'WhatsApp', email: 'Correo', hours: 'Horario', area: 'Área de Servicio',
      form: {
        name: 'Nombre Completo',
        email: 'Correo Electrónico',
        phone: 'Número de Teléfono',
        zip: 'Código Postal',
        serviceType: 'Servicio Requerido',
        timeline: 'Cronograma',
        timelineOpts: { asap: 'Inmediatamente', month: '1-3 Meses', planning: 'Solo Planificando' },
        preferred: 'Preferencia de Contacto',
        methodOpts: { call: 'Llamada', email: 'Email', text: 'Mensaje de Texto' },
        details: 'Detalles del Proyecto'
      }
    },
    about: {
      title: 'CONSTRUIDO CON HABILIDAD.',
      titleLine2: 'IMPULSADO POR LA CALIDAD.',
      subtitle: 'Construyendo confianza, una pared a la vez.',
      storyTitle: 'Nuestra Historia',
      storyText: 'K&L Pro-Finish Plastering LLC se fundó con una idea simple: entregar trabajos de yeso y acabados que se vean impecables y duren. Desde pequeñas reparaciones hasta restauraciones interiores completas, aportamos artesanía y cuidado a cada proyecto.',
      missionTitle: 'Nuestra Misión',
      missionText: 'Ofrecer un trabajo de yeso y acabados excepcional que supere las expectativas del cliente, con comunicación honesta, sitios de trabajo limpios y resultados de los que nuestros clientes se sientan orgullosos.',
      craftsmanshipTitle: 'Artesanía',
      craftsmanshipText: 'Cada grieta, unión y superficie se trata con la misma atención al detalle, porque la diferencia está en los detalles.',
      teamTitle: 'Nuestro Equipo',
      teamText: 'Un equipo dedicado de profesionales de acabados enfocados en la calidad del trabajo y un servicio confiable.',
      serviceAreaTitle: 'Área de Servicio',
      values: {
        quality: { title: 'Calidad', desc: 'Nunca comprometemos los materiales o la mano de obra.' },
        integrity: { title: 'Integridad', desc: 'Precios honestos, plazos transparentes y sin cargos ocultos.' },
        safety: { title: 'Cuidado', desc: 'Protección cuidadosa de su hogar y pertenencias en cada trabajo.' },
        innovation: { title: 'Artesanía', desc: 'Técnicas probadas combinadas con materiales modernos.' }
      },
      stats: {
        years: 'Confiable',
        projects: 'Completados',
        clients: 'Presupuestos',
        team: 'Estado'
      }
    }
  }
};
