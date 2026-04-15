let timeLeft = 0;
let timerInterval;

let allQuestions = [

/* -------- SET 1 -------- */
{question:"The Global Goals were adopted by all United Nations member states in ___ as a universal call to action to end poverty, protect the planet and ensure peace and prosperity by ___.",options:["2025, 2080","2020, 2060","2012, 2050","2015, 2030"],answer:3},
{question:"Which of the following is true?",options:["The SDGs are a bold commitment to solely increase the GDP of India","Dealing with climate change has no impact on gender equality","Success in one SDG affects success of the others","Only 14 out of the 17 SDGs are interconnected"],answer:2},
{question:"In June 1992, at the Earth Summit in Rio de Janeiro, Brazil, more than 178 countries adopted ___.",options:["Agenda 21","Millennium Development Goals","Agenda 51","Sustainable Development Goals"],answer:0},
{question:"Brundtland Report was released in 1987 by the WCED. WCED stands for ___.",options:["World Commission on Environment Degradation","World Commission on Environment and Development","World Committee on Environmental Depletion","World Commission on Earth Development"],answer:1},
{question:"Extreme poverty means living on less than ___ a day.",options:["$1.25","$4.25","$10.25","$100.25"],answer:0},
{question:"___ poverty measures reveal who is poor and how they are poor.",options:["Unidimensional","Bidirectional","Multidimensional","Multidirectional"],answer:2},
{question:"SDG 2 aims to end all forms of ___ by 2030.",options:["crime","hunger and malnutrition","pollution","drought"],answer:1},
{question:"Which of the following is not one of the indicators of the Global Hunger Index?",options:["Prevalence of wasting and stunting in children under 5 years","Under-5 child mortality rate","Proportion of undernourished in the population","Proportion of obese people in the population"],answer:3},
{question:"As per Ministry of Housing and Urban Affairs, 135 lpcd has been suggested for urban water supply. For rural areas, 55 lpcd has been fixed under ___.",options:["Jal Jeevan Mission","Jal Shakti Mission","Jal Protection Mission","Jal Janta Mission"],answer:0},
{question:"Forests cover about ___ percent of the Earth’s surface.",options:["5","85","30","50"],answer:2},

/* -------- SET 2 -------- */
{question:"Which of the following is a characteristic of ESD?",options:["It is not locally relevant","It promotes learning only for children","It is interdisciplinary","It uses only two pedagogical techniques"],answer:2},
{question:"The Declaration on the Right to Development (1986) established that everyone is entitled to participate in and enjoy:",options:["Only economic and social development","Economic, political, psychological and community development","Economic, social, cultural and political development","Only cultural development"],answer:2},
{question:"Text-based methods for assessing ESD programs can be improved by using ___.",options:["Interpretive methodologies","Strict curriculum","Only quantitative techniques","Only qualitative methods"],answer:0},
{question:"SDGs are for the following except ___.",options:["People","Practice","Planet","Partnership"],answer:1},
{question:"Policies like employment and labor rights are called ___ policies.",options:["Post-regulation","Self-care","Forceful","Pre-distributive"],answer:3},
{question:"Which organizations developed HRE framework?",options:["Danish Institute of Human Rights","Office of the High Commissioner for Human Rights","Both A and B","Neither A nor B"],answer:2},
{question:"___ plays a role in peace education.",options:["Schools","Parents","Community","All of the given"],answer:3},
{question:"The enterprise of education at its most profound level is ___.",options:["Discriminatory","Selective","Restricted","Transformative"],answer:3},
{question:"UNESCO’s survey identified ___ as a top global challenge.",options:["Climate change","Hunger","Unemployment","Mental health"],answer:0},
{question:"Education for sustainable development improves life ___.",options:["Only now","Only future","Now and future","Only past"],answer:2},

/* -------- SET 3 -------- */
{question:"Global citizenship means individuals are part of ___ networks.",options:["Multiple","Diverse","Local and non-local","All of the given"],answer:3},
{question:"A global citizen ___.",options:["Is not aware of world","Is confused","Takes active role in community","Does not care"],answer:2},
{question:"Global citizenship education is based on ___ domains.",options:["Three","Two","Four","Seven"],answer:0},
{question:"UNESCO Category 1 institute in Asia-Pacific is ___.",options:["MGEIN","MGIER","MGIEP","MGOEL"],answer:2},
{question:"SDG 4.7 promotes a ___ agenda.",options:["Regional","Behavioral","Political","Humanistic"],answer:3},
{question:"SEL stands for ___.",options:["Sustainable education learning","Environmental learning","Social and emotional learning","Economic learning"],answer:2},
{question:"Teacher roles include ___.",options:["Facilitator","Guide","Role model","All of the given"],answer:3},
{question:"Target ___ protects cultural heritage.",options:["9.5","1.5","2.3","11.4"],answer:3},
{question:"TVET promotes ___ in member states.",options:["Green TVET","Blue TVET","Orange TVET","White TVET"],answer:0},
{question:"Which statement is false about green jobs?",options:["They preserve environment","They ensure workers’ rights","They exist only in agriculture","They are accessible"],answer:2},

/* -------- SET 4 -------- */
{question:"Poor infrastructure can cause hunger in a country.",options:["True","False"],answer:0},
{question:"In high income countries, hunger is mainly caused due to ___.",options:["Low GDP","Lack of food access","Poor transport","Lack of jobs"],answer:3},
{question:"Hunger is ___.",options:["Cause of war","Effect of war","Both cause and effect","Neither"],answer:2},
{question:"___ are most vulnerable to hidden hunger.",options:["Adults","Infants","Adolescents","Elderly"],answer:1},
{question:"Desertification is a result of ___.",options:["Drought","Deforestation","Bad agriculture","All of the given"],answer:3},
{question:"India initiative for hunger is ___.",options:["One Nation One Plate","One Nation One Hunger","No Ration Card","One Nation One Ration Card"],answer:3},
{question:"MGNREGA has ___.",options:["Reduced wages","Increased gaps","Reduced food access","Reduced distress migration"],answer:3},
{question:"Wheat productivity suffers if ___.",options:["Temperature rises","No change","Falls","None"],answer:0},
{question:"Yam cultivation is called ___.",options:["Diversifying food basket","Restricting food basket","Completing food basket","Wasting food"],answer:0},
{question:"Home gardening ensures food security.",options:["True","False"],answer:0},

/* -------- SET 5 -------- */
{question:"Which of the following is a type of energy?",options:["Fossil fuels","Nuclear power","Traditional biomass","All of the given"],answer:3},
{question:"IPCC I stands for ___.",options:["Industrial","Internal","International","Intergovernmental"],answer:3},
{question:"Nuclear fuel causes ___.",options:["Land improvement","Air and water pollution","Biodiversity increase","All"],answer:1},
{question:"China air pollution mainly from ___.",options:["Cooking","Coal burning","Transport","Forest burning"],answer:1},
{question:"Japan city target after disaster was ___.",options:["100 net energy","1 net energy","Million net energy","Zero net energy"],answer:3},
{question:"Energy democracy comes from ___ movement.",options:["Hunger","Revolt","Climate revolt","Climate justice"],answer:3},
{question:"Paris Agreement is about ___.",options:["Climate change","Education","Poverty","None"],answer:0},
{question:"NAPCC includes ___ missions.",options:["8","2","100","78"],answer:0},
{question:"Stubble burning months are ___.",options:["October-November","May-June","Jan-Feb","July-Aug"],answer:0},
{question:"Stubble burning is ___.",options:["Intentional","Natural","Healthy","Paper burning"],answer:0},

/* -------- SET 6 -------- */
{question:"GESO stands for ___.",options:["Green Education for Sustainable Occupation","Green Enhanced Sustainable Occupation","Green Enhanced Skills Occupation","None of the above"],answer:2},
{question:"Classification GIDO GESO GNEO by ___.",options:["GNET","ANET","INET","ONET"],answer:3},
{question:"Greening TVET except ___.",options:["Breaking institutions","Transforming institutions","Policies","Alliance"],answer:0},
{question:"Waste management belongs to ___.",options:["Green research","Green culture","Green teaching","Green campus"],answer:3},
{question:"Industry link shows ___.",options:["Green house","Green teaching","Green campus","Green curriculum"],answer:3},
{question:"Sustainable entrepreneurship includes ___.",options:["Social","Eco","Intra","All"],answer:3},
{question:"ESD requires ___ learning.",options:["Participatory","Passive","Rigid","Static"],answer:0},
{question:"Transversal competency is ___.",options:["Creativity","Empathy","Systems thinking","All"],answer:3},
{question:"Social health is ___.",options:["Emotional","Mental","Social","Physical"],answer:2},
{question:"Sustainable health is ___.",options:["Curative","Body","Balance of mind body spirit","Mental"],answer:2},

/* -------- SET 7 -------- */
{question:"Siddha belongs to ___.",options:["Public health","Voluntary agencies","Indigenous medicine","Private sector"],answer:2},
{question:"Not healthcare problem?",options:["Staff shortage","Urban bias","No regulation","Standard procedures"],answer:3},
{question:"WHO building block is ___.",options:["Growth","Transport","Politics","Service delivery"],answer:3},
{question:"Sustainability broadens ___.",options:["Objective","Outcome","Cost","Value"],answer:3},
{question:"Health data storage is ___.",options:["Repository","Bank","Bag","Grid"],answer:3},
{question:"POSHAN improves ___.",options:["Children","Mothers","Pregnant women","All"],answer:3},
{question:"Sus-QI stands for ___.",options:["Sustainable quality improvement","Quality improv","Quantity","Quantity improv"],answer:0},
{question:"Not stage of Sus-QI?",options:["Set goals","Measure impacts","Design effort","Ignore system"],answer:3},
{question:"Food insecurity measured by ___.",options:["FIES","FAIS","FIET","FAIR"],answer:0},
{question:"Food security levels are ___.",options:["5","4","3","2"],answer:0}

];

let selectedQuestions= [];
let userAnswers = [];

function startQuiz() {
  document.getElementById("timer").style.display = "block";
  document.getElementById("timer").style.color = "white";
  let n = parseInt(document.getElementById("num").value);
  if (!n || n <= 0) {
    alert("Enter valid number");
    return;
  }
  selectedQuestions = shuffle([...allQuestions]).slice(0, n);

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("submit-btn").style.display = "block";

  timeLeft = n * 12;// 12 seconds per question
  startTimer();

  showQuestions();
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
function showQuestions() {
    let container = document.getElementById("quiz-container");
    container.innerHTML = "";
    selectedQuestions.forEach((q, index) => {
        let div = document.createElement("div");
        div.className="question";

        let html=`<p>${index + 1}. ${q.question}</p>`;
        q.options.forEach((opt, i) => {
        let label = String.fromCharCode(65 + i);

        html += `
            <label class="option">
            <input type="radio" name="q${index}" value="${i}">
            <span>${label}. ${opt}</span>
            </label>
        `;
        });
        div.innerHTML = html;
        container.appendChild(div);
    });
}

function submitQuiz() {
    clearInterval(timerInterval);
    let score = 0;

    let container = document.getElementById("quiz-container");
    let questions = container.getElementsByClassName("question");

    selectedQuestions.forEach((q, index) => {
        let selected = document.querySelector(`input[name="q${index}"]:checked`);
        let div = questions[index];

        let old = div.querySelector(".correct-answer");
        if (old) old.remove();

        if (selected) {
            let ans = parseInt(selected.value);

            if (ans === q.answer) {
                score++;
                div.classList.add("correct");
            } else {
                div.classList.add("wrong");

                let p = document.createElement("p");
                p.className = "correct-answer";
                p.innerText = "Correct: " + q.options[q.answer];
                div.appendChild(p);
            }
        } 
        else {
            div.classList.add("wrong");

            let p = document.createElement("p");
            p.className = "correct-answer";
            p.innerText = "Correct: " + q.options[q.answer];
            div.appendChild(p);
        }
    });

    document.getElementById("result").innerText =
        "Score: " + score + "/" + selectedQuestions.length;
    document.getElementById("retry-btn").style.display = "block";
}

function restartQuiz() {
    clearInterval(timerInterval);
    
    document.getElementById("quiz-container").innerHTML = "";
    document.getElementById("result").innerText = "";
    document.getElementById("retry-btn").style.display = "none";
    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    document.getElementById("timer").style.display = "none";
    document.getElementById("timer").innerText = "";
}
function startTimer() {
  let timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(() => {
    timerDisplay.innerText = "Time Left: " + timeLeft + "s";

    if (timeLeft <= 10) {
    timerDisplay.style.color = "red";
    }
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      alert("Time's up!");
      submitQuiz();
    }
  }, 1000);
}
function toggleTheme() {
  let body = document.body;
  let btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    btn.innerText = "☀️ Light Mode";
  } else {
    btn.innerText = "🌙 Dark Mode";
  }
}