import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Appointment } from '../../core/models/hospital.models';

@Injectable({
  providedIn: 'root',
})
export class RvService {
   constructor(private http:HttpClient){}
   private baseUrl=environment.apiRV
  // //================= SELECTION D'UN RENDEZ-VOUS PAR NUMERO==================
  // //=================================================================
  // getRV(numero:number){}
  //================= SELECTION DE TOUS RENDEZ-VOUS==================
  //=================================================================
   getAllRV():Observable<Appointment[]>{
    return this.http.get<Appointment[]>(this.baseUrl)
   }
  //  ===============Ajouter un RV==============
  //  ========================================
  addRv(rv:Appointment):Observable<Appointment>{
   return this.http.post<Appointment>(this.baseUrl,rv)
  }
  //  ===============Modifier un RV==============
  //  ========================================
  updateRv(numero:string,rv:Appointment):Observable<Appointment>{
   return this.http.put<Appointment>(`${this.baseUrl}/${numero}`,rv)
  }
  //  ===============Supprimer un RV==============
  //  ========================================
  deleteRv(numero:number){
   return this.http.delete(`${this.baseUrl}?numero=${numero}`)
  }

}
