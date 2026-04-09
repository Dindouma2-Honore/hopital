import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Etage } from '../../core/models/hospital.models';

@Injectable({
  providedIn: 'root',
})
export class ServiceEtage {
 
  private http    = inject(HttpClient);
  private baseUrl = environment.apiEtage; // ex: 'http://localhost/medicore/api/floor.php'

  getAllFloors(): Observable<Etage[]> {
    return this.http.get<Etage[]>(this.baseUrl);
  }
  addFloor(etage: Etage): Observable<any> {
    return this.http.post(this.baseUrl, etage);
  }
  updateFloor(numero: number, etage: Etage): Observable<any> {
    return this.http.put(`${this.baseUrl}?numero=${numero}`, etage);
  }
  deleteFloor(numero: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?numero=${numero}`);
  }

}
