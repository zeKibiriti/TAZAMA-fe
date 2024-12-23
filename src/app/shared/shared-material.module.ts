import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [FormsModule, ReactiveFormsModule, FlexLayoutModule],
})
export class SharedMaterialModule {
}
