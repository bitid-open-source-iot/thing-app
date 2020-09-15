import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterBy'
})

export class FilterPipe implements PipeTransform {

    transform(array: any[], key: string, value: string): any[] {
        return array.filter(item => {
            if (typeof(item[key]) != "undefined") {
                if (item[key].toLowerCase().indexOf(value.toLowerCase()) > -1) {
                    return true;
                };
            } else {
                return true;
            };
        });
    };

}