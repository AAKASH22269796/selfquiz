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
  { question: "What is Psychology?", options: ["Just a social media trend", "An art of living", "A subject about human body", "A study of cognitive processes & behavior"], answer: 3 }, /*[cite: 46]*/
  { question: "A broad field of study that explores a variety of questions about thoughts, feelings and actions is ___?", options: ["Society", "Globalization", "Psychology", "Social Science"], answer: 2 }, /*[cite: 46]*/
  { question: "Learning has been a central topic of research in ___ .", options: ["Chemistry", "Physics", "Mathematics", "Psychology"], answer: 3 }, /*[cite: 46]*/
  { question: "The word Psyche means ___?", options: ["Body or physique", "Mind or soul", "Spirituality", "Hormones"], answer: 1 }, /*[cite: 47]*/
  { question: "The ___ of learning focuses on how people learn.", options: ["psychology", "english", "chemistry", "none of the given"], answer: 0 }, /*[cite: 47]*/
  { question: "\"To help people to function effectively and fulfill their own unique potential\" is the aim of ___?", options: ["Humanistic psychology", "Evolutionary biology", "Computer science", "Microbiology"], answer: 0 }, /*[cite: 47]*/
  { question: "Psychology is not an independent science, but dependent on other fields.", options: ["True", "False"], answer: 1 }, /*[cite: 47]*/
  { question: "The study of changes in an individual's behavior during his/her lifetime is called ___ .", options: ["Hormonal psychology", "Gender psychology", "Developmental Psychology", "Genetics or Heredity"], answer: 2 }, /*[cite: 48]*/
  { question: "The study of differences and similarities in the behavior of animals of different species is called ___ .", options: ["Developmental psychology", "Cultural psychology", "Personality psychology", "Comparative Psychology"], answer: 3 }, /*[cite: 48]*/
  { question: "Humans are incapable of learning.", options: ["True", "False"], answer: 1 }, /*[cite: 48]*/
  /* -------- SET 1 (Week 1) -------- */
  { question: "Learning is often seen as the contiguous causal effect of ___ on behavior.", options: ["blood", "bone density", "trauma", "experience"], answer: 3 }, /*[cite: 6] */
  { question: "In order to say that learning has occurred, a hidden change in behavior must occur.", options: ["True", "False"], answer: 1 }, /*[cite: 6] */
  { question: "Which of the following is not a mental construct?", options: ["skeleton", "knowledge", "representations", "associations"], answer: 0 }, /*[cite: 7] */
  { question: "Learning changes the ___ structure of the brain through the process of continuous interactions between the learner and the external environment.", options: ["physical", "social", "biological", "none of the given"], answer: 0 }, /*[cite: 7] */
  { question: "___ shapes the learning process.", options: ["Only thoughts", "Only emotions", "Both thoughts and emotions", "Neither thoughts nor emotions"], answer: 2 }, /*[cite: 7] */
  { question: "Watson's work included the famous Little Albert experiment in which he conditioned a small child to ___ a white rat.", options: ["fear", "love", "hate", "play with"], answer: 0 }, /*[cite: 8] */
  { question: "Behaviorism dominated psychology for much of the early ___ century.", options: ["20th", "19th", "18th", "17th"], answer: 0 }, /*[cite: 8] */
  { question: "The state of \"conscious incompetence\" may be valuable ___ of a learning experience.", options: ["at the end", "in the middle", "2 years after the end", "at the start"], answer: 3 }, /*[cite: 8] */
  { question: "Which of the following is not an outcome of effective e-learning?", options: ["wider range of strategies", "more reflective approach", "more positive emotions towards learning", "more disconnected knowledge"], answer: 3 }, /*[cite: 9] */
  { question: "Instrumental conditioning is an example of ___ learning.", options: ["sensitization", "habituation", "associative", "meaningful"], answer: 2 }, /*[cite: 9] */

  /* -------- SET 2 (Week 2) -------- */
  { question: "The three major types of learning described by ___ psychology are classical conditioning, operant conditioning and observational learning.", options: ["cognitive", "behavioral", "emotional", "evolutionary"], answer: 1 }, /*[cite: 10] */
  { question: "According to the view of Watson, psychology is ___ .", options: ["subjective", "only descriptive", "experimental", "about internal mental processes that cannot be measured and observed"], answer: 2 }, /*[cite: 10] */
  { question: "___ is given by Ivan Pavlov.", options: ["Operant conditioning", "Functional conditioning", "Classical conditioning", "Modern conditioning"], answer: 2 }, /*[cite: 11] */
  { question: "The process by which organisms learn to respond to certain stimuli but not to others is known as ___ .", options: ["stimulus generalization", "stimulus appreciation", "stimulus discrimination", "stimulus differentiation"], answer: 2 }, /*[cite: 11] */
  { question: "Higher-order conditioning is intrinsically weaker than its first-order counterpart.", options: ["True", "False"], answer: 0 }, /*[cite: 11] */
  { question: "___ is the process of gradually changing the quality of a response.", options: ["Shaping", "Modeling", "Cueing", "Shifting"], answer: 0 }, /*[cite: 12] */
  { question: "The works of ___ were instrumental in engendering the dramatic shift from behaviorism to cognitive theories.", options: ["Edward C. Tolman", "Jean Piaget", "German Gestalt", "All of the given"], answer: 3 }, /*[cite: 12] */
  { question: "___ intelligence is the ability to perceive the visual-spatial world accurately and involves sensitivity to color, line, shape, form, space, and the potential for recognizing and manipulating the patterns of spaces.", options: ["Interpersonal", "Spatial", "Bodily-kinesthetic", "Linguistic"], answer: 1 }, /*[cite: 12] */
  { question: "Sternberg proposed his theory in 1985 as an alternative to the idea of the ___ .", options: ["general intelligence factor", "multiple intelligences", "specific intelligence factor", "unconscious intelligence"], answer: 0 }, /*[cite: 13] */
  { question: "Which of the following is not a kind of product in the structure of intellect model?", options: ["symbolic", "classes", "systems", "implications"], answer: 0 }, /*[cite: 13] */

  /* -------- SET 3 (Week 3) -------- */
  { question: "The connections between nerves cells are called ___ .", options: ["systems", "syntaxes", "neurons", "synapses"], answer: 3 }, /*[cite: 14] */
  { question: "In order to create a ___ , information must be changed into a usable form, which occurs through a process known as encoding.", options: ["past memory", "new imagination", "new memory", "past imagination"], answer: 2 }, /*[cite: 14] */
  { question: "Calling back the stored information in response to some cue for use in a process or activity is called ___ .", options: ["Retrieval", "Recall", "Recollection", "All of the given"], answer: 3 }, /*[cite: 15] */
  { question: "For many with ___ deficits, reading facial expressions and knowing how to respond are confusing daily challenges.", options: ["memory", "intelligence", "social cognition", "biological cognition"], answer: 2 }, /*[cite: 15] */
  { question: "The Information Processing View of Learning assumes that there are limits to how much information can be processed at each stage.", options: ["True", "False"], answer: 0 }, /*[cite: 15] */
  { question: "The Information Processing View of Learning assumes that information process is involved in ___", options: ["forgetting", "remembering", "perceiving", "All of the given"], answer: 3 }, /*[cite: 16] */
  { question: "The capacity of the sensory register is ___ .", options: ["very small", "very large", "7+/-2 chunks", "unlimited"], answer: 1 }, /*[cite: 16] */
  { question: "Most children do not begin to engage in the process of rehearsal on their own until about age ___ .", options: ["seven", "two", "thirteen", "one"], answer: 0 }, /*[cite: 16] */
  { question: "___ provides an interface between the sub-systems of working memory and the part of long term memory specialized for episodic memory.", options: ["Phonological loop", "Visuo-spatial sketchpad", "Retrieval buffer", "Episodic buffer"], answer: 3 }, /*[cite: 17] */
  { question: "Memories of specific episodes of one's life refers to ___ .", options: ["declarative memory", "experimental episodic memory", "autobiographical episodic memory", "procedural memory"], answer: 2 }, /*[cite: 17] */

  /* -------- SET 4 (Week 4) -------- */
  { question: "___ thinking is the ability to create mental representations of objects, places, events, or people in your mind.", options: ["General", "Creative", "Divergent", "Symbolic"], answer: 3 }, /*[cite: 18] */
  { question: "We compare new information to our ___ of the person, place, or thing, so we know how to categorize the new information mentally.", options: ["protofit", "protobite", "prototype", "none of the given"], answer: 2 }, /*[cite: 18] */
  { question: "Which of the following is not true?", options: ["Thinking is a higher mental process", "Thinking is a sub-vocal talking", "Thinking is fulfilling a need or problem solving", "Thinking is only done in verbal symbols"], answer: 3 }, /*[cite: 19] */
  { question: "Mental images are ___ .", options: ["Auditory", "Visual", "Gustatory", "All of the given"], answer: 3 }, /*[cite: 19] */
  { question: "___ organize complex phenomena into simpler, easily understandable, and usable categories and help to solve our problems.", options: ["Concepts", "Propositions", "Constructs", "Components"], answer: 0 }, /*[cite: 19] */
  { question: "The lowermost level of Bloom's taxonomy is ___ .", options: ["remember", "apply", "understand", "analyze"], answer: 0 }, /*[cite: 20] */
  { question: "The psychomotor domain of the Bloom's taxonomy is concerned with ___ .", options: ["Biological makeup", "Thoughts and beliefs", "Feelings and emotions", "Skilled behavior"], answer: 3 }, /*[cite: 20] */
  { question: "Which of the following is an example of meta-cognition skills?", options: ["Ignoring your limits", "Self-monitoring", "Skimming all important information", "All of the given"], answer: 1 }, /*[cite: 20] */
  { question: "___ critical thinking skill helps you analyze and process information to come to an unbiased conclusion.", options: ["Open-mindedness", "Self-regulation", "Self-control", "Observation"], answer: 0 }, /*[cite: 21] */
  { question: "The inspiration phase of the creative thinking process refers to the ___ stage.", options: ["Incubation", "Insight", "Evaluation", "Preparation"], answer: 3 }, /*[cite: 21] */

  /* -------- SET 5 (Week 5) -------- */
  { question: "Which of the following is true about motivation?", options: ["It is a physical impulse", "It is an external process", "It has a willingness to activate but not channel the attitudes of learners", "None of the given"], answer: 3 }, /*[cite: 22] */
  { question: "The term \"motivation\" comes from a ___ word.", options: ["Greek", "Latin", "Hindi", "Bengali"], answer: 1 }, /*[cite: 22] */
  { question: "It is called extrinsic motivation if causal factor is ___ .", options: ["curiosity", "social pressure", "self-satisfaction", "needs"], answer: 1 }, /*[cite: 23] */
  { question: "___ motivation is considered to be more crucial for students as it is associated with deep learning, better performance and self-efficacy.", options: ["Intrinsic", "Extrinsic", "Introjected regulation", "None of the given"], answer: 0 }, /*[cite: 23] */
  { question: "___ proposed that there are three primary drives that drive human behavior.", options: ["Hull", "Watson", "Piaget", "Gestalt"], answer: 0 }, /*[cite: 23] */
  { question: "Expectancy Theory of Motivation was developed by ___ .", options: ["Vroom", "Hull", "Murray", "None of the given"], answer: 0 }, /*[cite: 24] */
  { question: "An example of ___ is thinking, \"If I work hard I can achieve the targets my boss has set for me\".", options: ["purposeful", "valence", "instrumentality", "expectancy"], answer: 3 }, /*[cite: 24] */
  { question: "In SMART goals, T stands for ___ .", options: ["Temporary", "Time-based", "Tough", "Testing"], answer: 1 }, /*[cite: 24] */
  { question: "Friendship is a ___ need in Maslow's hierarchy.", options: ["Love and belonging", "Esteem", "Physiological", "Safety"], answer: 0 }, /*[cite: 25] */
  { question: "___ theory differentiates between autonomous motivation and controlled motivation.", options: ["Arousal", "Goal-setting", "Need hierarchy", "Self-determination"], answer: 3 }, /*[cite: 25] */

  /* -------- SET 6 (Week 6) -------- */
  { question: "According to Daniel Goleman, ___ component of emotional intelligence focuses on how we handle relationships with others.", options: ["self-awareness", "motivation", "empathy", "emotional regulation"], answer: 2 }, /*[cite: 26] */
  { question: "Emotional intelligence can be considered a type of ___ intelligence.", options: ["academic", "genetic", "social", "external"], answer: 2 }, /*[cite: 26] */
  { question: "Noticing a difficult emotion and slowing down or resisting any impulsive action that may follow highlights ___ component of emotional intelligence.", options: ["Self-regulation", "Motivation", "Emotional literacy", "Empathy"], answer: 0 }, /*[cite: 27] */
  { question: "The following are signs of emotional intelligence, except ___ .", options: ["strong sense of curiosity", "holding onto mistakes", "ability to manage emotions in difficult situations", "self-confidence"], answer: 1 }, /*[cite: 27] */
  { question: "Perceiving emotions means ___ .", options: ["Ignoring signals", "Understanding only what somebody is saying to you", "Understanding only somebody's facial expression", "Understanding both verbal and nonverbal signals"], answer: 3 }, /*[cite: 27] */
  { question: "___ suggests that 10 distinct components provide the scaffolding of emotionally and socially intelligent behaviors:", options: ["Bar-On", "Goleman", "Salovey", "Mayer"], answer: 0 }, /*[cite: 28] */
  { question: "Which of the following is a facilitator of EQ?", options: ["optimism", "happiness", "independence", "all of the given"], answer: 3 }, /*[cite: 28] */
  { question: "___ is a strategy for improving one's self-awareness.", options: ["rejecting feedback", "using critical self-talk daily", "developing a fixed mindset", "pursuing one's passion"], answer: 3 }, /*[cite: 28] */
  { question: "Having students create autobiographies is an example of creating opportunities for ___ .", options: ["emotional labor", "emotional contagion", "metacognition", "none of the given"], answer: 2 }, /*[cite: 29] */
  { question: "Which of the following is not true about management of emotions?", options: ["It is essentially a private act", "It is directly regulated by others", "It is influenced by cultural norms", "It is influenced by what society defines as appropriate to feel and express"], answer: 1 }, /*[cite: 29] */

  /* -------- SET 7 (Week 7) -------- */
  { question: "Which of the following is false about learning according to Gagne's definition?", options: ["It is a change in human disposition", "It persists over a period of time", "It is simply ascribable to processes of growth", "None of the above"], answer: 2 }, /*[cite: 30] */
  { question: "Manual or physical skills come under ___ component of Bloom's taxonomy.", options: ["Cognitive", "Affective", "Psychomotor", "Physical"], answer: 2 }, /*[cite: 30] */
  { question: "Reflection, learning and education was explored by ___ .", options: ["Carl Rogers", "John Watson", "Benjamin Bloom", "John Dewey"], answer: 3 }, /*[cite: 31] */
  { question: "The principles of ___ refer to how close in time two events must be for a bond to be formed.", options: ["behavior", "reinforcement", "repetition", "contiguity"], answer: 3 }, /*[cite: 31] */
  { question: "___ gives information to learners about their success or failure concerning the task at hand.", options: ["Cognitive feedback", "Emotional feedback", "Reinforcement", "Physical feedback"], answer: 0 }, /*[cite: 31] */
  { question: "The ___ orientation to learning has a quality of personal involvement-the whole person in both feeling and cognitive aspects being in the learning event.", options: ["behavioral", "cognitive", "humanistic", "social"], answer: 2 }, /*[cite: 32] */
  { question: "Learning through play is ___ learning.", options: ["primary", "secondary", "passive", "active"], answer: 3 }, /*[cite: 32] */
  { question: "People with ___ learning style are prone to sorting their ideas after speaking, rather than thinking ideas through before.", options: ["logical", "solitary", "visual", "auditory"], answer: 3 }, /*[cite: 32] */
  { question: "Which of the following statements is false?", options: ["Effective instruction is static", "Effective instruction is eclectic", "Effective instruction is generative", "Effective instruction is interactive"], answer: 0 }, /*[cite: 33] */
  { question: "In ADDIE model, I stand for ___ .", options: ["instruction", "implementation", "integration", "induction"], answer: 1 }, /*[cite: 33] */

  /* -------- SET 8 (Week 8) -------- */
  { question: "The word 'pedagogy' has been derived from the ___ word \"pedagogue\".", options: ["Latin", "Sanskrit", "Greek", "English"], answer: 2 }, /*[cite: 34] */
  { question: "Which of the following statements is not true about pedagogy?", options: ["It is a method or way of teaching", "It is derived from the Greek word \"pedagogue\"", "It helps a teacher understand how learning should be facilitated.", "It harms the quality of teaching and learning."], answer: 3 }, /*[cite: 34] */
  { question: "Pedagogy can enhance the student-teacher relationship.", options: ["True", "False"], answer: 0 }, /*[cite: 34] */
  { question: "___ learning is based on the model that knowledge can be created within a population where members actively interact by sharing experiences and take on asymmetry roles.", options: ["integrative", "inquiry-based", "collaborative", "constructivist"], answer: 2 }, /*[cite: 35] */
  { question: "The Pedagogical Model provides an overview of the learning cycle and breaks it down into ___ domains or phases of instruction.", options: ["five", "three", "two", "seven"], answer: 0 }, /*[cite: 35] */
  { question: "Which of the following is not a type of inquiry-based approach?", options: ["confrontation", "structure", "guided", "open"], answer: 0 }, /*[cite: 35] */
  { question: "In experiential learning, students are engaged ___ .", options: ["intellectually", "soulfully", "socially", "all of the given"], answer: 3 }, /*[cite: 36] */
  { question: "___ stage of experiential theory by Kolb focuses on planning.", options: ["concrete experience", "abstract conceptualization", "reflective observation", "active experimentation"], answer: 3 }, /*[cite: 36] */
  { question: "People with a ___ learning style can often act on \"gut feeling\" and will rely on others' analysis rather than their own.", options: ["accommodating", "converging", "diverging", "assimilating"], answer: 0 }, /*[cite: 36] */
  { question: "According to the ___ principle, students learn better from animation and narration than from animation and on-screen text.", options: ["multimedia", "modality", "coherence", "temporal contiguity"], answer: 1 }, /*[cite: 37] */

  /* -------- SET 9 (Week 9) -------- */
  { question: "E-learning is any form of ___ .", options: ["teaching", "training", "tutoring", "all of the given"], answer: 3 }, /*[cite: 38] */
  { question: "___ is a feature of e-learning.", options: ["difficulty in access", "user friendliness", "social injustice", "closed learning"], answer: 1 }, /*[cite: 38] */
  { question: "E-learning is a synonym of audio-visual learning, multimedia learning, and distance learning.", options: ["True", "False"], answer: 1 }, /*[cite: 39] */
  { question: "Which of the following is not a type of e-learning?", options: ["text-driven", "interactive", "simulation", "physical"], answer: 3 }, /*[cite: 39] */
  { question: "Which of the following is not a benefit of e-learning?", options: ["It can accommodate the need of a housewife", "People can revise the learning content as many times as they want", "It facilitates in developing and communicating new training policies", "None of the given"], answer: 3 }, /*[cite: 39] */
  { question: "Good learners know ___ .", options: ["What they are learning", "Why they are learning", "How they are learning", "All of the given"], answer: 3 }, /*[cite: 40] */
  { question: "Learners may multitask when engaging in an online course, which could be resulting in ___ .", options: ["hyperfocus", "better retrieval", "shorter attention spans", "None of the given"], answer: 2 }, /*[cite: 40] */
  { question: "___ learning is the crucial determinant of successful e-learning.", options: ["passive", "retrospective", "social", "active"], answer: 3 }, /*[cite: 40] */
  { question: "The brain can process 36,000 visual cues per ___ .", options: ["hour", "second", "day", "year"], answer: 0 }, /*[cite: 41] */
  { question: "For effective learning, online courses should ___ .", options: ["use headings", "use complex language", "present long pieces of text", "use random images"], answer: 0 }, /*[cite: 41] */

  /* -------- SET 10 (Week 10) -------- */
  { question: "During Covid-19 the world was busy in preparing 1.5 billion learners for the new normal, i.e., ___ learning.", options: ["ineffective", "physical", "remote", "experiential"], answer: 2 }, /*[cite: 42] */
  { question: "To develop learner readiness for online learning, training sessions on ___ are helpful.", options: ["netiquettes", "time management", "developing study skills", "all of the given"], answer: 3 }, /*[cite: 42] */
  { question: "The typical picture of a teacher being a dispenser of knowledge to the students has been replaced by that of a ___ .", options: ["obstructor", "parent", "friend", "facilitator"], answer: 3 }, /*[cite: 43] */
  { question: "In 2018, Global Education and Skills Forum noted that the 'future' teacher would need the 5 skills to thrive in the 21st century. Which of the following is not one of them?", options: ["Strong social skills", "Data analysis", "External focus", "Strictness"], answer: 3 }, /*[cite: 43] */
  { question: "Participatory education demands ___ so as to build a needs-based approach to teaching.", options: ["creativity", "stubbornness", "reward", "none of the given"], answer: 0 }, /*[cite: 43] */
  { question: "Students who consider intelligence as a malleable entity tend to focus on their obstacles instead of goals.", options: ["True", "False"], answer: 1 }, /*[cite: 44] */
  { question: "Which of the following is not a principle to enhance student learning.", options: ["What students already know affects their learning", "Learning is context-based", "Students' cognitive development and learning is limited by the general stages of development.", "The acquisition of knowledge and skills in the long term depends largely on practice."], answer: 2 }, /*[cite: 44] */
  { question: "___ feedback to students is important for learning.", options: ["Unclear", "Late", "Harsh", "Explanatory"], answer: 3 }, /*[cite: 44] */
  { question: "Mastery goals are those that are geared towards the acquisition or improvement of ___ .", options: ["Skills", "Number of students in a classroom", "Teacher feedback", "None of the given"], answer: 0 }, /*[cite: 45] */
  { question: "The vast majority of formative assessment is ___ .", options: ["Formal", "Incorrect", "Written", "informal"], answer: 3 }, /*[cite: 45] */
  /* -------- SET 11 (Week 11) -------- */
  { question: "Social cognition has a protracted development through infancy to", options: ["teenage", "old-age", "adulthood", "death"], answer: 2 }, /*[cite: 1] */
  { question: "Which of the following abilities comes under social cognition?", options: ["Face processing", "Joint attention", "Theory of mind", "All of the given"], answer: 3 }, /*[cite: 1] */
  { question: "Under social cognition, abilities involved in affective processing are often called", options: ["hot", "cold", "white", "black"], answer: 0 }, /*[cite: 1] */
  { question: "Social schemas refer to people's mental representations of social", options: ["values", "memories", "skills", "patterns"], answer: 3 }, /*[cite: 2] */
  { question: "During the earliest stages of development, children are very ___ -centric. They see the world from their own perspective and struggle to think about how other people may view the world.", options: ["selfish", "ego", "conscious", "emotional"], answer: 1 }, /*[cite: 2] */
  { question: "A theory of mind refers to a person's ability to understand and think about the ___ of other people.", options: ["behaviors", "family backgrounds", "mental states", "language"], answer: 2 }, /*[cite: 2, 3] */
  { question: "The same social behavior in one cultural setting might have a very different meaning and interpretation if it were to occur or be observed in another culture.", options: ["True", "False"], answer: 0 }, /*[cite: 3] */
  { question: "Social cognitive theory by Bandura focuses on concepts of", options: ["self-efficacy", "modeling", "observational learning", "all of the given"], answer: 3 }, /*[cite: 3] */
  { question: "The central tenet of Bandura's social-cognitive theory is that people seek to develop a sense of ___ over the important events in their lives.", options: ["agency", "dependency", "attachment", "emotion"], answer: 0 }, /*[cite: 3] */
  { question: "___ hypothesis suggests that social processes influence how information is selected, organized, integrated, and retrieved.", options: ["activation", "cognitive influence", "interaction", "social cue strength"], answer: 1 }, /*[cite: 4] */
  /* -------- SET 12 (Week 12) -------- */
  { question: "Sustainability in economic sustainability is ___ .", options: ["multidimensional", "bidimensional", "unidimensional", "none of the given"], answer: 0 }, /*[cite: 1]*/
  { question: "The term \"sustainable development\" was first mentioned in a book related to the 1972 UN Stockholm conference on ___ .", options: ["water", "poverty", "economic crisis", "human environment"], answer: 3 }, /*[cite: 1]*/
  { question: "Environmental sustainability focuses on impacts of processes, products and services on ___ .", options: ["water", "biodiversity", "human health", "all of the given"], answer: 3 }, /*[cite: 2]*/
  { question: "Which of the following does not come under social sustainability?", options: ["Labour practices", "Revenue generation", "Human rights", "Business ethics"], answer: 1 }, /*[cite: 2]*/
  { question: "SDG ___ focuses on clean water and sanitation.", options: ["1", "17", "6", "3"], answer: 2 }, /*[cite: 3]*/
  { question: "SDG 16 focuses on ___ .", options: ["No poverty", "No hunger", "Good health", "Peace and justice"], answer: 3 }, /*[cite: 3]*/
  { question: "On 20 October 2020, the Higher Education Sustainability Initiative (HESI) raised the flag of higher education as a driver for sustainable development and inclusive societies on the first day of the ___ 2020.", options: ["National Sustainability Meeting", "National Teachers Meeting", "Global Childrens’ Meeting", "Global Education Meeting"], answer: 3 }, /*[cite: 4]*/
  { question: "Education is related to all SDGs.", options: ["True", "False"], answer: 0 }, /*[cite: 4]*/
  { question: "Successful implementation of ESD requires a shift in focus from ___ .", options: ["teaching to learning", "learning to teaching", "reading to speaking", "knowing to ignoring"], answer: 0 }, /*[cite: 5]*/
  { question: "___ competency is the ability to reflect on one’s own role in the local community and (global) society.", options: ["collaboration", "self-awareness", "strategic", "normative"], answer: 1 } /*[cite: 5]*/
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

  // Adjust positioning on resize or orientation change
  window.addEventListener("resize", adjustThemeMenuPosition);
  window.addEventListener("orientationchange", adjustThemeMenuPosition);
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
    adjustThemeMenuPosition();
  }
}

function adjustThemeMenuPosition() {
  const dropdown = document.getElementById("theme-menu-dropdown");
  if (!dropdown || dropdown.style.display === "none") return;

  // Clear manual coordinates to let CSS responsive layout evaluate first
  dropdown.style.left = "";
  dropdown.style.right = "";

  const rect = dropdown.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  // Boundary guard for any mobile/desktop viewport edge collision:
  // If left edge overflows the screen (x < 6px)
  if (rect.left < 6) {
    dropdown.style.left = "0";
    dropdown.style.right = "auto";
  }
  // If right edge overflows the screen
  else if (rect.right > viewportWidth - 6) {
    dropdown.style.right = "0";
    dropdown.style.left = "auto";
  }
}

function closeThemeMenu() {
  const dropdown = document.getElementById("theme-menu-dropdown");
  const wrapper = document.getElementById("theme-dropdown-wrapper");
  const btn = document.getElementById("theme-menu-btn");
  if (dropdown) {
    dropdown.style.display = "none";
    dropdown.style.left = "";
    dropdown.style.right = "";
  }
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

  // Scroll to the very beginning of the page so the user never lands at the bottom
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
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

  // Reset scroll to top
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
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
