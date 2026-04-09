import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Operation } from '../../core/models/hospital.models';

@Injectable({
  providedIn: 'root',
})
export class ServiceOperation {
    constructor(private http: HttpClient) {}

  private apiUrl = environment.apiOperation;

  // ── Couleurs prédéfinies assignées selon l'index ──────────
  private readonly COLORS = [
    '#00c2a8','#635bff','#ffa502','#ff4757',
    '#8e44ad','#16a085','#e67e22','#1abc9c',
    '#e74c3c','#2980b9','#f39c12','#27ae60',
  ];

  // ── Méthode publique : récupère et transforme les patients ─
  getOperation(): Observable<Operation[]> {
    return this.http
      .get<Operation[]>(this.apiUrl)         // 1. Récupère PatientBD[] depuis PHP
      
  }
  
  addOperation(Operation:Operation): Observable<Operation> {
    
    return this.http.post<Operation>(this.apiUrl, Operation);
  }

  
  updateOperation(id: number, Operation: Operation): Observable<Operation> {
   
    return this.http.put<Operation>(`${this.apiUrl}/${id}`, Operation);
  }

  // ── DELETE — Supprimer un patient ─────────────────────────
  // URL : /patients/{matricule}
 deleteOperation(id: number) {
  return this.http.delete(`${this.apiUrl}?id=${id}`);
}
}
