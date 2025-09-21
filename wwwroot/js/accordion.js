document.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const body = header.nextElementSibling;
            const isActive = header.classList.contains("active");

            // close all
            document.querySelectorAll(".accordion-body").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".accordion-header").forEach(h => h.classList.remove("active"));

            // if it was not active, open it
            if (!isActive) {
                header.classList.add("active");
                body.classList.add("active");
            }
            // if it was active, leave everything closed
        });
    });
});
