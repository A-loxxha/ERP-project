const dashboardBtn = document.getElementById("dashboardBtn");
const salesBtn = document.getElementById("salesBtn");
const financeBtn = document.getElementById("financeBtn");
const crmBtn = document.getElementById("crmBtn");
const inventoryBtn = document.getElementById("inventoryBtn");


const dashboard = document.getElementById("contentDashboard")
const sales = document.getElementById("contentSales");
const finance = document.getElementById("contentFinance");
const crm = document.getElementById("contentCRM");
const inventory = document.getElementById("contentInventory");


const content = document.querySelectorAll(".content-section");


function hideContent(){
    content.forEach((div)=>{
        div.style.display = "none"
    });
};

dashboardBtn.addEventListener("click", ()=>{
    hideContent();
    dashboard.style.display = "block"
});

salesBtn.addEventListener("click", ()=>{
    hideContent();
    sales.style.display = "block"
});

financeBtn.addEventListener("click", ()=>{
    hideContent();
    finance.style.display = "block"; 
});

crmBtn.addEventListener("click", ()=>{
    hideContent();
    crm.style.display = "block";
});

inventoryBtn.addEventListener("click", ()=>{
    hideContent();
    inventory.style.display = "block";
});

const dashAPI = "https://a-loxxha.github.io/ERP-project/db.json";

async function loadDashboard() {
  const products = await (await fetch(`${dashAPI}/topProducts`)).json();
  const daily = await (await fetch(`${dashAPI}/dailyRevenue`)).json();
  const health = await (await fetch(`${dashAPI}/businessHealth`)).json();


  const topBody = document.getElementById("topSalesBody");
  topBody.innerHTML = "";
  products.forEach((product) => {
    topBody.innerHTML += 
    ` <tr>
        <td>${product.product}</td>
        <td>${product.unitsSold}</td>
        <td>Ksh ${product.revenue}</td>
      </tr>
    `;
  });


  const dailyBody = document.getElementById("dailyRevenueBody");
  dailyBody.innerHTML = "";
  daily.forEach((day) => {
    dailyBody.innerHTML += `
      <tr>
        <td>${day.date}</td>
        <td>Ksh ${day.revenue}</td>
      </tr>
    `;
  });

  document.getElementById("grossMargin").textContent = `${health.grossMargin}%`;
  document.getElementById("cashBalance").textContent = `Ksh ${health.cashBalance}`;
  document.getElementById("receivables").textContent = `Ksh ${health.receivables}`;
  document.getElementById("payables").textContent = `Ksh ${health.payables}`;
  document.getElementById("inventoryValue").textContent = `Ksh ${health.inventoryValue}`;
}

loadDashboard();


const tableBody = document.querySelector("#salesTable tbody");


const API = "https://a-loxxha.github.io/ERP-project/db.json/orders";

async function loadOrders() {
  const response = await fetch(API);
  const orders = await response.json();

  const tableBody = document.querySelector("#salesTable tbody");
  tableBody.innerHTML = "";

  orders.forEach((order) => {
    tableBody.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.date}</td>
        <td>${order.total}</td>
        <td>${order.payment}</td>
        <td>${order.status}</td>
        <td><button onclick="deleteOrder(${order.id})">Delete</button></td>
      </tr>
    `
  });
  document.getElementById("totalOrders").textContent = orders.length;
  document.getElementById("pendingOrders").textContent =
  orders.filter((orders) => orders.status === "Pending").length;
  document.getElementById("completedOrders").textContent =
  orders.filter((orders) => orders.status === "Delivered").length;
}

async function deleteOrder(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadOrders();
}

loadOrders();

const invoiceAPI = "https://a-loxxha.github.io/ERP-project/db.json/invoices";
const expenseAPI = "https://a-loxxha.github.io/ERP-project/db.json/expense";

async function loadFinance() {
  const invoices = await (await fetch(invoiceAPI)).json();
  const expenses = await (await fetch(expenseAPI)).json();

  // Invoices table
  const invoiceBody = document.querySelector(".invoice-table tbody");
  invoiceBody.innerHTML = "";
  invoices.forEach((inv) => {
    invoiceBody.innerHTML += `
      <tr>
        <td>${inv.id}</td>
        <td>${inv.customer}</td>
        <td>${inv.issued}</td>
        <td>${inv.due}</td>
        <td>Ksh ${inv.amount}</td>
        <td>${inv.status}</td>
      </tr>
    `
  });

  // Expenses table
  const expenseBody = document.querySelector(".expense-table tbody");
  expenseBody.innerHTML = "";
  expenses.forEach((exp) => {
    expenseBody.innerHTML += `
      <tr>
        <td>${exp.id}</td>
        <td>${exp.description}</td>
        <td>${exp.paidTo}</td>
        <td>Ksh ${exp.amount}</td>
        <td>${exp.due}</td>
        <td>${exp.date}</td>
        <td>${exp.status}</td>
      </tr>
    `
  });

  
  const income = invoices.filter((invoice) => 
    invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  document.getElementById("totalIncome").textContent = `Ksh ${income}`;
  document.getElementById("totalExpenses").textContent = `Ksh ${spent}`;
  document.getElementById("netProfit").textContent = `Ksh ${income - spent}`;
};

loadFinance();


const customerAPI = "https://A-loxxha.github.io/ERP-project/db.json/customers";

async function loadCustomers() {
  const response = await fetch(customerAPI);
  const customers = await response.json();

  const tableBody = document.querySelector("#customerTable tbody");
  tableBody.innerHTML = "";

  customers.forEach((customer) => {
    tableBody.innerHTML += `
      <tr>
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td>${customer.email}</td>
        <td>Ksh ${customer.totalSpent}</td>
        <td>${customer.lastOrder}</td>
        <td><button onclick="deleteCustomer(${customer.id})">Delete</button></td>
      </tr>
    `;
  });

  document.getElementById("totalCustomers").textContent = customers.length;
}

async function deleteCustomer(id) {
  await fetch(`${customerAPI}/${id}`, 
    { method: "DELETE" });
  loadCustomers();
};
loadCustomers();


const taxAPI = "https://a-loxxha.github.io/ERP-project/db.json/taxFilings";
const VAT = 0.16;
const incomeTaxRate = 0.30;

let vatAmount = 0;
let incomeTaxAmount = 0;

async function calculateTaxes() {
  const invoices = await (await fetch(invoiceAPI)).json();
  const expenses = await (await fetch(expenseAPI)).json();

  let income = 0;
  for (const invoice of invoices) {
    if (invoice.status === "Paid") {
      income = income + invoice.amount;
    }
  }

  let spent = 0;
  for (const expense of expenses) {
    spent = spent + expense.amount;
  }

  const profit = income - spent;

  if (profit > 0) {
    vatAmount = Math.round(profit * VAT);
    incomeTaxAmount = Math.round(profit * incomeTaxRate);
  } else {
    vatAmount = 0;
    incomeTaxAmount = 0;
  }

  showTaxes(profit);
}

function showTaxes(profit) {
  const total = vatAmount + incomeTaxAmount;

  document.getElementById("taxBody").innerHTML = `

    <td>VAT</td><td>Ksh ${profit}</td><td>${VAT * 100}%</td><td>Ksh ${vatAmount}</td>
    <td>Income Tax</td><td>Ksh ${profit}</td><td>${incomeTaxRate * 100}%</td><td>Ksh ${incomeTaxAmount}</td>
    <td>Total</td><td></td><td></td><td>Ksh ${total}</td></tr>`;
}


async function loadFilings() {
  const filings = await (await fetch(taxAPI)).json();

  const filingsBody = document.getElementById("filingsBody");
  filingsBody.innerHTML = "";

  filings.forEach((filing) => {
    filingsBody.innerHTML += `
      <tr>
        <td>TX-${filing.id}</td>
        <td>${filing.period}</td>
        <td>${filing.dateFiled}</td>
        <td>Ksh ${filing.vat}</td>
        <td>Ksh ${filing.incomeTax}</td>
        <td>Ksh ${filing.total}</td>
        <td>${filing.status}</td>
      </tr>
    `;
  });
}


async function fileTax() {
  const period = document.getElementById("taxPeriod").value;

  if (period === "") {
    alert("Pick a tax period first");
    return;
  }

  const newFiling = {
    period: period,
    dateFiled: new Date(),
    vat: vatAmount,
    incomeTax: incomeTaxAmount,
    total: vatAmount + incomeTaxAmount,
    status: "Filed"
  };

  await fetch(taxAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newFiling)
  });

  loadFilings();
}

document.getElementById("fileTaxBtn").addEventListener("click", fileTax);

calculateTaxes();
loadFilings();


const todayDate = () => new Date().toISOString().slice(0, 10);

const modalForms = {
  order: {
    title: "New Order",
    api: API,
    fields: [
      { name: "customer", label: "Customer", type: "text" },
      { name: "date", label: "Date", type: "date", default: todayDate },
      { name: "total", label: "Total (Ksh)", type: "number" },
      { name: "payment", label: "Payment", type: "select", options: ["M-Pesa", "Cash"] },
      { name: "status", label: "Status", type: "select", options: ["Pending", "Paid", "Delivered", "Cancelled"] }
    ],
    refresh: () => { loadOrders(); loadDashboard();}
  },
  invoice: {
    title: "New Invoice",
    api: invoiceAPI,
    fields: [
      { name: "customer", label: "Customer", type: "text" },
      { name: "issued", label: "Date Issued", type: "date", default: todayDate },
      { name: "due", label: "Due Date", type: "date" },
      { name: "amount", label: "Amount (Ksh)", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Unpaid", "Paid", "Overdue"] }
    ],
    refresh: () => { loadFinance(); calculateTaxes(); }
  },
  expense: {
    title: "Add Expense",
    api: expenseAPI,
    fields: [
      { name: "description", label: "Description", type: "text" },
      { name: "paidTo", label: "Paid To", type: "text" },
      { name: "amount", label: "Amount (Ksh)", type: "number" },
      { name: "due", label: "Due Date", type: "date" },
      { name: "date", label: "Date", type: "date", default: todayDate },
      { name: "status", label: "Status", type: "select", options: ["Pending", "Paid"] }
    ],
    refresh: () => { loadFinance(); calculateTaxes(); }
  },
  customer: {
    title: "Add Customer",
    api: customerAPI,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "totalSpent", label: "Total Spent (Ksh)", type: "number", default: () => 0 },
      { name: "lastOrder", label: "Last Order", type: "date", default: todayDate }
    ],
    refresh: () => { loadCustomers(); }
  }
};

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalForm = document.getElementById("modalForm");
const modalFields = document.getElementById("modalFields");

let currentForm = null;

function openModal(mod){
  currentForm = modalForms[mod] 
  modalTitle.textContent = currentForm.title;
  modalFields.innerHTML = "";
  
  currentForm.fields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;

    let input;
    if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("input");
      input.type = field.type;
      if (field.type === "number") {
        input.min = 0;
        input.step = "any";
      }
    }

    input.name = field.name;
    input.required = true;
    if (field.default) input.value = field.default();

    label.appendChild(input);
    modalFields.appendChild(label);
  });

  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

modalForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {}

  
  currentForm.fields.forEach((field) => {
    const value = modalForm.elements[field.name].value;
    data[field.name] = field.type === "number" ? Number(value) : value;
  });

  try {
    await fetch(currentForm.api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    closeModal();
    currentForm.refresh();
  } catch (err) {
    alert("Could not save. Is json-server running?");
  }
});

document.getElementById("modalCancel").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

document.getElementById("newOrderBtn").addEventListener("click", ()=>{
   openModal("order")});

document.getElementById("newInvoiceBtn").addEventListener("click", ()=>{
  openModal("invoice")});

document.getElementById("newExpenseBtn").addEventListener("click", ()=>{
  openModal("expense")});

document.getElementById("newCustomerBtn").addEventListener("click", ()=>{
  openModal("customer")});