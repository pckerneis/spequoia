import { Pipe, PipeTransform } from '@angular/core';
import * as commonmark from 'commonmark';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value !== 'string') {
      return value;
    }

    const reader = new commonmark.Parser();
    const writer = new commonmark.HtmlRenderer();
    const parsed = reader.parse(value);
    return writer.render(parsed);
  }
}
