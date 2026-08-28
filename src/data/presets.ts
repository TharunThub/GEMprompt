import { PresetRequisition } from '../types/sourcing';

export const PRESET_REQUISITIONS: PresetRequisition[] = [
  {
    id: 'senior-backend-golang',
    label: 'Senior Backend Engineer (Golang & Distributed Systems)',
    badge: 'Backend / Core Infra',
    input: {
      title: 'Senior Backend Engineer - High Throughput Platform',
      location: 'Bengaluru / Hybrid or Remote India',
      seniority: 'Senior / Staff (5-8+ Years)',
      workModel: 'Hybrid',
      jobDescription: `Job Title: Senior Backend Engineer (Distributed Systems)
Location: Bengaluru, India (Hybrid - 2 days in office)
Experience: 5-9 Years

About the Role:
We are looking for an experienced Senior Backend Engineer to architect, build, and scale our next-generation low-latency transactional ledger and event-driven data streaming pipelines. You will be responsible for handling 150K+ requests per second with sub-millisecond p99 latencies.

Key Responsibilities:
- Design, develop, and maintain resilient microservices using Go (Golang) and gRPC.
- Architect high-throughput event processing pipelines leveraging Apache Kafka and Redis.
- Build fault-tolerant distributed storage models on PostgreSQL, CockroachDB, or Cassandra.
- Implement distributed tracing, metrics, and alerting using OpenTelemetry, Prometheus, and Grafana.
- Optimize concurrency, memory allocation, garbage collection, and network I/O in Go.
- Mentor mid-level engineers and conduct deep architectural code reviews.

Qualifications & Requirements:
- 5+ years of production experience in backend software engineering with at least 3+ years writing high-concurrency Go (Golang).
- Strong computer science fundamentals in data structures, algorithms, concurrency primitives (goroutines, channels, mutexes), and distributed consensus (Raft, Paxos).
- Deep experience with Kafka partition strategies, consumer groups, and schema registries.
- Solid experience with containerization (Docker, Kubernetes) and AWS/GCP cloud native environments.
- Bachelor's or Master's degree in Computer Science or equivalent practical experience.`,
      intakeNotes: `HM Requisition Intake Notes (Hiring Manager: Priya K., VP of Platform Eng):

Context & Urgency:
- Critical backfill for our core payment gateway & ledger team. Need someone who can hit the ground running within 30-45 days.

Candidate Persona & Non-Negotiables:
- MUST have real production experience handling high scale / high QPS (not just building internal CRUD tools).
- Go (Golang) is NON-NEGOTIABLE. If they have Java/C++ background, they must have spent the last 2+ continuous years in Go.
- Must deeply understand Go memory profiling (pprof, gc tuning, race detector) and Kafka internals (lag management, rebalancing).

Flexibility / Flex Zones:
- Willing to compromise on total YOE: If a 4-year candidate has built top-tier scale at Swiggy, Razorpay, Zepto, Flipkart, or Uber, hire them over a 10-year candidate with low-scale experience.
- Education: Tier-1 degree is nice, but strong open source contributions or competitive programming / Github track record easily overrides university pedigree.
- Remote flexibility: Open to fully remote for stellar tier-1 platform talent, though hybrid Bengaluru is standard.

Dealbreakers:
- Candidates exclusively from service companies/IT consulting firms (e.g., TCS, Infosys, Wipro) unless they worked in dedicated product engineering labs or fintech clients with verifiable scale.
- Candidates with more than 3 job hops in the last 3 years without strong justifications.
- Notice period exceeding 60 days (unless buyable).

Target Companies to Poach From:
- Tier 1: Razorpay, CRED, Swiggy, Zomato, PhonePe, Flipkart, Juspay, Slice, Groww, Gojek.
- Global Fintech / Platform Hubs: Uber, Grab, Stripe India, Coinbase India, Atlassian.

Off-Limits / Exclusions:
- No poaching from our investor sister portfolio companies: [AcmePay, ZetaPrime].
- Avoid candidates residing in cities without direct airport connectivity if they opt for hybrid travel.`
    }
  },
  {
    id: 'staff-ml-genai',
    label: 'Staff AI/LLM Engineer (Generative AI & RAG)',
    badge: 'AI / Machine Learning',
    input: {
      title: 'Staff AI Engineer - LLM & Agentic Systems',
      location: 'San Francisco, CA / Hybrid',
      seniority: 'Staff / Principal (7+ Years)',
      workModel: 'Hybrid',
      jobDescription: `Job Title: Staff AI Engineer - Generative AI & Autonomous Agents
Location: San Francisco, CA (Hybrid - 3 days onsite)
Experience: 7+ Years

Role Overview:
Join our foundational AI team to design and deploy state-of-the-art enterprise Agentic workflows, Multi-modal Retrieval-Augmented Generation (RAG) pipelines, and fine-tuned domain-specific Small Language Models (SLMs).

Key Responsibilities:
- Design enterprise-scale Agent orchestration architectures using LangGraph, Semantic Kernel, and custom tool-calling frameworks.
- Build production-grade vector search and hybrid retrieval systems using Qdrant, Milvus, and pgvector.
- Fine-tune open-weight models (Llama 3, Mistral, Qwen) using LoRA/QLoRA, DPO, and RLHF on GPU clusters.
- Implement robust evaluation frameworks (RAGAS, LangSmith, TruLens) for hallucination detection, latency, and token efficiency.
- Collaborate with product and security teams to implement guardrails (NeMo Guardrails, Llama Guard).

Requirements:
- MS or PhD in Computer Science, Machine Learning, or related quantitative discipline.
- 5+ years in ML engineering, with at least 2+ years deploying production LLM/GenAI applications.
- Strong proficiency in Python, PyTorch, vLLM, TensorRT-LLM, and Triton Inference Server.
- Proven track record of shipping production AI products at scale with latency < 500ms.`,
      intakeNotes: `HM Requisition Intake Notes (Hiring Manager: Alex Vance, Head of AI):

Context:
- We are moving from single prompt wrappers to full autonomous multi-agent systems with self-reflection and tool execution.

Must-Haves:
- Hands-on experience optimizing inference engines (vLLM, TensorRT-LLM) and GPU memory management (KV cache optimization, speculative decoding).
- Deep experience building hybrid search + reciprocal rank fusion (BM25 + Dense embeddings) that works in messy real-world enterprise docs.
- Shipped actual GenAI to thousands of daily active users, not just academic notebooks or weekend toy demos.

Flex Zones:
- PhD is optional if the candidate has first-authored papers at NeurIPS/ICLR/ACL or has built popular open-source GenAI tools (>1k GitHub stars).
- Willing to consider candidates with traditional NLP / Search background who transitioned aggressively into LLMs.

Dealbreakers:
- "Prompt engineers" or wrapper builders with no underlying PyTorch, CUDA, or systems knowledge.
- Candidates who only have experience using closed-source APIs (OpenAI/Anthropic) without understanding model internals, embeddings, or latency engineering.

Target Companies:
- Perplexity, Cursor/Anysphere, Cohere, Scale AI, Glean, Anthropic, Jasper, Mistral, Harvey AI, OpenAI alumni, Runway.

Off-Limits:
- Direct competitors currently in non-solicit agreements: [Cognition AI, LegalRobot].`
    }
  },
  {
    id: 'lead-product-designer',
    label: 'Lead Product Designer (B2B SaaS / Design Systems)',
    badge: 'Design / UX',
    input: {
      title: 'Lead Product Designer - Enterprise Platform Experience',
      location: 'New York, NY / Remote US',
      seniority: 'Lead / Principal (6-10 Years)',
      workModel: 'Remote',
      jobDescription: `Position: Lead Product Designer (B2B SaaS)
Location: Remote (US / Canada)
Experience: 6+ Years

About the Role:
We are seeking a Lead Product Designer to spearhead the UX and visual architecture of our core analytics and workflow automation suite. You will transform complex data-heavy workflows into intuitive, elegant, and frictionless user experiences.

What You'll Do:
- Own end-to-end design for our enterprise analytics dashboard, from discovery and information architecture to high-fidelity prototypes and design system tokens.
- Partner closely with Product Managers and Engineering Leads to define quarterly roadmaps and product strategy.
- Conduct continuous qualitative user interviews and quantitative usability testing with enterprise customers.
- Expand and govern our multi-brand design system in Figma, ensuring token-based consistency with frontend engineers.

Requirements:
- 6+ years designing complex B2B SaaS, developer tools, fintech, or data-intensive web applications.
- World-class portfolio showcasing end-to-end problem solving, interaction design, and systems thinking.
- Mastery of Figma, auto-layout, component variables, interactive prototyping, and design tokens.
- Strong ability to articulate design decisions with data and business metrics.`,
      intakeNotes: `HM Requisition Intake Notes (Hiring Manager: Marcus Chen, VP of Design):

Core Focus:
- This role requires heavy systems thinking. Our product is complex data-dense tables, filter builders, and workflow canvases.

Non-Negotiables:
- Portfolio MUST demonstrate complex B2B / enterprise workflows (tables, configuration engines, permission models, dashboards).
- High visual craft + micro-interaction finesse. Not just wireframes.
- Must have experience working directly in token-based Figma libraries synced with React/Storybook.

Flexibility:
- Location is 100% remote across US/Canada timezones (EST to PST).
- Can consider senior designers ready to step up to Lead if their IC craft and systems architecture are exceptional.

Dealbreakers:
- Portfolios containing only Dribbble-style marketing landing pages, mobile eCommerce apps, or agency case studies without shipped product metrics.
- Designers who cannot explain their design rationale or how they handled engineering tradeoffs.

Target Companies:
- Figma, Datadog, Snowflake, Linear, Notion, Retool, Airtable, Stripe, Segment, Vercel, Supabase.

Off-Limits:
- Avoid agencies where candidates only did brief conceptual sprints without seeing products into continuous production.`
    }
  },
  {
    id: 'enterprise-ae-saas',
    label: 'Enterprise Account Executive (Fintech / B2B SaaS)',
    badge: 'Sales & Go-To-Market',
    input: {
      title: 'Enterprise Account Executive - Strategic Accounts',
      location: 'London, UK / Hybrid',
      seniority: 'Senior / Enterprise (5-8+ Years)',
      workModel: 'Hybrid',
      jobDescription: `Role: Enterprise Account Executive (Strategic Accounts)
Location: London, United Kingdom
OTE: £180,000 - £220,000 + Equity

Responsibilities:
- Hunt and close new enterprise logos with contract values (ACV) between £100k and £500k+ across EMEA financial services and tech sectors.
- Navigate complex multi-stakeholder procurement, security, legal, and C-level (CFO/CTO/CIO) buying committees.
- Build and execute rigorous territory and account plans using MEDDPICC methodology.
- Partner with Solution Engineers and SDRs to build 4x qualified pipeline.

Requirements:
- 5+ years of quota-carrying Enterprise SaaS sales experience in the UK/EMEA market.
- Consistent track record of 100%+ quota attainment (P-Club / President's Club recognition preferred).
- Experience closing 6-figure complex software deals with 6-9 month sales cycles.
- Deep familiarity with MEDDPICC, Challenger Sale, or Command of the Message.`,
      intakeNotes: `HM Requisition Intake Notes (Hiring Manager: Sarah Davies, VP of EMEA Sales):

Intake Highlights:
- We need a hunter who knows how to break into Tier 1 Banks, Fintechs, and Insurance giants across London, Frankfurt, and Amsterdam.

Non-Negotiables:
- Proven history of closing £150k+ ACV software deals. (No SMB or transactional velocity sales reps).
- MEDDPICC certified or verifiable fluent practitioner.
- Verifiable W2 / P60 quota performance (>100% attainment for at least 3 out of last 4 years).

Flexibility:
- Industry: While Fintech/Banking is ideal, will look at top enterprise reps from Cybersecurity, Cloud Infra, or Data Analytics who have sold into Financial Services.
- Base vs Variable split flexibility for proven top 5% performers.

Dealbreakers:
- Reps who have only managed inbound expansion / account management (AM) without net-new logo hunting experience.
- Job tenure < 1.5 years across multiple consecutive companies (serial quota hoppers).

Target Companies:
- Adyen, Stripe, Checkout.com, Thought Machine, MongoDB, Dynatrace, Snowflake, HashiCorp, Datadog.

Off-Limits:
- Traditional legacy mainframe/on-prem software reps who have not sold modern cloud APIs/SaaS.`
    }
  }
];
