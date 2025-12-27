import React, { useEffect, useState } from "react";
import data from "../utils/data.json";

function DefaultTemplate() {

    const [jsonData, setJsonData] = useState(data);

    useEffect(() => { 

    }, []);

    // CASE - 1 :: if the section is string directly display it

    return (
        // <div
        //     style={{
        //         maxWidth: "800px",
        //         margin: "0 auto",
        //         fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        //         color: "#333",
        //         lineHeight: 1.5,
        //         padding: "1.5rem",
        //     }}
        // >
        //     {/* HEADING */}
        //     <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        //         <h1 style={{ margin: 0, fontSize: "2rem", textTransform: "uppercase" }}>
        //             Ranadeep Bashetty
        //         </h1>
        //         <p style={{ margin: "0.25rem 0" }}>Hyderabad, Telangana</p>
        //         <div
        //             style={{
        //                 display: "flex",
        //                 gap: "0.75rem",
        //                 justifyContent: "center",
        //                 flexWrap: "wrap",
        //                 fontSize: "0.9rem",
        //             }}
        //         >
        //             <a href="tel:+919121923255" style={{ textDecoration: "none" }}>
        //                 📞 +91-9121923255
        //             </a>
        //             <a
        //                 href="mailto:ranadeepbashetty008@gmail.com"
        //                 style={{ textDecoration: "none" }}
        //             >
        //                 ✉️ ranadeepbashetty008@gmail.com
        //             </a>
        //             <a
        //                 href="https://www.linkedin.com/in/ranadeep-bashetty-a28b641bb/"
        //                 target="_blank"
        //                 rel="noreferrer"
        //                 style={{ textDecoration: "none" }}
        //             >
        //                 🔗 Linkedin
        //             </a>
        //             <a
        //                 href="https://github.com/Ranadeep01"
        //                 target="_blank"
        //                 rel="noreferrer"
        //                 style={{ textDecoration: "none" }}
        //             >
        //                 💻 Github
        //             </a>
        //             <a
        //                 href="https://leetcode.com/ranadeep_20/"
        //                 target="_blank"
        //                 rel="noreferrer"
        //                 style={{ textDecoration: "none" }}
        //             >
        //                 🧩 LeetCode
        //             </a>
        //             <a
        //                 href="https://auth.geeksforgeeks.org/user/20r21a05d0"
        //                 target="_blank"
        //                 rel="noreferrer"
        //                 style={{ textDecoration: "none" }}
        //             >
        //                 🧠 GeeksforGeeks
        //             </a>
        //         </div>
        //     </header>

        //     {/* SUMMARY */}
        //     <section style={{ marginBottom: "1.25rem" }}>
        //         <SectionTitle title="SUMMARY" />
        //         <p style={{ fontSize: "0.95rem" }}>
        //             Full-Stack / Backend Engineer with hands-on experience building
        //             scalable, high-performance web applications using{" "}
        //             <strong>
        //                 Java, Spring Boot, Node.js, Angular, MongoDB, PostgreSQL, and AWS
        //             </strong>
        //             . Skilled in developing RESTful APIs, microservices, event-driven
        //             architecture, database modeling, and secure authentication systems.
        //             Proven ability to collaborate with cross-functional teams, optimize
        //             performance, and deploy production-ready solutions in cloud
        //             environments. Passionate about solving real-world engineering
        //             challenges and continuously learning modern technologies.
        //         </p>
        //     </section>

        //     {/* EDUCATION */}
        //     <section style={{ marginBottom: "1.25rem" }}>
        //         <SectionTitle title="EDUCATION" />
        //         <div style={{ marginBottom: "0.5rem" }}>
        //             <div
        //                 style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                     fontWeight: 600,
        //                 }}
        //             >
        //                 <span>MLR Institute of Technology, Hyderabad</span>
        //                 <span>November 2020 – April 2024</span>
        //             </div>
        //             <div
        //                 style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                     fontSize: "0.9rem",
        //                     fontStyle: "italic",
        //                 }}
        //             >
        //                 <span>
        //                     B.Tech - Computer Science and Engineering -{" "}
        //                     <strong>CGPA - 7.5</strong>
        //                 </span>
        //                 <span>Hyderabad, Telangana</span>
        //             </div>
        //         </div>
        //     </section>

        //     {/* EXPERIENCE */}
        //     <section style={{ marginBottom: "1.25rem" }}>
        //         <SectionTitle title="EXPERIENCE" />

        //         {/* Job 1 */}
        //         <div style={{ marginBottom: "0.75rem" }}>
        //             <div
        //                 style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                     fontWeight: 700,
        //                     fontSize: "1rem",
        //                 }}
        //             >
        //                 <span>Full Stack Developer at Endeavour Technologies</span>
        //                 <span style={{ fontSize: "0.9rem" }}>
        //                     March 2024 – August 2025
        //                 </span>
        //             </div>

        //             <div style={{ marginTop: "0.35rem" }}>
        //                 <div
        //                     style={{
        //                         fontWeight: 600,
        //                         fontStyle: "italic",
        //                         marginBottom: "0.15rem",
        //                     }}
        //                 >
        //                     Project: Laboratory Information Management System (LIMS)
        //                 </div>
        //                 <ul
        //                     style={{
        //                         margin: 0,
        //                         paddingLeft: "1.1rem",
        //                         fontSize: "0.9rem",
        //                     }}
        //                 >
        //                     <li>
        //                         Developed and enhanced core product modules integrating{" "}
        //                         <strong>RESTful APIs</strong> with <strong>Angular</strong>{" "}
        //                         front-end and backend service layers.
        //                     </li>
        //                     <li>
        //                         Built reusable UI frameworks and micro front-end components
        //                         improving development efficiency by 25%.
        //                     </li>
        //                     <li>
        //                         Collaborated with backend teams on API contracts, data
        //                         validation, and workflow orchestration.
        //                     </li>
        //                     <li>
        //                         Optimized page rendering, reducing load time using lazy loading
        //                         and caching strategies.
        //                     </li>
        //                     <li>
        //                         Improved accessibility and responsiveness across platforms to
        //                         ensure smooth experience.
        //                     </li>
        //                 </ul>
        //             </div>

        //             <div style={{ marginTop: "0.5rem" }}>
        //                 <div
        //                     style={{
        //                         fontWeight: 600,
        //                         fontStyle: "italic",
        //                         marginBottom: "0.15rem",
        //                     }}
        //                 >
        //                     Project: Med-worldexpo
        //                 </div>
        //                 <ul
        //                     style={{
        //                         margin: 0,
        //                         paddingLeft: "1.1rem",
        //                         fontSize: "0.9rem",
        //                     }}
        //                 >
        //                     <li>
        //                         Implemented secure authentication flows (login, signup, password
        //                         reset) and session management.
        //                     </li>
        //                     <li>
        //                         Improved overall application performance using route preloading,
        //                         dynamic modules, and optimized pipeline.
        //                     </li>
        //                     <li>
        //                         Participated in code reviews, QA cycles, and debugging for
        //                         production stability.
        //                     </li>
        //                 </ul>
        //             </div>
        //         </div>

        //         {/* Job 2 */}
        //         <div style={{ marginBottom: "0.75rem" }}>
        //             <div
        //                 style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                     fontWeight: 700,
        //                     fontSize: "1rem",
        //                 }}
        //             >
        //                 <span>Software Engineer at Ez-XBRL</span>
        //                 <span style={{ fontSize: "0.9rem" }}>August 2025 – Present</span>
        //             </div>

        //             <div style={{ marginTop: "0.35rem" }}>
        //                 <div
        //                     style={{
        //                         fontWeight: 600,
        //                         fontStyle: "italic",
        //                         marginBottom: "0.15rem",
        //                     }}
        //                 >
        //                     Project: Integix (Data Automation &amp; Processing Platform)
        //                 </div>
        //                 <ul
        //                     style={{
        //                         margin: 0,
        //                         paddingLeft: "1.1rem",
        //                         fontSize: "0.9rem",
        //                     }}
        //                 >
        //                     <li>
        //                         Built scalable backend services using <strong>Node.js</strong>,
        //                         {" "} <strong>Express</strong> and integrated with cloud-native
        //                         infrastructure.
        //                     </li>
        //                     <li>
        //                         Designed and optimized document transformation pipelines and
        //                         database schemas in <strong>MongoDB</strong>.
        //                     </li>
        //                     <li>
        //                         Developed and consumed <strong>REST APIs</strong> to enable
        //                         distributed modular product functionality.
        //                     </li>
        //                     <li>
        //                         Deployed and monitored applications on{" "}
        //                         <strong>AWS (EC2, S3, Lambda, RDS)</strong>, improving
        //                         availability and failover reliability.
        //                     </li>
        //                     <li>
        //                         Worked with CI/CD pipelines, version control, and deployment
        //                         workflows ensuring smooth production releases.
        //                     </li>
        //                 </ul>
        //             </div>
        //         </div>
        //     </section>

        //     {/* PERSONAL PROJECTS */}
        //     <section style={{ marginBottom: "1.25rem" }}>
        //         <SectionTitle title="PERSONAL PROJECTS" />

        //         {/* Project 1 */}
        //         <div style={{ marginBottom: "0.75rem" }}>
        //             <div
        //                 style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                     fontWeight: 600,
        //                     fontStyle: "italic",
        //                 }}
        //             >
        //                 <span>Project: Random Chat Room</span>
        //                 <span style={{ fontSize: "0.9rem" }}>June 2025 – July 2025</span>
        //             </div>
        //             <ul
        //                 style={{
        //                     margin: "0.25rem 0 0",
        //                     paddingLeft: "1.1rem",
        //                     fontSize: "0.9rem",
        //                 }}
        //             >
        //                 <li>
        //                     Developed a real-time chat web application using{" "}
        //                     <strong>React.js</strong>, WebSockets and a component-based
        //                     architecture.
        //                 </li>
        //                 <li>
        //                     Designed user flows such as chat rooms, message grouping, and
        //                     authentication.
        //                 </li>
        //                 <li>
        //                     Ensured responsive UI compatibility and smooth performance using
        //                     optimized rendering techniques.
        //                 </li>
        //             </ul>
        //         </div>

        //         {/* Project 2 */}
        //         <div style={{ marginBottom: "0.75rem" }}>
        //             <div
        //                 style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                     fontWeight: 600,
        //                     fontStyle: "italic",
        //                 }}
        //             >
        //                 <span>Project: goRAP (Ride &amp; Pool Mobile Application)</span>
        //                 <span style={{ fontSize: "0.9rem" }}>July 2025 – November 2025</span>
        //             </div>
        //             <ul
        //                 style={{
        //                     margin: "0.25rem 0 0",
        //                     paddingLeft: "1.1rem",
        //                     fontSize: "0.9rem",
        //                 }}
        //             >
        //                 <li>
        //                     Built a mobile-first ride-sharing system allowing users to create
        //                     ride request cards and enabling vehicle owners to accept or
        //                     schedule rides.
        //                 </li>
        //                 <li>
        //                     Developed core application logic including ride creation workflow,
        //                     dynamic ride listing, and request handling.
        //                 </li>
        //                 <li>
        //                     Integrated real-time updates using REST API communication and
        //                     event-based triggers.
        //                 </li>
        //                 <li>
        //                     Implemented modular UI architecture with{" "}
        //                     <strong>React Native</strong> and reusable application components.
        //                 </li>
        //                 <li>
        //                     Ensured secure user authentication and smooth multi-device UX.
        //                 </li>
        //             </ul>
        //         </div>
        //     </section>

        //     {/* PROFESSIONAL SKILLS */}
        //     <section style={{ marginBottom: "0.5rem" }}>
        //         <SectionTitle title="PROFESSIONAL SKILLS" />
        //         <ul
        //             style={{
        //                 listStyle: "none",
        //                 paddingLeft: 0,
        //                 fontSize: "0.9rem",
        //                 margin: 0,
        //             }}
        //         >
        //             <li>
        //                 <strong>Languages:</strong> Java, JavaScript, TypeScript, SQL
        //             </li>
        //             <li>
        //                 <strong>Backend:</strong> Spring Boot, Node.js, Express.js, RESTful
        //                 APIs, Microservices
        //             </li>
        //             <li>
        //                 <strong>Frontend:</strong> Angular, React.js, Tailwind CSS, React
        //                 Native
        //             </li>
        //             <li>
        //                 <strong>Database:</strong> MongoDB, PostgreSQL, MySQL
        //             </li>
        //             <li>
        //                 <strong>Cloud &amp; DevOps:</strong> AWS (EC2, S3, Lambda, RDS),
        //                 Docker, CI/CD pipelines
        //             </li>
        //             <li>
        //                 <strong>Authentication:</strong> JWT, OAuth, Role-based Access
        //                 Control
        //             </li>
        //             <li>
        //                 <strong>Tools &amp; Others:</strong> Git, GitHub, Bitbucket,
        //                 Postman, Swagger, Figma
        //             </li>
        //             <li>
        //                 <strong>Soft Skills:</strong> Problem Solving, Collaboration,
        //                 Ownership, Communication
        //             </li>
        //         </ul>
        //     </section>
        // </div>

        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                color: "#333",
                lineHeight: 1.5,
                padding: "1.5rem",
            }}
        >
            {
                Object.keys(data).map((key) => {
                    return (
                        <div>

                            <SectionTitle title={key} />
                            {
                                typeof data[key] === 'string' && SectionText({ text: data[key] })
                            }
                            {
                                typeof data[key] === 'object' && <SectionText text={data[key].text} />
                            }
                        </div>
                    )
                })
            }
        </ div>

    );
}

function SectionTitle({ title }) {
    return (
        <div style={{ marginBottom: "0.35rem" }}>
            <h2
                style={{
                    fontSize: "1rem",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                }}
            >
                {title}
            </h2>
            <hr
                style={{
                    margin: "0.25rem 0 0",
                    border: "none",
                    borderTop: "1px solid #000",
                }}
            />
        </div>
    );
}

function SectionText({ text }) {
    return (
        <p
            style={{
                margin: "0.25rem 0 0",
                fontSize: "0.9rem",
            }}
        >
            {text}
        </p>
    );
}

export default DefaultTemplate;
