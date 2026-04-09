// ============================================================
// src/app/services/OrdonnanceService/ordonnance-service.ts
// ============================================================
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Ordonnance } from '../../core/models/hospital.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdonnanceService {

  private http    = inject(HttpClient);
  private baseUrl = environment.apiOrdonnance; // ex: 'http://localhost/medicore/api/ordonnance.php'

  // ── GET ALL ───────────────────────────────────────────────
  getOrdo(): Observable<Ordonnance[]> {
    return this.http.get<Ordonnance[]>(this.baseUrl);
  }

  // ── GET ONE ───────────────────────────────────────────────
  getOrdoById(numero: number): Observable<Ordonnance> {
    return this.http.get<Ordonnance>(`${this.baseUrl}?numero=${numero}`);
  }

  // ── POST ──────────────────────────────────────────────────
  addOrdo(ordo: Ordonnance): Observable<any> {
    return this.http.post(this.baseUrl, ordo);
  }

  // ── PUT ───────────────────────────────────────────────────
  updateOrdo(numero: number, ordo: Ordonnance): Observable<any> {
    return this.http.put(`${this.baseUrl}?numero=${numero}`, ordo);
  }

  // ── DELETE ────────────────────────────────────────────────
  deleteOrdo(numero: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?numero=${numero}`);
  }
}
