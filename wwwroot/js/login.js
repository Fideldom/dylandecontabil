/* Login · DYLANDE Contabil */

const form = document.getElementById("loginForm");
const modal = document.getElementById("companyModal");
const error = document.getElementById("error");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const user = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!user || !password) {
        error.style.display = "block";
        return;
    }

    error.style.display = "none";
    modal.classList.add("open");
});
document.querySelectorAll("[data-company]").forEach((button) => {
    button.addEventListener("click", () => {
        const company = button.dataset.company;
        window.location.href = `/Home/Dashboard?empresa=${encodeURIComponent(company)}`;
    });
});
document.getElementById("help").addEventListener("click", (event) => {
    event.preventDefault();
    window.alert("Neste protótipo, utilize qualquer utilizador e palavra-passe não vazios.");
});
