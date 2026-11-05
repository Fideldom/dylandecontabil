(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const focusable = $("input, button, select", modal);
    if (focusable) setTimeout(() => focusable.focus(), 80);
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!$(".modal-backdrop.is-open"))
      document.body.classList.remove("modal-open");
  }
  $$("[data-close]").forEach((button) =>
    button.addEventListener("click", () => closeModal(button.dataset.close)),
  );
  $$(".modal-backdrop").forEach((backdrop) =>
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal(backdrop.id);
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      $$(".modal-backdrop.is-open").forEach((modal) => closeModal(modal.id));
  });

  const loginForm = $("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = $("#email").value.trim();
      const password = $("#password").value;
      const error = $("#loginError");
      if (!email || !password) {
        error.textContent =
          "Preencha o utilizador e a palavra-passe para continuar.";
        (!email ? $("#email") : $("#password")).focus();
        return;
      }
      error.textContent = "";
      openModal("companyModal");
    });
    $("#togglePassword").addEventListener("click", () => {
      const input = $("#password");
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      $("#togglePassword").textContent = showing ? "Mostrar" : "Ocultar";
    });
    $("#forgotLink").addEventListener("click", (e) => {
      e.preventDefault();
      showToast(
        "A recuperação de palavra-passe será ligada ao backend numa próxima fase.",
      );
    });
    $("#openSettings").addEventListener("click", () =>
      openModal("settingsModal"),
    );
  }

  let selectedCompany = "RAZCOF — Comércio e Prestação de Serviços";
  $$(".company-option").forEach((option) =>
    option.addEventListener("click", () => {
      $$(".company-option").forEach((item) =>
        item.classList.remove("selected"),
      );
      option.classList.add("selected");
      selectedCompany = option.dataset.company;
      $("#selectedCompanyLabel").textContent = "Empresa seleccionada";
    }),
  );
  const companySearch = $("#companySearch");
  if (companySearch)
    companySearch.addEventListener("input", () => {
      const query = companySearch.value.toLocaleLowerCase("pt");
      $$(".company-option").forEach((option) => {
        option.hidden = !`${option.dataset.company} ${option.dataset.nif}`
          .toLocaleLowerCase("pt")
          .includes(query);
      });
    });
  const accessCompany = $("#accessCompany");
  if (accessCompany)
    accessCompany.addEventListener("click", () => {
      window.location.href = `/Home/Dashboard?empresa=${encodeURIComponent(selectedCompany)}`;
    });

  const density = $("#densitySelect");
  if (density)
    density.value = localStorage.getItem("razcof-density") || "comfortable";
  $("#saveSettings")?.addEventListener("click", () => {
    const value = density?.value || "comfortable";
    localStorage.setItem("razcof-density", value);
    document.body.classList.toggle("compact-density", value === "compact");
    closeModal("settingsModal");
    showToast("Preferências aplicadas neste navegador.");
  });

  $("#newEntry")?.addEventListener("click", () =>
    showToast(
      "O formulário de lançamento será implementado na fase funcional.",
    ),
  );
  $("#moduleAction")?.addEventListener("click", () =>
    showToast("Esta operação será activada numa próxima fase."),
  );
  $("#dashboardSettings")?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast(
      "As definições completas serão adicionadas nesta fase de evolução.",
    );
  });
  $("#mobileMenu")?.addEventListener("click", () =>
    $("#sidebar")?.classList.toggle("sidebar-open"),
  );

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__razcofToast);
    window.__razcofToast = setTimeout(
      () => toast.classList.remove("show"),
      3600,
    );
  }
})();
