const expenses = [];
const form = document.getElementById('expense-form');
const monthFilter = document.getElementById('month-filter');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const type = document.getElementById('expense-type').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const date = document.getElementById('expense-date').value;
  const payer = document.getElementById('expense-payer').value;

  expenses.push({ type, amount, date, payer });
  form.reset();
  renderMonths();
  renderExpenses();
  updateSummary();
});

monthFilter.addEventListener('change', () => {
  renderExpenses();
  updateSummary();
});

function renderMonths() {
  const months = [...new Set(expenses.map(e => e.date.slice(0, 7)))];
  monthFilter.innerHTML = '';
  months.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month;
    monthFilter.appendChild(option);
  });
}

function renderExpenses() {
  const tbody = document.querySelector('#expenses-table tbody');
  tbody.innerHTML = '';
  const selectedMonth = monthFilter.value;
  const filtered = expenses.filter(e => e.date.slice(0, 7) === selectedMonth);
  filtered.forEach(exp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${exp.type}</td><td>${exp.amount.toFixed(2)}</td><td>${exp.date}</td><td>${exp.payer}</td>`;
    tbody.appendChild(tr);
  });
}

function updateSummary() {
  const selectedMonth = monthFilter.value;
  const filtered = expenses.filter(e => e.date.slice(0, 7) === selectedMonth);
  const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
  const perPerson = total / 2;
  const fatihPaid = filtered.filter(e => e.payer === 'Fatih').reduce((sum, e) => sum + e.amount, 0);
  const hudaPaid = filtered.filter(e => e.payer === 'Hüda').reduce((sum, e) => sum + e.amount, 0);
  const balanceFatih = fatihPaid - perPerson;
  const balanceHuda = hudaPaid - perPerson;
  document.getElementById('total-expense').textContent = total.toFixed(2);
  document.getElementById('per-person').textContent = perPerson.toFixed(2);
  document.getElementById('balance-fatih').textContent = balanceFatih.toFixed(2);
  document.getElementById('balance-huda').textContent = balanceHuda.toFixed(2);
  let settlementText = '-';
  if (balanceFatih < 0) settlementText = `Fatih, Hüda'ya ${(-balanceFatih).toFixed(2)} TL borçlu.`;
  else if (balanceHuda < 0) settlementText = `Hüda, Fatih'e ${(-balanceHuda).toFixed(2)} TL borçlu.`;
  else settlementText = 'Her şey dengede.';
  document.getElementById('settlement').textContent = settlementText;
}
