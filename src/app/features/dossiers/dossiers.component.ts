import { Component,computed, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Dossier, ListeMedicament, Patient } from '../../core/models/hospital.models';
import { PatientService } from '../../services/patientService/patient-service';
import { ServviceDossier } from '../../services/serviceDossier/servvice-dossier';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dossiers.component.html',
  styleUrls: ['./dossiers.component.scss']
})
export class DossiersComponent implements OnInit {
  searchQuery=signal('')
  filterID=signal('')
  servicepatient = inject(PatientService)
  servicedossier = inject(ServviceDossier)
  patients = signal<Patient[]>([])
  dossiers = signal<Dossier[]>([])
  showModalNew = signal(false)
  showModalEdit = signal(false)
  isSaving = signal(false)
  saveError = signal<string | null>(null)
  formToEdit = signal<Dossier | null>(null)
  form: Dossier = this.emptyForm()
  formEdit: Dossier = this.emptyForm()

  ngOnInit(): void {
    this.loadPatient()
    this.loadDossier()
  }
  loadPatient(): void {
    this.servicepatient.getPatients().subscribe({
      next: (value) => {
        this.patients.set(value)
      },
      error: (err) => {
        console.error("Erreur lors de chargement", err);

      },
    })
  }
  loadDossier(): void {
    this.servicedossier.getDossier().subscribe({
      next: (value) => {
        this.dossiers.set(value)
      },
      error: (err) => {
        console.error("Erreur de chargement des dossiers", err);

      },
    })
  }
  AjouterDossier(): void {
    this.isSaving.set(true)
    this.saveError.set(null)
    this.servicedossier.addDossier(this.form).subscribe({
      next: () => {
        this.isSaving.set(false)
        this.showModalNew.set(false)
        this.loadDossier()
      },
      error: (err) => {
        this.isSaving.set(true)
        this.showModalNew.set(true)
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText}`);
        console.error('Erreur ajout Dossier', err);
      }

    })
  }
  
  ModifierDossier(): void { 
     const d=this.formToEdit()
     if(!d) return;
     this.isSaving.set(true)
     this.saveError.set(null)
     this.servicedossier.updateDossier(Number(d.numero),this.formEdit).subscribe({
      next:()=> {
        this.isSaving.set(false)
        this.loadDossier()
        this.showModalEdit.set(false)
      },
      error:(err)=> {
        this.isSaving.set(false)
        this.saveError.set(`Erreur de modification de dossier medicaux :${err.statusText}`)
        console.error("Erreur de modification",err);
        
      },
     })
  }
  supprimerLigneMedAdd(index: number): void { this.form.medicament = this.form.medicament.filter((_, i) => i !== index); }
  ajouterLigneMedAdd(): void { this.form.medicament = [...this.form.medicament, this.emptyMed()]; }
  // ── Gestion des lignes médicaments (Edit) ─────────────────
  ajouterLigneMedEdit(): void {
    this.formEdit.medicament = [...this.formEdit.medicament, this.emptyMed()];
  }

  supprimerLigneMedEdit(index: number): void {
    this.formEdit.medicament = this.formEdit.medicament.filter((_, i) => i !== index);
  }
  openAdd(): void {
    this.form = this.emptyForm()
    this.showModalNew.set(true)
    this.form.medicament = [this.emptyMed()]
  }
  openEdit(d: Dossier) {
    this.showModalEdit.set(true)

    this.formEdit = { ...d, medicament: d.medicament.map(m => ({ ...m })) }
    this.formToEdit.set(d)
  }
  emptyForm(): Dossier {
    return {
      id: '', patient: '', sexe: 'M', age: 0, departement: '', bloodGroup: '', allergie: [], temperature: '', tension: '', spo2: '', medicament: [], color: '', frequence: '', antecedent: ''

    }
  }
  emptyMed(): ListeMedicament {
    return { produit: '', dosage: '', prescripteur: '', debut: '', frequence: '' }
  }
  initials(p: Dossier): string {
    return (p.patient.slice(0, 1)).toUpperCase();
  }
  readonly filtered= computed(()=>{
    const d =this.searchQuery().toLowerCase();
    const i= this.filterID()
    return this.dossiers().filter(p=>{
      const nom=`${p.patient}`.toLowerCase()
      return nom.includes(d) && (!i || p.id===i)
    })
  })
   //==========PAGINATION================

  readonly pageSige=1
  currentPage=signal(1)
  readonly totalPage=computed(()=>
  Math.max(1,Math.ceil(this.filtered().length / this.pageSige) )
  )
  readonly pageDossier=computed(()=>{
    const start=(this.currentPage()-1) * this.pageSige
    return this.filtered().slice(start,start + this.pageSige)
  })
  prevPage(){
    if(this.currentPage() > 1){this.currentPage.update(p=>p-1)}
  }
  nextPage(){
    if(this.currentPage() < this.totalPage()){this.currentPage.update(p=>p+1)}
  }
  
}
