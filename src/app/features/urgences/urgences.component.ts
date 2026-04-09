import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ServiceUrgence } from '../../services/serviceUrgence/service-urgence';
import { UrgencyCase } from '../../core/models/hospital.models';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component(
  {
    selector: 'app-urgences',
    standalone: true, imports: [FormsModule, CommonModule, ReactiveFormsModule],
    templateUrl: './urgences.component.html',
    styleUrls: ['./urgences.component.scss']
  })
export class UrgencesComponent implements OnInit {
  private service = inject(ServiceUrgence)
  urgences = signal<UrgencyCase[]>([])
  form: UrgencyCase = this.emptyForm()
  showModalAdd = signal(false)
  showModalEdit = signal(false)
  searchQuery = signal('')
  showModalDelete = signal(false)
  UrgenceToDelete = signal<UrgencyCase | null>(null)
  UrgenceToEdit = signal<UrgencyCase | null>(null)

  saveError = signal<string | null>(null);


  isSaving = signal(false)

  ngOnInit(): void {
    this.loadUrgence()
  }
  loadUrgence(): void {
    this.service.getUrgence().subscribe({
      next: (data) => {
        this.urgences.set(data)
      },
      error: (err) => {
        console.log("Erreur de Chargement");

      },
    })
  }
  refresh(): void {
    this.loadUrgence()
  }
  confirmAdd(): void {
    this.isSaving.set(true)
    this.saveError.set(null);
    this.service.addUrgence(this.form).subscribe({
      next: () => {
        this.loadUrgence()
        this.showModalAdd.set(false)
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText || err.message}`);
      }
    })
  }

  openAdd(): void {
    this.form = this.emptyForm();
    this.saveError.set(null);
    this.showModalAdd.set(true);
  }
  openEdit(c: UrgencyCase): void {
   
    this.form = { ...c }
    this.saveError.set(null);
    this.UrgenceToEdit.set(c)
    this.showModalEdit.set(true)
  }
  updateUrgence(): void {
    const c =this.UrgenceToEdit()
    if(!c) return;
    this.isSaving.set(true)
    this.saveError.set(null)
    this.service.updateUrgence(Number(this.form.numero), this.form).subscribe({
      next: (value) => {
        this.isSaving.set(false)
        this.showModalEdit.set(false)
        this.loadUrgence()
      },
      error: (err) => {
        this.isSaving.set(false);
        console.log("Erreur de modification", err);
        this.saveError.set(`Erreur lors de la modification : ${err.statusText || err.message}`);
      },
    })
  }
  confirmDelete():void{
    const c=this.UrgenceToDelete()
    if (!c) return;
    this.isSaving.set(true)
    this.saveError.set(null)
    this.service.deleteUrgence(c.numero!).subscribe({
      next:()=> {
        this.UrgenceToDelete.set(null)
        this.isSaving.set(false);
        this.showModalDelete.set(false)
        this.urgences.update(list=> list.filter(x =>x.numero !== c.numero))
      },
      error:(err) =>{
         this.isSaving.set(false);
        this.saveError.set(`Erreur lors de la suppression : ${err.statusText || err.message}`);
      },
    })
  }
  openDelete(c: UrgencyCase): void {
    this.UrgenceToDelete.set(c);
    this.saveError.set(null);
    this.showModalDelete.set(true);
   }
  closeAdd(): void { this.showModalAdd.set(false); }
  closeEdit(): void { this.showModalEdit.set(false); }
  closeDelete(): void { this.showModalDelete.set(false); this.UrgenceToDelete.set(null); }
  emptyForm(): UrgencyCase {
    return {
      id: '', priorite: 'Critique', patient: '', heureArrive: '', docteur: '', status: '', raison: ''
    }
  }
  // ── Utilitaires affichage ─────────────────────────────────
  initials(p: UrgencyCase): string {
    return ((p.patient?.[0] ?? '') + (p.patient?.[1] ?? '')).toUpperCase();
  }
   readonly critique=  computed(()=>this.urgences().filter(u=>u.priorite==="Critique").length);
   readonly urgent= computed(()=>this.urgences().filter(u=>u.priorite==="Urgent").length);
   readonly standard=computed(()=>this.urgences().filter(u=>u.priorite==="Standard").length)
   readonly filtered= computed(()=>{
    const d =this.searchQuery().toLowerCase();
    return this.urgences().filter(p=>{
      const nom=`${p.patient}`.toLowerCase()
      return nom.includes(d) 
    })
  })
    readonly pageSige=5
  currentPage=signal(1)
  readonly totalPage=computed(()=>
  Math.max(1,Math.ceil(this.filtered().length / this.pageSige) )
  )
  readonly pageUrgences=computed(()=>{
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
