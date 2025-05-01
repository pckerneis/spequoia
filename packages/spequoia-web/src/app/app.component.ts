import {Component, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ParseResult, parseSpec} from '@spequoia/core';
import {ProcessedDocument} from '../models/processed-document.model';
import {DocumentService} from '../services/document.service';
import {DocumentPageComponent} from '../pages/document-page/document-page.component';

@Component({
  selector: 'app-root',
  imports: [DocumentPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'spequoia-web';

  $parseResult = signal(null as ParseResult | null);
  $processedDocument = signal(null as ProcessedDocument | null);

  constructor(
    public readonly http: HttpClient,
    private readonly documentService: DocumentService,
  ) {
    this.http
      .get('example.yaml', {responseType: 'text'})
      .subscribe((data) => {
        const parseResult = parseSpec(data);
        this.$parseResult.set(parseResult);

        if (parseResult.parsedDocument) {
          documentService.setDocument(parseResult.parsedDocument);
          this.$processedDocument = documentService.document;
        }
      });
  }
}
