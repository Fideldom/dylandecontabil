(() => {
  "use strict";

  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  let toastTimer;

  function showToast(message) {
    const toast = query("#toast");

    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
      return;
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
      return;
    }

    modal.classList.remove("open");

    if (!query(".modal-backdrop.open")) {
      document.body.style.overflow = "";
    }
  }

  function initializeModals() {
    queryAll(".modal-backdrop").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    queryAll(".modal-close").forEach((button) => {
      button.addEventListener("click", () => {
        closeModal(button.dataset.close);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }

      queryAll(".modal-backdrop.open").forEach((modal) => {
        closeModal(modal.id);
      });
    });
  }

  function initializeSidebar() {
    const sidebar = query("#sidebar");
    const overlay = query("#mobileOverlay");
    const menuButton = query("#menuButton");
    const closeButton = query("#sidebarClose");

    const closeSidebar = () => {
      sidebar?.classList.remove("open");
      overlay?.classList.remove("open");
    };

    menuButton?.addEventListener("click", () => {
      sidebar?.classList.add("open");
      overlay?.classList.add("open");
    });

    closeButton?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);
  }

  function initializeHeaderActions() {
    query("#notificationsButton")?.addEventListener("click", () => {
      showToast("Não existem notificações pendentes nesta demonstração.");
    });

    query("#profileButton")?.addEventListener("click", (event) => {
      event.preventDefault();
      showToast(
        "Perfil do contabilista — gestão de utilizadores será activada nas Definições.",
      );
    });
  }

  function filterTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);

    if (!input || !table) {
      return;
    }

    const search = input.value.toLocaleLowerCase("pt");

    queryAll("tbody tr", table).forEach((row) => {
      const text = row.innerText.toLocaleLowerCase("pt");
      row.style.display = text.includes(search) ? "" : "none";
    });
  }

  function exportTable(tableId, filename, format = "csv") {
    const table = document.getElementById(tableId);

    if (!table) {
      return;
    }

    const rows = queryAll("tr", table).filter(
      (row) => row.style.display !== "none",
    );

    if (format === "pdf") {
      window.print();
      return;
    }

    const htmlRows = rows
      .map((row) => {
        const cells = queryAll(":scope > th, :scope > td", row)
          .map((cell) => `<td>${cell.innerText}</td>`)
          .join("");

        return `<tr>${cells}</tr>`;
      })
      .join("");

    const html = `
            <html>
                <head>
                    <meta charset="utf-8" />
                </head>
                <body>
                    <table>${htmlRows}</table>
                </body>
            </html>`;

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
    link.click();

    URL.revokeObjectURL(url);
    showToast("Ficheiro Excel preparado.");
  }

  function printReport(title) {
    const previousTitle = document.title;

    document.title = title;
    window.print();

    window.setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  }

  function initializeDemoForms() {
    queryAll(".js-demo-submit").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        showToast(
          "Registo guardado na demonstração. A persistência no servidor será ligada ao backend.",
        );

        const modal = form.closest(".modal-backdrop");

        if (modal) {
          closeModal(modal.id);
        }

        form.reset();
      });
    });
  }

  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.filterTable = filterTable;
  window.exportTable = exportTable;
  window.printReport = printReport;

  initializeModals();
  initializeSidebar();
  initializeHeaderActions();
  initializeDemoForms();
})();
