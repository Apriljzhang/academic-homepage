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
MODEL = SLIDES['s4-8']['example']

p = PDF('student-handout.pdf')
p.start('Ask about your next step', 'Name: __________________________  Class: __________  Group: __________')
y = p.head('1. Prepare your profile', 46)
y = p.para('My interest or strength: ______________________  A real example: ___________________________<br/>A skill I want to improve: ____________________  My priority: _______________________________', y, 9.3)
y = p.head('2. Choose a workshop', y + 8)
y = p.table(['Practice workshop', 'What you could learn and use'], [
    (c['title']['en'], ' '.join(x['en'] for x in c['lines'])) for c in SLIDES['s4-3']['columns']
], y + 1, [43, 139], size=9.2)
y = p.para('The options give skills only. Ask the coordinator about times, entry requirements and equipment.', y + 2, 8.9)
y = p.head('3. Use your speaking bank', y + 8)
y = p.table(['Useful language', 'Purpose'], [
    ('I am interested in ... / I am good at ...', '<font name="CJK">興趣／長處</font>'),
    ('I have tried / helped ... . For example, ...', '<font name="CJK">經驗及例子</font>'),
    ('I would like to improve ...', '<font name="CJK">學習目標</font>'),
    ('I would recommend ... because ...', '<font name="CJK">建議及理由</font>'),
    ('[Name] said they ...', '<font name="CJK">準確轉述</font>'),
    ('I still need to ask about ...', '<font name="CJK">仍需知道的資訊</font>'),
], y + 1, [134, 48], size=9.1)
y = p.para('<b>Ask:</b> What do you enjoy? What have you tried? What would you like to improve?<br/><b>Follow up:</b> Can you give an example? &nbsp; WHAT would you like to LEARN? <font name="CJK">↘</font> CAN you work with a TEAM? <font name="CJK">↗</font>', y + 3, 8.9)
y = p.head('4. Talk, advise, report and rotate', y + 8)
y = p.table(['Round', 'Student', 'Adviser', 'Reporter', 'Questioner'], [
    ('1', 'A', 'B', 'C', 'D'), ('2', 'B', 'C', 'D', 'A'),
    ('3', 'C', 'D', 'A', 'B'), ('4', 'D', 'A', 'B', 'C'),
], y + 1, [18, 41, 41, 41, 41], size=8.8)
y = p.para('<b>Four people:</b> four 3-minute rounds. <b>Three people:</b> A/B/C <font name="CJK">→</font> B/C/A <font name="CJK">→</font> C/A/B, four minutes each; the reporter also asks the missing-information question.<br/>Student: explain your profile. Adviser: ask and recommend with a reason/example. Reporter: pass on the needs and advice. Questioner: ask what is still unknown. Check and rotate.', y + 3, 8.8)
y = p.head('5. My spoken choice', y + 8)
y = p.para('I chose __________________ because __________________________________________________<br/>__________________ said _____________________________________________________________<br/>I still need to ask about __________________ / __________________ / __________________', y, 9.2)
p.finish('Individual output: a 30-second choice supported by a reason, an example and advice you heard.')

p.start('Write an enquiry you can use', 'Use the workshop you chose in your conversation. Write 90–120 words.')
y = p.head('1. Notice the purpose and three questions', 46)
for paragraph in MODEL.split('\n\n'):
    y = p.para(escape(paragraph).replace('\n', '<br/>'), y, 9.1)
    y += 2
y = p.head('2. Use statement word order inside the question', y + 4)
y = p.table(['Direct', 'Indirect'], [
    ('When does it start?', 'Could you tell me when it starts?'),
    ('Can beginners join?', 'I would like to know whether beginners can join.'),
    ('What should I bring?', 'Could you tell me what I should bring?'),
], y + 1, [57, 125], size=9)
y = p.head('3. Write your own enquiry', y + 7)
y = p.para('Include a subject, greeting, purpose, brief context, three useful questions and a close.<br/>Use at least two indirect questions and two useful chunks. Write below; revise the same draft.', y, 8.8)
for i in range(11):
    y += 6.2
    p.line(14, y, 182)
y = p.head('4. Check and improve', y + 8)
y = p.para('Partner check: underline the purpose; number three questions; check two indirect questions.<br/>Give one comment. Revise at least one sentence. Then ask one revised question aloud.', y, 8.8)
y = p.para('My improved sentence: ______________________________________________________________', y + 4, 9)
p.finish('Original classroom model. All workshop options are fictional. Keep purpose, questions and tone clear.')
p.save(2)

p = PDF('teaching-notes.pdf')
p.start('Session 4: speaking to writing', '75 minutes. Each student gives supported advice and produces a revised enquiry email.')
y = p.head('Build on Sessions 1–3', 46)
y = p.para('<b>1:</b> skills and experience. <b>2:</b> dependent-preposition chunks, reasons, examples and tone. <b>3:</b> question intonation and accurate reports. Today these support a personal workshop choice and enquiry.<br/><b>Prepare:</b> one two-page handout per student, double-sided; textbook 9E pp.114–115. The workshop options and email model are original classroom materials.', y, 9.2)
y = p.head('Sequence', y + 8)
elapsed = 0
rows = []
purposes = [
    'Use the object/photo or a recent activity to name a useful skill. Introduce the two outputs.',
    'Recall one strength, one specific example and one learning goal; tell a partner.',
    'Read the three workshop options and make a provisional choice.',
    'Pairs read the advice model; identify a question, recommendation and support.',
    'Prepare individual keywords and questions. Keep the language bank visible.',
    'Rotate student/adviser/reporter/questioner roles. Every student takes every role.',
    'Each student shares a 30-second choice and names three unanswered questions.',
    'Read the enquiry model: purpose, relevant context and three answerable questions.',
    'Teach embedded subject + verb, if/whether and final punctuation.',
    'Repair three questions individually, then say the answers in pairs.',
    'Plan recipient, purpose, context and three questions from the conversation.',
    'Write a 90–120-word enquiry; include at least two indirect questions and two chunks.',
    'Partner acts as recipient: check purpose, question usefulness and word order.',
    'Revise the same paper draft, or the browser final field; practise one question aloud.',
    'Share a workshop choice and revised question; record one improved sentence.',
]
for i, (s, purpose) in enumerate(zip(DATA['slides'], purposes), 1):
    rows.append((f'{elapsed}-{elapsed+s["minutes"]}', str(i), purpose))
    elapsed += s['minutes']
assert elapsed == 75
y = p.table(['Minutes', 'Slide', 'Task'], rows, y + 1, [22, 15, 145], size=8.8)
y = p.head('Speaking rounds and individual checks', y + 8)
y = p.para('<b>Four students:</b> four 3-minute rounds: profile 30 seconds; questions 60; advice 30; report 30; missing information and check 30. <b>Three students:</b> three 4-minute rounds, with the reporter also asking what is missing. Use the extra minute for follow-up questions and correction.<br/><b>Speaking:</b> reason + specific example; report the advice accurately. <b>Writing:</b> clear purpose, three useful questions, at least two indirect, suitable opening/close and one identifiable revision.<br/>Advisers use the skills in the descriptions; unknown times, fees and requirements become questions for the coordinator. Past perfect is optional when an earlier past event needs it.', y, 8.9)
y = p.head('Language checks', y + 8)
y = p.para('<b>Slide 10:</b> (1) Could you tell me when the workshop starts? (2) I would like to know whether/if beginners can join. (3) Could you tell me what equipment I should bring?<br/>A reported statement passes on information. An indirect question requests information; do not backshift its tense automatically. A direct question can also be polite.', y, 8.9)
p.finish('9E pp.114–115. Individual outputs: a supported spoken choice and a revised enquiry.')
p.save(1)
