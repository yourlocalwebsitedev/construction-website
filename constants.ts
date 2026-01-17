import { Project, Service, Review, ServiceCategory, Language } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    title: { en: 'Kitchen Remodeling', es: 'Remodelación de Cocinas' },
    description: { 
      en: 'Complete kitchen overhauls including demolition, cabinetry installation, and plumbing.',
      es: 'Renovación completa de cocinas incluyendo demolición, instalación de gabinetes y plomería.'
    },
    category: ServiceCategory.RESIDENTIAL,
    // Shows specific kitchen construction context (unfinished walls, installation)
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's2',
    title: { en: 'Commercial Roofing', es: 'Techos Comerciales' },
    description: {
      en: 'High-durability roofing solutions, waterproofing, and structural repairs.',
      es: 'Soluciones de techado de alta durabilidad, impermeabilización y reparaciones estructurales.'
    },
    category: ServiceCategory.COMMERCIAL,
    imageUrl: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's3',
    title: { en: 'Bathroom Renovation', es: 'Renovación de Baños' },
    description: {
      en: 'Full bathroom demolition, tiling, fixture installation, and modernization.',
      es: 'Demolición completa de baños, alicatado, instalación de accesorios y modernización.'
    },
    category: ServiceCategory.RESIDENTIAL,
    // Kept as the high-quality finished bathroom image as requested
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: { en: 'Sunset Villa Renovation', es: 'Renovación Villa Sunset' },
    description: {
      en: 'A full interior remodel including load-bearing wall removal and foundation reinforcement.',
      es: 'Una remodelación interior completa incluyendo la eliminación de muros de carga y refuerzo de cimientos.'
    },
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    category: ServiceCategory.RESIDENTIAL,
    featured: true,
    completionDate: '2024-11-15'
  },
  {
    id: 'p2',
    title: { en: 'Downtown Office Complex', es: 'Complejo de Oficinas Centro' },
    description: {
      en: 'Structural reinforcement and commercial facade update.',
      es: 'Refuerzo estructural y actualización de fachada comercial.'
    },
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
    category: ServiceCategory.COMMERCIAL,
    featured: true,
    completionDate: '2025-01-20'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Michael Roberts',
    rating: 5,
    text: { en: 'BuildRight handled our permitting and inspections perfectly. The work is solid.', es: 'BuildRight manejó nuestros permisos e inspecciones perfectamente. El trabajo es sólido.' },
    date: '2024-12-01'
  },
  {
    id: 'r2',
    author: 'Maria Garcia',
    rating: 5,
    text: { en: 'Professional team. They finished the framing ahead of schedule. Highly recommended.', es: 'Equipo profesional. Terminaron la estructura antes de lo previsto. Muy recomendado.' },
    date: '2025-02-14'
  }
];

export const TRANSLATIONS = {
  [Language.EN]: {
    nav: { home: 'Home', services: 'Services', portfolio: 'Portfolio', about: 'About', contact: 'Contact' },
    home: { 
      heroTitle: 'Quality Construction You Can Trust', 
      heroSubtitle: 'Licensed & Insured General Contractors serving Lincoln, NE since 2005.', 
      cta: 'Get a Free Quote',
      trust: {
        licensed: 'Licensed & Insured',
        warranty: '5-Year Warranty',
        rating: '4.9/5 Google Rating'
      }
    },
    common: { bookNow: 'Book Now', callUs: 'Call Us', readMore: 'Read More', loading: 'Loading...', submit: 'Send Request' },
    admin: { title: 'Admin Dashboard', login: 'Login', projects: 'Projects', bookings: 'Bookings', services: 'Services' },
    booking: { selectService: 'Select Service', selectDate: 'Select Date & Time', yourInfo: 'Your Information', confirm: 'Confirm Booking' },
    contact: {
      title: 'Get a Free Estimate',
      subtitle: 'Tell us about your project. We typically reply within 2 hours.',
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
      title: 'About BuildRight',
      subtitle: 'Building Trust Since 2005',
      storyTitle: 'Real Experience, Real Results',
      storyText: 'Founded with a vision to provide superior construction services, BuildRight has grown from a small family business to a leading contractor in the region. We pride ourselves on quality craftsmanship, transparent communication, and a dedication to turning our clients\' visions into reality.',
      missionTitle: 'Our Mission',
      missionText: 'To deliver exceptional construction solutions that exceed client expectations while maintaining the highest standards of safety, sustainability, and architectural integrity.',
      values: {
        quality: { title: 'Quality', desc: 'We never compromise on materials or workmanship.' },
        integrity: { title: 'Integrity', desc: 'Honest pricing, transparent timelines, and no hidden fees.' },
        safety: { title: 'Safety', desc: 'Rigorous safety protocols for our team and your property.' },
        innovation: { title: 'Innovation', desc: 'Utilizing modern techniques and sustainable materials.' }
      },
      stats: {
        years: 'Years Exp',
        projects: 'Projects',
        clients: 'Happy Clients',
        team: 'Team Members'
      }
    }
  },
  [Language.ES]: {
    nav: { home: 'Inicio', services: 'Servicios', portfolio: 'Portafolio', about: 'Nosotros', contact: 'Contacto' },
    home: { 
      heroTitle: 'Construcción de Calidad y Confianza', 
      heroSubtitle: 'Contratistas Generales con Licencia y Seguro sirviendo a Lincoln, NE desde 2005.', 
      cta: 'Presupuesto Gratis',
      trust: {
        licensed: 'Licencia y Seguro',
        warranty: 'Garantía de 5 Años',
        rating: 'Calificación 4.9/5'
      }
    },
    common: { bookNow: 'Reservar', callUs: 'Llamar', readMore: 'Leer Más', loading: 'Cargando...', submit: 'Enviar Solicitud' },
    admin: { title: 'Panel de Administración', login: 'Acceso', projects: 'Proyectos', bookings: 'Reservas', services: 'Servicios' },
    booking: { selectService: 'Seleccionar Servicio', selectDate: 'Seleccionar Fecha y Hora', yourInfo: 'Su Información', confirm: 'Confirmar Reserva' },
    contact: {
      title: 'Obtenga un Estimado Gratis',
      subtitle: 'Cuéntenos sobre su proyecto. Respondemos generalmente en 2 horas.',
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
      title: 'Sobre BuildRight',
      subtitle: 'Construyendo Confianza Desde 2005',
      storyTitle: 'Experiencia Real, Resultados Reales',
      storyText: 'Fundada con la visión de proporcionar servicios de construcción superiores, BuildRight ha pasado de ser una pequeña empresa familiar a un contratista líder en la región. Nos enorgullecemos de la artesanía de calidad, la comunicación transparente y la dedicación para convertir las visiones de nuestros clientes en realidad.',
      missionTitle: 'Nuestra Misión',
      missionText: 'Ofrecer soluciones de construcción excepcionales que superen las expectativas del cliente manteniendo los más altos estándares de seguridad, sostenibilidad e integridad arquitectónica.',
      values: {
        quality: { title: 'Calidad', desc: 'Nunca comprometemos los materiales o la mano de obra.' },
        integrity: { title: 'Integridad', desc: 'Precios honestos, plazos transparentes y sin cargos ocultos.' },
        safety: { title: 'Seguridad', desc: 'Protocolos de seguridad rigurosos para nuestro equipo y su propiedad.' },
        innovation: { title: 'Innovación', desc: 'Utilizando técnicas modernas y materiales sostenibles.' }
      },
      stats: {
        years: 'Años Exp',
        projects: 'Proyectos',
        clients: 'Clientes Felices',
        team: 'Miembros'
      }
    }
  }
};