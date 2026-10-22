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

