import { Component, signal } from '@angular/core';
import { DocumentRootComponent } from '../components/document-root/document-root.component';
import { HttpClient } from '@angular/common/http';
import { ParseResult, parseSpec } from '@spequoia/core';
import { ParsedDocument } from 'spequoia-core/dist/model/parsed-document.model';
import * as commonmark from 'commonmark';
import { Heading } from '../models/heading.model';
import {
  ProcessedDocument,
  ProcessedView,
} from '../models/processed-document.model';
import {DocumentService} from '../services/document.service';

@Component({
  selector: 'app-root',
  imports: [DocumentRootComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'spequoia-web';

  $parseResult = signal(null as ParseResult | null);
  $processedDocument = signal(null as ProcessedDocument | null);

  constructor(public readonly http: HttpClient, private readonly documentService: DocumentService) {
    this.http
      .get('example.yaml', { responseType: 'text' })
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
