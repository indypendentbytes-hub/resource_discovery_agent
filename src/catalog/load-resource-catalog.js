import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(currentDirectory, '../../data');

async function readJson(fileName) {
  const raw = await readFile(path.join(dataDirectory, fileName), 'utf8');
  return JSON.parse(raw);
}

export async function loadResourceCatalog() {
  const manifest = await readJson('resource-catalog.json');
  const records = [];

  for (const source of manifest.sources) {
    const document = await readJson(source);

    if (
      source.includes('discovery-batch') &&
      manifest.rules?.include_only_promoted_batches &&
      document.promotion_status !== 'PROMOTED_TO_CANONICAL_CATALOG'
    ) {
      continue;
    }

    records.push(...(document.records ?? []));
  }

  const ids = records.map((record) => record.resource_id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (manifest.rules?.require_unique_resource_ids && duplicateIds.length > 0) {
    throw new Error(`Duplicate resource IDs: ${[...new Set(duplicateIds)].join(', ')}`);
  }

  if (records.length !== manifest.record_count) {
    throw new Error(
      `Catalog record count mismatch: expected ${manifest.record_count}, found ${records.length}`,
    );
  }

  return {
    ...manifest,
    records,
  };
}
