"""Create three A4 print masters for Unit 9 Session 2.
Run with a Python environment containing reportlab and pypdf.
"""
from pathlib import Path
import json, shutil, re
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
  self.c=canvas.Canvas(str(path),pagesize=A4)
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
 def save(self):self.c.save()

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
p.start('Phrases, viewpoints and tone','Name: __________________________  Class: __________  Keep your language bank open.')
p.heading('1. Build useful chunks','把介詞與前面的詞一起學，不只背介詞。',48)
y=p.para('<b>Today\'s core:</b> apply for; agree with; graduate from; depend on; introduce someone to; decide on; ask for; borrow something from; prepare for; learn from; focus on; benefit from.',12,60,186,10.2)
y=p.para('<b>Complete and say aloud:</b> 1. apply ___ a job; 2. agree ___ a classmate; 3. graduate ___ school; 4. depend ___ the job; 5. introduce me ___ a teammate; 6. decide ___ a career; 7. prepare ___ work; 8. learn ___ a mistake.',12,y+4,186,10.1)
y=p.para('<b>Repair:</b> I agree to my classmate. → _________________________________________<br/>I am interested in learn about jobs. → _________________________________________',12,y+4,186,10.1,leading=20)
y=p.heading('2. Separate the reading questions','觀點、理由、例子及語氣是不同的問題。',y+11)
y=p.table(['Look for','Ask yourself'],[
 ('Viewpoint / position','What is the writer\'s answer: yes, no or it depends?'),
 ('Reason','Why does the writer think this?'),
 ('Example / experience','What concrete case or experience does the writer describe?'),
 ('Tone','What attitude comes through the wording? Which words create it?')],12,y,[49,137],9.6)
y=p.heading('3. Play pick a side: texts A-F','先在HTML遊戲選立場，再獨立選語氣；每項判斷都指出詞句。',y+11)
y=p.table(['Text','Yes / no / depends','Reason or example','Tone + exact cue'],[(x,'','','') for x in 'ABCDEF'],12,y,[16,43,66,61],9,rowheights=[10]+[12]*6)
y=p.para('<b>Use:</b> The writer\'s position is ____ because ____. The tone sounds ____; the words “____” suggest ____. A word or phrase can sometimes help show both.',12,y+4,186,9.5)
p.end('Viewpoint = the position. Tone = the attitude expressed through language. Keep the two labels separate.')

p.start('Build a claim that can convince','Debate question: Does school prepare you for the world of work?')
p.heading('4. Make your support do some work','論點、理由、例子及解釋要連得起來。',48)
y=p.table(['Part','Model: a qualified yes'],[
 ('Claim','School prepares students for teamwork, although job-specific training is still needed.'),
 ('Reason','Many jobs depend on communication with other people.'),
 ('Concrete example','Paul says school football developed his teamwork skills. In a group presentation, classmates also have to explain and coordinate their work.'),
 ('Link to the claim','These activities practise communication and shared responsibility, which are also needed in many workplaces.'),
 ('Respond to an objection','Some group tasks are badly organised. Clear roles and feedback can give each student an opportunity for practice.')],12,60,[40,146],10)
y=p.para('Paul describes one person\'s experience. It illustrates a possible benefit; it does not prove that every school task prepares everyone for work. Add a specific experience or a clearly labelled imagined example of your own.',12,y+5,186,9.5)
y=p.heading('My individual argument','先自己準備，再與同伴互相檢查。',y+12)
y=p.para('My claim: _________________________________________________________________<br/>My reason: ________________________________________________________________<br/>A reading example (writer + idea): ____________________________________________<br/>My own real or imagined example: _____________________________________________<br/>This supports my claim because: ______________________________________________<br/>A likely objection: __________________________________________________________<br/>My response: _______________________________________________________________',12,y,186,10,leading=23)
y=p.para('<b>Three chunks I will use:</b> __________________ / __________________ / __________________',12,y+6,186,10)
p.end('A strong claim is precise and supportable. Explain why your example supports it.')

p.start('Debate, listen and improve','Groups of four: Pair A and Pair B defend different claims. State what you mean by “school”.')
p.heading('5. Take turns and persuade','每人都要發言，聆聽者記下對方最有力的支持。',48)
y=p.para('<b>Before starting:</b> agree whether school means education before university or formal education more broadly. Identify the level in your examples.<br/><b>Round 1:</b> A1 opens (45 seconds), B1 opens (45 seconds), A2 responds (45 seconds), B2 responds (45 seconds). Listeners note the claim and support.<br/><b>Plan for one minute:</b> improve an example or answer a challenge.<br/><b>Round 2:</b> A2 and B2 open; A1 and B1 respond (45 seconds each). Everyone now makes a claim and responds to an objection.<br/><b>Final two minutes:</b> explain which support was most convincing and why.',12,60,186,10)
y=p.heading('Language that helps a listener follow','清楚表達立場，承認合理之處，再回應問題。',y+11)
y=p.table(['Purpose','Useful language'],[
 ('State a claim','I argue that … because … / School prepares students for …'),
 ('Use the reading','Paul argues that … / Lydia\'s experience suggests …'),
 ('Explain the connection','This matters because … / This example shows how …'),
 ('Concede and respond','I agree with you that … . However, …'),
 ('Ask for stronger support','Could you give a specific example? How does that support your claim?'),
 ('Qualify the claim','It depends on … / This may apply to … / One reason for this is …')],12,y,[43,143],9.8)
y=p.heading('6. Keep a better argument and new language','回饋後修訂；記下能再次使用的詞組。',y+11)
y=p.para('The strongest support I heard: _______________________________________________<br/>It was convincing because: __________________________________________________<br/>My revised claim + support: __________________________________________________<br/>____________________________________________________________________________<br/>A phrase I learned / corrected: _________________________________________________',12,y,186,10,leading=22)
y=p.para('<b>Check:</b> [ ] clear claim  [ ] concrete support  [ ] explained connection  [ ] answered an objection  [ ] three accurate preposition chunks  [ ] tone supports the purpose.',12,y+5,186,9.7)
p.end('You may change your position after hearing stronger support. Evaluate the reasoning, not agreement with your own view.')
p.save()

p=Page(OUT/'teaching-notes.pdf')
p.start('Teach the language, then debate','Session 2: dependent prepositions; viewpoint versus tone; claims with convincing support. 75 minutes.')
p.heading('Print and organise','先準備詞庫、講義及閱讀卡。',48)
y=p.para('<b>Per student:</b> three-page student handout. Keep the four-page language bank for review, or share one reference copy between two students.<br/><b>Classroom games:</b> project the HTML phrase game and the two pick-a-side games, or let pairs play on a device. Students can move to yes / no / depends areas, point or vote from their seats. No reading cut-outs are needed.<br/><b>Source:</b> responses transcribed from the user-supplied Unit 9B p.109 photograph. The six full responses appear in the HTML reading games with source credit.',12,60,186,9.7)
y=p.heading('75-minute sequence','詞庫先作支援，最後用於個人論證與回應。',y+11)
y=p.table(['Time','Teaching and material'],[
 ('0-4','Same position, different tone: compare the two original opening comments.'),
 ('4-9','Language bank p.1 + handout p.1: notice word + preposition + noun / pronoun / -ing. Twelve starred chunks are the active set.'),
 ('9-17','Complete eight gaps and repair two sentences. In pairs, say a personalised example with a recycled unit word.'),
 ('17-23','HTML phrase game: meaning, missing preposition and use in a sentence. Play a few core items in class; the full 60 remain available for review. Choose three chunks for the debate.'),
 ('23-28','Handout p.1: separate position, reason, example and tone. Model a tone judgement with exact wording.'),
 ('28-39','HTML viewpoint game: read each response, choose yes / no / depends, then explain a reason before revealing the feedback.'),
 ('39-47','HTML tone game: identify attitude and a cue in the same texts. Compare A/F (both no) and B/D (both yes). Do not score position as tone.'),
 ('47-55','Handout p.2: model claim, reason, concrete example, link and response. Show why a personal example is limited support.'),
 ('55-62','Each student prepares an argument. Pair checks the example-to-claim link and three preposition chunks.'),
 ('62-71','Handout p.3: two debate rounds and feedback. Every student makes an opening and a response.'),
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
 ('F Aslan','No: he questions the relevance of school learning to practical job tasks.','Dismissive / abrupt or frustrated: short rhetorical answers, “Never!”, “Sadly”.')],12,60,[13,86,87],9.2)
y=p.para('<b>Separate the axes:</b> A and F share a negative position but sound different. B and D share an affirmative position but use different voices. “Factual” in the book describes a matter-of-fact style; it does not establish that a claim is true. Critical tone can be measured and useful. A phrase can signal both position and tone.',12,y+5,186,9.7)
y=p.para('<b>Game routine:</b> everyone chooses before the answer is revealed. Ask for a reason, then check the feedback. In the tone game, the options offer one supported interpretation; accept other labels when students explain exact wording.',12,y+8,186,9.5)
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

for name,n in [('language-bank.pdf',4),('student-handout.pdf',3),('teaching-notes.pdf',3)]:
 reader=PdfReader(OUT/name);assert len(reader.pages)==n,(name,len(reader.pages));shutil.copy2(OUT/name,LOCAL/name);print(name,n,'pages')
print('Three print PDFs ready. Reading and phrase activities are HTML games; no cut-out report pack.')
