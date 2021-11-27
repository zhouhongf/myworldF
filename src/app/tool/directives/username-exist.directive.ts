import { Directive } from '@angular/core';
import {BaseService} from '../../providers/base.service';
import {AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
// import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';


export function usernameExistValidator(baseService: BaseService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return baseService.doseUserExists(control.value).pipe(map(
        data => {
          return (data['code'] === 0) ? {usernameExist: true} : null;
        }
    ));
  };
}

@Directive({
  selector: '[appUsernameExist][formControlName], [appUsernameExist][formControl], [appUsernameExist][ngModel]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UsernameExistDirective, multi: true}]
})
export class UsernameExistDirective implements AsyncValidator {

  constructor(private baseService: BaseService) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return usernameExistValidator(this.baseService)(control);
  }

}
