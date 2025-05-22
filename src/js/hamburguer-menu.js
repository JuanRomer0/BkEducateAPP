const hamburgerBtn = document.getElementById('hamburgerBtn');
const menu = document.getElementById('mainMenu');

hamburgerBtn.addEventListener('click', () => {
menu.classList.toggle('show');

document.getElementById('hamburgerBtn').addEventListener('click', function () {
  document.getElementById('mainMenu').classList.toggle('show');
  });
  });