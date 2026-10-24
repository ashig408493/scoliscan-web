// Learn tab content.
//
// Each article has a title, a few opening paragraphs (intro), then sections.
// Every section starts with a question, followed by the paragraphs that answer it.
// A section can also have an optional bulleted list, plus optional closing
// paragraphs that appear after the list.
//
// The three articles marked WRITE are yours to fill in by hand.

import {
  Baby,
  Blocks,
  Bone,
  Dna,
  Dumbbell,
  HeartHandshake,
  HelpCircle,
  Hospital,
  Hourglass,
  Layers,
  Lightbulb,
  Link,
  Radiation,
  Ruler,
  Scale,
  ScanLine,
  School,
  ScrollText,
  Shield,
  Shirt,
  Stethoscope,
  Trophy,
  Users,
  Waves,
  Wind,
  type LucideIcon,
} from 'lucide-react';

export type Source = { label: string; url: string };

export type Section = {
  question: string;
  paragraphs: string[];
  bullets?: string[];
  closing?: string[];
};

export const categories = ["Basics", "Causes & risk", "Treatment", "Everyday life", "Later in life", "Science & history"] as const;
export type Category = (typeof categories)[number];

export type Article = {
  id: string;
  title: string;
  category: Category;
  Icon: LucideIcon;
  intro: string[];
  sections: Section[];
  sources: Source[];
};

export const featured = {
  tag: 'NEW GUIDE',
  title: "Do braces actually work?",
  body: "For years nobody knew for sure. Then a 2013 study of 383 teens gave a clear answer, and it changed how doctors treat scoliosis.",
  articleId: 'bracing-evidence',
};

export const articles: Article[] = [
  {
    id: "what-is-scoliosis",
    title: "What is scoliosis?",
    category: "Basics",
    Icon: HelpCircle,
    intro: [
      "WRITE: one or two opening paragraphs with the basic idea.",
    ],
    sections: [
      {
        question: "WRITE: a question your reader would ask?",
        paragraphs: [
          "WRITE: the answer, in one or more paragraphs.",
        ],
      },
    ],
    sources: [],
  },
  {
    id: "how-screening-works",
    title: "How screening works",
    category: "Basics",
    Icon: ScanLine,
    intro: [
      "WRITE: one or two opening paragraphs with the basic idea.",
    ],
    sections: [
      {
        question: "WRITE: a question your reader would ask?",
        paragraphs: [
          "WRITE: the answer, in one or more paragraphs.",
        ],
      },
    ],
    sources: [],
  },
  {
    id: "after-a-referral",
    title: "What happens after a referral",
    category: "Basics",
    Icon: Stethoscope,
    intro: [
      "WRITE: one or two opening paragraphs with the basic idea.",
    ],
    sections: [
      {
        question: "WRITE: a question your reader would ask?",
        paragraphs: [
          "WRITE: the answer, in one or more paragraphs.",
        ],
      },
    ],
    sources: [],
  },
  {
    id: "types",
    title: "The different types of scoliosis",
    category: "Basics",
    Icon: Layers,
    intro: [
      "\"Scoliosis\" is a description, not a single disease. It just means the spine curves to the side, and usually twists as well. Lots of different things can cause that, and the cause matters, because it changes what doctors look for and how they treat it.",
      "Doctors usually sort scoliosis into a few main groups.",
    ],
    sections: [
      {
        question: "What is idiopathic scoliosis?",
        paragraphs: [
          "\"Idiopathic\" is the medical way of saying \"we don't know exactly why.\" This is by far the most common kind, accounting for roughly 8 out of 10 cases. The child is otherwise healthy, the bones formed normally, and the curve simply develops.",
          "Idiopathic scoliosis is grouped by the age it appears. Adolescent idiopathic scoliosis starts at age 10 or later, usually around the growth spurt, and is the type ScoliScan is mainly designed to help catch. Juvenile idiopathic scoliosis starts between ages 3 and 10, and infantile starts before age 3. The younger the child, the more growing is left, so earlier types need closer watching.",
        ],
      },
      {
        question: "What is congenital scoliosis?",
        paragraphs: [
          "Congenital means present from birth. In congenital scoliosis, one or more vertebrae didn't form properly before the baby was born. A vertebra might be only partly formed, making a wedge shape called a hemivertebra, or two vertebrae might be fused together on one side by a strip of bone called a bar. As the child grows, the uneven bones pull the spine to one side.",
          "Because the spine forms at the same time as the heart, kidneys and spinal cord, children with congenital scoliosis are checked for problems in those areas too. Kidney or urinary differences show up in roughly 1 in 5, and heart differences in roughly 1 in 10. When children with congenital scoliosis have an MRI, about a third turn out to have some difference in the spinal cord. Many of these are minor, but doctors want to know.",
        ],
      },
      {
        question: "What is neuromuscular scoliosis?",
        paragraphs: [
          "In neuromuscular scoliosis, the bones start out normal, but the nerves or muscles that hold the spine upright don't work as they should. It's common in conditions like cerebral palsy, Duchenne muscular dystrophy, spinal muscular atrophy and spina bifida, and after spinal cord injuries.",
          "These curves tend to be long and C-shaped, can start early, and often keep getting worse even after growth stops. Treatment focuses as much on comfort, sitting balance and breathing as on the shape of the spine.",
        ],
      },
      {
        question: "What does \"syndromic\" scoliosis mean?",
        paragraphs: [
          "Some genetic syndromes affect connective tissue, bones or nerves throughout the body, and scoliosis is one of their common features. Examples include Marfan syndrome, Ehlers-Danlos syndrome and neurofibromatosis. Doctors sometimes spot these syndromes because of the scoliosis, so they'll look for other clues, like very flexible joints, unusual height, or certain birthmarks.",
        ],
      },
      {
        question: "Are there other kinds?",
        paragraphs: [
          "Yes. Degenerative scoliosis develops in older adults as the discs and joints of the spine wear down unevenly. There's also \"functional\" scoliosis, which isn't a problem with the spine at all but a curve caused by something else, like one leg being longer than the other or muscle spasm from pain. That one goes away when the cause is fixed, and it has its own article in this section.",
        ],
      },
      {
        question: "Why does the type matter?",
        paragraphs: [
          "Knowing the cause tells doctors what else to check, how likely the curve is to get worse, and which treatments make sense. Some features make them look harder for a cause other than idiopathic scoliosis: a curve that bends to the left in the upper back, significant pain, a curve that appears very early or worsens very quickly, or numbness or weakness. In those cases, a doctor will often order an MRI to get a closer look at the spinal cord.",
          "For most teens who are screened, though, the answer turns out to be the ordinary idiopathic kind.",
        ],
      },
    ],
    sources: [
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
      { label: "AAOS OrthoInfo: Congenital scoliosis", url: "https://www.orthoinfo.org/diseases--conditions/congenital-scoliosis" },
      { label: "Wang et al. (2020), Incidence of intraspinal abnormalities in congenital scoliosis: a systematic review and meta-analysis, Journal of Orthopaedic Surgery and Research", url: "https://link.springer.com/article/10.1186/s13018-020-02015-8" },
      { label: "Cleveland Clinic: Scoliosis", url: "https://my.clevelandclinic.org/health/diseases/15837-adult-scoliosis" },
    ],
  },
  {
    id: "functional",
    title: "Structural vs. functional curves",
    category: "Basics",
    Icon: Scale,
    intro: [
      "Not every crooked-looking back is scoliosis. Sometimes the spine itself is perfectly normal, and something else is pulling it out of line. Doctors call this a functional curve, and telling it apart from true, structural scoliosis is one of the first things they do.",
    ],
    sections: [
      {
        question: "What's the difference?",
        paragraphs: [
          "In structural scoliosis, the spine has an actual, fixed curve. The vertebrae are bent to the side and twisted, and they stay that way no matter how you stand or sit.",
          "In a functional (or \"nonstructural\") curve, the spine is shaped normally. It bends because it's compensating for something, much like a tower leaning because its foundation is uneven. Fix the foundation and the tower straightens.",
        ],
      },
      {
        question: "What causes a functional curve?",
        paragraphs: [
          "The most common cause is a difference in leg length. If one leg is longer, the pelvis tilts, and the spine bends to keep your head level over your feet. Small differences of a few millimeters are completely normal. Larger ones can cause a noticeable curve.",
          "Other causes include muscle spasm from back pain, an injury, or an inflamed area like an irritated nerve, where the body leans away from the pain. Habitually standing with your weight on one leg can also make your back look uneven in a photo, even though the spine itself is fine.",
        ],
      },
      {
        question: "How can you tell the two apart?",
        paragraphs: [
          "A few simple checks help. The most important is the forward bend test. When you bend forward, a functional curve usually disappears, because the cause (like a tilted pelvis) is no longer holding the spine to one side. A structural curve doesn't disappear. Instead, the twist in the spine shows up as a hump on one side of the back, usually over the ribs. That hump is what a scoliometer measures, and it's why ScoliScan's forward-bend step matters more than the standing photos.",
          "Doctors also check the curve while you sit, since sitting removes leg length from the picture. And they may place a thin block under the shorter leg to see whether the curve goes away when the pelvis is level.",
        ],
      },
      {
        question: "Can a functional curve turn into real scoliosis?",
        paragraphs: [
          "In general, no. A functional curve comes from a cause outside the spine, and treating that cause usually makes the curve go away. A long-standing, large leg-length difference can lead to some adaptation over many years, but that's different from the twisting curve of idiopathic scoliosis.",
        ],
      },
      {
        question: "Why does this matter for an app like ScoliScan?",
        paragraphs: [
          "Because cameras can't see bones. When ScoliScan notices that your shoulders or hips look uneven while standing, it can't tell whether that's from your spine, a leg-length difference, how you're standing, or even the angle of the phone. That's why the app treats those camera findings as supporting signs only. The forward-bend rotation reading is the closest thing to a real screening test, and a doctor's exam is the only way to know for sure.",
        ],
      },
    ],
    sources: [
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
      { label: "Cleveland Clinic: Scoliosis", url: "https://my.clevelandclinic.org/health/diseases/15837-adult-scoliosis" },
      { label: "Mayo Clinic: Scoliosis, diagnosis and treatment", url: "https://www.mayoclinic.org/diseases-conditions/scoliosis/diagnosis-treatment/drc-20350721" },
    ],
  },
  {
    id: "myths",
    title: "Scoliosis myths, busted",
    category: "Basics",
    Icon: Lightbulb,
    intro: [
      "Scoliosis is common, which means almost everyone has heard something about it. A lot of what gets passed around is wrong, and some of it makes people feel guilty for things they had nothing to do with.",
      "Here are the myths we hear most often, and what the evidence says about each.",
    ],
    sections: [
      {
        question: "Can a heavy backpack cause scoliosis?",
        paragraphs: [
          "This is probably the most common myth, and no, it can't. Researchers have studied it directly. A study of nearly 1,000 Portuguese schoolchildren, and others in different countries, found no link between backpack weight and scoliosis. Heavy backpacks can make your back sore and tired, which is a good reason to use both straps and keep them reasonably light, but they don't bend the spine sideways.",
        ],
      },
      {
        question: "Does bad posture cause scoliosis?",
        paragraphs: [
          "No. Slouching doesn't cause scoliosis. A structural curve involves the bones themselves bending and twisting, and that doesn't come from how you sit at your desk. People with scoliosis didn't get it by slouching, and parents didn't cause it by not reminding them to sit up straight.",
          "Posture can make a back look a bit uneven in a photo, which is exactly why the forward bend test is used: it separates posture from real structural curves.",
        ],
      },
      {
        question: "Is scoliosis always painful?",
        paragraphs: [
          "Not at all. Most teens with mild or moderate scoliosis don't have pain from it. That's part of why screening exists, since curves can grow quietly. When a teen with scoliosis does have back pain, it's often from the same everyday causes other teens have, like muscle strain. Pain that's severe, wakes you at night or comes with numbness or weakness is a reason to see a doctor regardless.",
        ],
      },
      {
        question: "Will I need surgery?",
        paragraphs: [
          "Almost certainly not. Most people with scoliosis never need surgery. The majority of curves are mild and only need to be watched. A smaller group need a brace while they're growing, and only a small fraction end up with curves large enough for an operation.",
        ],
      },
      {
        question: "Can people with scoliosis play sports?",
        paragraphs: [
          "Yes. People with scoliosis play nearly every sport, including at the very highest level. The Olympic sprinter Usain Bolt has scoliosis. Doctors generally encourage staying active. The few limits that exist are usually temporary, like after surgery.",
        ],
      },
      {
        question: "Can a chiropractor straighten a curve?",
        paragraphs: [
          "There's no good evidence that spinal manipulation corrects scoliosis. Some people find it helps with general back discomfort, but it isn't a treatment for the curve itself, and it shouldn't replace a brace when one has been recommended.",
        ],
      },
      {
        question: "If it runs in my family, will I definitely get it?",
        paragraphs: [
          "No. Family history raises the odds, but most people with a parent or sibling who has scoliosis never develop it. And many people with scoliosis are the first in their family. The genetics article in this section goes into the numbers.",
        ],
      },
      {
        question: "Does a crooked-looking back always mean scoliosis?",
        paragraphs: [
          "Not necessarily. Uneven shoulders or hips can come from posture, how you're standing, a leg-length difference or even the camera angle. That's why ScoliScan treats its camera findings as clues, not answers, and why only a clinical exam and, if needed, an X-ray can tell for sure.",
        ],
      },
    ],
    sources: [
      { label: "KidsHealth (Nemours): Scoliosis", url: "https://kidshealth.org/en/teens/scoliosis.html" },
      { label: "Mayo Clinic: Scoliosis, symptoms and causes", url: "https://www.mayoclinic.org/diseases-conditions/scoliosis/symptoms-causes/syc-20350716" },
      { label: "AAOS OrthoInfo: Backpack safety", url: "https://www.orthoinfo.org/staying-healthy/backpack-safety" },
      { label: "Postural habits and weight of backpacks of Portuguese adolescents: are they associated with scoliosis and low back pain? (2016), Work", url: "https://journals.sagepub.com/doi/10.3233/WOR-162284" },
    ],
  },
  {
    id: "kyphosis",
    title: "Kyphosis and other spinal curves",
    category: "Basics",
    Icon: Waves,
    intro: [
      "Not every spinal curve is scoliosis. Seen from the side, every healthy spine has gentle curves: it rounds outward in the upper back and curves inward in the neck and lower back. Those curves are normal and help your spine absorb shock.",
      "Problems happen when these front-to-back curves become too large or too flat. The most common of these in teens is kyphosis, an exaggerated rounding of the upper back.",
    ],
    sections: [
      {
        question: "How is kyphosis different from scoliosis?",
        paragraphs: [
          "Scoliosis is a sideways curve, seen when looking at someone's back. Kyphosis is a forward rounding, seen when looking at someone from the side. A spine can have one, the other, or both. Doctors also use the word lordosis for an inward curve, like the natural curve of the lower back, which can sometimes be exaggerated too.",
          "Normal rounding of the upper back is roughly 20 to 45 degrees. Kyphosis usually refers to rounding beyond about 45 to 50 degrees.",
        ],
      },
      {
        question: "What is postural kyphosis?",
        paragraphs: [
          "This is the most common kind, and it's basically habitual slouching. The bones are normally shaped, but muscles and posture let the upper back round forward. It's common in teens, particularly during growth spurts, long hours on phones and computers, or when someone feels self-conscious about their height or chest.",
          "The key feature is that postural kyphosis is flexible. If the person stands up straight or lies flat on their back, the rounding goes away. It usually improves with strengthening exercises for the back and shoulders, and it doesn't cause long-term damage.",
        ],
      },
      {
        question: "What is Scheuermann's kyphosis?",
        paragraphs: [
          "Scheuermann's kyphosis, named after a Danish radiologist, is a structural condition in which several vertebrae in the upper back grow into a wedge shape, thicker at the back than at the front. On an X-ray, doctors diagnose it when at least three neighboring vertebrae are each wedged by 5 degrees or more.",
          "Unlike postural kyphosis, it doesn't straighten when you stand up tall. It often appears during the growth spurt and is more common in boys. It can cause an aching back, especially after activity, along with tight hamstrings. Some teens with Scheuermann's also have mild scoliosis.",
        ],
      },
      {
        question: "How is kyphosis treated?",
        paragraphs: [
          "Postural kyphosis is treated with exercise and awareness, not braces or surgery. Scheuermann's kyphosis is usually treated with physical therapy and, if the teen is still growing and the curve is large, sometimes a brace. Surgery is only considered for very large curves, usually beyond about 70 to 75 degrees, or for persistent pain that doesn't respond to other treatment.",
          "Very severe kyphosis, beyond about 100 degrees, can affect breathing in a similar way to severe scoliosis, but that's rare.",
        ],
      },
      {
        question: "Can ScoliScan detect kyphosis?",
        paragraphs: [
          "Not directly. ScoliScan's checks look for side-to-side asymmetry and twisting, which are signs of scoliosis. If your upper back looks very rounded, especially if it stays rounded when you try to stand up straight or it's painful, mention it to your doctor. A simple side-view exam and, if needed, an X-ray can tell the difference.",
        ],
      },
    ],
    sources: [
      { label: "AAOS OrthoInfo: Kyphosis (roundback) of the spine", url: "https://www.orthoinfo.org/diseases--conditions/kyphosis-roundback-of-the-spine" },
      { label: "MedlinePlus: Kyphosis", url: "https://medlineplus.gov/ency/article/001240.htm" },
      { label: "KidsHealth (Nemours): Kyphosis", url: "https://kidshealth.org/en/teens/kyphosis.html" },
    ],
  },
  {
    id: "genetics",
    title: "Does scoliosis run in families?",
    category: "Causes & risk",
    Icon: Dna,
    intro: [
      "If your mom, dad, brother or sister has scoliosis, you've probably wondered whether you'll get it too. It's a fair question, and the answer is more reassuring than you might think.",
      "Genes clearly play a part in the most common type of scoliosis, the kind that shows up in otherwise healthy kids around puberty. But no single gene causes it, having a relative with it doesn't mean you'll develop it, and plenty of people with scoliosis are the first in their family to have it.",
    ],
    sections: [
      {
        question: "How much does a family history raise my chances?",
        paragraphs: [
          "In the general population, roughly 1 to 3 out of every 100 teenagers have some degree of scoliosis, and most of those curves are mild. Among people with a parent, brother or sister who has it, the number goes up to around 11 out of 100. For more distant relatives the effect fades quickly: about 2 to 3 out of 100 for a grandparent, aunt or uncle, and close to the normal rate for a cousin.",
          "So a close relative with scoliosis roughly multiplies your odds several times over. That's a real difference. But flip it around: even with a parent or sibling who has it, about 9 out of 10 people never develop a curve.",
        ],
      },
      {
        question: "What have twins taught researchers?",
        paragraphs: [
          "Twins are a natural experiment. Identical twins share all their genes, while fraternal twins share about half, the same as any brother or sister. When researchers pooled twin studies, they found that if one identical twin had scoliosis, the other had it about 73% of the time. For fraternal twins, it was about 36%.",
          "That gap is strong evidence that genes matter. But look at the identical twins again: if genes were the whole story, the match would be 100%. It isn't. Something else, whether it's how a person grows, small differences in the body during development, or plain chance, also helps decide who ends up with a curve.",
        ],
      },
      {
        question: "Is there a \"scoliosis gene\"?",
        paragraphs: [
          "Not one, no. In 2011, a large study of Japanese patients found the first strong genetic link, near a gene called LBX1, which helps guide how certain nerve and muscle cells develop. Later studies confirmed the same link in Chinese, European and American groups. Since then, researchers have found dozens of other spots in our DNA that are linked to scoliosis.",
          "Each of these variants only nudges the risk a little. Scientists call this kind of condition \"polygenic,\" meaning many genes each contribute a small amount, the same way height works. That's also why there's no reliable genetic test for scoliosis today. One test was sold in the 2010s to predict whether curves would get worse, but when other research groups checked it, it didn't hold up.",
        ],
      },
      {
        question: "If nobody in my family has it, am I in the clear?",
        paragraphs: [
          "No, and this is the part people get wrong most often. Most kids diagnosed with scoliosis have no known relative with it. Sometimes a relative has a mild curve they never knew about. Sometimes the combination of genes just lines up in a new way. Either way, a clean family history lowers your odds a bit but doesn't rule anything out.",
        ],
      },
      {
        question: "What should I do if scoliosis runs in my family?",
        paragraphs: [
          "Mostly, just stay aware during your growth years, which is when curves appear and change. Tell your doctor about the family history at checkups so they know to look. Screening once or twice a year during puberty is a reasonable habit, and ScoliScan asks about family history for exactly this reason: when your results are borderline, a family history is one of the things that tips the balance toward a recheck or a doctor visit.",
          "If a parent had a curve that needed a brace or surgery, that's useful to mention too. It doesn't predict that your curve would behave the same way, but it helps your doctor decide how closely to watch.",
        ],
      },
    ],
    sources: [
      { label: "MedlinePlus Genetics: Adolescent idiopathic scoliosis", url: "https://medlineplus.gov/genetics/condition/adolescent-idiopathic-scoliosis/" },
      { label: "Takahashi et al. (2011), A genome-wide association study identifies common variants near LBX1 associated with adolescent idiopathic scoliosis, Nature Genetics", url: "https://www.nature.com/articles/ng.974" },
      { label: "Kesling & Reinker (1997), Scoliosis in twins: a meta-analysis of the literature and report of six cases, Spine", url: "https://pubmed.ncbi.nlm.nih.gov/9306532/" },
    ],
  },
  {
    id: "girls",
    title: "Why scoliosis affects girls more",
    category: "Causes & risk",
    Icon: Users,
    intro: [
      "You'll often hear that scoliosis is \"a girls' condition.\" That's only half true, and the half that's true is more interesting than it sounds.",
      "Boys and girls get small curves at nearly the same rate. The big difference is in which curves keep growing.",
    ],
    sections: [
      {
        question: "Do girls really get scoliosis more often?",
        paragraphs: [
          "For small curves, barely. Among teens with curves between 10 and 20 degrees, there are only about 1.4 girls for every boy. But as curves get larger, the gap widens dramatically. For curves over 40 degrees, the kind that may need surgery, girls outnumber boys by about 7 to 1.",
          "In other words, girls aren't just more likely to have scoliosis. Their curves are much more likely to get worse.",
        ],
      },
      {
        question: "Why would girls' curves get worse more often?",
        paragraphs: [
          "Nobody knows for sure, but there are a few leading ideas.",
          "The first is timing. Girls usually hit their growth spurt earlier than boys, around ages 10 to 12, and the spurt is fast. Curves tend to progress when the spine is growing quickly, so a fast, early spurt gives a curve more chance to worsen.",
          "Hormones may also play a part. Estrogen affects bone growth and how growth plates close, and some studies have looked at whether differences in how the body responds to estrogen affect the spine. Others have looked at a hormone called melatonin and at differences in body build. None of these explanations is settled.",
          "The honest answer is that it's probably a mix of growth timing, hormones and genes, and research is ongoing.",
        ],
      },
      {
        question: "Does that mean boys don't need to be screened?",
        paragraphs: [
          "No. Boys get scoliosis too, and because people assume it's rare in boys, their curves are sometimes noticed later. Boys also tend to keep growing into their later teens, so a curve can keep changing for longer.",
          "That's why medical groups recommend screening both. The Scoliosis Research Society and several American medical organizations suggest screening girls twice, at around 10 and 12, and boys once, at 13 or 14, to match when each typically grows fastest.",
        ],
      },
      {
        question: "Is there anything else that's different between boys and girls?",
        paragraphs: [
          "A few things. The most common curve pattern in both is a curve to the right in the upper back. In girls, a first period is a useful marker of where they are in their growth: most girls grow fastest in the year before their first period and do most of their remaining growth in the two years after. Doctors often ask about this because it helps them guess how much growing, and so how much chance for a curve to change, is left.",
          "Boys don't have a marker that clear, so doctors rely more on things like growth in height, voice changes and X-ray signs of bone maturity.",
        ],
      },
      {
        question: "What should I take from this?",
        paragraphs: [
          "If you're a girl going through puberty, it's a good time to keep an eye on your back, especially if scoliosis runs in your family. If you're a boy, don't assume it can't happen to you. In both cases, the growth spurt is the window that matters most.",
        ],
      },
    ],
    sources: [
      { label: "Konieczny et al. (2013), Epidemiology of adolescent idiopathic scoliosis, Journal of Children's Orthopaedics", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3566258/" },
      { label: "Healio (2016): Orthopedic, pediatric and scoliosis societies call for early scoliosis detection", url: "https://www.healio.com/news/orthopedics/20160114/orthopedic-pediatric-scoliosis-societies-call-for-early-scoliosis-detection" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
    ],
  },
  {
    id: "growth",
    title: "Growth spurts and curve progression",
    category: "Causes & risk",
    Icon: Ruler,
    intro: [
      "If there's one idea that explains most of how doctors think about scoliosis in teens, it's this: curves change while you're growing, and mostly settle down once you stop.",
      "That's why a 15-degree curve in an 11-year-old can be more concerning than a 25-degree curve in a 17-year-old. It's also why doctors ask so many questions about your height, your shoes getting tight and, for girls, your period.",
    ],
    sections: [
      {
        question: "Why does growth matter so much?",
        paragraphs: [
          "The spine grows from areas at the top and bottom of each vertebra called growth plates. In scoliosis, the spine is already slightly bent and twisted, so more weight presses on the inside of the curve. Pressure slows growth on that side, while the outside keeps growing normally. Over time the bones become a little wedge-shaped, and the curve deepens.",
          "When growth stops, that cycle mostly stops too. The faster and the longer you're still growing, the more chance a curve has to get worse.",
        ],
      },
      {
        question: "How likely is a mild curve to get worse?",
        paragraphs: [
          "The most famous study on this, by Lonstein and Carlson in 1984, followed 727 young people with untreated curves between 5 and 29 degrees. About 1 in 4 got worse overall. But the numbers depended hugely on two things: how big the curve was and how much growing the person had left.",
          "For kids with small curves (under 20 degrees) who still had lots of growing to do, about 1 in 5 got worse. For people with the same small curves who had nearly finished growing, it was fewer than 1 in 50. For curves of 20 to 29 degrees in kids who were still very immature, about 2 in 3 got worse.",
          "So a small curve in someone who's almost done growing usually stays small, and a moderate curve in someone at the start of puberty deserves close attention.",
        ],
      },
      {
        question: "How do doctors tell how much growing is left?",
        paragraphs: [
          "They use a few clues together. Age and height are the simplest. For girls, the timing of the first period helps a lot: girls grow fastest in the year or so before it and finish most of their growth about two years after.",
          "Doctors also look at the X-ray. The Risser sign looks at a strip of bone along the top of the pelvis that hardens gradually from one side to the other. It's graded from 0 to 5, where 0 means lots of growth left and 5 means growth is finished. The fastest growth happens before the Risser sign even starts to change, so a Risser 0 can mean someone is right in their peak growth period. Some doctors also look at the small bones of the hand, which mature in a predictable order.",
        ],
      },
      {
        question: "Do curves keep changing after I stop growing?",
        paragraphs: [
          "Usually only a little, and only if they're large. Curves under about 30 degrees at the end of growth rarely change much in adulthood. Curves over 50 degrees in the upper back tend to keep worsening slowly, often around a degree a year, and large lower-back curves can creep as well. That's one reason doctors usually recommend surgery for curves that are past about 45 to 50 degrees while a teen is still growing.",
        ],
      },
      {
        question: "What does this mean for screening?",
        paragraphs: [
          "It means timing matters. Screening is most useful just before and during the growth spurt, which for most girls is around 10 to 14 and for boys around 12 to 16. If you're in that window, scanning on a regular schedule makes sense, because that's when a curve is most likely to show up or change. If you notice you're growing fast, that's a good time to scan again.",
        ],
      },
    ],
    sources: [
      { label: "Lonstein & Carlson (1984), The prediction of curve progression in untreated idiopathic scoliosis during growth, Journal of Bone and Joint Surgery", url: "https://pubmed.ncbi.nlm.nih.gov/6480635/" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
      { label: "Weinstein et al. (2003), Health and function of patients with untreated idiopathic scoliosis: a 50-year natural history study, JAMA", url: "https://pubmed.ncbi.nlm.nih.gov/12578488/" },
    ],
  },
  {
    id: "early-onset",
    title: "Scoliosis in young children",
    category: "Causes & risk",
    Icon: Blocks,
    intro: [
      "Most scoliosis appears around the teenage growth spurt. But sometimes it shows up much earlier, in toddlers or even babies. Doctors call scoliosis that starts before age 10 \"early-onset scoliosis,\" and it's treated quite differently from the teen kind.",
      "If you have a younger brother or sister, or you're a parent reading this, here's what's different.",
    ],
    sections: [
      {
        question: "What causes scoliosis in young children?",
        paragraphs: [
          "Early-onset scoliosis has a wider range of causes than teen scoliosis. Some children have congenital scoliosis, where vertebrae formed unevenly before birth. Some have neuromuscular conditions, like cerebral palsy or spinal muscular atrophy. Some have a syndrome that affects connective tissue or bones. And some have idiopathic scoliosis, meaning no clear cause is found.",
          "Because the causes vary so much, young children with scoliosis are often checked more thoroughly, including an MRI of the spinal cord, which is more often abnormal in this age group than in teens.",
        ],
      },
      {
        question: "Can it go away on its own?",
        paragraphs: [
          "Sometimes, yes, and this is one of the biggest differences from teen scoliosis. A form that appears in babies under about a year old, often a curve to the left in the upper back, frequently goes away on its own as the child grows. In some studies, as many as 8 out of 10 of these curves resolved without treatment.",
          "Doctors can often tell which infant curves are likely to resolve by measuring a few angles on the X-ray. Curves that look likely to get better are simply watched.",
        ],
      },
      {
        question: "Why is early treatment so important?",
        paragraphs: [
          "Because of the lungs. A child's lungs keep adding new air sacs, mostly until around age 8, and they need room in the chest to do that. A large curve in a young child can squash the rib cage and limit how the lungs develop, which can affect breathing for life. So the goal is not only to control the curve, but to keep the chest growing as normally as possible.",
        ],
      },
      {
        question: "How is it treated?",
        paragraphs: [
          "For curves that are getting worse, a common first step in young children is casting. Under anesthesia, the child's spine is gently stretched and rotated into a better position, and a custom plaster or fiberglass cast is applied around the trunk. This is often called Mehta casting, after Min Mehta, the British surgeon who showed how well it can work in very young children. The cast is changed every few months as the child grows. In some young children, especially when started early, serial casting can substantially correct the curve. In others, it buys time. Braces may be used after casting.",
        ],
      },
      {
        question: "What about surgery?",
        paragraphs: [
          "In young children, doctors try hard to avoid fusing the spine, because fusion stops that part from growing and can limit chest and lung development. Instead, if surgery is needed, they often use \"growing\" systems: rods attached above and below the curve that can be lengthened as the child grows.",
          "Traditional growing rods need a short operation every six months or so to lengthen them. Newer magnetic rods can be lengthened in a clinic visit using a magnet held outside the body, with no surgery. These systems have their own complications and sometimes need replacing, and many children eventually have a fusion once they're older. But they let the spine and chest keep growing in the meantime.",
        ],
      },
      {
        question: "What should parents look for?",
        paragraphs: [
          "In babies and young children, signs can include a curve in the back when the child is lying on their tummy, uneven shoulders or hips, a rib cage that looks different on one side, or the child consistently leaning to one side. If you notice any of these, or if your child has a condition that's linked to scoliosis, mention it to their pediatrician. Early checks matter more in this age group, not less.",
        ],
      },
    ],
    sources: [
      { label: "Children's Hospital Colorado: Early onset scoliosis", url: "https://www.childrenscolorado.org/conditions-and-advice/conditions-and-symptoms/conditions/early-onset-scoliosis/" },
      { label: "Mehta (2005), Growth as a corrective force in the early treatment of progressive infantile scoliosis, Journal of Bone and Joint Surgery British", url: "https://boneandjoint.org.uk/Article/10.1302/0301-620X.87B9.16124" },
    ],
  },
  {
    id: "bracing-evidence",
    title: "Do braces actually work?",
    category: "Treatment",
    Icon: Shield,
    intro: [
      "For a long time, this was a genuinely open question. Braces had been used for centuries, but nobody had run a careful trial comparing teens who wore one with teens who didn't. Some doctors were convinced braces helped. Others thought curves were going to do what they were going to do anyway.",
      "In 2013, a large study finally gave a clear answer, and it changed how doctors talk about bracing.",
    ],
    sections: [
      {
        question: "What did the big study find?",
        paragraphs: [
          "The study is called BrAIST, short for the Bracing in Adolescent Idiopathic Scoliosis Trial. It followed 383 teens at 25 hospitals in the US and Canada. All of them were still growing and had curves between 20 and 40 degrees, the range where a curve has a real chance of getting worse. Some were randomly assigned to wear a brace or not; others chose for themselves.",
          "The goal was to see who reached 50 degrees, the point where surgery is usually recommended. Among those who wore a brace, 72% avoided reaching that point. Among those who didn't, only 48% did. The difference was so clear that the study was stopped early, since it no longer seemed fair to keep teens out of bracing.",
        ],
      },
      {
        question: "Does it matter how many hours I wear it?",
        paragraphs: [
          "A lot. The braces in BrAIST had small temperature sensors inside, so researchers could see how long each teen actually wore theirs, rather than relying on what they said. Teens who wore the brace for about 13 hours a day or more had success rates of around 90%. Teens who wore it for only a few hours a day did about the same as teens with no brace at all.",
          "That's the most practical takeaway from the research: a brace works if you wear it. It's not something to do halfway.",
        ],
      },
      {
        question: "Does a brace straighten the spine?",
        paragraphs: [
          "Usually not, and this surprises people. The main job of a brace is to stop a curve from getting worse while you're growing. It does that by pushing on the curve from the outside, so the spine grows in a straighter position than it otherwise would. Most people end bracing with a curve close to where they started. That counts as a success, because the alternative was often a curve that kept growing.",
          "Some modern braces do produce some correction while they're being worn, and a small amount sometimes lasts, but it's best to go in expecting a brace to hold the line rather than reverse the curve.",
        ],
      },
      {
        question: "If braces work, why doesn't everyone with scoliosis wear one?",
        paragraphs: [
          "Because most curves don't need one. Bracing is only useful while you're still growing, and only for curves that are big enough to be at real risk, usually starting around 25 degrees, sometimes 20 if a curve is getting worse quickly. Small curves are usually just watched with occasional checkups.",
          "BrAIST also showed something on the other side: about 4 in 10 teens who wore their brace very little still didn't reach 50 degrees. Some curves don't progress no matter what. Doctors can't yet predict perfectly which curves will, so bracing is offered to the group at highest risk.",
        ],
      },
      {
        question: "What happens once I stop growing?",
        paragraphs: [
          "Bracing usually ends when growth is finished, judged by your height leveling off, your age, X-ray signs of bone maturity and, for girls, about two years after a first period. After that, most braced curves stay fairly stable. Your doctor will usually keep checking for a while to make sure.",
        ],
      },
    ],
    sources: [
      { label: "Weinstein et al. (2013), Effects of bracing in adolescents with idiopathic scoliosis, New England Journal of Medicine", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1307337" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
    ],
  },
  {
    id: "brace-life",
    title: "Living with a brace",
    category: "Treatment",
    Icon: Shirt,
    intro: [
      "Hearing that you need a brace can feel like a lot, especially when you learn it might be for many hours a day for a couple of years. Almost everyone feels awkward at first. Most also find that, after the first few weeks, the brace becomes part of the routine in a way they didn't expect.",
      "This article covers the practical side: what it feels like, how to get used to it, and how to look after your skin and your brace.",
    ],
    sections: [
      {
        question: "What kinds of braces are there?",
        paragraphs: [
          "Most teens with scoliosis wear a TLSO, which stands for thoraco-lumbo-sacral orthosis. That's a rigid plastic shell that fits around your torso from under the arms to the hips. The Boston brace is a well-known example. These are usually worn somewhere between 16 and 23 hours a day, depending on what your doctor recommends.",
          "Some curves can be treated with a night-time brace instead, such as the Providence or Charleston brace. These hold the spine in a more corrected, often slightly bent position, and are only worn while you sleep. They aren't right for every curve, so it's a conversation to have with your doctor.",
        ],
      },
      {
        question: "How do I get used to wearing it?",
        paragraphs: [
          "Gradually. Most brace teams give you a \"break-in\" schedule, where you wear it for a few hours on the first day and build up over about one to two weeks until you reach your full hours. Sleeping in it is usually the last step and the hardest for many people.",
          "It will feel stiff and strange at first, and you may notice it most when sitting, bending down or eating a big meal. That usually eases as your body gets used to it. If something actually hurts, rather than just feeling tight, tell your brace maker (called an orthotist). A small adjustment often fixes it.",
        ],
      },
      {
        question: "How do I take care of my skin?",
        paragraphs: [
          "Wear a thin, snug, seamless cotton tank top or a special brace shirt underneath. It should be long enough to tuck in so it doesn't wrinkle, because wrinkles press into your skin. Put your underwear on over the brace, not under it, for the same reason.",
          "Some redness where the brace presses is normal and should fade within about 30 minutes after you take it off. If you see blisters, open sores or red spots that don't fade, call your orthotist. Wash and dry your skin daily, and avoid putting lotion or powder under the brace unless your team suggests it, since it can soften the skin and make it more likely to break down. Rubbing alcohol on pressure spots is sometimes recommended to toughen the skin, but check with your team first.",
        ],
      },
      {
        question: "What about clothes, school and sports?",
        paragraphs: [
          "Slightly looser tops, layers, hoodies and higher-waisted pants hide most underarm braces well. Many teens find that classmates don't notice, or notice once and then forget. You decide who you tell.",
          "Most doctors want you to keep doing sports and exercise, often with the brace off during the activity. Staying active keeps your back and core muscles strong. Ask your team which activities they'd like you to do in or out of the brace, and remember that time out of the brace counts against your daily hours.",
        ],
      },
      {
        question: "How do I keep it clean?",
        paragraphs: [
          "Wipe the inside every day with a damp cloth or a little rubbing alcohol, and wash it more thoroughly once a week with mild soap and water. Let it air-dry before putting it back on. Don't use a hair dryer or leave it in a hot car, since heat can warp the plastic.",
        ],
      },
      {
        question: "What if I'm finding it really hard?",
        paragraphs: [
          "You're not alone, and it's okay to say so. Wearing a brace affects how you feel about your body, and studies show that many braced teens find it stressful. Talk to your parents, your doctor or your brace team. Some hospitals have support groups or can put you in touch with other teens who've been through it. Getting support isn't giving up on the brace. It often makes it easier to keep going.",
        ],
      },
    ],
    sources: [
      { label: "Scottish Rite for Children: Scoliosis care", url: "https://scottishriteforchildren.org/services/scoliosis/" },
      { label: "Nationwide Children's Hospital: Scoliosis, wearing a brace", url: "https://www.nationwidechildrens.org/family-resources-education/health-wellness-and-safety-resources/helping-hands/scoliosis-wearing-a-brace" },
      { label: "AboutKidsHealth (SickKids): Scoliosis, caring for a spinal brace", url: "https://aboutkidshealth.ca/scoliosis-caring-for-a-spinal-brace-orthosis" },
    ],
  },
  {
    id: "fusion",
    title: "What spinal fusion surgery involves",
    category: "Treatment",
    Icon: Hospital,
    intro: [
      "Only a small fraction of people with scoliosis ever need surgery. But if it's recommended for you or someone you know, it helps to understand what happens, because the reality is usually less frightening than people imagine.",
      "Spinal fusion is the most common and best-studied surgery for scoliosis, and it has been refined over more than 60 years.",
    ],
    sections: [
      {
        question: "When is surgery recommended?",
        paragraphs: [
          "Usually when a curve reaches about 45 to 50 degrees, especially while a teen is still growing. Curves that large tend to keep getting worse slowly even after growth ends, and correcting them in the teen years is generally easier and safer than waiting until adulthood. Surgery may also be considered for curves that are progressing quickly despite a brace.",
          "It's a decision made together with your family and your surgeon. It's almost never an emergency, so there's time to ask questions and get a second opinion if you want one.",
        ],
      },
      {
        question: "What happens during the operation?",
        paragraphs: [
          "The surgeon attaches screws to several vertebrae in the curved part of the spine, then connects them to two metal rods. The rods are used to straighten and untwist the spine, and then locked in place. Bone graft, either from the patient or from a donor bank, is placed along the spine. Over the following months, the vertebrae grow together into one solid section of bone. That's the \"fusion.\"",
          "The rods hold everything in position while the fusion heals. They usually stay in for life and aren't removed. The operation typically takes several hours, and you're under general anesthesia the whole time.",
        ],
      },
      {
        question: "What is recovery like?",
        paragraphs: [
          "Most teens are helped out of bed and walking within a day or two. A typical hospital stay is about three to five days. Pain is managed with medicine, and the first week or two at home is mostly rest, short walks and gradually doing more.",
          "Many teens are back at school within about four to six weeks, though some ease in with half days. Hospitals vary in how quickly they clear people for exercise. In one large children's hospital, teens returned to non-contact sports at a median of about two months, and to contact sports at about four to five months. Most are cleared for all activities within a year.",
        ],
      },
      {
        question: "Will I be able to bend and move normally?",
        paragraphs: [
          "Mostly, yes. The fused section no longer bends, but the rest of your spine, your hips and your neck still move, so most everyday bending is unaffected. If the fusion extends far into the lower back, you may notice a bit less flexibility when bending forward. Many people who've had fusion go on to play sports, dance, travel and have children.",
        ],
      },
      {
        question: "Are there risks?",
        paragraphs: [
          "Like any major operation, yes. Possible problems include infection, bleeding, issues with the screws or rods that need another surgery, and, rarely, nerve injury. Surgeons monitor the spinal cord throughout the operation to lower that risk. Your surgical team can give you the specific numbers for their hospital, and it's completely reasonable to ask.",
          "It's also normal to feel nervous. Asking to talk to another teen who has had the surgery, or reading about other people's experiences from trustworthy hospitals, can help a lot.",
        ],
      },
    ],
    sources: [
      { label: "AAOS OrthoInfo: Spinal fusion", url: "https://www.orthoinfo.org/treatment/spinal-fusion" },
      { label: "Children's Hospital Colorado: Return to play after posterior spine fusion", url: "https://www.childrenscolorado.org/advances-answers/recent-articles/return-to-play-after-posterior-spine-fusion/" },
    ],
  },
  {
    id: "tethering",
    title: "Tethering and newer surgical options",
    category: "Treatment",
    Icon: Link,
    intro: [
      "For decades, spinal fusion was essentially the only surgery for scoliosis in teens. It works well, but it permanently stiffens part of the spine. In recent years, surgeons have been developing options that aim to correct the curve while keeping more movement.",
      "The best known is vertebral body tethering. It's promising, but it's newer, and the long-term picture is still coming into focus.",
    ],
    sections: [
      {
        question: "What is vertebral body tethering?",
        paragraphs: [
          "In tethering, the surgeon places a screw into each vertebra along the outer side of the curve, then connects the screws with a strong, flexible cord, a bit like lacing a shoe. The cord is pulled snug, which straightens the spine partway during surgery.",
          "The clever part is what happens next. In a growing spine with scoliosis, the inside of the curve grows more slowly than the outside, which is part of why curves get worse. The tether flips this around by squeezing the outside of the curve, slowing growth there while the inside catches up. Over time, if things go as planned, the spine grows straighter on its own. This approach is called \"growth modulation.\"",
        ],
      },
      {
        question: "Who is it for?",
        paragraphs: [
          "Because tethering relies on the spine still growing, it's mainly an option for kids and teens who have a fair amount of growth left and a curve that's large enough to need surgery but still somewhat flexible. It isn't usually offered to people who have finished growing.",
          "In the US, the FDA approved the first tethering device in 2019 under a special pathway for devices treating small numbers of patients, based on results in 57 patients. It's now offered at many children's hospitals.",
        ],
      },
      {
        question: "What are the advantages?",
        paragraphs: [
          "The main appeal is that the spine isn't fused, so it keeps more of its natural flexibility. Early results show that many patients end up with good correction and avoid fusion. The surgery is also often done through small incisions using a camera.",
        ],
      },
      {
        question: "What are the downsides?",
        paragraphs: [
          "Tethering is less predictable than fusion. Sometimes the spine keeps growing straighter past the goal and overcorrects. Sometimes the cord breaks, which was seen in roughly a quarter to a third of patients in some multicenter studies, though not every break causes a problem. A fair number of patients, around 1 in 4 in longer-term studies, need a second operation, and some eventually have a fusion anyway.",
          "Because the technique is relatively new, there's much less long-term data than there is for fusion, which has been studied for over half a century. Most surgeons still consider fusion the gold standard and tethering a good option for carefully chosen patients.",
        ],
      },
      {
        question: "Are there other newer options?",
        paragraphs: [
          "For young children with early-onset scoliosis, surgeons use \"growing rods\" that are lengthened as the child grows, and some versions can be lengthened with a magnet from outside the body, avoiding repeat operations. Those are covered in the early-onset article. For teens, researchers are also studying other non-fusion approaches, but these are mostly still being evaluated.",
        ],
      },
      {
        question: "How do I know which surgery is right?",
        paragraphs: [
          "It depends on how much growing is left, the size and flexibility of the curve, and what matters most to you and your family. If surgery is recommended, it's worth asking your surgeon whether tethering is an option, why or why not, and how many of these operations they've done.",
        ],
      },
    ],
    sources: [
      { label: "U.S. FDA (2019): FDA approves first of its kind device to treat pediatric patients with progressive idiopathic scoliosis", url: "https://www.fda.gov/news-events/press-announcements/fda-approves-first-its-kind-device-treat-pediatric-patients-progressive-idiopathic-scoliosis" },
      { label: "Vertebral body tethering for idiopathic scoliosis: a systematic review and meta-analysis (2023)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10587225/" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
    ],
  },
  {
    id: "exercise",
    title: "Can exercise treat scoliosis?",
    category: "Treatment",
    Icon: Dumbbell,
    intro: [
      "If you search online for scoliosis, you'll quickly find exercise programs promising to straighten your spine. Some of them come with impressive before-and-after photos. It's natural to hope that the right stretches could make a curve go away.",
      "The real picture is more modest, but it's not discouraging. Exercise is good for people with scoliosis. The question is what it can and can't do to the curve itself.",
    ],
    sections: [
      {
        question: "What are scoliosis-specific exercises?",
        paragraphs: [
          "These are exercise programs designed for a person's particular curve, usually taught by a specially trained physical therapist. The best known is the Schroth method, developed in Germany in the 1920s, which uses specific postures, breathing techniques and muscle activation to try to \"de-rotate\" the spine. Others include SEAS, from Italy. They're sometimes grouped under the name PSSE, for physiotherapeutic scoliosis-specific exercises.",
          "They're different from general exercise like swimming or yoga, which are great for overall health but aren't aimed at the curve.",
        ],
      },
      {
        question: "What does the research say?",
        paragraphs: [
          "The most careful review of the evidence comes from Cochrane, a group known for strict, independent analysis. Their 2024 update concluded that the benefits of exercise for scoliosis are still unclear. Compared with no treatment, exercise may make little or no difference to whether a curve gets worse, but it may slightly improve quality of life. When exercise was added to bracing, it may have reduced the curve by around 2 degrees on average, which is smaller than the usual margin of error when measuring a curve on an X-ray. The researchers rated the certainty of all these findings as low.",
          "That doesn't mean exercise is useless. It means the studies so far are small and mixed, and no exercise program has been shown to reliably stop or reverse a curve the way bracing has.",
        ],
      },
      {
        question: "Is exercise worth doing, then?",
        paragraphs: [
          "Yes, for different reasons. Strong back and core muscles can help with comfort, posture and confidence, and some people with scoliosis find a Schroth-style program helps them feel more in control. Being active also supports your bones, your heart and your mood, which matters whether or not you have a curve.",
          "What to avoid is using exercise instead of a brace when a brace has been recommended. For a curve at real risk of getting worse, bracing is the treatment with the strongest evidence behind it. Exercise can go alongside it.",
        ],
      },
      {
        question: "How can I spot an exaggerated claim?",
        paragraphs: [
          "Be cautious with programs that promise to \"cure\" scoliosis, that say you'll never need a brace or surgery, that ask for large payments up front, or that show dramatic photos without X-rays. A photo can change a great deal just from posture, lighting and how someone stands. Good therapists will talk about goals like strength, posture and comfort, and will be honest about what the research shows.",
        ],
      },
      {
        question: "Are there exercises I shouldn't do?",
        paragraphs: [
          "For most people with scoliosis, almost all sports and exercise are fine. If you've had surgery or have a large curve, your doctor may give you specific limits for a while. If anything causes pain, especially pain that sticks around, stop and check with a doctor or physical therapist.",
        ],
      },
    ],
    sources: [
      { label: "Cochrane (2024), Therapeutic exercises for idiopathic scoliosis in adolescents", url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007837.pub3/information" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
      { label: "Scoliosis Research Society: Adolescent idiopathic scoliosis, a handbook for patients", url: "https://www.srs.org/Files/Patient-Brochures/Patient.Adolescent_Idiopathic_Scoliosis_Handbook_for_Patients.pdf" },
    ],
  },
  {
    id: "sports",
    title: "Sports, exercise and scoliosis",
    category: "Everyday life",
    Icon: Trophy,
    intro: [
      "One of the first worries many people have after a scoliosis diagnosis is whether they'll have to give up the things they love doing. For the vast majority, the answer is no.",
      "Doctors generally encourage people with scoliosis to stay active, and people with scoliosis compete in almost every sport there is, at every level.",
    ],
    sections: [
      {
        question: "Can I keep playing my sport?",
        paragraphs: [
          "Almost certainly. Mild and moderate scoliosis doesn't usually limit what you can do, and there's no good evidence that sports make a curve worse. Staying active helps keep your back and core strong, supports bone health and is good for your mood, all of which matter when you're dealing with a diagnosis.",
          "If you wear a brace, most doctors are happy for you to take it off for sports and put it back on afterward. Some activities can even be done in the brace. Just remember that time out of the brace counts against your daily total, so talk with your team about how to fit it in.",
        ],
      },
      {
        question: "Are there famous athletes with scoliosis?",
        paragraphs: [
          "Yes, and some of them are among the best ever. Usain Bolt, the fastest sprinter in history, has scoliosis. He has said in interviews that keeping his core and back strong is what stops it from bothering him, and he has talked openly about back stiffness causing him hamstring trouble at times. Plenty of professional swimmers, gymnasts, golfers and dancers have scoliosis too. A curved spine didn't stop them from reaching the top.",
        ],
      },
      {
        question: "Do some sports cause scoliosis?",
        paragraphs: [
          "Scoliosis does show up more often in some groups, such as rhythmic gymnasts and ballet dancers. But that doesn't mean the activity caused it. Researchers think a few other things explain it. These sports tend to attract very flexible people, and having very loose joints is itself linked to scoliosis. Dancers and gymnasts also tend to be lean and may start puberty later, which affects how and when the spine grows.",
          "So the sport is probably attracting people who were already more likely to have scoliosis, rather than causing it. That said, if you're in one of these sports and growing fast, it's a good idea to get checked regularly.",
        ],
      },
      {
        question: "Are there activities I should avoid?",
        paragraphs: [
          "For most people with scoliosis, nothing is off-limits. After spinal fusion surgery, there will be a period of recovery with restrictions, usually lifting gradually over months. Some surgeons advise caution with a few high-impact or collision sports after fusion, but many people return to them. If you have a very large curve, your doctor may give you specific advice.",
          "The more useful rule is simple: if an activity causes pain that doesn't go away, or pain with numbness, tingling or weakness, stop and get it checked.",
        ],
      },
      {
        question: "What kinds of exercise help most?",
        paragraphs: [
          "Anything you'll actually keep doing is a good start. Swimming, cycling, running, team sports and dance all have benefits. Exercises that strengthen your core and back muscles, like planks, bridges and careful weight training, can help with comfort and endurance. If you'd like a program aimed at your particular curve, a physical therapist with scoliosis training can help, though it's best to see that as a support for your health rather than a cure for the curve.",
        ],
      },
    ],
    sources: [
      { label: "Scoliosis Research Society: Adolescent idiopathic scoliosis, a handbook for patients", url: "https://www.srs.org/Files/Patient-Brochures/Patient.Adolescent_Idiopathic_Scoliosis_Handbook_for_Patients.pdf" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
      { label: "KidsHealth (Nemours): Scoliosis", url: "https://kidshealth.org/en/teens/scoliosis.html" },
    ],
  },
  {
    id: "body-image",
    title: "Scoliosis, body image and how you feel",
    category: "Everyday life",
    Icon: HeartHandshake,
    intro: [
      "Scoliosis is usually talked about in degrees, X-rays and brace hours. But for a lot of people, the hardest part isn't physical at all. It's how it makes them feel about their body, or how they think other people see them.",
      "If that's you, those feelings are real, they're common and they're worth taking seriously.",
    ],
    sections: [
      {
        question: "Is it normal to feel self-conscious?",
        paragraphs: [
          "Very. Research on teens with scoliosis consistently finds that body image is the area most affected. People notice things like one shoulder sitting higher, a hip that sticks out, clothes fitting unevenly, or a rib hump when they bend. Others worry about a brace showing, or about scars after surgery.",
          "These worries tend to hit hardest during the teen years, when almost everyone is already sensitive about how they look. Scoliosis can add a layer on top of that. Studies of braced teens in particular often find more worry about self-image and social situations, and in some studies around a third of teens reported a level of distress that called for extra support.",
        ],
      },
      {
        question: "Does scoliosis affect mental health more broadly?",
        paragraphs: [
          "The evidence is mixed. Some studies find higher rates of anxiety or low mood in teens with scoliosis, while others find little difference from their peers. What does seem clear is that how a person feels about their body, how much support they have, and how their treatment is going all play a big role.",
          "In other words, scoliosis doesn't automatically cause mental health problems, but it can be a real source of stress, and stress deserves attention.",
        ],
      },
      {
        question: "What can help?",
        paragraphs: [
          "Talking about it is a good start, whether that's with a parent, a friend, your doctor or a counselor. You don't need to have a \"serious\" problem to deserve support.",
          "It can also help to connect with other people who have scoliosis. Many hospitals and charities run support groups, and online communities can show you how many people are living full, ordinary lives with it. Seeing someone else in a brace, or with a fusion scar, can make your own situation feel a lot less lonely.",
          "Practical things help too. Finding clothes that you feel comfortable in, especially if you wear a brace, can make a big difference. So can staying active in things you enjoy, since exercise is good for mood and confidence.",
        ],
      },
      {
        question: "What if I'm struggling more than that?",
        paragraphs: [
          "If you're feeling down most days, losing interest in things you used to enjoy, avoiding friends or school, or having thoughts of hurting yourself, please tell an adult you trust or a doctor as soon as you can. These feelings can get better with the right help. If you're in the US, you can call or text 988 any time to reach the Suicide and Crisis Lifeline.",
        ],
      },
      {
        question: "How can parents and friends help?",
        paragraphs: [
          "Mostly by listening without trying to fix everything, and by not making the curve the center of every conversation. Remarks like \"stand up straight\" can sting when someone's back is curved by their bones, not their effort. Helping with the practical parts, like brace routines and appointments, while letting the person keep control over who they tell and what they share, goes a long way.",
        ],
      },
    ],
    sources: [
      { label: "Scoliosis Research Society: Adolescent idiopathic scoliosis, a handbook for patients", url: "https://www.srs.org/Files/Patient-Brochures/Patient.Adolescent_Idiopathic_Scoliosis_Handbook_for_Patients.pdf" },
      { label: "988 Suicide and Crisis Lifeline", url: "https://988lifeline.org/" },
      { label: "KidsHealth (Nemours): Scoliosis", url: "https://kidshealth.org/en/teens/scoliosis.html" },
    ],
  },
  {
    id: "back-pain",
    title: "Back pain and scoliosis",
    category: "Everyday life",
    Icon: Bone,
    intro: [
      "For a long time, doctors taught that scoliosis in teens doesn't cause pain, and that a teen with scoliosis and back pain must have something else going on. We now know that's an oversimplification. Back pain is fairly common in teens with scoliosis, and usually it isn't a sign of anything serious.",
      "But some kinds of back pain do need checking, whatever the cause.",
    ],
    sections: [
      {
        question: "Does scoliosis cause back pain?",
        paragraphs: [
          "Sometimes. In one large study of over 2,400 teens with idiopathic scoliosis, about 1 in 4 had back pain when they were first seen, and roughly another 1 in 10 developed it later. In fewer than 1 in 10 of the teens with pain did doctors find another underlying cause.",
          "Teens with scoliosis seem to have back pain somewhat more often than teens without it. But back pain is common in all teenagers. Depending on the study, somewhere between 1 in 8 and 1 in 3 report having it at any given time, often from sports, posture, bags, long hours of sitting, or simply growing.",
        ],
      },
      {
        question: "What does typical scoliosis-related pain feel like?",
        paragraphs: [
          "Usually it's an ache or tiredness in the muscles of the back, often after standing, sitting or exercising for a long time, and it gets better with rest, stretching or simple pain relief. It doesn't usually stop you from doing normal activities.",
        ],
      },
      {
        question: "Which kinds of back pain need a doctor?",
        paragraphs: [
          "Some features are warning signs, and they matter whether or not you have scoliosis. See a doctor soon if your back pain:",
        ],
        bullets: [
          "Wakes you up at night, or is worse at night",
          "Has lasted for weeks and keeps getting worse",
          "Is bad enough to stop you from doing normal things",
          "Comes with numbness, tingling or weakness in your legs",
          "Comes with changes in bladder or bowel control",
          "Comes with fever, weight loss or feeling generally unwell",
          "Started after an injury or a fall",
        ],
        closing: [
          "Pain like this can point to other conditions, such as a stress fracture, an infection, an inflamed joint or, rarely, something affecting the spinal cord. Most of these are very treatable, but they need to be looked at. If you have weakness in the legs or bladder or bowel changes, get help urgently.",
        ],
      },
      {
        question: "Why does ScoliScan ask about back pain?",
        paragraphs: [
          "Because pain is important, but it isn't a good way to screen for scoliosis. Many people with significant curves have no pain at all, and many people with pain have straight spines. So the app keeps pain separate from its scoliosis result. If you say you have frequent or night-time back pain, it suggests seeing a doctor about the pain itself, whatever the scan shows.",
        ],
      },
      {
        question: "What helps with everyday back pain?",
        paragraphs: [
          "For ordinary aches, staying active usually helps more than resting in bed. Core and back strengthening, regular breaks from sitting, keeping your backpack light and using both straps, and getting enough sleep all make a difference. A physical therapist can put together a plan if pain keeps coming back.",
        ],
      },
    ],
    sources: [
      { label: "Adolescent idiopathic scoliosis and back pain (research review)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5016859/" },
      { label: "Bernstein & Cozen (2007), Evaluation of back pain in children and adolescents, American Family Physician", url: "https://www.aafp.org/pubs/afp/issues/2007/1201/p1669.html" },
      { label: "KidsHealth (Nemours): Scoliosis", url: "https://kidshealth.org/en/teens/scoliosis.html" },
    ],
  },
  {
    id: "lungs-heart",
    title: "How scoliosis can affect breathing",
    category: "Everyday life",
    Icon: Wind,
    intro: [
      "Your spine and your rib cage are joined together, so when the spine curves and twists in the upper back, the ribs move with it. That's why people sometimes hear that scoliosis can affect the lungs or heart.",
      "It's true, but only for very large curves, and it's much rarer than many people fear.",
    ],
    sections: [
      {
        question: "Do most curves affect breathing?",
        paragraphs: [
          "No. Mild and moderate curves, which make up most cases, don't measurably affect breathing. You can play sports, sing, play a wind instrument and do anything else that takes a lot of breath.",
          "Curves in the lower back, called lumbar curves, don't affect breathing at all, because they're below the rib cage.",
        ],
      },
      {
        question: "When does a curve start to matter?",
        paragraphs: [
          "In the upper back, curves start to reduce lung capacity noticeably at around 70 degrees, and serious breathing problems usually only happen with curves around 100 degrees or more. Curves that large are now uncommon in teens, largely because screening, bracing and surgery catch and treat them earlier.",
          "In very large curves, the rib cage on one side is squashed and the other side stretched, so the lungs can't expand evenly. Breathing muscles have to work harder. Over many years, in the most severe cases, this can strain the right side of the heart, which pumps blood through the lungs.",
        ],
      },
      {
        question: "Does age matter?",
        paragraphs: [
          "A lot. The lungs keep developing through early childhood, adding most of their new air sacs before about age 8. A large curve that develops in a very young child can limit how the lungs grow in the first place, which is why early-onset scoliosis in young children is treated differently and more carefully. In teens, the lungs are already well developed, so a curve mainly affects how much the rib cage can expand, not how the lungs themselves form.",
        ],
      },
      {
        question: "What did long-term studies find?",
        paragraphs: [
          "In the 50-year study of untreated scoliosis from Iowa, shortness of breath during everyday activity was only slightly more common in people with scoliosis than in those without, 22% compared with 15%. It was linked mostly to large upper-back curves, especially those over about 80 degrees. Overall, life expectancy was the same as in people without scoliosis.",
        ],
      },
      {
        question: "Does surgery help breathing?",
        paragraphs: [
          "For very large curves, surgery mainly prevents breathing from getting worse rather than dramatically improving it. That's one reason doctors recommend surgery for curves that are past about 45 to 50 degrees while they're still manageable, rather than waiting until they're large enough to affect the lungs.",
        ],
      },
      {
        question: "What should I watch for?",
        paragraphs: [
          "If you have scoliosis and notice that you get out of breath much more easily than your friends, or that it's getting worse over time, mention it to your doctor. They can do a simple breathing test. And not smoking or vaping is one of the best things anyone with a curve in the upper back can do for their lungs.",
        ],
      },
    ],
    sources: [
      { label: "Weinstein et al. (2003), Health and function of patients with untreated idiopathic scoliosis: a 50-year natural history study, JAMA", url: "https://pubmed.ncbi.nlm.nih.gov/12578488/" },
      { label: "Pulmonary function in children with idiopathic scoliosis (research review)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3410782/" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
    ],
  },
  {
    id: "adults",
    title: "Scoliosis in adulthood",
    category: "Later in life",
    Icon: Hourglass,
    intro: [
      "Most scoliosis information is aimed at teens, so it's easy to wonder what happens later. Will a curve cause problems at 40, or 70? Can scoliosis start in adulthood?",
      "The good news is that people with scoliosis generally live long, normal, productive lives. But there are a few things to know.",
    ],
    sections: [
      {
        question: "What happens to teen scoliosis in adulthood?",
        paragraphs: [
          "The best evidence comes from a study in Iowa that followed people with untreated scoliosis for about 50 years. Researchers compared 117 people with scoliosis to 62 people without it, most of them in their sixties by the end.",
          "They found no difference in life expectancy. People with scoliosis were just as likely to be working, married and living full lives. They did report more back pain, about 61% compared with 35%, but most described it as mild or moderate. Shortness of breath was a little more common too, 22% compared with 15%, and was mostly linked to very large upper-back curves. People with scoliosis were also more likely to be unhappy with how their back looked.",
          "So adulthood with scoliosis usually looks like adulthood without it, with a somewhat higher chance of back aches.",
        ],
      },
      {
        question: "Do curves keep changing in adults?",
        paragraphs: [
          "Small curves generally don't. Curves under about 30 degrees at the end of growth tend to stay stable for life. Larger curves can keep creeping slowly. Upper-back curves over 50 degrees often worsen by around a degree a year, and large lower-back curves can also progress, sometimes speeding up later in life as the discs wear. That's one reason adults with bigger curves are often asked to come back for occasional X-rays.",
        ],
      },
      {
        question: "Can scoliosis start in adulthood?",
        paragraphs: [
          "Yes. This is called degenerative, or \"de novo,\" scoliosis, and it's surprisingly common in older adults. It isn't the same condition as teen scoliosis. As discs and joints in the lower back wear down with age, they can wear unevenly, letting the spine tip and twist to one side. In one study of volunteers over 60, more than two-thirds had at least a small curve. Most never knew, because most of these curves cause no trouble.",
          "When degenerative scoliosis does cause symptoms, it's usually back pain or leg pain, numbness or tiredness when walking, often because the nerves in the lower spine are being squeezed. That condition is called spinal stenosis.",
        ],
      },
      {
        question: "How is adult scoliosis treated?",
        paragraphs: [
          "Most adults are treated without surgery. Physical therapy, staying active, building core strength, and pain relief when needed help most people. Braces aren't usually used in adults, because the skeleton has stopped growing.",
          "Surgery is considered for adults whose pain or nerve symptoms are severe and don't improve, or whose curves are worsening and affecting their balance. Adult spine surgery is generally bigger and carries more risk than surgery in teens, which is one reason doctors prefer to correct large curves before adulthood when possible.",
        ],
      },
      {
        question: "What can I do now to help my future back?",
        paragraphs: [
          "Keep moving. Regular exercise, a strong core, a healthy weight and not smoking all help your spine age well, with or without scoliosis. If you had scoliosis as a teen, it helps to know your last measured curve size, since that's what tells a future doctor how much to keep an eye on it.",
        ],
      },
    ],
    sources: [
      { label: "Weinstein et al. (2003), Health and function of patients with untreated idiopathic scoliosis: a 50-year natural history study, JAMA", url: "https://pubmed.ncbi.nlm.nih.gov/12578488/" },
      { label: "Cleveland Clinic: Scoliosis", url: "https://my.clevelandclinic.org/health/diseases/15837-adult-scoliosis" },
    ],
  },
  {
    id: "pregnancy",
    title: "Scoliosis and pregnancy",
    category: "Later in life",
    Icon: Baby,
    intro: [
      "Pregnancy might feel a long way off, but it's something many people with scoliosis wonder about at some point. Will a curve make pregnancy harder? Will pregnancy make the curve worse? What if you've had surgery?",
      "For most people, the answers are reassuring.",
    ],
    sections: [
      {
        question: "Can people with scoliosis have healthy pregnancies?",
        paragraphs: [
          "Yes. Most people with scoliosis, including those who've had spinal fusion, have normal pregnancies and healthy babies. Studies haven't found that scoliosis itself increases the risk of most pregnancy complications. The rate of cesarean births is similar, and when a cesarean is done, it's usually for the same reasons as anyone else.",
          "People with very large curves, especially in the upper back, may have less lung capacity, and their doctors may want to check their breathing before or during pregnancy. That's uncommon.",
        ],
      },
      {
        question: "Does pregnancy make a curve worse?",
        paragraphs: [
          "For most people, no. A review of the research found that pregnancy doesn't appear to make scoliosis curves progress in a meaningful way. One possible exception noted in some studies was people who had worn a brace as teens, whose curves sometimes changed slightly, but the evidence there is limited.",
          "Back pain is very common in pregnancy for everyone, as the body's center of gravity shifts and ligaments loosen. People with scoliosis may notice a bit more, but it's usually manageable with the same approaches anyone uses.",
        ],
      },
      {
        question: "Can I have an epidural if I have scoliosis?",
        paragraphs: [
          "Usually, yes. An epidural or spinal anesthetic is placed in the lower back, between vertebrae. With a curve, the spaces between the bones can be twisted, which may make placement a bit trickier, but anesthesiologists do it successfully all the time.",
          "After spinal fusion, it depends on how low the fusion goes. If it stops above the lower back, an epidural is often straightforward. If it extends into the lower back, it can be harder and may not work as well, and sometimes another option is suggested. It's a good idea to meet with an anesthesiologist before your due date to make a plan, and to bring any records or X-rays of your surgery.",
        ],
      },
      {
        question: "Is scoliosis passed on to children?",
        paragraphs: [
          "It can be, since genes play a role. If a parent has scoliosis, a child's chance is higher than average, around 1 in 10, the same as for anyone with an affected parent or sibling. But most children of parents with scoliosis don't develop it. The practical step is simply to keep an eye on your children's backs during their growth spurts and mention the family history at checkups.",
        ],
      },
      {
        question: "What should I tell my doctor?",
        paragraphs: [
          "Let them know you have scoliosis, how large the curve was at its last check, whether you wore a brace, and whether you've had surgery and at what levels of the spine. That's all your care team needs to plan well.",
        ],
      },
    ],
    sources: [
      { label: "Schroeder et al. (2011), Does pregnancy increase curve progression in women with scoliosis treated without surgery? A systematic review, Evidence-Based Spine-Care Journal", url: "https://www.thieme-connect.de/products/ejournals/abstract/10.1055/s-0030-1267112" },
      { label: "Scoliosis Research Society: Adolescent idiopathic scoliosis, a handbook for patients", url: "https://www.srs.org/Files/Patient-Brochures/Patient.Adolescent_Idiopathic_Scoliosis_Handbook_for_Patients.pdf" },
      { label: "Cleveland Clinic: Scoliosis", url: "https://my.clevelandclinic.org/health/diseases/15837-adult-scoliosis" },
    ],
  },
  {
    id: "history",
    title: "A short history of scoliosis",
    category: "Science & history",
    Icon: ScrollText,
    intro: [
      "People have been noticing crooked spines, and trying to straighten them, for at least 2,500 years. A lot of the old treatments sound alarming today. But the history explains why doctors measure and treat scoliosis the way they do now, and it shows how recently the modern options arrived.",
    ],
    sections: [
      {
        question: "Who first described scoliosis?",
        paragraphs: [
          "The Greek physician Hippocrates, writing around 400 BCE, described curved spines and tried to straighten them with traction: stretching the patient on a wooden frame, sometimes while pressing on the curve. He also described tying a patient to a ladder and dropping it, a method that didn't survive for obvious reasons.",
          "About 600 years later, the Roman-era physician Galen gave the condition its name. \"Scoliosis\" comes from a Greek word meaning crooked or bent. Galen also coined the terms kyphosis (a forward rounding) and lordosis (an inward sway), which doctors still use.",
        ],
      },
      {
        question: "When did braces come along?",
        paragraphs: [
          "In the 1500s, the French surgeon Ambroise Paré described scoliosis in detail and made some of the first braces, which were basically iron corsets. For the next few centuries, braces were heavy, rigid and often painful, and nobody had a good way to tell whether they worked.",
          "In the 1800s, the American surgeon Lewis Sayre wrapped patients in plaster casts while they hung by the head to stretch the spine. Plaster casting is still used today in a much gentler form for very young children.",
          "The braces most teens wear now came much later. The Milwaukee brace, with a neck ring and metal bars, appeared in the 1940s. Lower, underarm braces like the Boston brace followed in the 1970s, and they're much easier to hide under clothes.",
        ],
      },
      {
        question: "How did X-rays change things?",
        paragraphs: [
          "Before 1895, doctors could only judge a curve by looking at a person's back. When Wilhelm Röntgen discovered X-rays that year, doctors could suddenly see the spine itself. That raised a new problem: how do you describe a curve in a way everyone agrees on?",
          "In the 1940s, an American surgeon named John Robert Cobb described a method for measuring the angle of a curve on an X-ray. The \"Cobb angle\" became the standard and still is. When a doctor says someone has a 25-degree curve, they're using Cobb's method.",
        ],
      },
      {
        question: "How did surgery develop?",
        paragraphs: [
          "Spinal fusion was first performed by Russell Hibbs in New York in 1911 and used for scoliosis a few years later. Those early operations joined vertebrae together with bone but couldn't straighten the spine much, and patients spent months in casts. The real turning point came from Paul Harrington, a surgeon in Houston who treated many children with polio. In the 1950s he designed a steel rod that could be ratcheted against the spine to straighten it. He reported his results in the early 1960s, and the \"Harrington rod\" was the standard for about two decades.",
          "The downside was that Harrington rods straightened the spine but also flattened its natural curves, and patients often wore casts afterward. In the 1970s and 1980s, surgeons developed systems that attached at many points along the spine, including wires (the Luque technique) and, later, screws and hooks connected to two rods (the Cotrel–Dubousset system). These let surgeons correct the twist of the spine and not just the side bend, with no cast needed. Modern surgery builds on those ideas.",
        ],
      },
      {
        question: "What does this history mean for you?",
        paragraphs: [
          "Mostly, it means you're living in a much better time to have scoliosis. Most curves are mild and never need treatment at all. Bracing is now backed by solid evidence, and surgery, when it's needed, is far safer and more effective than it was even 40 years ago.",
          "It's also a reminder that \"this is how it's always been done\" isn't a good reason on its own. Plenty of treatments were used for centuries before anyone tested whether they worked. That's why good doctors, and this app, rely on approaches that have been tested.",
        ],
      },
    ],
    sources: [
      { label: "Fayssoux et al. (2010), A history of bracing for idiopathic scoliosis in North America, Clinical Orthopaedics and Related Research", url: "https://link.springer.com/article/10.1007/s11999-009-0888-5" },
      { label: "Hasler (2013), A brief overview of 100 years of history of surgical treatment for adolescent idiopathic scoliosis, Journal of Children's Orthopaedics", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3566253/" },
    ],
  },
  {
    id: "screening-debate",
    title: "The debate over school screening",
    category: "Science & history",
    Icon: School,
    intro: [
      "In many places, students used to line up in the gym, one at a time, to bend over in front of a nurse. School scoliosis screening was routine across much of the US for decades. Today it's much less common, and medical groups don't agree on whether it should happen at all.",
      "Understanding why helps explain what screening can and can't do, including what an app like ScoliScan can do.",
    ],
    sections: [
      {
        question: "Why do some experts support screening?",
        paragraphs: [
          "The main argument is timing. Scoliosis usually causes no pain or obvious symptoms early on, so a curve can grow quietly during the growth spurt. Bracing works best when it's started while a teen is still growing and the curve is still moderate. If a curve is only noticed once it's large, the chance to brace may have passed.",
          "That argument got stronger in 2013, when the BrAIST trial showed that bracing really does reduce the chance a curve reaches surgical size. In 2015, the Scoliosis Research Society, the American Academy of Orthopaedic Surgeons, the Pediatric Orthopaedic Society of North America and the American Academy of Pediatrics released a joint position statement supporting screening: twice for girls, at about 10 and 12, and once for boys, at about 13 or 14.",
        ],
      },
      {
        question: "Why do some experts disagree?",
        paragraphs: [
          "The US Preventive Services Task Force, an independent panel that reviews the evidence on preventive care, takes a more cautious view. In 2018 it concluded that the evidence is insufficient to say whether the benefits of screening teens outweigh the harms. That's a change from its 2004 position, which recommended against routine screening, but it still isn't an endorsement.",
          "Their concerns include false alarms, since many teens flagged at screening turn out to have very small curves or none, leading to doctor visits, X-rays and worry. They also pointed out that there isn't direct evidence showing that screening itself leads to better long-term health, as opposed to evidence that bracing works once a curve is found.",
        ],
      },
      {
        question: "Who is right?",
        paragraphs: [
          "Both sides are working from the same facts and weighing them differently. Screening tests like the forward bend test and scoliometer are good at catching curves that matter, but they also flag some people who turn out to be fine. Whether that trade-off is worth it depends on how you value catching a curve early versus avoiding unnecessary visits and X-rays.",
        ],
      },
      {
        question: "Where does that leave screening today?",
        paragraphs: [
          "It varies by place. Some US states still require school screening, some recommend it and others leave it to doctors. Many countries in Europe and Asia run screening programs, while others don't. Many pediatricians include a quick back check during routine physicals.",
        ],
      },
      {
        question: "How does ScoliScan fit in?",
        paragraphs: [
          "ScoliScan is meant to make screening easier to do at home, especially for teens who don't get screened at school. It follows the same idea as the professional tests, with the forward-bend trunk rotation reading as the main measurement, and it uses the established thresholds. It also takes the false-alarm concern seriously: it never tells you that you have scoliosis, and it uses \"scan again\" results for borderline readings to avoid sending people to the doctor too quickly. Only a clinician, and if needed an X-ray, can diagnose scoliosis.",
        ],
      },
    ],
    sources: [
      { label: "U.S. Preventive Services Task Force (2018): Adolescent idiopathic scoliosis, screening", url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/adolescent-idiopathic-scoliosis-screening" },
      { label: "Healio (2016): Orthopedic, pediatric and scoliosis societies call for early scoliosis detection", url: "https://www.healio.com/news/orthopedics/20160114/orthopedic-pediatric-scoliosis-societies-call-for-early-scoliosis-detection" },
      { label: "Weinstein et al. (2013), Effects of bracing in adolescents with idiopathic scoliosis, New England Journal of Medicine", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1307337" },
    ],
  },
  {
    id: "imaging",
    title: "X-rays, radiation and scoliosis",
    category: "Science & history",
    Icon: Radiation,
    intro: [
      "If you're being followed for scoliosis, you'll probably have several X-rays over a few years. It's reasonable to wonder whether all that radiation is safe.",
      "The short answer is that modern scoliosis X-rays use much less radiation than older ones, doctors take steps to keep the dose low, and the benefit of knowing how your curve is changing usually outweighs the small risk. But radiation is something doctors take seriously, and it's one reason screening tools that don't use X-rays matter.",
    ],
    sections: [
      {
        question: "Why are X-rays needed at all?",
        paragraphs: [
          "Because nothing else measures a curve as accurately. A forward bend test or scoliometer reading can suggest a curve, but only an image of the spine shows exactly where it is and how large it is in degrees. That number, the Cobb angle, is what decides whether a curve should simply be watched, braced or treated with surgery. X-rays also show how much growing is left, using the Risser sign on the pelvis.",
        ],
      },
      {
        question: "Is there a real risk?",
        paragraphs: [
          "Some, mainly from repeated X-rays over many years. The clearest evidence comes from older studies of people treated for scoliosis decades ago, who often had many X-rays with much higher doses than are used now. Those studies found a higher rate of breast cancer later in life among women who'd had many spine X-rays as girls.",
          "Those findings are a big part of why scoliosis imaging has changed so much since then. Today's dose per X-ray is far lower, and doctors try to take only the images they need.",
        ],
      },
      {
        question: "How do doctors keep the dose down?",
        paragraphs: [
          "Several ways. Scoliosis X-rays are now usually taken from back to front rather than front to back, which lowers the dose to sensitive tissues like the breasts and thyroid. Careful positioning, and limiting the image to the area that's needed, help too. Digital X-rays need less radiation than old film. And doctors space X-rays out, often six months or more apart, unless there's a reason to look sooner.",
          "The principle behind all of this has a name in medicine: ALARA, or \"as low as reasonably achievable.\"",
        ],
      },
      {
        question: "What is EOS imaging?",
        paragraphs: [
          "EOS is a newer type of low-dose X-ray system that's becoming common in children's hospitals. You stand in a booth while two thin beams scan your whole body from head to toe, creating front and side images at the same time. It uses much less radiation than a standard X-ray, and its lowest \"micro-dose\" setting has been measured at many times lower still. It can also build a 3D model of the spine, which helps show the twist that a flat X-ray misses.",
        ],
      },
      {
        question: "Can scoliosis be tracked without radiation?",
        paragraphs: [
          "Partly. Scoliometer readings and surface scanning, which maps the shape of the back with light or cameras, can help track changes between X-rays. Ultrasound and MRI are also being studied or used in some cases. None of these fully replaces an X-ray for making treatment decisions yet.",
          "That's one of the goals of screening tools like ScoliScan: to help decide who actually needs an X-ray in the first place, so people with straight spines don't need one at all.",
        ],
      },
    ],
    sources: [
      { label: "Ronckers et al. (2010), Cancer mortality among women frequently exposed to radiographic examinations for spinal disorders, Radiation Research", url: "https://bioone.org/journals/radiation-research/volume-174/issue-1/RR2022.1/Cancer-Mortality-among-Women-Frequently-Exposed-to-Radiographic-Examinations-for/10.1667/RR2022.1.full" },
      { label: "U.S. FDA: Reducing patient exposure during scoliosis radiography", url: "https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/reducing-patient-exposure-during-scoliosis-radiography" },
      { label: "AAOS OrthoInfo: Idiopathic scoliosis in children and adolescents", url: "https://www.orthoinfo.org/diseases--conditions/idiopathic-scoliosis-in-children-and-adolescents" },
    ],
  },
];

export const mission = {
  title: 'Empowering Every Step',
  body: "Our mission is to give you accurate, research-backed information on scoliosis detection, monitoring and care, written so anyone can understand it.",
  tags: ['#EarlyDetection', '#SpineHealth', '#ScoliAwareness'],
};