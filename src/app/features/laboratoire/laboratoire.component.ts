import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { LaboService } from '../../services/LaboService/labo-service';
import { LabResult, LabTest } from '../../core/models/hospital.models';
import { FormsModule } from '@angular/forms';
import { ServiceResultatTest } from '../../services/serviceResult/service-resultat-test';
@Component({
   selector:'app-laboratoire',
   standalone:true,
   imports:[FormsModule],
  templateUrl:'./laboratoire.component.html',
   styleUrls:['./laboratoire.component.scss'] })
export class LaboratoireComponent implements OnInit { 
  showModalAdd=signal(false)
  showModalAddResultat=signal(false)
  showModalEdit=signal(false)
  showModalEditResultat=signal(false)
  showModalDelete=signal(false)
  isSaving=signal(false)
  form:LabTest=this.emptyForm()
  Resultform:LabResult=this.emptyFormResult()
  private service=inject(LaboService)
  private serviceResult=inject(ServiceResultatTest)
  LaboResults=signal<LabResult[]>([])
  LaboTests=signal<LabTest[]>([])
  TestToEdit=signal<LabTest | null>(null)
  ResultToEdit=signal<LabResult | null>(null)
  ResultToDelete=signal<LabResult | null>(null)
  TestToDelete=signal<LabTest | null>(null)
 ngOnInit(): void {
   this.loadLabTest();
   this.loadResustTest()
 }
 loadLabTest():void{
  this.service.getLabTest().subscribe({
    next:(value) =>{
      this.LaboTests.set(value)
      this.currentPage.set(1)
    },
    error:(err)=> {
      console.log("Erreur lors de chargement",err);
      
    },
  })
 }
//  ======================
// GESTION DES EXAMENS
// =====================
 loadResustTest():void{
  this.serviceResult.getLabTest().subscribe({
    next:(data) =>{
      this.LaboResults.set(data)
      this.currentPage.set(1)
    },
    error:(err) =>{
      console.error("Erreur de chargement");
      
    },
  })
 }
 AjouterTest(){
  this.isSaving.set(true);
  this.service.addLabTest(this.form).subscribe({
    next:()=> {
      this.isSaving.set(false)
      this.showModalAdd.set(false)
      this.loadLabTest()
    },
    error:(err)=> {
      this.isSaving.set(true)
      this.showModalAdd.set(true)
      console.log("Erreur d'ajout: ",err);
      
    },
  })
 }
 ModifierTest():void{
  const t=this.TestToEdit()
  if(!t) return;
  this.isSaving.set(true)
  this.service.updateLabTest(Number(t.numero),this.form).subscribe({
    next:() =>{
      this.isSaving.set(false)
      this.showModalEdit.set(false)
      this.loadLabTest()
    },
    error:(err) =>{
      console.log("Erreur de modification",err);
      this.isSaving.set(true)
      this.showModalEdit.set(true)
      
    },
  })
 }
 supprimerTest():void{
  const t=this.TestToDelete()
  if(!t) return;
  this.isSaving.set(true)
  this.service.deleteLabTest(Number(t.numero)).subscribe({
    next:()=> {
      this.isSaving.set(false)
      this.showModalDelete.set(false)
      this.loadLabTest()
    },
    error:(err) =>{
      this.isSaving.set(true)
      console.log("Erreur lors de la suppression :",err);
      this.showModalDelete.set(true)
      
    },
  })
 }
 emptyForm():LabTest{
  return{
    id:'',patient:'',prescripteur:'',status:'Prêt',type:'',heure:''
  }
 }
 emptyFormResult():LabResult{
  return{
    patient:'',valeur:'',status:'Normal',unite:'',reference:'',nom:''
  }
 }
 openEdit(t:LabTest):void{
  this.form={...t}
  this.TestToEdit.set(t)
  this.showModalEdit.set(true)
 }
 openDelete(t:LabTest):void{
  this.TestToDelete.set(t)
  this.showModalDelete.set(true)
 }
 //  ======================
// GESTION DES RESULTATS
// =====================
openEditResult(r:LabResult){
  this.Resultform={...r}
  this.ResultToEdit.set(r)
  this.showModalEditResultat.set(true)
}
AjouterResultat():void{
  this.isSaving.set(true)
  this.serviceResult.addLabTest(this.Resultform).subscribe({
    next:()=> {
      this.loadResustTest()
      this.isSaving.set(false)
      this.showModalAddResultat.set(false)
    },
    error:(err) =>{
      this.isSaving.set(true)
      this.showModalAddResultat.set(true)
      console.error("Erreur d'ajout :",err);
      
    },
  })
}
ModifierResultat():void{
  const r=this.ResultToEdit()
  if(!r) return;
  this.isSaving.set(true)
  this.serviceResult.updateLabTest(Number(r.numero),this.Resultform).subscribe({
    next:()=> {
      this.isSaving.set(false)
      this.loadResustTest()
      this.showModalAddResultat.set(false)
    },
    error:(err)=> {
      console.log("Erreur de modification",err);
      this.isSaving.set(true)
    },
  })
}
 readonly attente=computed(()=>this.LaboTests().filter(t =>t.status==="Attente").length)
 readonly pret=computed(()=>this.LaboTests().filter(r =>r.status==='Prêt').length)
 readonly critique=computed(()=>this.LaboResults().filter(r =>r.status==='Critique').length)
  readonly status = [
    'Prêt','En cours','Planifié','48h'
    
  ];
   // ── Filtres ───────────────────────────────────────────────
  searchQuery = signal('');
  filterTest = signal('');
  filterStatus = signal('');
  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const t = this.filterTest();
    const st = this.filterStatus();
    return this.LaboTests().filter(p => {
      const name = `${p.patient}`.toLowerCase();
      return name.includes(q)
        && (!st || p.status === st);
       
    });
  })
  readonly filteredResult = computed(() => {
    const q = this.searchQuery().toLowerCase();
    
    return this.LaboResults().filter(p => {
      const name = `${p.patient}`.toLowerCase();
      return name.includes(q)
       
       
    });
  })
  readonly pageSige=4
  currentPage=signal(1)
  readonly totalPage=computed(()=>
  Math.max(1,Math.ceil(this.filtered().length / this.pageSige) )
  )
  readonly pageLabo=computed(()=>{
    const start=(this.currentPage()-1) * this.pageSige
    return this.filtered().slice(start,start + this.pageSige)
  })
  readonly pageResultat=computed(()=>{
    const start=(this.currentPage()-1) * this.pageSige
    return this.filteredResult().slice(start,start + this.pageSige)
  })
  prevPage(){
    if(this.currentPage() > 1){this.currentPage.update(p=>p-1)}
  }
  nextPage(){
    if(this.currentPage() < this.totalPage()){this.currentPage.update(p=>p+1)}
  }
 }
