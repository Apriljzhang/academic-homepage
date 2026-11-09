"""Create three A4 print masters for the two-task Unit 9 Session 1.
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

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/teaching/courses/general-english/unit-9/session-1'
OUT.mkdir(parents=True,exist_ok=True)
DATA=json.loads((ROOT/'src/data/generalEnglishUnit9Session1Cards.json').read_text())
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
  self.text('General English I  /  Unit 9  /  Session 1',12,11,8,'Body',GREY)
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

# Four-page student handout: language first, then an individual product.
p=Page(OUT/'student-handout.pdf')
p.start('Jobs, skills and my life story','Name: ___________________________   Class: __________   Keep these pages open during both tasks.')
p.heading('1. Build a job explanation','先累積語言，再進行配對及說明。',48)
y=p.table(['Word bank','Words to reuse'],[
 ('Unit 1: qualities','calm, friendly, helpful, confident, honest, hard-working'),
 ('Unit 2: skills and places','communication, imagination, location, modern, urban, rural'),
 ('Unit 5: people','teammate, partner, classmate, neighbour, family'),
 ('Unit 9: work','architect, nurse, chef, reporter, accountant, software developer; be part of a team')],12,60,[44,142],10)
y=p.zh('性格：冷靜、友善、樂於助人、自信、誠實、勤奮。技能與地方：溝通、想像力、位置、現代、城市、鄉郊。人物：隊友、伙伴、同學、鄰居、家人。',12,y+3,186,8.5)
y=p.para('<b>Job actions:</b> design buildings; prepare food; care for people; write computer programs; report news; check financial records; manage a shop; teach students; build homes; clean spaces; design electronic devices; give emergency care.',12,y+4,186,9.6)
y=p.heading('Choose the sentence that fits the word','形容詞、動作及名詞需要不同句型。',y+12)
y=p.table(['Use','Sentence frame'],[
 ('Describe the job','A / An ______ is someone who ______.'),
 ('Quality: adjective','A / An ______ needs to be calm / helpful / ______.'),
 ('Action: verb','A / An ______ needs to communicate clearly / ______.'),
 ('Skill: noun phrase','A / An ______ needs good communication skills.'),
 ('Explain the reason','This matters because ______. They often work with ______.')],12,y,[48,138],10)
y=p.para('<b>Model:</b> A nurse cares for people. Nurses need to be calm and helpful. They need good communication skills because they explain things to people and work with teammates.',12,y+5,186,10.3)
y=p.heading('Try the pattern before you sort','先完成短練習，口頭核對後再配卡。',y+12)
y=p.para('1. A nurse needs to ______ calm. (be / have)<br/>2. A reporter needs to ______ clearly. (communicate / communication)<br/>3. A shop manager needs good ______ skills. (communicate / communication)',12,y,186,10.3)
p.end('Task 1 language bank. Matching can have more than one sensible answer.')

p.start('Task 1. Make the job spider','Use the spider mat and job / skill cards. Everyone prepares a different explanation.')
p.heading('Work together','小組共同完成，但每人都要準備自己的輸出。',48)
y=p.para('<b>1.</b> In a group of four, read the job cards and choose four jobs. Put one in each job slot.<br/><b>2.</b> Choose two useful skill or quality cards for each job. Place them in its connected skill slots.<br/><b>3.</b> Explain each match. Ask a question if you disagree. Reuse a skill with a blank card if needed.<br/><b>4.</b> Each person takes one job, prepares a 45-60-second explanation and shares it.',12,60,186,10.5)
y=p.heading('Listen for the job and the priority','老師讀四個工作者線索；選兩位，記下職業、取向及聽到的詞。',y+11)
y=p.table(['Speaker','Job','What matters? + words I heard'],[('____','________________','________________________________'),('____','________________','________________________________')],12,y,[23,48,115],9.3,rowheights=[10,15,15])
y=p.para('Useful priorities: doing something I enjoy / making money / working close to home / being part of a team.',12,y+3,186,9.3)
y=p.heading('My explanation','用提示準備，不必逐字照讀。',y+11)
y=p.para('My job: ____________________  What the person does: __________________________<br/>Two useful skills or qualities: _________________________________________________<br/>They need these because ____________________________________________________<br/>I would / would not like this job because ________________________________________',12,y,186,10.3,leading=21)
y=p.para('<b>Ask your partner:</b> Why does this job need that skill? Could another job need it too? What matters most to you in a job?',12,y+5,186,10)
y=p.para('<b>After sharing:</b> My partner understood ____________________. One phrase I improved: ____________________.',12,y+5,186,10)
p.end('Individual output 1: explain a job, two skills and your own work preference.')

p.start('2. Put your experiences into words','Use the event cards and the timeline mat. The events can be real or imagined.')
p.heading('People, places and feelings','用熟悉的詞把事件說得更具體。',48)
y=p.table(['Unit','Useful language'],[
 ('1: feelings','I felt nervous / excited / confident / happy / worried.'),
 ('2: places','I moved to a new home. I lived in an urban / a rural area.'),
 ('5: people','I met my best friend. I helped a neighbour. I worked with a teammate.'),
 ('9: milestones','I graduated from school. I applied for a job. I decided on a career.')],12,60,[37,149],10)
y=p.heading('Show which past event was earlier','較早的過去事件：had + 過去分詞；較後事件：一般過去式。',y+12)
y=p.para('<b>Earlier:</b> I met my best friend in 2020. <b>Later:</b> I started university in 2026.<br/><b>Connected:</b> By the time I started university, I had already met my best friend.<br/><b>Another pattern:</b> When I joined the team, I had already learned how to work with a partner.',12,y,186,10.2)
y=p.table(['Base verb','Past simple','Past perfect'],[
 ('start / move / join','started / moved / joined','had started / had moved / had joined'),
 ('meet / give / win','met / gave / won','had met / had given / had won'),
 ('become / do','became / did','had become / had done'),
 ('learn / apply','learned / applied','had learned / had applied'),
 ('speak / feel','spoke / felt','had spoken / had felt')],12,y+5,[45,63,78],9.4)
y=p.para('<b>Notice:</b> Use the past perfect to look back from a past moment. With <i>before</i> or <i>after</i>, the past simple can also make the order clear. Do not put every event in the past perfect.',12,y+5,186,9.5)
y=p.heading('Try it aloud','先填空，再向同伴解釋先後。',y+11)
y=p.para('1. By the time I started university, I ______ already ______ my best friend. (meet)<br/>2. When I gave my first presentation, I ______ never ______ in front of a large group. (speak)<br/>3. After I moved to a new home, I ______ a neighbour. (help)',12,y,186,10.1)
p.end('Keep the verb table and examples beside your timeline.')

p.start('Task 2. Tell a life-event story','Use five past events. Add ages or dates; keep the events before NOW on the arrow.')
p.heading('Arrange, discuss, prepare','先排事件，再討論，最後每人分享。',48)
y=p.para('<b>1.</b> Choose five event cards or write your own. Order them on your timeline and add ages / dates.<br/><b>2.</b> Point to two events: which happened first? Link them with a past-perfect sentence.<br/><b>3.</b> Ask each group member about a person, place or feeling. Then choose a second pair of events.<br/><b>4.</b> Prepare a 45-60-second story. Each person shares; listeners check the event order.',12,60,186,10.5)
y=p.para('<b>Ask:</b> What happened first? How old were you? Where were you living? Who was with you? How did you feel? What had you already done by then?',12,y+5,186,10)
y=p.heading('My five-event story','可用關鍵詞準備，分享時指著時間線。',y+12)
y=p.para('When I was / In ______, I ___________________________________________________.<br/>Later, I __________________________________________________________________.<br/>By the time I ______________________, I had already ___________________________.<br/>When I ___________________________, I had _________________________________ .<br/>I felt __________________ because ___________________________________________.',12,y,186,10.3,leading=23)
y=p.heading('Check with a listener','聆聽者檢查先後是否清楚，再給一項具體建議。',y+13)
y=p.para('[  ] Five events are in a clear order.<br/>[  ] I used two earlier / later connections with the past perfect.<br/>[  ] I included a person, a place and a feeling.<br/>[  ] I revised one phrase after feedback.',12,y,186,10.2)
y=p.para('<b>Language I want to keep:</b> __________________________________________________<br/><b>My improved sentence:</b> ___________________________________________________',12,y+6,186,10.2,leading=22)
p.end('Individual output 2: share a life-event story with two clear past-time connections.')
p.save()

# Shared mats and the matching card stock. All physical dimensions are in mm.
p=Page(OUT/'group-mats-and-cards.pdf')
p.start('Jobs and skills','Choose four jobs. Attach two useful skills / qualities to each. Explain every match. 選四個職業，為每個配兩項技能或特質。',True)
# Spider connectors are behind the blank card slots.
for x,y,right in [(76,64,False),(161,64,True),(76,153,False),(161,153,True)]:
 jobcx=x+30
 p.line(148.5,119,x+(18 if right else 42),y+22 if y==64 else y)
 sx=229 if right else 10
 for sy in ([45,83] if y==64 else [134,172]):
  p.line(x+60 if right else x,y+11,sx if right else sx+58,sy+11)
  p.box(sx,sy,58,22,dash=True)
  p.para('skill / quality',sx,sy+7,58,8.5,color=GREY,align=TA_CENTER)
 p.box(x,y,60,22,dash=True);p.para('job',x,y+7,60,10,color=GREY,align=TA_CENTER)
p.c.setFillColor(LIGHT);p.c.setStrokeColor(RULE);p.c.ellipse(123.5*mm,p.H-131*mm,173.5*mm,p.H-107*mm,stroke=1,fill=1)
p.para('Our job spider',125,113,47,11,bold=True,align=TA_CENTER)
p.end('One mat per group of four. Print A4 landscape at 100% / Actual size; do not scale to fit.')

p.start('My significant life events','Choose five past events. Add your own ages or dates. Real or imagined events are welcome. 選五項過去事件，填年齡或日期；可真實或虛構。',True)
for i in range(5):
 x=11.5+i*56
 p.text(f'{i+1}',x,53,10,'Bold');p.box(x,59,52,26,dash=True)
 p.para('event card',x,68,52,9,color=GREY,align=TA_CENTER)
 p.text('Age / date: ________',x,96,8.5)
 p.line(x+26,101,x+26,111)
# Blank arrow; no milestones are prefilled.
path=p.c.beginPath(); pts=[(12,113),(276,113),(276,107),(286,119),(276,131),(276,125),(12,125)]
for i,(x,y) in enumerate(pts): (path.moveTo if i==0 else path.lineTo)(x*mm,p.H-y*mm)
path.close();p.c.setFillColor(LIGHT);p.c.setStrokeColor(INK);p.c.drawPath(path,stroke=1,fill=1)
p.text('Earlier',12,140,9);p.text('Later',249,140,9);p.text('NOW',277,104,9,'Bold')
p.para('By the time I ______________________, I had already ______________________.',12,153,273,12)
p.para('When I __________________________, I had _____________________________.',12,166,273,12)
p.para('Ask: What happened first? Who was with you? Where were you? How did you feel?',12,182,273,9.8)
p.end('One timeline per student. Event cards are 50 x 22 mm and fit the 52 x 26 mm slots. A4 landscape, Actual size.')

def cards_page(title,sub,items,w,h,cols,rows,kind):
 p.start(title,sub)
 gapx=6;gapy=5; startx=(210-(cols*w+(cols-1)*gapx))/2;starty=47
 for idx,item in enumerate(items):
  row,col=divmod(idx,cols);x=startx+col*(w+gapx);y=starty+row*(h+gapy)
  p.box(x,y,w,h,dash=True)
  if item is None:
   p.line(x+4,y+h/2+3,x+w-4,y+h/2+3)
   continue
  en=item['en'];zh=item['zh']
  fs=11.2 if kind=='job' else 10.4
  st=ParagraphStyle('card',fontName='Bold',fontSize=fs,leading=fs*1.05,textColor=black,alignment=TA_CENTER)
  text=Paragraph(en,st);_,th=text.wrap((w-6)*mm,100)
  if th>25: raise ValueError(f'Card too tall: {en}')
  text.drawOn(p.c,(x+3)*mm,p.H-(y+3)*mm-th)
  zh_y=y+3+th/mm+.6
  p.zh(zh,x+3,zh_y,w-6,8)
  if kind=='event':
   p.para(item['forms'],x+1.5,y+h-4.8,w-3,7.4,color=GREY,align=TA_CENTER)
  elif kind=='skill':
   p.text(item['unit'],x+w-7,y+h-1.7,5.6,color=GREY)
 p.end('Cut along the dashed rectangles. Print A4 portrait, single-sided, 100% / Actual size.')

cards_page('Job cards','12 jobs + 6 write-your-own cards. One sheet per group. Cards: 56 x 18 mm.',DATA['jobs']+[None]*6,56,18,3,6,'job')
cards_page('Skills and qualities','18 phrases + 6 blank cards for new or repeated skills. One sheet per group. Cards: 54 x 18 mm.',DATA['skills']+[None]*6,54,18,3,8,'skill')
cards_page('Life-event cards','18 events + 6 blank cards. One sheet per group. Forms: past simple / past perfect. Cards: 50 x 22 mm.',DATA['events']+[None]*6,50,22,3,8,'event')
p.save()

p=Page(OUT/'teaching-notes.pdf')
p.start('Teaching notes','Two main tasks, 75 minutes. Keep the language visible while students make, rehearse and share.')
p.heading('Print and prepare','先準備實體材料，再依照講義頁碼帶領。',48)
y=p.para('<b>Per student:</b> student-handout.pdf (4 A4 portrait pages; duplex is fine) and the timeline mat (group-mats-and-cards.pdf, p.2, A4 landscape).<br/><b>Per group of four:</b> the spider mat (p.1), job cards (p.3), skill cards (p.4) and event cards (p.5). Print mats / cards single-sided at 100% / Actual size. The PDF mixes landscape and portrait pages; allow automatic orientation. Cut the dashed rectangles and provide reusable adhesive or let students place cards.<br/><b>Card sharing:</b> each student chooses five event cards. Use the six blanks to repeat an event or add a personal event; students can also write events directly into their slots.',12,60,186,9.9)
y=p.heading('Teaching sequence','每個主活動都包括語言支援、小組操作及個人分享。',y+11)
y=p.table(['Time','Instruction and scaffold'],[
 ('0-3','Show both outputs: a job explanation and a five-event story.'),
 ('3-9','Handout p.1: recycle Units 1, 2, 5 and 9; model needs to be / needs to / needs + noun. Students complete three guided items.'),
 ('9-13','Read the four worker clues on the next page twice. Students note any two on handout p.2; compare evidence.'),
 ('13-23','Handout p.2 + spider mat: choose four jobs and two skill cards per job. Every student explains a match.'),
 ('23-28','Challenge one match. Model because and ask about work preferences. Students revise a reason.'),
 ('28-35','Individual output 1: 2 minutes to prepare; four 45-60-second reports; brief peer feedback.'),
 ('35-42','Handout p.3: demonstrate earlier / later with two dated events; highlight had + participle and model two patterns.'),
 ('42-47','Students complete the guided grammar and rehearse a two-event sentence with a partner.'),
 ('47-55','Handout p.4 + timeline: choose five past events, put them in order and add ages / dates.'),
 ('55-62','Group discussion: everyone answers a person, place or feeling question and links two pairs of events.'),
 ('62-68','Prepare the individual story using the frames, then improve a sentence after a partner check.'),
 ('68-73','Individual output 2: every student shares for 45-60 seconds while pointing to the timeline.'),
 ('73-75','Exit: keep one useful phrase and correct one sentence. Collect the two individual products.')],12,y,[24,162],8.6)
p.end('Task 1: 35 minutes. Task 2: 40 minutes. Guide 1 of 2.')

p.start('Read, model and give feedback','Worker clues are original classroom scripts, not textbook transcripts.')
p.heading('Worker clues: read twice','學生記錄其中兩位的職業、取向及證據。',48)
y=60
for i,w in enumerate(DATA['workers'],1):
 y=p.para(f'<b>{i}.</b> '+w['text'],12,y,186,9.7)+3
rows=[(str(i),w['job'],w['priority']) for i,w in enumerate(DATA['workers'],1)]
y=p.table(['Speaker','Job','Priority'],rows,12,y,[21,58,107],8.9)
y=p.heading('Language check and useful matches','接受能用工作內容解釋的多種配對。',y+11)
y=p.para('<b>Handout p.1:</b> be / communicate / communication.<br/><b>Handout p.3:</b> had ... met / had ... spoken / helped (had helped would change the intended sequence).<br/><b>Examples:</b> architect - use imagination + work with materials; nurse - be calm + care for people; reporter - be honest + communicate clearly; accountant - focus on details + check money carefully. These are examples, not exclusive requirements.',12,y,186,9.5)
y=p.heading('What each student shares','先獨立準備，再在組內輪流分享；可抽選少量同學全班示範。',y+11)
y=p.para('<b>Job report:</b> name the job, explain an action, justify two skills and state a personal work preference. Listen for needs to be + adjective and because.<br/><b>Life story:</b> five past events; two accurate earlier / later connections; a person, a place and a feeling. Ask the listener to identify which event came first, then improve one sentence.<br/><b>Scaffolding:</b> students keep the model, verb table and frames visible. Confident students can speak from keywords; others can first rehearse complete sentences.',12,y,186,9.5)
y=p.para('<b>Vocabulary:</b> U1 qualities / feelings; U2 communication, imagination and places; U5 people and relationships; U9 jobs, teamwork and milestones. Card phrases adapt these words into usable actions. Technical action phrases also draw on the supplied 9A job descriptions. Extra event language supports the task.<br/><b>Grammar:</b> the earlier event takes past perfect when viewed from a later past point; do not make every event past perfect. With before / after, past simple can be sufficient. Allow real or imagined timelines.',12,y+5,186,8.8)
p.end('Keep feedback specific: preserve meaning, identify the form, rehearse the improved sentence.')
p.save()

expected={'student-handout.pdf':4,'group-mats-and-cards.pdf':5,'teaching-notes.pdf':2}
for name,n in expected.items():
 reader=PdfReader(OUT/name)
 assert len(reader.pages)==n,(name,len(reader.pages))
 print(name,n,'pages')
# Local handoff copies beside the course materials.
local=Path('/Users/ajz/Library/CloudStorage/OneDrive-CityUniversityofMacau/2608-2701/GE I/Unit 9 Session 1 - Jobs and Life Events')
local.mkdir(parents=True,exist_ok=True)
for name in expected:shutil.copy2(OUT/name,local/name)
print('Local handoff:',local)
