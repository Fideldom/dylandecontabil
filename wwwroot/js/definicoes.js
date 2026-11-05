/* Definições · DYLANDE Contabil */

document.querySelectorAll(".settings-tab").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".settings-tab").forEach((item) => {
            item.classList.remove("active");
        });

        document.querySelectorAll(".settings-pane").forEach((pane) => {
            pane.classList.remove("active");
        });

        button.classList.add("active");

        const target = document.getElementById(`tab-${button.dataset.tab}`);
        target?.classList.add("active");
    });
});
