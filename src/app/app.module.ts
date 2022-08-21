import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { DialogComponent } from "./dialog/dialog.component";
import { StatusColorPipe } from './status-color.pipe';
import { MaterialModule } from "./material/material.module";
import { SearchBarComponent } from "./search/search-bar/search-bar.component";
import { SearchResultsComponent } from "./search/search-results/search-results.component";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent, 
    SearchBarComponent,
    SearchResultsComponent,
    DialogComponent, 
    StatusColorPipe
  ],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {}
