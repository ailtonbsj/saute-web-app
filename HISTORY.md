# HISTORY

```bash
# Project
ng new saute-web
ng add @angular/material

# Shareds
ng g c shared/confirm-dialog
ng g s shared/helpers
npm install dexie

# Module NivelEscolar
ng g m nivel-escolar --routing
ng g i nivel-escolar/nivel-escolar model
ng g c nivel-escolar/nivel-escolar-datatable
ng g c nivel-escolar/nivel-escolar-form
ng g s nivel-escolar/nivel-escolar

# Module Instituicao
ng g m instituicao --routing
ng g i instituicao/instituicao model
ng g c instituicao/instituicao-datatable
ng g c instituicao/instituicao-form
ng g s instituicao/instituicao

# Module Professor
ng g m professor --routing
ng g i professor/professor model
ng g c professor/professor-datatable
ng g c professor/professor-form
ng g s professor/professor

# Module Processo
ng g m processo --routing
ng g i processo/processo model
ng g c processo/processo-datatable
ng g c processo/processo-form
ng g s processo/processo
```
