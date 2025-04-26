import {Component, signal} from '@angular/core';
import {DocumentRootComponent} from '../components/document-root/document-root.component';
import {HttpClient} from '@angular/common/http';
import {ParseResult, parseSpec} from '@spequoia/core';

@Component({
  selector: 'app-root',
  imports: [DocumentRootComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'spequoia-web';

  $parseResult = signal(null as ParseResult | null);

  constructor(public readonly http: HttpClient) {
    this.http.get('example.yaml', {responseType: 'text'}).subscribe((data) => {
      const parseResult = parseSpec(data);
      this.$parseResult.set(parseResult);
      console.log(parseResult);
    });
  }
}
