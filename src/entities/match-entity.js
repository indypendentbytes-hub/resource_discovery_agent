function normalizeName(value = '') {
  return value
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|corp|corporation|company|co|foundation|organization|org)\b\.?/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function hostname(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function socialUrls(entity = {}) {
  return new Set((entity.socials ?? []).map((social) => social.url?.toLowerCase()).filter(Boolean));
}

export function scoreEntityMatch(existing, candidate) {
  let score = 0;
  const reasons = [];

  if (normalizeName(existing.name) && normalizeName(existing.name) === normalizeName(candidate.name)) {
    score += 0.35;
    reasons.push('normalized name match');
  }

  const existingNames = new Set([existing.name, ...(existing.alternate_names ?? [])].map(normalizeName));
  const candidateNames = [candidate.name, ...(candidate.alternate_names ?? [])].map(normalizeName);
  if (candidateNames.some((name) => existingNames.has(name))) {
    score += 0.15;
    reasons.push('alternate name match');
  }

  const existingHost = hostname(existing.canonical_url);
  const candidateHost = hostname(candidate.canonical_url);
  if (existingHost && candidateHost && existingHost === candidateHost) {
    score += 0.4;
    reasons.push('canonical domain match');
  }

  const existingPlaceId = existing.google_business_profile?.place_id;
  const candidatePlaceId = candidate.google_business_profile?.place_id;
  if (existingPlaceId && candidatePlaceId && existingPlaceId === candidatePlaceId) {
    score += 0.6;
    reasons.push('Google place ID match');
  }

  const existingSocials = socialUrls(existing);
  const sharedSocial = [...socialUrls(candidate)].some((url) => existingSocials.has(url));
  if (sharedSocial) {
    score += 0.25;
    reasons.push('social profile match');
  }

  const existingPostalCodes = new Set((existing.locations ?? []).map((location) => location.postal_code).filter(Boolean));
  if ((candidate.locations ?? []).some((location) => existingPostalCodes.has(location.postal_code))) {
    score += 0.1;
    reasons.push('postal-code overlap');
  }

  return {
    score: Math.min(score, 1),
    is_match: score >= 0.7,
    requires_review: score >= 0.45 && score < 0.7,
    reasons
  };
}

export function findEntityMatch(existingEntities, candidate) {
  const ranked = existingEntities
    .map((entity) => ({ entity, ...scoreEntityMatch(entity, candidate) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0] ?? {
    entity: null,
    score: 0,
    is_match: false,
    requires_review: false,
    reasons: []
  };
}
