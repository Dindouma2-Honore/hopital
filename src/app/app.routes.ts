import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Tableau de Bord — MediCore Pro'
    },
    {
        path: 'patients',
        loadComponent: () => import('./features/patients/patients.component').then(m => m.PatientsComponent),
        title: 'Patients — MediCore Pro'
    },
    {
        path: 'appointments',
        loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent),
        title: 'Rendez-vous — MediCore Pro'
    },
    {
        path: 'doctors',
        loadComponent: () => import('./features/doctors/doctors.component').then(m => m.DoctorsComponent),
        title: 'Médecins — MediCore Pro'
    },
    {
        path: 'departments',
        loadComponent: () => import('./features/departments/departments.component').then(m => m.DepartmentsComponent),
        title: 'Départements — MediCore Pro'
    },
    {
        path: 'rooms',
        loadComponent: () => import('./features/rooms/rooms.component').then(m => m.RoomsComponent),
        title: 'Chambres — MediCore Pro'
    },
    {
        path: 'urgences',
        loadComponent: () => import('./features/urgences/urgences.component').then(m => m.UrgencesComponent),
        title: 'Urgences — MediCore Pro'
    },
    {
        path: 'bloc-operatoire',
        loadComponent: () => import('./features/bloc-operatoire/bloc-operatoire.component').then(m => m.BlocOperatoireComponent),
        title: 'Bloc Opératoire — MediCore Pro'
    },
    {
        path: 'laboratoire',
        loadComponent: () => import('./features/laboratoire/laboratoire.component').then(m => m.LaboratoireComponent),
        title: 'Laboratoire — MediCore Pro'
    },
    {
        path: 'pharmacie',
        loadComponent: () => import('./features/pharmacie/pharmacie.component').then(m => m.PharmacieComponent),
        title: 'Pharmacie — MediCore Pro'
    },
    {
        path: 'dossiers',
        loadComponent: () => import('./features/dossiers/dossiers.component').then(m => m.DossiersComponent),
        title: 'Dossiers Médicaux — MediCore Pro'
    },
    {
        path: 'finance',
        loadComponent: () => import('./features/finance/finance.component').then(m => m.FinanceComponent),
        title: 'Finance — MediCore Pro'
    },
    {
        path: 'stats',
        loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent),
        title: 'Statistiques — MediCore Pro'
    },
    {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Paramètres — MediCore Pro'
    },
    {
        path: 'consultation',
        loadComponent: () => import('./features/consultation/consultation.component').then(m => m.ConsultationComponent),
        title: 'consultation — MediCore Pro'
    },
    {
        path: 'ordonnance',
        loadComponent: () => import('./features/ordonnance/ordonnance.component').then(m => m.OrdonnanceComponent),
        title: 'ordonnance — MediCore Pro'
    },
    { path: '**', redirectTo: 'dashboard' }
];

