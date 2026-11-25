import { query } from "./db.js";

async function run() {
  console.log("Starting Pune location upgrade, Sub-Admins table setup, and Demo data injection...");

  // 1. Ensure admins table exists
  await query(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(160) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'sub_admin',
    permissions JSON NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  // 2. Ensure applications has experienced job columns
  const cols = await query("SHOW COLUMNS FROM applications");
  const colNames = cols.map((c) => c.Field);

  if (!colNames.includes("experience")) {
    await query("ALTER TABLE applications ADD COLUMN experience VARCHAR(60) NULL");
  }
  if (!colNames.includes("current_company")) {
    await query("ALTER TABLE applications ADD COLUMN current_company VARCHAR(120) NULL");
  }
  if (!colNames.includes("notice_period")) {
    await query("ALTER TABLE applications ADD COLUMN notice_period VARCHAR(60) NULL");
  }
  if (!colNames.includes("portfolio_url")) {
    await query("ALTER TABLE applications ADD COLUMN portfolio_url VARCHAR(255) NULL");
  }
  if (!colNames.includes("expected_ctc")) {
    await query("ALTER TABLE applications ADD COLUMN expected_ctc VARCHAR(60) NULL");
  }

  // 3. Seed / Update Admins
  await query(`INSERT INTO admins (username, email, password, role, permissions, is_active)
    VALUES 
      ('admin', 'admin@kairoedge.com', 'admin@12', 'superadmin', '["all"]', 1),
      ('pune_recruiter', 'hr.pune@kairoedge.com', 'recruiter@12', 'Talent HR / Recruiter', '["job_apps", "intern_apps", "colleges"]', 1),
      ('pune_editor', 'editor.pune@kairoedge.com', 'editor@12', 'Content Editor', '["services", "projects", "copy", "jobs"]', 1),
      ('pune_ops', 'ops.pune@kairoedge.com', 'ops@12', 'Lead Manager', '["inquiries", "dashboard"]', 1)
    ON DUPLICATE KEY UPDATE 
      email = VALUES(email),
      role = VALUES(role),
      permissions = VALUES(permissions),
      is_active = VALUES(is_active)`);

  // 4. Update Jobs location to Pune
  await query(`UPDATE jobs 
    SET location = REPLACE(location, 'Hyderabad', 'Pune'),
        description = REPLACE(description, 'Hyderabad', 'Pune')`);

  // 5. Update Premier Pune Colleges in colleges table
  await query(`DELETE FROM colleges`);
  const puneColleges = [
    ["College of Engineering, Pune (COEP Tech)", "COEP", "Pune", "Maharashtra", 1, 1],
    ["Pune Institute of Computer Technology (PICT)", "PICT", "Pune", "Maharashtra", 1, 2],
    ["Vishwakarma Institute of Technology (VIT Pune)", "VIT", "Pune", "Maharashtra", 1, 3],
    ["MIT World Peace University (MIT-WPU)", "MIT-WPU", "Pune", "Maharashtra", 1, 4],
    ["Cummins College of Engineering for Women (CCOEW)", "CCOEW", "Pune", "Maharashtra", 1, 5],
    ["Bharati Vidyapeeth Deemed University College of Engineering", "BVDUCOE", "Pune", "Maharashtra", 1, 6],
    ["Symbiosis Institute of Technology (SIT Pune)", "SIT", "Pune", "Maharashtra", 1, 7],
    ["Army Institute of Technology (AIT Pune)", "AIT", "Pune", "Maharashtra", 1, 8],
    ["Pimpri Chinchwad College of Engineering (PCCOE)", "PCCOE", "Pune", "Maharashtra", 1, 9],
    ["Sinhgad College of Engineering (SCOE Vadgaon)", "SCOE", "Pune", "Maharashtra", 1, 10],
    ["D.Y. Patil College of Engineering, Akurdi", "DYPCOE", "Pune", "Maharashtra", 1, 11]
  ];
  for (const c of puneColleges) {
    await query(
      "INSERT INTO colleges (name, code, city, state, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      c
    );
  }

  // 6. Update site_copy body to Pune
  const copyRow = await query("SELECT body FROM site_copy WHERE id = 1");
  if (copyRow[0]?.body) {
    const updatedBody = copyRow[0].body
      .replace(/Hyderabad/g, "Pune")
      .replace(/Telangana/g, "Maharashtra");
    await query("UPDATE site_copy SET body = ? WHERE id = 1", [updatedBody]);
  }

  // 7. Clear old dummy apps and insert high quality demo data for both Jobs and Internships
  await query("DELETE FROM applications");
  const demoApplications = [
    // Experienced Job Applicants (Full-Time)
    [
      "Rohan Deshpande",
      "rohan.deshpande@example.com",
      "+91 98220 14592",
      "Senior Full-Stack Engineer",
      "job",
      "8 years building high-throughput microservices and React enterprise portals. Architected real-time banking workflows in Pune delivery center.",
      "shortlisted",
      "5 – 8 Years (Senior)",
      "Persistent Systems Pune",
      "15 Days or less",
      "https://linkedin.com/in/rohan-deshpande",
      "₹16 - 18 LPA",
      null, null, null, null,
      "Strong technical portfolio in React 19 and scalable Node.js microservices. Lead interviewer noted exceptional system design skills."
    ],
    [
      "Pooja Kulkarni",
      "pooja.kulkarni@example.com",
      "+91 97640 88219",
      "Cloud Engineer",
      "job",
      "Hands-on Terraform, AWS ECS/EKS and Kubernetes CI/CD. Ready to join Pune tech center immediately.",
      "interviewed",
      "3 – 5 Years (Mid-Level)",
      "Infosys Hinjewadi Pune",
      "Immediate / Serving Notice",
      "https://github.com/poojak-cloud",
      "₹12 - 14 LPA",
      null, null, null, null,
      "AWS Certified Solutions Architect. Excellent track record in container orchestration and zero-downtime deployment."
    ],
    [
      "Aditya Joshi",
      "aditya.joshi@example.com",
      "+91 98500 33418",
      "Senior Full-Stack Engineer",
      "job",
      "Full-stack engineer with React, PostgreSQL, and Redis caching expertise. Shipped multiple client SaaS portals.",
      "new",
      "3 – 5 Years (Mid-Level)",
      "Tech Mahindra Pune",
      "30 Days",
      "https://github.com/aditya-j-dev",
      "₹13 LPA",
      null, null, null, null,
      null
    ],
    [
      "Sneha Patil",
      "sneha.patil@example.com",
      "+91 90110 55421",
      "Product Designer",
      "job",
      "Design systems, user journey mapping, and enterprise component libraries for SaaS platforms in Pune.",
      "reviewing",
      "3 – 5 Years (Mid-Level)",
      "Cognizant Pune",
      "Immediate / Serving Notice",
      "https://dribbble.com/snehapatil-ux",
      "₹11 LPA",
      null, null, null, null,
      "Portfolio shows clean MNC-grade dashboard designs and accessible design tokens."
    ],
    [
      "Vikas Shinde",
      "vikas.shinde@example.com",
      "+91 99230 77104",
      "Cloud Engineer",
      "job",
      "Configured VPCs, CloudFront distributions, and automated Docker rollouts for logistics platforms.",
      "hired",
      "1 – 2 Years (Junior)",
      "Wipro Pune",
      "15 Days or less",
      "https://linkedin.com/in/vikas-shinde-cloud",
      "₹8 LPA",
      null, null, null, null,
      "Offered position for Pune Cloud Operations unit. Joining in 2 weeks."
    ],

    // Student Internship Applicants
    [
      "Omkar Shinde",
      "omkar.shinde@example.com",
      "+91 98900 12345",
      "Software Engineering Internship",
      "internship",
      "Built a full-stack real-time inventory management tool using React and Node.js. Enthusiastic about joining KairoEdge Pune delivery team.",
      "shortlisted",
      null, null, null, null, null,
      "College of Engineering, Pune (COEP Tech)",
      "B.Tech / B.E.",
      "Computer Science & Engineering (CSE)",
      "3rd Year Student",
      "Top candidate from COEP campus drive. Impressive GitHub repo and clean code structure."
    ],
    [
      "Tanvi Mahajan",
      "tanvi.mahajan@example.com",
      "+91 98231 65432",
      "Software Engineering Internship",
      "internship",
      "Final year student with strong foundations in Data Structures, Algorithms, and TypeScript. Looking for a 6-month pre-placement internship.",
      "interviewed",
      null, null, null, null, null,
      "Pune Institute of Computer Technology (PICT)",
      "B.Tech / B.E.",
      "Information Technology (IT)",
      "4th Year (Final Year)",
      "Technical round cleared with 9/10 score. Preparing for final HR discussion."
    ],
    [
      "Yash Gaikwad",
      "yash.gaikwad@example.com",
      "+91 97654 32109",
      "On Job Training — Web Development",
      "internship",
      "Passionate about modern web standards, Tailwind CSS, and RESTful APIs. Keen on hands-on practical project training in Pune.",
      "new",
      null, null, null, null, null,
      "Vishwakarma Institute of Technology (VIT Pune)",
      "B.Tech / B.E.",
      "AI & Data Science",
      "2nd Year Student",
      null
    ],
    [
      "Anjali Sawant",
      "anjali.sawant@example.com",
      "+91 99220 98765",
      "Software Engineering Internship",
      "internship",
      "Pursuing MCA at MIT-WPU Pune. Published 2 open-source React component packages on npm. Available for full-time internship at Pune office.",
      "reviewing",
      null, null, null, null, null,
      "MIT World Peace University (MIT-WPU)",
      "MCA",
      "Computer Applications",
      "Postgraduate (Pursuing / Completed)",
      "Verified MCA marksheet and project link. Good front-end portfolio."
    ],
    [
      "Prathamesh More",
      "prathamesh.more@example.com",
      "+91 90112 34567",
      "Software Engineering Internship",
      "internship",
      "Winner of Smart India Hackathon Pune regional round. Developed a progressive web app for local transit.",
      "hired",
      null, null, null, null, null,
      "Cummins College of Engineering for Women (CCOEW)",
      "B.Tech / B.E.",
      "Computer Science & Engineering (CSE)",
      "3rd Year Student",
      "Offer letter issued for 6-month winter internship program."
    ],
    [
      "Ruturaj Jadhav",
      "ruturaj.jadhav@example.com",
      "+91 98600 78901",
      "On Job Training — Web Development",
      "internship",
      "Completed diploma with distinction in Pune. Looking to transition into enterprise React/Node web engineering.",
      "shortlisted",
      null, null, null, null, null,
      "Pimpri Chinchwad College of Engineering (PCCOE)",
      "Diploma in Engineering",
      "Information Technology (IT)",
      "Already Graduated / Passed Out",
      "Completed hands-on assessment test."
    ]
  ];

  for (const app of demoApplications) {
    await query(
      `INSERT INTO applications 
       (name, email, phone, role_title, kind, message, status, experience, current_company, notice_period, portfolio_url, expected_ctc, college, degree, branch, graduation_year, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      app
    );
  }

  // 8. Demo Inquiries from Pune businesses
  await query("DELETE FROM inquiries");
  const demoInquiries = [
    [
      "Rajesh Kulkarni",
      "rajesh.kulkarni@finedgepune.com",
      "FinEdge Solutions Pune",
      "+91 98224 55678",
      "Cloud Platforms & Migration",
      "We need to migrate our fintech transaction engine to a secure, PCI-DSS compliant AWS environment in Pune. Looking for a written architectural plan and milestone delivery.",
      "new",
      "Follow-up scheduled with senior cloud architect this Thursday."
    ],
    [
      "Dr. Anita Phadke",
      "anita.p@sanjeevanipune.org",
      "Sanjeevani HealthTech Pune",
      "+91 97645 11223",
      "Custom Web Applications",
      "We are revamping our hospital patient intake and clinical records dashboard. Need a fast, secure React 19 web portal for 45 doctors across 3 Pune branches.",
      "contacted",
      "Sent requirements questionnaire and initial scope overview."
    ],
    [
      "Vikramaditya Shirole",
      "vikram@mahalogix.in",
      "MahaLogix Supply Chain Pune",
      "+91 98901 33445",
      "Data & Event Systems",
      "Require real-time dispatch and fleet telemetry tracking API for 180 vehicles operating between Pune, Mumbai, and Nashik.",
      "replied",
      "Meeting fixed at KairoEdge Pune Delivery Center next Tuesday."
    ],
    [
      "Sunil Gokhale",
      "s.gokhale@autometricspune.com",
      "AutoMetrics Automotive Pune",
      "+91 90118 99887",
      "Application Engineering",
      "Need an internal defect tracking tool with role-based permissions and automated Excel/PDF reporting for our Chakan plant.",
      "closed",
      "Contract finalized and signed. Handed over to sprint delivery team."
    ]
  ];

  for (const inq of demoInquiries) {
    await query(
      `INSERT INTO inquiries (name, email, company, phone, service, message, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      inq
    );
  }

  console.log("Database successfully seeded with Pune location, Sub-admins, and rich demo data!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
