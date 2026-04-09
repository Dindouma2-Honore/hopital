// ============================================================
// src/app/services/roomService/room-service.ts
// ============================================================
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Etage, Room } from '../../core/models/hospital.models';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http    = inject(HttpClient);
  private baseUrl = environment.apisalle; // ex: 'http://localhost/medicore/api/room.php'

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl);
  }
  addRoom(room: Room): Observable<any> {
    return this.http.post(this.baseUrl, room);
  }
  updateRoom(numero: number, room: Room): Observable<any> {
    return this.http.put(`${this.baseUrl}?numero=${numero}`, room);
  }
  deleteRoom(numero: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?numero=${numero}`);
  }
}



