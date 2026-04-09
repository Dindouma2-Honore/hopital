// ============================================================
// src/app/features/consultation/consultation.component.ts
// Gestion des consultations médicales
// ============================================================
import { Component, inject, signal, computed, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ConsultationService } from '../../services/consultationService/consultation-service';
import { Consultation, Doctor, Patient } from '../../core/models/hospital.models';
import { PatientService } from '../../services/patientService/patient-service';
import { StaffService } from '../../services/Staff/staff-service';



@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit {
  // readonly data = inject(DataService);
  // private cdr = inject(ChangeDetectorRef);
  showModalNew = signal(false);
  showModalDetail = signal(false);
  showModalEdit = signal(false);
  showModalDelete = signal(false);
  selectedConsult = signal<Consultation | null>(null);
  searchQuery = signal('');
  filterDoctor = signal('');
  filterType = signal('');
  isLoading = signal(false);
  selectedConsultation = signal<Consultation | null>(null);  // pour impression
  ConToEdit = signal<Consultation | null>(null);
  ConToDelete = signal<Consultation | null>(null);
  private consultationservice = inject(ConsultationService)
  private svc = inject(PatientService)
  private svd = inject(StaffService)
  consultations = signal<Consultation[]>([])
  patients = signal<Patient[]>([])
  docteurs = signal<Doctor[]>([])
  isSaving = signal(false)
  saveError = signal<string | null>(null)
  form: Consultation = this.emptyForm()
  formEdit: Consultation = this.emptyForm()
  ngOnInit(): void {
    this.loadConsultation()
    this.loadPatient();
    this.loadDocteur()
  }
  loadConsultation() {
    this.isLoading = signal(false);
    this.consultationservice.getConsultation().subscribe({
      next: (data) => {
        this.consultations.set(data);
        this.currentPage.set(1)
      },
      error: (err) => {
        console.log("Erreur de chargement:", err);
        this.isLoading = signal(true);
      },
    })
  }
  loadPatient() {
    this.svc.getPatients().subscribe({
      next: (value) => {
        this.patients.set(value)
      },
      error: (err) => {
        console.log("Erreur de chargement : ", err);

      },
    })
  }
  loadDocteur() {
    this.svd.getDocteur().subscribe({
      next: (value) => {
        this.docteurs.set(value)
      },
      error: (err) => {
        console.log("Erreur de chargement : ", err);

      },
    })
  }
  AjouterConsultation() {
    this.isSaving.set(true)
    this.saveError.set(null)
    this.consultationservice.addConsultation(this.form).subscribe({
      next: () => {
        this.loadConsultation()
        this.showModalNew.set(false)
      },
      error: (err) => {
        this.showModalNew.set(true)
        this.isSaving.set(false)
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText || err.message}`)
      },
    })
  }

  openEdit(c: Consultation): void {
    this.formEdit = {
       ...c 
      }
    this.ConToEdit.set(c)
    this.saveError.set(null);
    this.showModalEdit.set(true);
  }
  ModifierConsultation(): void {
    const c = this.ConToEdit()
    if (!c) return;
    this.isSaving.set(false)
    this.saveError.set(null)
    this.consultationservice.updateConsultation(Number(c.numero), this.formEdit).subscribe({
      next: (value) => {
        this.isSaving.set(false)
        this.showModalEdit.set(false)
        this.loadConsultation()
      },
      error: (err) => {
        this.isSaving.set(false)
        this.saveError.set(`Erreur lors de la modification : ${err.statusText}`)
        console.error('Erreur de modification', err);

      },
    })
  }
  supprimerConsultation():void{
    const c=this.ConToDelete()
    if(!c) return;
    this.isSaving.set(true);
    this.consultationservice.deleteConsultation(Number(c.numero)).subscribe({
      next:()=>{
        this.isSaving.set(false);
        this.showModalDelete.set(false);
        this.ConToDelete.set(null);
        this.loadConsultation()
      },
      error:(err)=>{
        this.isSaving.set(true)
        console.log("Erreur de suppresion",err)
      }
    })
  }
  emptyForm(): Consultation {
    return {
      id: '', patient: '', medecin: '', specialite: '', date: '', heure: '', motif: '', diagnostic: '', status: 'En cours', type: 'Première visite',
      note: '', color: ''
    }
  }
  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const d = this.filterDoctor();
    const t = this.filterType();
    return this.consultations().filter(c =>
      c.patient.toLowerCase().includes(q) &&
      (!d || c.medecin === d) &&
      (!t || c.type === t)
    );
  });
// ======================PAGINATION===================

 readonly pageSize=4
 currentPage=signal(1)
 readonly totalPage=computed(()=>
 Math.max(1,Math.ceil(this.filtered().length) / this.pageSize))
  readonly pageConsultation= computed(()=>{
    const start=(this.currentPage()-1) *  this.pageSize
    return this.filtered().slice(start,start + this.pageSize)
  })
  prevPage(){
    if(this.currentPage() >1){this.currentPage.update(p=>p-1)}
  }
  nextPage(){
    if(this.currentPage() <this.totalPage()){this.currentPage.update(p=>p+1)}
  }
  // Ajouter cette propriété
  private readonly todayStr = this.formatToday();

  private formatToday(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    return `${dd}/${mm}/${yy}`; // → "01/04/26"
  }

  readonly stats = computed(() => ({
    Premiere:   this.consultations().filter(o => o.type === 'Première visite').length,
    urgence: this.consultations().filter(o => o.type === 'Urgence').length,
    Suivi:  this.consultations().filter(o => o.type === 'Suivi').length,
    Controle:  this.consultations().filter(o => o.type === 'Contrôle').length,
    total:    this.consultations().length,
  }));
  openDetail(c: Consultation): void {
    this.selectedConsult.set(c);
    this.showModalDetail.set(true);
  }

  closeEdit(): void { this.showModalEdit.set(false); }
  openDelete(c:Consultation): void {this.ConToDelete.set(c); this.showModalDelete.set(true); }
  statusBadge(s: string): string {
    const m: Record<string, string> = {
      'En cours': 'badge-info-mc',
      'Terminée': 'badge-success-mc',
      'Planifiée': 'badge-warning-mc',
      'Annulée': 'badge-danger-mc',
    };
    return m[s] ?? 'badge-muted-mc';
  }

  typeBadge(t: string): string {
    const m: Record<string, string> = {
      'Première visite': 'badge-info-mc',
      'Contrôle': 'badge-success-mc',
      'Urgence': 'badge-danger-mc',
      'Suivi': 'badge-muted-mc',
    };
    return m[t] ?? 'badge-muted-mc';
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }
}
