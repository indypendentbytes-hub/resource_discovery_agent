import test from 'node:test';
import assert from 'node:assert/strict';
import { loadResourceCatalog } from '../src/catalog/load-resource-catalog.js';

test('loads the canonical resource catalog with promoted resources', async () => {
  const catalog = await loadResourceCatalog();

  assert.equal(catalog.records.length, 73);
  assert.equal(new Set(catalog.records.map((record) => record.resource_id)).size, 73);

  const promotedIds = [
    'ican-assistance-center',
    'southeast-community-services',
    'child-care-answers',
    'pace-indianapolis',
    'indianapolis-urban-league-entrepreneurship-center',
    'flagship-enterprise-capital',
    'partners-in-food-and-farming-technical-assistance-network',
    'kheprw-growin-good-in-the-hood',
    'kheprw-urban-agriculture-learning-lab',
    'felege-hiywot-youth-farm-initiative',
    'indianapolis-housing-agency',
    'intecare-veterans-services',
    'servsafe',
    'indiana-restaurant-lodging-association',
    'national-restaurant-association',
    'international-association-for-food-protection',
    'american-culinary-federation',
    'association-nutrition-foodservice-professionals',
    'national-council-of-nonprofits-fiscal-sponsorship-guide',
    'fresh-bucks-indy',
    'marion-county-produce-rx',
    'idoc-hire',
    'idoc-indianapolis-parole-district-3',
    'nasdaq-entrepreneurial-center-workbooks-toolkits',
    'sba-national-resource-guide',
    'jcpl-seed-library',
    'jcpl-gale-courses',
    'jcpl-learningexpress-library',
    'jcpl-atozdatabases',
    'jcpl-atoz-the-world',
    'jcpl-linkedin-learning',
    'jcpl-ebscohost',
    'jcpl-value-line',
    'jcpl-world-book-online',
    'jcpl-gale-legalforms',
    'jcpl-community-resources-directory',
    'jcpl-basic-needs-assistance-directory',
    'johnson-county-helpline',
    'interchurch-food-pantry-johnson-county',
    'johnson-county-wic',
    'johnson-county-blessing-boxes',
    'kic-it-johnson-county',
    'johnson-county-bar-association-clinic',
    'assist-johnson-county',
    'johnson-county-senior-services',
    'jcpl-naloxboxes',
  ];

  for (const resourceId of promotedIds) {
    assert.ok(
      catalog.records.some((record) => record.resource_id === resourceId),
      `Missing promoted resource: ${resourceId}`,
    );
  }
});
