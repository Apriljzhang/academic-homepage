"""Generate the speaking-to-writing handout and teacher plan for Unit 9 Session 4."""
from pathlib import Path
from xml.sax.saxutils import escape
import shutil, json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public/teaching/courses/general-english/unit-9/session-4'
LOCAL = Path('/Users/ajz/Library/CloudStorage/OneDrive-CityUniversityofMacau/2608-2701/GE I/Unit 9 Session 4 - Speaking and Writing')
FONTS = Path('/Users/ajz/.codex/skills/canvas-design/canvas-fonts')
for name, file in [('Body', 'WorkSans-Regular.ttf'), ('Bold', 'WorkSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Bold', italic='Body', boldItalic='Bold')
pdfmetrics.registerFont(TTFont('CJK', '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
INK, RULE, SOFT, GREY = map(HexColor, ['#183b2b', '#acbdb2', '#f1f5f2', '#526158'])
OUT.mkdir(parents=True, exist_ok=True)
LOCAL.mkdir(parents=True, exist_ok=True)


class PDF:
    def __init__(self, name, unit='9E'):
        self.path = OUT / name
        self.c = canvas.Canvas(str(self.path), pagesize=A4)
        self.c.setTitle('Unit 9 Session 4 - ' + name.replace('-', ' ').removesuffix('.pdf'))
        self.c.setAuthor('General English I')
        self.c.setCreator('ReportLab; prepared with Codex')
        self.n = 0
        self.unit = unit

    def text(self, text, x, y, size=10, font='Body', colour=INK):
        self.c.setFillColor(colour)
        self.c.setFont(font, size)
        self.c.drawString(x * mm, A4[1] - y * mm, text)

    def line(self, x, y, w):
        self.c.setStrokeColor(RULE)
        self.c.setLineWidth(.5)
        self.c.line(x * mm, A4[1] - y * mm, (x + w) * mm, A4[1] - y * mm)

    def para(self, text, y, size=9.5, x=14, w=182, bold=False):
        p = Paragraph(text, ParagraphStyle('p', fontName='Bold' if bold else 'Body', fontSize=size, leading=size * 1.32, textColor=INK))
        _, h = p.wrap(w * mm, A4[1])
        assert y + h / mm <= 280, (self.path, self.n, y, text)
        p.drawOn(self.c, x * mm, A4[1] - y * mm - h)
        return y + h / mm

    def start(self, title, subtitle):
        self.n += 1
        self.text(f'General English I  /  Unit {self.unit}  /  Session 4', 14, 12, 8, colour=GREY)
        self.text(title, 14, 23, 19, 'Bold')
        self.para(subtitle, 28, 9)
        self.line(14, 38, 182)

    def head(self, title, y):
        self.text(title, 14, y, 11.5, 'Bold')
        return y + 3

    def table(self, headers, rows, y, widths, size=9.1, heights=None):
        def cell(s, header=False):
            return Paragraph(s, ParagraphStyle('cell', fontName='Bold' if header else 'Body', fontSize=size, leading=size * 1.27, textColor=INK))
        data = [[cell(s, True) for s in headers]] + [[cell(s) for s in row] for row in rows]
        t = Table(data, colWidths=[w * mm for w in widths], rowHeights=heights)
        t.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('GRID', (0, 0), (-1, -1), .45, RULE),
            ('BACKGROUND', (0, 0), (-1, 0), SOFT),
            ('LEFTPADDING', (0, 0), (-1, -1), 5), ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        _, h = t.wrap(A4[0], A4[1])
        assert y + h / mm <= 280, (self.path, self.n, 'table', y + h / mm)
        t.drawOn(self.c, 14 * mm, A4[1] - y * mm - h)
        return y + h / mm

    def finish(self, footer):
        self.line(14, 284, 182)
        self.text(footer, 14, 289, 7.2, colour=GREY)
        self.c.setFont('Body', 7.2)
        self.c.drawRightString(196 * mm, 8 * mm, str(self.n))
        self.c.showPage()

    def save(self, pages):
        self.c.save()
        assert len(PdfReader(self.path).pages) == pages
        shutil.copy2(self.path, LOCAL / self.path.name)
        print(self.path.name, pages, 'pages')



DATA = json.loads((ROOT / 'src/data/generalEnglishUnit9.ts').read_text().split('export const unit9Sessions: Unit9Session[] = ', 1)[1].strip().removesuffix(';'))[3]
SLIDES = {s['id']: s for s in DATA['slides']}
PROF, REPLY, PEER = (SLIDES[f's4-{i}']['example'] for i in (10, 14, 15))
ROUGH = SLIDES['s4-9']['example']
JOBS = SLIDES['s4-2']['wordBank']

def cn(s):
    return '<font name="CJK">' + escape(s) + '</font>'

def blocks(p, text, y, size=9):
    for para in text.split('\n\n'):
        y = p.para(escape(para).replace('\n', '<br/>'), y, size) + 2
    return y

def ruled(p, y, n=10, gap=6):
    for _ in range(n):
        y += gap
        p.line(14, y, 182)
    return y

p = PDF('student-handout.pdf')
p.start('Economics: my career profile', 'Name: __________________________  Class: __________  Group: __________')
y = p.head('1. Learn the job vocabulary', 46)
rows = []
for j in JOBS:
    meaning = j['meaning']['zh'].split('：', 1)[0]
    rows.append((j['word'] + '<br/>' + cn(meaning), j['meaning']['en']))
y = p.table(['Job', 'What they do'], rows, y + 1, [55, 127], size=8.8)
y = p.head('2. Separate three kinds of preparation', y + 7)
y = p.table(['Qualities: the person', 'Skills: what they can do', 'Knowledge: what they understand'], [
    ('honest; hard-working; organised; curiosity', 'analyse data; check figures; explain results; work in a team', 'economics; mathematics; statistics; accounting; financial statements'),
], y + 1, [60, 61, 61], size=8.7)
y = p.para('<b>Review:</b> U1: confident / nervous / helpful / honest / hard-working.<br/>U2: communication / business / education / imagination. U5: classmate / teammate / professional / international.<br/>U9: focus on / ask for / depend on / decide on / apply for / be part of a team.', y + 3, 8.5)
y = p.head('3. Prepare your own profile', y + 7)
y = p.para('My job: _______________________  Two qualities: ______________________________________<br/>Two skills: ________________________________________________________________________<br/>Two knowledge areas: ______________________________________________________________<br/>One point with a reason/example: ___________________________________________________<br/>My Year 1 learning gap: ______________________________________________________________', y, 9.2)
y = p.head('4. Discuss, report and rotate', y + 7)
y = p.para('<b>Four people:</b> speaker / interviewer / reporter / evidence checker. Rotate A/B/C/D to B/C/D/A, then C/D/A/B, then D/A/B/C; 2.5 minutes per round.<br/><b>Three people:</b> speaker / interviewer / reporter; rotate three times, 3 minutes each, then check for 1 minute. The interviewer also checks evidence.', y, 8.6)
y = p.para('<b>Ask:</b> What does a(n) ... do? What qualities / skills / knowledge do they need? Why? What could you learn now?<br/><b>Explain:</b> I need to be ... / be able to ... / have knowledge of ... . This matters because ... . For example, ... .<br/><b>Report:</b> [Name] said they ... . <b>Intonation:</b> WHAT skills do they NEED? ' + cn('↘') + ' DO they work in a TEAM? ' + cn('↗'), y + 3, 8.6)
y = p.para('My professor question: ______________________________________________________________', y + 4, 9)
p.finish('Share your own profile: 2 qualities, 2 skills, 2 knowledge areas, one reason/example and one learning gap.')

p.start('Write to your professor', 'Ask how you could prepare for a career while you are in Year 1.')
y = p.head('1. Repair the rough emails', 46)
rough_rows = [
    ('A', 'Subject: Help!!!<br/>Hey prof,<br/>I want a high-paid quant job. Tell me everything I need to know. Could you tell me what should I study? Please reply tonight.<br/>Alex'),
    ('B', '[No subject]<br/>Dear Sir/Madam,<br/>I am a student and I have a lot of confusion about my future. I want to be an accountant. I would like to know do I need communication skills. I am waiting for your reply.<br/>Your student'),
]
y = p.table(['Draft', 'What would you change?'], rough_rows, y + 1, [15, 167], size=8.5)
y = p.para('Check: subject / greeting / purpose and context / focused requests / tone / close and name.', y + 2, 8.5)
y = p.head('2. Notice how the model works', y + 6)
y = blocks(p, PROF, y, 8.6)
y = p.para('<b>Ask indirectly:</b> Could you tell me which subjects <b>I should focus on</b>?<br/>I would like to know <b>whether I need</b> programming skills. Use statement word order inside the question.', y + 1, 8.5)
y = p.head('3. Write your own enquiry: 90-120 words', y + 6)
y = p.para('Use your own career and learning gap. Include 3 focused requests, at least 2 indirect questions and 3 review words/chunks. Revise the same draft after feedback.', y, 8.5)
y = ruled(p, y, 10, 5.6)
y = p.para('<b>Partner check:</b> Is the purpose clear? Are the requests answerable? Does the tone fit a professor?<br/>Check word order, greeting and close. Underline one revision.', y + 4, 8.5)
p.finish('Classroom models with fictional people. Write a practice email; you do not need to send it.')

p.start('Report the advice to a classmate', 'Use the reply below as your source. Separate the professor\'s advice from your own plan.')
y = p.head('1. Read the fictional reply', 46)
y = blocks(p, REPLY, y, 8.9)
y = p.head('2. Notice a different recipient and purpose', y + 4)
y = blocks(p, PEER, y, 8.8)
y = p.para('<b>Report:</b> said (that) ... / told me (that) ... / advised me to ... . Can ' + cn('→') + ' could; should stays should.<br/>Keep relevant if-conditions and the strength of advice. Present forms can remain if the advice is still current.', y + 1, 8.5)
y = p.head('3. Write your own report: 80-100 words', y + 6)
y = p.para('Use a clear subject and friendly greeting/close. Report 3 supported points using 2 reporting patterns.<br/>Use 3 review words/chunks. Add your own next step: I plan to ... . For another career, use the general advice and say what you still need to ask.', y, 8.5)
y = ruled(p, y, 9, 5.8)
y = p.para('<b>Partner check:</b> Compare every report with the reply. Keep conditions and meaning. Check tone and reporting forms; revise one sentence.<br/><b>Say:</b> one thing you could learn now and one improved sentence.', y + 4, 8.5)
p.finish('Individual outputs: a career profile, a professor enquiry and an accurate email reporting advice.')
p.save(3)

p = PDF('teaching-notes.pdf')
p.start('Applied Economics: speaking and writing', '75 minutes. Career profile > professor enquiry > accurate email to a classmate.')
y = p.head('Prepare and connect', 46)
y = p.para('Print the 3-page student handout; use textbook 9E pp.114-115. Reuse Session 1 skills/experience, Session 2 chunks/reasons/tone and Session 3 question intonation/reported speech. New job titles extend the Unit 9 bank. U1/2/5/9 words are reviewed in speaking and both emails. The professor and all correspondence are fictional.', y, 8.8)
y = p.head('Sequence', y + 6)
actions = [
 'Name a career interest and a possible first-year learning goal; introduce the three outputs.',
 'Teach 8 job titles. Pairs describe/guess a role. Distinguish accountant/auditor and quant/data analyst.',
 'Distinguish qualities, skills and knowledge; ask students to supply an extra example of each.',
 'Compare the quant/accountant prompts; accept supported alternatives. Do not present an exhaustive checklist.',
 'Read the career dialogue in pairs. Find a claim, reason and example; rehearse question intonation.',
 'Individual keywords: job, 2 qualities, 2 skills, 2 knowledge areas and a learning gap.',
 'Rotate roles. Each speaker explains their own profile; reporter checks meaning with the speaker.',
 'Each student states a career goal/gap and develops two questions for a professor.',
 'Repair both rough emails individually, then compare. Reveal possible changes after discussion.',
 'Read the enquiry model: purpose, relevant context, focused requests and appropriate tone.',
 'Repair indirect questions. Teach embedded subject + verb, if/whether and recommend something to someone.',
 'Write a 90-120-word professor enquiry: 3 requests, 2 indirect questions, 3 review words/chunks.',
 'Partners read as professor; writer revises one sentence in the same draft.',
 'Read the supplied reply. Select general advice and the career-specific advice that fits; retain conditions.',
 'Read the peer model: identify 3 reports, 2 reporting patterns and the separate personal plan.',
 'Write an 80-100-word classmate email from the reply, using 3 supported points and an own next step.',
 'Compare reports against reply. Reveal answers; check meaning/tone and revise the same draft.',
 'Each student shares one next step and one improved sentence; save/download work.',
]
rows=[]; elapsed=0
for i,(s,a) in enumerate(zip(DATA['slides'],actions),1):
    rows.append((f'{elapsed}-{elapsed+s["minutes"]}',str(i),a)); elapsed+=s['minutes']
assert elapsed == 75
y = p.table(['Minutes','Slide','Teacher action'], rows, y+1, [20,14,148], size=8.1)
y = p.head('Rounds, feedback and answers', y+6)
y = p.para('<b>4 students:</b> 4 x 2.5 min: profile 45s, questions 30s, support/example 30s, report 30s, meaning check 15s. <b>3:</b> 3 x 3 min + 1 min check; interviewer checks evidence. Everyone speaks and reports.<br/><b>Slide 9:</b> A: specific subject, named greeting, year/major, focused requests, no unexplained deadline; well-paid; what I should study. B: subject/context/name; whether I need; courteous thanks/close. Explain recipient fit, not rigid bans.<br/><b>Slide 11:</b> which subjects I should focus on; whether/if I need programming skills; recommend a project to me / recommend a small project.<br/><b>Slide 17:</b> (1) Unsupported: gradual programming advice is conditional. (2) The writer owns the plan.<br/><b>Check:</b> speaking separates all three categories and supports a claim; enquiry has clear purpose/requests; peer email preserves meaning, conditions and certainty. Backshift is common, not compulsory for still-current advice. Past perfect is optional when earlier past experience fits.', y, 8.25)
y = p.para('Career descriptions: simplified from O*NET Financial Quantitative Analysts and U.S. BLS profiles (accountants/auditors, financial analysts, market research analysts, economists). Discuss first-year preparation with the professor; examples are not local recruitment or licensing requirements.', y+3, 7.6)
p.finish('Three individual outputs. Drafts are classroom practice; no sending or real professor reply is required.')
p.save(1)
