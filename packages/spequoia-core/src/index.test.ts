import { describe, it, expect } from 'vitest';
import { parseSpec } from './index';

describe('parseSpec', () => {
  it('should parse a valid spec YAML', () => {
    const yaml = `
features:
  - id: SPEC001
    description: A test feature
    examples:
      - id: SPEC001-EX1
        description: A simple example
    `;
    const spec = parseSpec(yaml);

    expect(spec.features).toHaveLength(1);
    expect(spec.features[0].id).toBe('SPEC001');
    expect(spec.features[0].examples?.[0].id).toBe('SPEC001-EX1');
  });

  it('should throw on invalid YAML', () => {
    expect(() => parseSpec(':::')).toThrow();
  });

  it('should throw when root is not an object', () => {
    expect(() => parseSpec('42')).toThrow();
  });

  it('should throw on missing features', () => {
    expect(() => parseSpec('invalid: true')).toThrow(/Missing "features"/);
  });
});
