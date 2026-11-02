# Scraping protection

Prepared on 2 November 2026. The crawler policy deploys with the normal site build. This change does not configure DNS, a proxy or firewall enforcement.

## Current setup

The Astro site builds to static files and deploys through `.github/workflows/deploy.yml` to GitHub Pages at `https://apriljzhang.com`. Public response headers identify GitHub hosting. Authoritative nameservers are `dns1.registrar-servers.com` and `dns2.registrar-servers.com`. These observations do not establish who owns the registrar login.

`public/robots.txt` requests that GPTBot, ClaudeBot, Google-Extended and CCBot stay away. It leaves other crawlers, including search crawlers, unrestricted. Google-Extended controls Gemini training and grounding separately from Google Search. These instructions depend on crawler cooperation; they do not stop direct downloads or unidentified scrapers, and do not remove previously collected content.

## What the linked site uses

The Iowa State Digital Press download displayed an Anubis 1.25.0 challenge headed “Making sure you're not a bot!”. Anubis can challenge requests before forwarding them to the protected service. Its computational challenges increase the cost of automated collection. Successful clients receive a pass cookie so they can continue browsing.

Anubis is a running reverse-proxy service. GitHub Pages cannot run it as part of the static website. Installing a JavaScript challenge inside an Astro page would leave the underlying HTML and downloads accessible. Reproducing the linked setup would require a server or other supported hosting environment running Anubis, with the protected content inaccessible through an unguarded origin.

## Recommended enforcement

Use Cloudflare in front of the custom domain, initially keeping search access available. Treat this as mitigation of scraping through the domain, not a guarantee against copying.

1. Inspect the existing domain configuration and export the full DNS zone. Preserve mail records, verification records and any subdomains. Confirm the current DNSSEC configuration and follow the provider's migration procedure if nameservers change.
2. Add the domain to Cloudflare and review all imported DNS records against the export. Keep GitHub Pages as the origin initially. Enable proxying for the web hostnames; nameservers alone do not activate HTTP protection. Use Full (strict) TLS after verifying the GitHub origin certificate.
3. Change the registrar nameservers to the exact pair assigned to this domain by Cloudflare. Verify activation, HTTPS and redirects on both apex and www hostnames before adding restrictive rules. Do not replace nameservers with examples from documentation.
4. In Security Settings, configure AI bot policies to block Training on all pages. Leave Search available initially. Agent access is a separate decision: blocking it can stop readers asking assistants to retrieve a page for them. Google-Extended preferences remain in robots.txt because this is a use preference, not a distinct HTTP user agent.
5. Evaluate Bot Fight Mode separately. It challenges recognised bot traffic across the domain and cannot be given normal WAF skip exceptions. Review legitimate student access, embedded resources and automation before keeping it enabled. Use a product with suitable exceptions if needed.
6. Use observed request patterns to choose rate limits for sustained bulk requests and PDF downloads. Check current plan limits and rule behaviour before enabling them; avoid a guessed site-wide threshold that could interfere with normal lesson loading.
7. Review security events and search indexing after activation. Test teaching pages, PDFs, mobile browsers, shared links and any owner automation. Keep a DNS rollback record and a record of the settings changed.

### Coverage limits

GitHub Pages does not provide a site-owned origin firewall to require every request to pass through Cloudflare. Check for direct-origin access and alternate copies before claiming comprehensive protection. Inspect the source repository's visibility too: a public repository can expose source text and files independently of website protection. Do not change repository visibility without reviewing collaborators, deployment requirements and the owner's intended access.

For material that must remain private, move it to authenticated storage or hosting that enforces access for both pages and downloads. A static site's noindex tags, robots.txt rules and unlinked URLs do not provide privacy.

## Verification

Before deployment, check that the build copies `public/robots.txt` unchanged to `dist/robots.txt`. After deployment, verify that `https://apriljzhang.com/robots.txt` serves the expected text. This verifies the policy file only. Enforcement must be verified separately through the active proxy configuration and security events.

## Sources

- [Anubis project](https://github.com/TecharoHQ/anubis) and [installation source](https://github.com/TecharoHQ/anubis/blob/main/docs/docs/admin/installation.mdx)
- [GitHub Pages hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Cloudflare DNS setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) and [proxy status](https://developers.cloudflare.com/dns/proxy-status/)
- [Cloudflare AI bot policies](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) and [Bot Fight Mode limitations](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
- [Google robots.txt limitations](https://developers.google.com/search/docs/crawling-indexing/robots/intro) and [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended)
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots), [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) and [Common Crawl](https://commoncrawl.org/ccbot)
