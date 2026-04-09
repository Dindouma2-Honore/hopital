import { Component, computed, inject, NgModule, OnInit, signal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Doctor, DoctorStatus } from '../../core/models/hospital.models';
import { StaffService } from '../../services/Staff/staff-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-doctors', standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './doctors.component.html', styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {
  // ── Filtres ───────────────────────────────────────────────
  searchQuery = signal('');
  filterDoc = signal('');
  filterStatus = signal('');
  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const d = this.filterDoc();
    const st = this.filterStatus();
    return this.docteurs().filter(p => {
      const name = `${p.nom} ${p.prenom}`.toLowerCase();
      return name.includes(q)
        && (!d || p.specialite === d)
        && (!st || p.status === st);
    });
  });

 readonly specialites = [
    'Cardiologie','Neurologie','Pédiatrie','Infirmier',
    'Urgences','Chirurgie','Oncologie',
    'Radiologie','Réanimation','Gynécologie',
    'Orthopédie','Ophtalmologie','Laboratoire'
  ];
  readonly statuses= ['Disponible','En congé','En consultation','En opération'];
  docteurs = signal<Doctor[]>([]);
  isSaving = signal(false)
  showModalAdd = signal(false)
  showModalEdit = signal(false)
  showModalDelete = signal(false)
  saveError = signal<string | null>(null);
  DocToEdit = signal<Doctor | null>(null);
  DocToDelete = signal<Doctor | null>(null);
  form: Doctor = this.emptyForm()
  formEdit: Doctor = this.emptyForm()
  private docteurService = inject(StaffService);
  readonly data = inject(DataService);
  showModal = signal(false);
  badgeClass(s: DoctorStatus): string {
    const m: Record<DoctorStatus, string> = { 'Disponible': 'badge-success-mc', 'En consultation': 'badge-info-mc', 'En congé': 'badge-muted-mc', 'En opération': 'badge-warning-mc' };
    return m[s];
  }
  readonly Enservice=computed(()=>this.docteurs().filter(d=>d.status==="En consultation" && "En opération").length)
  ngOnInit(): void {
    this.LoadDoctors();
  }
  LoadDoctors(): void {


    this.docteurService.getDocteur().subscribe({
      next: (data) => {

        this.docteurs.set(data);
        this.currentPage.set(1)
      },
      error: (err) => {
        console.log("Erreur", err);
        alert("Erreur de chargement")

      }
    });
  }
  AjouterStaff(): void {
    this.isSaving.set(true)
    this.saveError.set(null)
    this.docteurService.addDocteur(this.form).subscribe({
      next: () => {
        this.showModalAdd.set(false)
        this.LoadDoctors()
      },
      error: (err) => {
        this.showModalAdd.set(true)
        this.isSaving.set(false)
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText || err.message}`)
      },
    })
  }
  ModifierStaff():void{
    const d=this.DocToEdit()
    if(!d)return;
    this.isSaving.set(true)
    this.saveError.set(null)
    this.docteurService.updateDocteur(Number(d.id),this.formEdit).subscribe({
      next:() =>{
        this.isSaving.set(false)
        this.showModalEdit.set(false)
        this.LoadDoctors()
      },
      error:(err) =>{
        console.error("erreur de modification",err)
        this.isSaving.set(true)
        this.showModalEdit.set(true)
      },
    })
  }
  supprimerDocteur(){
    const d=this.DocToDelete()
    if(!d) return;
    this.isSaving.set(true)
    this.saveError.set(null)
    this.docteurService.deleteDocteur(Number(d.id)).subscribe({
      next:()=> {
        this.isSaving.set(false)
        this.showModalDelete.set(false)
        this.DocToDelete.set(null)
        this.LoadDoctors()
      },
      error:(err)=> {
        console.error("Erreur de suppression",err);
        this.isSaving.set(true)
        this.showModalDelete.set(true)
        
      },
    })
  }
  emptyForm(): Doctor {
    return {
      matricule: '', status: 'Disponible', nom: '', prenom: '', specialite: '', phone: '', email: '', experience: '', color: ''
    }
  }
  openEdit(d:Doctor):void{
    this.formEdit={
      ...d
    }
    this.DocToEdit.set(d)
    
    this.showModalEdit.set(true)
  }
  openDelete(d:Doctor):void{
    this.DocToDelete.set(d)
    this.showModalDelete.set(true)
  }

  //==========PAGINATION================

  readonly pageSige=8
  currentPage=signal(1)
  readonly totalPage=computed(()=>
  Math.max(1,Math.ceil(this.filtered().length / this.pageSige) )
  )
  readonly pageDocteurs=computed(()=>{
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
