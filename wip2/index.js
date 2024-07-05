const indicator = document.getElementById('navbar-indicator');
const navbarItems = document.getElementsByClassName('navbar-item');
const pages = document.getElementsByClassName('page');

var currentSelected = 0;

indicator.style.top = `${navbarItems[0].offsetTop}px`;

updatePages();

for (let i = 0; i < pages.length; i++) {
  pages[i].style.transition = 'top 0.2s';
}

function updatePages() {
  for (let i = 0; i < pages.length; i++) {
    pages[i].style.top = `calc(${i - currentSelected} * 100%)`;
  }
}

document.querySelectorAll('.navbar-item').forEach(item => {
  item.addEventListener('click', () => {
    currentSelected = Array.from(navbarItems).indexOf(item);
    updatePages();
    indicator.style.top = `${item.offsetTop}px`;
  });
});

var cooldown = 0;

document.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) < 5) return;
  if (cooldown > 0) {
    cooldown--;
    return;
  }
  currentSelected += Math.sign(e.deltaY);
  indicator.style.top = `${navbarItems[currentSelected].offsetTop}px`;
  cooldown = 10;
  updatePages();
});