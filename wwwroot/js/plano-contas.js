(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const storageKey = "dylandeContabil.planoContas.v1";
  const seedAccounts = [
    {
      id: "a1",
      code: "1",
      name: "Meios fixos e investimentos",
      type: "synthetic",
      parentId: "",
      status: "active",
      notes: "",
    },
    {
      id: "a2",
      code: "1.1",
      name: "Imobilizações corpóreas",
      type: "synthetic",
      parentId: "a1",
      status: "active",
      notes: "",
    },
    {
      id: "a3",
      code: "1.1.01",
      name: "Terrenos e recursos naturais",
      type: "analytic",
      parentId: "a2",
      status: "active",
      notes: "",
    },
    {
      id: "a4",
      code: "1.1.02",
      name: "Edifícios e outras construções",
      type: "analytic",
      parentId: "a2",
      status: "active",
      notes: "",
    },
    {
      id: "a5",
      code: "2",
      name: "Existências",
      type: "synthetic",
      parentId: "",
      status: "active",
      notes: "",
    },
    {
      id: "a6",
      code: "2.1",
      name: "Mercadorias",
      type: "synthetic",
      parentId: "a5",
      status: "active",
      notes: "",
    },
    {
      id: "a7",
      code: "2.1.01",
      name: "Mercadorias em armazém",
      type: "analytic",
      parentId: "a6",
      status: "active",
      notes: "",
    },
    {
      id: "a8",
      code: "3",
      name: "Terceiros",
      type: "synthetic",
      parentId: "",
      status: "active",
      notes: "",
    },
    {
      id: "a9",
      code: "3.1",
      name: "Clientes",
      type: "synthetic",
      parentId: "a8",
      status: "active",
      notes: "",
    },
    {
      id: "a10",
      code: "3.1.01",
      name: "Clientes nacionais",
      type: "analytic",
      parentId: "a9",
      status: "active",
      notes: "",
    },
    {
      id: "a11",
      code: "4",
      name: "Meios monetários",
      type: "synthetic",
      parentId: "",
      status: "active",
      notes: "",
    },
    {
      id: "a12",
      code: "4.1.01",
      name: "Caixa",
      type: "analytic",
      parentId: "a11",
      status: "active",
      notes: "",
    },
    {
      id: "a13",
      code: "4.1.02",
      name: "Depósitos à ordem",
      type: "analytic",
      parentId: "a11",
      status: "inactive",
      notes: "Conta desactivada na demonstração.",
    },
    {
      id: "a14",
      code: "6",
      name: "Custos e perdas",
      type: "synthetic",
      parentId: "",
      status: "active",
      notes: "",
    },
    {
      id: "a15",
      code: "6.1.01",
      name: "Fornecimentos e serviços externos",
      type: "analytic",
      parentId: "a14",
      status: "active",
      notes: "",
    },
  ];

  let accounts = loadAccounts();
  const modal = $("#accountModal");
  const form = $("#accountForm");
  const body = $("#accountsTableBody");

  function loadAccounts() {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : structuredClone(seedAccounts);
    } catch {
      return seedAccounts.map((account) => ({ ...account }));
    }
  }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(accounts));
      return true;
    } catch {
      showToast("Não foi possível guardar os dados neste navegador.");
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  }

  function getAccount(id) {
    return accounts.find((account) => account.id === id);
  }

  function getDepth(account) {
    let depth = 0;
    let parent = getAccount(account.parentId);
    const seen = new Set([account.id]);
    while (parent && !seen.has(parent.id)) {
      seen.add(parent.id);
      depth += 1;
      parent = getAccount(parent.parentId);
    }
    return Math.min(depth, 4);
  }

  function getParentName(account) {
    return account.parentId
      ? (getAccount(account.parentId)?.name ?? "Conta não encontrada")
      : "— Conta raiz";
  }

  function filteredAccounts() {
    const query = ($("#accountSearch").value || "")
      .trim()
      .toLocaleLowerCase("pt");
    const type = $("#typeFilter").value;
    const status = $("#statusFilter").value;
    return accounts
      .filter((account) => {
        const matchesQuery =
          !query ||
          `${account.code} ${account.name}`
            .toLocaleLowerCase("pt")
            .includes(query);
        const matchesType = type === "all" || account.type === type;
        const matchesStatus = status === "all" || account.status === status;
        return matchesQuery && matchesType && matchesStatus;
      })
      .sort((a, b) => a.code.localeCompare(b.code, "pt", { numeric: true }));
  }

  function render() {
    const visible = filteredAccounts();
    body.innerHTML = visible
      .map((account) => {
        const depth = getDepth(account);
        const parentName = getParentName(account);
        const isSynthetic = account.type === "synthetic";
        const typeLabel = isSynthetic ? "Sintética" : "Analítica";
        const statusLabel = account.status === "active" ? "Activa" : "Inactiva";
        const hasChildren = accounts.some(
          (item) => item.parentId === account.id,
        );
        return `
                <tr data-id="${escapeHtml(account.id)}">
                    <td><span class="account-code">${escapeHtml(account.code)}</span></td>
                    <td>
                        <div class="account-name-cell" style="padding-left:${depth * 18}px">
                            <span class="account-tree-mark ${isSynthetic ? "synthetic" : ""}">${isSynthetic ? "⌘" : "↳"}</span>
                            <span><span class="account-name-text">${escapeHtml(account.name)}</span>
                            <small class="account-name-sub">${isSynthetic ? (hasChildren ? "Agrupa contas subordinadas" : "Conta de agrupamento") : "Conta de movimento"}</small></span>
                        </div>
                    </td>
                    <td><span class="class-badge ${account.type}">${typeLabel}</span></td>
                    <td>${escapeHtml(parentName)}</td>
                    <td><span class="state-badge ${account.status}"><i class="state-dot"></i>${statusLabel}</span></td>
                    <td><div class="row-actions">
                        <button type="button" class="row-action" data-action="edit" data-id="${escapeHtml(account.id)}" title="Editar conta" aria-label="Editar ${escapeHtml(account.name)}">✎</button>
                        <button type="button" class="row-action" data-action="toggle" data-id="${escapeHtml(account.id)}" title="${account.status === "active" ? "Desactivar" : "Activar"} conta" aria-label="${account.status === "active" ? "Desactivar" : "Activar"} ${escapeHtml(account.name)}">${account.status === "active" ? "◌" : "✓"}</button>
                        <button type="button" class="row-action danger" data-action="delete" data-id="${escapeHtml(account.id)}" title="Eliminar conta" aria-label="Eliminar ${escapeHtml(account.name)}">×</button>
                    </div></td>
                </tr>`;
      })
      .join("");

    $("#emptyAccounts").hidden = visible.length > 0;
    $("#visibleCount").textContent =
      `${visible.length} ${visible.length === 1 ? "conta" : "contas"}`;
    $("#tableSummary").textContent =
      `A apresentar ${visible.length} de ${accounts.length} contas`;
    $("#totalAccounts").textContent = accounts.length;
    $("#syntheticAccounts").textContent = accounts.filter(
      (a) => a.type === "synthetic",
    ).length;
    $("#analyticAccounts").textContent = accounts.filter(
      (a) => a.type === "analytic",
    ).length;
    $("#activeAccounts").textContent = accounts.filter(
      (a) => a.status === "active",
    ).length;
  }

  function populateParents(selectedId = "", currentId = "") {
    const select = $("#accountGroup");
    const possibleParents = accounts
      .filter(
        (account) => account.type === "synthetic" && account.id !== currentId,
      )
      .sort((a, b) => a.code.localeCompare(b.code, "pt", { numeric: true }));
    select.innerHTML =
      '<option value="">Sem conta superior (raiz)</option>' +
      possibleParents
        .map(
          (account) =>
            `<option value="${escapeHtml(account.id)}">${escapeHtml(account.code)} — ${escapeHtml(account.name)}</option>`,
        )
        .join("");
    select.value = selectedId;
  }

  function openModal(account = null) {
    form.reset();
    $("#accountFormError").textContent = "";
    $("#accountId").value = account?.id ?? "";
    $("#accountModalTitle").textContent = account
      ? "Editar conta"
      : "Nova conta";
    $("#saveAccount").innerHTML = account
      ? "Guardar alterações <span>→</span>"
      : "Guardar conta <span>→</span>";
    populateParents(account?.parentId ?? "", account?.id ?? "");
    if (account) {
      $("#accountCode").value = account.code;
      $("#accountName").value = account.name;
      $("#accountClass").value = account.type;
      $("#accountStatus").value = account.status;
      $("#accountNotes").value = account.notes ?? "";
    } else {
      $("#accountClass").value = "analytic";
      $("#accountStatus").value = "active";
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(() => $("#accountCode").focus(), 80);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal-backdrop.is-open"))
      document.body.classList.remove("modal-open");
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__dylandeToast);
    window.__dylandeToast = setTimeout(
      () => toast.classList.remove("show"),
      3200,
    );
  }

  function saveAccount(event) {
    event.preventDefault();
    const id = $("#accountId").value;
    const code = $("#accountCode").value.trim();
    const name = $("#accountName").value.trim();
    const type = $("#accountClass").value;
    const parentId = $("#accountGroup").value;
    const status = $("#accountStatus").value;
    const notes = $("#accountNotes").value.trim();
    const error = $("#accountFormError");

    if (!code || !name) {
      error.textContent = "Preencha o código e a designação da conta.";
      return;
    }
    if (
      accounts.some(
        (account) =>
          account.code.toLocaleLowerCase("pt") ===
            code.toLocaleLowerCase("pt") && account.id !== id,
      )
    ) {
      error.textContent =
        "Já existe uma conta com este código. Escolha outro código.";
      $("#accountCode").focus();
      return;
    }
    if (type === "analytic" && !parentId) {
      error.textContent =
        "Seleccione uma conta sintética superior para esta conta analítica.";
      $("#accountGroup").focus();
      return;
    }
    if (parentId && !getAccount(parentId)) {
      error.textContent =
        "A conta superior seleccionada já não existe. Actualize a selecção.";
      return;
    }
    if (parentId === id) {
      error.textContent =
        "Uma conta não pode ser a sua própria conta superior.";
      return;
    }

    const parent = parentId ? getAccount(parentId) : null;
    if (parent && parent.status === "inactive") {
      error.textContent =
        "Não pode associar uma conta activa a uma conta superior inactiva.";
      return;
    }

    const record = {
      id: id || `acc-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      code,
      name,
      type,
      parentId,
      status,
      notes,
    };
    if (id)
      accounts = accounts.map((account) =>
        account.id === id ? record : account,
      );
    else accounts.push(record);

    if (persist()) {
      closeModal();
      render();
      showToast(
        id ? "Conta actualizada com sucesso." : "Conta adicionada ao plano.",
      );
    }
  }

  function handleTableAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const account = getAccount(button.dataset.id);
    if (!account) return;

    if (button.dataset.action === "edit") {
      openModal(account);
      return;
    }
    if (button.dataset.action === "toggle") {
      const hasActiveChildren = accounts.some(
        (item) => item.parentId === account.id && item.status === "active",
      );
      if (account.status === "active" && hasActiveChildren) {
        showToast("Desactive primeiro as contas subordinadas activas.");
        return;
      }
      account.status = account.status === "active" ? "inactive" : "active";
      persist();
      render();
      showToast(
        `Conta ${account.status === "active" ? "activada" : "desactivada"}.`,
      );
      return;
    }
    if (button.dataset.action === "delete") {
      const children = accounts.filter((item) => item.parentId === account.id);
      if (children.length) {
        showToast(
          "Esta conta possui contas subordinadas. Remova ou reassocie-as primeiro.",
        );
        return;
      }
      if (
        !window.confirm(
          `Tem a certeza de que pretende eliminar a conta ${account.code} — ${account.name}?`,
        )
      )
        return;
      accounts = accounts.filter((item) => item.id !== account.id);
      persist();
      render();
      showToast("Conta eliminada do plano demonstrativo.");
    }
  }

  function exportCsv() {
    const rows = filteredAccounts();
    const header = [
      "Código",
      "Designação",
      "Classificação",
      "Conta superior",
      "Estado",
      "Observações",
    ];
    const data = rows.map((account) => [
      account.code,
      account.name,
      account.type === "synthetic" ? "Sintética" : "Analítica",
      getParentName(account),
      account.status === "active" ? "Activa" : "Inactiva",
      account.notes ?? "",
    ]);
    const csv = [header, ...data]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(";"),
      )
      .join("\r\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dylande-plano-de-contas.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Exportação CSV preparada.");
  }

  $("#addAccount").addEventListener("click", () => openModal());
  $("#exportAccounts").addEventListener("click", exportCsv);
  $("#accountSearch").addEventListener("input", render);
  $("#typeFilter").addEventListener("change", render);
  $("#statusFilter").addEventListener("change", render);
  $("#clearFilters").addEventListener("click", () => {
    $("#accountSearch").value = "";
    $("#typeFilter").value = "all";
    $("#statusFilter").value = "all";
    render();
  });
  $("#dismissNotice").addEventListener("click", () =>
    $(".accounts-notice").remove(),
  );
  body.addEventListener("click", handleTableAction);
  form.addEventListener("submit", saveAccount);
  document
    .querySelectorAll("[data-account-close]")
    .forEach((button) => button.addEventListener("click", closeModal));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open"))
      closeModal();
  });

  $("#dashboardSettings")?.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("As definições completas serão activadas numa fase posterior.");
  });

  render();
})();
