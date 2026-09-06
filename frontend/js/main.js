document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((button) => button.classList.remove('active'));
      item.classList.add('active');
    });
  });
});
