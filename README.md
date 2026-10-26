# Tripvanda

Static, responsive travel website for **Tripvanda, Karunagappally, Kollam, Kerala**. Production domain: **https://tripvanda.com**. All travel enquiries lead to **+91 81294 22113** on WhatsApp or phone. No backend, accounts, checkout, payment collection or instant booking.

## Pages and features

- Home, services, taxi services, flight tickets, train tickets, destinations, about, contact, privacy and enquiry terms.
- Custom 404 page, accessible mobile navigation, native FAQ disclosures, keyboard focus styling, reduced-motion support and responsive layouts.
- Enquiry forms build an encoded WhatsApp message; visitors choose to send it in WhatsApp. Form information is not stored by the website.
- Unique titles and descriptions, canonical URLs, Open Graph and Twitter metadata, local `TravelAgency` JSON-LD, website and page schema, inner-page breadcrumbs, semantic headings and image alt text.
- `sitemap.xml`, `robots.txt`, `llms.txt`, `.nojekyll`, `CNAME` and GitHub Pages deployment workflow.
- Destination descriptions are inspiration, not advertised fixed packages. No unverified prices, reviews, opening hours, credentials or booking guarantees.

## Preview

Open `index.html` directly in a browser, or run from the project folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. The static site requires no npm packages. Python is only needed to regenerate/check the source; Node is only used for JavaScript checks.

## Update content

Shared layout, metadata and page copy are maintained in `scripts/build.py`. After changing it, regenerate the committed HTML:

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check assets/main.js
node scripts/check-interactions.cjs
```

Edit appearance in `assets/styles.css` and interactions in `assets/main.js`. Do not only edit generated HTML: the deployment workflow regenerates it. The supplied `logo.jpeg` is preserved; `assets/brand-mark.webp` uses its artwork with a separate correctly spelled Tripvanda wordmark. The social preview and favicon are local assets.

## Deploy to GitHub Pages

1. Create a GitHub repository, add these files, and push to the `main` branch. This workspace was not initially a Git repository; no repository has been created or pushed automatically.
2. In the repository, open **Settings → Pages → Build and deployment**, and select **GitHub Actions** as the source.
3. Run the **Deploy Tripvanda to GitHub Pages** workflow, or push another commit. The workflow generates pages, runs checks and publishes only public HTML/assets. Development scripts and original artwork are excluded from the published artifact.
4. Set **Custom domain** to `tripvanda.com` in **Settings → Pages**. The included CNAME is useful for branch-based hosting, but GitHub's Actions deployment still requires this setting.
5. Configure your domain DNS according to [GitHub’s custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). For the apex (`@`), the currently documented A records are:

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   For `www`, add a CNAME to `YOUR-GITHUB-USERNAME.github.io` (replace the username; do not include the repository path). Set the custom domain in GitHub before changing DNS. Enable **Enforce HTTPS** when available.
6. Visit the live home, service and contact pages on desktop and mobile, check imagery and menu/FAQ behavior, and confirm the WhatsApp handoff. No test message needs to be sent.
7. Submit `https://tripvanda.com/sitemap.xml` to your search-engine webmaster account after the domain is live.

Workflow reference: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

All canonical, sitemap and social URLs target the confirmed custom domain. If deploying under a different final domain, update `BASE` in `scripts/build.py`, crawler files, CNAME and the social-card text. Relative page/asset links support project previews; the custom 404 base path targets the final root-domain deployment.

## Assets and dependencies

Travel photography loads from Unsplash image URLs; typography loads from Google Fonts with system fallbacks. These external requests are described in the privacy page. Image delivery/availability and fonts require internet access; the site has no runtime JavaScript libraries, package install or three.js requirement. The hero uses a subtle CSS entrance animation, disabled for reduced-motion users. For fully independent asset delivery, download licensed copies of the selected photography and fonts and replace their external URLs with local files.

## Verification status

Dependency-free HTML checks cover all pages, internal files and anchors, one H1 per page, unique titles, descriptions, canonical/social tags, JSON-LD parsing, contact numbers and sitemap coverage. JavaScript checks validate syntax and exercise both forms with Unicode, punctuation and multiline enquiry details.

These checks passed during creation. Browser rendering, responsive screenshots, external image/font availability, live GitHub deployment and DNS have **not** been verified: the execution environment prohibited local server sockets, browser policy prohibited local-file previews, and no GitHub repository or DNS connection was supplied. Run the preview and live checks above before launch. Search metadata and crawler access support discoverability; search indexing, rich results and AI citations are controlled by their respective services. `llms.txt` is an emerging convention rather than a mandatory web standard.
