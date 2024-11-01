import { useTranslation } from "../hooks/useTranslation"

export default function useModulo() {
  const { t } = useTranslation()

  const modulosAppAdmin = [
    {
      label: t('nav_menu.home'),
      url: '/',
      nombre: 'inicio',
      subModulo: [
        {
          label: t('nav_menu.home'),
          nombre: 'home',
          url: '/t2parkingcities/home',
          id: '',
          descripcion: '',
          icono: 'home',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
        {
          label: t('nav_menu.stats'),
          nombre: 'stats',
          url: '/t2parkingcities/stats',
          id: '',
          descripcion: '',
          icono: 'query_stats',
          propiedades: {orden: 2},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 1}
    },
    {
      label: t('nav_menu.parking_areas'),
      url: 'parking-areas',
      nombre: 'parking_areas',
      subModulo: [
        {
          label: t('parking_areas.all'),
          nombre: 'all_parking_areas',
          url: '/t2parkingcities/parking-areas',
          id: '',
          descripcion: '',
          icono: 'local_parking',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
        {
          label: t('parking_areas.areas'),
          nombre: 'areas',
          url: '/t2parkingcities/parking-areas/areas',
          id: '',
          descripcion: '',
          icono: 'crop',
          propiedades: {orden: 2},
          estado: '',
          subModulo: []
        },
        {
          label: t('parking_areas.schedules'),
          nombre: 'schedules',
          url: '/t2parkingcities/parking-areas/schedules',
          id: '',
          descripcion: '',
          icono: 'schedule',
          propiedades: {orden: 3},
          estado: '',
          subModulo: []
        },
        {
          label: t('parking_areas.subscriptions'),
          nombre: 'subscriptions',
          url: '/t2parkingcities/parking-areas/subscriptions',
          id: '',
          descripcion: '',
          icono: 'card_membership',
          propiedades: {orden: 4},
          estado: '',
          subModulo: []
        },
        {
          label: t('nav_menu.vehicles'),
          nombre: 'vehicles',
          url: '/t2parkingcities/parking-areas/vehicles',
          id: '',
          descripcion: '',
          icono: 'no_crash',
          propiedades: {orden: 5},
          estado: '',
          subModulo: []
        }
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 2}
    },
    {
      label: t('nav_menu.users'),
      url: 'users',
      nombre: 'users',
      subModulo: [
        {
          label: t('users.users'),
          nombre: 'all_users',
          url: '/t2parkingcities/users',
          id: '',
          descripcion: '',
          icono: 'group',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
        {
          label: t('inspectors.inspectors'),
          nombre: 'inspectores',
          url: '/t2parkingcities/users/inspectors',
          id: '',
          descripcion: '',
          icono: 'interpreter_mode',
          propiedades: {orden: 2},
          estado: '',
          subModulo: []
        },
        {
          label: t('inspectors.events.history'),
          nombre: 'inspector_history',
          url: '/t2parkingcities/users/inspectors-history',
          id: '',
          descripcion: '',
          icono: 'manage_search',
          propiedades: {orden: 3},
          estado: '',
          subModulo: []
        },
        {
          label: t('inspectors.tracking'),
          nombre: 'tranking_inspectors',
          url: '/t2parkingcities/users/inspectors-tracking',
          id: '',
          descripcion: '',
          icono: 'analytics',
          propiedades: {orden: 3},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 3}
    },
    {
      label: t('nav_menu.third_party_company'),
      url: 'distributors',
      nombre: 'districutors',
      subModulo: [
        {
          label: t('third_party_company.companies'),
          nombre: 'all_distributors',
          url: '/t2parkingcities/distributors',
          id: '',
          descripcion: '',
          icono: 'local_activity',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 4}
    }
  ]

  const modulosAppDistributor = [
    {
      label: 'Inicio',
      url: '/',
      nombre: 'inicio',
      subModulo: [
        {
          label: 'Home',
          nombre: 'home',
          url: '/t2parkingcities/home',
          id: '',
          descripcion: '',
          icono: 'home',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 1}
    },
    {
      label: 'Distributors',
      url: 'distributors',
      nombre: 'districutors',
      subModulo: [
        {
          label: 'Tickets',
          nombre: 'tickets',
          url: '/t2parkingcities/distributors/tickets',
          id: '',
          descripcion: '',
          icono: 'local_activity',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 1}
    }
  ]

  const modulosAppUser = [
    {
      label: 'Inicio',
      url: '/',
      nombre: 'inicio',
      subModulo: [
        {
          label: 'Home',
          nombre: 'home',
          url: '/t2parkingcities/home',
          id: '',
          descripcion: '',
          icono: 'home',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
        {
          label: 'Stats',
          nombre: 'stats',
          url: '/t2parkingcities/stats',
          id: '',
          descripcion: '',
          icono: 'query_stats',
          propiedades: {orden: 2},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 1}
    },
    {
      label: 'Areas de Parqueo',
      url: 'parking-areas',
      nombre: 'parking_areas',
      subModulo: [
        {
          label: 'Todas',
          nombre: 'all_parking_areas',
          url: '/t2parkingcities/parking-areas',
          id: '',
          descripcion: '',
          icono: 'local_parking',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
        {
          label: 'Zonas',
          nombre: 'areas',
          url: '/t2parkingcities/parking-areas/areas',
          id: '',
          descripcion: '',
          icono: 'crop',
          propiedades: {orden: 2},
          estado: '',
          subModulo: []
        },
        {
          label: 'Horarios',
          nombre: 'schedules',
          url: '/t2parkingcities/parking-areas/schedules',
          id: '',
          descripcion: '',
          icono: 'schedule',
          propiedades: {orden: 3},
          estado: '',
          subModulo: []
        },
        {
          label: 'Abonos',
          nombre: 'subscriptions',
          url: '/t2parkingcities/parking-areas/subscriptions',
          id: '',
          descripcion: '',
          icono: 'card_membership',
          propiedades: {orden: 4},
          estado: '',
          subModulo: []
        },
        {
          label: 'Vehiculos',
          nombre: 'vehicles',
          url: '/t2parkingcities/parking-areas/vehicles',
          id: '',
          descripcion: '',
          icono: 'no_crash',
          propiedades: {orden: 5},
          estado: '',
          subModulo: []
        }
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 2}
    },
  ]

  const modulosAppInspector = [
    {
      label: t('nav_menu.home'),
      url: '/',
      nombre: 'inicio',
      subModulo: [
        {
          label: t('nav_menu.home'),
          nombre: 'home',
          url: '/t2parkingcities/home',
          id: '',
          descripcion: '',
          icono: 'home',
          propiedades: {orden: 1},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 1}
    },
    {
      label: t('nav_menu.users'),
      url: 'users',
      nombre: 'users',
      subModulo: [
        {
          label: t('inspectors.events.history'),
          nombre: 'inspector_history',
          url: '/t2parkingcities/users/inspectors-history',
          id: '',
          descripcion: '',
          icono: 'manage_search',
          propiedades: {orden: 3},
          estado: '',
          subModulo: []
        },
      ],
      descripcion: '',
      estado: '',
      icono: '',
      id: '',
      open: true,
      showed: true,
      propiedades: {orden: 3}
    },
  ]

  return { modulosAppAdmin, modulosAppDistributor, modulosAppUser, modulosAppInspector }
}
