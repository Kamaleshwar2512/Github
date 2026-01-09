function $(id) { return document.getElementById(id) }

function formatMoney(v) {
    return Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
    const P = parseFloat($('principal').value) || 0;
    const annual = parseFloat($('annualRate').value) || 0;
    const tenureVal = parseInt($('tenureValue').value) || 0;
    const unit = $('tenureUnit').value;

    let n = unit === 'years' ? tenureVal * 12 : tenureVal;
    if (n <= 0 || P <= 0) return alert('Please enter positive loan amount and tenure');

    const r = annual / 12 / 100; // monthly rate
    let emi;
    if (r === 0) {
        emi = P / n;
    } else {
        const pow = Math.pow(1 + r, n);
        emi = P * r * pow / (pow - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    $('emi').textContent = formatMoney(emi);
    $('totalPayment').textContent = formatMoney(totalPayment);
    $('totalInterest').textContent = formatMoney(totalInterest);

    renderTable(P, r, n, emi);
}

function renderTable(P, r, n, emi) {
    const tbody = $('amortizationTable').querySelector('tbody');
    tbody.innerHTML = '';
    let balance = P;
    for (let m = 1; m <= n; m++) {
        let interest = balance * r;
        let principal = emi - interest;
        // guard for last payment rounding issues
        if (m === n) {
            principal = balance;
            emi = interest + principal;
        }
        balance = Math.max(0, balance - principal);

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td style="text-align:left">${m}</td>
      <td>${formatMoney(emi)}</td>
      <td>${formatMoney(interest)}</td>
      <td>${formatMoney(principal)}</td>
      <td>${formatMoney(balance)}</td>
    `;
        tbody.appendChild(tr);
    }
}

function clearForm() {
    $('principal').value = '';
    $('annualRate').value = '';
    $('tenureValue').value = '';
    $('tenureUnit').value = 'years';
    $('emi').textContent = '—';
    $('totalPayment').textContent = '—';
    $('totalInterest').textContent = '—';
    const tbody = $('amortizationTable').querySelector('tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="muted">No results yet — enter values and click Calculate.</td></tr>';
}

document.addEventListener('DOMContentLoaded', () => {
    $('calculateBtn').addEventListener('click', calculate);
    $('clearBtn').addEventListener('click', clearForm);
});
