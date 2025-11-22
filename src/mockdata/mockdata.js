// mockResume.js
const mockResume = {
  basics: {
    name: "Akhil Kumar Bajineni",
    email: "akhilkumarbajineni@gmail.com",
    phone: "+91-6281812378",
    location: {
      city: "Hyderabad",
      region: "Telangana",
      country: "India"
    },
    profiles: [
      { network: "LinkedIn", url: "https://www.linkedin.com/in/bajineni-akhil-kumar-91b9a9282" },
      { network: "GitHub", url: "https://github.com/yourusername" }
    ],
    summary:
      "Results-driven Full Stack Developer with 1+ year of hands-on experience building scalable web applications using Spring Boot, Angular, React, and Next.js. Proven ability to optimize backend performance and deliver responsive, user-centric interfaces."
  },
  work: [
    {
      name: "Endeavour Technologies",
      position: "Full-Stack Developer",
      location: "Hyderabad, India",
      startDate: "2024-11",
      endDate: "Present",
      projects: [
        {
          name: "Med-worldexpo Platform",
          highlights: [
            "Optimized database queries reducing API response time by 30%.",
            "Built reusable Angular components (pagination, dynamic filters).",
            "Implemented advanced Angular async patterns with Observables and RxJS."
          ]
        },
        {
          name: "Sales & Procurement ERP Module",
          highlights: [
            "Implemented PDF report generation with jsPDF and AWS S3.",
            "Optimized multi-table JOIN queries reducing load time by 45%."
          ]
        }
      ]
    }
  ],
  projects: [
    {
      name: "goRAP - Ride-Sharing Mobile Application",
      technologies: ["React Native", "Spring Boot", "PostgreSQL", "Docker"],
      highlights: [
        "Built cross-platform mobile app with real-time ride matching.",
        "Deployed backend on Render using multi-stage Docker containers."
      ]
    },
    {
      name: "PrepZone - Learning Management System",
      technologies: ["Next.js", "React", "Tailwind CSS"],
      highlights: [
        "Built LMS with server-side rendering and a reusable notification system."
      ]
    }
  ],
  education: [
    {
      institution: "Methodist College of Engineering and Technology",
      location: "Hyderabad, Telangana",
      studyType: "Bachelor of Engineering",
      area: "Computer Science and Engineering",
      startDate: "2019-08",
      endDate: "2023-06"
    }
  ],
  skills: [
    { name: "Languages", keywords: ["Java", "JavaScript", "TypeScript", "SQL"] },
    { name: "Frontend", keywords: ["React", "Angular 16", "Next.js", "Redux", "RxJS", "Tailwind CSS"] },
    { name: "Backend", keywords: ["Spring Boot", "Spring MVC", "RESTful APIs"] }
  ],
  achievements: [
    "Recognized as Best Employee within 5 months for exceptional performance.",
    "Reduced Docker image size by 60% with multi-stage builds.",
    "Reduced dashboard load time by 45% with optimized queries."
  ]
};

export default mockResume;
