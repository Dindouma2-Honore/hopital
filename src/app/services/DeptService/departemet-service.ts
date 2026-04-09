import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Department } from '../../core/models/hospital.models';

@Injectable({
  providedIn: 'root',
})
export class DepartemetService {
   constructor(private http: HttpClient) {}

  private apiUrl = environment.apiDepartement;

  // ── Couleurs prédéfinies assignées selon l'index ──────────
  private readonly COLORS = [
    '#00c2a8','#635bff','#ffa502','#ff4757',
    '#8e44ad','#16a085','#e67e22','#1abc9c',
    '#e74c3c','#2980b9','#f39c12','#27ae60',
  ];

  // ── Méthode publique : récupère et transforme les patients ─
  getDept(): Observable<Department[]> {
    return this.http
      .get<Department[]>(this.apiUrl)         // 1. Récupère PatientBD[] depuis PHP
      
  }
  
  addDept(dept:Department): Observable<Department> {
    
    return this.http.post<Department>(this.apiUrl, dept);
  }

  
  updateDept(numero: string, dept: Department): Observable<Department> {
   
    return this.http.put<Department>(`${this.apiUrl}/${numero}`, dept);
  }

  // ── DELETE — Supprimer un patient ─────────────────────────
  // URL : /patients/{matricule}
 deleteDept(numero: number) {
  return this.http.delete(`${this.apiUrl}?numero=${numero}`);
}
}
