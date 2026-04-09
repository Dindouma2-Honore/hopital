import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  hospital = {
    name:     'Hôpital Général de Yaoundé',
    code:     'HGY-CM-001',
    address:  'Avenue Kennedy, Yaoundé, Cameroun',
    phone:    '+237 222 23 40 00',
    email:    'info@hgy.cm',
    capacity: '375 lits'
  };
}
