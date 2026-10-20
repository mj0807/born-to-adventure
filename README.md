# Born to Adventure — Website

Static site: `index.html`, `gallery.html`, `styles.css`, `script.js`, `gallery.js`, `gallery-data.js`, `favicon.svg`, `robots.txt`. No build step or backend.

## Videos

Clips live in `videos/` (muted, ~8 s, 540x960 MP4 + a poster `.jpg` each). They play only while on screen.
To add one: put `name.mp4` and `name.jpg` in `videos/` and copy one of the `<button class="gallery-item">` lines in the gallery section of `index.html`.
Your original footage is in `Desktop\born-to-adventure-whatsapp-final\images`. Keep those; they are far too big for the site.

## Full gallery (gallery.html)

`gallery.html` shows every clip in `videos/gallery/`, with filters by activity and a full-screen player (muted, swipe or arrow keys to move between clips).
The list of clips, their titles and categories is in `gallery-data.js`. To add a clip: put `name.mp4` + `name.jpg` in `videos/gallery/` and add a line like
`{"id": "name", "cat": "paragliding", "title": "My caption", "dur": 8}` (cat = paragliding, rafting, bungee or balloon).

## Going live (free options)

- **Netlify Drop**: go to app.netlify.com/drop and drag the whole folder in. Done in a minute; add a custom domain later.
- **GitHub Pages**: push the folder to a repo → Settings → Pages → deploy from `main`.
- **Cloudflare Pages / Vercel**: connect the repo, no build command, output folder `/`.

After it's live:
- Add the site to **Google Search Console** and your **Google Business Profile** (with the same phone/address).
- Once you have a domain, add `<link rel="canonical" href="https://yourdomain.com/">` and `<meta property="og:url">` in `index.html`.

## Still to add when available

- Logo (replace the text logo in the header/footer and `favicon.svg`)
- Instagram / Facebook links (commented out in the footer)
- Guest reviews (section commented out in `index.html`, above the FAQ)
- Your own clips for Zipline, Trekking and Camping (they still use free Unsplash photos)
- Rafting prices for the 9 km and 14 km routes (currently "From ₹750")
- Registration / insurance details, if you want them shown
