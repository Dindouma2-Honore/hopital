import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Medicine } from '../../core/models/hospital.models';

@Injectable({
  providedIn: 'root',
})
export class PharmacieService {
  private http=inject(HttpClient)
  apiUrl=environment.apiProduit
  getProduits():Observable<Medicine[]>{
    return this.http.get<Medicine[]>(this.apiUrl)
  }
  addProduit(produit:Medicine):Observable<Medicine>{
    return this.http.post<Medicine>(this.apiUrl,produit)
  }
  UpdateProduit(numero:number,produit:Medicine){
    this.http.put<Medicine>(`${this.apiUrl}/${numero}`,produit)
  }
  deleteProduit(numero:number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/?numero=${numero}`)
  }
}
