import { describe, it, expect } from 'vitest';
import { exportItemToQti3Xml } from '../src/export/qti.js';

describe('QTI 3.0 XML Exporter', () => {
  it('generates valid QTI 3.0 XML for calibrated 3PL assessment item', () => {
    const xml = exportItemToQti3Xml({
      id: 'ITEM-TEST-001',
      code: 'STEM-BALANCE-01',
      prompt: 'A balance scale is in equilibrium with 3 identical weights on the left.',
      competency: 'quantitative_reasoning',
      options: [
        { id: 'opt-a', text: '4 grams' },
        { id: 'opt-b', text: '8 grams' },
        { id: 'opt-c', text: '12 grams' }
      ],
      correctOptionId: 'opt-b',
      explanation: 'Balancing the sides yields 8 grams.',
      irt: { a: 1.45, b: 0.25, c: 0.2 }
    });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<qti-assessment-item');
    expect(xml).toContain('identifier="STEM-BALANCE-01"');
    expect(xml).toContain('<qti-metadata-key>irt:discrimination_a</qti-metadata-key>');
    expect(xml).toContain('<qti-metadata-value>1.450</qti-metadata-value>');
    expect(xml).toContain('<qti-metadata-key>irt:difficulty_b</qti-metadata-key>');
    expect(xml).toContain('<qti-metadata-value>0.250</qti-metadata-value>');
    expect(xml).toContain('<qti-correct-response>');
    expect(xml).toContain('<qti-value>opt-b</qti-value>');
    expect(xml).toContain('<qti-simple-choice identifier="opt-a">');
    expect(xml).toContain('4 grams');
  });

  it('escapes special XML characters in item prompt and options', () => {
    const xml = exportItemToQti3Xml({
      prompt: 'If x < 5 & y > 10, what is "x + y"?',
      options: [{ id: 'opt-a', text: 'Range < 15 & > 10' }]
    });

    expect(xml).toContain('If x &lt; 5 &amp; y &gt; 10, what is &quot;x + y&quot;?');
    expect(xml).toContain('Range &lt; 15 &amp; &gt; 10');
  });
});
