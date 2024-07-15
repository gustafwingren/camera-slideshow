import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {ApiClientService} from "../services/api-client.service";
import {map, Observable, Observer} from "rxjs";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    NgOptimizedImage
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  apiClientService = inject(ApiClientService);

  selectedFiles = signal<FileItem[]>([]);
  @ViewChild('#upload') input: ElementRef | undefined;

  uploadFailure = signal(false);
  isUploading = signal(false);

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.selectedFiles.update((files) => [...files, {file: file, id: Date.now()}]);
    }
  }

  readAsDataUrl(file: File): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      const reader = new FileReader();

      reader.onloadend = () => observer.next(reader.result as string);
      // reader.onerror = (error) => observer.error(error);

      reader.readAsDataURL(file);
    });
  }

  upload(): void {
    this.uploadFailure.set(false);
    this.isUploading.set(true);
    this.apiClientService.upload('https://ashy-pond-08b195c03.5.azurestaticapps.net/api/upload', this.selectedFiles().map(f => f.file))
      .subscribe({
        next: this.handleUploadSuccess.bind(this),
        error: this.handleUploadFailure.bind(this)
      });
  }

  handleUploadSuccess(): void {
    this.input?.nativeElement.clear();
    this.isUploading.set(false);
  }

  handleUploadFailure(): void {
    this.uploadFailure.set(true);
    this.isUploading.set(false);
  }
}

export interface FileItem {
  file: File;
  id: number;
}
