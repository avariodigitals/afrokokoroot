import { createSign } from 'crypto';
import { siteConfig } from './site-config';
import { SearchConsoleInspectionResult, SearchConsoleSettings } from './types';

export interface SearchConsoleConfigInput {
  enabled: boolean;
  siteUrl: string;
  serviceAccountJson?: string;
}

interface AccessibleSiteEntry {
  siteUrl: string;
  permissionLevel?: string;
}

function parseServiceAccountJson(rawJson?: string) {
  const trimmed = rawJson?.trim();

  if (!trimmed) {
    throw new Error('Add the Google service account JSON before using Search Console API actions.');
  }

  let credentials: {
    client_email?: string;
    private_key?: string;
    project_id?: string;
  };

  try {
    credentials = JSON.parse(trimmed) as typeof credentials;
  } catch {
    throw new Error('The service account JSON is not valid JSON.');
  }

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('The service account JSON must include client_email and private_key.');
  }

  return {
    ...credentials,
    private_key: credentials.private_key.replace(/\\n/g, '\n'),
  };
}

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

async function getGoogleAccessToken(rawJson?: string) {
  const credentials = parseServiceAccountJson(rawJson);
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = encodeBase64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(credentials.private_key!, 'base64url');
  const assertion = `${unsignedToken}.${signature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });

  const tokenPayload = await tokenResponse.json() as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenResponse.ok || !tokenPayload.access_token) {
    throw new Error(tokenPayload.error_description || tokenPayload.error || 'Google token exchange failed.');
  }

  return tokenPayload.access_token;
}

export function normalizeSearchConsoleConfig(config: SearchConsoleConfigInput | SearchConsoleSettings) {
  const siteUrl = config.siteUrl.trim();

  if (!config.enabled) {
    throw new Error('Enable Search Console integration before using the API actions.');
  }

  if (!siteUrl) {
    throw new Error('Add the Search Console property URL before using the API actions.');
  }

  return {
    enabled: true,
    siteUrl,
    serviceAccountJson: config.serviceAccountJson?.trim() || '',
  } satisfies SearchConsoleConfigInput;
}

function normalizeSearchConsoleProperty(siteUrl: string) {
  const trimmed = siteUrl.trim();

  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('sc-domain:')) {
    return `sc-domain:${trimmed.slice('sc-domain:'.length).toLowerCase()}`;
  }

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '') + '/';
    return `${parsed.protocol}//${parsed.host.toLowerCase()}${pathname}`;
  } catch {
    return trimmed.toLowerCase();
  }
}

function getDomainPropertyIdentifier(siteUrl: string) {
  if (!siteUrl || siteUrl.startsWith('sc-domain:')) {
    return normalizeSearchConsoleProperty(siteUrl);
  }

  try {
    return `sc-domain:${new URL(siteUrl).hostname.toLowerCase()}`;
  } catch {
    return '';
  }
}

function resolveMatchingSite(siteUrl: string, sites: AccessibleSiteEntry[]) {
  const normalizedRequestedSite = normalizeSearchConsoleProperty(siteUrl);
  const requestedDomainProperty = getDomainPropertyIdentifier(siteUrl);

  return sites.find((entry) => {
    const normalizedAccessibleSite = normalizeSearchConsoleProperty(entry.siteUrl);

    return normalizedAccessibleSite === normalizedRequestedSite
      || (requestedDomainProperty && normalizedAccessibleSite === requestedDomainProperty);
  }) || null;
}

async function listAccessibleSites(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });
  const payload = await response.json() as {
    siteEntry?: Array<{ siteUrl?: string; permissionLevel?: string }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || 'Search Console site listing failed.');
  }

  return (payload.siteEntry || [])
    .map((entry) => ({
      siteUrl: entry.siteUrl || '',
      permissionLevel: entry.permissionLevel || '',
    }))
    .filter((entry) => entry.siteUrl);
}

async function createWebmastersClient(config: SearchConsoleConfigInput | SearchConsoleSettings) {
  const normalized = normalizeSearchConsoleConfig(config);
  const accessToken = await getGoogleAccessToken(normalized.serviceAccountJson);
  const accessibleSites = await listAccessibleSites(accessToken);
  const matchingSite = resolveMatchingSite(normalized.siteUrl, accessibleSites);

  return {
    accessToken,
    siteUrl: matchingSite?.siteUrl || normalized.siteUrl,
    requestedSiteUrl: normalized.siteUrl,
    matchingSite,
    accessibleSites,
  };
}

export async function testSearchConsoleAccess(config: SearchConsoleConfigInput | SearchConsoleSettings) {
  const { requestedSiteUrl, matchingSite, accessibleSites } = await createWebmastersClient(config);

  return {
    siteUrl: requestedSiteUrl,
    propertyFound: Boolean(matchingSite),
    matchedSiteUrl: matchingSite?.siteUrl || null,
    permissionLevel: matchingSite?.permissionLevel || null,
    accessibleSites,
    checkedAt: new Date().toISOString(),
  };
}

export async function submitSearchConsoleSitemap(
  config: SearchConsoleConfigInput | SearchConsoleSettings,
  sitemapUrl = `${siteConfig.url}/sitemap.xml`
) {
  const { accessToken, siteUrl } = await createWebmastersClient(config);
  const normalizedSitemapUrl = sitemapUrl.trim();

  if (!normalizedSitemapUrl) {
    throw new Error('A sitemap URL is required.');
  }

  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(normalizedSitemapUrl)}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: { message: 'Search Console sitemap submission failed.' } })) as {
      error?: { message?: string };
    };
    throw new Error(payload.error?.message || 'Search Console sitemap submission failed.');
  }

  return {
    siteUrl,
    sitemapUrl: normalizedSitemapUrl,
    submittedAt: new Date().toISOString(),
  };
}

export async function inspectSearchConsoleUrl(
  config: SearchConsoleConfigInput | SearchConsoleSettings,
  inspectionUrl: string
): Promise<SearchConsoleInspectionResult> {
  const { accessToken, siteUrl } = await createWebmastersClient(config);
  const normalizedInspectionUrl = inspectionUrl.trim();

  if (!normalizedInspectionUrl) {
    throw new Error('An inspection URL is required.');
  }

  const response = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inspectionUrl: normalizedInspectionUrl,
      siteUrl,
      languageCode: 'en-US',
    }),
    cache: 'no-store',
  });

  const payload = await response.json() as {
    inspectionResult?: {
      indexStatusResult?: {
        verdict?: string;
        coverageState?: string;
        crawlingState?: string;
        indexingState?: string;
        lastCrawlTime?: string;
        pageFetchState?: string;
        robotsTxtState?: string;
        googleCanonical?: string;
        userCanonical?: string;
        referringUrls?: string[];
      };
      richResultsResult?: {
        verdict?: string;
        detectedItems?: unknown[];
      };
    };
    error?: { message?: string };
  };

  if (!response.ok || !payload.inspectionResult) {
    throw new Error(payload.error?.message || 'URL inspection failed.');
  }

  const indexStatus = payload.inspectionResult.indexStatusResult || {};
  const richResults = payload.inspectionResult.richResultsResult;

  return {
    inspectedUrl: normalizedInspectionUrl,
    inspectedAt: new Date().toISOString(),
    verdict: indexStatus.verdict,
    coverageState: indexStatus.coverageState,
    crawlingState: indexStatus.crawlingState,
    indexingState: indexStatus.indexingState,
    lastCrawlTime: indexStatus.lastCrawlTime,
    pageFetchState: indexStatus.pageFetchState,
    robotsTxtState: indexStatus.robotsTxtState,
    googleCanonical: indexStatus.googleCanonical,
    userCanonical: indexStatus.userCanonical,
    referringUrls: indexStatus.referringUrls || [],
    richResultsDetected: Boolean(richResults?.detectedItems?.length),
    details: richResults?.verdict,
  };
}