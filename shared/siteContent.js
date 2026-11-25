export const stats = [
  { value: "7", label: "Service lines" },
  { value: "8", label: "Industry practices" },
  { value: "6", label: "Delivery stages" },
  { value: "2", label: "Offices: Pune & Ahilyanagar" }
];

export const services = [
  {
    slug: "cloud-devops",
    number: "01",
    title: "Cloud & DevOps",
    summary: "Cloud accounts, release pipelines, and monitoring your team can operate.",
    description:
      "We set up AWS or Azure environments, put infrastructure in code, and connect a pipeline that builds, tests, and promotes the same way every time. You also get logs, alerts, and a cost view so production is not a black box after launch.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    tags: ["AWS", "Docker", "CI/CD", "Terraform"],
    outcomes: ["Environments defined in code", "The same release path for every change", "Logs, alerts, and a rollback you have tried"],
    footer: "Build · Deploy · Scale"
  },
  {
    slug: "web-engineering",
    number: "02",
    title: "Web Engineering",
    summary: "Customer sites, staff portals, and the APIs that keep them in sync.",
    description:
      "We design the screens, the login, and the service layer together. That covers public websites, internal tools, and REST APIs backed by MySQL or PostgreSQL. The first release includes empty, error, and success states, not only the happy path.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    tags: ["React", "Node.js", "Next.js", "APIs"],
    outcomes: ["Interfaces staff can learn in a walkthrough", "APIs with clear contracts and access rules", "A database model that matches the workflow"],
    footer: "Design · Engineer · Evolve"
  },
  {
    slug: "ai-automation",
    number: "03",
    title: "AI & Automation",
    summary: "Assistance inside an existing step, with a person still confirming the result.",
    description:
      "We place AI on work you already do: drafting a field note, suggesting a ticket category, or opening the next task from a submitted form. A person approves the result. We measure minutes saved and errors caught before widening the scope.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    tags: ["AI", "Python", "Automation", "Workflows"],
    outcomes: ["One repetitive step automated first", "A human decision kept in the flow", "A before-and-after measure, not a demo"],
    footer: "Imagine · Automate · Accelerate"
  },
  {
    slug: "mobile-products",
    number: "04",
    title: "Mobile Products",
    summary: "Apps for customers and for teams who work away from a desk.",
    description:
      "Each screen is built around one job: the visit, the checklist, the photo, and the sign-off. The app keeps working on a weak network and syncs when the connection returns. Releases go through the same review path as the web product.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    tags: ["React Native", "APIs", "UX", "Offline"],
    outcomes: ["Task screens, not a shrunk website", "Offline capture with a later sync", "APIs shared with the web product"],
    footer: "Think · Design · Launch"
  },
  {
    slug: "cybersecurity",
    number: "05",
    title: "Cybersecurity",
    summary: "Access, logging, and release checks so the system is safer to run.",
    description:
      "We review who can sign in, which roles can change data, and what the system records. The work covers identity, least-privilege access, hardened deployments, and alerts your team can act on. Security is part of the build, not a document at the end.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    tags: ["Security", "IAM", "Monitoring", "Hardening"],
    outcomes: ["Roles that match real job duties", "Deployments that do not share one admin login", "Alerts tied to actions, not noise"],
    footer: "Protect · Monitor · Improve"
  },
  {
    slug: "data-analytics",
    number: "06",
    title: "Data & Analytics",
    summary: "Agreed definitions, a nightly pipeline, and reports managers can open themselves.",
    description:
      "We start by writing what “open”, “delayed”, and “complete” mean, and which system is allowed to say so. Then we move that data into a model your team can query and publish a small set of dashboards for the weekly review.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    tags: ["SQL", "BI", "Pipelines", "MySQL"],
    outcomes: ["One definition for each metric", "A pipeline that refreshes without a manual export", "Dashboards the business can filter"],
    footer: "Collect · Understand · Act"
  },
  {
    slug: "it-consulting",
    number: "07",
    title: "IT Consulting",
    summary: "A written map of the current systems and a sequence your team can deliver.",
    description:
      "We review the applications, the data, and the way work actually moves. You leave with the risks, the systems to keep, and an ordered plan for the first release. The document is written so engineering and the business can use the same version.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    tags: ["Strategy", "Architecture", "Modernization"],
    outcomes: ["A current-state map, not a slide tour", "A first release small enough to ship", "Standards the team can keep after we leave"],
    footer: "Assess · Plan · Transform"
  }
];

export const projects = [
  {
    slug: "northline-control-tower",
    category: "Cloud Platform",
    title: "Northline Control Tower",
    summary: "A live operations console for fleet status, exceptions, and partner updates.",
    description:
      "Northline is a regional logistics group. Dispatch built each morning from spreadsheets, radio calls, and a report that arrived after the shift had already started. Leadership needed one control surface the floor could trust while trucks were still moving.",
    challenge: "Shipment status was hours old by the time it reached the desk. Software releases had to wait for a weekend, because the dispatch tools could not be taken offline during the day.",
    solution: "We delivered a cloud control tower with live shipment events, an exception queue, and role-based access for dispatch, partners, and supervisors. Releases run through an automated pipeline in business hours, with a rollback path that does not stop the floor.",
    result: "Dispatch sees delays as they happen. Production updates ship on weekdays, and the overnight spreadsheet is no longer the system of record.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    label: "CLOUD",
    industry: "logistics",
    services: ["cloud-devops", "web-engineering", "data-analytics"]
  },
  {
    slug: "helio-ledger",
    category: "Digital Product",
    title: "Helio Ledger",
    summary: "A client-onboarding workspace with owners, approvals, and a full audit history.",
    description:
      "Helio is a growing financial-services team. New client accounts were split across inbox threads and three internal tools. Compliance could not reconstruct who approved a step, or why a case had stopped.",
    challenge: "Onboarding stalled because no one could see the blocked step. Approvals had no single record that a reviewer, an auditor, or a new teammate could trust.",
    solution: "We designed a web workspace with explicit case states, permissioned actions, and a history on every account. The API is ready for partner systems without opening the internal tools to them.",
    result: "Each case now has an owner, a status, and a history. Cycle time dropped because blocked steps are visible the same day, and the audit trail is part of the product.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    label: "OPS",
    industry: "fintech",
    services: ["web-engineering", "cybersecurity"]
  },
  {
    slug: "fieldline-assist",
    category: "Automation",
    title: "Fieldline Assist",
    summary: "Structured field visits that open the next task without a second round of typing.",
    description:
      "Fieldline’s agronomy team recorded visits on paper and retyped them at night. Follow-ups depended on whoever remembered the note. Planning started the next day with an incomplete log.",
    challenge: "The same visit was written three times before it reached planning: once in the field, once in a shared chat, and once in the office sheet. Photos and follow-ups were easy to lose.",
    solution: "We built assisted capture: structured visit forms, image attachments, and rules that open the next task when a visit is submitted. Staff enter the work once, on the phone, while they are still with the grower.",
    result: "Evening retyping stopped. Planners open the day with a complete visit log, and missed follow-ups show up as open tasks instead of memory.",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    label: "AI",
    industry: "agritech",
    services: ["ai-automation", "mobile-products"]
  },
  {
    slug: "vivid-storefront",
    category: "Web Experience",
    title: "Vivid Storefront",
    summary: "A rebuilt storefront that shares one order status with the shop floor.",
    description:
      "Vivid is a retail brand with stores and an online catalogue. The site was slow on mid-range phones, and checkout failed quietly on weaker networks. Store teams learned about online orders from a separate export.",
    challenge: "Marketing could not trust page speed, and the shop floor could not see which online orders were paid, packed, or waiting. Staff reconciled the two systems by hand at the end of the day.",
    solution: "We rebuilt the storefront for speed and reliable checkout, then connected each order to the inventory workflow the stores already use. The website and the shop floor now share one status.",
    result: "Catalogue pages hold up on everyday phones. Store teams stop matching orders by spreadsheet, because the status they see is the status the customer sees.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    label: "WEB",
    industry: "retail",
    services: ["web-engineering", "data-analytics"]
  },
  {
    slug: "pulse-ward-insights",
    category: "Analytics",
    title: "Pulse Ward Insights",
    summary: "Agreed ward metrics, refreshed nightly, for reviews that start from the same figures.",
    description:
      "Pulse supports hospital department leads who were exporting their own spreadsheets before every review. Capacity, staffing, and throughput did not match, so the meeting began with a debate about the source.",
    challenge: "Each system defined the same ward number differently. No one could tell whether a gap was a real capacity problem or a reporting mismatch, and exceptions surfaced only after they had already affected the ward.",
    solution: "We built a reporting layer with agreed definitions, nightly pipelines, and a dashboard each ward lead can filter without calling a data team. The figures used in the room are the figures stored for the next review.",
    result: "Weekly reviews start from one set of numbers. Exceptions are visible before they become incidents, and department leads no longer maintain a private spreadsheet.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    label: "DATA",
    industry: "healthcare",
    services: ["data-analytics", "cloud-devops"]
  },
  {
    slug: "orbit-field",
    category: "Mobile Product",
    title: "Orbit Field",
    summary: "A field app for the job, the parts used, and the customer sign-off.",
    description:
      "Orbit runs an enterprise service team. Work was dispatched by phone, and proof of completion came back as photos in personal chats. Supervisors could not close a job until someone collected the evidence by hand.",
    challenge: "There was no reliable record of what was done, which parts were used, or whether the customer had signed off. That record often arrived days later, and it could not be audited.",
    solution: "Orbit Field gives each technician the job, the checklist, parts usage, and customer sign-off on one screen. The app keeps working without a connection and syncs when the network returns.",
    result: "Jobs close the same day. The back office stops chasing screenshots, and supervisors can show what was completed without reconstructing a chat thread.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    label: "APP",
    industry: "enterprise",
    services: ["mobile-products", "web-engineering"]
  }
];

export const industries = [
  {
    slug: "healthcare",
    name: "Healthcare",
    summary: "Ward reports, staff access, and handoffs that use the same figures.",
    description:
      "We build operational software around clinics and hospital departments: role-based access, shift handoffs, and reports that use one definition of capacity and throughput. The software supports the staff. It does not replace clinical judgment.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    focus: ["Ward and clinic dashboards", "Role-based access", "Operational reporting"]
  },
  {
    slug: "fintech",
    name: "FinTech",
    summary: "Onboarding, approvals, and an audit history on every case.",
    description:
      "Financial operations need to show who approved a step and why a case stopped. We build onboarding workspaces with explicit states, permissioned actions, and a history that a reviewer can open without reconstructing an email thread.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    focus: ["Onboarding workspaces", "Approval trails", "Secure service design"]
  },
  {
    slug: "agritech",
    name: "AgriTech",
    summary: "Visit capture, photos, and follow-ups that survive a weak network.",
    description:
      "Field teams need to record a visit once, attach a photo, and see the follow-up the next morning. We design phone flows that work through patchy coverage and planning screens that replace the end-of-day spreadsheet.",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80",
    focus: ["Field visit capture", "Season planning", "Task automation"]
  },
  {
    slug: "education",
    name: "Education",
    summary: "Admissions, faculty, and students working from one record.",
    description:
      "We replace scattered forms with portals for applications, class administration, and leadership reports. Access follows the role. The record a student sees is the record the office stores.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
    focus: ["Student portals", "Admin workflows", "Reporting for leadership"]
  },
  {
    slug: "logistics",
    name: "Logistics",
    summary: "Live shipment status, exceptions, and a release path the floor can trust.",
    description:
      "Dispatch cannot wait for last night’s file. We build visibility for shipments and delays, alerts for the exceptions that need a person, and cloud releases that do not take the floor offline.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    focus: ["Live exception views", "Partner integrations", "Release safety"]
  },
  {
    slug: "retail",
    name: "Retail",
    summary: "A storefront and a shop floor that share one order status.",
    description:
      "We build catalogues that stay fast on everyday phones and connect each paid order to the stock and packing workflow the stores already use. The customer and the store see the same status.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
    focus: ["Commerce experiences", "Order visibility", "Mobile performance"]
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    summary: "Internal systems rebuilt in slices the current team can own.",
    description:
      "When internal software is too risky to change, we map what it does, keep the parts that work, and replace one workflow at a time. Each slice includes the code, the access model, and notes the current staff can run.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    focus: ["Platform modernization", "Internal products", "Engineering standards"]
  },
  {
    slug: "startups",
    name: "Startups",
    summary: "A first production version a small team can keep shipping.",
    description:
      "We build the first real release with a clear scope, a cloud setup, and a design system a small team can extend. The goal is a product in customers’ hands, with a path that does not require a rewrite at month six.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    focus: ["MVP to production", "Founding engineering", "Cloud foundations"]
  }
];

export const technologies = [
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "Google Cloud", category: "Cloud" },
  { name: "Docker", category: "Cloud" },
  { name: "Kubernetes", category: "Cloud" },
  { name: "Terraform", category: "Cloud" },
  { name: "React", category: "Product" },
  { name: "Next.js", category: "Product" },
  { name: "Node.js", category: "Product" },
  { name: "Laravel", category: "Product" },
  { name: "Python", category: "Product" },
  { name: "MySQL", category: "Data" },
  { name: "PostgreSQL", category: "Data" },
  { name: "MongoDB", category: "Data" },
  { name: "IAM and SSO", category: "Security" },
  { name: "OWASP practices", category: "Security" },
  { name: "Audit logging", category: "Security" }
];

export const architecture = [
  { number: "01", title: "Interface", text: "React screens with a component system, keyboard access, and states for loading, empty, and error." },
  { number: "02", title: "Services", text: "Node.js APIs with documented contracts, role checks, and errors the client can show." },
  { number: "03", title: "Data", text: "MySQL or PostgreSQL models shaped around the reports and workflows you already run." },
  { number: "04", title: "Cloud", text: "Separate environments, a pipeline, and monitoring that names the service which failed." }
];

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    summary: "We write the business result, the users, and the systems already in place.",
    details: "We sit with the people who do the work, review the current tools, and write the outcome in language both the sponsor and the engineers will use. Risks and unknowns are listed before a date is promised."
  },
  {
    number: "02",
    title: "Plan",
    summary: "We sequence scope so the first release can ship and prove the approach.",
    details: "You receive a written plan: what is in the first release, what waits, the environments, and the dates. Change after that point is a decision, not a surprise in the build."
  },
  {
    number: "03",
    title: "Design",
    summary: "Screens, permissions, and the data model are agreed before the build speeds up.",
    details: "We design the main flows and the states around them: no access, no data, a failed save, and a completed task. The database shape is reviewed at the same time, while a change is still cheap."
  },
  {
    number: "04",
    title: "Develop",
    summary: "You click working software on a set cadence, not a slide of what it will do.",
    details: "Each cycle has a review on the running product. Decisions, open questions, and what moved are written down so the project does not depend on one conversation."
  },
  {
    number: "05",
    title: "Deploy",
    summary: "Launch includes monitoring, a rollback, and the people who will watch the first users.",
    details: "We rehearse the release on a staging environment that matches production. Go-live has a named owner, a health check, and a way back if the first real traffic fails."
  },
  {
    number: "06",
    title: "Scale",
    summary: "After launch we hand over the system and plan the next slice.",
    details: "You receive the repository, the cloud layout, and run notes. We then tighten speed and cost, or start the next agreed slice, instead of leaving at go-live."
  }
];

export const principles = [
  { title: "A result you can name", text: "We agree the business change first: fewer manual steps, one status, or a release your team can repeat. The software is built to that result." },
  { title: "Runnable by your staff", text: "A product is finished when the people who will use it can complete a normal day without calling us for every step." },
  { title: "Written decisions", text: "Scope, risks, and choices stay in a document both sides can open. Progress is not trapped in a chat thread." },
  { title: "Releases you can reverse", text: "Each launch is small enough to understand, with a rollback, so the current business keeps running." }
];

export const team = [
  { role: "Cloud architecture", focus: "Accounts, networks, pipelines, cost, and a release path that can roll back.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80" },
  { role: "Product engineering", focus: "Web and mobile products, from the screen through the API to the database.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80" },
  { role: "Data engineering", focus: "Metric definitions, pipelines, and reports two departments can share.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" },
  { role: "Delivery leadership", focus: "Scope, dates, reviews, and a written plan the sponsor can share.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80" }
];

export const testimonials = [
  {
    quote: "Dispatch works from one live status instead of a morning export. Delays are visible while the shipment can still be recovered.",
    attribution: "Logistics · visibility"
  },
  {
    quote: "Each client case has an owner, a status, and an approval history. Staff stop reconstructing the decision from email.",
    attribution: "Finance operations · audit trail"
  },
  {
    quote: "A field visit is entered once, with the photo and the follow-up. Planning opens the next day on a complete log.",
    attribution: "Field operations · capture"
  }
];

export const insights = [
  {
    slug: "production-releases-without-weekends",
    title: "Production releases that do not need a weekend",
    excerpt: "How small pipeline changes make weekday deploys boring, which is the point.",
    category: "Cloud",
    publishedOn: "2026-02-12",
    image: "/images/insights/releases.svg",
    body: "Most teams delay releases because the path to production is manual and scary. The fix is rarely a new platform. It is a short, repeatable pipeline: one build, the same promotion path, and a rollback that has been tried.\n\nStart by listing every step a human still types. Replace the ones that differ between staging and production. Add a health check the release waits on. Then schedule the next change on a Tuesday morning with the people who will watch it.\n\nBoring releases are a product feature. Customers feel them as fewer surprises, and engineers feel them as permission to ship smaller."
  },
  {
    slug: "dashboards-people-believe",
    title: "Dashboards people actually believe",
    excerpt: "A metric is useless until two departments define it the same way.",
    category: "Data",
    publishedOn: "2026-03-04",
    image: "/images/insights/dashboards.svg",
    body: "The first workshop on a reporting project should not open a charting tool. It should write down what “active”, “delayed” and “complete” mean, and which system is allowed to say so.\n\nOnce the definitions are stable, the pipeline can be simple: extract, conform, and publish a small set of tables the business already asks for. Fancy exploration comes after the weekly meeting stops debating the source.\n\nTrust is the feature. Visual design supports it. It does not replace it."
  },
  {
    slug: "ai-where-the-work-already-is",
    title: "Put AI where the work already is",
    excerpt: "Assistance beats a new chatbot when the job is a form, a queue or a document.",
    category: "AI",
    publishedOn: "2026-04-18",
    image: "/images/insights/automation.svg",
    body: "The useful AI projects we see are embedded in a step someone already performs. A field report gets a structured draft. A support queue gets a suggested category. A person still confirms the result.\n\nThat boundary matters. It keeps the system accountable and gives you a measurement: minutes saved, errors caught, cases closed. A standalone chat window rarely has that number.\n\nChoose one repetitive step, keep a human decision, and instrument the before and after. Then decide whether to widen it."
  }
];

export const jobs = [
  {
    slug: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    location: "Pune / Hybrid",
    type: "Full-time",
    summary: "Build web platforms with React and Node.js for clients who expect production quality.",
    description: "You will own features from interface to API to MySQL, work directly with delivery leads in Pune, and leave systems another engineer can run. We look for people who write clearly and care about release day."
  },
  {
    slug: "cloud-engineer",
    title: "Cloud Engineer",
    location: "Pune / Hybrid",
    type: "Full-time",
    summary: "Design AWS environments, pipelines and the monitoring that makes them operable.",
    description: "You will turn infrastructure into code, tighten deployment paths and sit with product engineers so cloud choices match the product. Experience with containers and CI/CD is expected."
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    location: "Pune / Hybrid",
    type: "Full-time",
    summary: "Shape operational products where clarity matters more than decoration.",
    description: "You will design flows for people under time pressure: dispatchers, clinicians’ admin teams, field staff. We want strong systems thinking and comfort working beside engineers in Pune."
  },
  {
    slug: "software-engineering-internship",
    title: "Software Engineering Internship",
    location: "Pune / Hybrid",
    type: "Internship · 6 months",
    summary: "A paid internship for students and recent graduates who want to ship real client software with the engineering team.",
    description: "You will join a delivery team in Pune and work on a live website, web app, or internal tool. The internship runs for six months.\n\nWhat you will do\nBuild screens in React and small API tasks in Node.js.\nFix bugs, write notes, and sit in reviews with the engineers who own the project.\nLearn how a release is planned, tested, and handed to the client.\n\nWho should apply\nYou are in the final year of a degree, or you graduated in the last 12 months.\nYou have built at least one project with HTML, CSS, and JavaScript.\nYou can come to the Pune office three days a week.\n\nWhat you get\nA mentor on the project, a written plan for the six months, and a stipend. Strong interns are considered for a full-time role."
  },
  {
    slug: "on-job-training-web",
    title: "On Job Training — Web Development",
    location: "Pune / On-site",
    type: "On Job Training · 3 months",
    summary: "A short training program where you learn by working on a real website with the delivery team.",
    description: "On Job Training is hands-on. You spend three months in the Pune office, on a live project, with an engineer beside you.\n\nWhat you will do\nBuild pages, forms, and small fixes on a client website.\nFollow the team’s review notes and learn how a change is tested before it goes live.\nPresent what you built at the end of the program.\n\nWho should apply\nYou know HTML, CSS, and basic JavaScript.\nYou can attend the office on weekdays for the full three months.\nYou want training that is tied to real work, not only classroom lessons.\n\nWhat you get\nDaily guidance, a project brief, and a completion note from KairoEdge. Trainees who do well can apply for the internship or a junior role."
  }
];
