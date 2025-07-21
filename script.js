let expenses = [];

function loadExpenses() {
  const stored = localStorage.getItem('expenses');
  expenses = stored ? JSON.parse(stored) : [];
}

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

const form = document.getElementById('expense-form');
const monthFilter = document.getElementById('month-filter');
const resetButton = document.getElementById('reset-button');
const downloadPdfBtn = document.getElementById('download-pdf');

form.addEventListener('submit', e => {
  e.preventDefault();
  const type = document.getElementById('expense-type').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const date = document.getElementById('expense-date').value;
  const payer = document.getElementById('expense-payer').value;
  if (!type || !amount || !date || !payer) return;
  expenses.push({ type, amount, date, payer });
  saveExpenses();
  form.reset(); updateMonthOptions(); render();
});

resetButton.addEventListener('click', () => {
  if (confirm('Tüm masrafları silmek istediğinize emin misiniz?')) {
    expenses = [];
    saveExpenses();
    updateMonthOptions(); render();
  }
});

monthFilter.addEventListener('change', render);

downloadPdfBtn.addEventListener('click', () => {
  const element = document.getElementById('pdf-area');
  html2pdf().from(element).save('ofis_masraf_ozeti.pdf');
});

function updateMonthOptions() {
  const months = [...new Set(expenses.map(e => e.date.slice(0, 7)))].sort().reverse();
  monthFilter.innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
  if (months.length) monthFilter.value = months[0];
}

function render() {
  const selected = monthFilter.value;
  const tbody = document.querySelector('#expenses-table tbody');
  tbody.innerHTML = '';
  let total = 0, fatihSum = 0, hudaSum = 0;
  expenses
    .filter(e => e.date.startsWith(selected))
    .forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${e.type}</td><td>${e.amount.toFixed(2)}</td><td>${e.date}</td><td>${e.payer}</td>`;
      tbody.appendChild(tr);
      total += e.amount;
      if (e.payer === 'Fatih') fatihSum += e.amount;
      else hudaSum += e.amount;
    });

  const perPerson = total / 2;
  const fatihBal = fatihSum - perPerson;
  const hudaBal = hudaSum - perPerson;
  document.getElementById('total-expense').textContent = total.toFixed(2);
  document.getElementById('per-person').textContent = perPerson.toFixed(2);
  document.getElementById('balance-fatih').textContent = fatihBal.toFixed(2);
  document.getElementById('balance-huda').textContent = hudaBal.toFixed(2);
  document.getElementById('settlement').textContent =
    fatihBal < 0 ? `Fatih, Hüda'ya ${Math.abs(fatihBal).toFixed(2)} TL borçlu.` :
    hudaBal < 0 ? `Hüda, Fatih'e ${Math.abs(hudaBal).toFixed(2)} TL borçlu.` : 'Her şey dengede.';

  const overallTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const overallFatih = expenses.filter(e => e.payer === 'Fatih').reduce((s, e) => s + e.amount, 0);
  const overallHuda = expenses.filter(e => e.payer === 'Hüda').reduce((s, e) => s + e.amount, 0);
  document.getElementById('overall-total').textContent = overallTotal.toFixed(2);
  document.getElementById('overall-fatih').textContent = overallFatih.toFixed(2);
  document.getElementById('overall-huda').textContent = overallHuda.toFixed(2);
}

loadExpenses();
updateMonthOptions();
render();
