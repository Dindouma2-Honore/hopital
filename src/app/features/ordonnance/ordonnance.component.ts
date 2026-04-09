// ============================================================
// src/app/features/ordonnance/ordonnance.component.ts
// ============================================================
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Doctor, MedicationLine, Ordonnance, Patient } from '../../core/models/hospital.models';
import { StaffService } from '../../services/Staff/staff-service';
import { OrdonnanceService } from '../../services/OrdonnanceService/ordonnance-service';
import { PatientService } from '../../services/patientService/patient-service';

@Component({
  selector: 'app-ordonnance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ordonnance.component.html',
  styleUrls: ['./ordonnance.component.scss']
})
export class OrdonnanceComponent implements OnInit {

  private ordonnanceService = inject(OrdonnanceService);
  private patientService    = inject(PatientService);
  private docteurService    = inject(StaffService);

  // ── Données ───────────────────────────────────────────────
  ordonnances = signal<Ordonnance[]>([]);
  patients    = signal<Patient[]>([]);
  docteurs    = signal<Doctor[]>([]);

  // ── États UI ──────────────────────────────────────────────
  isLoading  = signal(false);
  isSaving   = signal(false);
  errorMsg   = signal<string | null>(null);
  saveError  = signal<string | null>(null);

  // ── Modals ────────────────────────────────────────────────
  showModalNew    = signal(false);
  showModalEdit   = signal(false);
  showModalDelete = signal(false);
  showModalPrint  = signal(false);

  selectedOrdo  = signal<Ordonnance | null>(null);  // pour impression
  ordoToEdit    = signal<Ordonnance | null>(null);
  ordoToDelete  = signal<Ordonnance | null>(null);

  // ── Filtres ───────────────────────────────────────────────
  searchQuery  = signal('');
  filterStatus = signal('');
  filterDoctor = signal('');

  // ── Formulaires ───────────────────────────────────────────
  formAdd:  Ordonnance = this.emptyForm();
  formEdit: Ordonnance = this.emptyForm();

  // ─────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.LoadOrdonnance();
    this.LoadDoctors();
    this.loadPatient();
  }

  // ── Chargements ───────────────────────────────────────────
  LoadOrdonnance(): void {
    this.isLoading.set(true);
    this.ordonnanceService.getOrdo().subscribe({
      next:  (data) => { this.ordonnances.set(data); this.isLoading.set(false); this.currentPage.set(1) },
      error: (err)  => { console.error('Erreur ordonnances', err); this.isLoading.set(false); }
    });
  }

  LoadDoctors(): void {
    this.docteurService.getDocteur().subscribe({
      next:  (data) => { this.docteurs.set(data); },
      error: (err)  => { console.error('Erreur docteurs', err); }
    });
  }

  loadPatient(): void {
    this.patientService.getPatients().subscribe({
      next:  (data) => { this.patients.set(data); },
      error: (err)  => { console.error('Erreur patients', err); }
    });
  }

  // ── Formulaire vide ───────────────────────────────────────
  emptyForm(): Ordonnance {
    return {
      id: '', idConsultation: '', patient: '', prescripteur: '',
      date: '', validite: '', status: 'Active', medicament: [], note: ''
    };
  }

  emptyMed(): MedicationLine {
    return { produit: '', posologie: '', frequence: '', duree: '', quantite: '', warning: '' };
  }

  // ── Gestion des lignes médicaments (Add) ──────────────────
  ajouterLigneMedAdd(): void {
    this.formAdd.medicament = [...this.formAdd.medicament, this.emptyMed()];
  }

  supprimerLigneMedAdd(index: number): void {
    this.formAdd.medicament = this.formAdd.medicament.filter((_, i) => i !== index);
  }

  // ── Gestion des lignes médicaments (Edit) ─────────────────
  ajouterLigneMedEdit(): void {
    this.formEdit.medicament = [...this.formEdit.medicament, this.emptyMed()];
  }

  supprimerLigneMedEdit(index: number): void {
    this.formEdit.medicament = this.formEdit.medicament.filter((_, i) => i !== index);
  }

  // ── AJOUTER ───────────────────────────────────────────────
  ouvrirModalAdd(): void {
    this.formAdd = this.emptyForm();
    this.formAdd.medicament = [this.emptyMed()]; // 1 ligne par défaut
    this.saveError.set(null);
    this.showModalNew.set(true);
  }

  ajouterOrdo(): void {
    this.isSaving.set(true);
    this.saveError.set(null);
    this.ordonnanceService.addOrdo(this.formAdd).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalNew.set(false);
        this.LoadOrdonnance();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText}`);
        console.error('Erreur ajout ordonnance', err);
      }
    });
  }

  // ── MODIFIER ──────────────────────────────────────────────
  ouvrirModalEdit(o: Ordonnance): void {
    // Copie profonde avec les médicaments
    this.formEdit = {
      ...o,
      medicament: o.medicament.map(m => ({ ...m }))
    };
    this.ordoToEdit.set(o);
    this.saveError.set(null);
    this.showModalEdit.set(true);
  }

  modifierOrdo(): void {
    const o = this.ordoToEdit();
    if (!o) return;
    this.isSaving.set(true);
    this.saveError.set(null);
    this.ordonnanceService.updateOrdo(Number(o.numero), this.formEdit).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalEdit.set(false);
        this.LoadOrdonnance();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de la modification : ${err.statusText}`);
        console.error('Erreur modification ordonnance', err);
      }
    });
  }

  // ── SUPPRIMER ─────────────────────────────────────────────
  ouvrirModalDelete(o: Ordonnance): void {
    this.ordoToDelete.set(o);
    this.showModalDelete.set(true);
  }

  supprimerOrdo(): void {
    const o = this.ordoToDelete();
    if (!o) return;
    this.isSaving.set(true);
    this.ordonnanceService.deleteOrdo(Number(o.numero)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalDelete.set(false);
        this.ordoToDelete.set(null);
        this.LoadOrdonnance();
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error('Erreur suppression ordonnance', err);
      }
    });
  }

  // ── IMPRESSION ────────────────────────────────────────────
  openPrint(o: Ordonnance): void {
    this.selectedOrdo.set(o);
    this.showModalPrint.set(true);
  }

  // ── Computed ──────────────────────────────────────────────
  readonly filtered = computed(() => {
    const q  = this.searchQuery().toLowerCase();
    const st = this.filterStatus();
    const d  = this.filterDoctor();
    return this.ordonnances().filter(o =>
      (o.patient.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)) &&
      (!st || o.status === st) &&
      (!d  || o.prescripteur === d)
    );
  });

  readonly stats = computed(() => ({
    active:   this.ordonnances().filter(o => o.status === 'Active').length,
    delivree: this.ordonnances().filter(o => o.status === 'Délivrée').length,
    expiree:  this.ordonnances().filter(o => o.status === 'Expirée').length,
    total:    this.ordonnances().length,
  }));

  // ── Utilitaires ───────────────────────────────────────────
  statusBadge(s: string): string {
    const m: Record<string, string> = {
      'Active':   'badge-success-mc',
      'Expirée':  'badge-danger-mc',
      'Délivrée': 'badge-info-mc',
      'Annulée':  'badge-muted-mc',
    };
    return m[s] ?? 'badge-muted-mc';
  }

  initials(patient: string): string {
    return patient.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }
  readonly pageSize=4
  currentPage=signal(1)
  readonly totalPage=computed(()=>
    Math.max(1,Math.ceil(this.filtered().length / this.pageSize) )              
  )
  readonly pageOrdonnance= computed(()=>{
    const start=(this.currentPage()-1) * this.pageSize
    return this.filtered().slice(start, start + this.pageSize)
  })
  prevPage(){
    if(this.currentPage() >1){this.currentPage.update(p=>p-1)}
  }
  nextPage(){
    if(this.currentPage() < this.totalPage()){this.currentPage.update(p=>p+1)}
  }







}
