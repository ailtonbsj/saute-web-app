import { AbstractControl, ValidatorFn, Validators } from "@angular/forms"

export class CustomValidators {

  static autocompleteValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocomplete': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  static date(): ValidatorFn {
    return Validators.pattern("^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]$");
  }

  static number() : ValidatorFn {
    return Validators.pattern("^[0-9]*$");
  }

}

1500

