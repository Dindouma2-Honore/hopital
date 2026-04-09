import { Component, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { DepartemetService } from '../../services/DeptService/departemet-service';
import { Department, Patient } from '../../core/models/hospital.models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patientService/patient-service';
@Component({
   selector:'app-departments',
    standalone:true,
     imports:[CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl:'./departments.component.html', styleUrls:['./departments.component.scss'] })
export class DepartmentsComponent implements OnInit { 
  isLoading = signal(true);
  errorMsg  = signal<string | null>(null);
  isSaving  = signal(false);   // spinner bouton Enregistrer
  saveError = signal<string | null>(null);
  showModalAdd    = signal(false);
  showModalEdit   = signal(false);
  showModalDelete = signal(false);
  form:Department=this.emptyForm()
  private departmentservice=inject(DepartemetService)
   private svc = inject(PatientService);
  departments=signal<Department[]>([]);
  DepToDelete=signal<Department | null>(null);
  patients=signal<Patient[]>([]);
  ngOnInit(): void {
    this.loadDepartement()
  }
  loadDepartement(){
    this.departmentservice.getDept().subscribe({
      next:(value)=> {
        this.departments.set(value)
      },
      error(err) {
        console.log("erreur de chargement",err);
        
      },
    })
  }
  
  
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

    this.departmentservice.addDept(this.form).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showModalAdd.set(false);
        this.loadDepartement();          // recharge la liste depuis l'API
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(`Erreur lors de l'ajout : ${err.statusText || err.message}`);
      }
    });
  }
  // ══════════════════════════════════════════════════════════
    // MODIFIER — Ouvrir modal pré-rempli avec le departement
    // ══════════════════════════════════════════════════════════
    openEdit(d: Department): void {
      
      
      this.saveError.set(null);
      this.showModalEdit.set(true);
      this.form={...d}
    }
  
    confirmEdit(): void {
      if (!this.formValid()) return;
      this.isSaving.set(true);
      this.saveError.set(null);
  
      this.departmentservice.updateDept(this.form.id, this.form).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showModalEdit.set(false);
          this.loadDepartement();          // recharge la liste depuis l'API
        },
        error: (err) => {
          this.isSaving.set(true);
          this.saveError.set(`Erreur lors de la modification : ${err.statusText || err.message}`);
        }
      });
    }
  formValid(): boolean {
    return !!(
      this.form.nom.trim() &&
      this.form.icon.trim() &&
      this.form.nombreLit > 0 &&
      this.form.nombreStaff > 0 &&
      this.form.occupation
    );
  }
  emptyForm():Department{
    return{
      id:'',
      nom:'',
      icon:'',
      nombreStaff:0,
      nombreLit:0,
      occupation:0,


    }
  }
  //=======================Suppression==============================
  openDelete(d: Department): void {
      // Pré-remplir le formulaire avec les données du patient cliqué
      
      this.form={...d}
      this.DepToDelete.set(d)
      this.saveError.set(null);
      this.showModalDelete.set(true);
    }
    supprimerDepartemet(){
      const d=this.DepToDelete()
      if(!d) return;
      this.isSaving.set(true)
      this.saveError.set(null)
      this.departmentservice.deleteDept(Number(d.numero)).subscribe({
        next:()=> {
          this.isSaving.set(false)
          this.showModalDelete.set(false)
          this.loadDepartement()
        },
        error:(err) =>{
          this.isSaving.set(true)
          this.saveError.set(`Erreur lors de la modification : ${err.statusText || err.message}`);
        },
      })
    }
  // ── Fermeture des modals ──────────────────────────────────
  closeAdd():    void { this.showModalAdd.set(false); }
  closeEdit():   void { this.showModalEdit.set(false); }
  closeDelete(): void { this.showModalDelete.set(false);  }
 }
