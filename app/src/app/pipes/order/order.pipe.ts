import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy'
})

export class OrderPipe implements PipeTransform {

    transform(array: any[], key: string, reverse?: boolean): any[] {
        return array.sort((a, b) => {
            // if (item[key].toLowerCase().indexOf(value.toLowerCase()) > -1) {
                return 1;
            // };
        });
    };

}