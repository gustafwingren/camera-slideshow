import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {ApiClientService} from "../services/api-client.service";
import {map} from "rxjs";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  apiClientService = inject(ApiClientService);

  selectedImages!: FileList;
  @ViewChild('#upload') input: ElementRef | undefined;


  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.selectedImages = inputElement.files;
    }
  }

  upload(): void {
    this.apiClientService.upload('https://ashy-pond-08b195c03.5.azurestaticapps.net/api/upload', this.selectedImages[0])
      .subscribe(res => {
        this.input?.nativeElement.clear();
      });
  }
}
