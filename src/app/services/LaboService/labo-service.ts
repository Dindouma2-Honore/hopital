import { Injectable } from '@angular/core';
import { LabTest } from '../../core/models/hospital.models';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LaboService {
     constructor(private http: HttpClient) {}

  private apiUrl = environment.apiTest;

  private readonly COLORS = [
    '#00c2a8','#635bff','#ffa502','#ff4757',
    '#8e44ad','#16a085','#e67e22','#1abc9c',
    '#e74c3c','#2980b9','#f39c12','#27ae60',
  ];

  getLabTest(): Observable<LabTest[]> {
    return this.http
      .get<LabTest[]>(this.apiUrl)         
      
  }
  
  addLabTest(LabTest:LabTest): Observable<LabTest> {
    
    return this.http.post<LabTest>(this.apiUrl, LabTest);
  }

  
  updateLabTest(numero: number, LabTest: LabTest): Observable<LabTest> {
   
    return this.http.put<LabTest>(`${this.apiUrl}/${numero}`, LabTest);
  }

  // ── DELETE — Supprimer un patient ─────────────────────────
  // URL : /patients/{matricule}
 deleteLabTest(numero: number) {
  return this.http.delete(`${this.apiUrl}?numero=${numero}`);
}
}
