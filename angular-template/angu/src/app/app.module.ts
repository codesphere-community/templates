import { NgModule, ViewChild, ElementRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importieren Sie HttpClientModule
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { AppPdfUploadComponent } from './pdf-upload/pdf-upload.component';




import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    AppPdfUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule, // Registrieren Sie HttpClientModule hier
	FormsModule,
	DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
