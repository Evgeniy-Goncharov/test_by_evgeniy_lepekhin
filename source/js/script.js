// Функционал кнопки открытия навигации

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

nav.addEventListener('click', function(evt) {
  evt.stopPropagation();
});

navToggle.addEventListener('click', function (evt) {
  evt.stopPropagation();
  nav.classList.toggle('nav--opened')
});

// Переключение активных пунктов меню

const navItems = nav.querySelectorAll('.nav__item');

function getActiveElement(array) {
  let activeElement

  array.forEach(element => {
    if (element.classList.contains('nav__item--active')) {
      activeElement = element;
    }
  });

  return activeElement;
};

for (let navItem of navItems) {
  navItem.addEventListener('click', function(evt) {
    evt.stopPropagation();
    getActiveElement(navItems).classList.remove('nav__item--active');
    navItem.classList.add('nav__item--active');
  });
};

const navItemProjects = nav.querySelector('.nav__item--projects');

navItemProjects.addEventListener('click', function(evt) {
  evt.stopPropagation();
  if (!nav.classList.contains('nav--opened')) {
    nav.classList.add('nav--opened');
  }
});

const navSearch = nav.querySelector('.nav__search');

navSearch.addEventListener('focus', function(evt) {
  evt.stopPropagation();
  if (!nav.classList.contains('.nav--opened')) {
    nav.classList.add('nav--opened')
  }
});

const body =  document.querySelector('body');

body.addEventListener('click', function() {
    nav.classList.remove('nav--opened');
});
