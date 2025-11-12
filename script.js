const headerChange = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        headerChange.classList.add('header-scrolled');
    }
    else if (window.scrollY <= 50) {
        headerChange.classList.remove('header-scrolled');
    }
});