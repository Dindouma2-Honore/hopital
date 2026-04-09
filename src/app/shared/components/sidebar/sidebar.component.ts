// ============================================================
// src/app/shared/components/sidebar/sidebar.component.ts
// ============================================================
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { Patient } from '../../../core/models/hospital.models';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  constructor(readonly data: DataService) {}
  patients:Patient[]=[]
  readonly navSections: NavSection[] = [
    {
      label: 'Principal',
      items: [
        { label: 'Tableau de Bord', icon: 'bi-grid-1x2-fill',       route: '/dashboard' },
        { label: 'Patients',        icon: 'bi-people-fill',          route: '/patients',   badge: 3 },
        { label: 'Rendez-vous',     icon: 'bi-calendar2-week-fill',  route: '/appointments', badge: 2 },
      ]
    },
    {
      label: 'Médical',
      items: [
        { label: 'Consultations',     icon: 'bi-clipboard2-pulse-fill', route: '/consultation' },
        { label: 'Ordonnances',       icon: 'bi-file-earmark-medical-fill', route: '/ordonnance' },
        { label: 'Médecins & Staff',  icon: 'bi-person-badge-fill',   route: '/doctors' },
        { label: 'Départements',      icon: 'bi-building-fill-add',   route: '/departments' },
        { label: 'Chambres & Lits',   icon: 'bi-door-open-fill',      route: '/rooms' },
        { label: 'Urgences',          icon: 'bi-lightning-fill',      route: '/urgences', badge: 5, badgeColor: '#ff4757' },
        { label: 'Bloc Opératoire',   icon: 'bi-scissors',            route: '/bloc-operatoire' },
      ]
    },
    {
      label: 'Services',
      items: [
        { label: 'Laboratoire',     icon: 'bi-eyedropper',      route: '/laboratoire' },
        { label: 'Pharmacie',       icon: 'bi-capsule-pill',    route: '/pharmacie' },
        { label: 'Dossiers Méd.',   icon: 'bi-folder2-open',    route: '/dossiers' },
      ]
    },
    {
      label: 'Gestion',
      items: [
        { label: 'Finance',         icon: 'bi-cash-stack',            route: '/finance' },
        { label: 'Statistiques',    icon: 'bi-bar-chart-line-fill',   route: '/stats' },
        { label: 'Paramètres',      icon: 'bi-gear-fill',             route: '/settings' },
      ]
    }
  ];
}
