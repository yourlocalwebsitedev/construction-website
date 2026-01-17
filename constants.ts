import { Project, Service, Review, ServiceCategory, Language } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    title: { en: 'Kitchen Remodeling', es: 'Remodelación de Cocinas' },
    description: { 
      en: 'Complete kitchen overhauls including cabinets, countertops, and flooring.',
      es: 'Renovación completa de cocinas incluyendo gabinetes, encimeras y pisos.'
    },
    category: ServiceCategory.RESIDENTIAL,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's2',
    title: { en: 'Commercial Roofing', es: 'Techos Comerciales' },
    description: {
      en: 'High-durability roofing solutions for office buildings and warehouses.',
      es: 'Soluciones de techado de alta durabilidad para edificios de oficinas y almacenes.'
    },
    category: ServiceCategory.COMMERCIAL,
    imageUrl: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's3',
    title: { en: 'Bathroom Renovation', es: 'Renovación de Baños' },
    description: {
      en: 'Modern spa-like bathroom designs and installations.',
      es: 'Diseños e instalaciones de baños modernos tipo spa.'
    },
    category: ServiceCategory.RESIDENTIAL,
    // Updated to a reliable working image
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: { en: 'Sunset Villa Renovation', es: 'Renovación Villa Sunset' },
    description: {
      en: 'A full interior remodel of a 1980s villa.',
      es: 'Una remodelación interior completa de una villa de los años 80.'
    },
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
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
      en: 'Structural reinforcement and facade update.',
      es: 'Refuerzo estructural y actualización de fachada.'
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
    author: 'John Doe',
    rating: 5,
    text: { en: 'Excellent work and professional team!', es: '¡Excelente trabajo y equipo profesional!' },
    date: '2024-12-01'
  },
  {
    id: 'r2',
    author: 'Maria Garcia',
    rating: 5,
    text: { en: 'They transformed our home. Highly recommended.', es: 'Transformaron nuestro hogar. Muy recomendado.' },
    date: '2025-02-14'
  }
];

export const TRANSLATIONS = {
  [Language.EN]: {
    nav: { home: 'Home', services: 'Services', portfolio: 'Portfolio', about: 'About', contact: 'Contact' },
    home: { heroTitle: 'Building Your Dreams', heroSubtitle: 'Professional Construction Services', cta: 'Get a Quote' },
    common: { bookNow: 'Book Now', callUs: 'Call Us', readMore: 'Read More', loading: 'Loading...', submit: 'Submit' },
    admin: { title: 'Admin Dashboard', login: 'Login', projects: 'Projects', bookings: 'Bookings', services: 'Services' },
    booking: { selectService: 'Select Service', selectDate: 'Select Date & Time', yourInfo: 'Your Information', confirm: 'Confirm Booking' },
    about: {
      title: 'About BuildRight',
      subtitle: 'Building Trust Since 2005',
      storyTitle: 'Our Story',
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
    home: { heroTitle: 'Construyendo Sus Sueños', heroSubtitle: 'Servicios Profesionales de Construcción', cta: 'Pedir Presupuesto' },
    common: { bookNow: 'Reservar', callUs: 'Llamar', readMore: 'Leer Más', loading: 'Cargando...', submit: 'Enviar' },
    admin: { title: 'Panel de Administración', login: 'Acceso', projects: 'Proyectos', bookings: 'Reservas', services: 'Servicios' },
    booking: { selectService: 'Seleccionar Servicio', selectDate: 'Seleccionar Fecha y Hora', yourInfo: 'Su Información', confirm: 'Confirmar Reserva' },
    about: {
      title: 'Sobre BuildRight',
      subtitle: 'Construyendo Confianza Desde 2005',
      storyTitle: 'Nuestra Historia',
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