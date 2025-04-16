import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterdata'
})
export class FilterdataPipe implements PipeTransform {

  // constructor() { }
  // public transform(value: any, type: string): any {
  //   if(type === ''){
  //     return value;
  //   }
  //   return value.filter((x:any) => x.name.toLowerCase().startsWith(type.toLowerCase()));
  // }
  transform(value: any, args?: any): any {
    if(!value) return null;
    if(!args) return value;
    args = args.toLowerCase();
    return value.filter(function(item:any){
      return JSON.stringify(item)
      .toLocaleLowerCase()
      .includes(args);
    });
  }

}

