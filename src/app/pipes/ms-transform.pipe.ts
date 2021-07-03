import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'msTransform'
})
export class MsToDaysPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): number {
    var temp = args[0];
    let transformed: number = 0;
    transformed = value / 1000;
    if (temp == 'm' || temp == 'h' || temp == 'd') {
      transformed = transformed * (1 / 60);
    }
    if (temp == 'h' || temp == 'd') {
      transformed = transformed * (1 / 60);
    }
    if (temp == 'd') {
      transformed = transformed * (1 / 24);
    }

    return Math.floor(transformed);
  }

}
