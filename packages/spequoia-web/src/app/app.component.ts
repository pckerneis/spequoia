import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParseResult, parseSpec } from '@spequoia/core';
import { DocumentService } from '../services/document.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'spequoia-web';

  $parseResult = signal(null as ParseResult | null);

  constructor(
    private readonly http: HttpClient,
    documentService: DocumentService,
  ) {
    this.http
      .get('example.yaml', { responseType: 'text' })
      .subscribe((data) => {
        const parseResult = parseSpec(data);
        this.$parseResult.set(parseResult);

        if (parseResult.parsedDocument) {
          documentService.setDocument(parseResult.parsedDocument);
        }
      });
  }
}
