# GitHub update

This revision adds the client-provided business address: **2500 Vantage Dr, Woodbridge, VA 22191** to the Contact page, shared footer and homepage Organization structured data. Read `GITHUB_UPDATE.md` for uploading to the existing repository. The supplied transparent gold-and-navy GNS logo is now used in the header and footer. Its original pixels and transparency are preserved.

# GNS Event Rentals — website package

An original, responsive rental showroom built with HTML, CSS and JavaScript, inspired by the reference catalog’s browse-and-request approach. Includes 24 HTML pages, 13 rental products, your supplied product photos, sample prices, a saved rental-list cart and a personalized quote flow. There is no online payment or automatic stock reservation: customers request a quote, and GNS confirms the booking separately.

## 1. Put the website on Vercel — browser only

1. Open https://vercel.com/drop and sign in to Vercel.
2. Drag **GNS_Event_Rentals_Vercel.zip** onto the upload area. You can upload the ZIP directly. The ZIP has `index.html` at its root, so do not put it inside another folder first.
3. Choose your team and a project name such as `gns-event-rentals`, then deploy.
4. If asked for build settings, select **Other**, Build Command **node build.js**, Output Directory **public**, and leave Install Command at its default. `vercel.json` already supplies these settings.
5. Open the resulting website URL. Check Home, Collection, a product detail page, Rental List, Quote, and both service-area pages.

No GitHub account or terminal is needed for this initial upload. This package has no third-party npm dependencies. It includes source and generated HTML, and Vercel rebuilds the static pages for the deployment.

**Commercial hosting:** This is a business website. Vercel's Hobby plan is limited to personal, non-commercial use; select a plan that permits commercial hosting. Check current pricing at https://vercel.com/pricing and plan terms at https://vercel.com/docs/plans/hobby.

Vercel Drop currently creates a new project for a new upload. Keep the original ZIP/source. For regular updates to the same project, use an ongoing deployment workflow such as the Vercel CLI or a connected repository; do not assume re-dropping an edited ZIP preserves the original project URL. Editing environment variables and using Redeploy on the existing deployment can rebuild that existing source.

## 2. Connect the quote form before accepting customer requests

The cart, estimated totals, quantities, filters, market selection and downloadable request work immediately. **Online quote email delivery requires setup.** The website deliberately says the request was not sent if this is not configured. It never shows a false submission confirmation.

1. Create or use the client's email-provider account at https://resend.com.
2. Add and verify a domain the client owns in Resend. Publish the DNS records Resend gives you. Use a verified sender on that domain.
3. Generate an API key in Resend. Keep it private.
4. In Vercel, open the project → Settings → Environment Variables and add these for Production:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | The secret Resend key |
| `QUOTE_FROM_EMAIL` | A verified sender, e.g. `GNS Event Rentals <support@gnsrental.com>` |
| `SITE_URL` | The final HTTPS website URL, e.g. `https://CLIENT-DOMAIN` without a trailing slash |

5. Redeploy the current deployment so these settings take effect. The API remains server-side; never put a secret in `assets/config.js`.
6. Send one clearly labeled TEST request yourself. Check that it arrives in the GNS inbox, that the correct market and rental quantities appear, and that replying goes to the customer's email. Delete the test from your inbox when finished.

The website sends one quote email to `support@gnsrental.com`, the company email in `assets/config.js`. `QUOTE_TO_EMAIL` is no longer used. The customer’s email becomes Reply-To, so replying to the notification contacts that customer. It does not send customer confirmation emails, charge a card, write a CRM record, or reserve inventory. The onscreen reference identifies the submitted email request. Email-provider acceptance does not guarantee inbox placement; verify delivery during setup.

For a public production launch, set a Vercel Firewall rate-limit rule for `POST /api/quote`. The included honeypot, origin checks, validation and per-instance throttling are a baseline; the in-memory throttle does not provide a shared limit across server instances. Configure provider/hosting usage limits in the client's accounts.

Official implementation references: https://vercel.com/docs/functions/runtimes/node-js and https://resend.com/vercel.

## 3. Add the real business contact information

Open `assets/config.js` in a text editor and fill in the client's confirmed details:

```js
siteUrl: 'https://CLIENT-DOMAIN',
email: 'CLIENT-QUOTE-INBOX',
phone: 'CLIENT-PHONE',
instagramUrl: 'https://www.instagram.com/CLIENT-HANDLE/',
googleAnalyticsId: '',
searchConsoleVerification: ''
```

The Contact page shows email, phone and Instagram only when supplied. The email also enables an email-draft fallback if the online quote service is unavailable. The Woodbridge address was supplied by the client. No phone number, client testimonials, years in business or partnerships have been invented.

After source edits, redeploy the changed source to rebuild the site. If a custom domain is attached later, update `SITE_URL` and rebuild so canonicals and the sitemap use the final domain.

## 4. Review and approve these SAMPLE rental prices

All rates below are editable starting estimates per item for a **24-hour rental**, in US dollars. They are suggestions, not verified GNS rates. The client must approve prices, rental duration, stock, delivery fees, setup, tax treatment, minimums, measurements and booking policies before commercial launch.

| Supplied item | Sample rate |
| --- | ---: |
| Gold Chiavari chair | $9.00 |
| White folding chair | $3.50 |
| Round banquet table | $16.00 |
| Rectangular banquet table | $14.00 |
| Cocktail table | $22.00 |
| White table linen | $18.00 |
| Clear water goblet | $1.25 |
| Gold arch backdrop, frame rental | $95.00 |
| White event canopy | $175.00 |
| Patio heater | $75.00 |
| Event cooler | $25.00 |
| Event waste bin | $12.00 |
| Extension cord | $8.00 |

The uploaded archive contained 14 pictures. Two banquet-table pictures were identical, so they represent one catalog item; no unverified 6-foot/8-foot variants have been invented. Dimensions, safety ratings and capacities cannot be established from the photos and are marked for confirmation. Florals, decor, fuel, ice and other accessories are not silently included.

Edit products in `assets/catalog.js`. Prices and availability are read from the same catalog by both the browser and quote API. Rebuild/redeploy after editing.

## 5. Confirm inventory separately for each market

Each product has:

```js
markets: { dc: 'request', dfw: 'request' }
```

| Value | Meaning |
| --- | --- |
| `request` | GNS has not yet confirmed that market's offering. Customer sees “Confirm with quote.” |
| `available` | GNS confirms the item is offered in that market. Event-date stock still needs confirmation. |
| `unavailable` | Item is excluded from that market's catalog and cannot be added or submitted there. |

DC/Northern Virginia is the default and the main SEO focus. DFW has a separate page at `/service-areas/dfw`. The customer's selected market carries through the collection, product pages, cart and quote form. Items are not silently transferred or promised across markets. If an existing rental list contains an item unavailable in the newly selected market, the quote form requires its removal.

## 6. Google and SEO launch

### Already implemented

- Unique page titles, descriptions and one main heading on each page.
- Main homepage and collection copy focused on Washington, DC and Northern Virginia.
- Separate DC/Northern Virginia and DFW service-area pages and separate market selectors.
- Search-readable static product pages, image alt text and responsive layouts.
- Organization data on the homepage and area-specific Service structured data on location pages.
- Canonical URLs, `robots.txt` and XML sitemap generated during deployment when Vercel provides the deployment domain or `SITE_URL` is set.
- Open Graph metadata using the site's domain and included inspiration photo.
- Optional Google Analytics, consent controls and non-PII rental-list/quote-submission events.
- Search Console verification field ready in the public settings.

The source ZIP intentionally has no invented live domain. Canonicals and sitemap are created at build time on Vercel. For a custom domain, set `SITE_URL` to that exact domain before the final rebuild. No Google account has been connected or verified by this package.

### Google Search Console

1. Open https://search.google.com/search-console and sign in with the client's Google account.
2. Add a **Domain** property for the final domain. Publish the provided verification TXT record in DNS and verify. This covers HTTPS and subdomains.
3. Alternatively, use a URL-prefix property and its HTML-meta verification method: copy only the verification content token into `searchConsoleVerification` in `assets/config.js`, rebuild, then verify.
4. Submit `https://CLIENT-DOMAIN/sitemap.xml` in Sitemaps.
5. Inspect the homepage, `/service-areas/dc-northern-virginia` and `/service-areas/dfw`. Request indexing after the site and business details are finalized.

### Google Analytics 4

1. Open https://analytics.google.com and create the client's GA4 property and Web data stream using the final website URL.
2. Put the stream's `G-...` Measurement ID in `googleAnalyticsId` in `assets/config.js` and rebuild.
3. Allow analytics in the site's consent prompt, then check GA4 Realtime.
4. Mark `quote_request_submitted` as a key event if desired. `add_to_rental_list` also records product ID, quantity and market, without names, emails or free-text form content.
5. Test essential-only browsing too. Analytics is disabled until allowed.

### Google Business Profile

Use https://www.google.com/business/ with the client's genuine business information. Establish DC/Northern Virginia as the primary service area. Do not list a made-up storefront address. If customers are not served at the business address, use an eligible service-area business setup. A separate DFW profile should be created only if that location independently satisfies Google's eligibility requirements; a secondary webpage alone is not evidence of a second physical business location. Confirm profile eligibility and service-area rules in Google's current help documentation.

Complete the real business name, phone, hours, services, website and owner-supplied event photos. Use actual customer reviews only. There are no fake reviews or star ratings in the website. LocalBusiness rich-result markup is intentionally not filled with an invented postal address; add confirmed eligible business details later if appropriate.

Google references: https://developers.google.com/search/docs/appearance/structured-data/organization and https://developers.google.com/search/docs/appearance/establish-business-details. Technical SEO does not guarantee rankings or immediate indexing.

## 7. Images and design

Product images are optimized WebP versions of the client-supplied pictures. The garden-reception hero is one original AI-generated inspiration scene, not an actual GNS event, venue or portfolio claim. It is labeled “Inspiration setting” on the website. Replace `assets/images/celebration-hero.webp` with an approved client event photo if preferred. The header and footer now use the client-supplied transparent GNS logo. The original PNG is included as `assets/images/gns-logo.png`. Fonts use system serif/sans stacks, with no external font requests.

The reference site's photos, logo, text and code have not been copied. The design is original: deep forest green, warm ivory, gold accents, editorial typography and quiet product imagery.

## 8. Final launch review

- Approve product rights, the wordmark, sample rates, each market's offering and rental period.
- Replace general policy placeholders with the client's actual rental agreement terms. Review the included privacy information against the actual providers and business practices.
- Fill in real contact details and connect the quote inbox.
- Test the catalog, quantity totals, saved list, market switching, quote validation and one real email delivery.
- Confirm the custom domain, canonical URLs, sitemap, Search Console and optional GA4.
- Review at phone and desktop sizes and with keyboard navigation.
- Set hosting/email usage controls and appropriate production rate limits.

## Optional local developer preview

With Node.js installed, run `node build.js`, then `node preview.js` inside this folder and open http://localhost:4173. Do not double-click `index.html` to test the full website: deployed routes and API calls need an HTTP server. The `public` folder is generated and is not the editable source.
