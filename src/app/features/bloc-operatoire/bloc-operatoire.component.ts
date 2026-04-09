import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Operation, OperationStatus } from '../../core/models/hospital.models';
import { ServiceOperation } from '../../services/operationService/service-operation';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bloc-operatoire',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bloc-operatoire.component.html',
  styleUrls: ['./bloc-operatoire.component.scss']
})
export class BlocOperatoireComponent implements OnInit {
  private service = inject(ServiceOperation);
  operations = signal<Operation[]>([]);
  showModalAdd=signal(false)
  showModalEdit=signal(false)
  showModalDelete=signal(false)
  searchQuery=signal('')
  isSaving=signal(false)
  form:Operation=this.emptyForm()
  formEdit:Operation=this.emptyForm()
  saveError= signal<Operation | null>(null);
  OpToEdit= signal<Operation | null>(null);
  OpToDelete= signal<Operation | null>(null);
  ngOnInit(): void {
    this.loadOperation();
  }

  loadOperation(): void {
    this.service.getOperation().subscribe({
      next: (value) => {this.operations.set(value);this.currentPage.set(1)},
      error: (err) => console.log('Erreur de chargement', err),
    });
  }
 AjouterOperation():void{
  this.isSaving.set(true)
  this.saveError.set(null)
  this.service.addOperation(this.form).subscribe({
    next:()=>{
      this.isSaving.set(false)
      this.showModalAdd.set(false)
      this.loadOperation()
    },
    error:(err) =>{
      console.log("Erreur de l'ajout :",err);
      this.isSaving.set(true)
      this.showModalAdd.set(true)
      
    },
  })
 }
  ModifierOperation(){
    const op=this.OpToEdit()
    if(!op)return;
    this.isSaving.set(true)
    this.saveError.set(null)
    this.service.updateOperation(Number(op.id),this.formEdit).subscribe({
      next:()=> {
        this.isSaving.set(false)
        this.showModalEdit.set(false)
        this.loadOperation()
      },
      error:(err)=> {
        this.isSaving.set(true)
        console.error("Erreur de modification:",err)
      },
    })
  }
 supprimerOperation(){
  const op=this.OpToDelete()
  if(!op) return;
  this.isSaving.set(true)
  this.service.deleteOperation(Number(op.id)).subscribe({
    next:() =>{
      this.isSaving.set(false)
      this.showModalDelete.set(false)
      this.loadOperation()
    },
    error:(err) =>{
      this.isSaving.set(true)
      this.showModalDelete.set(true)
    },
  })
 }
  // ✅ Liste fixe des blocs connus
  private readonly BLOCS = ['Bloc A', 'Bloc B', 'Bloc C', 'Bloc D', 'Bloc E', 'Bloc F'];
  readonly encours=computed(()=>this.operations().filter(b=>b.status==="En cours").length)
  readonly planifie=computed(()=>this.operations().filter(b=>b.status==="Planifiée").length)
  // ✅ Calculé dynamiquement depuis operations()
  blocStatus = computed(() => {
    const ops = this.operations();

    return this.BLOCS.map(blocName => {
      // Cherche une opération active pour ce bloc
      const op = ops.find(o => o.bloc === blocName);

      if (!op) {
        return { b: blocName, ic: '✅', lb: 'Libre', c: 'var(--success)' };
      }

      switch (op.status as OperationStatus) {
        case 'En cours':
          return { b: blocName, ic: '🔵', lb: 'En cours', c: 'var(--accent2)' };
        case 'Planifiée':
          return { b: blocName, ic: '🟠', lb: 'Planifié', c: 'var(--warning)' };
        case 'Terminée':
          return { b: blocName, ic: '✅', lb: 'Libre', c: 'var(--success)' };
        default:
          return { b: blocName, ic: '✅', lb: 'Libre', c: 'var(--success)' };
      }
    });
  });
  emptyForm():Operation{
   return{patient:'',chirurgien:'',intervention:'',heureDebut:'',status:'En cours',bloc:'',duree:''}
  }
 

  openEdit(op:Operation):void{
    this.formEdit={...op};
    this.OpToEdit.set(op)
    this.showModalEdit.set(true);

  }
  openDelete(op:Operation):void{
    this.OpToDelete.set(op)
    this.showModalDelete.set(true)
  }
  badgeClass(s: OperationStatus): string {
    const m: Record<OperationStatus, string> = {
      'Terminée': 'badge-success-mc',
      'En cours': 'badge-info-mc',
      'Planifiée': 'badge-warning-mc',
      'Libre': 'badge-muted-mc'
    };
    return m[s];
  }
    readonly filtered= computed(()=>{
    const d =this.searchQuery().toLowerCase();
    return this.operations().filter(p=>{
      const nom=`${p.patient}`.toLowerCase()
      return nom.includes(d) 
    })
  })
    readonly pageSige=5
  currentPage=signal(1)
  readonly totalPage=computed(()=>
  Math.max(1,Math.ceil(this.filtered().length / this.pageSige) )
  )
  readonly pageOperations=computed(()=>{
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