const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const status = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

async function searchImages(query) {
    results.innerHTML = "";
    emptyState.style.display = "none";
    status.textContent = "Searching... Please wait.";

    try {
        const url =
            "https://commons.wikimedia.org/w/api.php?action=query" +
            "&generator=search" +
            "&gsrsearch=" + encodeURIComponent(query) +
            "&gsrnamespace=6" +
            "&gsrlimit=12" +
            "&prop=imageinfo" +
            "&iiprop=url" +
            "&iiurlwidth=300" +
            "&format=json&origin=*";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Request failed: " + response.status);
        }

        const data = await response.json();

        const items = data.query
            ? Object.values(data.query.pages)
            : [];

        if (items.length === 0) {
            status.textContent = "No results found.";
            emptyState.textContent = "No images found. Try another search!";
            emptyState.style.display = "block";
            return;
        }

        items.forEach((item) => {
            const imageUrl = item.imageinfo?.[0]?.thumburl;

            if (!imageUrl) return;

            const card = document.createElement("article");
            card.className = "card";

            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = item.title;
            img.loading = "lazy";

            const caption = document.createElement("p");
            caption.textContent = item.title;

            card.appendChild(img);
            card.appendChild(caption);

            results.appendChild(card);
        });

        status.textContent =
            "Showing " + results.children.length + " results.";

    } catch (error) {
        results.innerHTML = "";
        status.textContent = "Search failed.";

        emptyState.textContent =
            "Something went wrong. Please check your internet and try again.";

        emptyState.style.display = "block";

        console.error(error);
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim();

    if (!query) {
        status.textContent = "Please enter something to search.";
        return;
    }

    searchImages(query);
});
