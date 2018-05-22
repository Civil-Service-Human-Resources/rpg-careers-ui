function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
}

let navInitialised = false;
let navOpen = false;

const navEl = document.getElementById('nav');
const navClosedHtml = '<span class="sr-only">Open </span>menu';
const navOpenHtml = 'Close <span class="sr-only"> Menu</span>';
const mobileOverlayEl = document.querySelector('.mobile-overlay');
const mastheadNavEl = document.querySelector('.masthead__nav');


const navToggle = document.createElement('button');
navToggle.setAttribute('aria-expanded', 'false');
navToggle.setAttribute('aria-controls', 'nav');
navToggle.setAttribute('class', 'masthead__toggle');
navToggle.innerHTML = navClosedHtml;

checkIfNavToggle();

// EVENT LISTENERS

// listen for user resizing browser window
window.addEventListener('resize', debounce(checkIfNavToggle));

// someone clicks on the mobile nav toggle
navToggle.addEventListener('click', (e) => {
    e.preventDefault();

    navOpen = !navOpen;
    navToggle.setAttribute('aria-expanded', navOpen.toString());
    navToggle.innerHTML = navOpen ? navOpenHtml : navClosedHtml;
    navToggle.setAttribute('aria-hidden', !navOpen.toString());
    document.body.classList.toggle('mobile-nav-open');
});

// someone clicks on mobile overlay to close mobile nav
mobileOverlayEl.addEventListener('click', (e) => {
    e.preventDefault();

    navOpen = false;
    navEl.setAttribute('aria-hidden', true.toString());
    document.body.classList.remove('mobile-nav-open');
    navToggle.setAttribute('aria-expanded', false.toString());
    navToggle.innerHTML = navClosedHtml;
});

// FUNCTIONS

// add mobile related nav stuff
function initializeMobileNav() {
    navOpen = false;
    navInitialised = true;

    mastheadNavEl.insertBefore(navToggle, mastheadNavEl.firstChild);
    navEl.setAttribute('aria-hidden', !navOpen.toString());
}

// remove mobile related nav stuff
function uninitializeMobileNav() {
    navOpen = false;
    navInitialised = false;

    mastheadNavEl.removeChild(navToggle);
    navEl.removeAttribute('aria-hidden');
}

// checks whether nav toggle should be shown based on browser width
function checkIfNavToggle() {

    const mediaQuery = window.matchMedia('(min-width: 990px)').matches;

    if(!mediaQuery && !navInitialised) {
        initializeMobileNav();
    }

    if(mediaQuery && navInitialised) {
        uninitializeMobileNav();
    }

    return false;
}

const slider = tns({
    container: '.slider',
    mode: 'gallery',
    mouseDrag: true,
    nav: false
});