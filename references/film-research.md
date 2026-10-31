# Film research — any film, researched live

The skill has no film library. The user names a film, describes a look ("90s Hong Kong late night, lonely,
humid"), or leaves it to you. Either way the film is found and researched **now**, from sources, and its
frames are looked at before anything is built. The worked examples in `grades.md` and `art-direction.md` show
what the result looks like. They are not a list to choose from.

What memory gets wrong is predictable. A remembered palette is usually the poster's or another film's. A
remembered credit is often a different designer. A remembered "look" is usually the film's reputation. So:
**sources for facts, frames for the look, and a tag on every line.**

## Entry points

**1. The user names a film** (or a director, which means a film by them: ask which, or pick the one whose
sequence fits the brief and say why). Go to *Researching a film*.

**2. The user gives a description.** Find candidate films first:
- **Queries.** Search with era, place, time of day and feeling as nouns ("1990s Hong Kong night neon
  cinematography"). Add "cinematographer", "shot on" or "lensed" to surface DP names. Search "films like <anchor
  film>" on MUBI, Letterboxd or Criterion lists, then follow each director or DP name. Programme notes from
  archives, museums and festivals (BFI, M+, Film at Lincoln Center) are good sources, and so are restoration
  notes ("4K restoration <film> grade stock").
- **Verify the look, not the theme.** A film set in 90s Hong Kong about loneliness is a theme match. A look match
  has a named DP, stock, lens or grade in two independent sources, plus a written description of what the light
  is made of. A theme-only match is rejected as a look reference.
- **Pitch three.** For each candidate give the director, year, DP and designer, which words of the description it
  answers, and the evidence (source plus what it says about the picture). Candidates may be theme matches if
  labelled as such. The one you cast must be either look-verified or marked *look unverified*, with stills
  requested in the asset call. Then cast it as the casting session in
  SKILL.md does: the dramatic problem decides, not the genre. If the user wants to choose, they choose.
- What this does not settle: a search confirms reputation and theme quickly, but never the look. Tested on "90s
  Hong Kong late night, lonely, humid", it found Chungking Express and Fallen Angels fast. It rejected *In the
  Mood for Love* and *Days of Being Wild* (1960s) and *Happy Together* (Buenos Aires), but found no source for
  "humid" as a look. Only frames confirm the look.

## Researching a film

Work in rounds and stop when the facts stop coming. A film with designer interviews in print is solid after
two rounds. A thinly documented one stays thin after four, and more searching has low return. Cap at about
**3–5 rounds (15–30 calls) per film**, then list the gaps. Research several candidates in parallel when you can
delegate.

1. **Credits.** Director, cinematographer, production designer, art director, set decorator, costume, graphic or
   screen-graphics designer, title designer. Use AFI, Wikipedia and the film's own site, and check spelling
   variants (Hwarng / Huang 黃文英). When databases disagree, say so and check a second listing.
2. **Light and grade.** `"<film>" American Cinematographer <DP>` (theasc.com: use the `/article/<slug>/` URL
   the search returns), BFI, British Cinematographer, Kodak's case studies, restoration notes. Extract the GRADE
   (`grades.md`).
3. **Art direction.** Search `"<designer>" "<film>" production design interview`. Named-person queries find the
   primary pieces (Interiors Journal, Pushing Pixels, Oscars.org backstage transcripts, Dwell, ADG Perspective).
   For screen graphics, search `<film> <graphics studio> screen graphics` (Territory Studio, HUDS+GUIS,
   Motionographer). For hand-made graphics, search `<graphic designer> <film> lettering` (AIGA Eye on Design,
   TypeRoom). Extract the ART block (`art-direction.md`).
4. **Poster and titles.** Try Poster House, which gives full credit blocks, and Art of the Title for title
   design and logotype origin. Artist interviews give medium and brief. Criterion covers have credits in Eye
   Magazine or AIGA, and the alternates are the Mondo, Polish, Japanese B2 and chirashi releases. Dealer listings
   (filmonpaper, japanposter, emovieposter) are claims: confirm them with a second listing. Extract the POSTER
   line.
5. **Non-English cinema.** Search in the film's language too (黃文英 美術, 杜可風 攝影). English queries find little
   on the art direction of older Hong Kong, Taiwanese and European films.

**Tag every line.**
- **[P] Primary:** a maker (designer, DP, director, graphic designer) quoted in an edited publication. Use the
  test: does a sentence start with their name and a verb of intention ("we wanted…", "I built…")?
- **[S] Secondary:** a critic or press describing the screen. It is good for "what the frame looks like" and never
  for "what they intended".
- **[W] Wiki or database:** credits only, cross-checked. Follow a Wikipedia footnote to the original instead of
  citing Wikipedia.
- **[I] Inference:** yours. Allowed, labelled, and never upgraded to fact.
- **[conflict]:** two sources disagree. Write both, e.g. "[conflict: A says long takes; B says close views]", and
  build from the one the frames support.
- Reached only through a search summary because the page was blocked? Write "via search summary". Search
  summaries paraphrase and sometimes merge sources, so re-fetch before quoting.

**Known blocked or useless sources.** criterion.com film and essay pages, Fast Company, Gizmodo, faroutmagazine,
nofilmschool, sensesofcinema, focustaiwan, thenewslens and FIPRESCI pages often return 403 or come back
truncated, so use the snippet and label it. The Hollywood Reporter is
paywalled. IMDb, TMDB, Letterboxd and font-identification blogs give credits at best. Content-farm and "hidden
details" pages are never cited. Do not guess domains, and never put a remembered name into a query as if it
were a fact: a wrong premise returns nothing, or returns itself.

**Usually findable vs usually missing.** You can almost always find:
- the production designer, DP and costume designer;
- whether sets were built or found, and where;
- the era and place;
- one or two sourced facts on materials or colour;
- awards, and named props.

It is usually missing:
- in-world lettering in the designer's own words;
- wallpaper and pattern specifics;
- density statements;
- shape language in the designer's words (that is nearly always critics');
- poster layout, type and colour count;
- the agency behind a studio's own one-sheet.

This list holds for well-documented films. For older and non-English films, even the production designer and
poster designer can be missing. Before you call a field missing, search in the original language and in national
archives (Taiwan Film & Audiovisual Institute, Hong Kong Film Archive, Korean Film Archive, Cinémathèque).

When a field is missing, write "unsourced" and build that line of the UI map from the mechanism that *is* sourced
(frame, material, density, lettering genre), not from a guess.

**When the evidence is thin.**
- *No stills, and the film is not a worked example.* Write a provisional `look` from the sourced facts through the
  dials in `grades.md`: the light source, the blacks and highlights, the hue count, the grain. Or take the
  nearest worked example *by mechanism* (not by genre), say which one, and adjust it. Mark it *unmeasured*.
- *No poster found.* Pick the grammar that fits the film's own mechanism (a film of held wide frames suits a
  Swiss single element or a Criterion-style still). Mark it [I] and write "film's poster not found". Do not invent
  a poster.
- *The client's words versus the refused defaults.* The client's stated look wins. The refused defaults
  (`grades.md`) are what an *uncast* page reaches for, and they are not a ban on what a client asks for. Turn the
  client's word into the film's mechanism ("faded" → a pull-processed, lifted-black print, not a sepia overlay),
  and say so.

## Looking at the frames

Facts tell you why. Frames tell you what it looks like. Both are needed.
- **Reference stills.** Six to twelve frames of the cast sequence, covering the darkest, brightest and most
  colourful moments. Ask the user for them in the asset call, or view them online with their permission: open
  them in a browser or an image-reading tool. An agent that can neither ask nor view (a delegated subagent)
  writes the request into the asset call as an open item, and the lead agent asks. Measure
  them with `scripts/grade-from-stills.mjs`. Keep them in a `refs/` folder that never ships.
- **Set and prop details.** Add three to six close views of surfaces, walls, signage and documents to the same
  board. They are the art department's evidence.
- **The poster.** View it to read the composition, then describe it in words in the POSTER line. Do not store it
  or embed it. A composition you did not see is [I].
- Images found online are looked at, not downloaded into the project, unless the user approves and their use is
  analysis only. None of them is ever published.

## What comes out

Write a research note into the project (`research/<film>.md`) with every claim tagged and every URL listed. Put
three blocks in the treatment:
- **GRADE** (`grades.md`): light, blacks, highlights, hues and banned hues, grain, the measured `look`
- **ART** (`art-direction.md`): shape, material, ornament, era of making, density, in-world graphics, the UI map,
  costume
- **POSTER** (`art-direction.md`): the grammar borrowed for the first frame, OG image, title cards and credits

The first line of each block names how it was made: *researched (n sources, m frames measured)* or *unresearched*.

## Without web access

If you cannot search, say so. If the film is one of the worked examples, use that entry and mark it *from the
skill's examples*. Otherwise write the blocks from memory, tag every line [I], mark the treatment *unresearched*,
and ask for stills, because the frames can still be measured. Never present memory as research.
