const { Resend } = require("resend");
const resend = new Resend("re_RcDLc7Ti_PTcny26UPjm684kpaWLFv1HX");

// LETTER A: Community College Faculty
const CC_FACULTY = [
  // CCAC Math
  { name: "Kate", email: "kritchey1@ccac.edu", dept: "math" },
  { name: "Corinne", email: "cbauman@ccac.edu", dept: "math" },
  { name: "Michael", email: "mbrewer@ccac.edu", dept: "math" },
  { name: "Richard", email: "rcoleman1@ccac.edu", dept: "math" },
  { name: "Zachary", email: "zcox@ccac.edu", dept: "math" },
  { name: "Anna", email: "adelvitto@ccac.edu", dept: "math" },
  { name: "Elaine", email: "ediperna@ccac.edu", dept: "math" },
  { name: "John", email: "jfloat@ccac.edu", dept: "math" },
  { name: "Paul", email: "pgogniat@ccac.edu", dept: "math" },
  { name: "Joseph", email: "jguiciardi@ccac.edu", dept: "math" },
  { name: "Kathleen", email: "kkane@ccac.edu", dept: "math" },
  { name: "Klotilda", email: "klazaj@ccac.edu", dept: "math" },
  { name: "Ryan", email: "rmccluskey@ccac.edu", dept: "math" },
  { name: "Marie", email: "mschenk@ccac.edu", dept: "math" },
  { name: "Rebecca", email: "rsenkowicz@ccac.edu", dept: "math" },
  { name: "Sean", email: "sevans@ccac.edu", dept: "math" },
  { name: "David", email: "dsluss@ccac.edu", dept: "math" },
  // CCAC Bio
  { name: "Waseem", email: "wahmed@ccac.edu", dept: "biology" },
  { name: "Adam", email: "adavis@ccac.edu", dept: "biology" },
  { name: "Caroline", email: "cevans@ccac.edu", dept: "biology" },
  { name: "Brian", email: "chiodob406@ccac.edu", dept: "biology" },
  { name: "Joanna", email: "jkazmierczak@ccac.edu", dept: "biology" },
  { name: "Heather", email: "hklenovich@ccac.edu", dept: "biology" },
  { name: "John", email: "jlaw@ccac.edu", dept: "biology" },
  { name: "Francis", email: "fmaxin@ccac.edu", dept: "biology" },
  { name: "Debora", email: "dmisencik@ccac.edu", dept: "biology" },
  { name: "Valjean", email: "vrossmann@ccac.edu", dept: "biology" },
  { name: "Bobby", email: "rficco@ccac.edu", dept: "biology" },
  { name: "Stacey", email: "sdamm@ccac.edu", dept: "biology" },
  { name: "Cynthia", email: "cmorton@ccac.edu", dept: "biology" },
  { name: "David", email: "dradziercz@ccac.edu", dept: "biology" },
  { name: "Narges", email: "npachenari@ccac.edu", dept: "biology" },
  { name: "Lotfalla", email: "ylotfallaseliman@ccac.edu", dept: "biology" },
  // Tri-C Math
  { name: "Idrissa", email: "idrissa.aidara@tri-c.edu", dept: "math" },
  { name: "Aaron", email: "aaron.altose@tri-c.edu", dept: "math" },
  { name: "Carilynn", email: "carilynn.bouie@tri-c.edu", dept: "math" },
  { name: "Julia", email: "julia.cronin@tri-c.edu", dept: "math" },
  { name: "Jackie", email: "jackie.dynda@tri-c.edu", dept: "math" },
  { name: "Kristin", email: "kristin.egan@tri-c.edu", dept: "math" },
  { name: "Amy", email: "amy.friedman@tri-c.edu", dept: "math" },
  { name: "Donald", email: "donald.gabriel@tri-c.edu", dept: "math" },
  { name: "Jennifer", email: "jennifer.garnes@tri-c.edu", dept: "math" },
  { name: "Kristine", email: "kristine.glasener@tri-c.edu", dept: "math" },
  { name: "Amanda", email: "amanda.hanley@tri-c.edu", dept: "math" },
  { name: "Derek", email: "derek.hiley@tri-c.edu", dept: "math" },
  { name: "Jennifer", email: "jennifer.hirz@tri-c.edu", dept: "math" },
  { name: "Mira", email: "mira.karac@tri-c.edu", dept: "math" },
  { name: "Serita", email: "serita.mcgunia@tri-c.edu", dept: "math" },
  { name: "Staci", email: "staci.osborn@tri-c.edu", dept: "math" },
  { name: "Vanitha", email: "vanitha.parameswaran@tri-c.edu", dept: "math" },
  { name: "Kathy", email: "kathy.renfro@tri-c.edu", dept: "math" },
  { name: "Paul", email: "paul.rokicky@tri-c.edu", dept: "math" },
  { name: "Cathleen", email: "cathleen.rossman@tri-c.edu", dept: "math" },
  { name: "Lisa", email: "lisa.scavone@tri-c.edu", dept: "math" },
  { name: "Patty", email: "patty.shelton@tri-c.edu", dept: "math" },
  { name: "Kelly", email: "kelly.stady@tri-c.edu", dept: "math" },
  { name: "David", email: "david.stroup@tri-c.edu", dept: "math" },
  { name: "Erin", email: "erin.susick@tri-c.edu", dept: "math" },
  { name: "Alexander", email: "alexander.torgov@tri-c.edu", dept: "math" },
  { name: "Brian", email: "brian.van-pelt@tri-c.edu", dept: "math" },
  { name: "Dottie", email: "dottie.walton@tri-c.edu", dept: "math" },
  { name: "Michael", email: "michael.wilkins@tri-c.edu", dept: "math" },
  { name: "Erick", email: "erick.williams@tri-c.edu", dept: "math" },
];

// LETTER B: University Faculty (no PennWest, no La Roche)
const UNI_FACULTY = [
  // Chatham Bio
  { name: "Lisa", email: "lambert@chatham.edu", dept: "biology" },
  { name: "Robert", email: "rlettan@chatham.edu", dept: "biology" },
  { name: "Michael", email: "m.collyer@chatham.edu", dept: "biology" },
  { name: "John", email: "jdube@chatham.edu", dept: "biology" },
  { name: "Linda", email: "lmkjohnson@chatham.edu", dept: "biology" },
  { name: "Welkin", email: "w.pope@chatham.edu", dept: "biology" },
  { name: "Jorge", email: "j.sierra@chatham.edu", dept: "biology" },
  { name: "Tricia", email: "tsukel@chatham.edu", dept: "biology" },
  // Carlow Bio
  { name: "Frank", email: "fkammer@carlow.edu", dept: "biology" },
  { name: "Joseph", email: "jmacierno@carlow.edu", dept: "biology" },
  // Duquesne Math (pattern: lastname@duq.edu)
  { name: "Rachael", email: "neilan@duq.edu", dept: "math" },
  { name: "Samantha", email: "allens2@duq.edu", dept: "math" },
  { name: "John", email: "fleming@duq.edu", dept: "math" },
  { name: "Nicholas", email: "hurl@duq.edu", dept: "math" },
  { name: "John", email: "kern@duq.edu", dept: "math" },
  { name: "Robert", email: "muth@duq.edu", dept: "math" },
  { name: "Karl", email: "wimmer@duq.edu", dept: "math" },
  // Duquesne Bio (pattern: lastname@duq.edu)
  { name: "Jana", email: "pattonvogt@duq.edu", dept: "biology" },
  { name: "Nancy", email: "trun@duq.edu", dept: "biology" },
  { name: "David", email: "lampe@duq.edu", dept: "biology" },
  { name: "John", email: "pollock@duq.edu", dept: "biology" },
  { name: "Joseph", email: "mccormick@duq.edu", dept: "biology" },
  { name: "Brady", email: "porter@duq.edu", dept: "biology" },
  // Point Park (pattern: lastnameFirstInitial@pointpark.edu)
  { name: "Mark", email: "marnichm@pointpark.edu", dept: "math" },
  { name: "Matthew", email: "pascalm@pointpark.edu", dept: "math" },
  { name: "Laura", email: "frostl@pointpark.edu", dept: "biology" },
  { name: "Diane", email: "krilld@pointpark.edu", dept: "biology" },
  { name: "Hannah", email: "dollishh@pointpark.edu", dept: "biology" },
  // RMU
  { name: "Jamie", email: "pinchot@rmu.edu", dept: "math" },
  { name: "Adam", email: "combs@rmu.edu", dept: "statistics" },
  // Waynesburg
  { name: "Evonne", email: "evonne.baldauff@waynesburg.edu", dept: "math" },
  { name: "Eric", email: "eric.bedilion@waynesburg.edu", dept: "math" },
  // Sinclair
  { name: "Jared", email: "jared.cutler@sinclair.edu", dept: "provost" },
];

function ccBody(name, dept) {
  const area = dept === "math" ? "mathematics" : dept === "biology" ? "biology" : "science";
  return `Dear ${name},

I am a fellow educator in Pittsburgh writing to offer you a free pilot of Arrival, an adaptive learning platform I built specifically for gateway courses like the ones you teach.

Here is the problem Arrival solves: by the time a midterm reveals that a student is struggling, it is too late to fix it. Arrival catches the signals weeks earlier.

How it works in practice:

You upload your syllabus. Within 30 minutes, Arrival maps it into a skill framework. Your students get a personalized dashboard showing their proficiency on every skill in the course, not just their grade, but where they actually stand. The AI generates adaptive quizzes, targeted study guides, and coaching conversations focused on each student's specific weaknesses. You see everything: who is improving, who is stalling, and who needs help before it shows up in their grades.

Why this matters for community colleges:

Your students are working jobs, raising families, and commuting. They do not have time to fall behind and catch up. DFW rates in gateway ${area} courses are the highest of any courses at most institutions. Arrival gives you early visibility and gives your students targeted support exactly where they need it.

The pilot is completely free. One course, one semester, up to 300 students. No cost to you, your department, or your institution. No contracts. I am looking for faculty partners who want to test this with real students and help build the evidence base.

See a live demo: transformlearning.ai/demo
Read the full methodology: transformlearning.ai/methodology

I would love to show you a 15-minute walkthrough whenever works for you. I am in Pittsburgh and happy to come to your campus or do it over Zoom.

Warmly,
Jeff Ritter, PhD
Professor and Humanities Division Chair (retired), La Roche College
Founder, Transform Learning | Co-Founder, AiECC
transformlearning.ai
Proudly Built in Pittsburgh`;
}

function uniBody(name, dept) {
  const area = dept === "math" ? "mathematics" : dept === "biology" ? "biology" : dept === "statistics" ? "statistics" : "science";
  return `Dear ${name},

I spent 30 years teaching at La Roche College in Pittsburgh, and the hardest part was always the same: knowing which students were falling behind before it was too late to help them. I built Arrival to solve that problem.

Arrival is an adaptive learning platform that gives you real-time visibility into where each student stands on every skill in your course. Not just their grade. Their actual proficiency, with confidence intervals and trajectory analysis, updated after every quiz, assignment, and coaching interaction.

What it does for you:

You upload your syllabus. Arrival maps it into a skill framework in 30 minutes. Students get personalized dashboards. The AI generates adaptive quizzes, study guides, and coaching conversations targeted at each student's specific gaps. You see a faculty dashboard showing which students are improving, which are stalling, and which need intervention now, not after the midterm.

What it does for your students:

Instead of a grade that tells them they failed, they get a map that shows them exactly what they do not understand yet and a path to fix it. The AI coaching is available 24/7, adapts to their level, and never judges them for asking a question twice.

The pilot is completely free. One course, one semester, up to 300 students. No cost to you or your institution. No contracts. I am looking for 3 to 5 faculty partners in the region who want to test this with real students this coming semester.

See a live demo: transformlearning.ai/demo
Read the full methodology: transformlearning.ai/methodology

I am in Pittsburgh and happy to walk you through it in person or over Zoom. Takes 15 minutes.

Warmly,
Jeff Ritter, PhD
Professor and Humanities Division Chair (retired), La Roche College
Founder, Transform Learning | Co-Founder, AiECC
transformlearning.ai
Proudly Built in Pittsburgh`;
}

async function sendAll() {
  let sent = 0, failed = 0;

  // Letter A: Community College
  for (const f of CC_FACULTY) {
    try {
      await resend.emails.send({
        from: "Jeff Ritter — Transform Learning <noreply@transformlearning.ai>",
        to: f.email,
        replyTo: "jeff@yourclassroom.ai",
        subject: `Free pilot: AI proficiency tracking for your ${f.dept} students — transformlearning.ai`,
        text: ccBody(f.name, f.dept),
      });
      sent++;
      console.log("OK: " + f.name + " (" + f.email + ")");
      await new Promise(r => setTimeout(r, 250));
    } catch (e) {
      failed++;
      console.error("FAIL: " + f.email + " — " + e.message);
    }
  }

  // Letter B: University
  for (const f of UNI_FACULTY) {
    try {
      await resend.emails.send({
        from: "Jeff Ritter — Transform Learning <noreply@transformlearning.ai>",
        to: f.email,
        replyTo: "jeff@yourclassroom.ai",
        subject: `Free pilot: AI proficiency tracking for your ${f.dept} students — transformlearning.ai`,
        text: uniBody(f.name, f.dept),
      });
      sent++;
      console.log("OK: " + f.name + " (" + f.email + ")");
      await new Promise(r => setTimeout(r, 250));
    } catch (e) {
      failed++;
      console.error("FAIL: " + f.email + " — " + e.message);
    }
  }

  console.log("\nDONE: " + sent + " sent, " + failed + " failed out of " + (CC_FACULTY.length + UNI_FACULTY.length) + " total");
}

sendAll();
