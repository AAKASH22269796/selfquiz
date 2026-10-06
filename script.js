/* ==========================================================================
   SELF QUIZ & LEARN IT - APPLICATION LOGIC
   ========================================================================== */

// --- User & Device Identifier (Persisted in localStorage) ---
let uid = localStorage.getItem("userId");
if (!uid) {
  uid = "user_" + Math.random().toString(36).substring(2, 11);
  localStorage.setItem("userId", uid);
}

// --- Global State ---
let currentTab = "quiz"; // 'quiz' or 'learn'
let timeLeft = 0;
let timerInterval = null;
let selectedQuestions = [];
let userAnswers = {};

/* ==========================================================================
   QUESTION BANK
   NOTE FOR USER: You can freely edit, add, or replace questions in this array.
   Format:
   {
     question: "Question text here?",
     options: ["Option 1", "Option 2", "Option 3", "Option 4"],
     answer: 0 // Index of correct option (0 = first, 1 = second, etc.)
   }
   Units (Week 0 to Week 12) are automatically mapped every 10 questions,
   or you can specify `unit: 0` explicitly on each object.
   ========================================================================== */
const allQuestions = [
  /* -------- SET 0 (Week 0) -------- */
  { question: "What is Psychology?", options: ["Just a social media trend", "An art of living", "A subject about human body", "A study of cognitive processes & behavior"], answer: 3 }, /*[cite: 41] */
  { question: "A broad field of study that explores a variety of questions about thoughts, feelings and actions is ----?", options: ["Society", "Globalization", "Psychology", "Social Science"], answer: 2 }, /*[cite: 41] */
  { question: "Learning has been a central topic of research in", options: ["Chemistry", "Physics", "Mathematics", "Psychology"], answer: 3 }, /*[cite: 41] */
  { question: "The word Psyche means  ?", options: ["Body or physique", "Mind or soul", "Spirituality", "Hormones"], answer: 1 }, /*[cite: 42] */
  { question: "The of learning focuses on how people learn.", options: ["psychology", "english", "chemistry", "none of the given"], answer: 0 }, /*[cite: 42] */
  { question: "To help people to function effectively and fulfill their own unique potential\" is the aim of------ ?", options: ["Humanistic psychology", "Evolutionary biology", "Computer science", "Microbiology"], answer: 0 }, /*[cite: 42] */
  { question: "Psychology is not an independent science, but dependent on other fields.", options: ["True", "False"], answer: 1 }, /*[cite: 42] */
  { question: "The study of changes in an individual's behavior during his/her lifetime is called", options: ["Hormonal psychology", "Gender psychology", "Developmental Psychology", "Genetics or Heredity"], answer: 2 }, /*[cite: 43] */
  { question: "The study of differences and similarities in the behavior of animals of different species is called -", options: ["Developmental psychology", "Cultural psychology", "Personality psychology", "Comparative Psychology"], answer: 3 }, /*[cite: 43] */
  { question: "Humans are incapable of learning.", options: ["True", "False"], answer: 1 },/*[cite: 43] */
  /* -------- SET 1 (Week 1) -------- */
  { question: "Learning is often seen as the contiguous causal effect of on behavior.", options: ["blood", "bone density", "trauma", "experience"], answer: 3 }, /*[cite: 1] */
  { question: "In order to say that learning has occurred, a hidden change in behavior must occur.", options: ["True", "False"], answer: 1 }, /*[cite: 1] */
  { question: "Which of the following is not a mental construct?", options: ["skeleton", "knowledge", "representations", "associations"], answer: 0 }, /*[cite: 2] */
  { question: "Learning changes the structure of the brain through the process of continuous interactions between the learner and the external environment.", options: ["physical", "social", "biological", "none of the given"], answer: 0 }, /*[cite: 2] */
  { question: "shapes the learning process.", options: ["Only thoughts", "Only emotions", "Both thoughts and emotions", "Neither thoughts nor emotions"], answer: 2 }, /*[cite: 2] */
  { question: "Watson's work included the famous Little Albert experiment in which he conditioned a small child to a white rat.", options: ["fear", "love", "hate", "play with"], answer: 0 }, /*[cite: 3] */
  { question: "Behaviorism dominated psychology for much of the early century.", options: ["20th", "19th", "18th", "17th"], answer: 0 }, /*[cite: 3] */
  { question: "The state of \"conscious incompetence\" may be valuable of a learning experience.", options: ["at the end", "in the middle", "2 years after the end", "at the start"], answer: 3 }, /*[cite: 3] */
  { question: "Which of the following is not an outcome of effective e-learning?", options: ["wider range of strategies", "more reflective approach", "more positive emotions towards learning", "more disconnected knowledge"], answer: 3 }, /*[cite: 4] */
  { question: "Instrumental conditioning is an example of learning.", options: ["sensitization", "habituation", "associative", "meaningful"], answer: 2 }, /*[cite: 4] */

  /* -------- SET 2 (Week 2) -------- */
  { question: "The three major types of learning described by psychology are classical conditioning, operant conditioning and observational learning.", options: ["cognitive", "behavioral", "emotional", "evolutionary"], answer: 1 }, /*[cite: 5] */
  { question: "According to the view of Watson, psychology is", options: ["subjective", "only descriptive", "experimental", "about internal mental processes that cannot be measured and observed"], answer: 2 }, /*[cite: 5] */
  { question: "is given by Ivan Pavlov.", options: ["Operant conditioning", "Functional conditioning", "Classical conditioning", "Modern conditioning"], answer: 2 }, /*[cite: 6] */
  { question: "The process by which organisms learn to respond to certain stimuli but not to others is known as", options: ["stimulus generalization", "stimulus appreciation", "stimulus discrimination", "stimulus differentiation"], answer: 2 }, /*[cite: 6] */
  { question: "Higher-order conditioning is intrinsically weaker than its first-order counterpart.", options: ["True", "False"], answer: 0 }, /*[cite: 6] */
  { question: "is the process of gradually changing the quality of a response.", options: ["Shaping", "Modeling", "Cueing", "Shifting"], answer: 0 }, /*[cite: 7] */
  { question: "The works of were instrumental in engendering the dramatic shift from behaviorism to cognitive theories.", options: ["Edward C. Tolman", "Jean Piaget", "German Gestalt", "All of the given"], answer: 3 }, /*[cite: 7] */
  { question: "intelligence is the ability to perceive the visual-spatial world accurately and involves sensitivity to color, line, shape, form, space, and the potential for recognizing and manipulating the patterns of spaces.", options: ["Interpersonal", "Spatial", "Bodily-kinesthetic", "Linguistic"], answer: 1 }, /*[cite: 7] */
  { question: "Sternberg proposed his theory in 1985 as an alternative to the idea of the", options: ["general intelligence factor", "multiple intelligences", "specific intelligence factor", "unconscious intelligence"], answer: 0 }, /*[cite: 8] */
  { question: "Which of the following is not a kind of product in the structure of intellect model?", options: ["symbolic", "classes", "systems", "implications"], answer: 0 }, /*[cite: 8] */

  /* -------- SET 3 (Week 3) -------- */
  { question: "The connections between nerves cells are called", options: ["systems", "syntaxes", "neurons", "synapses"], answer: 3 }, /*[cite: 9] */
  { question: "In order to create a information must be changed into a usable form, which occurs through a process known as encoding.", options: ["past memory", "new imagination", "new memory", "past imagination"], answer: 2 }, /*[cite: 9] */
  { question: "Calling back the stored information in response to some cue for use in a process or activity is called", options: ["Retrieval", "Recall", "Recollection", "All of the given"], answer: 3 }, /*[cite: 10] */
  { question: "For many with deficits, reading facial expressions and knowing how to respond are confusing daily challenges.", options: ["memory", "intelligence", "social cognition", "biological cognition"], answer: 2 }, /*[cite: 10] */
  { question: "The Information Processing View of Learning assumes that there are limits to how much information can be processed at each stage.", options: ["True", "False"], answer: 0 }, /*[cite: 10] */
  { question: "The Information Processing View of Learning assumes that information process is involved in", options: ["forgetting", "remembering", "perceiving", "All of the given"], answer: 3 }, /*[cite: 11] */
  { question: "The capacity of the sensory register is", options: ["very small", "very large", "7+/-2 chunks", "unlimited"], answer: 1 }, /*[cite: 11] */
  { question: "Most children do not begin to engage in the process of rehearsal on their own until about age", options: ["seven", "two", "thirteen", "one"], answer: 0 }, /*[cite: 11] */
  { question: "provides an interface between the sub-systems of working memory and the part of long term memory specialized for episodic memory.", options: ["Phonological loop", "Visuo-spatial sketchpad", "Retrieval buffer", "Episodic buffer"], answer: 3 }, /*[cite: 12] */
  { question: "Memories of specific episodes of one's life refers to", options: ["declarative memory", "experimental episodic memory", "autobiographical episodic memory", "procedural memory"], answer: 2 }, /*[cite: 12] */

  /* -------- SET 4 (Week 4) -------- */
  { question: "thinking is the ability to create mental representations of objects, places, events, or people in your mind.", options: ["General", "Creative", "Divergent", "Symbolic"], answer: 3 }, /*[cite: 13] */
  { question: "We compare new information to our of the person, place, or thing, so we know how to categorize the new information mentally.", options: ["protofit", "protobite", "prototype", "none of the given"], answer: 2 }, /*[cite: 13] */
  { question: "Which of the following is not true?", options: ["Thinking is a higher mental process", "Thinking is a sub-vocal talking", "Thinking is fulfilling a need or problem solving", "Thinking is only done in verbal symbols"], answer: 3 }, /*[cite: 14] */
  { question: "Mental images are", options: ["Auditory", "Visual", "Gustatory", "All of the given"], answer: 3 }, /*[cite: 14] */
  { question: "organize complex phenomena into simpler, easily understandable, and usable categories and help to solve our problems.", options: ["Concepts", "Propositions", "Constructs", "Components"], answer: 0 }, /*[cite: 14] */
  { question: "The lowermost level of Bloom's taxonomy is", options: ["remember", "apply", "understand", "analyze"], answer: 0 }, /*[cite: 15] */
  { question: "The psychomotor domain of the Bloom's taxonomy is concerned with", options: ["Biological makeup", "Thoughts and beliefs", "Feelings and emotions", "Skilled behavior"], answer: 3 }, /*[cite: 15] */
  { question: "Which of the following is an example of meta-cognition skills?", options: ["Ignoring your limits", "Self-monitoring", "Skimming all important information", "All of the given"], answer: 1 }, /*[cite: 15] */
  { question: "critical thinking skill helps you analyze and process information to come to an unbiased conclusion.", options: ["Open-mindedness", "Self-regulation", "Self-control", "Observation"], answer: 0 }, /*[cite: 16] */
  { question: "The inspiration phase of the creative thinking process refers to the stage.", options: ["Incubation", "Insight", "Evaluation", "Preparation"], answer: 3 }, /*[cite: 16] */

  /* -------- SET 5 (Week 5) -------- */
  { question: "Which of the following is true about motivation?", options: ["It is a physical impulse", "It is an external process", "It has a willingness to activate but not channel the attitudes of learners", "None of the given"], answer: 3 }, /*[cite: 17] */
  { question: "The term \"motivation\" comes from a word.", options: ["Greek", "Latin", "Hindi", "Bengali"], answer: 1 }, /*[cite: 17] */
  { question: "It is called extrinsic motivation if causal factor is", options: ["curiosity", "social pressure", "self-satisfaction", "needs"], answer: 1 }, /*[cite: 18] */
  { question: "motivation is considered to be more crucial for students as it is associated with deep learning, better performance and self-efficacy.", options: ["Intrinsic", "Extrinsic", "Introjected regulation", "None of the given"], answer: 0 }, /*[cite: 18] */
  { question: "proposed that there are three primary drives that drive human behavior.", options: ["Hull", "Watson", "Piaget", "Gestalt"], answer: 0 }, /*[cite: 18] */
  { question: "Expectancy Theory of Motivation was developed by", options: ["Vroom", "Hull", "Murray", "None of the given"], answer: 0 }, /*[cite: 19] */
  { question: "An example of is thinking, \"If I work hard I can achieve the targets my boss has set for me\".", options: ["purposeful", "valence", "instrumentality", "expectancy"], answer: 3 }, /*[cite: 19] */
  { question: "In SMART goals, T stands for", options: ["Temporary", "Time-based", "Tough", "Testing"], answer: 1 }, /*[cite: 19] */
  { question: "Friendship is a need in Maslow's hierarchy.", options: ["Love and belonging", "Esteem", "Physiological", "Safety"], answer: 0 }, /*[cite: 20] */
  { question: "theory differentiates between autonomous motivation and controlled motivation.", options: ["Arousal", "Goal-setting", "Need hierarchy", "Self-determination"], answer: 3 }, /*[cite: 20] */

  /* -------- SET 6 (Week 6) -------- */
  { question: "According to Daniel Goleman, component of emotional intelligence focuses on how we handle relationships with others.", options: ["self-awareness", "motivation", "empathy", "emotional regulation"], answer: 2 }, /*[cite: 21] */
  { question: "Emotional intelligence can be considered a type of intelligence.", options: ["academic", "genetic", "social", "external"], answer: 2 }, /*[cite: 21] */
  { question: "Noticing a difficult emotion and slowing down or resisting any impulsive action that may follow highlights component of emotional intelligence.", options: ["Self-regulation", "Motivation", "Emotional literacy", "Empathy"], answer: 0 }, /*[cite: 22] */
  { question: "The following are signs of emotional intelligence, except", options: ["strong sense of curiosity", "holding onto mistakes", "ability to manage emotions in difficult situations", "self-confidence"], answer: 1 }, /*[cite: 22] */
  { question: "Perceiving emotions means", options: ["Ignoring signals", "Understanding only what somebody is saying to you", "Understanding only somebody's facial expression", "Understanding both verbal and nonverbal signals"], answer: 3 }, /*[cite: 22] */
  { question: "suggests that 10 distinct components provide the scaffolding of emotionally and socially intelligent behaviors:", options: ["Bar-On", "Goleman", "Salovey", "Mayer"], answer: 0 }, /*[cite: 23] */
  { question: "Which of the following is a facilitator of EQ?", options: ["optimism", "happiness", "independence", "all of the given"], answer: 3 }, /*[cite: 23] */
  { question: "is a strategy for improving one's self-awareness.", options: ["rejecting feedback", "using critical self-talk daily", "developing a fixed mindset", "pursuing one's passion"], answer: 3 }, /*[cite: 23] */
  { question: "Having students create autobiographies is an example of creating opportunities for", options: ["emotional labor", "emotional contagion", "metacognition", "none of the given"], answer: 2 }, /*[cite: 24] */
  { question: "Which of the following is not true about management of emotions?", options: ["It is essentially a private act", "It is directly regulated by others", "It is influenced by cultural norms", "It is influenced by what society defines as appropriate to feel and express"], answer: 1 }, /*[cite: 24] */

  /* -------- SET 7 (Week 7) -------- */
  { question: "Which of the following is false about learning according to Gagne's definition?", options: ["It is a change in human disposition", "It persists over a period of time", "It is simply ascribable to processes of growth", "None of the above"], answer: 2 }, /*[cite: 25] */
  { question: "Manual or physical skills come under component of Bloom's taxonomy.", options: ["Cognitive", "Affective", "Psychomotor", "Physical"], answer: 2 }, /*[cite: 25] */
  { question: "Reflection, learning and education was explored by", options: ["Carl Rogers", "John Watson", "Benjamin Bloom", "John Dewey"], answer: 3 }, /*[cite: 26] */
  { question: "The principles of refer to how close in time two events must be for a bond to be formed.", options: ["behavior", "reinforcement", "repetition", "contiguity"], answer: 3 }, /*[cite: 26] */
  { question: "gives information to learners about their success or failure concerning the task at hand.", options: ["Cognitive feedback", "Emotional feedback", "Reinforcement", "Physical feedback"], answer: 0 }, /*[cite: 26] */
  { question: "The orientation to learning has a quality of personal involvement-the whole person in both feeling and cognitive aspects being in the learning event.", options: ["behavioral", "cognitive", "humanistic", "social"], answer: 2 }, /*[cite: 27] */
  { question: "Learning through play is learning.", options: ["primary", "secondary", "passive", "active"], answer: 3 }, /*[cite: 27] */
  { question: "People with learning style are prone to sorting their ideas after speaking, rather than thinking ideas through before.", options: ["logical", "solitary", "visual", "auditory"], answer: 3 }, /*[cite: 27] */
  { question: "Which of the following statements is false?", options: ["Effective instruction is static", "Effective instruction is eclectic", "Effective instruction is generative", "Effective instruction is interactive"], answer: 0 }, /*[cite: 28] */
  { question: "In ADDIE model, I stand for", options: ["instruction", "implementation", "integration", "induction"], answer: 1 }, /*[cite: 28] */

  /* -------- SET 8 (Week 8) -------- */
  { question: "The word 'pedagogy' has been derived from the word \"pedagogue\".", options: ["Latin", "Sanskrit", "Greek", "English"], answer: 2 }, /*[cite: 29] */
  { question: "Which of the following statements is not true about pedagogy?", options: ["It is a method or way of teaching", "It is derived from the Greek word \"pedagogue\"", "It helps a teacher understand how learning should be facilitated.", "It harms the quality of teaching and learning."], answer: 3 }, /*[cite: 29] */
  { question: "Pedagogy can enhance the student-teacher relationship.", options: ["True", "False"], answer: 0 }, /*[cite: 29] */
  { question: "learning is based on the model that knowledge can be created within a population where members actively interact by sharing experiences and take on asymmetry roles.", options: ["integrative", "inquiry-based", "collaborative", "constructivist"], answer: 2 }, /*[cite: 30] */
  { question: "The Pedagogical Model provides an overview of the learning cycle and breaks it down into domains or phases of instruction.", options: ["five", "three", "two", "seven"], answer: 0 }, /*[cite: 30] */
  { question: "Which of the following is not a type of inquiry-based approach?", options: ["confrontation", "structure", "guided", "open"], answer: 0 }, /*[cite: 30] */
  { question: "In experiential learning, students are engaged", options: ["intellectually", "soulfully", "socially", "all of the given"], answer: 3 }, /*[cite: 31] */
  { question: "stage of experiential theory by Kolb focuses on planning.", options: ["concrete experience", "abstract conceptualization", "reflective observation", "active experimentation"], answer: 3 }, /*[cite: 31] */
  { question: "People with a learning style can often act on \"gut feeling\" and will rely on others' analysis rather than their own.", options: ["accommodating", "converging", "diverging", "assimilating"], answer: 0 }, /*[cite: 31] */
  { question: "According to the principle, students learn better from animation and narration than from animation and on-screen text.", options: ["multimedia", "modality", "coherence", "temporal contiguity"], answer: 1 }, /*[cite: 32] */

  /* -------- SET 9 (Week 9) -------- */
  { question: "E-learning is any form of", options: ["teaching", "training", "tutoring", "all of the given"], answer: 3 }, /*[cite: 33] */
  { question: "is a feature of e-learning.", options: ["difficulty in access", "user friendliness", "social injustice", "closed learning"], answer: 1 }, /*[cite: 33] */
  { question: "E-learning is a synonym of audio-visual learning, multimedia learning, and distance learning.", options: ["True", "False"], answer: 1 }, /*[cite: 34] */
  { question: "Which of the following is not a type of e-learning?", options: ["text-driven", "interactive", "simulation", "physical"], answer: 3 }, /*[cite: 34] */
  { question: "Which of the following is not a benefit of e-learning?", options: ["It can accommodate the need of a housewife", "People can revise the learning content as many times as they want", "It facilitates in developing and communicating new training policies", "None of the given"], answer: 3 }, /*[cite: 34] */
  { question: "Good learners know", options: ["What they are learning", "Why they are learning", "How they are learning", "All of the given"], answer: 3 }, /*[cite: 35] */
  { question: "Learners may multitask when engaging in an online course, which could be resulting in", options: ["hyperfocus", "better retrieval", "shorter attention spans", "None of the given"], answer: 2 }, /*[cite: 35] */
  { question: "learning is the crucial determinant of successful e-learning.", options: ["passive", "retrospective", "social", "active"], answer: 3 }, /*[cite: 35] */
  { question: "The brain can process 36,000 visual cues per", options: ["hour", "second", "day", "year"], answer: 0 }, /*[cite: 36] */
  { question: "For effective learning, online courses should", options: ["use headings", "use complex language", "present long pieces of text", "use random images"], answer: 0 }, /*[cite: 36] */

  /* -------- SET 10 (Week 10) -------- */
  { question: "During Covid-19 the world was busy in preparing 1.5 billion learners for the new normal, i.e., learning.", options: ["ineffective", "physical", "remote", "experiential"], answer: 2 }, /*[cite: 37] */
  { question: "To develop learner readiness for online learning, training sessions on are helpful.", options: ["netiquettes", "time management", "developing study skills", "all of the given"], answer: 3 }, /*[cite: 37] */
  { question: "The typical picture of a teacher being a dispenser of knowledge to the students has been replaced by that of a", options: ["obstructor", "parent", "friend", "facilitator"], answer: 3 }, /*[cite: 38] */
  { question: "In 2018, Global Education and Skills Forum noted that the 'future' teacher would need the 5 skills to thrive in the 21st century. Which of the following is not one of them?", options: ["Strong social skills", "Data analysis", "External focus", "Strictness"], answer: 3 }, /*[cite: 38] */
  { question: "Participatory education demands so as to build a needs-based approach to teaching.", options: ["creativity", "stubbornness", "reward", "none of the given"], answer: 0 }, /*[cite: 38] */
  { question: "Students who consider intelligence as a malleable entity tend to focus on their obstacles instead of goals.", options: ["True", "False"], answer: 1 }, /*[cite: 39] */
  { question: "Which of the following is not a principle to enhance student learning.", options: ["What students already know affects their learning", "Learning is context-based", "Students' cognitive development and learning is limited by the general stages of development.", "The acquisition of knowledge and skills in the long term depends largely on practice."], answer: 2 }, /*[cite: 39] */
  { question: "feedback to students is important for learning.", options: ["Unclear", "Late", "Harsh", "Explanatory"], answer: 3 }, /*[cite: 39] */
  { question: "Mastery goals are those that are geared towards the acquisition or improvement of", options: ["Skills", "Number of students in a classroom", "Teacher feedback", "None of the given"], answer: 0 }, /*[cite: 40] */
  { question: "The vast majority of formative assessment is", options: ["Formal", "Incorrect", "Written", "informal"], answer: 3 }, /*[cite: 40] */
  /* -------- SET 11 (Week 11) -------- */
  { question: "There is one universal curriculum to become a sustainable leader.", options: ["True", "False"], answer: 1 },
  { question: "A sustainable leader has a ___ decision-making style.", options: ["forceful", "autocratic", "selfish", "consensual"], answer: 3 },
  { question: "A sustainable leader must have awareness of ___ contexts.", options: ["ecological", "economic", "political", "all of the given"], answer: 3 },
  { question: "The 'results' component of sustainable leadership relates with the ___ dimension.", options: ["institutional", "social", "environmental", "economic"], answer: 3 },
  { question: "___ India gives a theory U that consists of aspects like co-initiating, co-sensing and co-evolving among others.", options: ["HEAD", "SAID", "GEAD", "LEAD"], answer: 3 },
  { question: "The ___ component in theory 'U' entails prototyping the new.", options: ["co-evolving", "co-initiating", "co-sensing", "co-creating"], answer: 3 },
  { question: "Which of the following factor does not aid in becoming a global leader?", options: ["willingness to stay in one's comfort zone", "undesirable circumstances like poverty", "confidence to embrace risk", "willingness to learn from failure"], answer: 0 },
  { question: "According to Maxwell, there are ___ levels of leadership.", options: ["15", "25", "50", "5"], answer: 3 },
  { question: "The ___, in relation to their Global Leadership Fellowship program, describes global leaders as dynamic, engaged and driven individuals who possess a high degree of intellectual curiosity and service-oriented humility; an entrepreneur in the global public interest with a profound sense of purpose regardless of the scale and scope of the challenge.", options: ["World Health Organization", "World Labor Organization", "World Economic Forum", "World Political Forum"], answer: 2 },
  { question: "SDG ___ is to make cities and human settlements inclusive, safe, resilient, and sustainable.", options: ["2", "10", "11", "5"], answer: 2 },

  /* -------- SET 12 (Week 12) -------- */
  { question: "___resources are those that exist in the absence of human intervention.", options: ["Artificial", "Natural", "Fake", "Real"], answer: 1 },
  { question: "The food sector accounts for around ___ percent of total greenhouse gas emissions.", options: ["3", "22", "100", "90"], answer: 1 },
  { question: "Which of the following is not a solution for natural resource depletion?", options: ["use less renewable energy", "promote sustainable fishing growth", "reduce food waste", "treat wastewater before discharging"], answer: 0 },
  { question: "In order to support reform on green fiscal policy, UN Environment has established the ____ in partnership with the International Monetary Fund.", options: ["Green Fiscal Policy Network", "Blue Fiscal Policy Network", "Green Fishery Policy Network", "Green Fiscal Policy Natural"], answer: 0 },
  { question: "As responsible consumers, we should ask ourselves \"___\" before buying anything.", options: ["do I really need it?", "how long will I use it?", "can I borrow it from someone I know?", "all of the given"], answer: 3 },
  { question: "A bulb thrown out after usage forms ___.", options: ["wet waste", "valuable waste", "responsible waste", "e-waste"], answer: 3 },
  { question: "SDG _____ seeks to promote international trade, and help developing countries increase their exports to ensure a universal rules-based and equitable trading system that is fair, open and beneficial to all.", options: ["17", "2", "6", "11"], answer: 0 },
  { question: "According to Gandhiji, wealth should be used for _____.", options: ["the betterment of the humanity", "personal indulgence", "conflicts", "politics"], answer: 0 },
  { question: "The _____ initiated and spearheaded by Gandhiji is the preeminent prototype of small and cottage industries. Strengthening village economy, and thus, reducing excessive urbanization can make human settlements safe, resilient and sustainable.", options: ["Khadi Movement", "Salt March", "Cotton Movement", "Non-violent Protest"], answer: 0 },
  { question: "_________ is the ability of a system to absorb disturbances & retain its basic function and structure.", options: ["resilience", "gratitude", "mindfulness", "sustainable consumption"], answer: 0 }
];

// Assign unit index if not explicitly defined (10 questions per unit)
allQuestions.forEach((q, index) => {
  if (q.unit === undefined) {
    q.unit = Math.floor(index / 10);
  }
});

/* ==========================================================================
   INITIALIZATION & THEME MANAGEMENT
   ========================================================================== */
const COLOR_THEMES = {
  default: { name: "Default Slate", label: "Theme", color: "#6366f1" },
  sage: { name: "Forest Sage", label: "Sage", color: "#10b981" },
  ocean: { name: "Ocean Mist", label: "Ocean", color: "#0284c7" },
  parchment: { name: "Warm Parchment", label: "Parchment", color: "#d97706" },
  lavender: { name: "Lavender Mist", label: "Lavender", color: "#8b5cf6" },
  peach: { name: "Desert Blossom", label: "Blossom", color: "#e11d48" }
};

let activeColorTheme = "default";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initColorTheme();
  initNameInput();
  initQuickCountChips();
  initLearnFilters();
});

function initTheme() {
  const savedTheme = localStorage.getItem("selfquiz_theme");
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  updateThemeButtonUI();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("selfquiz_theme", isDark ? "dark" : "light");
  updateThemeButtonUI();
}

function updateThemeButtonUI() {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;
  const isDark = document.body.classList.contains("dark");
  btn.innerHTML = isDark ? `☀️ Light` : `🌙 Dark`;
  btn.title = isDark ? "Switch to eye-friendly light mode" : "Switch to soothing dark mode";
}

/* --- Peaceful Color Palette Management --- */
function initColorTheme() {
  const savedColor = localStorage.getItem("selfquiz_color_theme") || "default";
  applyColorTheme(savedColor);

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    const wrapper = document.getElementById("theme-dropdown-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      closeThemeMenu();
    }
  });

  // Close dropdown on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeThemeMenu();
    }
  });
}

function toggleThemeMenu() {
  const dropdown = document.getElementById("theme-menu-dropdown");
  const wrapper = document.getElementById("theme-dropdown-wrapper");
  const btn = document.getElementById("theme-menu-btn");
  if (!dropdown || !wrapper) return;

  const isOpen = dropdown.style.display !== "none";
  if (isOpen) {
    closeThemeMenu();
  } else {
    dropdown.style.display = "block";
    wrapper.classList.add("open");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }
}

function closeThemeMenu() {
  const dropdown = document.getElementById("theme-menu-dropdown");
  const wrapper = document.getElementById("theme-dropdown-wrapper");
  const btn = document.getElementById("theme-menu-btn");
  if (dropdown) dropdown.style.display = "none";
  if (wrapper) wrapper.classList.remove("open");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function selectTheme(themeId) {
  applyColorTheme(themeId);
  localStorage.setItem("selfquiz_color_theme", themeId);
  closeThemeMenu();
}

function applyColorTheme(themeId) {
  if (!COLOR_THEMES[themeId]) {
    themeId = "default";
  }
  activeColorTheme = themeId;

  if (themeId === "default") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.setAttribute("data-theme", themeId);
  }

  // Update theme option active indicator in menu
  const items = document.querySelectorAll(".theme-option-item");
  items.forEach(item => {
    if (item.getAttribute("data-theme-id") === themeId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update button label and color dot
  const themeMeta = COLOR_THEMES[themeId];
  const labelEl = document.getElementById("theme-menu-label");
  const swatchEl = document.getElementById("theme-indicator-swatch");
  if (labelEl) {
    labelEl.innerText = themeMeta.label || "Theme";
  }
  if (swatchEl) {
    swatchEl.style.backgroundColor = themeMeta.color;
  }
}

function initNameInput() {
  const savedName = localStorage.getItem("selfquiz_username");
  const nameInput = document.getElementById("username");
  if (nameInput && savedName) {
    nameInput.value = savedName;
  }
}

/* ==========================================================================
   TAB NAVIGATION (QUIZ MODE vs LEARN IT MODE)
   ========================================================================== */
function switchTab(tab) {
  currentTab = tab;

  const quizTabBtn = document.getElementById("tab-quiz-btn");
  const learnTabBtn = document.getElementById("tab-learn-btn");
  const quizSection = document.getElementById("quiz-section");
  const learnSection = document.getElementById("learn-section");

  if (tab === "quiz") {
    quizTabBtn.classList.add("active");
    learnTabBtn.classList.remove("active");
    quizSection.style.display = "block";
    learnSection.style.display = "none";
  } else {
    learnTabBtn.classList.add("active");
    quizTabBtn.classList.remove("active");
    quizSection.style.display = "none";
    learnSection.style.display = "block";
    renderLearnMode();
  }
}

/* ==========================================================================
   PRACTICE QUIZ CONFIGURATION & LOGIC
   ========================================================================== */
function setQuizMode(mode) {
  const cardShuffle = document.getElementById("mode-card-shuffle");
  const cardUnit = document.getElementById("mode-card-unit");
  const unitGroup = document.getElementById("unit-select-group");
  const radioShuffle = document.getElementById("mode-shuffle");
  const radioUnit = document.getElementById("mode-unit");

  if (mode === "unit") {
    radioUnit.checked = true;
    cardUnit.classList.add("selected");
    cardShuffle.classList.remove("selected");
    unitGroup.style.display = "flex";
  } else {
    radioShuffle.checked = true;
    cardShuffle.classList.add("selected");
    cardUnit.classList.remove("selected");
    unitGroup.style.display = "none";
  }
  updateAvailableQuestionHint();
}

function initQuickCountChips() {
  const chips = document.querySelectorAll(".chip-btn");
  const numInput = document.getElementById("num");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const val = chip.getAttribute("data-val");

      if (val === "all") {
        const currentPool = getActiveQuestionPool();
        numInput.value = currentPool.length;
      } else {
        numInput.value = val;
      }
    });
  });

  if (numInput) {
    numInput.addEventListener("input", () => {
      chips.forEach(c => c.classList.remove("active"));
    });
  }
}

function getActiveQuestionPool() {
  const mode = document.querySelector('input[name="quiz-mode"]:checked')?.value || "shuffle";
  if (mode === "unit") {
    const unitVal = parseInt(document.getElementById("unit-select").value);
    if (!isNaN(unitVal)) {
      return allQuestions.filter(q => q.unit === unitVal);
    }
  }
  return allQuestions;
}

function updateAvailableQuestionHint() {
  const pool = getActiveQuestionPool();
  const hintEl = document.getElementById("pool-count-hint");
  if (hintEl) {
    hintEl.innerText = `(${pool.length} questions available)`;
  }
}

function startQuiz() {
  const nameInput = document.getElementById("username");
  const name = nameInput.value.trim();
  if (!name) {
    alert("Please enter your name to start the quiz.");
    nameInput.focus();
    return;
  }
  localStorage.setItem("selfquiz_username", name);
  window.username = name;

  const questionPool = getActiveQuestionPool();
  const mode = document.querySelector('input[name="quiz-mode"]:checked')?.value || "shuffle";

  if (mode === "unit") {
    const unitVal = parseInt(document.getElementById("unit-select").value);
    if (isNaN(unitVal)) {
      alert("Please select a specific Unit / Week from the dropdown.");
      return;
    }
  }

  const numInput = document.getElementById("num");
  let n = parseInt(numInput.value);
  if (!n || n <= 0) {
    alert("Please enter a valid number of questions.");
    numInput.focus();
    return;
  }

  if (n > questionPool.length) {
    n = questionPool.length;
    numInput.value = n;
  }

  // Shuffle question pool and pick N questions
  const shuffledPool = shuffleArray([...questionPool]);
  selectedQuestions = shuffledPool.slice(0, n).map(q => {
    // Deep clone
    const clone = JSON.parse(JSON.stringify(q));
    const correctText = clone.options[clone.answer];
    // Shuffle options so they aren't always in identical positions
    shuffleArray(clone.options);
    clone.answer = clone.options.indexOf(correctText);
    return clone;
  });

  userAnswers = {};

  // Setup UI for Active Quiz
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-status-bar").style.display = "flex";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("quiz-actions").style.display = "flex";
  document.getElementById("result-card").style.display = "none";

  // Badge info
  const unitBadge = document.getElementById("quiz-unit-badge");
  if (mode === "unit") {
    const unitVal = document.getElementById("unit-select").value;
    unitBadge.style.display = "inline-block";
    unitBadge.innerText = `Week ${unitVal}`;
  } else {
    unitBadge.style.display = "inline-block";
    unitBadge.innerText = `All Units (${selectedQuestions.length} Qs)`;
  }

  // Timer: 12 seconds per question
  timeLeft = selectedQuestions.length * 12;
  startTimer();

  renderQuizQuestions();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer() {
  clearInterval(timerInterval);
  const timerPill = document.getElementById("timer-pill");
  const timerText = document.getElementById("timer-text");

  function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    timerText.innerText = formatted;

    if (timeLeft <= 15 && timeLeft > 5) {
      timerPill.className = "timer-pill warning";
    } else if (timeLeft <= 5) {
      timerPill.className = "timer-pill danger";
    } else {
      timerPill.className = "timer-pill";
    }
  }

  updateDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      alert("⏱️ Time is up! Submitting your answers now.");
      submitQuiz();
    } else {
      updateDisplay();
    }
  }, 1000);
}

function renderQuizQuestions() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  selectedQuestions.forEach((q, qIndex) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.id = `q-card-${qIndex}`;

    const optionLetters = ["A", "B", "C", "D", "E", "F"];

    let optionsHtml = "";
    q.options.forEach((opt, optIndex) => {
      const letter = optionLetters[optIndex] || String.fromCharCode(65 + optIndex);
      optionsHtml += `
        <label class="option-label" id="opt-label-${qIndex}-${optIndex}">
          <input type="radio" name="question_${qIndex}" value="${optIndex}" onchange="selectOption(${qIndex}, ${optIndex})">
          <span class="option-letter">${letter}</span>
          <span class="option-text">${escapeHtml(opt)}</span>
        </label>
      `;
    });

    card.innerHTML = `
      <div class="question-header">
        <span class="q-number">${qIndex + 1}</span>
        <div class="q-text">${escapeHtml(q.question)}</div>
      </div>
      <div class="options-stack">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(card);
  });

  updateProgressBadge();
}

function selectOption(qIndex, optIndex) {
  userAnswers[qIndex] = optIndex;

  // Visual selection highlighting
  const labels = document.querySelectorAll(`[id^="opt-label-${qIndex}-"]`);
  labels.forEach(l => l.classList.remove("selected"));

  const targetLabel = document.getElementById(`opt-label-${qIndex}-${optIndex}`);
  if (targetLabel) {
    targetLabel.classList.add("selected");
  }

  updateProgressBadge();
}

function updateProgressBadge() {
  const answeredCount = Object.keys(userAnswers).length;
  const total = selectedQuestions.length;
  const pill = document.getElementById("progress-pill");
  if (pill) {
    pill.innerText = `Answered: ${answeredCount} / ${total}`;
  }
}

function submitQuiz() {
  clearInterval(timerInterval);

  let score = 0;
  const total = selectedQuestions.length;

  selectedQuestions.forEach((q, qIndex) => {
    const card = document.getElementById(`q-card-${qIndex}`);
    const selectedAnswer = userAnswers[qIndex];
    const isCorrect = selectedAnswer === q.answer;

    if (isCorrect) {
      score++;
      card.classList.add("status-correct");
    } else {
      card.classList.add("status-wrong");
    }

    // Style each option label
    q.options.forEach((_, optIndex) => {
      const label = document.getElementById(`opt-label-${qIndex}-${optIndex}`);
      if (!label) return;

      const input = label.querySelector("input");
      if (input) input.disabled = true;

      // If this was the correct answer
      if (optIndex === q.answer) {
        label.classList.add("is-correct");
      }

      // If user selected this wrong option
      if (selectedAnswer !== undefined && selectedAnswer === optIndex && !isCorrect) {
        label.classList.add("is-wrong");
      }
    });

    // Append explanation note
    const explanation = document.createElement("div");
    if (isCorrect) {
      explanation.className = "answer-explanation correct-note";
      explanation.innerHTML = `<span>✓</span> Correct! You chose ${String.fromCharCode(65 + q.answer)}: ${escapeHtml(q.options[q.answer])}`;
    } else {
      explanation.className = "answer-explanation wrong-note";
      const userText = selectedAnswer !== undefined ? `${String.fromCharCode(65 + selectedAnswer)}: ${escapeHtml(q.options[selectedAnswer])}` : "No answer selected";
      explanation.innerHTML = `<span>✕</span> Your answer: ${userText} &nbsp;•&nbsp; <strong>Correct: ${String.fromCharCode(65 + q.answer)}: ${escapeHtml(q.options[q.answer])}</strong>`;
    }
    card.appendChild(explanation);
  });

  // Display Result Card
  const percentage = Math.round((score / total) * 100);
  document.getElementById("score-num").innerText = score;
  document.getElementById("score-denom").innerText = `/ ${total}`;
  document.getElementById("result-percentage").innerText = `${percentage}% Accuracy`;

  let verdict = "Keep practicing! You can do better 💪";
  if (percentage === 100) verdict = "Perfect Score! Outstanding Mastery! 🌟";
  else if (percentage >= 80) verdict = "Great job! Excellent understanding! 🎉";
  else if (percentage >= 50) verdict = "Good effort! Review the incorrect questions below 📖";

  document.getElementById("result-verdict").innerText = verdict;
  document.getElementById("result-card").style.display = "block";
  document.getElementById("quiz-status-bar").style.display = "none";
  document.getElementById("quiz-actions").style.display = "none";

  // Scroll smoothly to top of result
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Record Attempt in Firebase
  saveAttemptToFirebase(score, total);
}

function saveAttemptToFirebase(score, total) {
  try {
    if (typeof db !== "undefined" && db && db.collection) {
      db.collection("users")
        .doc(uid)
        .collection("attempts")
        .add({
          name: window.username || "Anonymous",
          score: Number(score),
          total: Number(total),
          time: new Date().toLocaleString()
        })
        .catch(err => {
          console.warn("Firebase save skipped or network error:", err);
        });
    }
  } catch (e) {
    console.warn("Could not save to Firebase:", e);
  }
}

function restartQuiz() {
  clearInterval(timerInterval);
  selectedQuestions = [];
  userAnswers = {};

  document.getElementById("quiz-container").innerHTML = "";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("result-card").style.display = "none";
  document.getElementById("quiz-status-bar").style.display = "none";
  document.getElementById("quiz-actions").style.display = "none";
  document.getElementById("start-screen").style.display = "block";

  updateAvailableQuestionHint();
}

/* ==========================================================================
   "LEARN IT" MODE (STUDY DECK)
   Where question, all options, and the correct answer are visibly presented
   to make memorization and review effortless and stress-free.
   ========================================================================== */
function initLearnFilters() {
  const select = document.getElementById("learn-unit-select");
  if (!select) return;

  select.innerHTML = `<option value="all">All Units (Weeks 0 - 12)</option>`;
  for (let i = 0; i <= 12; i++) {
    select.innerHTML += `<option value="${i}">Week ${i}</option>`;
  }
}

function renderLearnMode() {
  const unitFilter = document.getElementById("learn-unit-select")?.value || "all";
  const searchFilter = (document.getElementById("learn-search-input")?.value || "").toLowerCase().trim();
  const container = document.getElementById("learn-cards-container");
  if (!container) return;

  // Filter questions
  let filtered = allQuestions.filter(q => {
    // Unit condition
    if (unitFilter !== "all" && q.unit !== parseInt(unitFilter)) {
      return false;
    }
    // Search keyword condition
    if (searchFilter) {
      const matchQ = q.question.toLowerCase().includes(searchFilter);
      const matchOpts = q.options.some(opt => opt.toLowerCase().includes(searchFilter));
      if (!matchQ && !matchOpts) return false;
    }
    return true;
  });

  // Update counter stats
  const statsEl = document.getElementById("learn-count-stats");
  if (statsEl) {
    statsEl.innerText = `Showing ${filtered.length} of ${allQuestions.length} questions`;
  }

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🔍</span>
        <h3>No questions found</h3>
        <p>Try searching for a different keyword or switch to another Unit.</p>
      </div>
    `;
    return;
  }

  const optionLetters = ["A", "B", "C", "D", "E", "F"];

  filtered.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "learn-card";

    let optionsHtml = "";
    q.options.forEach((opt, optIndex) => {
      const letter = optionLetters[optIndex] || String.fromCharCode(65 + optIndex);
      const isCorrect = optIndex === q.answer;

      optionsHtml += `
        <div class="learn-opt-item ${isCorrect ? 'is-correct-answer' : ''}">
          <span class="learn-opt-letter">${letter}</span>
          <span class="option-text">${escapeHtml(opt)}</span>
          ${isCorrect ? `<span class="correct-badge">✓ Correct Answer</span>` : ""}
        </div>
      `;
    });

    card.innerHTML = `
      <div class="learn-card-top">
        <div class="learn-card-meta">
          <span class="unit-badge">Week ${q.unit !== undefined ? q.unit : Math.floor(index / 10)}</span>
          <span class="learn-q-index">Question #${index + 1}</span>
        </div>
      </div>
      <div class="learn-question-text">${escapeHtml(q.question)}</div>
      <div class="learn-options">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(card);
  });
}

function clearLearnSearch() {
  const input = document.getElementById("learn-search-input");
  if (input) {
    input.value = "";
    renderLearnMode();
  }
}

/* ==========================================================================
   UTILITIES
   ========================================================================== */
function escapeHtml(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
