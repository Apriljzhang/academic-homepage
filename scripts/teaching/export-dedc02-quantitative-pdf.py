"""Build the English lesson handout from the generated, guided Astro lesson.
Run after the Astro build with the bundled Python runtime (reportlab + pypdf).
Optional method pages remain linked from the map, rather than becoming taught slides.
"""
from html.parser import HTMLParser
from html import escape
from pathlib import Path
import re
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, LongTable, TableStyle, KeepTogether, CondPageBreak
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[2]
INPUT = ROOT / 'dist/teaching/courses/dedc02/08-quantitative-analysis/index.html'
OUTPUT = ROOT / 'public/teaching/courses/dedc02/quantitative-data-analysis-and-reporting.pdf'
SITE = 'https://apriljzhang.com'
LESSON = SITE + '/teaching/courses/dedc02/08-quantitative-analysis/'

class Node:
    def __init__(self,tag='root',attrs=()): self.tag=tag;self.attrs=dict(attrs);self.children=[]
    def has(self, cls): return cls in self.attrs.get('class','').split()
    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child,Node): yield from child.walk()

class Parser(HTMLParser):
    void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def __init__(self): super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root]
    def handle_starttag(self,tag,attrs):
        n=Node(tag,attrs);self.stack[-1].children.append(n)
        if tag not in self.void:self.stack.append(n)
    def handle_startendtag(self,tag,attrs): self.handle_starttag(tag,attrs);self.handle_endtag(tag)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:self.stack=self.stack[:i];return
    def handle_data(self,data):self.stack[-1].children.append(data)

font_dir=Path('/System/Library/Fonts/Supplemental')
for name,file in [('Body','Arial.ttf'),('BodyBold','Arial Bold.ttf'),('Display','Georgia.ttf'),('DisplayBold','Georgia Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(font_dir/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='Body',boldItalic='BodyBold')
pdfmetrics.registerFontFamily('Display',normal='Display',bold='DisplayBold',italic='Display',boldItalic='DisplayBold')
GREEN=colors.HexColor('#0f4a32');RULE=colors.HexColor('#bad8c5');PALE=colors.HexColor('#edf7f0')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='Copy',fontName='Body',fontSize=9.5,leading=13.5,textColor=GREEN,spaceAfter=6))
styles.add(ParagraphStyle(name='SmallCopy',parent=styles['Copy'],fontSize=8,leading=11,spaceAfter=6))
styles.add(ParagraphStyle(name='Cell',parent=styles['Copy'],fontSize=8,leading=11,spaceAfter=0))
styles.add(ParagraphStyle(name='H1Q',fontName='DisplayBold',fontSize=31,leading=35,textColor=GREEN,spaceAfter=18))
styles.add(ParagraphStyle(name='H2Q',fontName='DisplayBold',fontSize=23,leading=28,textColor=GREEN,spaceBefore=5,spaceAfter=14,keepWithNext=True))
styles.add(ParagraphStyle(name='H3Q',fontName='Display',fontSize=15,leading=20,textColor=GREEN,spaceBefore=12,spaceAfter=8,keepWithNext=True))
styles.add(ParagraphStyle(name='H4Q',fontName='BodyBold',fontSize=11,leading=15,textColor=GREEN,spaceBefore=9,spaceAfter=6,keepWithNext=True))
styles.add(ParagraphStyle(name='SummaryQ',parent=styles['H4Q'],keepWithNext=False))
styles.add(ParagraphStyle(name='Quote',parent=styles['Copy'],leftIndent=12,rightIndent=10,borderColor=RULE,borderWidth=1,borderPadding=9,spaceBefore=7,spaceAfter=13))

SKIP={'script','style','button','input','select','textarea','svg','dialog','nav','colgroup','col'}
def hidden(n):return n.attrs.get('data-language')=='zh' or n.has('qm-english-name') or n.has('qm-mobile-column-label') or n.has('qm-glossary-sign') or n.has('qm-glossary-count') or n.has('qm-method-page-tools') or n.has('qm-method-page-end') or n.has('qm-controls') or n.has('qm-map-tools')
def inline(n):
    if isinstance(n,str):return escape(re.sub(r'\s+',' ',n)).replace('–','-').replace('—','-').replace('ₛ','<sub>s</sub>')
    if n.tag in SKIP or hidden(n):return ''
    body=''.join(inline(c) for c in n.children if not (n.tag=='a' and isinstance(c,Node) and c.tag=='small'))
    if n.tag=='br':return '<br/>'
    if n.tag in ('strong','b'):return '<b>'+body+'</b>'
    if n.tag in ('em','i'):return '<i>'+body+'</i>'
    if n.tag in ('sub','sup'):return '<'+n.tag+'>'+body+'</'+n.tag+'>'
    if n.tag=='a':
        url=n.attrs.get('href','')
        url=LESSON+url if url.startswith('#') else SITE+url if url.startswith('/') else url
        if url.startswith('http'):return '<link href="'+escape(url,quote=True)+'" color="#1f6b45">'+body+'</link>'
    return body

def para(n,style='Copy',prefix=''):
    t=inline(n).strip()
    return [Paragraph(prefix+t,styles[style])] if t else []

def render(n):
    if isinstance(n,str):return []
    if n.tag in SKIP or hidden(n):return []
    if n.has('slide-header'):return []
    if n.has('qm-reporting-example'):
        flow=[]
        for child in n.children:flow+=render(child)
        return [KeepTogether(flow)]
    if n.tag in ['h1','h2','h3','h4']:return para(n,{'h1':'H1Q','h2':'H2Q','h3':'H3Q','h4':'H4Q'}[n.tag])
    if n.tag=='p':return para(n,'SmallCopy' if n.has('qm-caption') or n.has('qm-source') else 'Copy')
    if n.tag=='blockquote':return [KeepTogether(para(n,'Quote'))]
    if n.tag=='summary':return [CondPageBreak(105)]+para(n,'SummaryQ')
    if n.tag in ['ul','ol']:
        out=[]
        for i,item in enumerate(c for c in n.children if isinstance(c,Node) and c.tag=='li'):
            out+=para(item,prefix=(str(i+1)+'. ' if n.tag=='ol' else '- '))
        return out
    if n.tag=='dl':
        out=[]
        for c in n.children:
            if isinstance(c,Node):out+=para(c,'H4Q' if c.tag=='dt' else 'Copy')
        return out
    if n.tag=='table':
        rows=[]
        for r in n.walk():
            if r.tag=='tr':
                cells=[c for c in r.children if isinstance(c,Node) and c.tag in ['th','td']]
                if cells:rows.append([Paragraph(('<b>'+inline(c)+'</b>') if c.tag=='th' else inline(c),styles['Cell']) for c in cells])
        if not rows:return []
        count=max(map(len,rows));width=487
        widths=[width/count]*count
        if count==2:widths=[width*.28,width*.72]
        if count==3:widths=[width*.2,width*.4,width*.4]
        if count==6:widths=[width*.23]+[width*.77/5]*5
        t=LongTable(rows,colWidths=widths,repeatRows=1,hAlign='LEFT')
        t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('LINEABOVE',(0,0),(-1,0),.8,GREEN),('LINEBELOW',(0,0),(-1,0),.8,GREEN),('LINEBELOW',(0,1),(-1,-1),.3,RULE),('BACKGROUND',(0,0),(-1,0),PALE)]))
        if n.has('qm-source-table'):
            t=LongTable(rows,colWidths=widths,repeatRows=1,hAlign='LEFT')
            t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('LINEABOVE',(0,0),(-1,0),1.2,GREEN),('LINEBELOW',(0,0),(-1,0),.5,GREEN),('LINEBELOW',(0,-1),(-1,-1),1.2,GREEN)]))
        caption=next((c for c in n.children if isinstance(c,Node) and c.tag=='caption'),None)
        return (para(caption,'H4Q') if caption else [])+[t]
    if n.tag=='label' and any(c.tag=='input' for c in n.walk()):return para(n,prefix='[ ] ')
    if n.tag=='a':return para(n)
    out=[]
    for child in n.children:out+=render(child)
    return out

parser=Parser();parser.feed(INPUT.read_text())
sections=[n for n in parser.root.walk() if n.tag=='section' and n.has('slide') and 'data-independent-exploration' not in n.attrs]
assert sections and sum('data-taught-method' in n.attrs for n in sections)==13, 'Expected the 13 taught methods in the lesson route'
story=[]
for i,section in enumerate(sections):
    if i:story.append(PageBreak())
    story.append(Paragraph(f'DEDC02 / Topic 8 / Lesson step {i+1} of {len(sections)}',styles['SmallCopy']))
    story.extend(render(section))
    if i==0:
        story.append(Paragraph('English lesson handout. Open the interactive lesson for everyday story examples. Specialist method explanations are linked from the map for independent exploration.',styles['Copy']))
        story.append(Paragraph('<link href="'+LESSON+'" color="#1f6b45">Open the interactive lesson</link>',styles['Copy']))

def footer(c,doc):
    c.setStrokeColor(RULE);c.line(54,42,541,42)
    c.setFont('Body',8);c.setFillColor(GREEN);c.drawString(54,29,'Quantitative data analysis and reporting / DEDC02')
    c.drawRightString(541,29,str(doc.page))

OUTPUT.parent.mkdir(parents=True,exist_ok=True)
doc=SimpleDocTemplate(str(OUTPUT),pagesize=(595,842),rightMargin=54,leftMargin=54,topMargin=48,bottomMargin=55,title='DEDC02 Topic 8: Quantitative Data Analysis and Reporting',author='Jiawei Zhang')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(f'Saved {OUTPUT}')
