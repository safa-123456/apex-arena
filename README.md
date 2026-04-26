


🏟️ Apex Arena — Sports Club Management System

A full-stack DBMS project for managing sports clubs, members, events, and more — built with React, Node.js, and MySQL.

 Live Demo:  apex-arena-site[.netlify.app](https://apex-arena-site.netlify.app/)

📌 About the Project
Apex Arena is a Sports Club Management System developed as a Database Management System (DBMS) project. It provides a centralized platform to manage everything a sports club needs — from member registration and team management to event scheduling and performance tracking.
The system is backed by a relational MySQL database and exposes a RESTful API via Node.js, with a dynamic React frontend for a seamless user experience.

✨ Features

🧑‍🤝‍🧑 Member Management — Register, view, update, and remove club members
🏅 Team Management — Create and manage sports teams and assign members
📅 Event & Match Scheduling — Schedule matches and tournaments with date/time/venue details
📊 Performance Tracking — Record and view player/team performance statistics
🔐 Authentication — Secure login system for admins and members
📋 Dashboard — Overview of club activity, upcoming events, and stats
🔍 Search & Filter — Easily find members, teams, or events using filters


🛠️ Tech Stack
LayerTechnologyFrontendReact.jsBackendNode.js + ExpressDatabaseMySQLStylingCSS / Tailwind CSSHostingNetlify (Frontend)

🗄️ Database Design
The MySQL database is structured around the following core entities:

Members — Stores personal info, contact details, and membership status
Teams — Stores team name, sport type, and coach details
Member_Team — Junction table linking members to teams (many-to-many)
Events — Stores match/tournament details like date, venue, and type
Performance — Records stats like goals, wins, attendance per member/event
