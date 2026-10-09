/**
 * 1EdTech / IMS Global QTI 3.0 Assessment Item Serializer
 *
 * Exports assessment items and 3PL Item Response Theory calibration
 * parameters to standardized QTI 3.0 XML packages.
 */

export interface QtiItemExportOptions {
  id?: string;
  code?: string;
  prompt: string;
  competency?: string;
  options?: Array<{ id: string; text: string }>;
  correctOptionId?: string;
  explanation?: string;
  irt?: {
    a: number; // discrimination
    b: number; // difficulty
    c: number; // guessing
  };
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Serializes an assessment item into a standard QTI 3.0 XML string.
 */
export function exportItemToQti3Xml(item: QtiItemExportOptions): string {
  const itemId = item.id || 'ITEM-001';
  const itemCode = item.code || itemId;
  const competency = item.competency || 'general_reasoning';
  const correctOptionId = item.correctOptionId || 'opt-b';
  const options = item.options || [
    { id: 'opt-a', text: 'Option A' },
    { id: 'opt-b', text: 'Option B' },
    { id: 'opt-c', text: 'Option C' },
    { id: 'opt-d', text: 'Option D' }
  ];
  const explanation = item.explanation || 'Deterministic step-by-step reasoning derivation.';

  const irtA = item.irt?.a ?? 1.35;
  const irtB = item.irt?.b ?? 0.50;
  const irtC = item.irt?.c ?? 0.20;

  return `<?xml version="1.0" encoding="UTF-8"?>
<qti-assessment-item
  xmlns="http://www.imsglobal.org/xsd/imsqtiasi_v3p0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqtiasi_v3p0 https://purl.imsglobal.org/spec/qti/v3p0/schema/xsd/imsqti_asiv3p0_v1p0.xsd"
  identifier="${escapeXml(itemCode)}"
  title="${escapeXml(itemCode)} - ${escapeXml(competency)}"
  adaptive="false"
  time-dependent="false">

  <!-- Psychometric Metadata (3PL IRT Parameters & Competency Taxonomy) -->
  <qti-metadata>
    <qti-metadata-item>
      <qti-metadata-key>creed:competencyDomain</qti-metadata-key>
      <qti-metadata-value>${escapeXml(competency)}</qti-metadata-value>
    </qti-metadata-item>
    <qti-metadata-item>
      <qti-metadata-key>irt:model</qti-metadata-key>
      <qti-metadata-value>3PL</qti-metadata-value>
    </qti-metadata-item>
    <qti-metadata-item>
      <qti-metadata-key>irt:discrimination_a</qti-metadata-key>
      <qti-metadata-value>${irtA.toFixed(3)}</qti-metadata-value>
    </qti-metadata-item>
    <qti-metadata-item>
      <qti-metadata-key>irt:difficulty_b</qti-metadata-key>
      <qti-metadata-value>${irtB.toFixed(3)}</qti-metadata-value>
    </qti-metadata-item>
    <qti-metadata-item>
      <qti-metadata-key>irt:pseudoGuessing_c</qti-metadata-key>
      <qti-metadata-value>${irtC.toFixed(3)}</qti-metadata-value>
    </qti-metadata-item>
  </qti-metadata>

  <!-- Response Variable Declaration -->
  <qti-response-declaration identifier="RESPONSE" cardinality="single" base-type="identifier">
    <qti-correct-response>
      <qti-value>${escapeXml(correctOptionId)}</qti-value>
    </qti-correct-response>
  </qti-response-declaration>

  <!-- Outcome Declarations -->
  <qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float">
    <qti-default-value>
      <qti-value>0.0</qti-value>
    </qti-default-value>
  </qti-outcome-declaration>

  <!-- Item Body & Interaction -->
  <qti-item-body>
    <div class="qti-prompt">
      <p>${escapeXml(item.prompt)}</p>
    </div>
    <qti-choice-interaction response-identifier="RESPONSE" shuffle="false" max-choices="1">
${options
  .map(
    (opt) => `      <qti-simple-choice identifier="${escapeXml(opt.id)}">
        ${escapeXml(opt.text)}
      </qti-simple-choice>`
  )
  .join('\n')}
    </qti-choice-interaction>
  </qti-item-body>

  <!-- Response Processing Rules -->
  <qti-response-processing>
    <qti-response-condition>
      <qti-response-if>
        <qti-match>
          <qti-variable identifier="RESPONSE"/>
          <qti-correct identifier="RESPONSE"/>
        </qti-match>
        <qti-set-outcome-value identifier="SCORE">
          <qti-base-value base-type="float">1.0</qti-base-value>
        </qti-set-outcome-value>
      </qti-response-if>
      <qti-response-else>
        <qti-set-outcome-value identifier="SCORE">
          <qti-base-value base-type="float">0.0</qti-base-value>
        </qti-set-outcome-value>
      </qti-response-else>
    </qti-response-condition>
  </qti-response-processing>

  <!-- Pedagogical Feedback / Explanation -->
  <qti-modal-feedback outcome-identifier="FEEDBACK" identifier="SOLUTION" show-hide="show">
    <p>${escapeXml(explanation)}</p>
  </qti-modal-feedback>

</qti-assessment-item>`;
}
