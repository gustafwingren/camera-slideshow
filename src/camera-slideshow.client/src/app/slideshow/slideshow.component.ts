import {Component, inject, OnInit, signal} from '@angular/core';
import {ApiClientService} from "../services/api-client.service";
import {AsyncPipe, NgClass, NgStyle} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    NgStyle
  ],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.scss',
  animations: [
    trigger('fade', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0 })),
      transition('show <=> hide', animate('600ms ease-in-out')),
    ])
    ]
})
export class SlideshowComponent implements OnInit
{
  private apiClient = inject(ApiClientService);
  private intervalInMs = 7500;

  image = signal<File|null>(null);
  nextImage = signal<File|null>(null);
  imageDataUrl = signal<string>('');
  nextImageDataUrl = signal<string>('');

  ngOnInit(): void {
    setInterval(() => {
      this.getNextImage();
    }, this.intervalInMs);
  }

  getNextImage(): void {
    this.apiClient.post<any>('https://roa.gwingren.se/api/slideshow', {ExcludeGuids: [this.image()?.name, this.nextImage()?.name]})
      .subscribe({next: (blob) => {
          const file = this.base64ToFile(blob.FileContents, blob.ContentType, blob.FileDownloadName);
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            if (this.toggle1) {
              this.imageDataUrl.set(fileReader.result as string);
              this.image.set(file);
            } else {
              this.nextImageDataUrl.set(fileReader.result as string);
              this.nextImage.set(file);
            }
            this.toggle1 = !this.toggle1;
          };

          if (file) {
            fileReader.readAsDataURL(file);
          }
        }});
  }

  toggle1 = false;

  base64ToFile(base64: string, contentType: string, filename: string): File {
  // Convert base64 to byte array
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Create a Blob from the byte array
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: contentType});

  // Create a File from the Blob
  const file = new File([blob], filename, {type: contentType});

  return file;
}
}
