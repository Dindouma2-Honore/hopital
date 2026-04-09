import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormat', standalone: true })
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }
}
