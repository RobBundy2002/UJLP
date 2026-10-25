"""Regenerate web-reader text from published PDFs (requires pdfplumber).
Run from the repository root. Review extracted text against the source before publishing.
"""
import json
import re
import unicodedata
from pathlib import Path
import pdfplumber

ARTICLES = [('unequalopportunity', 'Unequal Opportunity'), ('schoolhousesecrets', 'Schoolhouse Secrets')]

def line_tokens(line):
    words = pdfplumber.utils.extract_words(line['chars'], x_tolerance=1.5, y_tolerance=3, return_chars=True, expand_ligatures=False)
    tokens = []
    for i, word in enumerate(words):
        if i:
            tokens.append({'text': ' '})
        for char in word['chars']:
            if char['text'].isdigit() and char['size'] < 8:
                if tokens and 'note' in tokens[-1]:
                    tokens[-1]['note'] += char['text']
                else:
                    tokens.append({'note': char['text']})
            else:
                italic = 'Italic' in char['fontname']
                if tokens and 'text' in tokens[-1] and tokens[-1].get('italic', False) == italic:
                    tokens[-1]['text'] += unicodedata.normalize('NFKC', char['text'])
                else:
                    tokens.append({'text': unicodedata.normalize('NFKC', char['text']), **({'italic': True} if italic else {})})
    return tokens

def append_tokens(paragraph, tokens):
    if paragraph:
        # PDF line wraps split words after hyphens. Keep the hyphen, without a space.
        if not ('text' in paragraph[-1] and paragraph[-1]['text'].endswith('-')):
            paragraph.append({'text': ' '})
    paragraph.extend(tokens)

for slug, name in ARTICLES:
    sections, notes = [], {}
    active = False
    paragraph = None
    last_note = None
    with pdfplumber.open(f'public/ArticlePDFs/{name} Final Manuscript.pdf') as pdf:
        for page in pdf.pages:
            for line in page.extract_text_lines(expand_ligatures=False):
                text = unicodedata.normalize('NFKC', line['text'].strip())
                if line['top'] < 65 or line['top'] > 710:
                    continue
                size = max(c['size'] for c in line['chars'])
                if size < 10.5:
                    if not active:
                        continue
                    # Footnote labels are superscript; continuation lines have no label.
                    first = min(line['chars'], key=lambda c: c['x0'])
                    match = re.match(r'^(\d+)\s*', text) if first['size'] < 8 and first['text'].isdigit() else None
                    if match:
                        last_note = match.group(1)
                        notes[last_note] = text[match.end():]
                    elif last_note:
                        notes[last_note] += ('' if notes[last_note].endswith('-') else ' ') + text
                    continue
                heading = text == 'INTRODUCTION' or re.match(r'^[IVX]+\. ', text) or text == 'CONCLUSION'
                if heading and text.isupper():
                    active = True
                    sections.append({'id': f'section-{len(sections)+1}', 'title': text, 'paragraphs': []})
                    paragraph = None
                    continue
                if not active:
                    continue
                if paragraph is None or line['x0'] >= 139:
                    paragraph = []
                    sections[-1]['paragraphs'].append(paragraph)
                append_tokens(paragraph, line_tokens(line))
        refs = {t['note'] for section in sections for p in section['paragraphs'] for t in p if 'note' in t}
        assert refs == set(notes), (slug, 'Unmatched notes', refs-set(notes), set(notes)-refs)
        assert sorted(map(int, notes)) == list(range(1, len(notes)+1))
        for section in sections:
            for index, paragraph in enumerate(section['paragraphs']):
                compact = []
                for token in paragraph:
                    if compact and 'text' in token and 'text' in compact[-1] and token.get('italic', False) == compact[-1].get('italic', False):
                        compact[-1]['text'] += token['text']
                    else:
                        compact.append(token.copy())
                section['paragraphs'][index] = compact
        data = {'sourcePdf': f'/ArticlePDFs/{name} Final Manuscript.pdf', 'sections': sections, 'footnotes': notes}
        Path(f'src/Data/articleTexts/{slug}.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
        print(slug, len(sections), 'sections;', len(notes), 'footnotes;', sum(len(s['paragraphs']) for s in sections), 'paragraphs')
