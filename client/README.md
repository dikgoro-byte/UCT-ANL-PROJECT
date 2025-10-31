# 🏆 African Nations League Simulator

> A full-stack MERN application built as part of the UCT Entrance Exam. This project simulates the 2026 African Nations League tournament, from team registration to generating a final tournament summary.

## 🚀 Live Demo

* **Live Frontend (Netlify):** `[https://sprightly-paletas-4c279a.netlify.app/]`
* **Live Backend (Render):** `[https://uct-anl-project.onrender.com]`

## 📸 Screenshots

![Visitor Landing - Home Page](image.png)
![alt text](image-2.png)
 ![Administrator Home Page - Logged In](image-3.png) 
|![Bracket Page](image-4.png) 
 |![ Admin Panel Page](image-5.png)
 ![Top Goal Scorers Page](image-7.png)
 ![Representative Landing - Home Page](image-8.png)
 ![View My Team - Representative Logged In](image-9.png)
 ![Tournament Summary Page](image-10.png)
 ![Administrator Sign Up](image-11.png)
| ![Representative Registration - Pick Country Page](image-12.png)

## ✨ Key Features

This application fulfills all project requirements, including:

* **User Authentication:** Full JWT (JSON Web Token) authentication with hashed passwords (bcrypt.js).
* **Role-Based Access Control:**
    * **Admin:** Can simulate the tournament and generate summaries.
    * **Representative:** Can register a team, view their squad, and see results.
    * **Visitor:** Can view public pages (Bracket, Scorers, Summary).
* **Team Registration:**
    * A context-aware **Country Dropdown** lists all 54 African nations.
    * On registration, a **23-player squad** is auto-generated with realistic ratings and positions (e.g., 'GK', 'DF', 'MD', 'AT').
    * A **Captain** is automatically assigned and highlighted on the "View My Team" page, fulfilling the brief.
* **Tournament Simulation:**
    * A one-click **"Simulate Tournament"** button for the Admin.
    * Simulation logic is based on team ratings, with a "smart" goalscorer function to create realistic, varied results (including braces and hat-tricks).
* **Dynamic Results Pages:**
    * **Bracket Page:** Dynamically builds the "Road to the Final" bracket from the 7 simulated matches.
    * **Top Scorers Page:** Aggregates and displays a sorted list of all goalscorers.
    * **"View My Team" Page:** A protected route for reps to view their generated 23-player squad and see their captain.
* **"AI" Summary Generation:**
    * A safe, free, and 100% reliable "Mock AI" feature.
    * After simulation, the Admin can click "Generate Summary." This finds the tournament winner and saves a context-aware, pre-written summary to the database for all users to see.
* *** Email Notification:**
    * Fulfills the email requirement in a safe, risk-free way.
    * On simulation completion, the Admin sees a "Federations notified by email" pop-up.
    * The backend logs a "Simulated Email" to the console, proving the logic is in place to email all registered representatives.
* **Polished, Context-Aware UI:**
    * The homepage is fully responsive and shows different content based on user role (Admin, Rep, or Visitor).
    * A 4-second success timer automatically redirects a rep after team registration.

    ## Log In Credentials:
    To sign up and log in as the administrator I suggest using the following:
    Username: Dikgoro Makaleng
    Password: Fineboyy2k#
    Email: dikgorom@gmail.com

    To Sign Up and Log in as the representative of a tem I suggest using the following:
    Username: Tyla Seethal
    Password: Makemesweat123#
    Email: water@gmail.com
    
## 🛠️ Tech Stack

* **Frontend:** React, React Router, TailwindCSS, Axios
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB (via MongoDB Atlas)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js

## ⚙️ Running Locally

### Prerequisites

* Node.js (v18 or later)
* Git
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account to get a `MONGO_URI` connection string.

### 1. Clone the Repository

```bash
git clone [https://github.com/dikgoro-byte/UCT-ANL-PROJECT](https://github.com/dikgoro-byte/UCT-ANL-PROJECT)
cd dikgoro-byte