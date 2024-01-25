import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

async function getMainSitemapUrl(domain: string): Promise<string> {
  const sitemapUrl = `https://${domain}/sitemap.xml`;
  try {
    const response = await fetch(sitemapUrl);
    if (response.ok) {
      return sitemapUrl;
    } else {
      throw new Error('Sitemap not found');
    }
  } catch (error) {
    return 'Error fetching sitemap';
  }
}

const getPageUrls = async (sitemapUrl: string): Promise<string[]> => {
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error('Error fetching sitemap');
  }
  const xml = await response.text();

  const urls: Array<string> = []
  const result = await parseStringPromise(xml);
  if (result.sitemapindex?.sitemap) {
    for (const sitemap of result.sitemapindex.sitemap) {
      const sitemapUrl = sitemap.loc[0];
      const pageUrls = await getPageUrls(sitemapUrl);
      urls.push(...pageUrls);
    }
  }
  if (result.urlset?.url) {
    for (const url of result.urlset.url) {
      urls.push(url.loc[0]);
    }
  }
  return urls;
}

async function testUrl(url: string): Promise<true | string> {
  try {
    const response = await fetch(url);
    if (response.status === 200) return true
    return response.status.toString();
  } catch (error) {
    return 'Error fetching page'
  }
}

async function start(domain: string) {
  const sitemapUrl = await getMainSitemapUrl(domain);
  console.info(`Sitemap URL: ${sitemapUrl}`);

  const pageUrls = await getPageUrls(sitemapUrl);
  console.info(`Page URLs: ${pageUrls.length}`);

  const errors: Array<{ url: string; status: string }> = [];
  for (const url of pageUrls) {
    const status = await testUrl(url);
    if (status !== true) {
      process.stdout.write('x');
      errors.push({ url, status });
    } else {
      process.stdout.write('.');
    }
  }

  console.info();
  for (const error of errors) {
    console.error(error.url, error.status);
  }
  console.info(`Errors: ${errors.length}`);
  console.info(`Success: ${pageUrls.length - errors.length}`);
  console.info(`Total: ${pageUrls.length}`);
}

function isValidDomain(domain: unknown): domain is string {
  if (typeof domain !== 'string') return false;
  const domainRegex = /^(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
  return domainRegex.test(domain);
}

if (process.argv.length !== 3 || !isValidDomain(process.argv[2])) {
  console.error('Usage: yarn start <domain>');
  console.error('Example: yarn start example.com');
  process.exit(1);
}
const domain = process.argv[2];
start(domain)
