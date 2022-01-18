"use strict";
// Elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const scrollBtn = document.querySelector(".btn--scroll-to");
const sectionOne = document.getElementById("section--1");
const tabsContainer = document.querySelector(".operations__tab-container");
const allTabs = document.querySelectorAll(".operations__tab");
const allContents = document.querySelectorAll(".operations__content");
const allSections = document.querySelectorAll(".section");
const lazyLoadigImgs = document.querySelectorAll(".lazy-img");
const slides = document.querySelectorAll(".slide");
const btnSliderRight = document.querySelector(".slider__btn--right");
const btnSliderLeft = document.querySelector(".slider__btn--left");
const dotsContainer = document.querySelector(".dots");

// Modal window
const openModal = function (e) {
    e.preventDefaulte;
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
    btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

// add cookie message element in header

// const message = document.createElement("div");
// message.classList.add("cookie-message");
// message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn-close-cookies">Got it!</button>`;
// header.append(message);
// document.querySelector(".btn-close-cookies").addEventListener("click", () => {
//     message.remove();
// });
// message.style.height = parseFloat(getComputedStyle(message).height) + 10 + "px";
// message.style.backgroundColor = "#37383d";

// scroll smothly to section one on on click learn more btn

scrollBtn.addEventListener("click", () => {
    sectionOne.scrollIntoView({ behavior: "smooth" });
});

// scroll smothly to certain section on click one of navigation links
document.querySelector(".nav__links").addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("nav__link")) {
        const id = e.target.getAttribute("href");
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
});

// tabs component

tabsContainer.addEventListener("click", (e) => {
    const selcted = e.target.closest(".operations__tab");
    if (!selcted) return;
    // remove class active from all tabs
    allTabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
    // add class active to clicked tab
    selcted.classList.add("operations__tab--active");
    // remove class active from all contents
    allContents.forEach((content) =>
        content.classList.remove("operations__content--active")
    );
    // add class active to selected content
    const selectedContent = document.querySelector(
        `.operations__content--${selcted.dataset.tab}`
    );
    selectedContent.classList.add("operations__content--active");
});

// menu fade animation
const hoverMenu = (e, opacity) => {
    if (e.target.classList.contains("nav__link")) {
        const link = e.target;
        const siblingElements = link
            .closest(".nav")
            .querySelectorAll(".nav__link");
        const logo = link.closest(".nav").querySelector("img");
        siblingElements.forEach((element) => {
            if (element !== link) element.style.opacity = opacity;
        });
        logo.style.opacity = opacity;
    }
};
nav.addEventListener("mouseover", (e) => hoverMenu(e, 0.5));
nav.addEventListener("mouseout", (e) => hoverMenu(e, 1));

// make the navbar sticky on when the header almost gets out of viewport
const navHeight = nav.getBoundingClientRect().height;
const stickNav = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
};
const observerOptions = {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickNav, observerOptions);
headerObserver.observe(header);

// reveal sections

const revealSection = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
};
const secObserverOPt = {
    root: null,
    threshold: 0.15,
};
const SectionsObserver = new IntersectionObserver(
    revealSection,
    secObserverOPt
);
allSections.forEach((section) => {
    SectionsObserver.observe(section);
    section.classList.add("section--hidden");
});

// lazy loading images
const lazyLoad = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    // remove blur filter onload
    entry.target.addEventListener("load", () => {
        entry.target.classList.remove("lazy-img");
    });
    observer.unobserve(entry.target);
};
const imgObsOptions = {
    root: null,
    threshold: 0,
    rootMargin: `200px`,
};
const observeImgs = new IntersectionObserver(lazyLoad, imgObsOptions);

lazyLoadigImgs.forEach((img) => {
    observeImgs.observe(img);
});

// slider
let currentSlide = 0;
const MaxSlides = slides.length - 1;
const sliderHandler = (currentSlide) => {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
};
sliderHandler(0);
// create dots
slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
    );
});
// activate dots
const activeDot = (slideN) => {
    document
        .querySelectorAll(".dots__dot")
        .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
        .querySelector(`.dots__dot[data-slide="${slideN}"]`)
        .classList.add("dots__dot--active");
};
activeDot(0);
// next slide
const nextSlide = () => {
    if (currentSlide === MaxSlides) {
        currentSlide = 0;
    } else {
        currentSlide++;
    }
    sliderHandler(currentSlide);
    activeDot(currentSlide);
};
// previous slide
const previousSlide = () => {
    if (currentSlide === 0) {
        currentSlide = MaxSlides;
    } else {
        currentSlide--;
    }
    sliderHandler(currentSlide);
    activeDot(currentSlide);
};
// events
btnSliderRight.addEventListener("click", nextSlide);
btnSliderLeft.addEventListener("click", previousSlide);
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") previousSlide();
    if (e.key === "ArrowRight") nextSlide();
});
dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
        sliderHandler(e.target.dataset.slide);
        activeDot(e.target.dataset.slide);
    }
});
