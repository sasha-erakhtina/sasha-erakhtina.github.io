# Personal academic site — Aleksandra (Sasha) Erakhtina

Plain HTML and CSS. No build step, no Ruby, no Jekyll. You edit a file, you commit, it's live.

## Putting it online

1. Create a GitHub repository named exactly `<your-github-username>.github.io`.
2. Copy the contents of this folder into it (not the folder itself — `index.html` must sit at the repo root).
3. `git add . && git commit -m "Site" && git push`
4. Repo → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Live at `https://<your-github-username>.github.io` within a minute or two.

To preview locally: `python3 -m http.server` in this folder, then open `http://localhost:8000`.

## Files to add

| Path | What |
|---|---|
| `cv.pdf` | Your CV. Keep this filename permanently so saved links never break. |
| `papers/sex-ratio-tasmania.pdf` | Working paper. Create the `papers/` folder. |
| `assets/img/portrait.jpg` | Your photo, once you pick one. |

## Filling it in

Every placeholder is marked `<span class="fill">…</span>` and renders as dashed red text, so
nothing unfinished can slip past you. Search the files for `class="fill"` to find them all:

```bash
grep -rn 'class="fill"' *.html
```

Delete the whole `<span>` and write the real text in its place.

## Editing conventions

- Colours and type live in `:root` at the top of `assets/css/style.css`. Change them there, nowhere else. The palette is warm white `#fbfaf8` with a deep teal accent `#1f5f5b`.
- The site uses Georgia with a system fallback stack. No web fonts are loaded at all, so the page renders instantly, works offline, and makes no third-party requests. The CV stays in Computer Modern — print and screen have different needs, and nobody sees them side by side.
- A new paper = copy an existing `<div class="entry">` block and edit it.
- The left gutter of an entry (`entry__meta`) is for date and coauthors only. Keep it short — it collapses above the title on phones.
- Update the "Last updated" line in the footer of `index.html` when you change anything substantive.

## The plate

`assets/img/sydney-1888.jpg` is M. S. Hill, *The City of Sydney*, 1888 — a chromolithograph published
in 1888 and long out of copyright. `sydney-band.jpg` is a crop of it used as the masthead strip.
Add the holding institution to the caption in `index.html` once you know where the scan came from.

`assets/js/plate.js` opens the full plate in a pan-and-zoom viewer: drag to pan, scroll or `+`/`-`
to zoom, double-click to zoom in, `0` to fit, `Esc` to close.

## Email

`assets/js/mail.js` assembles the address in the browser, so the page source contains no
harvestable `mailto:`. If you change your address, change it in that one file.

## The CV

`cv/cv.tex` is the source; the compiled `cv.pdf` sits at the site root so the link `cv.pdf`
always resolves.

```bash
cd cv && pdflatex cv.tex && pdflatex cv.tex && mv cv.pdf ..
```

Twice, so the page numbers settle. Computer Modern is LaTeX's default typeface, so there is
nothing to install — this compiles anywhere TeX is installed.

Two switches at the top control what the build contains:

- `\phonefalse` omits the mobile number; `\phonetrue` prints it.
- `\refereesfalse` omits the Referees section; `\refereestrue` prints it with email addresses.

Both are set to *false* here, which is the copy that belongs on the website. Flip both to *true*
for the copy you email people directly, and keep that one out of the repo.
- Items still to confirm are wrapped in `\todo{...}` and print in bold. Search the file for
  `\todo` to find them. Delete the `\todo` macro definition once they are all gone.
