import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    A11yModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
  ]
})
export class MaterialModule {}
