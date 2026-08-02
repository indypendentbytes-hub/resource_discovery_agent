import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const SHEET_ID = '1TzeulUyU2rmhCaqjmrfAU5x0WqAVSZJFtKp7s_u2iyE';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=${encodeURIComponent('Source Catalog')}`;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows;
}

function splitList(value) {
  return String(value || '').split(';').map((item) => item.trim()).filter(Boolean);
}

function normalizeUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    url.hash = '';
    url.searchParams.delete('utm_source');
    url.searchParams.delete('utm_medium');
    url.searchParams.delete('utm_campaign');
    return url.toString().replace(/\/$/, '').toLowerCase();
  } catch {
    return '';
  }
}

function recordKey(record) {
  return normalizeUrl(record.official_url || record.canonical_url || record.submitted_url)
    || String(record.name || '').trim().toLowerCase();
}

const response = await fetch(CSV_URL, { redirect: 'follow' });
if (!response.ok) throw new Error(`Google Sheet export failed: ${response.status}`);
const csv = await response.text();
if (!csv.includes('Source ID') || !csv.includes('Source Name')) {
  throw new Error('Google Sheet export did not return the Source Catalog CSV. Confirm link sharing.');
}

const rows = parseCsv(csv);
const headers = rows[0].map((value) => value.trim());
const index = Object.fromEntries(headers.map((header, i) => [header, i]));
const cell = (row, header) => row[index[header]] || '';

const governed = rows.slice(1)
  .filter((row) => /^SRC-\d+$/i.test(cell(row, 'Source ID').trim()))
  .map((row) => ({
    resource_id: cell(row, 'Source ID').trim().toLowerCase(),
    source_id: cell(row, 'Source ID').trim(),
    name: cell(row, 'Source Name').trim(),
    submitted_url: cell(row, 'Submitted URL').trim(),
    official_url: (cell(row, 'Canonical URL') || cell(row, 'Submitted URL')).trim(),
    organization: cell(row, 'Organization').trim(),
    service_area: splitList(cell(row, 'Jurisdiction')),
    source_authority: cell(row, 'Authority Class').trim(),
    source_format: cell(row, 'Source Format').trim(),
    primary_category: cell(row, 'Primary Resource Category').trim(),
    tags: splitList(cell(row, 'Capability Tags')),
    audience: splitList(cell(row, 'Best-Fit User Roles')),
    description: cell(row, 'Core User Value').trim(),
    data_resources_available: cell(row, 'Data / Resources Available').trim(),
    example_user_requests: splitList(cell(row, 'Example User Requests')),
    agent_action: cell(row, 'Agent Action').trim(),
    developer_use: cell(row, 'Developer Use').trim(),
    integration_pattern: cell(row, 'Integration Pattern').trim(),
    update_frequency: cell(row, 'Update Frequency').trim(),
    refresh_cadence: cell(row, 'Refresh Cadence').trim(),
    citation_rule: cell(row, 'Citation Rule').trim(),
    restrictions_warnings: cell(row, 'Restrictions / Warnings').trim(),
    priority: cell(row, 'IB Priority').trim(),
    status: cell(row, 'Status').trim(),
    last_reviewed: cell(row, 'Last Reviewed').trim(),
    notes: cell(row, 'Submission Notes').trim(),
    verification_status: /active|current/i.test(cell(row, 'Status')) ? 'VERIFIED' : 'REVIEW_REQUIRED',
    provenance: 'IB User Resource Agent Knowledge Source Catalog — through 2026-07-25 (196 sources)',
  }));

if (governed.length !== 196) {
  throw new Error(`Expected 196 governed sources, received ${governed.length}`);
}

const manifest = JSON.parse(await readFile(path.join(DATA, 'resource-catalog.json'), 'utf8'));
const laterRecords = [];
for (const source of manifest.sources || []) {
  if (/governed-catalog|generated/i.test(source)) continue;
  const file = path.join(DATA, source);
  try {
    const document = JSON.parse(await readFile(file, 'utf8'));
    laterRecords.push(...(document.records || []));
  } catch (error) {
    console.warn(`Skipped ${source}: ${error.message}`);
  }
}

const merged = new Map();
for (const record of governed) merged.set(recordKey(record), record);
for (const record of laterRecords) {
  const key = recordKey(record);
  if (!key) continue;
  const prior = merged.get(key) || {};
  merged.set(key, { ...prior, ...record, tags: [...new Set([...(prior.tags || []), ...(record.tags || [])])] });
}
const records = [...merged.values()].filter((record) => record.name && recordKey(record));
records.sort((a, b) => String(a.name).localeCompare(String(b.name)));

const generated = {
  batch_id: 'resource-catalog-restored-2026-08-02',
  verified_at: new Date().toISOString(),
  scope: 'Restored governed RDA catalog plus verified resources added after 2026-07-25',
  promotion_status: 'PROMOTED_TO_CANONICAL_CATALOG',
  governed_source_count: governed.length,
  later_source_count_before_deduplication: laterRecords.length,
  record_count: records.length,
  records,
};

await writeFile(path.join(DATA, 'resource-catalog.generated.json'), `${JSON.stringify(generated, null, 2)}\n`);
await writeFile(path.join(DATA, 'resource-catalog.json'), `${JSON.stringify({
  catalog_version: '2026-08-02.2-restored',
  verified_at: generated.verified_at,
  scope: generated.scope,
  record_count: records.length,
  sources: ['resource-catalog.generated.json'],
  rules: {
    require_unique_resource_ids: false,
    include_only_promoted_batches: true,
    preserve_availability_notes: true,
    deduplicate_by_canonical_url: true,
  },
}, null, 2)}\n`);

console.log(`Restored ${governed.length} governed sources; canonical catalog now has ${records.length} deduplicated records.`);
