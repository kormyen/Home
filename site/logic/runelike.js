function Runelike()
{
    this.media = null;
    this.links = null;
    this.log = null;
    this.inline = null;
    const parent = this;

    const runes =
    {
        't': { tag: 'h2' }, // paragraph title-line 'fontSizeSmall marginTopNormal colorMain'
        '2': { tag: 'h2' },
        '3': { tag: 'h3' },
        'p': { tag: 'p' }, // paragraph normal-line 'fontSizeSmall marginTopNormal colorSecondary'
        'q': { tag: 'quote', join: false },
        'b': { tag: 'br' }, // paragraph normal-line 'fontSizeSmall marginTopNormal colorSecondary'
        'i': { tag: 'img', join: false }, // image full-width by-date 'widthFit marginTopNormal radiusNormal'
        'y': { tag: 'yt', join: false },
        'v': { tag: 'vimeo', join: false }
    }

    this.install = function(media, inline)
    {
        this.media = media;
        this.inline = inline;
    }

    this.parse = function(lines = [])
    {
        this.isRunic = function(l)
        {
            const rune = l.substr(0, 1);
            if (rune === ';') { return false } // Comment ;
            // if (l.substr(1, 1) !== ' ') { console.warn('Non-Runic', l); return false; }
            if (!runes[rune]) { console.warn(`Non-Runic[${rune}]`, l); return false; }
            return true;
        }

        this.stash = function(acc, line)
        {
            // Combine same tags into one (so that paragraphs float/flow around images properly)
            const rune = runes[line.substr(0, 1)];
            let lineValue = line.substr(2);
            const prev = acc[acc.length - 1] ? acc[acc.length - 1] : { rune: rune, a: [] };
            if (this.prevRune === rune.tag && rune.join != false)
            {
                prev.a.push(lineValue);
                if (acc.length == 0)
                {
                    // This is the first line (it had nothing previous), add it to accumulation.
                    acc.push(prev);
                }
            }
            else
            {
                acc.push({ rune: rune, a: [lineValue] });
            }

            this.prevRune = rune.tag;
            this.prevLine = lineValue;
            return acc;
        }

        this.toHtml = function(acc, stash)
        {
            let result = '';

            if (stash.rune.tag == 'img')
            {
                for (let i = 0; i < stash.a.length; i++)
                {
                    let imageData = parent.media.getByDate(stash.a[i]);
                    result += `${acc} ${imageData.htmlMed}`;
                }
            }
            else if (stash.rune.tag == 'h2')
            {
                result += `${acc}<p class='fontSizeLarge marginTopLarge colorSecondary'>`;
                for (let i = 0; i < stash.a.length; i++)
                {
                    if (i > 0)
                    {
                        result += `<br><br>`;
                    }
                    result += `${parent.inline.parse(stash.a[i])}`;
                }
                result += `</p>`;
            }
            else if (stash.rune.tag == 'h3')
            {
                result += `${acc}<p class='fontSizeNormal marginTopLarge marginBottomNormal colorSecondary'>`;
                for (let i = 0; i < stash.a.length; i++)
                {
                    if (i > 0)
                    {
                        result += `<br><br>`;
                    }
                    result += `${parent.inline.parse(stash.a[i])}`;
                }
                result += `</p>`;
            }
            else if (stash.rune.tag == 'p')
            {
                result += `${acc}<p class='fontSizeSmall marginTopNormal marginBottomNormal colorSecondary'>`;
                for (let i = 0; i < stash.a.length; i++)
                {
                    if (i > 0)
                    {
                        result += `<br><br>`;
                    }
                    result += `${parent.inline.parse(stash.a[i])}`;
                }
                result += `</p>`;
            }
            else if (stash.rune.tag == 'quote')
            {
                result += `${acc}<p class='fontSizeSmall marginTopNormal marginBottomNormal colorSecondary'><i> > `;
                for (let i = 0; i < stash.a.length; i++)
                {
                    if (i > 0)
                    {
                        result += `<br><br>`;
                    }
                    result += `${parent.inline.parse(stash.a[i])}`;
                }
                result += `</i></p>`;
            }
            else if (stash.rune.tag == 'br')
            {
                result += `${acc}<p class='fontSizeSmall marginTopNormal colorSecondary'>`;
                for (let i = 0; i < stash.a.length; i++)
                {
                    if (i > 0)
                    {
                        result += `<br>`;
                    }
                    result += `${parent.inline.parse(stash.a[i])}`;
                }
                result += `</p>`;
            }
            else if (stash.rune.tag == 'yt')
            {
                for (let i = 0; i < stash.a.length; i++)
                {
                    result += `${acc}<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/${stash.a[i]}' frameborder='0' allowfullscreen></iframe></div>`;
                }
            }
            else if (stash.rune.tag == 'vimeo')
            {
                for (let i = 0; i < stash.a.length; i++)
                {
                    result += `${acc}<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://player.vimeo.com/video/${stash.a[i]}' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>`;
                }
            }

            return result;
        }

        console.log(lines)
        return lines.filter(this.isRunic).reduce(this.stash, []).reduce(this.toHtml, '');
    }
}