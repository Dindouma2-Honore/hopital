// ============================================================
// src/app/features/dashboard/dashboard.component.ts
// ============================================================
import { Component, inject, computed, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { popNumber } from 'rxjs/internal/util/args';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Appointment } from '../../core/models/hospital.models';
import { RvService } from '../../services/appointmentService/rv-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, StatCardComponent,DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly data = inject(DataService);
  @ViewChild('worldChart') worldChart!: ElementRef;
  @ViewChild('revenueChart') revenueChart!: ElementRef;
  private rvservice=inject(RvService)
  appointments:Appointment[]=[]
  readonly weeklyMax = computed(() =>
    Math.max(...this.data.weeklyData().map(d => d.value))
  );

  barHeight(value: number): number {
    return Math.round((value / this.weeklyMax()) * 100);
  }
ngOnInit(): void {
  this.getRv()
}
  getRv(){
    // this.rvService.getAllRV().subscribe({
    //   next:(rv)=> {
    //     this.appointments.set(rv)
    //   },
    //   error:(err) =>{
    //     console.log("erreur",err)
    //   },
    // })
  }
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
   async ngAfterViewInit(){

    // WORLD SALES CHART
     // ✅ Bloque totalement le serveur
    if (!isPlatformBrowser(this.platformId)) return;

    // ✅ Import dynamique (IMPORTANT)
    const { Chart } = await import('chart.js/auto');
      new Chart(this.worldChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Lundi','Mardi','Mercredi','Jeud','Vendredi','samedi','Dimanche'],
        datasets: [
          {
            label: 'Consultations',
            data: [15,30,55,65,60,80,95],
            backgroundColor: 'rgba(255,0,0,0.8)'
          },
          {
            label: 'Chirurgie',
            data: [10,35,40,60,70,65,75],
            backgroundColor: 'rgba(200,0,0,0.8)'
          },
          {
            label: 'Sortie',
            data: [12,25,45,55,65,70,60],
            backgroundColor: 'rgba(120,0,0,0.8)'
          }
        ]
      }
    });

    // REVENUE CHART
    new Chart(this.revenueChart.nativeElement, {
      type: 'line',
      data: {
        labels: [
          'Janvier','Fevrier','Mars','Avril',
          'Mai','Juin','Juillet'
        ],
        datasets: [
          {
            label: 'Depenses',
            data: [100,140,170,130,190,180,270],
            borderColor: 'red',
            backgroundColor: 'rgba(255,0,0,0.2)',
            fill: true
          },
          {
            label: 'Revenue',
            data: [20,30,55,45,70,65,90],
            borderColor: 'blue',
            backgroundColor: 'rgba(120,0,0,0.8)',
            fill: false
          }
        ]
      }
    });

     }
}
