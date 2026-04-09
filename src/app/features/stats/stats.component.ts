import { Component, inject } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  readonly data = inject(DataService);
  admissions = [
    { name:'Urgences',   v:420, c:'#ff4757' },
    { name:'Cardiologie',v:310, c:'#e74c3c' },
    { name:'Chirurgie',  v:285, c:'#8e44ad' },
    { name:'Pédiatrie',  v:380, c:'#27ae60' },
    { name:'Neurologie', v:190, c:'#635bff' },
    { name:'Oncologie',  v:145, c:'#16a085' },
    { name:'Gynéco',     v:210, c:'#e91e8c' },
  ];
  get maxVal(): number { return Math.max(...this.admissions.map(a => a.v)); }
  height(v: number): number { return Math.round(v / this.maxVal * 110); }
}
