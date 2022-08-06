import { AbstractControl, ValidatorFn } from "@angular/forms"

export class CustomValidators {

  static autocompleteValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocomplete': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

}
