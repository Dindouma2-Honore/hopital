// ============================================================
// src/app/features/patients/patients.component.ts
// ============================================================
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Patient, PatientStatus } from '../../core/models/hospital.models';
import { PatientService } from '../../services/patientService/patient-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})

export class PatientsComponent implements OnInit {
 
  private svc = inject(PatientService);

  // ── Données & états ───────────────────────────────────────
  patients  = signal<Patient[]>([]);
  isLoading = signal(true);
  errorMsg  = signal<string | null>(null);
  isSaving  = signal(false);   // spinner bouton Enregistrer
  saveError = signal<string | null>(null);

  // ── Filtres ───────────────────────────────────────────────
  searchQuery  = signal('');
  filterDept   = signal('');
  filterStatus = signal('');

  // ── Contrôle des modals ───────────────────────────────────
  showModalAdd    = signal(false);
  showModalEdit   = signal(false);
  showModalDelete = signal(false);
  patientToDelete = signal<Patient | null>(null);

  // ── Formulaire partagé Ajout / Modif ─────────────────────
  form: Patient = this.emptyForm();

  // ── Constantes de sélection ───────────────────────────────
  readonly departments = [
    'Cardiologie','Neurologie','Pédiatrie',
    'Urgences','Chirurgie','Oncologie',
    'Radiologie','Réanimation','Gynécologie',
    'Orthopédie','Ophtalmologie','Laboratoire'
  ];
  readonly statuses: PatientStatus[] = ['Hospitalisé','Ambulatoire','Sorti','Urgence'];
  readonly bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  // ── Liste filtrée ─────────────────────────────────────────
  readonly filtered = computed(() => {
    const q  = this.searchQuery().toLowerCase();
    const d  = this.filterDept();
    const st = this.filterStatus();
    return this.patients().filter(p => {
      const name = `${p.nom} ${p.prenom}`.toLowerCase();
      
      return name.includes(q)
        && (!d  || p.departement === d)
        && (!st || p.status === st);
        
    });
  });

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit(): void { this.loadPatients(); }

  // ══════════════════════════════════════════════════════════
  // LIRE — Récupération depuis l'API PHP
  // ══════════════════════════════════════════════════════════
  loadPatients(): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.svc.getPatients().subscribe({
      next:  (data) => { 
        this.patients.set(data);
        this.currentPage.set(1)
         this.isLoading.set(false); 
      },
      error: (err)  => {
        this.errorMsg.set(
          err.status === 0
            ? 'Impossible de joindre le serveur PHP.'
            : `Erreur ${err.status} : ${err.statusText}`
        );
        this.isLoading.set(false);
      }
    });
  }

  refresh(): void { this.loadPatients(); }

  // ══════════════════════════════════════════════════════════
  // AJOUTER — Ouvrir modal vide
  // ══════════════════════════════════════════════════════════
  openAdd(): void {
    this.form = this.emptyForm();
    this.saveError.set(null);
    this.showModalAdd.set(true);
  }

  confirmAdd(): void {
    if (!this.formValid()) return;
    this.isSaving.set(true);
    this.saveError.set(null);

    this.svc.addPatient(this.form).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalAdd.set(false);
        this.loadPatients();          // recharge la liste depuis l'API
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText || err.message}`);
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  // MODIFIER — Ouvrir modal pré-rempli avec le patient
  // ══════════════════════════════════════════════════════════
  openEdit(p: Patient): void {
    // Pré-remplir le formulaire avec les données du patient cliqué
    
    this.saveError.set(null);
    this.showModalEdit.set(true);
    this.form={...p}
  }

  confirmEdit(): void {
    if (!this.formValid()) return;
    this.isSaving.set(true);
    this.saveError.set(null);

    this.svc.updatePatient(this.form.matricule, this.form).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalEdit.set(false);
        this.loadPatients();          // recharge la liste depuis l'API
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de la modification : ${err.statusText || err.message}`);
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  // SUPPRIMER — Ouvrir modal de confirmation
  // ══════════════════════════════════════════════════════════
  openDelete(p: Patient): void {
    this.patientToDelete.set(p);
    this.saveError.set(null);
    this.showModalDelete.set(true);
  }

  confirmDelete(): void {
    const p = this.patientToDelete();
    if (!p) return;
    this.isSaving.set(true);
    this.saveError.set(null);

    this.svc.deletePatient(p.id!).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalDelete.set(false);
        this.patientToDelete.set(null);
        // Suppression locale immédiate sans recharger toute la liste
        this.patients.update(list => list.filter(x => x.id !== p.id));
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de la suppression : ${err.statusText || err.message}`);
      }
    });
  }

  // ── Fermeture des modals ──────────────────────────────────
  closeAdd():    void { this.showModalAdd.set(false); }
  closeEdit():   void { this.showModalEdit.set(false); }
  closeDelete(): void { this.showModalDelete.set(false); this.patientToDelete.set(null); }

  // ── Formulaire vide ───────────────────────────────────────
  private emptyForm(): Patient {
    return {
      id:0,
      matricule: '', nom: '', prenom: '', age:0,
      sexe: 'M', bloodGroup: 'A+', departement: '',
      docteur: '', status: 'Hospitalisé', phone: '',
      allergie:[], condition: [], salle: '',color: '',
      admissionDate: new Date().toISOString().split('T')[0],
    };
  }

  // ── Validation basique ────────────────────────────────────
  formValid(): boolean {
    return !!(
      this.form.nom.trim() &&
      this.form.prenom.trim() &&
      this.form.age &&
      this.form.age > 0 &&
      this.form.departement
    );
  }

 

  // ── Utilitaires affichage ─────────────────────────────────
  matricule(p: Patient): string {
    return ((p.nom?.[0] ?? '') + (p.prenom?.[0] ?? '')).toUpperCase();
  }

  statusBadge(s: PatientStatus): string {
    const map: Record<PatientStatus, string> = {
      'Hospitalisé': 'badge-info-mc',
      'Ambulatoire': 'badge-success-mc',
      'Sorti':       'badge-muted-mc',
      'Urgence':     'badge-danger-mc',
    };
    return map[s];
  }
   // ── Pagination ────────────────────────────────────────────
  // ── Pagination ────────────────────────────────────────────
readonly pageSize = 10;
currentPage = signal(1);

readonly totalPages = computed(() =>
  Math.max(1, Math.ceil(this.filtered().length / this.pageSize))
);

readonly pagedPatients = computed(() => {
  const start = (this.currentPage() - 1) * this.pageSize;
  return this.filtered().slice(start, start + this.pageSize);
});

prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
}
