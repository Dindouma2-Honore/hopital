import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { FactureService } from '../../services/FinanceService/facture-service';
import { Invoice } from '../../core/models/hospital.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [DecimalPipe,FormsModule],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  readonly data = inject(DataService);
  service=inject(FactureService)
  showModalAdd=signal(false)
  isSaving=signal(false)
  factures=signal<Invoice[]>([])
  saveError=signal<string | null>(null)
  form:Invoice=this.emptyForm()
  ngOnInit(): void {
    this.loaFacture()
  }
  loaFacture(){
    this.service.getFacture().subscribe({
      next:(value)=> {
        this.factures.set(value)
      },
      error:(err) =>{
        console.log("Erreur de chargement",err);
        
      },
    })
  }
  emptyForm():Invoice{
    return {
      reference:'',patient:'',service:'',montant:0,status:'Payée',date:''
    }
  }
  AjouterFacture():void{
    this.isSaving.set(true)
    this.service.addFacture(this.form).subscribe({
      next:()=> {
        this.isSaving.set(false)
        this.showModalAdd.set(false)
        this.loaFacture()
      },
      error:(err)=>  {
        this.isSaving.set(false)
        this.showModalAdd.set(true)
        console.log("Erreur lors de l'ajout",err);
        
      },
    })
  }
}
