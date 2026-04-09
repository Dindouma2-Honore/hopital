import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabResult } from '../../core/models/hospital.models';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServiceResultatTest {
  private apiUrl=environment.apiResultatLab
  private http=inject(HttpClient)
  getLabTest(): Observable<LabResult[]> {
    return this.http
      .get<LabResult[]>(this.apiUrl)         
      
  }
  
  addLabTest(LabTest:LabResult): Observable<LabResult> {
    
    return this.http.post<LabResult>(this.apiUrl, LabTest);
  }

  
  updateLabTest(numero: number, LabTest: LabResult): Observable<LabResult> {
   
    return this.http.put<LabResult>(`${this.apiUrl}/${numero}`, LabTest);
  }

  // ── DELETE — Supprimer un patient ─────────────────────────
  // URL : /patients/{matricule}
 deleteLabTest(numero: number) {
  return this.http.delete(`${this.apiUrl}?numero=${numero}`);
}
}
