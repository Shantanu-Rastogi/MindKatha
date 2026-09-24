import { Injectable } from '@angular/core';
import { TherapyService, Modality, FAQItem, Specialization, Article, EmergencyHelpline } from '../models/therapy.model';

@Injectable({
  providedIn: 'root'
})
export class TherapyDataService {

  private services: TherapyService[] = [
    {
      title: 'Individual Psychotherapy & Emotional Regulation',
      tag: 'CBT • Somatic • ACT',
      description: 'Evidence-based cognitive and somatic approaches to untangle persistent worry, panic responses, social anxiety, and emotional overwhelm.',
      duration: '50 mins',
      iconClass: 'ph-user'
    },
    {
      title: 'Occupational Burnout & High-Performance Restoration',
      tag: 'Workplace & Leadership',
      description: 'Specialized psychotherapeutic support for tech professionals, engineers, and corporate leaders managing chronic cognitive exhaustion, imposter feelings, and boundary restructuring.',
      duration: '50 mins',
      iconClass: 'ph-briefcase'
    },
    {
      title: 'Trauma-Informed Healing & Complex Grief Processing',
      tag: 'Somatic & Attachment',
      description: 'Nervous system stabilization and gently paced clinical processing of developmental childhood trauma, emotional neglect, and ambiguous loss.',
      duration: '50–60 mins',
      iconClass: 'ph-shield-check'
    },
    {
      title: 'Comprehensive Adult ADHD Diagnostic Evaluation',
      tag: 'Gold-Standard Assessment',
      description: 'Formal, multi-stage clinical diagnostic assessment for adult neurodivergence, attention regulation, task initiation paralysis, and executive dysfunction with certified dossier.',
      duration: '2-Phase Evaluation',
      iconClass: 'ph-lightning'
    },
    {
      title: 'Neurodivergent Executive Functioning & De-Masking Support',
      tag: 'Neuro-Affirming Care',
      description: 'Practical, non-pathologizing therapy tailored specifically for ADHD, AuDHD, and neurodivergent adults to unlearn toxic masking and build dopamine-friendly workflows.',
      duration: '50 mins',
      iconClass: 'ph-sparkle'
    },
    {
      title: 'Couples & Relational Communication Mediation',
      tag: 'Gottman & EFT',
      description: 'Systemic relationship and couples therapy grounded in attachment theory and Gottman frameworks to heal communication roadblocks and rebuild intimacy.',
      duration: '60–75 mins',
      iconClass: 'ph-users-three'
    },
    {
      title: 'Pre-Marital Alignment & Relational Readiness',
      tag: 'Preventative Care',
      description: 'Proactive, structured consultation for couples planning marriage or long-term partnership to align expectations, family dynamics, finances, and conflict styles.',
      duration: '4-Session Track',
      iconClass: 'ph-heart'
    },
    {
      title: 'Queer, Trans & LGBTQIA+ Affirmative Psychotherapy',
      tag: 'Identity Affirmative',
      description: 'An unequivocally safe, celebratory, and trauma-informed clinical space for queer, trans, non-binary, and questioning individuals.',
      duration: '50 mins',
      iconClass: 'ph-rainbow'
    },
    {
      title: 'Standardized Psychometric & Personality Assessment',
      tag: 'MCMI-IV • MMPI-2',
      description: 'Standardized clinical batteries including MCMI-IV, MMPI-2, Rorschach, TAT, and differential diagnostic evaluations with certified clinical reports.',
      duration: 'Diagnostic Battery',
      iconClass: 'ph-brain'
    },
    {
      title: 'Adolescent, College & Emerging Adulthood Mentorship',
      tag: 'DBT & Life Stages',
      description: 'Specialized psychological support for university students, young adults (18–26), and adolescents navigating identity confusion, academic pressure, and independence.',
      duration: '50 mins',
      iconClass: 'ph-flower-lotus'
    },
    {
      title: 'Grief, Bereavement & Life Transition Counseling',
      tag: 'Compassion & Loss',
      description: 'Empathetic therapeutic accompaniment for individuals processing profound bereavement, disenfranchised loss, identity shifts, and life disruptions.',
      duration: '50 mins',
      iconClass: 'ph-compass'
    },
    {
      title: 'Perfectionism, Self-Worth & Inner Critic Restructuring',
      tag: 'Schema & CFT',
      description: 'Targeted clinical therapy for conscientious over-achievers trapped in harsh self-judgment, fear of failure, people-pleasing, and conditional self-worth.',
      duration: '50 mins',
      iconClass: 'ph-user-focus'
    }
  ];

  private specializations: Specialization[] = [
    {
      title: 'Adult Psychotherapy & Occupational Burnout',
      detailedDescription: 'Dedicated support for workplace stress, perfectionism, chronic fatigue, and existential dread among working professionals in Pune and across India.',
      icon: 'ph-user-focus'
    },
    {
      title: 'Child, Adolescent & Family Support',
      detailedDescription: 'Developmental guidance, psychometric assessments, emotional regulation tools, and parent-child relational alignment.',
      icon: 'ph-baby'
    },
    {
      title: 'Trauma-Informed & Somatic Healing',
      detailedDescription: 'Safe, paced clinical processing of childhood attachment wounds and acute stress using trauma-informed frameworks and grounding protocols.',
      icon: 'ph-shield-check'
    },
    {
      title: 'Queer-Affirmative Psychotherapy',
      detailedDescription: 'Non-judgmental, celebratory, and identity-affirming mental healthcare for LGBTQIA+ individuals, couples, and questioning folks.',
      icon: 'ph-rainbow'
    },
    {
      title: 'Neurodiversity-Affirming Practice',
      detailedDescription: 'Strengths-based therapeutic scaffolding tailored for ADHD, AuDHD, and sensory processing needs without forcing neurotypical masking.',
      icon: 'ph-sparkle'
    },
    {
      title: 'Attachment & Relational System Repair',
      detailedDescription: 'Deconstructing insecure attachment loops, setting compassionate boundaries, and resolving systemic friction in couples and families.',
      icon: 'ph-heart-break'
    }
  ];

  private modalities: Modality[] = [
    {
      name: 'Narrative Therapy',
      description: 'Separating the person from the problem, dismantling internalized stories, and re-authoring empowered life narratives.',
      iconClass: 'ph-book-open'
    },
    {
      name: 'Somatic Mindfulness',
      description: 'Body-centered practices that calm autonomic fight-or-flight states, restoring physiological safety and nervous system regulation.',
      iconClass: 'ph-leaf'
    },
    {
      name: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Identifying and reshaping automatic negative thoughts and behavioral loops into adaptive, constructive patterns.',
      iconClass: 'ph-gear'
    },
    {
      name: 'Attachment & Systemic Therapy',
      description: 'Exploring relational history to understand communication patterns, heal attachment injuries, and foster emotional security.',
      iconClass: 'ph-users'
    },
    {
      name: 'Acceptance & Commitment Therapy (ACT)',
      description: 'Fostering psychological flexibility through values-driven actions, mindful presence, and emotional acceptance.',
      iconClass: 'ph-compass'
    },
    {
      name: 'Dialectical Behavior Therapy (DBT-Informed)',
      description: 'Building practical skills for distress tolerance, emotional regulation, and effective interpersonal communication.',
      iconClass: 'ph-shield-check'
    }
  ];

  private emergencyHelplines: EmergencyHelpline[] = [
    {
      name: 'Tele-MANAS (Govt of India)',
      number: '14416 / 1800 891 4416',
      description: 'Toll-free, 24/7 tele-mental health support across India in multiple languages.',
      hours: '24/7 Toll-Free'
    },
    {
      name: 'KIRAN National Helpline',
      number: '1800-599-0019',
      description: '24/7 mental health rehabilitation helpline by Ministry of Social Justice & Empowerment.',
      hours: '24/7 Toll-Free'
    },
    {
      name: 'Vandrevala Foundation',
      number: '+91 9999 666 555',
      description: 'Free, confidential mental health counseling & crisis intervention via phone helpline.',
      hours: '24/7 Accessible'
    },
    {
      name: 'AASRA Crisis Center',
      number: '+91 98204 66726',
      description: '24-hour suicide prevention and emotional crisis support helpline.',
      hours: '24/7 Available'
    }
  ];

  private faqs: FAQItem[] = [
    {
      question: 'What happens in the first intake session?',
      answer: 'The initial 60-minute intake session is designed as a collaborative, safe dialogue. We explore your personal history, discuss what brings you to therapy, clarify your therapeutic goals, and determine the most supportive clinical roadmap for your journey.',
      category: 'Session Logistics'
    },
    {
      question: 'Are sessions available online or in-person?',
      answer: 'We provide both options. You can attend in-person psychotherapy sessions at our peaceful clinical studio in Viman Nagar, Pune (Disha Eternia Society, Sakore Nagar), or access secure, confidential online tele-therapy from anywhere in India or internationally.',
      category: 'Session Logistics'
    },
    {
      question: 'How many sessions will I need?',
      answer: 'Therapy is deeply individualized. Acute concerns like workplace burnout or situational anxiety often show meaningful progress within 6–8 sessions. Deeper trauma processing, relational healing, or identity exploration may involve long-term care, regularly reviewed together every few weeks.',
      category: 'Therapeutic Process'
    },
    {
      question: 'How is client confidentiality maintained?',
      answer: 'Confidentiality is a cornerstone of our ethical practice. All clinical notes and tele-therapy sessions are protected under strict ethical guidelines. Confidentiality is maintained with exceptions only in situations involving immediate risk of harm to self or others, as legally mandated.',
      category: 'Privacy & Ethics'
    },
    {
      question: 'Do you prescribe medication or conduct psychiatric evaluations?',
      answer: 'MindKatha provides evidence-based psychological counseling and psychotherapy. We do not prescribe medications. If psychiatric evaluation or pharmacological support is clinically appropriate, we coordinate with trusted psychiatrists in Pune and Mumbai.',
      category: 'Scope of Care'
    },
    {
      question: 'What is your cancellation and rescheduling policy?',
      answer: 'We request at least 24 to 48 hours advance notice for rescheduling or cancellations so the clinical slot can be offered to another person in need. Late cancellations without prior notice may incur the standard session fee.',
      category: 'Session Logistics'
    },
    {
      question: 'Can international clients seek therapy with MindKatha?',
      answer: 'Yes. We offer secure telehealth globally to Indian expats, students, and international professionals. Sessions are conducted in English or Hindi, scheduled according to Indian Standard Time (IST).',
      category: 'International'
    },
    {
      question: 'How do session fees and insurance reimbursements work?',
      answer: 'We operate on a direct self-pay model. Following sessions, we can provide itemized clinical receipts / superbills for clients who wish to file for out-of-network reimbursement through private corporate health policies or international insurance providers.',
      category: 'Billing & Fees'
    }
  ];

  private articles: Article[] = [
    {
      id: 'myth-of-closure',
      title: 'The Myth of Closure: Navigating Ambiguous Loss and Unfinished Chapters',
      excerpt: 'Why the cultural obsession with "clean endings" and final apologies often prolongs grief, and how clinical psychology guides us to build genuine internal resolution.',
      readTime: '5 min read',
      category: 'Trauma & Recovery',
      tag: 'Clinical Reflection',
      iconClass: 'ph-heart-straight',
      author: 'Leona Lahkar',
      authorTitle: 'RCI Registered Clinical Psychologist',
      publishedDate: 'Clinical Practice Series',
      content: [
        'In mainstream culture, closure is almost universally depicted as a tidy, cinematic resolution: a final coffee shop conversation where all unanswered questions are resolved, heartfelt apologies are exchanged, and both individuals walk away with instantaneous emotional equilibrium. However, across years of outpatient clinical practice, I have witnessed that the relentless pursuit of this idealized closure is one of the most pervasive drivers of chronic emotional rumination and delayed grief.',
        'When relationships end abruptly, when family members become estranged without explanation, or when a promising career trajectory disintegrates overnight, our cognitive architecture encounters what pioneering family therapist Dr. Pauline Boss coined as "Ambiguous Loss." Unlike physical death, where biological finality forces the psyche into mourning, ambiguous loss leaves the psychological door half-open. The brain, functioning as an evolutionary prediction engine, detests open explanatory loops. When an event lacks a definitive ending, the prefrontal cortex becomes trapped in counterfactual rumination—endlessly generating "What if?" and "If only" simulations in an attempt to solve an unsolvable interpersonal equation.',
        'Clients often enter the consultation room carrying the belief that they cannot truly heal until the other person acknowledges the harm caused, provides a rational explanation, or validates their pain. But tethering your emotional recovery to another person’s remorse or psychological maturity places the key to your wellbeing in the hands of the very person who demonstrated an inability to hold it safely in the first place.',
        'At the neurobiological level, waiting for external closure maintains elevated sympathetic nervous system activation. Every time you re-read old correspondence, replay past disagreements in your mind, or rehearse imaginary confrontation speeches, your amygdala reacts as though the relational threat is unfolding in real time. The body produces surges of cortisol and adrenaline, reinforcing neural pathways of hyper-vigilance and grievance.',
        'True psychological resolution is an internal, self-authored decision rather than an external concession. In narrative and psychodynamic therapy, we guide clients through the process of "externalizing the conversational ghost." We help you recognize that someone else’s silence, denial, or emotional withdrawal is not a reflection of your worth or the validity of your reality; rather, it is evidence of their own psychological limitations, emotional defenses, and relational boundaries.',
        'Healing through ambiguous loss requires learning to hold psychological duality. Duality means being able to say: "This situation ended with profound unfairness and unanswered questions, AND I am fully capable of authoring a vibrant, meaningful, and joyful next chapter for myself." You do not need the other person to understand the depth of your injury for your injury to be real, and you do not need their permission to close the book and walk forward into peace.'
      ],
      keyTakeaways: [
        'Closure is an internal neurological decision to cease waiting for external validation or explanations.',
        'Ambiguous loss demands holding duality: grieving what was left unresolved while fully committing to present growth.',
        'Tethering recovery to another person’s remorse gives them continuing control over your emotional health.',
        'Externalizing conversational ghosts allows the nervous system to disengage from chronic defensive rumination.'
      ]
    },
    {
      id: 'somatic-nervous-system-regulation',
      title: 'Somatic Grounding: Regulating the Autonomic Nervous System in Acute Stress',
      excerpt: 'When cognitive tools fail during high anxiety, bottom-up physiological practices communicate safety to the brain faster than forced positive thinking.',
      readTime: '6 min read',
      category: 'Anxiety & Somatics',
      tag: 'Mind-Body Care',
      iconClass: 'ph-wind',
      author: 'Leona Lahkar',
      authorTitle: 'RCI Registered Clinical Psychologist',
      publishedDate: 'Clinical Practice Series',
      content: [
        'Almost everyone who has experienced acute panic, public speaking dread, or sudden emotional flooding has been told by well-meaning friends to "just calm down," "think positive," or "breathe through it." Yet in the acute throes of panic, attempts at top-down cognitive reframing almost universally fail. This failure is not a lack of willpower; it is a direct consequence of evolutionary neurobiology.',
        'When the amygdala perceives an existential threat—whether an actual physical predator, an aggressive workplace confrontation, or an impending anxiety spiral—it triggers a massive autonomic cascade. The sympathetic branch of the autonomic nervous system floods the bloodstream with epinephrine and cortisol, dilates the pupils, accelerates heart rate, and shunts blood flow away from the prefrontal cortex toward peripheral skeletal muscles. In clinical terms, the logical, language-processing prefrontal cortex is temporarily "taken offline." Asking someone in acute hyper-arousal to rationalise their way out of anxiety is like asking a computer to run advanced calculations while its power supply is surging.',
        'According to Dr. Stephen Porges’ Polyvagal Theory, our nervous system continually scans internal and external environments for safety cues through a subconscious neural process known as "Neuroception." When neuroception registers threat, the body shifts into sympathetic activation (fight-or-flight) or, under prolonged overwhelming stress, into dorsal vagal collapse (the freeze response: emotional numbness, brain fog, and paralysis). To bring the system back into the ventral vagal state (social engagement, calm clarity, and physiological safety), we must employ "bottom-up" somatic interventions that communicate directly through the vagus nerve and brainstem before addressing cognitive thoughts.',
        'One of the fastest, peer-reviewed biological tools for immediately engaging the parasympathetic brake is the "Physiological Sigh," studied extensively by neurobiologists. The physiological sigh consists of two rapid, consecutive nasal inhalations (the first deep inhalation inflates the lungs, while the second short sniff re-expands collapsed pulmonary alveoli) followed by an extended, unforced exhalation through the mouth. Performing this specific breath cycle just 3 to 5 times immediately lowers carbon dioxide levels in the bloodstream, slows the sinoatrial heart node via the vagal nerve, and signals to the brain that the physiological emergency has subsided.',
        'Complementing respiratory regulation with "Somatic Orienting" grounds the physical body in external reality. During panic, our visual field narrows into hyper-focused tunnel vision. By intentionally turning your head from side to side, allowing your eyes to rest on neutral or pleasant textures in the room, feeling the solid gravitational support of the floor beneath your feet, and feeling the temperature of the air against your skin, you provide undeniable visual and proprioceptive proof to the amygdala that you are safe in the immediate present.',
        'In ongoing psychotherapy, we practice these somatic regulation tools during periods of calm so that the neural pathways become robust, automatic reflexes. Once physiological safety is re-established in the body, the prefrontal cortex comes back online, allowing for cognitive restructuring, problem-solving, and meaningful emotional integration.'
      ],
      keyTakeaways: [
        'In acute panic, the prefrontal cortex dials down, rendering top-down logic temporarily inaccessible.',
        'Polyvagal neuroception operates below conscious awareness; safety must be communicated through physiological signals.',
        'The Physiological Sigh (two nasal inhales + one long mouth exhale) immediately triggers the vagal brake on heart rate.',
        'Somatic orienting and sensory anchoring ground awareness into the physical room, neutralizing tunnel vision panic.',
        'Pairing bottom-up nervous system regulation with top-down CBT creates durable, lifelong emotional resilience.'
      ]
    },
    {
      id: 'burnout-imposter-fatigue-tech',
      title: 'Navigating Burnout & Imposter Fatigue in High-Velocity Tech Ecosystems',
      excerpt: 'Recognizing the early emotional, cognitive, and somatic markers of occupational exhaustion and building self-preserving clinical boundaries.',
      readTime: '7 min read',
      category: 'Workplace Wellbeing',
      tag: 'Occupational Care',
      iconClass: 'ph-lightning',
      author: 'Leona Lahkar',
      authorTitle: 'RCI Registered Clinical Psychologist',
      publishedDate: 'Clinical Practice Series',
      content: [
        'Across clinical consultations with software engineers, engineering managers, product leads, and founders across Pune, Bengaluru, and remote global tech teams, a distinct and consistent psychological profile emerges. Burnout in high-velocity tech environments rarely presents as lethargy, apathy, or poor work ethic. Rather, it manifests in conscientious, high-achieving professionals as chronic over-functioning, relentless availability, and an agonizing inability to mentally disconnect from the product lifecycle.',
        'At its biological core, burnout is the clinical manifestation of "Allostatic Overload"—the systemic wear and tear that occurs when the human body is subjected to persistent, unmitigated stress without adequate recovery intervals. In modern tech culture, the proliferation of asynchronous communication tools like Slack, Jira, and email has effectively dissolved the physical and psychological thresholds between professional performance and personal recovery and rest. The brain remains in a constant state of low-grade hyper-vigilance, anticipating the next critical incident, deployment failure, or leadership ping.',
        'This systemic exhaustion is almost always fueled by what I define in therapy as "Imposter Fatigue." Unlike generic self-doubt, imposter fatigue is the pervasive, subconscious belief that your professional success is accidental or provisional—and that any pause in high output will expose your perceived inadequacy to peers and leadership. To compensate for this internal shame script, professionals establish exhausting coping strategies: working late into the night, volunteering for extra initiatives, obsessively polishing deliverables, and saying yes to every cross-functional request.',
        'Over time, allostatic overload disrupts key physiological and cognitive systems. Early warning signs include fragmented sleep architecture (waking up at 3:00 AM with work thoughts racing), executive brain fog, decision paralysis over trivial tasks, irritability with loved ones, and emotional flattening where neither successes nor leisure bring genuine pleasure.',
        'Crucially, reversing burnout requires understanding the fundamental difference between passive distraction and active physiological recovery. Collapsing onto the sofa after a 12-hour workday and scrolling social media or watching streaming shows may numb cognitive exhaustion, but it does not down-regulate an over-activated nervous system. True biological recovery requires somatic downtime: walking in nature without headphones, engaging in tactile creative hobbies, somatic grounding, and deep social connection that has nothing to do with work output.',
        'From a clinical perspective, recovery demands the courage to establish structural boundaries. This includes creating non-negotiable daily "shutdown rituals" that formally close the workday, turning off work notifications on personal devices, scheduling calendar buffer blocks for focused deep work, and learning to communicate realistic capacity limits without apologizing. Most importantly, therapy helps you untangle your intrinsic human worth from your sprint velocity and quarterly KPIs.'
      ],
      keyTakeaways: [
        'Tech burnout manifests as over-functioning and relentless availability rather than simple laziness.',
        'Allostatic overload occurs when cortisol flooding persists without restorative recovery cycles.',
        'Imposter fatigue drives boundary erosion by convincing individuals they must continually prove their worth.',
        'Passive screen distraction numbs exhaustion but fails to provide genuine parasympathetic nervous system recovery.',
        'Sustainable career longevity requires non-negotiable shutdown rituals and decoupling self-worth from productivity.'
      ]
    },
    {
      id: 'relational-attachment-secure-intimacy',
      title: 'Deconstructing Relational Attachment: Moving from Reactive Conflict to Secure Intimacy',
      excerpt: 'How understanding your childhood attachment scripts helps couples de-escalate recurring arguments, express primary vulnerability, and foster lasting closeness.',
      readTime: '6 min read',
      category: 'Relational Health',
      tag: 'Couples & Attachment',
      iconClass: 'ph-users-three',
      author: 'Leona Lahkar',
      authorTitle: 'RCI Registered Clinical Psychologist',
      publishedDate: 'Clinical Practice Series',
      content: [
        'When couples enter relational therapy, they almost always begin by describing recurring surface arguments: disagreements over household responsibilities, social commitments, financial priorities, or differing communication cadences. Yet within the first few sessions, it becomes clear that these arguments are rarely about the logistics being debated. Beneath the surface, every high-intensity marital or relational conflict is an attachment protest—a distress signal sent by the nervous system when emotional safety, attunement, or connection feels threatened.',
        'Pioneered by British psychoanalyst John Bowlby and expanded by Dr. Sue Johnson in Emotion-Focused Therapy (EFT), Attachment Theory demonstrates that human adults are biologically wired for relational interdependence. When we perceive emotional distance, rejection, or unpredictability from our primary partner, our autonomic nervous system experiences it as an existential threat.',
        'Couples frequently become ensnared in the classic "Anxious-Avoidant Dance." When an anxiously attached partner senses emotional disconnection, their internal alarm system triggers hyper-activating strategies: they pursue, raise their voice, demand immediate answers, and express intense emotional distress to compel reassurance. Conversely, when an avoidantly attached partner experiences high emotional intensity or perceived criticism, their system perceives intimacy as a threat to autonomy and survival. They deploy deactivating strategies: withdrawing into silence, rationalizing, walking out of the room, or shutting down emotionally.',
        'This dynamic creates a self-reinforcing vicious cycle: the more the anxious partner pursues, the more the avoidant partner withdraws; and the more the avoidant partner retreats, the more desperate and reactive the anxious partner becomes. Both partners end up confirming their deepest subconscious fears: the anxious partner feels abandoned and unloved, while the avoidant partner feels inadequate, controlled, and overwhelmed.',
        'In clinical couples therapy, our first major milestone is helping both partners externalize this dance. We reframe the conflict so that neither partner is labeled the "villain." The enemy is the cycle itself. We teach couples to differentiate between "secondary reactive emotions" (anger, sarcasm, defensiveness, icy silence) and the vulnerable "primary emotions" lurking beneath (fear of unworthiness, grief, loneliness, and terror of losing connection).',
        'When partners learn to recognize their somatic triggers and communicate from primary vulnerability—saying "When you went silent, I felt terrified that I was losing you" instead of "You never care about my feelings"—the entire relational neurobiology shifts. Conflict transforms from a battle for defensive survival into an opportunity for deepening trust, attunement, and earned secure attachment.'
      ],
      keyTakeaways: [
        'Relational arguments are almost always protests against emotional disconnection and attachment threat.',
        'The Anxious-Avoidant cycle self-perpetuates: pursuit triggers withdrawal, and withdrawal triggers louder pursuit.',
        'The common enemy in conflict is the reactive cycle itself, not either partner.',
        'Replacing secondary anger and defensiveness with vulnerable primary emotions de-escalates nervous system alarm.',
        'Secure attachment is not an innate trait; it can be actively co-created through consistent attunement and repair.'
      ]
    },
    {
      id: 'adhd-masking-adult-executive-functioning',
      title: 'Understanding Adult ADHD Masking, Executive Dysfunction, and Neurodivergent Care',
      excerpt: 'Exploring the hidden psychological toll of masking ADHD in adulthood, and designing compassionate, low-friction executive scaffolding.',
      readTime: '8 min read',
      category: 'Neurodiversity',
      tag: 'Neuro-Affirming',
      iconClass: 'ph-sparkle',
      author: 'Leona Lahkar',
      authorTitle: 'RCI Registered Clinical Psychologist',
      publishedDate: 'Clinical Practice Series',
      content: [
        'For decades, Attention Deficit Hyperactivity Disorder (ADHD) was clinically stereotyped as a condition confined to hyperactive school-aged boys disrupting classrooms. Consequently, millions of intelligent, high-achieving adults—particularly women and inattentive-type individuals—spent their childhoods, twenties, and thirties navigating silent cognitive struggles. They were frequently mislabeled as "lazy," "scatterbrained," "too emotional," or "not living up to their full potential."',
        'When adults finally receive a formal clinical evaluation in their late twenties, thirties, or beyond, the experience is often accompanied by an overwhelming mixture of profound grief and immense liberation. Grief for the years spent internalizing moral self-blame, and liberation in recognizing that their struggles with procrastination, task initiation, working memory, and emotional flooding were rooted in a neurobiological difference rather than a character defect.',
        'At the core of the adult neurodivergent experience is the concept of "ADHD Masking"—the conscious or subconscious suppression of natural neurodivergent behaviors, impulses, and cognitive needs in order to conform to neurotypical societal standards. Masking takes many exhausting forms: obsessively arriving thirty minutes early to meetings out of terror of being late; writing compulsive, multi-layered checklists that never get executed; masking sensory distress in open-plan offices; hyper-focusing for twelve hours straight to make up for days of task paralysis; and over-monitoring one’s facial expressions in social conversations.',
        'While masking can produce external academic and professional accolades, its internal price is catastrophic. Chronic masking depletes cognitive bandwidth, elevates baseline generalized anxiety, and frequently triggers cyclical "Autistic/ADHD Burnout"—a state of utter neurological exhaustion where basic executive tasks become temporarily impossible.',
        'Neurobiologically, ADHD is fundamentally a disorder of the brain’s dopamine and norepinephrine reward and transmission pathways, particularly within the frontostriatal circuits governing Executive Functioning. These executive functions comprise six interconnected domains: task activation and initiation, focused attention, effort and processing speed, emotional modulation, working memory capacity, and self-monitoring. When an ADHD brain attempts to initiate a low-dopamine task (such as filing taxes, drafting administrative reports, or responding to emails), the brain experiences a state of physical paralysis that neurotypical individuals mistakenly equate with procrastination.',
        'Furthermore, many adults with ADHD experience "Rejection Sensitive Dysphoria" (RSD)—an excruciating, visceral emotional pain triggered by the perceived or actual loss of approval, criticism, or failure. RSD often manifests as perfectionism, people-pleasing, or sudden defensive withdrawal from opportunities to avoid potential rejection.',
        'A neuro-affirming clinical approach completely abandons the model of "fixing a broken person." Instead, we work collaboratively to build low-friction, externalized executive scaffolding. This includes establishing "body doubling" sessions, externalizing working memory into visual boards and analog timers, creating "dopamine menus" of micro-rewards, designing sensory-friendly workspaces, and most importantly, actively deconstructing the decades of internalized shame and moral judgment.'
      ],
      keyTakeaways: [
        'Adult ADHD is a neurobiological executive functioning difference, not a lack of willpower or moral discipline.',
        'ADHD masking conceals profound cognitive and sensory exhaustion behind high professional competence.',
        'Executive dysfunction affects task initiation, working memory, time perception, and emotional regulation.',
        'Rejection Sensitive Dysphoria (RSD) generates intense emotional pain around perceived criticism or disappointment.',
        'Neuro-affirming therapy replaces rigid neurotypical expectations with external scaffolding, sensory ease, and self-compassion.'
      ]
    },
    {
      id: 'narrative-therapy-reauthoring-scripts',
      title: 'Re-Authoring Problem-Saturated Identity Scripts with Narrative Therapy',
      excerpt: 'Externalizing internalized problems to reclaim your authentic voice, discover sparkling outcomes, and write an empowered life story.',
      readTime: '6 min read',
      category: 'Narrative Care',
      tag: 'Narrative Therapy',
      iconClass: 'ph-book-open-text',
      author: 'Leona Lahkar',
      authorTitle: 'RCI Registered Clinical Psychologist',
      publishedDate: 'Clinical Practice Series',
      content: [
        'From the moment we enter the world, we are immersed in stories. We absorb narratives about who we are, what we are worth, and what we are capable of from our families of origin, educational systems, cultural contexts, and societal expectations. Over decades of life experience, when people endure chronic hardship, relational trauma, or systemic invalidation, their life stories frequently become "problem-saturated."',
        'A problem-saturated story is one in which difficulty, failure, or distress becomes the totalizing lens through which all experiences are interpreted. Statements like "I am an anxious wreck," "I ruin every relationship I touch," "I am fundamentally broken," or "I am incapable of discipline" cease to be perceived as temporary struggles; instead, they are mistaken for unchangeable identity truths.',
        'Narrative Therapy, developed in the 1980s by family therapists Michael White and David Epston, offers a revolutionary clinical perspective grounded in a foundational maxim: "The person is not the problem; the problem is the problem."',
        'The foundational technique in narrative practice is "Linguistic Externalization." Rather than diagnosing anxiety or shame as internal defects within your personality, we linguistically externalize the problem as an unwelcome, opportunistic visitor. Instead of asking "Why are you so anxious?", we ask: "How does Anxiety recruit you into doubting your competence?", "When Anxiety visits, what lies does it whisper about your future?", and "What tools has Depression used to convince you that isolation is safe?"',
        'By separating your core identity from the problem, we create crucial psychological breathing room. You can suddenly evaluate the problem’s tactics, motives, and influence with curiosity rather than shame. This shift allows us to begin hunting for "Unique Outcomes" (often called "Sparkling Moments")—times in your past when you resisted the problem’s influence, stood up for your values, or demonstrated quiet resilience, even in small ways.',
        'In our clinical work, we systematically connect these forgotten sparkling moments to construct a rich, alternative narrative. We map both the "Landscape of Action" (the specific choices and behaviors you enacted) and the "Landscape of Consciousness" (what those choices reveal about your underlying values, hopes, and commitments). Through this collaborative process, you transition from being a passive character in a script written by past trauma to becoming the conscious, empowered author of your life story.'
      ],
      keyTakeaways: [
        'Problem-saturated narratives mistake temporary emotional struggles for permanent identity defects.',
        'The core axiom of Narrative Therapy: "The person is not the problem; the problem is the problem."',
        'Linguistic externalization separates your intrinsic self-worth from the tactics of anxiety, shame, or grief.',
        'Identifying unique outcomes and sparkling moments provides concrete evidence of your agency and resilience.',
        'Re-authoring allows you to construct an authentic, values-driven life narrative that honors your growth.'
      ]
    }
  ];

  getServices(): TherapyService[] {
    return this.services;
  }

  getSpecializations(): Specialization[] {
    return this.specializations;
  }

  getModalities(): Modality[] {
    return this.modalities;
  }

  getFAQs(): FAQItem[] {
    return this.faqs;
  }

  getArticles(): Article[] {
    return this.articles;
  }

  getArticleById(id: string): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  getEmergencyHelplines(): EmergencyHelpline[] {
    return this.emergencyHelplines;
  }
}
