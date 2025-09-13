document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("activate");
            let content = header.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});