import {Component, computed, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {ApiClientService} from "../services/api-client.service";
import {forkJoin, map, mergeMap, Observable, Observer} from "rxjs";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {XCircleIconComponent} from "../x-circle-icon/x-circle-icon.component";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    NgOptimizedImage,
    XCircleIconComponent
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
  uploadComplete = signal(false);

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.selectedFiles.update((files) => [...files, {file: file, id: Date.now(), status: UploadStatus.Unknown}]);
    }
  }

  removeItem(id: number): void {
    this.selectedFiles.update((files) => files.filter(f => f.id !== id));
  }

  previewFiles = computed(() => {
    return this.selectedFiles().map(item => {
      const fileReader = new FileReader();
      const image = new Observable<string>((observer: Observer<string>) => {
        fileReader.onloadend = () => {
          observer.next(fileReader.result as string);
          observer.complete();
        };
      });
      fileReader.readAsDataURL(item.file);
      return {id: item.id, imageSrc: image, status: item.status};
    });
  })

  upload(): void {
    this.uploadFailure.set(false);
    this.isUploading.set(true);
    this.uploadComplete.set(false);

    const tasks = this.selectedFiles().map(fileItem => {
      return {id: fileItem.id, task: this.apiClientService.upload('https://roa.gwingren.se/api/upload', fileItem)};
    });

    forkJoin(tasks.map(task => task.task)).subscribe({ next: () => {
      this.isUploading.set(false);
      this.selectedFiles.set([]);
      this.uploadComplete.set(true);
    }});

    tasks.forEach(task => {
      task.task.subscribe({
        next: value => {
          this.selectedFiles.update(files => files.map(file => file.id === task.id ? {...file, status: UploadStatus.Success} : file))
        },
        error: () => {
          this.selectedFiles.update(files => files.map(file => file.id === task.id ? {...file, status: UploadStatus.Failure} : file));
        }
      })
    })
  }

  protected readonly UploadStatus = UploadStatus;
}

export interface FileItem {
  file: File;
  id: number;
  status: UploadStatus;
}

export enum UploadStatus {
  Unknown = 0,
  InProgress = 1,
  Success = 2,
  Failure = 3
}
