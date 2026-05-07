
async function loadProjects() {
    try {
        // grabs the data from a JSON file
        const response = await fetch("./src/projects.json");
        const data = await response.json();
        // calls a render function with all data
        renderProjects(data);

    } catch(err) {
        console.error("Failed to load projects", err);
    }
}

loadProjects();

const containerWorks = document.querySelector(".websites-container");
const isMobile = window.innerWidth < 600;

// if on mobile, use the second video, else the first one. Ensures responsiveness across devices
function getVideoSrc(projectId) {
    if(isMobile) {
        return `assets/videos/${projectId}/video-02.mp4`
    } else {
        return `assets/videos/${projectId}/video-01.mp4`
    }
}

// if video exists, use the video. else use a still image. if using still image, ensure responsiveness
function createMediaElement(project) {
    const src = getVideoSrc(project.id);
    if(project.videos !== undefined) {
        return `<video muted loop playsinline poster="${project.images.desktop}">
                    <source src="${src}" type="video/mp4">
                </video>`
    }
    return `<picture>
                <source media="(min-width: 600px)" srcset="${project.images.desktop}">
                <img src="${project.images.mobile}" alt="${project.title}" loading="lazy">
            </picture>`
}

// if on mobile video should autoplay, otherwise it only plays on hover
function setupVideoBehaviour (imageItem) {
    const video = imageItem.querySelector("video")
    if(!video) return;
    isMobile ? video.play() :
        (video.addEventListener("mouseenter", () => video.play()),
        video.addEventListener("mouseleave", () => video.pause()));
}

function renderProjects(data) {
    containerWorks.innerHTML = "";
    data.websites.forEach((project, i) => {
        const item = document.createElement("div");
        const textItem = document.createElement("div");
        const imageItem = document.createElement("div");
        const infoPanel = document.createElement("div");

        item.classList.add("websites-content");
        textItem.classList.add("websites-text-container");
        imageItem.classList.add("websites-image-container");
        infoPanel.classList.add("info-panel");

        // number of the project, concat a "0" if num < 10
        const num = i < 10 ? "0" + String(i + 1) : String(i + 1);

        imageItem.innerHTML = createMediaElement(project);
        setupVideoBehaviour(imageItem);

        // insert the number and title into the DOM
        textItem.innerHTML = `<span>${num}</span><h3>${project.title}</h3><span class="push-right more-info-btn">More Info +</span>`;

        const moreInfoBtn = textItem.querySelector(".more-info-btn");

        // append all to parent containers
        item.appendChild(textItem);
        item.appendChild(infoPanel);
        item.appendChild(imageItem);
        containerWorks.appendChild(item);

        moreInfoBtn.addEventListener("click", () => {
            infoPanel.classList.toggle("open-panel");
            moreInfoBtn.textContent = infoPanel.classList.contains("open-panel") ? "Less Info –" : "More Info +"
        })
        infoPanel.innerHTML = `
        <p>${project.description}</p>`
    });
}





