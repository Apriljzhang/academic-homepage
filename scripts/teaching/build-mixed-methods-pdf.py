#!/usr/bin/env python3
"""Build the English lesson PDF from the same data as the interactive slides.

Requires reportlab. Optional --sans/--serif TrueType fonts keep the export portable.
The PDF expands all three design panels and prints all five practice scenarios.
"""
from pathlib import Path
from html.parser import HTMLParser
from html import escape, unescape
import argparse, json, re
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
                               Table, TableStyle, Flowable, KeepTogether)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab import rl_config
rl_config.useA85 = 0
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[2]
PAGE = landscape(A4)
WIDTH = PAGE[0] - 80
INK, GREEN, LINE, SOFT, MUTED = [HexColor(x) for x in
    ['#0f4a32', '#1f6b45', '#bad8c5', '#edf7f0', '#607b6d']]

class Node:
    def __init__(self, tag='', attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []
    def has(self, cls): return cls in self.attrs.get('class', '').split()
    def find(self, tag=None, cls=None):
        found=[]
        for child in self.children:
            if isinstance(child, Node):
                if (tag is None or child.tag==tag) and (cls is None or child.has(cls)):
                    found.append(child)
                found.extend(child.find(tag, cls))
        return found

class Parser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root=Node('root'); self.stack=[self.root]; self.feed(source)
    def handle_starttag(self, tag, attrs):
        n=Node(tag,attrs); self.stack[-1].children.append(n)
        if tag not in ['br','hr','input','img','meta','link']: self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag,attrs)
        if self.stack[-1].tag==tag:self.stack.pop()
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:
                self.stack=self.stack[:i]; break
    def handle_data(self, text):self.stack[-1].children.append(text)

def rich(node):
    if isinstance(node,str):return escape(node)
    inner=''.join(rich(x) for x in node.children)
    if node.tag=='br':return '<br/>'
    if node.tag in ['b','strong']:return '<b>'+inner+'</b>'
    if node.tag in ['i','em']:return '<i>'+inner+'</i>'
    if node.tag=='a':
        href=node.attrs.get('href','')
        if href.startswith('http'):return '<link href="'+escape(href,quote=True)+'" color="#1f6b45"><u>'+inner+'</u></link>'
    return inner

def plain(node):return unescape(re.sub('<[^>]+>',' ',rich(node))).strip()

class Diagram(Flowable):
    def __init__(self,node,parallel=False):
        Flowable.__init__(self);self.node=node;self.parallel=parallel;self.width=WIDTH
        self.steps=node.find(cls='step')
    def wrap(self,aw,ah):
        self.width=aw
        if self.parallel:
            self.height=205;return aw,self.height
        count=len(self.steps); self.box=(aw-23*(count-1))/count
        self.ps=[Paragraph(rich(x).replace('</b>','</b><br/>'),styles['diagram']) for x in self.steps]
        self.height=max(p.wrap(self.box-20,1000)[1] for p in self.ps)+30
        return aw,self.height+10
    def boxdraw(self,node,x,y,w,h):
        accent,fill=GREEN,SOFT
        if node.has('quan'):accent,fill=HexColor('#37668b'),HexColor('#f0f5f9')
        if node.has('qual'):accent,fill=HexColor('#775481'),HexColor('#f7f3f8')
        if node.has('bridge'):accent,fill=HexColor('#a7642e'),HexColor('#fff5e9')
        c=self.canv;c.setFillColor(fill);c.setStrokeColor(LINE);c.rect(x,y,w,h,fill=1,stroke=1)
        c.setStrokeColor(accent);c.setLineWidth(3);c.line(x,y+h,x+w,y+h)
        p=Paragraph(rich(node).replace('</b>','</b><br/>'),styles['diagram']);_,ph=p.wrap(w-20,1000);p.drawOn(c,x+10,y+h-13-ph)
    def arrow(self,x1,y1,x2,y2):
        import math
        c=self.canv;c.setStrokeColor(GREEN);c.setFillColor(GREEN);c.setLineWidth(1.2);c.line(x1,y1,x2,y2)
        angle=math.atan2(y2-y1,x2-x1);a=6
        p=c.beginPath();p.moveTo(x2,y2)
        p.lineTo(x2-a*math.cos(angle-.45),y2-a*math.sin(angle-.45))
        p.lineTo(x2-a*math.cos(angle+.45),y2-a*math.sin(angle+.45));p.close();c.drawPath(p,fill=1,stroke=0)
    def draw(self):
        if self.parallel:
            # HTML order is QUAN, merged interpretation, QUAL.
            left=self.width*.34; right=self.width*.49; x=self.width-right
            self.boxdraw(self.steps[0],0,114,left,80)
            self.boxdraw(self.steps[2],0,5,left,80)
            self.boxdraw(self.steps[1],x,37,right,125)
            self.arrow(left+4,154,x-5,126);self.arrow(left+4,45,x-5,76)
            return
        for i,n in enumerate(self.steps):
            x=i*(self.box+23);self.boxdraw(n,x,8,self.box,self.height)
            if i<len(self.steps)-1:self.arrow(x+self.box+3,8+self.height/2,x+self.box+20,8+self.height/2)

class MethodMap(Flowable):
    """Draw the seven labelled nodes from the HTML methods landscape."""
    def __init__(self,node):
        Flowable.__init__(self)
        self.nodes={n.attrs['data-map-node']:n for n in node.find(cls='map-node')}
    def wrap(self,aw,ah):
        self.width=aw;self.height=240
        return aw,self.height
    def draw(self):
        c=self.canv;w=self.width;gap=12;branch=(w-24)/2;leaf=(branch-gap)/2
        boxes={
            'root':((w-270)/2,204,270,32),
            'mono':(0,151,branch,32),
            'multiple':(branch+24,151,branch,32),
            'quan':(0,8,leaf,121),
            'qual':(leaf+gap,8,leaf,121),
            'multi':(branch+24,8,leaf,121),
            'mixed':(branch+24+leaf+gap,8,leaf,121),
        }
        c.setStrokeColor(GREEN);c.setLineWidth(.8)
        c.line(w/2,204,w/2,194);c.line(branch/2,194,w-branch/2,194)
        for centre in [branch/2,w-branch/2]:c.line(centre,194,centre,183)
        for start in [0,branch+24]:
            c.line(start+branch/2,151,start+branch/2,140)
            c.line(start+leaf/2,140,start+branch-leaf/2,140)
            for centre in [start+leaf/2,start+branch-leaf/2]:c.line(centre,140,centre,129)
        for key,(x,y,bw,bh) in boxes.items():
            focus=key=='mixed'
            c.setFillColor(GREEN if focus else SOFT if key in ['root','mono','multiple'] else white)
            c.setStrokeColor(GREEN if focus else LINE);c.rect(x,y,bw,bh,fill=1,stroke=1)
            style=styles['mapfocus'] if focus else styles['map']
            copy=rich(self.nodes[key])
            p=Paragraph(copy,style);_,ph=p.wrap(bw-16,1000);p.drawOn(c,x+8,y+(bh-ph)/2)

def para(text,kind='body'):
    return Paragraph(text.replace('<br>', '<br/>'),styles[kind])
def render(node):
    if isinstance(node,str):return [] if not node.strip() else [para(escape(node))]
    if node.has('diagram-builder'):return []
    if node.has('method-tree'):return [MethodMap(node),Spacer(1,10)]
    if node.has('concept-cards'):
        columns=3 if node.has('cards-3') else 2
        items=[]
        for card in node.children:
            if not isinstance(card,Node):continue
            parts=[]
            for child in card.children:
                if isinstance(child,Node):parts.append(para(rich(child),'cardhead' if child.tag=='h3' else 'card'))
            items.append(parts)
        rows=[items[i:i+columns] for i in range(0,len(items),columns)]
        t=Table(rows,colWidths=[WIDTH/columns]*columns,hAlign='LEFT')
        t.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),
                              ('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),
                              ('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
        return [t,Spacer(1,10)]
    if 'data-reasoning-task' in node.attrs:
        task=activities[node.attrs['data-reasoning-task']];copy=task['en'];answer=task['answer']
        result=[para(copy['title'],'subhead'),para(escape(copy['question']))]
        result.extend(para(chr(65+i)+'. '+escape(option),'bullet') for i,option in enumerate(copy['options']))
        result.append(para('Suggested answer: '+chr(65+answer)+'. '+escape(copy['feedback'][answer]),'prompt'))
        return result
    if node.tag=='button' or node.has('scenario-nav') or node.has('design-choices') or node.has('design-empty'):return []
    if node.has('flow'):return [Diagram(node)]
    if node.has('parallel'):return [Diagram(node,True)]
    if node.tag=='table':
        rows=node.find('tr'); data=[]
        for row in rows:
            cells=[x for x in row.children if isinstance(x,Node) and x.tag in ['td','th']]
            if cells:data.append([para(rich(x),'tablehead' if x.tag=='th' else 'table') for x in cells])
        if not data:return []
        cols=len(data[0]); widths=[WIDTH/cols]*cols
        if cols==2:widths=[WIDTH*.27,WIDTH*.73]
        t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
        t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('GRID',(0,0),(-1,-1),.5,LINE),
                              ('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),
                              ('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
        return [t,Spacer(1,10)]
    if node.tag=='summary' and plain(node)=='Show completed diagram':return [para('Completed diagram','subhead')]
    if node.tag in ['h1','h2','h3','summary']:
        return [para(rich(node),'subhead' if node.tag in ['h3','summary'] else 'heading')]
    if node.tag=='li':return [para('• '+rich(node),'bullet')]
    if node.tag in ['p','blockquote']:
        if not plain(node):return []
        style='quote' if node.tag=='blockquote' else 'caption' if node.has('example') else 'prompt' if node.has('prompt') else 'body'
        return [para(rich(node),style)]
    if node.tag=='a':
        if '__LESSON_PDF__' in node.attrs.get('href',''):return []
        return [para(rich(node),'link')]
    result=[]
    for child in node.children:result.extend(render(child))
    return result

def header(c,d):
    c.setFillColor(GREEN);c.setFont('Body',9);c.drawString(40,PAGE[1]-28,'DEDC02  |  Mixed Methods Design and Reporting')
    c.setStrokeColor(LINE);c.line(40,PAGE[1]-36,PAGE[0]-40,PAGE[1]-36)
    c.setFillColor(MUTED);c.setFont('Body',9);c.drawRightString(PAGE[0]-40,22,str(d.page))
    c.drawString(40,22,'English lesson PDF - all designs and practice scenarios expanded')

def load_data():
    text=(ROOT/'src/data/dedc02MixedMethodsLesson.ts').read_text()
    slides=json.JSONDecoder().raw_decode(text.split('export const mixedMethodsSlides = ',1)[1])[0]
    cases=json.JSONDecoder().raw_decode(text.split('export const designScenarios = ',1)[1])[0]
    activities=json.JSONDecoder().raw_decode(text.split('export const reasoningTasks = ',1)[1])[0]
    return slides,cases,activities

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--output',type=Path,default=ROOT/'public/teaching/courses/dedc02/mixed-methods-integration-and-reporting.pdf')
    ap.add_argument('--sans',default='/System/Library/Fonts/Supplemental/Arial.ttf');ap.add_argument('--serif',default='/System/Library/Fonts/Supplemental/Georgia.ttf');args=ap.parse_args()
    if Path(args.sans).exists():
        pdfmetrics.registerFont(TTFont('Body',args.sans))
        bold=Path(args.sans).with_name('Arial Bold.ttf');italic=Path(args.sans).with_name('Arial Italic.ttf');bi=Path(args.sans).with_name('Arial Bold Italic.ttf')
        for n,p in [('BodyBold',bold),('BodyItalic',italic),('BodyBoldItalic',bi)]:pdfmetrics.registerFont(TTFont(n,str(p) if p.exists() else args.sans))
        pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='BodyItalic',boldItalic='BodyBoldItalic')
    else:
        for n,real in [('Body','Helvetica'),('BodyBold','Helvetica-Bold'),('BodyItalic','Helvetica-Oblique'),('BodyBoldItalic','Helvetica-BoldOblique')]:pdfmetrics.registerFont(pdfmetrics.Font(n,real,'WinAnsiEncoding'))
        pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='BodyItalic',boldItalic='BodyBoldItalic')
    if Path(args.serif).exists():pdfmetrics.registerFont(TTFont('Heading',args.serif))
    else:pdfmetrics.registerFont(pdfmetrics.Font('Heading','Times-Roman','WinAnsiEncoding'))
    styles={
      'body':ParagraphStyle('body',fontName='Body',fontSize=16,leading=22,textColor=INK,spaceAfter=12),
      'heading':ParagraphStyle('heading',fontName='Heading',fontSize=29,leading=33,textColor=INK,spaceAfter=17,keepWithNext=True),
      'subhead':ParagraphStyle('subhead',fontName='Heading',fontSize=19,leading=24,textColor=INK,spaceBefore=8,spaceAfter=9,keepWithNext=True),
      'bullet':ParagraphStyle('bullet',fontName='Body',fontSize=16,leading=22,textColor=INK,leftIndent=12,firstLineIndent=-10,spaceAfter=10),
      'table':ParagraphStyle('table',fontName='Body',fontSize=13,leading=17,textColor=INK),
      'tablehead':ParagraphStyle('tablehead',fontName='BodyBold',fontSize=13,leading=17,textColor=white),
      'diagram':ParagraphStyle('diagram',fontName='Body',fontSize=13,leading=18,textColor=INK,alignment=1),
      'map':ParagraphStyle('map',fontName='Body',fontSize=12,leading=16,textColor=INK,alignment=1),
      'mapfocus':ParagraphStyle('mapfocus',fontName='Body',fontSize=12,leading=16,textColor=white,alignment=1),
      'cardhead':ParagraphStyle('cardhead',fontName='BodyBold',fontSize=13.5,leading=17,textColor=INK,spaceAfter=6),
      'card':ParagraphStyle('card',fontName='Body',fontSize=13,leading=17,textColor=INK,spaceAfter=7),
      'caption':ParagraphStyle('caption',fontName='Body',fontSize=11.5,leading=16,textColor=MUTED,spaceAfter=10),
      'prompt':ParagraphStyle('prompt',fontName='Body',fontSize=15,leading=21,textColor=INK,backColor=SOFT,borderPadding=9,spaceBefore=6,spaceAfter=17),
      'quote':ParagraphStyle('quote',fontName='Heading',fontSize=21,leading=28,textColor=INK,backColor=SOFT,borderPadding=10,spaceAfter=17),
      'link':ParagraphStyle('link',fontName='Body',fontSize=11.5,leading=16,textColor=GREEN,spaceAfter=9),
    }
    slides,cases,activities=load_data(); story=[]
    for number,slide in enumerate(slides,1):
        if number>1:story.append(PageBreak())
        story.append(para(str(number)+'. '+slide['title'],'heading'))
        root=Parser(slide['body']).root
        if slide['key']=='design-map':
            story.extend(render(root.children[0]))
            choices=root.find(cls='design-choices')[0].find('button')
            rows=[[para('Design','tablehead'),para('Purpose','tablehead'),para('Sequence','tablehead')]]
            for choice in choices:rows.append([para(rich(choice.find('b')[0]),'table'),para(rich(choice.find('span')[0]),'table'),para(rich(choice.find('small')[0]),'table')])
            t=Table(rows,colWidths=[WIDTH*.34,WIDTH*.3,WIDTH*.36]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('GRID',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]));story.extend([t,Spacer(1,15)])
            story.append(para('Compare, explain, develop: the integration purpose determines the relationship between the strands.','prompt'))
            for panel in root.find(cls='design-detail'):
                story.append(PageBreak());story.extend(render(panel))
            story.append(PageBreak());story.append(para('Additional design checks','heading'))
            for detail in root.find('details'):
                # Panel-specific examples were included above.
                if detail in [x for p in root.find(cls='design-detail') for x in p.find('details')]:continue
                story.extend(render(detail))
        elif slide['key']=='design-practice':
            for i,item in enumerate(cases):
                if i and i%2==0:story.append(PageBreak());story.append(para('Design practice - continued','heading'))
                label={'c':'Convergent','e':'Explanatory sequential','x':'Exploratory sequential'}[item['answer']]
                story.extend([para(f'Scenario {i+1} / {len(cases)}','subhead'),para(escape(item['en'])),para('<b>Suggested design: '+label+'.</b> '+escape(item['feedbackEn']),'prompt')])
        elif slide['key'] in activities:
            key=slide['key'];task=activities[key];copy=task['en'];answer=task['answer']
            # Give the activity and its worked interpretation distinct pages.
            activity=root.find(cls='reasoning-activity')[0]
            if key=='joint-display':
                for child in root.children:
                    if child is activity:break
                    story.extend(render(child))
            elif key=='repair':
                story.extend(render(root.children[0]))
            activity_parts=render(activity)
            story.extend(activity_parts[:-1])
            story.append(para('Choose an answer and explain why before checking the following page.','prompt'))
            story.append(PageBreak())
            story.append(para(slide['title']+' - worked interpretation','heading'))
            story.append(activity_parts[-1])
            seen=False
            for child in root.children:
                if child is activity:seen=True;continue
                if seen:story.extend(render(child))
        elif slide['key']=='thanks':
            story.extend([Spacer(1,35),para('Questions and discussion','subhead'),para('What would integrating two strands add to a study you are reading?'),para('<link href="https://apriljzhang.com/teaching/courses/dedc02/09-mixed-methods-integration/" color="#1f6b45"><u>Open the interactive lesson</u></link>','link')])
        else:story.extend(render(root))
    args.output.parent.mkdir(parents=True,exist_ok=True)
    doc=SimpleDocTemplate(str(args.output),pagesize=PAGE,rightMargin=40,leftMargin=40,topMargin=55,bottomMargin=44,title='Mixed Methods Design and Reporting - DEDC02',author='April Jiawei Zhang')
    doc.build(story,onFirstPage=header,onLaterPages=header)
    print('Created',args.output)
