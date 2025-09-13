document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("active");
        });
    });
});