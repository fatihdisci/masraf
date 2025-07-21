let expenses = [];

document.getElementById('expense-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const type = document.getElementById('expense-type').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const date = document.getElementById('expense-date').value;
  const payer = document.getElementById('expense-payer').value;

  if (!type || !amount || !date || !payer) return;

  expenses.push({ type, amount, date, payer });
  this.reset();
  updateMonthOptions();
  render();
});

document.getElementById('month-filter').addEventListener('change', render);

document.getElementById('reset-button').addEventListener('click', () => {
  if (confirm("Tüm masrafları silmek istediğinize emin misiniz?")) {
    expenses = [];
    updateMonthOptions();
    render();
  }
});

document.getElementById('download-pdf').addEventListener('click', () => {
  const element = document.getElementById('pdf-area');
  html2pdf().from(element).save('ofis_masraf_ozeti.pdf');
});

function updateMonthOptions() {
  const select = document.getElementById('month-filter');
  const uniqueMonths = [...new Set(expenses.map(e => e.date.slice(0, 7)))].sort().reverse();

  select.innerHTML = uniqueMonths.map(month => {
    const [y, m] = month.split("-");
    return `<option value="${month}">${y} - ${m}</option>`;
  }).join("");

  if (!select.value && uniqueMonths.length > 0) {
    select.value = uniqueMonths[0];
  }
}

function render() {
  const month = document.getElementById('month-filter').value;
  const tbody = document.querySelector('#expenses-table tbody');
  tbody.innerHTML = '';

  const filtered = expenses.filter(e => e.date.startsWith(month));
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = total / 2;

  let fatihTotal = 0;
  let hudaTotal = 0;

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.type}</td>
      <td>${item.amount.toFixed(2)}</td>
      <td>${item.date}</td>
      <td>${item.payer}</td>
    `;
    tbody.appendChild(tr);

    if (item.payer === 'Fatih') fatihTotal += item.amount;
    else hudaTotal += item.amount;
  });

  const fatihBalance = fatihTotal - perPerson;
  const hudaBalance = hudaTotal - perPerson;

  document.getElementById('total-expense').textContent = total.toFixed(2);
  document.getElementById('per-person').textContent = perPerson.toFixed(2);
  document.getElementById('balance-fatih').textContent = fatihBalance.toFixed(2);
  document.getElementById('balance-huda').textContent = hudaBalance.toFixed(2);

  const settlementText =
    fatihBalance < 0
      ? `Fatih, Hüda'ya ${Math.abs(fatihBalance).toFixed(2)} TL borçlu.`
      : hudaBalance < 0
      ? `Hüda, Fatih'e ${Math.abs(hudaBalance).toFixed(2)} TL borçlu.`
      : 'Her şey dengede.';

  document.getElementById('settlement').textContent = settlementText;

  // Genel toplamlar (aydan bağımsız)
  const overallTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const overallFatih = expenses.filter(e => e.payer === 'Fatih').reduce((s, e) => s + e.amount, 0);
  const overallHuda = expenses.filter(e => e.payer === 'Hüda').reduce((s, e) => s + e.amount, 0);

  document.getElementById('overall-total').textContent = overallTotal.toFixed(2);
  document.getElementById('overall-fatih').textContent = overallFatih.toFixed(2);
  document.getElementById('overall-huda').textContent = overallHuda.toFixed(2);
}

// Sayfa yüklendiğinde filtre listesi güncellensin
updateMonthOptions();
render();
