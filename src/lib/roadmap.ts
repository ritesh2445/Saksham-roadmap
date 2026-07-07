export type WeekDef = {
  week: number;
  phase: 1 | 2 | 3;
  phaseName: string;
  title: string;
  topic: string;
  learn: string[];
  practice: string[];
  build: string[];
};

const PHASES = {
  1: "Linux & Cloud Foundations",
  2: "Hands-on Security & Python",
  3: "Flagship Project & Careers",
} as const;

const RAW: Omit<WeekDef, "phaseName">[] = [
  // Month 1 — Linux, Networking, Git Basics (Weeks 1-4)
  {
    week: 1,
    phase: 1,
    title: "Linux Fundamentals 🐧",
    topic: "Operating System basics",
    learn: [
      "[Day 1] Install a Linux VM (VirtualBox + Ubuntu) or use WSL2 if on Windows",
      "[Day 2] Learn the terminal basics: navigation, file ops (ls, cd, cp, mv, rm)",
      "[Day 3] Permissions, users, groups (chmod, chown)",
      "[Day 4] Processes, package managers (apt), services",
      "[Day 5] Shell scripting basics (bash)"
    ],
    practice: [
      "[Day 6] Automate a small task with a bash script (e.g. backup a folder)"
    ],
    build: [
      "[Day 7] Review + do OverTheWire Bandit levels 0-5 (teaches Linux + security)"
    ]
  },
  {
    week: 2,
    phase: 1,
    title: "Networking Fundamentals 🌐",
    topic: "TCP/IP & Traffic Inspection",
    learn: [
      "[Day 8] What is a network, IP addresses, subnets",
      "[Day 9] TCP/IP, UDP, ports",
      "[Day 10] DNS, HTTP/HTTPS",
      "[Day 11] Firewalls, VPNs basics"
    ],
    practice: [
      "[Day 12] Practice: use ping, traceroute, netstat, nslookup on your own machine",
      "[Day 13] Wireshark basics — capture and inspect your own traffic"
    ],
    build: [
      "[Day 14] Review + OverTheWire Bandit levels 6-10"
    ]
  },
  {
    week: 3,
    phase: 1,
    title: "Git & Command Line Discipline 🐙",
    topic: "Version control & GitHub",
    learn: [
      "[Day 15] Git basics: init, add, commit, push",
      "[Day 16] Branching, merging, conflicts",
      "[Day 17] GitHub: create account, set up SSH keys, first repo",
      "[Day 20] Learn .gitignore, commit message conventions"
    ],
    practice: [
      "[Day 18] Write your first README properly (matters for recruiters)",
      "[Day 21] Review week — clean up your GitHub profile page"
    ],
    build: [
      "[Day 19] Push two existing projects (anti-collision, drowsiness alert) to GitHub with READMEs"
    ]
  },
  {
    week: 4,
    phase: 1,
    title: "Cloud Fundamentals (AWS) ☁️",
    topic: "Compute, Storage, and IAM",
    learn: [
      "[Day 22] Create AWS Free Tier account",
      "[Day 23] AWS core concepts: regions, availability zones, IAM basics",
      "[Day 24] Launch your first EC2 instance (free tier)",
      "[Day 25] S3 basics — storage, buckets, permissions",
      "[Day 26] IAM deep dive — users, roles, policies (core to security)"
    ],
    practice: [
      "[Day 28-30] Buffer days — catch up, revisit anything shaky"
    ],
    build: [
      "[Day 27] Practice: host a static website on S3"
    ]
  },

  // Month 2 — AWS Security Basics + First Deployed Project (Weeks 5-8)
  {
    week: 5,
    phase: 1,
    title: "AWS Security Basics 🔒",
    topic: "VPC, Firewalls, and Logging",
    learn: [
      "[Days 31–33] VPCs, subnets, security groups, NACLs (AWS Skill Builder)",
      "[Days 34–35] AWS WAF and Shield basics (conceptual)"
    ],
    practice: [
      "[Days 36–37] CloudTrail and CloudWatch — logging and monitoring basics"
    ],
    build: [
      "Set up a secure AWS base configuration (VPC, WAF concepts, CloudTrail logs)"
    ]
  },
  {
    week: 6,
    phase: 1,
    title: "First Secured App Deployment 🚀",
    topic: "Deployment & Infrastructure Security",
    learn: [
      "[Days 38–40] Deploy a simple web app (Flask/Node) on EC2"
    ],
    practice: [
      "[Days 41–42] Secure it: restrict security groups, use IAM roles instead of keys, enable HTTPS"
    ],
    build: [
      "[Day 43] Document what you did and why (your first real security-flavored project)"
    ]
  },
  {
    week: 7,
    phase: 1,
    title: "OWASP Top 10 Basics 🛡️",
    topic: "Web application vulnerabilities",
    learn: [
      "[Days 44–46] Learn OWASP Top 10 (the 10 most common web vulnerabilities)"
    ],
    practice: [
      "[Days 47–49] Practice identifying these vulnerabilities in sample vulnerable apps"
    ],
    build: [
      "Set up OWASP Juice Shop (intentionally vulnerable app to practice on) locally"
    ]
  },
  {
    week: 8,
    phase: 1,
    title: "Juice Shop Challenges & Review 🧪",
    topic: "Vulnerability analysis",
    learn: [
      "[Days 50–52] Continue Juice Shop challenges"
    ],
    practice: [
      "[Days 53–56] Buffer + review month — make sure EC2/S3/IAM/sec groups make sense"
    ],
    build: [
      "Document Juice Shop write-up and findings on your GitHub"
    ]
  },

  // Month 3-4 — Hands-on Security Practice (Weeks 9-16)
  {
    week: 9,
    phase: 2,
    title: "TryHackMe Pre-Security 🎯",
    topic: "Ethical Hacking Intro",
    learn: [
      "Start TryHackMe - read Pre Security fundamentals modules"
    ],
    practice: [
      "Complete 'Pre Security' learning path on TryHackMe"
    ],
    build: [
      "Document path completion and share it on LinkedIn/GitHub"
    ]
  },
  {
    week: 10,
    phase: 2,
    title: "TryHackMe Cyber Security 101 🐾",
    topic: "Broad Security concepts",
    learn: [
      "Read Cyber Security 101 learning path on TryHackMe"
    ],
    practice: [
      "Complete 'Cyber Security 101' path rooms"
    ],
    build: [
      "Save summary notes of main modules in your security log"
    ]
  },
  {
    week: 11,
    phase: 2,
    title: "TryHackMe Jr Penetration Tester I ⚔️",
    topic: "Active reconnaissance & attacks",
    learn: [
      "Start Jr Penetration Tester path on TryHackMe"
    ],
    practice: [
      "Complete reconnaissance and vulnerability research rooms"
    ],
    build: [
      "Document your hands-on penetration testing progress"
    ]
  },
  {
    week: 12,
    phase: 2,
    title: "TryHackMe Jr Penetration Tester II 🛡️",
    topic: "Web & Network exploitation",
    learn: [
      "Finish Jr Penetration Tester path modules"
    ],
    practice: [
      "Complete web exploitation and privilege escalation rooms"
    ],
    build: [
      "Publish your first TryHackMe write-up on a public room"
    ]
  },
  {
    week: 13,
    phase: 2,
    title: "HackTheBox Starting Point Tier 0 🪓",
    topic: "Penetration Testing Platform",
    learn: [
      "Create HackTheBox account and understand VPN connection"
    ],
    practice: [
      "Complete HTB Starting Point Tier 0 machines"
    ],
    build: [
      "Document the walk-through of a Tier 0 machine"
    ]
  },
  {
    week: 14,
    phase: 2,
    title: "HackTheBox Starting Point Tier 1 & 2 🏰",
    topic: "Intermediate targets",
    learn: [
      "Learn basic shell interactions and service enumeration"
    ],
    practice: [
      "Complete HTB Starting Point Tier 1 & Tier 2 machines"
    ],
    build: [
      "Compile starting point solutions into a GitHub repository"
    ]
  },
  {
    week: 15,
    phase: 2,
    title: "HackTheBox Active Machine I 🤖",
    topic: "First independent hack",
    learn: [
      "Study write-ups of retired machines by John Hammond"
    ],
    practice: [
      "Attempt 1-2 active easy machines on HackTheBox"
    ],
    build: [
      "Write a detailed local markdown report of target machine enumeration"
    ]
  },
  {
    week: 16,
    phase: 2,
    title: "HackTheBox Active Machine II 🧠",
    topic: "Box escalation & write-ups",
    learn: [
      "Study post-exploitation and privilege escalation vectors"
    ],
    practice: [
      "Solve another easy HackTheBox machine"
    ],
    build: [
      "Publish HackTheBox write-ups to a GitHub portfolio (recruiters love write-ups)"
    ]
  },

  // Month 5-6 — Python for Security + Data Skills Crossover (Weeks 17-24)
  {
    week: 17,
    phase: 2,
    title: "Python for Security (Foundations) 🐍",
    topic: "Programming basics",
    learn: [
      "Python fundamentals review - variables, loops, lists, dicts",
      "freeCodeCamp Python Course modules"
    ],
    practice: [
      "Solve 5 easy scripting problems on Python fundamentals"
    ],
    build: [
      "Create a simple command-line script in Python"
    ]
  },
  {
    week: 18,
    phase: 2,
    title: "Python OOP & File Operations 📂",
    topic: "Classes and read/write",
    learn: [
      "Classes, inheritance, and error handling in Python",
      "Parsing JSON, text files, and using requests library"
    ],
    practice: [
      "Write scripts to search and read local config files"
    ],
    build: [
      "Build a script that fetches data from a public vulnerability database API"
    ]
  },
  {
    week: 19,
    phase: 2,
    title: "Python for Security Automation ⚙️",
    topic: "System automation",
    learn: [
      "Study 'Automate the Boring Stuff with Python' (online free version)",
      "OS module, filesystem operations, and script scheduling"
    ],
    practice: [
      "Write automation script to find files of specific extension and archive them"
    ],
    build: [
      "Build a directory-watching backup script in Python"
    ]
  },
  {
    week: 20,
    phase: 2,
    title: "Network Scripting with Python 📡",
    topic: "Socket programming",
    learn: [
      "Socket library in Python, connecting to ports programmatically",
      "Handling network exceptions and timeouts"
    ],
    practice: [
      "Write a script that connects to a local port and reads service banners"
    ],
    build: [
      "Create a basic, multi-threaded port scanner script in Python"
    ]
  },
  {
    week: 21,
    phase: 2,
    title: "Log Analysis with Python (Parsing) 🪵",
    topic: "Log file manipulation",
    learn: [
      "Structure of Apache, Nginx, and cloudtrail logs",
      "Regular expressions (re library) for parsing log lines in Python"
    ],
    practice: [
      "Write regex to extract IP addresses, status codes, and request paths"
    ],
    build: [
      "Build a script that parses web server logs and reports top 10 IP visitors"
    ]
  },
  {
    week: 22,
    phase: 2,
    title: "Log Analysis (Pandas Crossover) 🐼",
    topic: "Log parsing at scale",
    learn: [
      "Load log data into Pandas DataFrames (your Data Science specialization edge!)",
      "Filtering, grouping, and aggregations of log events"
    ],
    practice: [
      "Filter logs by status code (e.g. 404s, 500s) or failed login requests"
    ],
    build: [
      "Build a log anomaly script identifying brute-force attempts (5+ failed logins)"
    ]
  },
  {
    week: 23,
    phase: 2,
    title: "Intro to SIEM Concepts 📊",
    topic: "Centralized logging",
    learn: [
      "Security Information and Event Management (SIEM) architecture",
      "Elastic Security free tier and ELK stack basics"
    ],
    practice: [
      "Install and run a local ELK instance (or Elastic Cloud trial)"
    ],
    build: [
      "Configure a data stream of local system logs into Elasticsearch"
    ]
  },
  {
    week: 24,
    phase: 2,
    title: "ELK Stack Dashboards 📉",
    topic: "Security dashboards",
    learn: [
      "Kibana search query language, filters, and dashboard creation",
      "Visualizing log volumes, spikes, and anomalies"
    ],
    practice: [
      "Create Kibana visualizations for system log events by category"
    ],
    build: [
      "Design a basic security monitoring dashboard in Kibana using sample logs"
    ]
  },

  // Month 7-8 — Build Your Flagship Project (Weeks 25-32)
  {
    week: 25,
    phase: 3,
    title: "Flagship Project: Architecture Plan 📐",
    topic: "Log Analysis Dashboard",
    learn: [
      "System design: data ingestion -> database storage -> API -> Dashboard UI",
      "Download security logs datasets (e.g., from Kaggle or public sources)"
    ],
    practice: [
      "Draw the architectural components of your dashboard project"
    ],
    build: [
      "Create your project folder, initialize git, and set up your dev env"
    ]
  },
  {
    week: 26,
    phase: 3,
    title: "Flagship Project: Data Ingestion 📥",
    topic: "Log Analysis Dashboard",
    learn: [
      "Creating log watcher script in Python",
      "Database schema design (SQLite/PostgreSQL) to store event logs"
    ],
    practice: [
      "Write ingestion script to parse logs in real-time and save to database"
    ],
    build: [
      "Build the automated log loader database pipeline"
    ]
  },
  {
    week: 27,
    phase: 3,
    title: "Flagship Project: Detection Logic I ⚙️",
    topic: "Log Analysis Dashboard",
    learn: [
      "Rule-based alerting: brute force logins, geodistribution anomalies",
      "Creating alert tables in database"
    ],
    practice: [
      "Code the Python rules to detect at least 3 types of suspicious logs"
    ],
    build: [
      "Implement the backend alert generator running on log ingestion"
    ]
  },
  {
    week: 28,
    phase: 3,
    title: "Flagship Project: Detection Logic II 🧬",
    topic: "Log Analysis Dashboard",
    learn: [
      "IP reputation checks and API integrations (e.g. AbuseIPDB)",
      "Threshold metrics and sliding-window logic in Python"
    ],
    practice: [
      "Integrate threat intelligence lookup API for parsed client IPs"
    ],
    build: [
      "Build threat reputation enrichment into the alert generator"
    ]
  },
  {
    week: 29,
    phase: 3,
    title: "Flagship Project: Backend API 🔌",
    topic: "Log Analysis Dashboard",
    learn: [
      "FastAPI framework in Python, routing, CORS, and JSON response models",
      "Database querying with SQLAlchemy"
    ],
    practice: [
      "Create API endpoints to fetch alert counts, log stats, and threat IPs"
    ],
    build: [
      "Deliver the FastAPI backend server exposing JSON endpoints"
    ]
  },
  {
    week: 30,
    phase: 3,
    title: "Flagship Project: Frontend Dashboard 🖥️",
    topic: "Log Analysis Dashboard",
    learn: [
      "Streamlit dashboard layouts or lightweight React + Chart.js",
      "Connecting UI components to the FastAPI backend endpoints"
    ],
    practice: [
      "Design charts for log metrics over time and alert distribution pie chart"
    ],
    build: [
      "Assemble the dashboard UI displaying real-time security alerts"
    ]
  },
  {
    week: 31,
    phase: 3,
    title: "Flagship Project: AWS Deployment 🌐",
    topic: "Log Analysis Dashboard",
    learn: [
      "AWS EC2 deployment, reverse proxy with Nginx, Gunicorn configuration",
      "AWS Security Groups - locking down ports, HTTPS configuration"
    ],
    practice: [
      "Deploy the backend, database, and dashboard UI on an EC2 instance"
    ],
    build: [
      "Deploy your security dashboard live with restricted access policies"
    ]
  },
  {
    week: 32,
    phase: 3,
    title: "Flagship Project: Recruiter Documentation 📖",
    topic: "Log Analysis Dashboard",
    learn: [
      "Technical writing, documenting features, system design, and architecture",
      "Recording a 2-minute video walkthrough of your project in action"
    ],
    practice: [
      "Review and refine repository file structure, add installation instructions"
    ],
    build: [
      "Publish a beautiful, recruiter-ready GitHub README for your flagship dashboard"
    ]
  },

  // Month 9-10 — Resume, Applications, Outreach (Weeks 33-40)
  {
    week: 33,
    phase: 3,
    title: "Resume glow-up ✨",
    topic: "Job hunt",
    learn: [
      "Write a tech resume focusing on Security + Cloud + Data Engineering",
      "Formatting impact-driven bullet points for flagship and college projects"
    ],
    practice: [
      "Tailor your resume format based on industry templates"
    ],
    build: [
      "Deliver a final polished PDF resume ready for application submissions"
    ]
  },
  {
    week: 34,
    phase: 3,
    title: "LinkedIn & GitHub Polish 🕸️",
    topic: "Job hunt",
    learn: [
      "Optimize LinkedIn profile: headlines, search keywords, featured projects",
      "GitHub profile layout, pinning repositories, and setting up profile README"
    ],
    practice: [
      "Connect with 10+ cybersecurity engineers and cloud practitioners"
    ],
    build: [
      "Make your LinkedIn and GitHub profiles look professional and aligned"
    ]
  },
  {
    week: 35,
    phase: 3,
    title: "Target Company Research 🔍",
    topic: "Job hunt",
    learn: [
      "Identify established global companies, tech MNCs, and security teams",
      "Research companies with overseas internship programs"
    ],
    practice: [
      "List 20 target companies with active cybersecurity or infrastructure teams"
    ],
    build: [
      "Create a job application and outreach tracking spreadsheet"
    ]
  },
  {
    week: 36,
    phase: 3,
    title: "Cold Outreach & Connections ☕",
    topic: "Job hunt",
    learn: [
      "Learn cold messaging and emailing etiquettes, asking for career guidance",
      "Drafting short templates tailored to cloud and security practitioners"
    ],
    practice: [
      "Reach out to 5 security engineers or VIT Pune seniors in target firms"
    ],
    build: [
      "Book at least 1-2 informal coffee chats or advisory calls"
    ]
  },
  {
    week: 37,
    phase: 3,
    title: "Tailored Applications I 🎯",
    topic: "Job hunt",
    learn: [
      "Analyzing job descriptions to match keyword matching",
      "Drafting customized cover letters or introduction notes"
    ],
    practice: [
      "Customize resume points for 5 roles"
    ],
    build: [
      "Submit first 5 high-quality job/internship applications"
    ]
  },
  {
    week: 38,
    phase: 3,
    title: "Tailored Applications II 🚀",
    topic: "Job hunt",
    learn: [
      "Exploring job boards: LinkedIn Jobs, Wellfound, corporate careers page"
    ],
    practice: [
      "Submit 10 more tailored applications"
    ],
    build: [
      "Update application tracker spreadsheet with recruiter responses"
    ]
  },
  {
    week: 39,
    phase: 3,
    title: "Project Pitch Preparation 🗣️",
    topic: "Interview prep",
    learn: [
      "Practice explaining technical architectures, choices, and mitigations out loud",
      "Structuring project stories (Challenge -> Action -> Result)"
    ],
    practice: [
      "Record yourself presenting the flagship project for 5 minutes (no notes)"
    ],
    build: [
      "Refine your project presentation and speaking cadence based on recordings"
    ]
  },
  {
    week: 40,
    phase: 3,
    title: "Coding Interview Basics 🧠",
    topic: "Interview prep",
    learn: [
      "Basic DSA patterns: arrays, hashing, two pointers, strings"
    ],
    practice: [
      "Solve first 15 problems of NeetCode 75 list"
    ],
    build: [
      "Create a coding-prep repository on GitHub to track your DSA notes"
    ]
  },

  // Month 11-12 — Interview Prep & Final Sprint (Weeks 41-52)
  {
    week: 41,
    phase: 3,
    title: "Security Interview Theory I 📚",
    topic: "Interview prep",
    learn: [
      "Networking security questions: TCP handshake, DNS attacks, SSL/TLS negotiation, VPNs"
    ],
    practice: [
      "Practice explaining networking models out loud"
    ],
    build: [
      "Document network security interview notes in your prep repository"
    ]
  },
  {
    week: 42,
    phase: 3,
    title: "Security Interview Theory II 🏷️",
    topic: "Interview prep",
    learn: [
      "Application & Cloud security: OWASP mitigations, IAM policies, VPC peerings, S3 security"
    ],
    practice: [
      "Solve practice quiz questions on web vulnerability patching"
    ],
    build: [
      "Document cloud security and OWASP mitigation interview notes"
    ]
  },
  {
    week: 43,
    phase: 3,
    title: "Behavioral Interview & STAR Method 🎭",
    topic: "Interview prep",
    learn: [
      "STAR methodology (Situation, Task, Action, Result) for behavioral questions",
      "Handling public speaking discomfort by structuring answers clearly"
    ],
    practice: [
      "Record behavioral responses to: 'Tell me about a time you failed', 'Why security?'"
    ],
    build: [
      "Write down 5 behavioral stories ready to present"
    ]
  },
  {
    week: 44,
    phase: 3,
    title: "Mock Interview Practice 🤝",
    topic: "Interview prep",
    learn: [
      "Strategies for thinking out loud under pressure",
      "Structuring answers during whiteboard architecture reviews"
    ],
    practice: [
      "Conduct a mock interview session with a peer or record yourself answering live"
    ],
    build: [
      "Log feedback points and areas of technical/behavioral weakness to address"
    ]
  },
  {
    week: 45,
    phase: 3,
    title: "Application & Interview Sprint I ⚡",
    topic: "Job hunt",
    learn: [
      "First-round screening etiquette, explaining your background and BTech timeline"
    ],
    practice: [
      "Submit 5 targeted applications, follow up with recruiters on LinkedIn"
    ],
    build: [
      "Log screening results and questions asked in your tracker"
    ]
  },
  {
    week: 46,
    phase: 3,
    title: "Application & Interview Sprint II ⚔️",
    topic: "Job hunt",
    learn: [
      "Techniques for technical take-home assignments"
    ],
    practice: [
      "Submit 5 targeted applications, schedule technical rounds"
    ],
    build: [
      "Complete any first-round technical screens or coding assessments"
    ]
  },
  {
    week: 47,
    phase: 3,
    title: "Application & Interview Sprint III 🛡️",
    topic: "Job hunt",
    learn: [
      "Architecture design questions - explaining security controls in cloud designs"
    ],
    practice: [
      "Submit 5 targeted applications, complete mid-stage interviews"
    ],
    build: [
      "Revise cloud architecture and security group setups before loops"
    ]
  },
  {
    week: 48,
    phase: 3,
    title: "Application & Interview Sprint IV 🚀",
    topic: "Job hunt",
    learn: [
      "Aligning project deliverables with target companies' engineering goals"
    ],
    practice: [
      "Submit final batch of 5 targeted applications, finalize scheduling"
    ],
    build: [
      "Review pipeline status and log manager interview insights"
    ]
  },
  {
    week: 49,
    phase: 3,
    title: "Interview Marathon 🏃",
    topic: "Job hunt",
    learn: [
      "Sustaining momentum and managing energy across multiple active loops"
    ],
    practice: [
      "Complete 3 real technical or behavioral interviews"
    ],
    build: [
      "Add interview questions and responses to your feedback log"
    ]
  },
  {
    week: 50,
    phase: 3,
    title: "Negotiation Week 🤝",
    topic: "Job hunt",
    learn: [
      "Salary negotiation techniques, evaluating benefits and growth potential"
    ],
    practice: [
      "Practice negotiation conversation flows with a friend or record yourself"
    ],
    build: [
      "Compile compensation packages and write down targets for base/perks"
    ]
  },
  {
    week: 51,
    phase: 3,
    title: "Offer & Finalization 🎉",
    topic: "Job hunt",
    learn: [
      "Reviewing employment contracts and understanding visa processing schedules"
    ],
    practice: [
      "Compare offers, finalize details, and accept your best-fit offer"
    ],
    build: [
      "Signed offer letter / internship agreement ready! ✦"
    ]
  },
  {
    week: 52,
    phase: 3,
    title: "You did it! 🎓",
    topic: "Celebration",
    learn: [
      "Reflecting on the year-long roadmap, consistency, and professional growth"
    ],
    practice: [
      "Write a final, personal thank-you letter to yourself for sticking to the plan"
    ],
    build: [
      "Pack your bags, update your profile headline, and celebrate your achievement!"
    ]
  }
];

export const ROADMAP: WeekDef[] = RAW.map((w) => ({ ...w, phaseName: PHASES[w.phase] }));

export const HABITS = [
  { id: "code", label: "coded today", emoji: "💻" },
  { id: "solve", label: "solved problems / CTFs", emoji: "🧠" },
  { id: "watch", label: "watched security lectures", emoji: "📺" },
  { id: "water", label: "drank water", emoji: "💧" },
  { id: "sleep", label: "slept properly", emoji: "🌙" },
  { id: "grass", label: "touched grass", emoji: "🌿" },
  { id: "nodoom", label: "no doomscrolling", emoji: "📵" },
  { id: "github", label: "pushed to GitHub", emoji: "🐙" },
];

export const MOODS = [
  { id: "sleepy", label: "sleepy bean", emoji: "😴" },
  { id: "productive", label: "productive cutie", emoji: "🌸" },
  { id: "overwhelmed", label: "emotionally overwhelmed", emoji: "🫧" },
  { id: "goblin", label: "coding goblin mode", emoji: "👹" },
  { id: "locked", label: "locked in", emoji: "🔒" },
  { id: "romantic", label: "romanticizing life", emoji: "💌" },
];

export const PROJECTS = [
  {
    id: "anti_collision",
    title: "Anti-collision system app",
    blurb: "Safety-first application designed to prevent physical collisions using computer vision and sensor data.",
    stack: ["Python", "OpenCV", "Sensor API", "NumPy"],
    gradient: "from-pink-200 via-rose-200 to-purple-200",
  },
  {
    id: "drowsiness_alert",
    title: "Drowsiness alert system",
    blurb: "Real-time webcam fatigue monitor linked to Arduino hardware triggers to keep drivers alert.",
    stack: ["Arduino", "Python", "Webcam API", "OpenCV"],
    gradient: "from-sky-200 via-cyan-200 to-blue-200",
  },
  {
    id: "log_dashboard",
    title: "Security Log Analysis Dashboard",
    blurb: "Flagship project - ingests multi-source logs, runs alert rules, queries threat intelligence APIs, and shows live alerts.",
    stack: ["Python", "FastAPI", "Elasticsearch / SQL", "AWS EC2", "Threat Intel API"],
    gradient: "from-amber-200 via-orange-200 to-pink-200",
  },
];

export const COUNTRIES = [
  {
    id: "ca",
    flag: "🇨🇦",
    name: "Canada",
    pick: true,
    salary: "CAD $90k – $125k / yr",
    visa: "Global Talent Stream (2-3 wks) or Express Entry",
    ssm: "Legal since 2005",
    hubs: ["Toronto", "Vancouver", "Montreal"],
    vibe: "Imagine snow on your window, a warm latte, and your first North American security paycheck hitting your account.",
  },
  {
    id: "nl",
    flag: "🇳🇱",
    name: "Netherlands",
    pick: true,
    salary: "€50k – €75k / yr + 30% ruling",
    visa: "Highly Skilled Migrant (employer sponsored)",
    ssm: "Legal since 2001 — first in the world",
    hubs: ["Amsterdam", "Eindhoven", "Utrecht"],
    vibe: "Imagine rainy evenings in Amsterdam after work, carrying flowers and overpriced coffee through canal streets.",
  },
  {
    id: "de",
    flag: "🇩🇪",
    name: "Germany",
    pick: false,
    salary: "€50k – €80k / yr",
    visa: "EU Blue Card — BSc accepted",
    ssm: "Legal since 2017",
    hubs: ["Berlin", "Munich", "Hamburg"],
    vibe: "Imagine Sunday park days in Berlin, biking with headphones in and a notebook full of server configurations.",
  },
  {
    id: "se",
    flag: "🇸🇪",
    name: "Sweden",
    pick: false,
    salary: "SEK 45k – 65k / month",
    visa: "Work permit via employer sponsor",
    ssm: "Legal since 2009",
    hubs: ["Stockholm", "Gothenburg"],
    vibe: "Imagine fika breaks, quiet snow, and the calmest 9–5 of your life with Klarna or Spotify on your laptop.",
  },
  {
    id: "pt",
    flag: "🇵🇹",
    name: "Portugal",
    pick: false,
    salary: "€30k – €50k / yr",
    visa: "D3 Tech Visa — easiest EU process",
    ssm: "Legal since 2010",
    hubs: ["Lisbon", "Porto"],
    vibe: "Imagine pastel buildings, ocean wind, and writing bash scripts from a sunlit Lisbon café.",
  },
];

export const MILESTONES = [
  { id: "first_linux_vm", label: "First Linux VM or WSL set up successfully" },
  { id: "first_bandit", label: "Solved OverTheWire Bandit level 5" },
  { id: "first_commit", label: "First GitHub commit" },
  { id: "first_aws", label: "Launched first AWS EC2 instance" },
  { id: "first_sec_deploy", label: "Deployed secured web app on AWS" },
  { id: "first_juice_shop", label: "Completed a challenge on OWASP Juice Shop" },
  { id: "first_htb", label: "Hacked first HackTheBox machine" },
  { id: "flagship_completed", label: "Completed flagship Log Analysis Dashboard" },
  { id: "first_interview", label: "First real security/cloud interview" },
  { id: "first_offer", label: "First offer letter ✦" },
  { id: "flight_booked", label: "Flight booked / accepted role" }
];

export const LETTERS = [
  {
    id: 0,
    title: "Day 1, Saksham ✦",
    body: "Hi Saksham. You opened this app, and that already counts. You don't have to become a security expert tonight. Just let me sit beside you while you read week 1.",
  },
  {
    id: 1,
    title: "After your first week",
    body: "I saw you push through the terminal commands and permissions. That's the part most people quit at — and you didn't. I'm so proud of you, Saksham. Keep going.",
  },
  {
    id: 2,
    title: "When you analyze your first logs",
    body: "Saksham. You just made Python parse raw web server logs and detect security intrusions automatically. That is literally magic. Don't scroll past this moment.",
  },
  {
    id: 3,
    title: "When you deploy your first secured app",
    body: "There is a fully secured application on the internet right now because of you. Locked-down AWS security groups, HTTPS enabled, IAM roles in place. Anyone in the world can access it safely. Sit with that for a second.",
  },
  {
    id: 4,
    title: "On a hard day",
    body: "It's okay to take a soft day. Close the laptop. Eat something warm. The wargames and cloud logs will still be here tomorrow, and so will I.",
  },
  {
    id: 5,
    title: "When you get the offer",
    body: "Your future job as a Security Engineer somewhere awesome is no longer a daydream. It has an address. I told you.",
  },
];

export const DIALOGUES = [
  "You solved another CTF challenge?? That's literally so attractive.",
  "Tiny progress is still progress, Saksham.",
  "Check OWASP Top 10 and push to GitHub please.",
  "You're becoming the version of yourself you used to dream about.",
  "One socket script closer to your dream role ✦",
  "Saksham. Breathe. Then open Linux terminal.",
  "I'm so proud of you and it's only Tuesday.",
];
