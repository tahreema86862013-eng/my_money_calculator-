(() => {
  let selectedAmount = null;
  let selectedWeeks = null;
  let selectedPeriod = null;

  const amountButtons = [...document.querySelectorAll("[data-amount]")];
  const periodButtons = [...document.querySelectorAll("[data-weeks]")];
  const total = document.getElementById("total");
  const breakdown = document.getElementById("breakdown");

  const formatPKR = value => new Intl.NumberFormat("en-PK", {
    style: "currency", currency: "PKR", maximumFractionDigits: 0
  }).format(value);

  function updateResult() {
    if (selectedAmount === null || selectedWeeks === null) {
      total.textContent = formatPKR(0);
      breakdown.textContent = "Choose an amount and a time period to calculate.";
      return;
    }
    const savings = selectedAmount * selectedWeeks;
    total.textContent = formatPKR(savings);
    breakdown.textContent =
      `Saving ${formatPKR(selectedAmount)} each week for ${selectedPeriod} (${selectedWeeks} weekly deposits).`;
  }

  amountButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedAmount = Number(button.dataset.amount);
      amountButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateResult();
    });
  });

  periodButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedWeeks = Number(button.dataset.weeks);
      selectedPeriod = button.dataset.period;
      periodButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateResult();
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    selectedAmount = selectedWeeks = selectedPeriod = null;
    [...amountButtons, ...periodButtons].forEach(button => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });
    updateResult();
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(error => {
        console.warn("Offline support could not be enabled:", error);
      });
    });
  }
})();
