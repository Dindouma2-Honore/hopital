import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UrgencyCase } from '../../core/models/hospital.models';

@Injectable({
  providedIn: 'root',
})
export class ServiceUrgence {
  
   constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrgence;

  // ── Couleurs prédéfinies assignées selon l'index ──────────
  private readonly COLORS = [
    '#00c2a8','#635bff','#ffa502','#ff4757',
    '#8e44ad','#16a085','#e67e22','#1abc9c',
    '#e74c3c','#2980b9','#f39c12','#27ae60',
  ];

 
  getUrgence(): Observable<UrgencyCase[]> {
    return this.http.get<UrgencyCase[]>(this.apiUrl) 
              
      
  }
  
  addUrgence(urgence:UrgencyCase): Observable<UrgencyCase> {
    
    return this.http.post<UrgencyCase>(this.apiUrl, urgence);
  }

  
  updateUrgence(numero: number, urgence: UrgencyCase): Observable<UrgencyCase> {
   
    return this.http.put<UrgencyCase>(`${this.apiUrl}/${numero}`, urgence);
  }

  // ── DELETE — Supprimer un patient ─────────────────────────
  // URL : /patients/{matricule}
 deleteUrgence(numero: number) {
  return this.http.delete(`${this.apiUrl}?numero=${numero}`);
}
}

