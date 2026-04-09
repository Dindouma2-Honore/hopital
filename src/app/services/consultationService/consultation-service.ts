import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Consultation } from '../../core/models/hospital.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  apiUrl=environment.apiConsultation
  
  private http=inject(HttpClient)
  getConsultation(): Observable<Consultation[]> {
      return this.http.get<Consultation[]>(this.apiUrl) 
               
        
    }
     
    addConsultation(consultation:Consultation): Observable<Consultation> {
      
      return this.http.post<Consultation>(this.apiUrl, consultation);
    }
  
  
    updateConsultation(numero: number, consultation: Consultation): Observable<Consultation> {
     
      return this.http.put<Consultation>(`${this.apiUrl}/${numero}`, consultation);
    }
  
   
   deleteConsultation(numero: number) {
    return this.http.delete(`${this.apiUrl}?numero=${numero}`);
  }
}
