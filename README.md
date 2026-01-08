# 📊 SurveyApp - Frontend

The frontend client for **SurveyApp**, a real-time survey and analytics platform. Built with **React**, **Vite**, and **Tailwind CSS**, it features dynamic form creation, real-time data visualization via WebSockets, and a clean, responsive dashboard.

## 🚀 Live Demo
**View the deployed app:** [https://ak-surveyapp.netlify.app](https://ak-surveyapp.netlify.app)

---

## ✨ Features

* **🔐 Authentication:** Secure Login and Registration pages with JWT handling.
* **📝 Dynamic Form Builder:** Intuitive interface to create surveys with multiple question types (Text, Radio, etc.).
* **📈 Real-time Analytics:** Interactive charts (using `react-chartjs-2`) that update instantly via `Socket.io` when a new response is submitted.
* **📱 Responsive Design:** Fully responsive UI built with Tailwind CSS.
* **🔗 Public Sharing:** Generate shareable links for surveys that anyone can access without logging in.
* **📋 Dashboard:** Manage surveys, copy links, and view submission counts at a glance.

---

## 🛠️ Tech Stack

* **Core:** React (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **State/API:** Axios, Context API
* **Real-time:** Socket.io-client
* **Visualization:** Chart.js, React-Chartjs-2
* **UI Components:** React Hot Toast (Notifications), React Icons

---

## ⚙️ Setup & Installation

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js (v14 or higher)
* The Backend API running locally or remotely.

### 2. Clone & Install
```bash
# Clone the repository
git clone [https://github.com/yourusername/survey-app-frontend.git](https://github.com/yourusername/survey-app-frontend.git)

# Enter the directory
cd survey-app-frontend

# Install dependencies
npm install