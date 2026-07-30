import test from 'node:test';
import assert from 'node:assert/strict';

import { buildEntityProfile } from '../src/entities/build-entity-profile.js';
import { scoreEntityMatch } from '../src/entities/match-entity.js';

const now = '2026-07-30T13:00:00.000Z';

function candidate(overrides = {}) {
  return {
    name: 'Example Community Fund',
    entity_type: 'FUNDER',
    canonical_url: 'https://example.org',
    description: 'Provides emergency and small-business funding assistance.',
    knowledge_base_category: 'Funding and Financial Assistance',
    tags: ['Emergency Funding', 'business funding', 'emergency funding'],
    usefulness: {
      is_useful: true,
      reason: 'Provides actionable funding assistance.',
      audiences: ['small business owners']
    },
    sources: [
      {
        url: 'https://example.org',
        source_type: 'OFFICIAL_PROVIDER',
        retrieved_at: now,
        supports_fields: ['name', 'description', 'canonical_url']
      }
    ],
    owners: [],
    management: [],
    locations: [],
    socials: [],
    reviews: [],
    ...overrides
  };
}

test('builds and normalizes a useful verified entity profile', () => {
  const result = buildEntityProfile(candidate(), now);

  assert.equal(result.status, 'READY_FOR_INDEXING');
  assert.equal(result.profile.entity_id, 'entity_example-community-fund');
  assert.deepEqual(result.profile.tags, ['business funding', 'emergency funding']);
  assert.equal(result.profile.verification_status, 'VERIFIED');
});

test('does not create profiles for entities not marked useful', () => {
  const result = buildEntityProfile(candidate({
    usefulness: { is_useful: false, reason: 'Not relevant to supported pathways.' }
  }), now);

  assert.equal(result.status, 'VALIDATION_PENDING');
  assert.equal(result.profile, null);
});

test('matches duplicate entities through canonical domain and name', () => {
  const existing = buildEntityProfile(candidate(), now).profile;
  const duplicate = candidate({ canonical_url: 'https://www.example.org/programs' });
  const result = scoreEntityMatch(existing, duplicate);

  assert.equal(result.is_match, true);
  assert.ok(result.score >= 0.7);
});

test('requires review for partially corroborated ownership details', () => {
  const result = buildEntityProfile(candidate({
    owners: [
      {
        name: 'Jordan Smith',
        relationship: 'FOUNDER',
        verification_status: 'UNVERIFIED',
        source_url: null
      }
    ]
  }), now);

  assert.equal(result.status, 'APPROVAL_PENDING');
  assert.equal(result.profile.verification_status, 'PARTIALLY_VERIFIED');
});
