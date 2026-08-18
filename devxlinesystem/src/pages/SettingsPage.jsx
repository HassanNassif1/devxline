import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';
import usersAPI from '../api/users';
import { clientsApi } from '../api/clientsApi';
import RolesAPI from '../api/roles';

// Translation object for all supported languages
const translations = {
  en: {
    // General
    settings: 'Settings',
    manageSettings: 'Manage your application settings',
    general: 'General',
    appearance: 'Appearance',
    security: 'Security',
    notifications: 'Notifications',
    language: 'Language',
    users: 'Users',
    roles: 'Roles',
    companyInformation: 'Company Information',
    updateCompanyDetails: 'Update your company details',
    companyName: 'Company Name',
    industry: 'Industry',
    description: 'Description',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    saveChanges: 'Save Changes',
    companySettingsUpdated: 'Company settings updated successfully',
    failedToSaveCompany: 'Failed to save company settings',

    // Appearance
    appearanceSettings: 'Appearance Settings',
    customizeAppearance: 'Customize how the application looks',
    theme: 'Theme',
    switchTheme: 'Switch between light and dark mode',
    light: 'Light',
    dark: 'Dark',
    fontSize: 'Font Size',
    adjustFontSize: 'Adjust the text size throughout the application',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    animations: 'Animations',
    enableDisableAnimations: 'Enable or disable UI animations',
    appearanceUpdated: 'Appearance settings updated',

    // Security
    securitySettings: 'Security Settings',
    manageSecurity: 'Manage your security preferences',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorDesc: 'Add an extra layer of security to your account',
    sessionTimeout: 'Session Timeout',
    sessionTimeoutDesc: 'Automatically log out after inactivity',
    minutes: 'minutes',
    hour: 'hour',
    hours: 'hours',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    passwordChanged: 'Password changed successfully',
    passwordMismatch: 'Passwords do not match',
    passwordMinLength: 'Password must be at least 8 characters',
    loginHistory: 'Login History',

    // Notifications
    notificationPreferences: 'Notification Preferences',
    manageNotifications: 'Manage how you receive notifications',
    emailNotifications: 'Email Notifications',
    emailNotificationsDesc: 'Receive notifications via email',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'Receive browser push notifications',
    taskUpdates: 'Task Updates',
    taskUpdatesDesc: 'Get notified about task changes',
    projectUpdates: 'Project Updates',
    projectUpdatesDesc: 'Get notified about project changes',
    ticketUpdates: 'Ticket Updates',
    ticketUpdatesDesc: 'Get notified about ticket changes',
    systemUpdates: 'System Updates',
    systemUpdatesDesc: 'Get notified about system updates',
    marketingEmails: 'Marketing Emails',
    marketingEmailsDesc: 'Receive promotional emails',
    savePreferences: 'Save Preferences',
    preferencesUpdated: 'Notification preferences updated',

    // Language & Region
    languageRegion: 'Language & Region',
    configureLanguage: 'Configure your language and regional preferences',
    languageLabel: 'Language',
    timezone: 'Timezone',
    dateFormat: 'Date Format',
    timeFormat: 'Time Format',
    '12h': '12-hour (AM/PM)',
    '24h': '24-hour',
    languageSettingsUpdated: 'Language and region settings updated',

    // Users
    userManagement: 'User Management',
    manageUsers: 'Manage users and their permissions',
    addUser: 'Add User',
    loadingUsers: 'Loading users...',
    noUsers: 'No users found',
    active: 'Active',
    inactive: 'Inactive',

    // Roles
    roleManagement: 'Role Management',
    manageRoles: 'Manage system roles and their permissions',
    addRole: 'Add Role',
    loadingRoles: 'Loading roles...',
    noRoles: 'No roles found',
    code: 'Code',
    level: 'Level',
    children: 'children',

    // Common
    success: 'Success!',
    error: 'Error!',
    warning: 'Warning',
    delete: 'Delete',
    edit: 'Edit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    deleteConfirm: 'Are you sure you want to delete',
    deleted: 'Deleted!',
    deleteSuccess: 'has been deleted',
    failedToDelete: 'Failed to delete',
    failedToLoad: 'Failed to load data',
    couldNotLoadRoles: 'Could not load roles. Please check the API connection.',
    user: 'User',
    role: 'Role',
  },
  es: {
    // General
    settings: 'Configuración',
    manageSettings: 'Administrar la configuración de su aplicación',
    general: 'General',
    appearance: 'Apariencia',
    security: 'Seguridad',
    notifications: 'Notificaciones',
    language: 'Idioma',
    users: 'Usuarios',
    roles: 'Roles',
    companyInformation: 'Información de la Empresa',
    updateCompanyDetails: 'Actualizar los detalles de su empresa',
    companyName: 'Nombre de la Empresa',
    industry: 'Industria',
    description: 'Descripción',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    address: 'Dirección',
    saveChanges: 'Guardar Cambios',
    companySettingsUpdated: 'Configuración de la empresa actualizada exitosamente',
    failedToSaveCompany: 'Error al guardar la configuración de la empresa',

    // Appearance
    appearanceSettings: 'Configuración de Apariencia',
    customizeAppearance: 'Personalizar cómo se ve la aplicación',
    theme: 'Tema',
    switchTheme: 'Cambiar entre modo claro y oscuro',
    light: 'Claro',
    dark: 'Oscuro',
    fontSize: 'Tamaño de Fuente',
    adjustFontSize: 'Ajustar el tamaño del texto en toda la aplicación',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    animations: 'Animaciones',
    enableDisableAnimations: 'Habilitar o deshabilitar animaciones de la interfaz',
    appearanceUpdated: 'Configuración de apariencia actualizada',

    // Security
    securitySettings: 'Configuración de Seguridad',
    manageSecurity: 'Administrar sus preferencias de seguridad',
    twoFactorAuth: 'Autenticación de Dos Factores',
    twoFactorDesc: 'Agregar una capa extra de seguridad a su cuenta',
    sessionTimeout: 'Tiempo de Sesión',
    sessionTimeoutDesc: 'Cerrar sesión automáticamente después de inactividad',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',
    changePassword: 'Cambiar Contraseña',
    currentPassword: 'Contraseña Actual',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    passwordChanged: 'Contraseña cambiada exitosamente',
    passwordMismatch: 'Las contraseñas no coinciden',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    loginHistory: 'Historial de Inicio de Sesión',

    // Notifications
    notificationPreferences: 'Preferencias de Notificaciones',
    manageNotifications: 'Administrar cómo recibe notificaciones',
    emailNotifications: 'Notificaciones por Correo',
    emailNotificationsDesc: 'Recibir notificaciones por correo electrónico',
    pushNotifications: 'Notificaciones Push',
    pushNotificationsDesc: 'Recibir notificaciones push del navegador',
    taskUpdates: 'Actualizaciones de Tareas',
    taskUpdatesDesc: 'Recibir notificaciones sobre cambios en tareas',
    projectUpdates: 'Actualizaciones de Proyectos',
    projectUpdatesDesc: 'Recibir notificaciones sobre cambios en proyectos',
    ticketUpdates: 'Actualizaciones de Tickets',
    ticketUpdatesDesc: 'Recibir notificaciones sobre cambios en tickets',
    systemUpdates: 'Actualizaciones del Sistema',
    systemUpdatesDesc: 'Recibir notificaciones sobre actualizaciones del sistema',
    marketingEmails: 'Correos de Marketing',
    marketingEmailsDesc: 'Recibir correos electrónicos promocionales',
    savePreferences: 'Guardar Preferencias',
    preferencesUpdated: 'Preferencias de notificaciones actualizadas',

    // Language & Region
    languageRegion: 'Idioma y Región',
    configureLanguage: 'Configurar sus preferencias de idioma y región',
    languageLabel: 'Idioma',
    timezone: 'Zona Horaria',
    dateFormat: 'Formato de Fecha',
    timeFormat: 'Formato de Hora',
    '12h': '12 horas (AM/PM)',
    '24h': '24 horas',
    languageSettingsUpdated: 'Configuración de idioma y región actualizada',

    // Users
    userManagement: 'Gestión de Usuarios',
    manageUsers: 'Administrar usuarios y sus permisos',
    addUser: 'Agregar Usuario',
    loadingUsers: 'Cargando usuarios...',
    noUsers: 'No se encontraron usuarios',
    active: 'Activo',
    inactive: 'Inactivo',

    // Roles
    roleManagement: 'Gestión de Roles',
    manageRoles: 'Administrar roles del sistema y sus permisos',
    addRole: 'Agregar Rol',
    loadingRoles: 'Cargando roles...',
    noRoles: 'No se encontraron roles',
    code: 'Código',
    level: 'Nivel',
    children: 'hijos',

    // Common
    success: '¡Éxito!',
    error: '¡Error!',
    warning: 'Advertencia',
    delete: 'Eliminar',
    edit: 'Editar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    deleteConfirm: '¿Está seguro de que desea eliminar',
    deleted: '¡Eliminado!',
    deleteSuccess: 'ha sido eliminado',
    failedToDelete: 'Error al eliminar',
    failedToLoad: 'Error al cargar los datos',
    couldNotLoadRoles: 'No se pudieron cargar los roles. Por favor, verifique la conexión a la API.',
    user: 'Usuario',
    role: 'Rol',
  },
  fr: {
    // General
    settings: 'Paramètres',
    manageSettings: 'Gérer les paramètres de votre application',
    general: 'Général',
    appearance: 'Apparence',
    security: 'Sécurité',
    notifications: 'Notifications',
    language: 'Langue',
    users: 'Utilisateurs',
    roles: 'Rôles',
    companyInformation: 'Informations de l\'Entreprise',
    updateCompanyDetails: 'Mettre à jour les détails de votre entreprise',
    companyName: 'Nom de l\'Entreprise',
    industry: 'Secteur',
    description: 'Description',
    email: 'E-mail',
    phone: 'Téléphone',
    address: 'Adresse',
    saveChanges: 'Enregistrer les Modifications',
    companySettingsUpdated: 'Paramètres de l\'entreprise mis à jour avec succès',
    failedToSaveCompany: 'Échec de l\'enregistrement des paramètres de l\'entreprise',

    // Appearance
    appearanceSettings: 'Paramètres d\'Apparence',
    customizeAppearance: 'Personnaliser l\'apparence de l\'application',
    theme: 'Thème',
    switchTheme: 'Basculer entre le mode clair et sombre',
    light: 'Clair',
    dark: 'Sombre',
    fontSize: 'Taille de Police',
    adjustFontSize: 'Ajuster la taille du texte dans toute l\'application',
    small: 'Petite',
    medium: 'Moyenne',
    large: 'Grande',
    animations: 'Animations',
    enableDisableAnimations: 'Activer ou désactiver les animations de l\'interface',
    appearanceUpdated: 'Paramètres d\'apparence mis à jour',

    // Security
    securitySettings: 'Paramètres de Sécurité',
    manageSecurity: 'Gérer vos préférences de sécurité',
    twoFactorAuth: 'Authentification à Deux Facteurs',
    twoFactorDesc: 'Ajouter une couche supplémentaire de sécurité à votre compte',
    sessionTimeout: 'Délai d\'Inactivité',
    sessionTimeoutDesc: 'Se déconnecter automatiquement après une période d\'inactivité',
    minutes: 'minutes',
    hour: 'heure',
    hours: 'heures',
    changePassword: 'Changer le Mot de Passe',
    currentPassword: 'Mot de Passe Actuel',
    newPassword: 'Nouveau Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    passwordChanged: 'Mot de passe changé avec succès',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    passwordMinLength: 'Le mot de passe doit comporter au moins 8 caractères',
    loginHistory: 'Historique de Connexion',

    // Notifications
    notificationPreferences: 'Préférences de Notification',
    manageNotifications: 'Gérer la manière dont vous recevez les notifications',
    emailNotifications: 'Notifications par E-mail',
    emailNotificationsDesc: 'Recevoir des notifications par e-mail',
    pushNotifications: 'Notifications Push',
    pushNotificationsDesc: 'Recevoir des notifications push du navigateur',
    taskUpdates: 'Mises à Jour des Tâches',
    taskUpdatesDesc: 'Être informé des changements de tâches',
    projectUpdates: 'Mises à Jour des Projets',
    projectUpdatesDesc: 'Être informé des changements de projets',
    ticketUpdates: 'Mises à Jour des Tickets',
    ticketUpdatesDesc: 'Être informé des changements de tickets',
    systemUpdates: 'Mises à Jour Système',
    systemUpdatesDesc: 'Être informé des mises à jour du système',
    marketingEmails: 'E-mails Marketing',
    marketingEmailsDesc: 'Recevoir des e-mails promotionnels',
    savePreferences: 'Enregistrer les Préférences',
    preferencesUpdated: 'Préférences de notification mises à jour',

    // Language & Region
    languageRegion: 'Langue et Région',
    configureLanguage: 'Configurer vos préférences de langue et de région',
    languageLabel: 'Langue',
    timezone: 'Fuseau Horaire',
    dateFormat: 'Format de Date',
    timeFormat: 'Format d\'Heure',
    '12h': '12 heures (AM/PM)',
    '24h': '24 heures',
    languageSettingsUpdated: 'Paramètres de langue et de région mis à jour',

    // Users
    userManagement: 'Gestion des Utilisateurs',
    manageUsers: 'Gérer les utilisateurs et leurs permissions',
    addUser: 'Ajouter un Utilisateur',
    loadingUsers: 'Chargement des utilisateurs...',
    noUsers: 'Aucun utilisateur trouvé',
    active: 'Actif',
    inactive: 'Inactif',

    // Roles
    roleManagement: 'Gestion des Rôles',
    manageRoles: 'Gérer les rôles du système et leurs permissions',
    addRole: 'Ajouter un Rôle',
    loadingRoles: 'Chargement des rôles...',
    noRoles: 'Aucun rôle trouvé',
    code: 'Code',
    level: 'Niveau',
    children: 'enfants',

    // Common
    success: 'Succès !',
    error: 'Erreur !',
    warning: 'Avertissement',
    delete: 'Supprimer',
    edit: 'Modifier',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer',
    deleted: 'Supprimé !',
    deleteSuccess: 'a été supprimé',
    failedToDelete: 'Échec de la suppression',
    failedToLoad: 'Échec du chargement des données',
    couldNotLoadRoles: 'Impossible de charger les rôles. Veuillez vérifier la connexion à l\'API.',
    user: 'Utilisateur',
    role: 'Rôle',
  },
  ar: {
    // General
    settings: 'الإعدادات',
    manageSettings: 'إدارة إعدادات التطبيق',
    general: 'عام',
    appearance: 'المظهر',
    security: 'الأمان',
    notifications: 'الإشعارات',
    language: 'اللغة',
    users: 'المستخدمين',
    roles: 'الأدوار',
    companyInformation: 'معلومات الشركة',
    updateCompanyDetails: 'تحديث تفاصيل الشركة',
    companyName: 'اسم الشركة',
    industry: 'المجال',
    description: 'الوصف',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    saveChanges: 'حفظ التغييرات',
    companySettingsUpdated: 'تم تحديث إعدادات الشركة بنجاح',
    failedToSaveCompany: 'فشل حفظ إعدادات الشركة',

    // Appearance
    appearanceSettings: 'إعدادات المظهر',
    customizeAppearance: 'تخصيص مظهر التطبيق',
    theme: 'المظهر',
    switchTheme: 'التبديل بين الوضع الفاتح والداكن',
    light: 'فاتح',
    dark: 'داكن',
    fontSize: 'حجم الخط',
    adjustFontSize: 'تعديل حجم النص في جميع أنحاء التطبيق',
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',
    animations: 'الرسوم المتحركة',
    enableDisableAnimations: 'تمكين أو تعطيل رسوم واجهة المستخدم المتحركة',
    appearanceUpdated: 'تم تحديث إعدادات المظهر',

    // Security
    securitySettings: 'إعدادات الأمان',
    manageSecurity: 'إدارة تفضيلات الأمان',
    twoFactorAuth: 'المصادقة الثنائية',
    twoFactorDesc: 'إضافة طبقة إضافية من الأمان لحسابك',
    sessionTimeout: 'مهلة الجلسة',
    sessionTimeoutDesc: 'تسجيل الخروج تلقائياً بعد عدم النشاط',
    minutes: 'دقائق',
    hour: 'ساعة',
    hours: 'ساعات',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    passwordMinLength: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
    loginHistory: 'سجل تسجيل الدخول',

    // Notifications
    notificationPreferences: 'تفضيلات الإشعارات',
    manageNotifications: 'إدارة كيفية تلقي الإشعارات',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    emailNotificationsDesc: 'تلقي الإشعارات عبر البريد الإلكتروني',
    pushNotifications: 'إشعارات الدفع',
    pushNotificationsDesc: 'تلقي إشعارات الدفع من المتصفح',
    taskUpdates: 'تحديثات المهام',
    taskUpdatesDesc: 'تلقي إشعارات بتغييرات المهام',
    projectUpdates: 'تحديثات المشاريع',
    projectUpdatesDesc: 'تلقي إشعارات بتغييرات المشاريع',
    ticketUpdates: 'تحديثات التذاكر',
    ticketUpdatesDesc: 'تلقي إشعارات بتغييرات التذاكر',
    systemUpdates: 'تحديثات النظام',
    systemUpdatesDesc: 'تلقي إشعارات بتحديثات النظام',
    marketingEmails: 'رسائل التسويق',
    marketingEmailsDesc: 'تلقي رسائل البريد الإلكتروني الترويجية',
    savePreferences: 'حفظ التفضيلات',
    preferencesUpdated: 'تم تحديث تفضيلات الإشعارات',

    // Language & Region
    languageRegion: 'اللغة والمنطقة',
    configureLanguage: 'تكوين تفضيلات اللغة والمنطقة',
    languageLabel: 'اللغة',
    timezone: 'المنطقة الزمنية',
    dateFormat: 'تنسيق التاريخ',
    timeFormat: 'تنسيق الوقت',
    '12h': '12 ساعة (ص/م)',
    '24h': '24 ساعة',
    languageSettingsUpdated: 'تم تحديث إعدادات اللغة والمنطقة',

    // Users
    userManagement: 'إدارة المستخدمين',
    manageUsers: 'إدارة المستخدمين وأذوناتهم',
    addUser: 'إضافة مستخدم',
    loadingUsers: 'جاري تحميل المستخدمين...',
    noUsers: 'لم يتم العثور على مستخدمين',
    active: 'نشط',
    inactive: 'غير نشط',

    // Roles
    roleManagement: 'إدارة الأدوار',
    manageRoles: 'إدارة أدوار النظام وأذوناتها',
    addRole: 'إضافة دور',
    loadingRoles: 'جاري تحميل الأدوار...',
    noRoles: 'لم يتم العثور على أدوار',
    code: 'الكود',
    level: 'المستوى',
    children: 'الأطفال',

    // Common
    success: 'نجاح!',
    error: 'خطأ!',
    warning: 'تحذير',
    delete: 'حذف',
    edit: 'تعديل',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    deleteConfirm: 'هل أنت متأكد من رغبتك في حذف',
    deleted: 'تم الحذف!',
    deleteSuccess: 'تم حذفه',
    failedToDelete: 'فشل الحذف',
    failedToLoad: 'فشل تحميل البيانات',
    couldNotLoadRoles: 'تعذر تحميل الأدوار. يرجى التحقق من اتصال API.',
    user: 'المستخدم',
    role: 'الدور',
  },
  de: {
    // General
    settings: 'Einstellungen',
    manageSettings: 'Verwalten Sie Ihre Anwendungseinstellungen',
    general: 'Allgemein',
    appearance: 'Erscheinungsbild',
    security: 'Sicherheit',
    notifications: 'Benachrichtigungen',
    language: 'Sprache',
    users: 'Benutzer',
    roles: 'Rollen',
    companyInformation: 'Unternehmensinformationen',
    updateCompanyDetails: 'Aktualisieren Sie Ihre Unternehmensdetails',
    companyName: 'Unternehmensname',
    industry: 'Branche',
    description: 'Beschreibung',
    email: 'E-Mail',
    phone: 'Telefon',
    address: 'Adresse',
    saveChanges: 'Änderungen speichern',
    companySettingsUpdated: 'Unternehmenseinstellungen erfolgreich aktualisiert',
    failedToSaveCompany: 'Fehler beim Speichern der Unternehmenseinstellungen',

    // Appearance
    appearanceSettings: 'Erscheinungsbild-Einstellungen',
    customizeAppearance: 'Passen Sie das Aussehen der Anwendung an',
    theme: 'Thema',
    switchTheme: 'Zwischen hellem und dunklem Modus wechseln',
    light: 'Hell',
    dark: 'Dunkel',
    fontSize: 'Schriftgröße',
    adjustFontSize: 'Passen Sie die Textgröße in der gesamten Anwendung an',
    small: 'Klein',
    medium: 'Mittel',
    large: 'Groß',
    animations: 'Animationen',
    enableDisableAnimations: 'UI-Animationen aktivieren oder deaktivieren',
    appearanceUpdated: 'Erscheinungsbild-Einstellungen aktualisiert',

    // Security
    securitySettings: 'Sicherheitseinstellungen',
    manageSecurity: 'Verwalten Sie Ihre Sicherheitseinstellungen',
    twoFactorAuth: 'Zwei-Faktor-Authentifizierung',
    twoFactorDesc: 'Fügen Sie Ihrem Konto eine zusätzliche Sicherheitsebene hinzu',
    sessionTimeout: 'Sitzungszeitlimit',
    sessionTimeoutDesc: 'Automatisch nach Inaktivität abmelden',
    minutes: 'Minuten',
    hour: 'Stunde',
    hours: 'Stunden',
    changePassword: 'Passwort ändern',
    currentPassword: 'Aktuelles Passwort',
    newPassword: 'Neues Passwort',
    confirmPassword: 'Passwort bestätigen',
    passwordChanged: 'Passwort erfolgreich geändert',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    passwordMinLength: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    loginHistory: 'Anmeldeverlauf',

    // Notifications
    notificationPreferences: 'Benachrichtigungseinstellungen',
    manageNotifications: 'Verwalten Sie, wie Sie Benachrichtigungen erhalten',
    emailNotifications: 'E-Mail-Benachrichtigungen',
    emailNotificationsDesc: 'Benachrichtigungen per E-Mail erhalten',
    pushNotifications: 'Push-Benachrichtigungen',
    pushNotificationsDesc: 'Browser-Push-Benachrichtigungen erhalten',
    taskUpdates: 'Aufgabenaktualisierungen',
    taskUpdatesDesc: 'Über Aufgabenänderungen benachrichtigt werden',
    projectUpdates: 'Projektaktualisierungen',
    projectUpdatesDesc: 'Über Projektänderungen benachrichtigt werden',
    ticketUpdates: 'Ticketaktualisierungen',
    ticketUpdatesDesc: 'Über Ticketänderungen benachrichtigt werden',
    systemUpdates: 'Systemaktualisierungen',
    systemUpdatesDesc: 'Über Systemaktualisierungen benachrichtigt werden',
    marketingEmails: 'Marketing-E-Mails',
    marketingEmailsDesc: 'Werbe-E-Mails erhalten',
    savePreferences: 'Einstellungen speichern',
    preferencesUpdated: 'Benachrichtigungseinstellungen aktualisiert',

    // Language & Region
    languageRegion: 'Sprache und Region',
    configureLanguage: 'Konfigurieren Sie Ihre Sprach- und Regionseinstellungen',
    languageLabel: 'Sprache',
    timezone: 'Zeitzone',
    dateFormat: 'Datumsformat',
    timeFormat: 'Zeitformat',
    '12h': '12-Stunden (AM/PM)',
    '24h': '24-Stunden',
    languageSettingsUpdated: 'Sprach- und Regionseinstellungen aktualisiert',

    // Users
    userManagement: 'Benutzerverwaltung',
    manageUsers: 'Benutzer und ihre Berechtigungen verwalten',
    addUser: 'Benutzer hinzufügen',
    loadingUsers: 'Benutzer werden geladen...',
    noUsers: 'Keine Benutzer gefunden',
    active: 'Aktiv',
    inactive: 'Inaktiv',

    // Roles
    roleManagement: 'Rollenverwaltung',
    manageRoles: 'Systemrollen und ihre Berechtigungen verwalten',
    addRole: 'Rolle hinzufügen',
    loadingRoles: 'Rollen werden geladen...',
    noRoles: 'Keine Rollen gefunden',
    code: 'Code',
    level: 'Stufe',
    children: 'Kinder',

    // Common
    success: 'Erfolg!',
    error: 'Fehler!',
    warning: 'Warnung',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    deleteConfirm: 'Sind Sie sicher, dass Sie löschen möchten',
    deleted: 'Gelöscht!',
    deleteSuccess: 'wurde gelöscht',
    failedToDelete: 'Löschen fehlgeschlagen',
    failedToLoad: 'Daten konnten nicht geladen werden',
    couldNotLoadRoles: 'Rollen konnten nicht geladen werden. Bitte überprüfen Sie die API-Verbindung.',
    user: 'Benutzer',
    role: 'Rolle',
  }
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  
  // Language state
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('appLanguage') || 'en'
  );

  // Get translation function
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  // Font size state
  const [fontSize, setFontSize] = useState(
    localStorage.getItem('appFontSize') || 'medium'
  );

  // General Settings
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Codevelop',
    industry: 'Software Engineering',
    description: 'Premier software engineering firm delivering enterprise solutions',
    email: 'info@codevelop.com',
    phone: '+1 234 567 8900',
    address: '123 Tech Street, Silicon Valley, CA',
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: isDark ? 'dark' : 'light',
    sidebarCollapsed: false,
    fontSize: fontSize,
    primaryColor: '#3b82f6',
    animations: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordLastChanged: '2024-01-15',
    loginHistory: [
      { date: '2024-01-20 10:30:00', ip: '192.168.1.1', device: 'Chrome - Windows' },
      { date: '2024-01-19 15:45:00', ip: '192.168.1.2', device: 'Firefox - MacOS' },
      { date: '2024-01-18 09:15:00', ip: '192.168.1.3', device: 'Safari - iOS' },
    ],
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    projectUpdates: false,
    ticketUpdates: true,
    systemUpdates: true,
    marketingEmails: false,
  });

  // Language Settings
  const [languageSettings, setLanguageSettings] = useState({
    language: currentLanguage,
    timezone: localStorage.getItem('appTimezone') || 'UTC-5',
    dateFormat: localStorage.getItem('appDateFormat') || 'MM/DD/YYYY',
    timeFormat: localStorage.getItem('appTimeFormat') || '12h',
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchData();
    applyFontSize(fontSize);
    // Apply language on load
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      try {
        const usersResponse = await usersAPI.getAll();
        let usersData = [];
        if (usersResponse.data) {
          if (Array.isArray(usersResponse.data)) {
            usersData = usersResponse.data;
          } else if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
            usersData = usersResponse.data.data;
          } else if (usersResponse.data.$values && Array.isArray(usersResponse.data.$values)) {
            usersData = usersResponse.data.$values;
          } else {
            usersData = usersResponse.data;
          }
        }
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (userError) {
        console.error('Error fetching users:', userError);
        setUsers([]);
      }

      // Fetch clients
      try {
        const clientsResponse = await clientsApi.getClients();
        const clientsData = clientsResponse.data?.data || clientsResponse.data || [];
        setClients(Array.isArray(clientsData) ? clientsData : []);
      } catch (clientError) {
        console.error('Error fetching clients:', clientError);
        setClients([]);
      }

      // Fetch roles
      try {
        console.log('Fetching roles from API...');
        const rolesResponse = await RolesAPI.getAll();
        console.log('Roles API Response:', rolesResponse);
        
        let rolesData = [];
        
        if (rolesResponse.data) {
          if (rolesResponse.data.data && Array.isArray(rolesResponse.data.data)) {
            rolesData = rolesResponse.data.data;
          } else if (Array.isArray(rolesResponse.data)) {
            rolesData = rolesResponse.data;
          } else if (rolesResponse.data.$values && Array.isArray(rolesResponse.data.$values)) {
            rolesData = rolesResponse.data.$values;
          } else if (rolesResponse.data.success && rolesResponse.data.data) {
            rolesData = rolesResponse.data.data;
          } else {
            rolesData = rolesResponse.data;
          }
        } else if (Array.isArray(rolesResponse)) {
          rolesData = rolesResponse;
        }
        
        if (!Array.isArray(rolesData)) {
          rolesData = [];
        }
        
        console.log('Processed Roles Data:', rolesData);
        setRoles(rolesData);
        
      } catch (roleError) {
        console.error('Error fetching roles:', roleError);
        setRoles([]);
        
        Swal.fire({
          title: t('warning'),
          text: t('couldNotLoadRoles'),
          icon: 'warning',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          confirmButtonColor: '#3b82f6',
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        title: t('error'),
        text: t('failedToLoad'),
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFontSize = (size) => {
    const root = document.documentElement;
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.fontSize = sizes[size] || '16px';
    localStorage.setItem('appFontSize', size);
    setFontSize(size);
  };

  const applyLanguage = (lang) => {
    localStorage.setItem('appLanguage', lang);
    setCurrentLanguage(lang);
    setLanguageSettings(prev => ({ ...prev, language: lang }));
    // Update document direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    console.log(`Language changed to: ${lang}`);
  };

  const applyTimezone = (timezone) => {
    localStorage.setItem('appTimezone', timezone);
  };

  const applyDateFormat = (format) => {
    localStorage.setItem('appDateFormat', format);
  };

  const applyTimeFormat = (format) => {
    localStorage.setItem('appTimeFormat', format);
  };

  const handleCompanySave = async () => {
    try {
      await Swal.fire({
        title: t('success'),
        text: t('companySettingsUpdated'),
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: t('failedToSaveCompany'),
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
      });
    }
  };

  const handleAppearanceSave = () => {
    if (appearanceSettings.theme === 'dark' && !isDark) {
      toggleTheme();
    } else if (appearanceSettings.theme === 'light' && isDark) {
      toggleTheme();
    }
    
    applyFontSize(appearanceSettings.fontSize);
    
    Swal.fire({
      title: t('success'),
      text: t('appearanceUpdated'),
      icon: 'success',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        title: t('error'),
        text: t('passwordMismatch'),
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Swal.fire({
        title: t('error'),
        text: t('passwordMinLength'),
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
      });
      return;
    }

    try {
      await Swal.fire({
        title: t('success'),
        text: t('passwordChanged'),
        icon: 'success',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
        timer: 2000,
        timerProgressBar: true,
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: 'Failed to change password',
        icon: 'error',
        background: isDark ? '#141c2b' : '#ffffff',
        color: isDark ? '#e8edf5' : '#0f172a',
      });
    }
  };

  const handleUserDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: t('delete'),
      text: `${t('deleteConfirm')} ${userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        await usersAPI.delete(userId);
        await fetchData();
        Swal.fire({
          title: t('deleted'),
          text: `${t('user')} ${t('deleteSuccess')}`,
          icon: 'success',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          title: t('error'),
          text: `${t('failedToDelete')} ${t('user')}`,
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
        });
      }
    }
  };

  const handleRoleDelete = async (roleId, roleName) => {
    const result = await Swal.fire({
      title: t('delete'),
      text: `${t('deleteConfirm')} ${roleName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        await RolesAPI.delete(roleId);
        await fetchData();
        Swal.fire({
          title: t('deleted'),
          text: `${t('role')} ${t('deleteSuccess')}`,
          icon: 'success',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          title: t('error'),
          text: `${t('failedToDelete')} ${t('role')}`,
          icon: 'error',
          background: isDark ? '#141c2b' : '#ffffff',
          color: isDark ? '#e8edf5' : '#0f172a',
        });
      }
    }
  };

  const handleNotificationSave = () => {
    Swal.fire({
      title: t('success'),
      text: t('preferencesUpdated'),
      icon: 'success',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleLanguageSave = () => {
    applyLanguage(languageSettings.language);
    applyTimezone(languageSettings.timezone);
    applyDateFormat(languageSettings.dateFormat);
    applyTimeFormat(languageSettings.timeFormat);
    
    Swal.fire({
      title: t('success'),
      text: t('languageSettingsUpdated'),
      icon: 'success',
      background: isDark ? '#141c2b' : '#ffffff',
      color: isDark ? '#e8edf5' : '#0f172a',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const tabs = [
    { id: 'general', label: t('general'), icon: BusinessIcon },
    { id: 'appearance', label: t('appearance'), icon: PaletteIcon },
    { id: 'security', label: t('security'), icon: SecurityIcon },
    { id: 'notifications', label: t('notifications'), icon: NotificationsIcon },
    { id: 'language', label: t('language'), icon: LanguageIcon },
    { id: 'users', label: t('users'), icon: PeopleIcon },
    { id: 'roles', label: t('roles'), icon: AdminPanelSettingsIcon },
  ];

  const inputClass = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
    isDark 
      ? 'bg-[#1a2438] border-[#1e2d45] text-white placeholder-gray-500' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  // Get language options for the select
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ar', label: 'العربية' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('settings')}
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          {t('manageSettings')}
        </p>
      </div>

      <div className={`rounded-xl shadow-card overflow-hidden ${
        isDark ? 'bg-[#141c2b] border border-[#1e2d45]' : 'bg-white'
      }`}>
        <div className={`border-b ${isDark ? 'border-[#1e2d45]' : 'border-gray-200'}`}>
          <div className="flex overflow-x-auto p-2 space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? isDark 
                      ? 'bg-blue-900/20 text-blue-400' 
                      : 'bg-blue-50 text-blue-700'
                    : isDark 
                      ? 'text-gray-400 hover:bg-[#1a2438] hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {t('companyInformation')}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  {t('updateCompanyDetails')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t('companyName')}</label>
                    <input
                      type="text"
                      value={companySettings.companyName}
                      onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('industry')}</label>
                    <input
                      type="text"
                      value={companySettings.industry}
                      onChange={(e) => setCompanySettings({...companySettings, industry: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{t('description')}</label>
                    <textarea
                      rows="3"
                      value={companySettings.description}
                      onChange={(e) => setCompanySettings({...companySettings, description: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('email')}</label>
                    <input
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('phone')}</label>
                    <input
                      type="text"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{t('address')}</label>
                    <input
                      type="text"
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className={`pt-6 border-t ${isDark ? 'border-[#1e2d45]' : 'border-gray-200'}`}>
                <button
                  onClick={handleCompanySave}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>{t('saveChanges')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {t('appearanceSettings')}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  {t('customizeAppearance')}
                </p>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('theme')}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('switchTheme')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'light'})}
                        className={`px-4 py-2 rounded-lg transition ${
                          appearanceSettings.theme === 'light'
                            ? 'bg-blue-500 text-white'
                            : isDark ? 'bg-[#1a2438] text-gray-400 hover:bg-[#1e2d45]' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {t('light')}
                      </button>
                      <button
                        onClick={() => setAppearanceSettings({...appearanceSettings, theme: 'dark'})}
                        className={`px-4 py-2 rounded-lg transition ${
                          appearanceSettings.theme === 'dark'
                            ? 'bg-blue-500 text-white'
                            : isDark ? 'bg-[#1a2438] text-gray-400 hover:bg-[#1e2d45]' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {t('dark')}
                      </button>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('fontSize')}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('adjustFontSize')}
                      </p>
                    </div>
                    <select
                      value={appearanceSettings.fontSize}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, fontSize: e.target.value})}
                      className={`px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="small">{t('small')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="large">{t('large')}</option>
                    </select>
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('animations')}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('enableDisableAnimations')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearanceSettings.animations}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, animations: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className={`pt-6 border-t ${isDark ? 'border-[#1e2d45]' : 'border-gray-200'}`}>
                <button
                  onClick={handleAppearanceSave}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>{t('saveChanges')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {t('securitySettings')}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  {t('manageSecurity')}
                </p>
                
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('twoFactorAuth')}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('twoFactorDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('sessionTimeout')}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('sessionTimeoutDesc')}
                      </p>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      className={`px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark ? 'bg-[#1a2438] border-[#1e2d45] text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="15">15 {t('minutes')}</option>
                      <option value="30">30 {t('minutes')}</option>
                      <option value="60">1 {t('hour')}</option>
                      <option value="120">2 {t('hours')}</option>
                    </select>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                  }`}>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                      {t('changePassword')}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className={labelClass}>{t('currentPassword')}</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className={inputClass}
                          placeholder={t('currentPassword')}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t('newPassword')}</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className={inputClass}
                          placeholder={t('newPassword')}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t('confirmPassword')}</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className={inputClass}
                          placeholder={t('confirmPassword')}
                        />
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
                      >
                        {t('changePassword')}
                      </button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                  }`}>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                      {t('loginHistory')}
                    </p>
                    <div className="space-y-2">
                      {securitySettings.loginHistory.map((login, index) => (
                        <div key={index} className={`flex items-center justify-between text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span>{login.date}</span>
                          <span>{login.ip}</span>
                          <span>{login.device}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {t('notificationPreferences')}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  {t('manageNotifications')}
                </p>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: t('emailNotifications'), desc: t('emailNotificationsDesc') },
                    { key: 'pushNotifications', label: t('pushNotifications'), desc: t('pushNotificationsDesc') },
                    { key: 'taskUpdates', label: t('taskUpdates'), desc: t('taskUpdatesDesc') },
                    { key: 'projectUpdates', label: t('projectUpdates'), desc: t('projectUpdatesDesc') },
                    { key: 'ticketUpdates', label: t('ticketUpdates'), desc: t('ticketUpdatesDesc') },
                    { key: 'systemUpdates', label: t('systemUpdates'), desc: t('systemUpdatesDesc') },
                    { key: 'marketingEmails', label: t('marketingEmails'), desc: t('marketingEmailsDesc') },
                  ].map((setting) => (
                    <div key={setting.key} className={`flex items-center justify-between p-4 rounded-lg ${
                      isDark ? 'bg-[#1a2438]' : 'bg-gray-50'
                    }`}>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{setting.label}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[setting.key]}
                          onChange={(e) => setNotificationSettings({...notificationSettings, [setting.key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`pt-6 border-t ${isDark ? 'border-[#1e2d45]' : 'border-gray-200'}`}>
                <button
                  onClick={handleNotificationSave}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>{t('savePreferences')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {t('languageRegion')}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  {t('configureLanguage')}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>{t('languageLabel')}</label>
                    <select
                      value={languageSettings.language}
                      onChange={(e) => setLanguageSettings({...languageSettings, language: e.target.value})}
                      className={inputClass}
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>{t('timezone')}</label>
                    <select
                      value={languageSettings.timezone}
                      onChange={(e) => setLanguageSettings({...languageSettings, timezone: e.target.value})}
                      className={inputClass}
                    >
                      <option value="UTC-12">International Date Line West (UTC-12)</option>
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">UTC</option>
                      <option value="UTC+1">Central European (UTC+1)</option>
                      <option value="UTC+2">Eastern European (UTC+2)</option>
                      <option value="UTC+3">Moscow (UTC+3)</option>
                      <option value="UTC+5:30">India (UTC+5:30)</option>
                      <option value="UTC+8">Singapore (UTC+8)</option>
                      <option value="UTC+9">Tokyo (UTC+9)</option>
                      <option value="UTC+10">Sydney (UTC+10)</option>
                      <option value="UTC+12">Auckland (UTC+12)</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>{t('dateFormat')}</label>
                    <select
                      value={languageSettings.dateFormat}
                      onChange={(e) => setLanguageSettings({...languageSettings, dateFormat: e.target.value})}
                      className={inputClass}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>{t('timeFormat')}</label>
                    <select
                      value={languageSettings.timeFormat}
                      onChange={(e) => setLanguageSettings({...languageSettings, timeFormat: e.target.value})}
                      className={inputClass}
                    >
                      <option value="12h">{t('12h')}</option>
                      <option value="24h">{t('24h')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`pt-6 border-t ${isDark ? 'border-[#1e2d45]' : 'border-gray-200'}`}>
                <button
                  onClick={handleLanguageSave}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>{t('saveChanges')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('userManagement')}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('manageUsers')}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/users/add')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
                  >
                    <AddIcon className="w-5 h-5" />
                    <span>{t('addUser')}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('loadingUsers')}</p>
                    </div>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.userId || user.id} className={`flex items-center justify-between p-4 rounded-lg ${
                        isDark ? 'bg-[#1a2438] hover:bg-[#1e2d45]' : 'bg-gray-50 hover:bg-gray-100'
                      } transition`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.firstName?.[0]}{user.lastName?.[0] || 'U'}
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {user.firstName} {user.lastName}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {user.isActive ? t('active') : t('inactive')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isDark ? 'bg-[#1a2438] text-gray-400' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {user.roleName || 'User'}
                          </span>
                          <button
                            onClick={() => navigate(`/users/${user.userId || user.id}/edit`)}
                            className={`p-1.5 rounded-lg transition ${
                              isDark ? 'hover:bg-[#1e2d45] text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUserDelete(user.userId || user.id, `${user.firstName} ${user.lastName}`)}
                            className="p-1.5 rounded-lg transition text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('noUsers')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('roleManagement')}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('manageRoles')}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/roles/add')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
                  >
                    <AddIcon className="w-5 h-5" />
                    <span>{t('addRole')}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('loadingRoles')}</p>
                    </div>
                  ) : roles.length > 0 ? (
                    roles.map((role) => (
                      <div key={role.roleId} className={`flex items-center justify-between p-4 rounded-lg ${
                        isDark ? 'bg-[#1a2438] hover:bg-[#1e2d45]' : 'bg-gray-50 hover:bg-gray-100'
                      } transition`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                            isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {role.roleName?.[0] || role.roleCode?.[0] || 'R'}
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {role.roleName}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span className="flex items-center space-x-2">
                                <span>{t('code')}: <span className="font-mono">{role.roleCode || 'N/A'}</span></span>
                                <span>•</span>
                                <span>{t('level')}: {role.level || 0}</span>
                                {role.childRolesCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center space-x-1">
                                      <GroupIcon className="w-3 h-3" />
                                      <span>{role.childRolesCount} {t('children')}</span>
                                    </span>
                                  </>
                                )}
                              </span>
                            </p>
                            {role.description && (
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>
                                {role.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            role.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {role.isActive ? t('active') : t('inactive')}
                          </span>
                          <button
                            onClick={() => navigate(`/roles/${role.roleId}/edit`)}
                            className={`p-1.5 rounded-lg transition ${
                              isDark ? 'hover:bg-[#1e2d45] text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRoleDelete(role.roleId, role.roleName)}
                            className="p-1.5 rounded-lg transition text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('noRoles')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;