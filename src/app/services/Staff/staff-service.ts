import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Doctor, Patient, PatientStatus } from '../../core/models/hospital.models';


@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiStaff;


  // ── Méthode publique : récupère et transforme les patients ─
  getDocteur(): Observable<Doctor[]> {
    return this.http
      .get<Doctor[]>(this.apiUrl)         // 1. Récupère PatientBD[] depuis PHP
      
  }

  addDocteur(docteur:Doctor): Observable<Doctor> {
    
    return this.http.post<Doctor>(this.apiUrl, docteur);
  }

  updateDocteur(id: number, docteur: Doctor): Observable<Doctor> {
   
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, docteur);
  }

 
 deleteDocteur(id: number) {
  return this.http.delete(`${this.apiUrl}?id=${id}`);
}
}
