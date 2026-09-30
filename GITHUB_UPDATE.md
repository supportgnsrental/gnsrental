# Upload this update to the existing GitHub repository

This release fixes the oversized logo seen when a browser reuses an older stylesheet. CSS and script URLs now include content versions, and the logo markup contains safe display dimensions. Asset responses also require browser revalidation.

This package updates the GNS website with:

- The supplied transparent gold-and-navy GNS logo in the header and footer.
- **2500 Vantage Dr, Woodbridge, VA 22191** on the Contact page and shared footer.
- The supplied logo and PostalAddress in the homepage's Organization structured data.
- The editable source files and rebuilt static HTML pages.

## Browser upload

1. Unzip this package on your computer.
2. Open the same GitHub repository already connected to your existing Vercel project.
3. Make sure you are on that project's production branch, usually `main`.
4. At the repository's top level, choose **Add file → Upload files**.
5. Drag the files and folders **inside the extracted folder** into the upload area. Do not upload the ZIP itself or nest everything inside an extra parent folder. Preserve the `assets`, `api`, `rentals` and `service-areas` folders.
6. Commit with a message such as **Fix logo sizing and refresh cached site assets**. If the branch requires a pull request, create it and merge it into the production branch.
7. Open the existing Vercel project's Deployments page and wait for the new production deployment to show Ready.
8. Open your existing website URL and check the header, footer and Contact page.

The repository root should contain `index.html`, `build.js`, `package.json`, `vercel.json`, `assets/`, `api/`, `rentals/` and `service-areas/`.

If Vercel asks for settings: Framework **Other**, Build Command **node build.js**, Output Directory **public**, Root Directory the repository root. `vercel.json` already supplies the build/output settings.

## Editing later

The page templates are in `build.js`. Address and logo path are in `assets/config.js`. Styling is in `assets/style.css`. Products and prices are in `assets/catalog.js`. Vercel runs the build and regenerates the pages after a committed update. Editing only a generated HTML file will be overwritten by that build.

Your existing Vercel environment variables remain in the same project. Keep email-provider keys there; never add secret keys to GitHub. This package does not include any credentials.

Source changed in this revision: `build.js`, `assets/config.js`, `assets/style.css`, `assets/images/gns-logo.png`, `package.json`, `vercel.json`, and documentation. All static HTML files and the included desktop/mobile preview screenshots were regenerated.

The address is shown as a business address. No showroom opening hours, walk-in availability or pickup permissions have been inferred.
