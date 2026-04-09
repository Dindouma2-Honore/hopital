import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';
import { Invoice } from '../../core/models/hospital.models';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  
  private http    = inject(HttpClient);
  private baseUrl = environment.apiFacture; // ex: 'http://localhost/medicore/api/ordonnance.php'

  // ── GET ALL ───────────────────────────────────────────────
  getFacture(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseUrl);
  }

  // ── GET ONE ───────────────────────────────────────────────
  getFactById(numero: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}?id=${numero}`);
  }

  // ── POST ──────────────────────────────────────────────────
  addFacture(fac: Invoice): Observable<any> {
    return this.http.post(this.baseUrl, fac);
  }

  // ── PUT ───────────────────────────────────────────────────
  updateFacture(numero: number, facture: Invoice): Observable<any> {
    return this.http.put(`${this.baseUrl}?id=${numero}`, facture);
  }

  // ── DELETE ────────────────────────────────────────────────
  deleteFacture(numero: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?id=${numero}`);
  }
}
