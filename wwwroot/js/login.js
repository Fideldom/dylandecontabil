/* DYLANDE Contabil — Login e acesso demonstrativo */

(() => {
    "use strict";

    const STORAGE_KEYS = {
        users: "dylande_demo_users",
        remember: "dylande_remembered_user",
        density: "dylande_density",
        language: "dylande_language"
    };

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberInput = document.getElementById("remember");
    const error = document.getElementById("loginError");
    const togglePassword = document.getElementById("togglePassword");
    const forgotLink = document.getElementById("forgotLink");
    const registerLink = document.getElementById("registerLink");
    const registerForm = document.getElementById("registerForm");
    const registerModal = document.getElementById("registerModal");
    const forgotModal = document.getElementById("forgotModal");
    const companyModal = document.getElementById("companyModal");
    const settingsModal = document.getElementById("settingsModal");

    const defaultUsers = [
        {
            name: "Administrador",
            email: "admin@dylande.ao",
            password: "123456",
            role: "Administrador"
        }
    ];

    function readUsers() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "null");
            return Array.isArray(saved) && saved.length ? saved : defaultUsers;
        } catch {
            return defaultUsers;
        }
    }

    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }

    function showError(message) {
        if (!error) return;
        error.textContent = message;
        error.classList.add("is-visible");
    }

    function clearError() {
        if (!error) return;
        error.textContent = "";
        error.classList.remove("is-visible");
    }

    function openModal(element) {
        if (!element) return;
        element.classList.add("is-open");
        element.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        const firstField = element.querySelector("input, select, button");
        if (firstField) setTimeout(() => firstField.focus(), 50);
    }

    function closeModal(element) {
        if (!element) return;
        element.classList.remove("is-open");
        element.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".modal-backdrop.is-open")) {
            document.body.classList.remove("modal-open");
        }
    }

    function accessCompany(company) {
        const params = new URLSearchParams({ empresa: company });
        window.location.href = `/Home/Dashboard?${params.toString()}`;
    }

    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        clearError();

        const email = emailInput?.value.trim().toLowerCase();
        const password = passwordInput?.value || "";

        if (!email || !password) {
            showError("Preencha o e-mail ou utilizador e a palavra-passe.");
            return;
        }

        const user = readUsers().find(
            (item) => item.email.toLowerCase() === email && item.password === password
        );

        if (!user) {
            showError("Dados de acesso inválidos. Para a demonstração, use admin@dylande.ao / 123456.");
            return;
        }

        if (rememberInput?.checked) {
            localStorage.setItem(STORAGE_KEYS.remember, user.email);
        } else {
            localStorage.removeItem(STORAGE_KEYS.remember);
        }

        openModal(companyModal);
    });

    togglePassword?.addEventListener("click", () => {
        const visible = passwordInput.type === "text";
        passwordInput.type = visible ? "password" : "text";
        togglePassword.textContent = visible ? "Mostrar" : "Ocultar";
        togglePassword.setAttribute("aria-label", visible ? "Mostrar palavra-passe" : "Ocultar palavra-passe");
    });

    forgotLink?.addEventListener("click", (event) => {
        event.preventDefault();
        const forgotEmail = document.getElementById("forgotEmail");
        if (forgotEmail && emailInput?.value.trim()) forgotEmail.value = emailInput.value.trim();
        openModal(forgotModal);
    });

    registerLink?.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(registerModal);
    });

    registerForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("registerName")?.value.trim();
        const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();
        const password = document.getElementById("registerPassword")?.value || "";
        const confirm = document.getElementById("registerConfirm")?.value || "";
        const registerError = document.getElementById("registerError");

        if (registerError) registerError.textContent = "";

        if (!name || !email || !password || !confirm) {
            if (registerError) registerError.textContent = "Preencha todos os campos obrigatórios.";
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            if (registerError) registerError.textContent = "Introduza um endereço de e-mail válido.";
            return;
        }

        if (password.length < 6) {
            if (registerError) registerError.textContent = "A palavra-passe deve ter pelo menos 6 caracteres.";
            return;
        }

        if (password !== confirm) {
            if (registerError) registerError.textContent = "As palavras-passe não coincidem.";
            return;
        }

        const users = readUsers();
        if (users.some((item) => item.email.toLowerCase() === email)) {
            if (registerError) registerError.textContent = "Já existe um utilizador com este e-mail.";
            return;
        }

        users.push({ name, email, password, role: "Utilizador" });
        saveUsers(users);

        emailInput.value = email;
        passwordInput.value = password;
        closeModal(registerModal);
        form?.requestSubmit();
    });

    document.getElementById("forgotForm")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = document.getElementById("forgotMessage");
        if (message) {
            message.textContent = "Pedido registado. Nesta versão sem base de dados, a recuperação é apenas demonstrativa.";
            message.classList.add("is-visible");
        }
    });

    document.querySelectorAll("[data-close]").forEach((button) => {
        button.addEventListener("click", () => closeModal(document.getElementById(button.dataset.close)));
    });

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
        backdrop.addEventListener("click", (event) => {
            if (event.target === backdrop) closeModal(backdrop);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        document.querySelectorAll(".modal-backdrop.is-open").forEach(closeModal);
    });

    document.querySelectorAll("[data-company]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".company-option").forEach((item) => item.classList.remove("selected"));
            button.classList.add("selected");
            const label = document.getElementById("selectedCompanyLabel");
            if (label) label.textContent = "1 empresa seleccionada";
        });
    });

    document.getElementById("accessCompany")?.addEventListener("click", () => {
        const selected = document.querySelector(".company-option.selected");
        if (selected) accessCompany(selected.dataset.company);
    });

    document.getElementById("companySearch")?.addEventListener("input", (event) => {
        const query = event.target.value.trim().toLowerCase();
        document.querySelectorAll(".company-option").forEach((item) => {
            item.hidden = !item.textContent.toLowerCase().includes(query);
        });
    });

    document.getElementById("openSettings")?.addEventListener("click", () => openModal(settingsModal));

    document.getElementById("saveSettings")?.addEventListener("click", () => {
        const density = document.getElementById("densitySelect")?.value;
        const language = document.getElementById("languageSelect")?.value;
        localStorage.setItem(STORAGE_KEYS.density, density || "comfortable");
        localStorage.setItem(STORAGE_KEYS.language, language || "Português");
        document.documentElement.dataset.density = density || "comfortable";
        closeModal(settingsModal);
    });

    const remembered = localStorage.getItem(STORAGE_KEYS.remember);
    if (remembered && emailInput) {
        emailInput.value = remembered;
        if (rememberInput) rememberInput.checked = true;
    }

    const savedDensity = localStorage.getItem(STORAGE_KEYS.density) || "comfortable";
    document.documentElement.dataset.density = savedDensity;
})();
