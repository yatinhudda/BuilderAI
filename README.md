# BuilderWithAI (AI Page Builder)

BuilderWithAI is a powerful, dynamic SaaS platform that leverages the **Google Gemini 2.5 Flash API** to autonomously generate responsive User Interfaces (HTML, CSS, JavaScript) from natural language prompts. The generated pages are instantly deployed to a client-facing renderer and integrated with a data-collection backend.

## 🚀 Features

*   **AI-Powered Code Generation:** Describe the UI you want in plain English, and the integrated Gemini 2.5 Flash model instantaneously builds the raw HTML, styled with Tailwind CSS, and accompanying Vanilla JavaScript.
*   **Dual-Application Architecture:**
    *   **Admin UI:** A sleek dashboard to input prompts, view generation status, and get live-preview links.
    *   **Client UI:** A specialized rendering engine (`PageRendererComponent`) that fetches the AI-generated code from the database and safely injects it into the DOM at runtime.
*   **Dynamic Form Handling:** The Client UI automatically scrapes user inputs from any generated forms and submits the structured data back to the server without needing hardcoded schemas.
*   **Persistent Storage:** All generated pages and user submissions are securely stored in **MongoDB**.

## 🛠️ Tech Stack

*   **Backend:** Java 21, Spring Boot 3, Spring Data MongoDB, RestTemplate
*   **Frontend (Admin & Client):** Angular 18, TypeScript, Tailwind CSS
*   **AI Integration:** Google Gemini 2.5 Flash API
*   **Database:** MongoDB

## 📂 Project Structure

```text
BuilderWithAI/
├── admin-ui/      # Angular application for prompting the AI and generating pages
├── client-ui/     # Angular application for dynamically rendering the generated pages
└── backend/       # Spring Boot REST API for Gemini integration and MongoDB storage
```

## ⚙️ Prerequisites

*   **Node.js** (v18+) and **Angular CLI** (`npm install -g @angular/cli`)
*   **Java Development Kit (JDK) 21**
*   **Maven**
*   **MongoDB** (Running locally or via MongoDB Atlas)
*   **Google Gemini API Key** (Get one from Google AI Studio)

## 🚦 Getting Started

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Open `src/main/resources/application.properties` and add your Gemini API Key and MongoDB URI (if different from default):
    ```properties
    spring.data.mongodb.uri=mongodb://localhost:27017/builder_ai
    gemini.api.key=YOUR_GEMINI_API_KEY
    ```
3.  Run the Spring Boot application:
    ```bash
    ./mvnw spring-boot:run
    ```
    *The backend will start on `http://localhost:8080`.*

### 2. Client UI Setup (Renderer)

1.  Navigate to the client-ui directory:
    ```bash
    cd client-ui
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application on port 4201:
    ```bash
    ng serve --port 4201
    ```
    *The client renderer will run on `http://localhost:4201/{pageId}`.*

### 3. Admin UI Setup (Builder)

1.  Navigate to the admin-ui directory:
    ```bash
    cd admin-ui
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application on the default port:
    ```bash
    ng serve
    ```
    *The admin dashboard will run on `http://localhost:4200`.*

## 💡 How to Use

1.  Open the **Admin UI** (`http://localhost:4200`).
2.  Enter a detailed prompt in the text area (e.g., *"A beautiful contact form with name, email, and a glowing submit button"*).
3.  Click **Generate Page with AI**.
4.  Once generation is complete, click the **Open Link** button to view your newly minted UI on the **Client UI** (`http://localhost:4201/...`).
5.  If you generated a form, fill it out on the Client UI and click the static "Save Submission" footer button to send the data back to your MongoDB database!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
