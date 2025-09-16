## Atualização Angular 14 para 15

```bash
# Use Node 18.10
nvm install 18.10.0
nvm use 18.10.0
node -v

# Test angular without installing angular cli globally
npm -g list
./node_modules/.bin/ng serve

# Update Angular core
ng update @angular/core@15 @angular/cli@15 --allow-dirty --force
npm i -D @types/node@18

# Update Angular Material
ng update @angular/material@15 --allow-dirty --force

# Migra components legados
# [Enter] [A] [Enter]
ng generate @angular/material:mdc-migration

# Update others pkgs
ng update ngx-mask@15 --allow-dirty --force

# Update Angular eslint
ng update @angular-eslint/eslint-plugin@15 --allow-dirty --force
ng update @angular-eslint/eslint-plugin-template@15 --allow-dirty --force
ng update @angular-eslint/schematics@15 --allow-dirty --force
ng update @angular-eslint/template-parser@15 --allow-dirty --force

# Update other packages
npm update
```

## Styles for Angular 15

```css
/* <mat-nav-list class="mat-nav-list"> */

.mdc-list-item__primary-text {
    display: flex;
}

.mdc-list-item__primary-text .mat-icon {
    margin-right: 10px;
}

button .mat-icon {
  margin: 0 !important;
}

input[type="datetime-local"]::-webkit-inner-spin-button,
input[type="datetime-local"]::-webkit-calendar-picker-indicator,
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
    display: block;
    -webkit-appearance: button;
}

.mdc-dialog__surface {
  overflow-y: hidden !important;
}
```
