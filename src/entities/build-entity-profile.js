const REQUIRED_FIELDS = [
  'name',
  'entity_type',
  'canonical_url',
  'description',
  'knowledge_base_category',
  'tags',
  'sources'
];

function normalizeTags(tags = []) {
  return [...new Set(tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))].sort();
}

function normalizeUrls(items = []) {
  return items
    .filter((item) => item?.url)
    .map((item) => ({ ...item, url: String(item.url).trim() }));
}

function determineVerificationStatus(profile) {
  const statuses = [
    ...(profile.owners ?? []).map((item) => item.verification_status),
    ...(profile.management ?? []).map((item) => item.verification_status),
    ...(profile.locations ?? []).map((item) => item.verification_status)
  ];

  if (statuses.includes('UNVERIFIED')) return 'PARTIALLY_VERIFIED';
  if (statuses.includes('PARTIALLY_VERIFIED')) return 'PARTIALLY_VERIFIED';
  if ((profile.sources ?? []).length === 0) return 'UNVERIFIED';
  return 'VERIFIED';
}

export function validateEntityCandidate(candidate) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    const value = candidate?.[field];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (candidate?.canonical_url) {
    try {
      new URL(candidate.canonical_url);
    } catch {
      errors.push('canonical_url must be a valid URL');
    }
  }

  if (!candidate?.usefulness?.is_useful) {
    errors.push('Entity candidate must be marked useful before profile creation');
  }

  if (!candidate?.usefulness?.reason) {
    errors.push('Useful entities require a usefulness reason');
  }

  return { valid: errors.length === 0, errors };
}

export function buildEntityProfile(candidate, now = new Date().toISOString()) {
  const validation = validateEntityCandidate(candidate);
  if (!validation.valid) {
    return {
      status: 'VALIDATION_PENDING',
      errors: validation.errors,
      profile: null
    };
  }

  const slug = candidate.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const profile = {
    entity_id: candidate.entity_id ?? `entity_${slug}`,
    name: candidate.name.trim(),
    legal_name: candidate.legal_name ?? null,
    alternate_names: [...new Set(candidate.alternate_names ?? [])],
    entity_type: candidate.entity_type,
    canonical_url: candidate.canonical_url.trim(),
    google_business_profile: candidate.google_business_profile ?? null,
    socials: normalizeUrls(candidate.socials),
    owners: candidate.owners ?? [],
    management: candidate.management ?? [],
    locations: candidate.locations ?? [],
    reviews: candidate.reviews ?? [],
    description: candidate.description.trim(),
    knowledge_base_category: candidate.knowledge_base_category.trim(),
    tags: normalizeTags(candidate.tags),
    programs_and_services: [...new Set(candidate.programs_and_services ?? [])],
    usefulness: candidate.usefulness,
    verification_status: candidate.verification_status ?? determineVerificationStatus(candidate),
    sources: candidate.sources,
    created_at: candidate.created_at ?? now,
    updated_at: now,
    previous_version_id: candidate.previous_version_id ?? null
  };

  return {
    status: profile.verification_status === 'VERIFIED' ? 'READY_FOR_INDEXING' : 'APPROVAL_PENDING',
    errors: [],
    profile
  };
}

export const DEFAULT_ENTITY_TAGS = [
  'emergency funding',
  'food access',
  'business funding',
  'technical assistance',
  'business planning',
  'workforce development',
  'training',
  'land access',
  'transportation',
  'housing support',
  'legal assistance',
  'childcare',
  'healthcare',
  'reentry support',
  'veteran services',
  'procurement',
  'market access',
  'agriculture',
  'small business',
  'nonprofit support'
];
