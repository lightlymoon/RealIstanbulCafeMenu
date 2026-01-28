const firebaseConfig = {
  apiKey: "AIzaSyBf6m1mxZ2DexCy0jUc9Du00FzSpMZO4Jg",
  authDomain: "cafemenu-1ff06.firebaseapp.com",
  projectId: "cafemenu-1ff06"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let lang = "tr";
let category = "all";
let products = [];

const list = document.getElementById("list");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

const texts = {
  tr: {
    title: "Taze ve Günlük",
    categories: { all: "Tümü", drinks: "İçecek", cold: "Soğuk", hot: "Sıcak", food: "Yiyecek", dessert: "Tatlı" },
    price: "Fiyat"
  },
  en: {
    title: "Fresh and Daily",
    categories: { all: "All", drinks: "Drinks", cold: "Cold", hot: "Hot", food: "Food", dessert: "Dessert" },
    price: "Price"
  }
};

function setLang(l) { lang = l; updateTexts(); render(); }
function filter(c) { category = c; render(); }
db.collection("products").onSnapshot(snap => {
  products = [];
  snap.forEach(d => {
    const data = d.data();
    products.push({
      id: d.id,
      tr: data.tr,
      en: data.en,
      price: data.price,
      cat: data.cat,
      details: data.details || "" 
    });
  });
  render();
});


function render() {
  list.innerHTML = "";

  let filtered = products.filter(p => {
    if (category === "all") return true;
    if (category === "drinks") return p.cat === "hot" || p.cat === "cold";
    return p.cat === category;
  });

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h4>${lang === "tr" ? p.tr : p.en}</h4>
      ${p.details ? `<p>${p.details}</p>` : ""}
      <small>${texts[lang].price}: ${p.price} ₺</small>
    `;
    div.onclick = () => openModal(p);
    list.appendChild(div);
  });
}

function openModal(p) {
  modal.classList.add("active");
  modalContent.innerHTML = `
    <h3>${lang === "tr" ? p.tr : p.en}</h3>
    ${p.details ? `<p>Çeşitler: ${p.details}</p>` : ""}
    <p>${texts[lang].price}: ${p.price} ₺</p>
    <p>Kategori: ${texts[lang].categories[p.cat] || p.cat}</p>
  `;
}


modal.onclick = e => { if(e.target === modal) modal.classList.remove("active"); };

function updateTexts() {
  document.getElementById("title").innerText = texts[lang].title;
  document.getElementById("cat-all").innerText = texts[lang].categories.all;
  document.getElementById("cat-drinks").innerText = texts[lang].categories.drinks;
  document.getElementById("cat-food").innerText = texts[lang].categories.food;
  document.getElementById("cat-dessert").innerText = texts[lang].categories.dessert;
}

updateTexts();
render();