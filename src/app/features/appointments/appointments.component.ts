import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RvService } from '../../services/appointmentService/rv-service';
import { Appointment, AppointmentStatus, Doctor } from '../../core/models/hospital.models';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../services/Staff/staff-service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  // ── Données & états ───────────────────────────────────────
  appointments = signal<Appointment[]>([]);
  docteurs: Doctor[] = [];
  isLoading = signal(true);
  errorMsg = signal<string | null>(null);
  isSaving = signal(false);
  saveError = signal<string | null>(null);

  // ── Contrôle des modals ───────────────────────────────────
  showModalAdd = signal(false);
  showModalEdit = signal(false);
  showModalDelete = signal(false);

  /** RV ciblé pour édition ou suppression */
  rvToEdit = signal<Appointment | null>(null);
  rvToDelete = signal<Appointment | null>(null);

  /** Formulaire partagé Add / Edit */
  emptyForm(): Appointment {
    return {
      id: '', patient: '', docteur: '', specialite: '',
      date: '', heure: '', type: '', status: 'Confirmé', color: '', note: ''
    };
  }
  formAdd: Appointment = this.emptyForm();
  formEdit: Appointment = this.emptyForm();

  private svc = inject(RvService);
  constructor(private docteurService: StaffService) { }

  // ── Utilitaires ───────────────────────────────────────────
  badgeClass(s: AppointmentStatus): string {
    const m: Record<AppointmentStatus, string> = {
      'Confirmé': 'badge-success-mc',
      'En attente': 'badge-info-mc',
      'Annulé': 'badge-warning-mc'
    };
    return m[s];
  }

  readonly calDays = Array.from({ length: 31 }, (_, i) => i + 1);
  readonly rdvDays = [8, 12, 15, 19, 22, 25, 28];
  hasRdv(d: number): boolean { return this.rdvDays.includes(d); }

  // ── Init ──────────────────────────────────────────────────
  ngOnInit(): void {
    this.LoadRv();
    this.LoadDocteur();
  }

  // ── Chargements ───────────────────────────────────────────
  LoadDocteur() {
    this.docteurService.getDocteur().subscribe({
      next: (data) => { this.docteurs = data; },
      error: (err) => { console.error('Erreur chargement docteurs', err); }
    });
  }

  LoadRv() {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.svc.getAllRV().subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.currentPage.set(1); // reset à la page 1 après chaque rechargement
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(
          err.status === 0
            ? 'Impossible de joindre le serveur PHP.'
            : `Erreur ${err.status} : ${err.statusText}`
        );
        this.isLoading.set(false);
      }
    });
  }

  // ── AJOUTER ───────────────────────────────────────────────
  ouvrirModalAdd() {
    this.formAdd = this.emptyForm();
    this.saveError.set(null);
    this.showModalAdd.set(true);
  }

  ajouterRv() {
    this.isSaving.set(true);
    this.saveError.set(null);
    this.svc.addRv(this.formAdd).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalAdd.set(false);
        this.LoadRv();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText}`);
        console.error('Erreur ajout RV', err);
      }
    });
  }

  // ── MODIFIER ──────────────────────────────────────────────
  ouvrirModalEdit(rv: Appointment) {
    // Copie profonde pour ne pas muter la liste
    this.formEdit = { ...rv };
    this.rvToEdit.set(rv);
    this.saveError.set(null);
    this.showModalEdit.set(true);
  }

  modifierRv() {
    const rv = this.rvToEdit();
    if (!rv) return;

    this.isSaving.set(true);
    this.saveError.set(null);
    this.svc.updateRv(rv.id, this.formEdit).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalEdit.set(false);
        this.LoadRv();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de la modification : ${err.statusText}`);
        console.error('Erreur modification RV', err);
      }
    });
  }

  // ── SUPPRIMER ─────────────────────────────────────────────
  ouvrirModalDelete(rv: Appointment) {
    this.rvToDelete.set(rv);
    this.showModalDelete.set(true);
  }

  supprimerRv() {
    const rv = this.rvToDelete();
    if (!rv) return;

    this.isSaving.set(true);
    this.svc.deleteRv(Number(rv.numero!)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalDelete.set(false);
        this.rvToDelete.set(null);
        this.LoadRv();
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Erreur suppression RV', err);
      }
    });
  }
  readonly confirme = computed(() => this.appointments().filter(r => r.status === "Confirmé").length)
  readonly annule = computed(() => this.appointments().filter(r => r.status === "Annulé").length)
  readonly attente = computed(() => this.appointments().filter(r => r.status === "En attente").length)

  // ── Pagination ────────────────────────────────────────────
  readonly pageSize = 10; // nombre de RV par page
  currentPage = signal(1);

  readonly totalPages = computed(() =>
    Math.ceil(this.appointments().length / this.pageSize)
  );

  readonly pagedAppointments = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.appointments().slice(start, start + this.pageSize);
  });

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
  }
}
