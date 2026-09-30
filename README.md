# GNS Event Rentals

An elegant rental showroom for Washington, DC and Northern Virginia, with a separate Dallas–Fort Worth market. Visitors browse products and celebration collections, choose quantities, and request a personalized quote. Adding an item does not reserve it.

## Develop and verify

Requires Node 22. No runtime npm dependencies are needed.

```sh
npm run build
npm test
npm start
```

The local preview defaults to port 4173. Vercel runs `node build.js`, serves `public`, and uses `api/quote.js` for quote submissions.

## Update the website

- `content/showroom.js`: founder story, rental categories, celebration collections and rental steps.
- `build.js`: page layouts, navigation, homepage order and dedicated pages.
- `assets/catalog.js`: listed products, estimates, images and market availability.
- `assets/config.js`: business address, contact details, official social links and optional analytics/Search Console IDs.
- `assets/style.css`: responsive design and logo sizing.
- `assets/app.js`: quote list, search, navigation and quote-form interactions.

Run the build after changes. Root HTML files are generated alongside `public` for static inspection; commit the regenerated root pages with their source changes.

## Production settings

Canonical URLs and sitemap use `SITE_URL`, the configured `siteUrl`, or Vercel's production domain. Set `SITE_URL` to the final HTTPS custom domain after it is connected. Optional Google Analytics only loads after consent. Add the real Google Analytics and Search Console IDs to the public config when available.

Online quote delivery requires Vercel environment variables `RESEND_API_KEY` and `QUOTE_FROM_EMAIL`. Every valid quote submission emails the company address in `assets/config.js` (`support@gnsrental.com`), with the customer’s address as Reply-To. `QUOTE_TO_EMAIL` is no longer needed and cannot redirect notifications. `GET /api/quote` provides a read-only readiness check without exposing credentials. Without the required sending settings, the form clearly says the request was not sent and offers a downloadable copy and an email draft. Contact details and form notes are not tracked by analytics.

## Editorial notes

The gallery currently uses rental details and labeled styling inspiration, not past client events. Replace inspiration with approved GNS event photos and a founder photo as they become available. Testimonials remain unpublished until genuine reviews are provided. The social image strip contains collection details and links to Instagram; it is not a live Instagram feed. Add official Facebook/TikTok URLs and a business phone to config when supplied. The email address is reproduced exactly as provided by GNS.

Unlisted categories invite a personalized request without inventing products, prices or availability. The New Arrivals page currently highlights four pieces in the growing catalog; update that selection when new inventory is confirmed. Market availability, delivery, setup and booking terms are reviewed through the quote process.
