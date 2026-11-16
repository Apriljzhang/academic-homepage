"""Generate a two-sided 9C interview handout and notes for the 9C + 9D lesson."""
from pathlib import Path
from xml.sax.saxutils import escape
import shutil
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
OUT = ROOT / 'public/teaching/courses/general-english/unit-9/session-3'
LOCAL = Path('/Users/ajz/Library/CloudStorage/OneDrive-CityUniversityofMacau/2608-2701/GE I/Unit 9 Session 3 - Gossip Interviews and Reported Speech')
FONTS = Path('/Users/ajz/.codex/skills/canvas-design/canvas-fonts')
for name, file in [('Body', 'WorkSans-Regular.ttf'), ('Bold', 'WorkSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Bold', italic='Body', boldItalic='Bold')
pdfmetrics.registerFont(TTFont('CJK', '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
INK, RULE, SOFT, GREY = map(HexColor, ['#183b2b', '#acbdb2', '#f1f5f2', '#526158'])
OUT.mkdir(parents=True, exist_ok=True)
LOCAL.mkdir(parents=True, exist_ok=True)


class PDF:
    def __init__(self, name, unit='9C + 9D'):
        self.path = OUT / name
        self.c = canvas.Canvas(str(self.path), pagesize=A4)
        self.c.setTitle('Unit 9 Session 3 - ' + name.replace('-', ' ').removesuffix('.pdf'))
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
        self.text(f'General English I  /  Unit {self.unit}  /  Session 3', 14, 12, 8, colour=GREY)
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


p = PDF('student-handout.pdf', unit='9C')
p.start('Could you become an influencer?', 'Name: __________________________  Class: __________  Group: __________')
y = p.head('1. Use words you know', 46)
y = p.para('Choose two or three chunks to use in your interview.', y, 9.4)
y = p.table(['Unit', 'Vocabulary', 'Try saying'], [
    ('1', '<b>confident</b> <font name="CJK">自信的</font>; nervous <font name="CJK">緊張的</font>; <b>honest</b> <font name="CJK">誠實的</font>;<br/>hard-working <font name="CJK">勤奮的</font>; sociable <font name="CJK">善於交際的</font>; talented <font name="CJK">有才華的</font>', 'I feel nervous on camera.<br/>An influencer needs to be honest and hard-working.'),
    ('2', '<b>communication</b> <font name="CJK">溝通</font>; imagination <font name="CJK">想像力</font>; business <font name="CJK">商業</font>;<br/>designer <font name="CJK">設計師</font>; education <font name="CJK">教育</font>', 'I want to improve my communication skills.<br/>I could use my imagination to make educational videos.'),
    ('5', '<b>classmate</b> <font name="CJK">同學</font>; teammate <font name="CJK">隊友</font>; partner <font name="CJK">伙伴</font>;<br/>personal <font name="CJK">個人的</font>; <b>professional</b> <font name="CJK">專業的</font>; cultural <font name="CJK">文化的</font>', 'My classmate could be my filming partner.<br/>I want to share personal experiences in a professional way.'),
    ('9', 'make money <font name="CJK">賺錢</font>; <b>do something you enjoy</b> <font name="CJK">做喜歡的事</font>;<br/>be part of a team <font name="CJK">成為團隊一員</font>; <b>focus on</b> <font name="CJK">專注於</font>;<br/><b>decide on</b> <font name="CJK">決定</font>; curiosity <font name="CJK">好奇心</font>', 'I might focus on university life.<br/>I have not decided on a topic yet.'),
], y + 2, [13, 96, 73], size=9.2)
y = p.head('2. Ask, answer, then report', y + 9)
y = p.para('A asks. B answers. C/D report B\'s answer. These examples use Maya as the guest.', y, 9.2)
y = p.table(['Question', 'Maya answers', 'Another member reports'], [
    ('Why do you want to become an influencer?', 'I want to do something I enjoy and make money.', 'Maya said she wanted to do something she enjoyed and make money.'),
    ('What would your videos focus on?', 'I have not decided on a topic yet.', 'Maya said she had not decided on a topic yet.'),
    ('Who could help you?', 'My classmate can help me film.', 'Maya said her classmate could help her film.'),
    ('Are you confident on camera?', 'I feel nervous, but I might try if my partner helps me.', 'Maya said she felt nervous but might try if her partner helped her.'),
], y + 2, [49, 57, 76], size=9.3)
y = p.head('3. Keep the meaning; check the changes', y + 9)
y = p.para('<b>Patterns:</b> [Name] said (that) ... / [Name] told me or told us (that) ...<br/><b>Common changes:</b> am/is <font name="CJK">→</font> was; enjoy <font name="CJK">→</font> enjoyed; tried / have tried <font name="CJK">→</font> had tried;<br/>can <font name="CJK">→</font> could; will <font name="CJK">→</font> would. Past perfect and might normally stay the same.<br/>Check who I / you / we refer to. Keep not and if. Change time words when the reporting time changes.', y, 9.1)
y = p.para('<b>Sound clear:</b> WHY do you want to become an INFLUENCER? <font name="CJK">↘</font><br/>ARE you CONFIDENT on CAMERA? <font name="CJK">↗</font><br/>Stress the capitals. Wh-questions often fall; yes/no questions often rise.', y + 4, 9.1)
p.finish('Review: Units 1, 2, 5 and 9. Use the bold chunks first. Keep this side visible while speaking.')

p.start('Interview, report, rotate', 'Topic: becoming an influencer, a hidden talent or a campus project. Use real or invented information.')
y = p.head('1. Prepare alone', 46)
y = p.para('My interest or skill: ________________________  Something I have tried: ________________________<br/>My plan: _________________________________  A time or condition: __________________________', y, 9.2)
y = p.head('2. Choose four questions', y + 7)
y = p.para('Use three different question words + one yes/no question. Add a follow-up if useful.', y, 9.2)
y = p.table(['Question word', 'Other questions you can ask'], [
    ('What', 'What do you enjoy doing? / What have you tried before?'),
    ('Who', 'Who introduced you to it? / Who would you like to work with?'),
    ('Where / When', 'Where would you film? / When are you available?'),
    ('Why / How', 'Why are you interested in it? / How do you practise? / How long have you done it?'),
    ('Yes/no', 'Can you work with a team? / Have you made a video before?'),
], y + 2, [35, 147], size=9)
y = p.head('3. Follow your roles', y + 7)
y = p.table(['Round', 'Four people: 3 minutes per round', 'Three people: 4 minutes per round'], [
    ('1', 'A asks B; C reports 1–2, D reports 3–4.', 'A asks B; C reports three answers.'),
    ('2', 'B asks C; D reports 1–2, A reports 3–4.', 'B asks C; A reports three answers.'),
    ('3', 'C asks D; A reports 1–2, B reports 3–4.', 'C asks A; B reports three answers.'),
    ('4', 'D asks A; B reports 1–2, C reports 3–4.', 'Finished: check your own reports.'),
], y + 1, [17, 85, 80], size=8.6)
y = p.para('The interview pair talks first. Reporters note keywords, then report the answers.<br/>The guest checks: “That is right” / “I said ...”. Correct and rotate.<br/><b>Check:</b> person + event + time + possibility + condition. Keep the interview questions direct.', y + 3, 9)
y = p.head('4. Note and report', y + 7)
y = p.table(['Speaker + answer keywords', 'My reported statement'], [('', '')] * 4, y + 1, [73, 109], size=9, heights=[8 * mm] + [11 * mm] * 4)
y = p.para('<b>My 30-second scoop:</b> share two statements. Ask the original speaker to confirm them.', y + 3, 9)
y = p.head('5. My exit response', y + 7)
y = p.para('Yesterday Alex said: “I am free tomorrow, but I can only stay for an hour.” Report it today.', y, 8.8)
for prompt in ['Alex said __________________________________________________________________________',
               '__________________________________________________________________________________',
               'One word I changed, and why: __________________________________________________________']:
    y = p.para(prompt, y + 2, 9.1)
p.finish('9C pp.110–111. Question intonation: 9E p.114. Name the source and keep the original meaning.')
p.save(2)

p = PDF('teaching-notes.pdf')
p.start('Session 3: teaching plan', '75 minutes. Influencer gossip, reported speech, group interviews and textbook listening.')
y = p.head('Prepare', 46)
y = p.para('Print the student handout double-sided. Open 9C pp.110–111 and 9D pp.112–113. Use Audio 60 for question intonation, Audio 56 for weak forms and Videos 9.2–9.4 for listening.', y, 9.4)
y = p.head('Sequence', y + 9)
y = p.table(['Minutes', 'Slides', 'Task'], [
    ('0–7', '1–2', 'Compare the influencer rumour with Maya’s message. Repair the report; keep might and the condition.'),
    ('7–16', '3–5', 'Read Carmen’s example. Choose two or three vocabulary chunks; follow the interview-to-report model.'),
    ('16–29', '6–8', 'Teach tense, pronoun and time changes; practise said / told and two items from p.110 Ex.3–4.'),
    ('29–36', '9–10', 'Listen to Audio 60; practise stress and final pitch. Choose three question words and one yes/no question.'),
    ('36–38', '11', 'Assign roles. Each student prepares answer keywords on the handout.'),
    ('38–50', '12', 'Interview, report and rotate using the handout table.'),
    ('50–54', '13', 'Each student shares two reports. The original speaker confirms or corrects them.'),
    ('54–58', '14', 'Use textbook p.112 and Audio 56 to notice weak forms.'),
    ('58–63', '15', 'Use the textbook and Video 9.2. Compare answers with a partner.'),
    ('63–68', '16', 'Use the finite-materials and reuse sections of Videos 9.3–9.4 with textbook p.113.'),
    ('68–73', '17', 'Handout exit: report Alex’s message and explain one change.'),
    ('73–75', '18', 'Share one useful sentence. Prepare an object/photo for Session 4.'),
], y + 1, [22, 16, 144], size=9)
y = p.head('Group rounds', y + 9)
y = p.para('<b>Four students:</b> four 3-minute rounds. Interview 75 seconds; two reporters 45 seconds total; check and rotate 60 seconds. Each reporter reports two answers.<br/><b>Three students:</b> three 4-minute rounds. Interview 90 seconds; report three answers in 60 seconds; check and rotate 90 seconds.<br/>Check person, event, time, possibility and condition. Everyone asks, answers and reports.', y, 9.2)
y = p.head('Quick checks', y + 9)
y = p.para('<b>Gossip:</b> Maya said she might try making study videos if she had enough time. She said she had not decided yet.<br/><b>Carmen:</b> first race at 12; full-time driving at 20. Use had entered / had started.<br/><b>Grammar:</b> said (that) ...; told me/us (that) ... . Keep might, not and if. Time words depend on the reporting day.<br/><b>Exit:</b> Alex said he was free today, but he could only stay for an hour. Accept appropriate pronouns.<br/><b>Feedback:</b> one accurate report, one clear question, one correction checked by the speaker.', y, 9.2)
y = p.para('<b>9D:</b> use the textbook directly. Keep viewing short: 9.2 supplies; 9.3 finite materials; 9.4 reuse examples. Students report one idea from the talk.', y + 5, 9.2)
p.finish('Sources: Perspectives I, 9C pp.110–111; 9D pp.112–113; question intonation from 9E p.114.')
p.save(1)
