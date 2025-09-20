document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const wrapper = document.querySelector(".nav-wrapper");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    links.classList.toggle("active");
    wrapper.classList.toggle("active"); // expand border
  });
});



