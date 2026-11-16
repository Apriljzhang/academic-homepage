"""Generate the two-sided student sheet and teacher notes for Unit 9C + 9D."""
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
pdfmetrics.registerFont(TTFont('CJK', '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
INK, RULE, SOFT, GREY = map(HexColor, ['#183b2b', '#acbdb2', '#f1f5f2', '#526158'])
OUT.mkdir(parents=True, exist_ok=True)
LOCAL.mkdir(parents=True, exist_ok=True)


class PDF:
    def __init__(self, name):
        self.path = OUT / name
        self.c = canvas.Canvas(str(self.path), pagesize=A4)
        self.c.setTitle('Unit 9 Session 3 - ' + name.replace('-', ' ').removesuffix('.pdf'))
        self.c.setAuthor('General English I')
        self.c.setCreator('ReportLab; prepared with Codex')
        self.n = 0

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
        self.text('General English I  /  Unit 9C + 9D  /  Session 3', 14, 12, 8, colour=GREY)
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


p = PDF('student-handout.pdf')
p.start('Ask, listen, pass it on', 'Name: __________________________  Class: __________  Group: __________')
y = p.head('1. Ask four questions', 46)
y = p.para('Choose three different question words + one yes/no question. Add a follow-up if useful.', y)
questions = [
    ('What', 'What do you enjoy doing? / What would you like to learn?'),
    ('What ... before', 'What have you tried before?'),
    ('Who', 'Who introduced you to it?'),
    ('Where / When', 'Where would you like to work? / When are you available?'),
    ('Why', 'Why are you interested in it?'),
    ('How / How long', 'How do you practise? / How long have you done it?'),
    ('Yes/no', 'Can you help on Friday? / Have you joined a team before?'),
]
y = p.table(['Question word', 'Try asking'], questions, y + 2, [35, 147], size=9)
y = p.para('<b>Sound clear:</b> WHAT do you ENJOY doing? <font name="CJK">↘</font> &nbsp; CAN you HELP on FRIDAY? <font name="CJK">↗</font><br/>Stress the capitals. Wh-questions often fall; yes/no questions often rise.', y + 3, 9)
y = p.head('2. Report the answer', y + 8)
y = p.table(['Direct speech', 'After said / told'], [
    ('I am confident. / I enjoy design.', 'They said they were confident / enjoyed design.'),
    ('I helped my teammate.', 'They said they had helped their teammate.'),
    ('I have tried it. / I had tried it.', 'They said they had tried it.'),
    ('I can help. / I will join.', 'They said they could help / would join.'),
    ('I might join if it is free.', 'They said they might join if it was free.'),
], y + 1, [76, 106], size=9)
y = p.para('<b>Patterns:</b> [Name] said (that) ... / [Name] told me or told us (that) ...<br/>Check who I / you / we refer to. Keep might, not and if. Change time words only when the reporting time changes.<br/><b>Example:</b> yesterday: “I will help tomorrow.” <font name="CJK">→</font> today: She said she would help today.', y + 3, 8.8)
y = p.head('3. Borrow useful language', y + 8)
y = p.para('I am confident / hard-working / helpful / sociable.<br/>My classmate / teammate introduced me to ...<br/>I am interested in design / communication / sustainable materials.<br/>I want to apply for a job as a ... / be part of a team / focus on ...<br/>I might join if ... / I have not decided yet.', y, 9.4)
y = p.para('<font name="CJK">自信／勤奮／樂於助人／善於交際；同學／隊友；設計／溝通／可持續材料；申請工作／成為團隊一員／專注於。</font>', y + 2, 8.2)
p.finish('Review vocabulary: Units 1, 2, 5 and 9. Keep this side visible during the interview.')

p.start('Your group’s campus scoop', 'Topic: hidden talent / part-time job / campus project. Use real or invented information.')
y = p.head('1. Prepare alone', 46)
y = p.para('My interest or skill: ________________________  Something I have tried: ________________________<br/>My plan: _________________________________  A time or condition: __________________________', y, 9.2)
y = p.head('2. Follow your roles', y + 8)
y = p.table(['Round', 'Four people: 3 minutes per round', 'Three people: 4 minutes per round'], [
    ('1', 'A asks B; C reports 1–2, D reports 3–4.', 'A asks B; C reports three answers.'),
    ('2', 'B asks C; D reports 1–2, A reports 3–4.', 'B asks C; A reports three answers.'),
    ('3', 'C asks D; A reports 1–2, B reports 3–4.', 'C asks A; B reports three answers.'),
    ('4', 'D asks A; B reports 1–2, C reports 3–4.', 'Finished: check your own reports.'),
], y + 1, [17, 85, 80], size=8.6)
y = p.para('<b>Each round:</b> interview pair asks/answers four questions. Reporters note keywords, then report the answers. The guest checks: “That is right” / “I said ...”. Correct and rotate.<br/><b>Check:</b> person + event + time + possibility + condition. Report answers; keep the interview questions direct.', y + 3, 9)
y = p.head('3. Note and report', y + 8)
y = p.table(['Speaker + answer keywords', 'My reported statement'], [('', '')] * 4, y + 1, [73, 109], size=9, heights=[8 * mm] + [11 * mm] * 4)
y = p.para('<b>My 30-second scoop:</b> choose two statements above. Share them; ask the speaker to confirm.', y + 3, 9)
y = p.head('4. Listen to 9D', y + 8)
y = p.para('<b>tough</b> = difficult; <b>finite</b> = limited; <b>use up</b> = use all; <b>materials</b> = what things are made from.<br/>Weak forms: to /tə/, of /əv/, a /ə/, and /ən(d)/. Listen for the stressed words.', y, 8.8)
y = p.table(['Supplies on the boat + the limit', 'Ellen’s bigger lesson + her example'], [('', '')], y + 2, [91, 91], size=9, heights=[8 * mm, 17 * mm])
y = p.head('5. My exit response', y + 8)
y = p.para('Yesterday Alex said: “I am free tomorrow, but I can only stay for an hour.” Report it today.', y, 8.8)
for prompt in ['Alex said __________________________________________________________________________',
               'Ellen explained that __________________________________________________________________',
               'My own campus action: I could __________________________________________________________']:
    y = p.para(prompt, y + 3, 9.1)
p.finish('9C pp.110–111; 9D pp.112–113. Keep Ellen’s ideas separate from your own campus example.')
p.save(2)

p = PDF('teaching-notes.pdf')
p.start('Gossip, interviews and a bigger idea', '75 minutes. Keep slides 6–10: reported speech, changes, question intonation and question choices.')
y = p.head('Prepare', 46)
y = p.para('Print one two-page student sheet per student, preferably double-sided. No cutting is needed. Open 9C pp.110–111, Audio 60 for question intonation, Audio 56 for weak forms, and Videos 9.2–9.4. Prepare the short extracts described on page 2. Use the slide timer once per group round.', y, 9.4)
y = p.head('Teaching sequence', y + 9)
y = p.table(['Minutes', 'Slides', 'Teaching and individual evidence'], [
    ('0–7', '1–2', 'Read the fictional gossip; pairs request the source. Reveal Maya’s message. Each student repairs the report, preserving might, the condition and undecided status.'),
    ('7–16', '3–5', 'Use Carmen’s race / full-time driving example. Students select two recycled chunks and trace changes in the worked A/B/C/D conversation.'),
    ('16–29', '6–8', 'Keep the direct/reported comparison and said/told/pronoun work. Use two p.110 Ex.3–4 items. Check person, tense and time from the situation.'),
    ('29–36', '9–10', 'Listen and trace final pitch. Stress question keywords. Each student selects three different question words and one yes/no question.'),
    ('36–38', '11', 'Assign A/B/C/D or A/B/C. Choose a topic; students prepare their own answer keywords first.'),
    ('38–50', '12', 'Interview and rotate using the handout table. Reporters listen first and report the answers. Every student is interviewer, guest and reporter.'),
    ('50–54', '13', 'Each student prepares two reports and shares a 30-second scoop. The original speaker confirms or corrects. Collect one corrected statement.'),
    ('54–58', '14', 'Teach finite / tough / use up / focus on / curiosity / materials. Audio 56: notice weak forms; model the original practice sentence.'),
    ('58–63', '15', 'Watch the supplies extract twice. Students note two supplies and the constraint, then check with a partner.'),
    ('63–68', '16', 'Watch the short finite-materials and reuse extracts. Each student reports one idea and an example actually heard.'),
    ('68–73', '17', 'Independent exit: Alex’s message today + Ellen’s idea + the student’s own campus action. Underline a grammatical change.'),
    ('73–75', '18', 'Share one useful sentence. Ask students to photograph/describe an object for Session 4. Download browser work if used.'),
], y + 1, [22, 16, 144], size=8.7)
y = p.head('Make every role count', y + 9)
y = p.para('<b>Four students:</b> four 3-minute rounds: interview 75 seconds, two reporters 45 seconds total, source check/correction/rotation 60 seconds. Each reporter passes on two answers.<br/><b>Three students:</b> three 4-minute rounds: interview 90 seconds, report 60 seconds, check/correct/prepare/rotate 90 seconds. The reporter passes on three answers.<br/><b>Support:</b> use the handout question bank and sentence openings. Guests may invent a profile. Invite a follow-up from confident interviewers. Reporters work from keywords.<br/><b>Notice:</b> one example of meaning preserved; one tense/pronoun/time repair; one clear question with useful stress. During the round, let the speaker finish before feedback.', y, 9.1)
p.finish('Individual evidence: two verified reports, a listening report and a three-part exit response.')

p.start('Source cues and answer checks', 'Use the supplied textbook pages. Play the licensed textbook video or the official TED talk.')
y = p.head('Keep the clips short', 46)
y = p.para('<b>9.2 supplies:</b> select the section where she describes the boat as her whole world, carrying everything for the journey, and the meaning of finite. About 60–90 seconds; play twice.<br/><b>9.3 connection:</b> select the opening link between the economy and finite materials.<br/><b>9.4 reuse:</b> select the opening idea plus the engine/component examples. Keep 9.3 + 9.4 to about 60–90 seconds combined; replay if needed. Use start/stop cues in the e-book, as edited-player timings differ.<br/>These are selected extracts. Session 4 returns to the idea for a practical proposal and an enquiry email. Avoid presenting the talk’s historical resource-depletion estimates as current facts.', y, 9.3)
y = p.head('Answers and acceptable reports', y + 8)
y = p.para('<b>Gossip:</b> Maya said she might try making study videos that summer if she had enough time. She said she had not decided yet. The original says nothing about leaving university or becoming a full-time influencer.<br/><b>Carmen:</b> first race at 12; full-time driving at 20. After said: had entered / had started.<br/><b>Slide 7:</b> told me / said that; Alex said he had finished his part; might / was.<br/><b>Slide 8:</b> was busy that day; would help today; had started ... the previous year; should practise ... . Time words depend on the actual reporting day.<br/><b>Question intonation:</b> yes/no often rises; wh often falls. Stress information words. Natural intonation varies with intent. Audio 60 examples: rising yes/no, falling wh questions.<br/><b>9D supplies:</b> food, fuel, clothes, toothpaste and other necessities; only the supplies on board are available.<br/><b>9D idea:</b> resources are finite; materials/products can stay useful. Examples include rebuilding engines and recovering components/materials.<br/><b>Exit:</b> Alex said he was free today, but he could only stay for an hour. Accept appropriate pronouns. Ellen explained that resources are finite / were finite. The campus action is the student’s own application.', y, 9.2)
y = p.head('If the audio or video cannot play', y + 8)
y = p.para('<b>Original teacher-written listening substitute; not a transcript.</b> Read twice with the text hidden. Use the questions below, not the textbook detail questions.', y, 9.1)
y = p.para('<i>On a long solo voyage, a sailor has only the supplies she takes with her. She must plan food, fuel and other necessities carefully. Ellen MacArthur connected this experience with the world’s limited resources. She began to explore how materials and products could stay useful for longer. Her talk considers recovering components and materials so that they can be used again.</i>', y + 2, 9.4)
y = p.para('Ask: (1) What two supplies are named? (2) What is limited? (3) How could products stay useful?<br/><b>Key:</b> food and fuel; supplies/resources; recover and reuse components/materials. Students report one answer. For weak forms, model “I WANT to be PART of a TEAM”; label it teacher-led practice.', y + 3, 9)
y = p.head('Grammar focus and sources', y + 8)
y = p.para('Teach common backshift after said/told. Preserve might, negation and conditions. Pronouns and time/place expressions depend on the reporting situation. A present tense may remain for a general truth or information still true. Past perfect normally stays past perfect. Students report statements; reported questions are outside the assessed task.<br/>Sources: Perspectives I, 9C pp.110–111; 9D pp.112–113; question intonation from 9E p.114. Activities and substitute scripts are original adaptations.<br/><link href="https://www.ted.com/talks/dame_ellen_macarthur_the_surprising_thing_i_learned_sailing_solo_around_the_world" color="#183b2b">Official TED Talk: The surprising thing I learned sailing solo around the world</link>', y, 8.7)
p.finish('Feedback priority: original meaning first; accurate grammar and clear pronunciation support that meaning.')
p.save(2)
