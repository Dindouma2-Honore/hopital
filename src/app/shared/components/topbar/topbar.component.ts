// src/app/shared/components/topbar/topbar.component.ts
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  readonly data   = inject(DataService);
  readonly router = inject(Router);
  searchQuery = '';
  showNotifs  = false;

  get pageTitle(): string {
    const map: Record<string, string> = {
      '/dashboard':'Tableau de Bord','/patients':'Patients',
      '/appointments':'Rendez-vous','/doctors':'Médecins & Staff',
      '/departments':'Départements','/rooms':'Chambres & Lits',
      '/urgences':'Urgences','/bloc-operatoire':'Bloc Opératoire',
      '/laboratoire':'Laboratoire','/pharmacie':'Pharmacie',
      '/dossiers':'Dossiers Médicaux','/finance':'Finance & Facturation',
      '/stats':'Statistiques','/settings':'Paramètres',
    };
    return map[this.router.url] ?? 'MediCore Pro';
  }
}
