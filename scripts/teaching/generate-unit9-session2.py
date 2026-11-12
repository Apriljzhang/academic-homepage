"""Create three A4 print masters for Unit 9 Session 2.
Run with a Python environment containing reportlab and pypdf.
"""
from pathlib import Path
import json, shutil, re
from io import BytesIO
import argparse
parser=argparse.ArgumentParser()
parser.add_argument("--only",nargs="+",choices=["language-bank.pdf","student-handout.pdf","teaching-notes.pdf"])
SELECTED=parser.parse_args().only
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, Color, black, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from pypdf import PdfReader


import os
from xml.sax.saxutils import escape
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/teaching/courses/general-english/unit-9/session-2'
OUT.mkdir(parents=True,exist_ok=True)
LOCAL=Path('/Users/ajz/Library/CloudStorage/OneDrive-CityUniversityofMacau/2608-2701/GE I/Unit 9 Session 2 - Phrases Tone and Debate')
LOCAL.mkdir(parents=True,exist_ok=True)
BANK=json.loads((ROOT/'src/data/generalEnglishUnit9Session2Language.json').read_text())['phrases']
BOOK=json.loads((ROOT/'src/data/generalEnglishUnit9Session2Reading.json').read_text())
FONTDIR=Path('/Users/ajz/.codex/skills/canvas-design/canvas-fonts')
pdfmetrics.registerFont(TTFont('Body',str(FONTDIR/'WorkSans-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Bold',str(FONTDIR/'WorkSans-Bold.ttf')))
pdfmetrics.registerFont(TTFont('CJK','/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
INK=HexColor('#183b2b'); RULE=HexColor('#a7b8ae'); LIGHT=HexColor('#f1f5f2'); GREY=HexColor('#526158')

class Page:
 def __init__(self,path):
  self.buffer=BytesIO()
  self.c=canvas.Canvas(self.buffer,pagesize=A4)
  self.c.setTitle(path.stem.replace('-',' ').title())
  self.c.setAuthor('General English I')
  self.c.setCreator('ReportLab; prepared with Codex')
  self.path=path; self.num=0; self.H=A4[1]; self.W=A4[0]
 def start(self,title,sub,land=False):
  self.num+=1; self.W,self.H=landscape(A4) if land else A4
  self.c.setPageSize((self.W,self.H))
  self.text('General English I  /  Unit 9  /  Session 2',12,11,8,'Body',GREY)
  self.text(title,12,23,20,'Bold')
  self.para(sub,12,29,self.W/mm-24,9.2,color=GREY)
  self.line(12,39,self.W/mm-12,39)
 def text(self,text,x,y,size=10,font='Body',color=INK):
  self.c.setFillColor(color); self.c.setFont(font,size); self.c.drawString(x*mm,self.H-y*mm,text)
 def para(self,text,x,y,w,size=10.2,bold=False,color=INK,align=0,leading=None):
  st=ParagraphStyle('p',fontName='Bold' if bold else 'Body',fontSize=size,leading=leading or size*1.35,textColor=color,alignment=align)
  p=Paragraph(text,st); _,h=p.wrap(w*mm,self.H)
  if y*mm+h>self.H-15*mm: raise ValueError(f'Overflow: {text[:60]} page {self.num}')
  p.drawOn(self.c,x*mm,self.H-y*mm-h)
  return y+h/mm
 def zh(self,text,x,y,w,size=8.5):
  st=ParagraphStyle('z',fontName='CJK',fontSize=size,leading=size*1.3,textColor=GREY,wordWrap='CJK')
  p=Paragraph(text,st); _,h=p.wrap(w*mm,self.H); p.drawOn(self.c,x*mm,self.H-y*mm-h); return y+h/mm
 def line(self,x1,y1,x2,y2,dash=False):
  self.c.setStrokeColor(RULE); self.c.setLineWidth(.6); self.c.setDash(3,2) if dash else self.c.setDash()
  self.c.line(x1*mm,self.H-y1*mm,x2*mm,self.H-y2*mm); self.c.setDash()
 def box(self,x,y,w,h,fill=False,dash=False):
  self.c.setStrokeColor(RULE); self.c.setLineWidth(.7); self.c.setFillColor(LIGHT if fill else white)
  self.c.setDash(3,2) if dash else self.c.setDash()
  self.c.rect(x*mm,self.H-(y+h)*mm,w*mm,h*mm,stroke=1,fill=1 if fill else 0); self.c.setDash()
 def heading(self,en,zh,y):
  self.text(en,12,y,12,'Bold')
  if zh:self.zh(zh,12,y+2,186,8.2)
  return y+(9 if zh else 5)
 def lines(self,x,y,w,n=3,gap=8):
  for i in range(n): self.line(x,y+i*gap,x+w,y+i*gap)
 def table(self,headers,rows,x,y,widths,size=9.2,rowheights=None):
  def cell(s,bold=False):
   return Paragraph(s,ParagraphStyle('cell',fontName='Bold' if bold else 'Body',fontSize=size,leading=size*1.25,textColor=INK))
  table=Table([[cell(s,True) for s in headers]]+[[cell(s) for s in row] for row in rows],colWidths=[v*mm for v in widths],rowHeights=[v*mm for v in rowheights] if rowheights else None)
  table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.5,RULE),('BACKGROUND',(0,0),(-1,0),LIGHT),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
  _,h=table.wrap(1000,1000)
  if y*mm+h>self.H-15*mm:raise ValueError(f'Table overflow page {self.num}')
  table.drawOn(self.c,x*mm,self.H-y*mm-h); return y+h/mm
 def end(self,footer=''):
  self.line(12,self.H/mm-13,self.W/mm-12,self.H/mm-13)
  self.text(footer or 'Use the language bank while you work.',12,self.H/mm-8,7.5,color=GREY)
  self.c.setFont('Body',7.5);self.c.drawRightString(self.W-12*mm,8*mm,str(self.num));self.c.showPage()
 def save(self):
  self.c.save()
  if SELECTED is None or self.path.name in SELECTED:self.path.write_bytes(self.buffer.getvalue())

# 60 reusable chunks. Core patterns are marked, not all 60 assessed in one lesson.
p=Page(OUT/'language-bank.pdf')
for page_no in range(4):
 p.start(f'Dependent prepositions {page_no+1} / 4','60 useful chunks with original examples recycling Units 1, 2, 5 and 9. * = 12 core chunks for today.')
 rows=[]
 for i,item in enumerate(BANK[page_no*15:(page_no+1)*15],page_no*15+1):
  phrase=('* ' if item['core'] else '')+item['phrase']
  meaning=f'<font name="CJK">{item["zh"]}</font>'
  rows.append((str(i),phrase+'<br/>'+meaning,item['example']))
 p.table(['No.','Chunk + meaning','Example to adapt'],rows,12,46,[12,76,98],9.2)
 p.para('Change one detail to make an example your own. Keep the preposition with its word. After a preposition, use a noun, a pronoun or an -ing form: interested in design / interested in it / interested in designing.',12,261,186,9.1)
 p.end('Learn the complete chunk. These examples extend the supplied unit vocabulary into useful sentence patterns.')
p.save()

p=Page(OUT/'student-handout.pdf')
p.start('Phrases, viewpoints and debate','Name: ______________________________   Class: __________')
p.heading('1. Practise the phrases','',47)
y=p.para('apply for; agree with; graduate from; depend on; introduce someone to; decide on; ask for; borrow something from; prepare for; learn from; focus on; benefit from.',12,52,186,10)
y=p.para('<b>Complete:</b> apply ___ a job; agree ___ a classmate; graduate ___ school; depend ___ the job; introduce me ___ a teammate; decide ___ a career; prepare ___ work; learn ___ a mistake.',12,y+3,186,9.8)
y=p.para('<b>Correct:</b> I agree to my classmate. _____________________________________________<br/>I am interested in learn about jobs. ______________________________________________',12,y+3,186,9.8,leading=17)
p.heading('2. Read and group','',y+9)
y=p.para('<b>Viewpoint:</b> yes / no / it depends. <b>Tone:</b> attitude shown by exact words.',12,y+13,186,9.5)
y=p.table(['Writer','Viewpoint','Reason / example','Tone + exact words'],[(x,'','','') for x in ['A Lydia','B Sophia','C Daniela','D Paul','E Danh','F Aslan']],12,y+4,[27,30,65,64],9.2,rowheights=[9]+[10]*6)
p.heading('3. My debate argument','',y+10)
y=p.para('<b>Does school prepare you for the world of work?</b>',12,y+14,186,10.2)
y=p.para('My claim: __________________________________________________________________<br/>Reason: ___________________________________________________________________<br/>Reading example: _____________________________________________________________<br/>My own example: ______________________________________________________________<br/>This supports my claim because: _________________________________________________<br/>A possible objection: __________________________________________________________<br/>My response: __________________________________________________________________',12,y+4,186,9.5,leading=18)
y=p.para('<b>Three phrases I will use:</b> __________________ / __________________ / __________________',12,y+4,186,9.5)
y=p.para('I argue that ... because ...  |  This shows ...  |  I agree with you that ... . However, ...',12,y+3,186,9.2)
p.end('Debate: 45 seconds per turn. Swap opening / response roles in round 2.')
p.save()

p=Page(OUT/'teaching-notes.pdf')
p.start('Teach the language, then debate','Session 2: dependent prepositions; viewpoint versus tone; claims with convincing support. 75 minutes.')
p.heading('Print and organise','先準備詞庫、講義及網頁分組板。',48)
y=p.para('<b>Per student:</b> one-page student handout. Keep the four-page language bank for review, or share one reference copy between two students.<br/><b>Grouping boards:</b> show all six reading cards together. Students drag cards into groups, or select a card then choose a group button. Discuss placements before checking. Phrase relay: pairs alternate 60-second story turns using three chunks. The other pair checks use and awards points. No reading cut-outs are needed.<br/><b>Source:</b> responses transcribed from the user-supplied Unit 9B p.109 photograph. The six full responses appear in the HTML reading games with source credit.',12,60,186,9.7)
y=p.heading('75-minute sequence','詞庫先作支援，最後用於個人論證與回應。',y+11)
y=p.table(['Time','Teaching and material'],[
 ('0-4','Same position, different tone: compare the two original opening comments.'),
 ('4-9','Language bank p.1 + handout p.1: notice word + preposition + noun / pronoun / -ing. Twelve starred chunks are the active set.'),
 ('9-17','Complete eight gaps and repair two sentences. In pairs, say a personalised example with a recycled unit word.'),
 ('17-23','Phrase relay: two pairs A/B build a three-sentence story with three chunks in 60 seconds. Alternate speakers. Award 1 point per accurate chunk, 1 per meaningful sentence, and 1 for a connected story (7 maximum). Play four turns.'),
 ('23-28','Use the slide questions and handout grid to separate position, reason, example and tone. Model a tone judgement with exact wording.'),
 ('28-39','Viewpoint board: read all six cards, group them under yes / no / depends, and justify placements. Use Check grouping after students explain.'),
 ('39-47','Tone board: regroup all six cards by tone using exact wording. Compare A/F (both no) and B/D (both yes). Accept alternative tone labels with evidence.'),
 ('47-55','Slides + handout section 3: model claim, reason, concrete example, link and response. Show why a personal example is limited support.'),
 ('55-62','Each student prepares an argument. Pair checks the example-to-claim link and three preposition chunks.'),
 ('62-71','Handout section 3: two debate rounds and feedback. Every student makes an opening and a response.'),
 ('71-75','Individual exit: revised claim + support, most convincing evidence heard, and a corrected / newly learned chunk.')],12,y,[23,163],8.8)
y=p.para('<b>Scope:</b> 60 chunks are a reference resource; do not try to teach all as new items in 75 minutes. Recycle Units 1 (feelings / qualities), 2 (education, places, communication), 5 (people / teamwork) and 9 (jobs / work priorities) in examples and arguments.',12,y+5,186,9.3)
p.end('Keep the bank and frames available. Offer keyword prompts to confident speakers and full sentence frames to others.')

p.start('Viewpoint is different from tone','Use the answer key as a reasoned interpretation, not a fixed one-tag matching exercise.')
p.heading('Reading key','接受其他有詞句支持的語氣判斷。',48)
y=p.table(['Text','Position + support','Tone + possible cue'],[
 ('A Lydia','No: she had not learned programming or project management before her first job.','Critical and fairly measured: contrasts interesting facts with not using them in her job.'),
 ('B Sophia','Yes: history helped her learn how to think.','Warm / affirming and emphatic: grandmother story; “My grandmother was right!”'),
 ('C Daniela','Depends on the job: school is a foundation; further specialist learning is needed.','Measured / qualified: “It depends”; “a great start, but …”.'),
 ('D Paul','Yes: school football helped develop teamwork.','Confident / emphatic: “definitely”; positive emphasis on teamwork.'),
 ('E Danh','Depends: subjects may not directly match a job, but can reveal interests and careers.','Measured / qualified: “in some cases”, “However”, “probably”.'),
 ('F Aslan','No: he questions the relevance of school learning to practical job tasks.','Dismissive / abrupt or frustrated: short rhetorical answers, “Never!”, “Sadly”.')],12,60,[23,76,87],9.2)
y=p.para('<b>Separate the axes:</b> A and F share a negative position but sound different. B and D share an affirmative position but use different voices. “Factual” in the book describes a matter-of-fact style; it does not establish that a claim is true. Critical tone can be measured and useful. A phrase can signal both position and tone.',12,y+5,186,9.7)
y=p.para('<b>Board routine:</b> take turns placing cards and explaining why. Invite another student to support or challenge a placement. Check grouping gives feedback without moving cards; Teacher controls provides model sorting. Tone groups are open to alternative labels supported by exact wording. Ask students to explain their tone choices.',12,y+8,186,9.5)
y=p.heading('Preposition key and useful distinctions','整個詞組一起核對。',y+11)
y=p.para('<b>Eight gaps:</b> for / with / from / on / to / on / for / from.<br/><b>Repairs:</b> I agree <b>with</b> my classmate. I am interested in <b>learning</b> about jobs.<br/><b>Contrast:</b> agree with a person / agree on a plan / agree to a proposal. After a preposition use a noun, pronoun or -ing form. Accept other grammatically valid patterns when their meaning fits.',12,y,186,9.7)
p.end('Do not score viewpoint as tone. Require a cue and an explanation for each tone label.')

p.start('Help students convince a listener','A precise claim needs relevant support and a clear explanation of the connection.')
p.heading('Model a supported challenge','用閱讀例子提出有範圍的反方論證。',48)
y=p.para('<b>Claim:</b> School alone does not prepare students adequately for some job-specific tasks.<br/><b>Reason:</b> Technical work often requires practical preparation.<br/><b>Reading example:</b> Lydia says she had not learned programming or project management before her first job.<br/><b>Link:</b> Her example illustrates a gap between what she studied and what that job required.<br/><b>Qualification:</b> One person\'s experience does not show that every subject or school fails.<br/><b>Response:</b> I agree with you that thinking skills matter. However, schools could also provide opportunities for practical projects.',12,60,186,10.1)
y=p.heading('Make the debate work','明確分工，確保每人都開場及回應一次。',y+12)
y=p.para('Use groups of four with two contrasting claims. Allow a qualified yes, no or depends; ask the pairs to identify their actual disagreement. Agree what “school” means. Examples from secondary school and university should be clearly labelled.<br/>Round 1: A1 opens, B1 opens, A2 responds, B2 responds, 45 seconds each (3 minutes). One-minute planning break. Round 2: swap opening / response roles (3 minutes). Finish with two minutes of evidence-based feedback. Total: 9 minutes.',12,y,186,10)
y=p.heading('Check persuasion, not just fluency','回饋要指出有用的具體改動。',y+12)
y=p.table(['Check','What to listen for'],[
 ('Claim','A clear answer with a sensible scope; no unsupported always / never claim.'),
 ('Support','A named reading idea and a concrete experience or clearly labelled imagined case.'),
 ('Connection','The speaker explains why that example supports the claim.'),
 ('Response','The speaker answers the strongest objection instead of repeating the opening.'),
 ('Language and tone','At least three appropriate preposition chunks; wording helps the audience follow and consider the argument.')],12,y,[43,143],9.6)
y=p.para('<b>Evidence boundary:</b> the six reading responses are selected personal views. Do not present them as representative survey findings or count them as proof that school does or does not work. A specific personal experience can illustrate a point; a wider claim needs wider support.',12,y+5,186,9.5)
p.end('Individual product: an opening, a response, and a revised written claim with support and useful chunks.')
p.save()

for name,n in [('language-bank.pdf',4),('student-handout.pdf',1),('teaching-notes.pdf',3)]:
 if SELECTED is not None and name not in SELECTED:continue
 reader=PdfReader(OUT/name);assert len(reader.pages)==n,(name,len(reader.pages));shutil.copy2(OUT/name,LOCAL/name);print(name,n,'pages')
print('Selected print PDFs ready. Reading and phrase activities use HTML grouping boards.')
