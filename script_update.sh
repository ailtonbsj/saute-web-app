#!/bin/bash

npm i

ng update @angular/core@16 @angular/cli@16 --allow-dirty
ng update @angular/material@16 --allow-dirty
ng update ngx-mask@16 --allow-dirty
npm update

ng update @angular/core@17 @angular/cli@17 --allow-dirty
ng update @angular/material@17 --allow-dirty
ng update ngx-mask@17 --allow-dirty
npm update

ng update @angular/core@18 @angular/cli@18 --allow-dirty
ng update @angular/material@18 --allow-dirty
ng update ngx-mask@18 --allow-dirty
npm update

ng update @angular/core@19 @angular/cli@19 --allow-dirty
ng update @angular/material@19 --allow-dirty
ng update ngx-mask@19 --allow-dirty
npm update

ng update @angular/core@20 @angular/cli@20 --allow-dirty
ng update @angular/material@20 --allow-dirty
ng update ngx-mask@20 --allow-dirty
npm update

ng update dexie --allow-dirty
ng update html2pdf.js --allow-dirty
ng update jspdf --allow-dirty
ng update rxjs --allow-dirty
npm update

ng update @types/jasmine --allow-dirty
ng update karma-jasmine-html-reporter --allow-dirty
ng update jasmine-core --allow-dirty
ng update karma-chrome-launcher --allow-dirty
ng update karma-jasmine --allow-dirty
npm update

# rm package-lock.json
# rm -r node_modules/
# npm i
