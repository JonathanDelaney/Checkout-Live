import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

declare var document: any;

@Injectable({
   providedIn: 'root'
})
export class QueryParameterService {

   queryParameter: any = {};

   constructor(private router: Router,
               private activatedRoute: ActivatedRoute) {
   }

   async createOrUpdateQueryParams(parameter: string, value: string | number) {
      this.queryParameter[parameter] = value;

      const url = this.router.createUrlTree([], {
         relativeTo: this.activatedRoute,
         queryParams: Object.assign(this.queryParameter)
      }).toString()

      await this.router.navigateByUrl(url);
   }

   getQueryParam(parameter: string): any {
      const param: string | null = this.activatedRoute.snapshot.queryParamMap.get(parameter);
      if (param === null) {
         return null;
      } else {
         this.queryParameter[parameter] = param;
         return param as string;
      }
   }
}