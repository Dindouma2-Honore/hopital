// src/app/services/MouvementStock/mouvement-stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MouvementStock } from '../../features/pharmacie/pharmacie.component';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MouvementStockService {

  private readonly API = environment.apiMouvement;

  constructor(private http: HttpClient) {}

  // GET — tous les mouvements
  getMouvements(): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(this.API);
  }

  // GET — mouvements filtrés par médicament
  getMouvementsByMedicine(medicineId: string): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`${this.API}?medicineId=${medicineId}`);
  }

  // POST — créer un mouvement
  addMouvement(mouvement: Omit<MouvementStock, 'numero' | 'id'>): Observable<{ message: string; numero: number }> {
    return this.http.post<{ message: string; numero: number }>(this.API, mouvement);
  }

  // PUT — modifier un mouvement
  updateMouvement(numero: number, mouvement: MouvementStock): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API}?numero=${numero}`, mouvement);
  }

  // DELETE — supprimer un mouvement
  deleteMouvement(numero: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}?numero=${numero}`);
  }
}
