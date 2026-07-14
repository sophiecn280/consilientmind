# Consilient Mind — Professional Website

A polished, responsive, multi-page static website for **Consilient Mind**.

The project uses plain HTML, CSS, and JavaScript. There is no npm setup, framework, database, or build step, so the folder can be uploaded directly to GitHub Pages.

## Pages

- `index.html` — immersive mission-first homepage
- `podcast.html` — searchable/filterable episode archive with player modal
- `learn.html` — editorial learning hub with search and topic filters
- `community.html` — gathering schedule, program tabs, and waitlist
- `resources.html` — reading room and interactive glossary
- `about.html` — founding story and Dr. Winter introduction
- `contact.html` — accessible inquiry form prototype
- `privacy.html`, `terms.html`, and `404.html`

## Features

- Editorial forest, ivory, sage, and antique-gold design system
- Responsive desktop, tablet, and mobile layouts
- Light/dark theme with saved user preference
- Animated constellation hero and subtle reveal motion
- Reduced-motion support
- Local custom SVG artwork
- Search and category filters
- Custom audio player with a local demo sound
- Episode modal
- Expandable glossary
- Tabbed community formats
- Client-side form validation
- Semantic HTML, skip link, labels, focus states, and keyboard support
- SEO metadata, social card, sitemap, robots file, and favicon
- Editable content in `assets/js/data.js`

## Publish on GitHub Pages

1. Create a new GitHub repository, such as `consilient-mind`.
2. Unzip this project.
3. Upload **the contents inside** the `consilient-mind-github` folder to the repository.
4. Commit them to the `main` branch.
5. Open the repository's **Settings → Pages**.
6. Choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/(root)`
7. Save. GitHub will create the public URL.

The included `.nojekyll` file makes GitHub serve the assets exactly as written.

## Preview locally

Double-click `index.html`, or run a local server from the folder:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

A local server is best because it mirrors normal hosting behavior.

## Edit recurring content

Open:

```text
assets/js/data.js
```

The following arrays power the dynamic sections:

- `episodes`
- `articles`
- `books`
- `glossary`
- `gatherings`

New entries automatically inherit the existing visual design.

## Replace the logo

The current logo mark is an original placeholder for the prototype.

Replace:

```text
assets/images/logo-mark.svg
```

Keeping the same filename updates it throughout the website. A transparent SVG is ideal. You can also replace it with a PNG, but then update the file extension in every HTML page.

## Replace Dr. Winter's portrait

Replace:

```text
assets/images/founder-placeholder.svg
```

The image appears on the home and About pages.

Recommended:
- Portrait orientation
- At least 1200 × 1500 pixels
- Natural or editorial lighting
- Calm, non-clinical setting
- Optimized WebP or AVIF for production

## Add the real podcast

The included local demo audio is:

```text
assets/audio/consilient-intro.wav
```

Each episode has an `audio` property in `assets/js/data.js`. Replace it with:
- A local MP3 path
- A hosted MP3 URL
- Or replace the custom player with official Spotify, Apple Podcasts, YouTube, or podcast-host embed code

Podcast embeds may introduce cookies or analytics, so update the privacy policy accordingly.

## Connect the newsletter

The newsletter forms currently demonstrate validation and store one address only in the visitor's browser.

Production choices:
- Squarespace Email Campaigns
- Mailchimp
- Buttondown
- Kit
- Beehiiv

Replace the submit handler for `[data-newsletter-form]` in `assets/js/main.js`, or paste your provider's official form embed into the relevant pages.

## Connect the contact form

The current form validates, but does not send data.

Simple services for a static GitHub site:
- Formspree
- Basin
- Getform

For Formspree, add its endpoint and method to the form:

```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

Then remove or revise the `data-contact-form` submit handler near the bottom of `assets/js/main.js`.

Do not invite visitors to submit medical information. Consilient Mind is deliberately positioned as educational and non-clinical.

## Add full articles

The Learning Hub cards are editorial prototypes. Three practical routes:

1. Create a separate HTML page for every article.
2. Migrate the design into Squarespace and use blog collections.
3. Add a headless CMS such as Decap CMS, Sanity, or Contentful.

For an initial GitHub launch, individual HTML article pages are the simplest.

## Custom domain

After GitHub Pages is active:

1. Add the final domain under **Settings → Pages**.
2. Follow GitHub's DNS instructions.
3. Create a file called `CNAME` in the repository root with only the domain:

```text
www.consilientmind.org
```

Do not add a placeholder CNAME before the domain is selected.

## Before launch

- Replace the placeholder logo and founder portrait
- Have Dr. Winter approve the mission, biography, quotations, and offering names
- Verify all professional credentials and institutional affiliations
- Add real podcast, social, and Park West Integrative links
- Connect newsletter and contact forms
- Replace prototype event dates
- Review the medical disclaimer language
- Have privacy and terms pages reviewed for the actual tools used
- Update `robots.txt` and `sitemap.xml` with the real domain
- Test Safari, Chrome, Firefox, iPhone, and Android
- Optimize any future photography
- Run a final accessibility audit
- Decide whether analytics are necessary and document them

## Folder structure

```text
consilient-mind-github/
├── index.html
├── podcast.html
├── learn.html
├── community.html
├── resources.html
├── about.html
├── contact.html
├── privacy.html
├── terms.html
├── 404.html
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── LICENSE.txt
└── assets/
    ├── audio/
    ├── css/styles.css
    ├── images/
    └── js/
        ├── data.js
        └── main.js
```

## Design principle

The site is intended to feel editorial rather than corporate, contemplative rather than clinical, premium through restraint, and capable of expanding into podcasts, essays, courses, retreats, contributors, and community programs.
