/**
 * Bilingual (EN/ES) dictionaries for the whole user-facing application.
 * Plain data, no framework imports — usable from both server and client code.
 */

export const messages = {
  en: {
    nav: {
      home: 'Home',
      howItWorks: 'How it works',
      team: 'Team',
      login: 'Log in',
      menuLabel: 'Main menu',
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    },
    header: {
      tagline: 'Academic Project Management System'
    },
    footer: {
      brandDescription:
        'Academic Project Management System focused on tracking, organizing, and consulting projects within the institutional environment.',
      contactHeading: 'CONTACT',
      usefulLinksHeading: 'USEFUL LINKS',
      homeLink: 'Home',
      loginLink: 'System login',
      modulesHeading: 'MODULES',
      coordinator: 'Coordinator',
      teacher: 'Teacher',
      student: 'Student'
    },
    home: {
      hero: {
        eyebrow: 'SGPA',
        title: 'Academic Project Management System',
        description:
          'SGPA helps students, teachers, coordinators, and academic teams manage projects and research activities in one place.',
        primaryCta: 'Access the platform',
        secondaryCta: 'How it works'
      },
      features: {
        eyebrow: 'How it works',
        heading: 'What SGPA offers',
        description: 'Core capabilities designed to keep academic project management simple and organized.',
        items: [
          { title: 'Project Management', text: 'Organize and track academic projects.' },
          { title: 'Academic Collaboration', text: 'Connect students, teachers, and coordinators.' },
          { title: 'Progress Tracking', text: 'Monitor project status and development.' },
          { title: 'Research', text: 'Manage research groups and academic initiatives.' }
        ]
      },
      roles: {
        eyebrow: 'Team',
        heading: 'Built for every academic role',
        description: 'Each role has a clear, focused view of the information that matters to them.',
        items: [
          {
            title: 'Students',
            text: 'Browse available projects, track enrollments, and follow academic progress.'
          },
          {
            title: 'Teachers',
            text: 'Guide assigned projects and review student progress and deliverables.'
          },
          {
            title: 'Coordinators',
            text: 'Oversee projects, teams, and academic processes institution-wide.'
          }
        ]
      },
      finalCta: {
        heading: 'Ready to manage your academic projects?',
        button: 'Access SGPA'
      }
    },
    sidebar: {
      mainPanel: 'Main panel',
      availableProjects: 'Available projects',
      myProjects: 'My projects',
      profile: 'Profile',
      projects: 'Projects',
      createProject: 'Create project',
      teachers: 'Teachers',
      students: 'Students',
      createUsers: 'Create users',
      studentModuleLabel: 'Student module',
      teacherModuleLabel: 'Teacher module',
      coordinatorModuleLabel: 'Coordinator module',
      workspaceSection: 'Workspace',
      administrationSection: 'Administration',
      accountSection: 'Account',
      collapseSidebar: 'Collapse sidebar',
      expandSidebar: 'Expand sidebar'
    },
    dashboard: {
      activeRole: 'Active role',
      signedInAs: 'Signed in as',
      quickCards: [
        {
          label: 'Academic management',
          text: 'Organize projects, users, and academic processes from one place.'
        },
        {
          label: 'Visual tracking',
          text: 'Review indicators and reports while keeping a clear system structure.'
        },
        {
          label: 'Role-based access',
          text: 'Each module keeps its own navigation, permissions, and workflow.'
        }
      ],
      stats: {
        heading: 'System overview',
        sampleDataLabel: 'Sample data',
        activeProjects: 'Active Projects',
        pendingProjects: 'Pending Projects',
        completedProjects: 'Completed Projects',
        cancelledProjects: 'Cancelled Projects',
        students: 'Students',
        teachers: 'Teachers',
        researchGroups: 'Research Groups',
        assignedProjects: 'Assigned Projects',
        enrolledProjects: 'Enrolled Projects'
      },
      recentProjects: {
        heading: 'Recent projects',
        project: 'Project',
        owner: 'Owner',
        researchGroup: 'Research Group',
        status: 'Status',
        startDate: 'Start Date',
        action: 'Action',
        unassigned: 'Unassigned',
        emptyMessage: 'No projects to display yet.'
      },
      student: {
        eyebrow: 'Student module',
        title: 'Academic projects overview',
        description:
          'Explore available projects, review your enrollments, and check your personal information within SGPA.'
      },
      teacher: {
        eyebrow: 'Teacher module',
        title: 'Assigned project tracking',
        description:
          'Check academic information, review available projects, and track activity for your assigned projects.'
      },
      coordinator: {
        eyebrow: 'Coordinator module',
        title: 'Academic control panel',
        description:
          'Manage projects, teachers, students, and users from a clear, organized, and institutional interface.'
      }
    },
    session: {
      expiresIn: 'Session expires in {time}',
      accountLabel: 'Account',
      sessionDetails: 'Session details',
      logout: 'Logout',
      loggingOut: 'Signing out...'
    },
    settings: {
      openSettings: 'Settings',
      title: 'Settings',
      languageLabel: 'Language',
      themeLabel: 'Theme',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      accountLabel: 'Account'
    },
    researchGroups: {
      label: 'Research group',
      unknown: 'Unknown research group',
      demoLabel: 'Demo group',
      demoNames: [
        'Cybersecurity and Digital Forensics',
        'Artificial Intelligence and Data Science',
        'Software Engineering Innovation',
        'Networks and Distributed Systems',
        'Information Systems Research'
      ]
    },
    status: {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      other: 'Other'
    },
    reports: {
      back: 'Back',
      downloadPdf: 'Download PDF',
      generatedBy: 'Generated by',
      generatedDate: 'Generated date',
      totalProjects: 'Total projects',
      systemUser: 'System user',
      notDefined: 'Not defined',
      couldNotGenerate: 'Could not generate report.',
      noProjectsTitle: 'No projects to report',
      noProjectsDescription: 'There are no projects available for this report.',
      projectId: 'Project ID',
      startDate: 'Start date',
      endDate: 'End date',
      assignedTeacher: 'Assigned teacher',
      unassigned: 'Unassigned',
      participants: 'Participants',
      teacherLabel: 'Teacher:',
      noTeacherAssigned: 'No teacher assigned',
      studentsLabel: 'Students:',
      noStudentsEnrolled: 'No students enrolled.',
      footerNote: 'This report was generated automatically by the Academic Project Management System.',
      totalRecords: 'Total records',
      userId: 'User ID',
      type: 'Type',
      projects: 'Projects',
      noUsersFound: 'No users found.',
      noRecordsAvailable: 'There are no records available for this report.',
      noRelatedProjects: 'No related projects registered.',
      relationDate: 'Relation date',
      projectDatesLabel: 'Project dates'
    },
    confirmModal: {
      defaultTitle: 'Confirm action',
      defaultMessage: 'Are you sure you want to continue?',
      confirm: 'Confirm',
      cancel: 'Cancel',
      processing: 'Processing...',
      closeModal: 'Close modal',
      eyebrowDanger: 'Critical confirmation',
      eyebrowSuccess: 'Enrollment confirmation',
      eyebrowWarning: 'Confirmation required',
      eyebrowInfo: 'Action confirmation'
    },
    pages: {
      coordinatorStudents: {
        heading: 'Student report',
        description: 'Generate a PDF report with students, account status, semester, and enrolled projects.',
        pdfReport: 'PDF report',
        tableSubtitle: 'View, search, enable, and disable student accounts registered in SGPA.',
        searchPlaceholder: 'Search student by name, email, phone, ID, or status...',
        emptyMessage: 'No students to display.'
      },
      coordinatorTeachers: {
        heading: 'Teacher report',
        description: 'Generate a PDF report with teachers, account status, and assigned projects.',
        pdfReport: 'PDF report',
        tableSubtitle: 'View, search, enable, and disable teacher accounts registered in SGPA.',
        searchPlaceholder: 'Search teacher by name, email, phone, ID, or status...',
        emptyMessage: 'No teachers to display.'
      },
      coordinatorProjects: {
        heading: 'Project list',
        description: 'Review registered projects, their status, and assigned teacher.',
        recordsSuffix: 'records',
        createProject: 'Create project',
        searchPlaceholder: 'Search project by name, teacher, or status...',
        emptyMessage: 'No projects to display.',
        managementHeading: 'Project management',
        managementDescription: 'View, manage, create academic projects, and generate project reports.',
        pdfReport: 'PDF report',
        addProject: 'Add project',
        totalProjects: 'Total projects',
        visibleRecords: 'Visible records'
      },
      createUsers: {
        heading: 'Create user',
        description: 'Register students and teachers within SGPA while keeping the information organized for academic management.',
        userManagement: 'User management',
        formHeading: 'Registration form',
        formDescription: 'Fill in the basic information for the user to be created.',
        firstNames: 'First names',
        firstNamePlaceholder: 'Example: Alexander',
        lastNames: 'Last names',
        lastNamePlaceholder: 'Example: Gomez',
        emailAddress: 'Email address',
        emailPlaceholder: 'Example: user@email.com',
        phonePlaceholder: 'Example: 3001234567',
        passwordPlaceholder: 'Enter a password',
        userType: 'User type',
        selectRole: 'Select a role',
        activeUser: 'Active user',
        activeUserHint: 'Allows the user to appear enabled within the system.',
        clearForm: 'Clear form',
        createUser: 'Create user'
      },
      createProject: {
        heading: 'Create project',
        description: 'Register a new academic project and assign the responsible teacher from the initial system form.',
        backToProjects: 'Back to projects'
      },
      profile: {
        heading: 'Profile',
        description: 'Your personal and academic information within SGPA.',
        institutionalProfile: 'Institutional profile',
        contactAndAccess: 'Contact and access',
        identification: 'Identification',
        institutionalEmail: 'Institutional email',
        contactPhone: 'Contact phone',
        accountStatus: 'Account status',
        assignedRole: 'Assigned role',
        notRegistered: 'Not registered',
        roleStudent: 'Student',
        roleTeacher: 'Teacher',
        roleCoordinator: 'Coordinator',
        roleUser: 'User',
        labelUndergraduate: 'Undergraduate',
        labelTeacher: 'Teacher / Researcher',
        labelCoordinator: 'Academic Management',
        labelSystem: 'System'
      },
      studentProfile: {
        heading: 'Student profile',
        description: 'Check your personal information, assigned role, and account status within the system.'
      },
      teacherProfile: {
        heading: 'Teacher profile',
        description: 'Check your personal information, assigned role, and account status within the system.'
      },
      myProjects: {
        heading: 'My projects',
        emptyMessage: 'No projects to display.'
      },
      availableProjects: {
        heading: 'Available projects',
        emptyMessage: 'No projects to display.'
      },
      teacherProjects: {
        heading: 'Available projects',
        description: 'View registered academic projects and generate a project report.',
        pdfReport: 'PDF report',
        headerLabel: 'Teacher',
        emptyMessage: 'No projects to display.',
        searchPlaceholder: 'Search project by name, teacher, or status...'
      },
      teacherMyProjects: {
        heading: 'Assigned projects',
        description: 'View the academic projects assigned to your teacher profile and generate a report.',
        pdfReport: 'PDF report',
        headerLabel: 'Assignments',
        emptyMessage: 'No assigned projects to display.',
        searchPlaceholder: 'Search assigned project...'
      },
      studentProjects: {
        heading: 'Available projects',
        description: 'View available academic projects, enroll when applicable, and generate a report.',
        pdfReport: 'PDF report',
        headerLabel: 'Student',
        emptyMessage: 'No projects to display.',
        searchPlaceholder: 'Search project by name, teacher, or status...'
      },
      studentMyProjects: {
        heading: 'My projects',
        description: 'View your enrolled academic projects and generate a personal project report.',
        pdfReport: 'PDF report',
        headerLabel: 'Enrolled projects',
        emptyMessage: 'You do not have enrolled projects yet.',
        searchPlaceholder: 'Search enrolled project...'
      }
    },
    ui: {
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      viewProject: 'View project',
      enable: 'Enable',
      disable: 'Disable',
      back: 'Back',
      search: 'Search...',
      loading: 'Loading...',
      processing: 'Processing...',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      role: 'Role',
      status: 'Status',
      description: 'Description',
      yes: 'Yes',
      no: 'No',
      noData: 'No data to display.',
      recordsPerPage: '{select} records per page',
      noRecordsFound: 'No records found',
      showingRecords: 'Showing {start} to {end} of {rows} records',
      sampleData: 'Sample data',
      demo: 'Demo',
      list: 'List',
      records: 'records',
      noResults: 'No results',
      showingOfRecords: 'Showing {shown} of {total} records',
      previous: 'Previous',
      next: 'Next',
      pageOf: 'Page {current} of {total}',
      users: 'Users',
      total: 'total',
      active: 'active',
      activeStatus: 'Active',
      inactive: 'Inactive',
      unnamedUser: 'Unnamed user',
      noEmailRegistered: 'No email registered',
      notRegistered: 'Not registered',
      noRecordsMatch: 'No records match your current search.',
      showingOfRange: 'Showing {start}-{end} of {total}',
      enableUser: 'Enable user',
      disableUser: 'Disable user',
      enableQuestion: 'Enable {type}?',
      disableQuestion: 'Disable {type}?',
      enableUserMessage: 'This user will regain access to the SGPA platform.',
      disableUserMessage: 'This user will lose access to the SGPA platform until enabled again.'
    },
    login: {
      cardTitle: 'Access your account',
      cardSubtitle: 'Enter your credentials and choose the role that matches your account.',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      roleTitle: 'Select your role',
      roleStudent: 'Student',
      roleTeacher: 'Teacher',
      roleCoordinator: 'Coordinator',
      submit: 'Log in',
      submitting: 'Signing in...'
    },
    errors: {
      invalidCredentials: 'Unable to sign in with the credentials provided.',
      roleMismatch: 'This account is not authorized for the selected role.',
      serviceUnavailable: 'The service is temporarily unavailable. Please try again shortly.',
      forbidden: 'You do not have permission to access the system.',
      missingFields: 'Enter your email and password.',
      missingRole: 'Select a valid role.',
      missingRoleInfo: 'Could not determine your account role. Please contact support.',
      sessionSaveFailed: 'Could not save the session. Please try again.',
      genericFailure: 'Could not complete login. Please try again.'
    },
    notices: {
      sessionExpired: 'Your session expired. Please log in again.',
      forbiddenModule: 'You do not have permission to access that module.',
      loggedOut: 'Session closed successfully.'
    },
    common: {
      switchToSpanish: 'Switch to Spanish',
      switchToEnglish: 'Switch to English'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      howItWorks: 'Cómo funciona',
      team: 'Equipo',
      login: 'Iniciar sesión',
      menuLabel: 'Menú principal',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú'
    },
    header: {
      tagline: 'Sistema de Gestión de Proyectos Académicos'
    },
    footer: {
      brandDescription:
        'Sistema de Gestión de Proyectos Académicos enfocado en el seguimiento, la organización y la consulta de proyectos dentro del entorno institucional.',
      contactHeading: 'CONTACTO',
      usefulLinksHeading: 'ENLACES ÚTILES',
      homeLink: 'Inicio',
      loginLink: 'Acceso al sistema',
      modulesHeading: 'MÓDULOS',
      coordinator: 'Coordinador',
      teacher: 'Docente',
      student: 'Estudiante'
    },
    home: {
      hero: {
        eyebrow: 'SGPA',
        title: 'Sistema de Gestión de Proyectos Académicos',
        description:
          'SGPA ayuda a estudiantes, docentes, coordinadores y equipos académicos a gestionar proyectos y actividades de investigación en un solo lugar.',
        primaryCta: 'Acceder a la plataforma',
        secondaryCta: 'Cómo funciona'
      },
      features: {
        eyebrow: 'Cómo funciona',
        heading: 'Qué ofrece SGPA',
        description: 'Capacidades esenciales diseñadas para mantener la gestión de proyectos académicos simple y organizada.',
        items: [
          { title: 'Gestión de proyectos', text: 'Organiza y da seguimiento a los proyectos académicos.' },
          { title: 'Colaboración académica', text: 'Conecta a estudiantes, docentes y coordinadores.' },
          { title: 'Seguimiento de avance', text: 'Supervisa el estado y el desarrollo de los proyectos.' },
          { title: 'Investigación', text: 'Administra semilleros de investigación e iniciativas académicas.' }
        ]
      },
      roles: {
        eyebrow: 'Equipo',
        heading: 'Diseñado para cada rol académico',
        description: 'Cada rol cuenta con una vista clara y enfocada de la información que le corresponde.',
        items: [
          {
            title: 'Estudiantes',
            text: 'Explora los proyectos disponibles, da seguimiento a tus inscripciones y consulta tu avance académico.'
          },
          {
            title: 'Docentes',
            text: 'Orienta los proyectos asignados y revisa el avance y los entregables de los estudiantes.'
          },
          {
            title: 'Coordinadores',
            text: 'Supervisa proyectos, equipos y procesos académicos en toda la institución.'
          }
        ]
      },
      finalCta: {
        heading: '¿Listo para gestionar tus proyectos académicos?',
        button: 'Acceder a SGPA'
      }
    },
    sidebar: {
      mainPanel: 'Panel principal',
      availableProjects: 'Proyectos disponibles',
      myProjects: 'Mis proyectos',
      profile: 'Perfil',
      projects: 'Proyectos',
      createProject: 'Crear proyecto',
      teachers: 'Docentes',
      students: 'Estudiantes',
      createUsers: 'Crear usuarios',
      studentModuleLabel: 'Módulo de estudiante',
      teacherModuleLabel: 'Módulo docente',
      coordinatorModuleLabel: 'Módulo de coordinación',
      workspaceSection: 'Espacio de trabajo',
      administrationSection: 'Administración',
      accountSection: 'Cuenta',
      collapseSidebar: 'Contraer panel',
      expandSidebar: 'Expandir panel'
    },
    dashboard: {
      activeRole: 'Rol activo',
      signedInAs: 'Sesión iniciada como',
      quickCards: [
        {
          label: 'Gestión académica',
          text: 'Organiza proyectos, usuarios y procesos académicos desde un solo lugar.'
        },
        {
          label: 'Seguimiento visual',
          text: 'Consulta indicadores e informes manteniendo una estructura clara del sistema.'
        },
        {
          label: 'Acceso por roles',
          text: 'Cada módulo conserva su propia navegación, permisos y flujo de trabajo.'
        }
      ],
      stats: {
        heading: 'Resumen del sistema',
        sampleDataLabel: 'Datos de muestra',
        activeProjects: 'Proyectos activos',
        pendingProjects: 'Proyectos pendientes',
        completedProjects: 'Proyectos completados',
        cancelledProjects: 'Proyectos cancelados',
        students: 'Estudiantes',
        teachers: 'Docentes',
        researchGroups: 'Semilleros de investigación',
        assignedProjects: 'Proyectos asignados',
        enrolledProjects: 'Proyectos inscritos'
      },
      recentProjects: {
        heading: 'Proyectos recientes',
        project: 'Proyecto',
        owner: 'Responsable',
        researchGroup: 'Semillero',
        status: 'Estado',
        startDate: 'Fecha de inicio',
        action: 'Acción',
        unassigned: 'Sin asignar',
        emptyMessage: 'Aún no hay proyectos para mostrar.'
      },
      student: {
        eyebrow: 'Módulo de estudiante',
        title: 'Resumen de proyectos académicos',
        description:
          'Explora los proyectos disponibles, revisa tus inscripciones y consulta tu información personal en SGPA.'
      },
      teacher: {
        eyebrow: 'Módulo docente',
        title: 'Seguimiento de proyectos asignados',
        description:
          'Consulta tu información académica, revisa los proyectos disponibles y da seguimiento a la actividad de tus proyectos asignados.'
      },
      coordinator: {
        eyebrow: 'Módulo de coordinación',
        title: 'Panel de control académico',
        description:
          'Administra proyectos, docentes, estudiantes y usuarios desde una interfaz clara, organizada e institucional.'
      }
    },
    session: {
      expiresIn: 'La sesión finaliza en {time}',
      accountLabel: 'Cuenta',
      sessionDetails: 'Detalles de la sesión',
      logout: 'Cerrar sesión',
      loggingOut: 'Cerrando sesión...'
    },
    settings: {
      openSettings: 'Configuración',
      title: 'Configuración',
      languageLabel: 'Idioma',
      themeLabel: 'Tema',
      lightMode: 'Modo claro',
      darkMode: 'Modo oscuro',
      accountLabel: 'Cuenta'
    },
    researchGroups: {
      label: 'Semillero de investigación',
      unknown: 'Semillero de investigación desconocido',
      demoLabel: 'Semillero de muestra',
      demoNames: [
        'Ciberseguridad y Forense Digital',
        'Inteligencia Artificial y Ciencia de Datos',
        'Innovación en Ingeniería de Software',
        'Redes y Sistemas Distribuidos',
        'Investigación en Sistemas de Información'
      ]
    },
    status: {
      active: 'Activo',
      pending: 'Pendiente',
      completed: 'Completado',
      cancelled: 'Cancelado',
      other: 'Otro'
    },
    reports: {
      back: 'Volver',
      downloadPdf: 'Descargar PDF',
      generatedBy: 'Generado por',
      generatedDate: 'Fecha de generación',
      totalProjects: 'Total de proyectos',
      systemUser: 'Usuario del sistema',
      notDefined: 'No definido',
      couldNotGenerate: 'No fue posible generar el informe.',
      noProjectsTitle: 'No hay proyectos para informar',
      noProjectsDescription: 'No hay proyectos disponibles para este informe.',
      projectId: 'ID del proyecto',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de finalización',
      assignedTeacher: 'Docente asignado',
      unassigned: 'Sin asignar',
      participants: 'Participantes',
      teacherLabel: 'Docente:',
      noTeacherAssigned: 'Sin docente asignado',
      studentsLabel: 'Estudiantes:',
      noStudentsEnrolled: 'No hay estudiantes inscritos.',
      footerNote: 'Este informe fue generado automáticamente por el Sistema de Gestión de Proyectos Académicos.',
      totalRecords: 'Total de registros',
      userId: 'ID de usuario',
      type: 'Tipo',
      projects: 'Proyectos',
      noUsersFound: 'No se encontraron usuarios.',
      noRecordsAvailable: 'No hay registros disponibles para este informe.',
      noRelatedProjects: 'No hay proyectos relacionados registrados.',
      relationDate: 'Fecha de relación',
      projectDatesLabel: 'Fechas del proyecto'
    },
    confirmModal: {
      defaultTitle: 'Confirmar acción',
      defaultMessage: '¿Estás seguro de que deseas continuar?',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      processing: 'Procesando...',
      closeModal: 'Cerrar ventana',
      eyebrowDanger: 'Confirmación crítica',
      eyebrowSuccess: 'Confirmación de inscripción',
      eyebrowWarning: 'Confirmación requerida',
      eyebrowInfo: 'Confirmación de acción'
    },
    pages: {
      coordinatorStudents: {
        heading: 'Informe de estudiantes',
        description: 'Genera un informe PDF con los estudiantes, el estado de la cuenta, el semestre y los proyectos inscritos.',
        pdfReport: 'Informe en PDF',
        tableSubtitle: 'Consulta, busca, habilita y deshabilita las cuentas de estudiantes registradas en SGPA.',
        searchPlaceholder: 'Buscar estudiante por nombre, correo, teléfono o estado...',
        emptyMessage: 'No hay estudiantes para mostrar.'
      },
      coordinatorTeachers: {
        heading: 'Informe de docentes',
        description: 'Genera un informe PDF con los docentes, el estado de la cuenta y los proyectos asignados.',
        pdfReport: 'Informe en PDF',
        tableSubtitle: 'Consulta, busca, habilita y deshabilita las cuentas de docentes registradas en SGPA.',
        searchPlaceholder: 'Buscar docente por nombre, correo, teléfono o estado...',
        emptyMessage: 'No hay docentes para mostrar.'
      },
      coordinatorProjects: {
        heading: 'Lista de proyectos',
        description: 'Consulta los proyectos registrados, su estado y el docente asignado.',
        recordsSuffix: 'registros',
        createProject: 'Crear proyecto',
        searchPlaceholder: 'Buscar proyecto por nombre, docente o estado...',
        emptyMessage: 'No hay proyectos para mostrar.',
        managementHeading: 'Gestión de proyectos',
        managementDescription: 'Consulta, gestiona y crea proyectos académicos, y genera informes de proyectos.',
        pdfReport: 'Informe en PDF',
        addProject: 'Agregar proyecto',
        totalProjects: 'Total de proyectos',
        visibleRecords: 'Registros visibles'
      },
      createUsers: {
        heading: 'Crear usuario',
        description: 'Registra estudiantes y docentes en SGPA manteniendo la información organizada para la gestión académica.',
        userManagement: 'Gestión de usuarios',
        formHeading: 'Formulario de registro',
        formDescription: 'Completa la información básica del usuario que deseas crear.',
        firstNames: 'Nombres',
        firstNamePlaceholder: 'Ejemplo: Alejandro',
        lastNames: 'Apellidos',
        lastNamePlaceholder: 'Ejemplo: Gómez',
        emailAddress: 'Correo electrónico',
        emailPlaceholder: 'Ejemplo: usuario@correo.com',
        phonePlaceholder: 'Ejemplo: 3001234567',
        passwordPlaceholder: 'Ingresa una contraseña',
        userType: 'Tipo de usuario',
        selectRole: 'Selecciona un rol',
        activeUser: 'Usuario activo',
        activeUserHint: 'Permite que el usuario aparezca habilitado dentro del sistema.',
        clearForm: 'Limpiar formulario',
        createUser: 'Crear usuario'
      },
      createProject: {
        heading: 'Crear proyecto',
        description: 'Registra un nuevo proyecto académico y asigna al docente responsable desde el formulario inicial del sistema.',
        backToProjects: 'Volver a proyectos'
      },
      profile: {
        heading: 'Perfil',
        description: 'Tu información personal y académica dentro de SGPA.',
        institutionalProfile: 'Perfil institucional',
        contactAndAccess: 'Contacto y acceso',
        identification: 'Identificación',
        institutionalEmail: 'Correo institucional',
        contactPhone: 'Teléfono de contacto',
        accountStatus: 'Estado de la cuenta',
        assignedRole: 'Rol asignado',
        notRegistered: 'No registrado',
        roleStudent: 'Estudiante',
        roleTeacher: 'Docente',
        roleCoordinator: 'Coordinador',
        roleUser: 'Usuario',
        labelUndergraduate: 'Pregrado',
        labelTeacher: 'Docente / Investigador',
        labelCoordinator: 'Gestión Académica',
        labelSystem: 'Sistema'
      },
      studentProfile: {
        heading: 'Perfil del estudiante',
        description: 'Consulta tu información personal, el rol asignado y el estado de tu cuenta en el sistema.'
      },
      teacherProfile: {
        heading: 'Perfil del docente',
        description: 'Consulta tu información personal, el rol asignado y el estado de tu cuenta en el sistema.'
      },
      myProjects: {
        heading: 'Mis proyectos',
        emptyMessage: 'No hay proyectos para mostrar.'
      },
      availableProjects: {
        heading: 'Proyectos disponibles',
        emptyMessage: 'No hay proyectos para mostrar.'
      },
      teacherProjects: {
        heading: 'Proyectos disponibles',
        description: 'Consulta los proyectos académicos registrados y genera un informe de proyectos.',
        pdfReport: 'Informe en PDF',
        headerLabel: 'Docente',
        emptyMessage: 'No hay proyectos para mostrar.',
        searchPlaceholder: 'Buscar proyecto por nombre, docente o estado...'
      },
      teacherMyProjects: {
        heading: 'Proyectos asignados',
        description: 'Consulta los proyectos académicos asignados a tu perfil docente y genera un informe.',
        pdfReport: 'Informe en PDF',
        headerLabel: 'Asignaciones',
        emptyMessage: 'No hay proyectos asignados para mostrar.',
        searchPlaceholder: 'Buscar proyecto asignado...'
      },
      studentProjects: {
        heading: 'Proyectos disponibles',
        description: 'Consulta los proyectos académicos disponibles, inscríbete cuando corresponda y genera un informe.',
        pdfReport: 'Informe en PDF',
        headerLabel: 'Estudiante',
        emptyMessage: 'No hay proyectos para mostrar.',
        searchPlaceholder: 'Buscar proyecto por nombre, docente o estado...'
      },
      studentMyProjects: {
        heading: 'Mis proyectos',
        description: 'Consulta los proyectos académicos en los que estás inscrito y genera un informe personal.',
        pdfReport: 'Informe en PDF',
        headerLabel: 'Proyectos inscritos',
        emptyMessage: 'Aún no tienes proyectos inscritos.',
        searchPlaceholder: 'Buscar proyecto inscrito...'
      }
    },
    ui: {
      actions: 'Acciones',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      close: 'Cerrar',
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver',
      viewProject: 'Ver proyecto',
      enable: 'Habilitar',
      disable: 'Deshabilitar',
      back: 'Volver',
      search: 'Buscar...',
      loading: 'Cargando...',
      processing: 'Procesando...',
      name: 'Nombre',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      role: 'Rol',
      status: 'Estado',
      description: 'Descripción',
      yes: 'Sí',
      no: 'No',
      noData: 'No hay datos para mostrar.',
      recordsPerPage: '{select} registros por página',
      noRecordsFound: 'No se encontraron registros',
      showingRecords: 'Mostrando {start} a {end} de {rows} registros',
      sampleData: 'Datos de muestra',
      demo: 'Demostración',
      list: 'Lista',
      records: 'registros',
      noResults: 'Sin resultados',
      showingOfRecords: 'Mostrando {shown} de {total} registros',
      previous: 'Anterior',
      next: 'Siguiente',
      pageOf: 'Página {current} de {total}',
      users: 'Usuarios',
      total: 'total',
      active: 'activos',
      activeStatus: 'Activo',
      inactive: 'Inactivo',
      unnamedUser: 'Usuario sin nombre',
      noEmailRegistered: 'Sin correo registrado',
      notRegistered: 'No registrado',
      noRecordsMatch: 'Ningún registro coincide con tu búsqueda actual.',
      showingOfRange: 'Mostrando {start}-{end} de {total}',
      enableUser: 'Habilitar usuario',
      disableUser: 'Deshabilitar usuario',
      enableQuestion: '¿Habilitar {type}?',
      disableQuestion: '¿Deshabilitar {type}?',
      enableUserMessage: 'Este usuario recuperará el acceso a la plataforma SGPA.',
      disableUserMessage: 'Este usuario perderá el acceso a la plataforma SGPA hasta que se vuelva a habilitar.'
    },
    login: {
      cardTitle: 'Accede a tu cuenta',
      cardSubtitle: 'Ingresa tus credenciales y elige el rol correspondiente a tu cuenta.',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Ingresa tu contraseña',
      roleTitle: 'Selecciona tu rol',
      roleStudent: 'Estudiante',
      roleTeacher: 'Docente',
      roleCoordinator: 'Coordinador',
      submit: 'Iniciar sesión',
      submitting: 'Iniciando sesión...'
    },
    errors: {
      invalidCredentials: 'No fue posible iniciar sesión con las credenciales proporcionadas.',
      roleMismatch: 'Esta cuenta no está autorizada para el rol seleccionado.',
      serviceUnavailable:
        'El servicio no está disponible temporalmente. Inténtalo nuevamente en unos momentos.',
      forbidden: 'No tienes permisos para acceder al sistema.',
      missingFields: 'Ingresa tu correo electrónico y tu contraseña.',
      missingRole: 'Selecciona un rol válido.',
      missingRoleInfo: 'No fue posible determinar el rol de tu cuenta. Contacta a soporte.',
      sessionSaveFailed: 'No fue posible guardar la sesión. Inténtalo nuevamente.',
      genericFailure: 'No fue posible completar el inicio de sesión. Inténtalo nuevamente.'
    },
    notices: {
      sessionExpired: 'Tu sesión expiró. Inicia sesión nuevamente.',
      forbiddenModule: 'No tienes permiso para acceder a ese módulo.',
      loggedOut: 'Sesión cerrada correctamente.'
    },
    common: {
      switchToSpanish: 'Cambiar a español',
      switchToEnglish: 'Cambiar a inglés'
    }
  }
};
