RAZCOF CONTABIL — FRONTEND PROTOTYPE
====================================
Stack: ASP.NET Core MVC (.NET 8), Razor Views, CSS, JavaScript.
Frontend only: no database, real authentication, accounting calculations, or persistent company portfolio.

Run:
  dotnet restore
  dotnet run

Open the local URL printed by dotnet run.

Demo flow:
1. Open the login page.
2. Enter any non-empty username/email and password.
3. Select a sample company in the modal.
4. Browse the dashboard and module placeholders.

Notes:
- Sample companies, figures, dates and movements are illustrative.
- Do not use this prototype to store real credentials or accounting data.
- The company name is passed in the query string for this visual demo only.
- Next phase: design and implement the accounting module screens before connecting the backend.
