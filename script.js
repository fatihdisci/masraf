const expenses = [];

document.getElementById('expense-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const type = document.getElementById('expense-type').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const payer = document.getElementById('expense-payer').value;

  expenses.push({ type, amount, payer });
  document.getElementById('expense-form').reset();

  renderTable();
  updateSummary();
});

function renderTable() {
  const tbody = document.querySelector('#expenses-table tbody');
  tbody.innerHTML = '';

  expenses.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.type}</td><td>${item.amount.toFixed(2)}</td><td>${item.payer}</td>`;
    tbody.appendChild(tr);
  });
}

function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = total / 2;

  const fatihPaid = expenses.filter(e => e.payer === 'Fatih').reduce((sum, e) => sum + e.amount, 0);
  const hudaPaid = expenses.filter(e => e.payer === 'Hüda').reduce((sum, e) => sum + e.amount, 0);

  const fatihBalance = fatihPaid - perPerson;
  const hudaBalance = hudaPaid - perPerson;

  document.getElementById('total-expense').textContent = total.toFixed(2);
  document.getElementById('per-person').textContent = perPerson.toFixed(2);
  document.getElementById('balance-fatih').textContent = fatihBalance.toFixed(2);
  document.getElementById('balance-huda').textContent = hudaBalance.toFixed(2);

  let settlement = '-';
  if (fatihBalance < 0) {
    settlement = `Fatih, Hüda'ya ${(-fatihBalance).toFixed(2)} TL borçlu.`;
  } else if (hudaBalance < 0) {
    settlement = `Hüda, Fatih'e ${(-hudaBalance).toFixed(2)} TL borçlu.`;
  } else {
    settlement = 'Her şey dengede.';
  }
  document.getElementById('settlement').textContent = settlement;
}

updateSummary();
