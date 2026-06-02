
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
const isTablet = window.innerWidth >= 601 && window.innerWidth <= 1200;

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
                </video>
                `
    }
    return `<picture>
                <source media="(min-width: 600px)" srcset="${project.images.desktop}" type="image/webp">
                <img src="${project.images.mobile}" alt="${project.title}" loading="lazy">
            </picture>
            `
}

// if on mobile video should autoplay, otherwise it only plays on hover
function setupVideoBehaviour (imageItem) {
    const video = imageItem.querySelector("video")
    if(!video) return;

    if(isMobile) {
        video.play();
        return;
    }

    if(isTablet) {
        video.addEventListener("click", () => {
            if(video.paused) {
                video.play();
                return;
            }

            video.pause();
        });
        return;
    }

    video.addEventListener("mouseenter", () => video.play());
    video.addEventListener("mouseleave", () => video.pause());
}

function createTextItem(num, title, link) {
    const textItem = document.createElement("div");
    const titleLink = link 
        ? `<a href="${link}" target="_blank"><h3 class="title-link">${title}</h3></a>`
        : `<h3>${title}</h3>`;
    textItem.classList.add("websites-text-container");

    textItem.innerHTML = `<span>${num}</span>${titleLink}<span class="push-right more-info-btn">More Info +</span>`;
    return textItem;
}

function createInfoPanel(project) {
    const infoPanel = document.createElement("div");
    const stackPanel = document.createElement("div");
    infoPanel.classList.add("info-panel");
    stackPanel.classList.add("stack-panel");
    infoPanel.innerHTML = `<p>${project.description}</p>`;
    stackPanel.innerHTML = createMarquee(project.stack);
    infoPanel.appendChild(stackPanel);
    return infoPanel;
}

function createMarquee(stack) {
    const stackStr = (stack.join(" • ") + " • ").repeat(5);
    const duration = stackStr.length * 0.15;
    return `<div class="marquee-track" style="animation-duration:${duration}s">
                <h4>${stackStr}</h4>
                <h4>${stackStr}</h4>
            </div>`;
}

function renderProjects(data) {
    containerWorks.innerHTML = "";
    data.websites.forEach((project, i) => {
        const item = document.createElement("div");
        const imageItem = document.createElement("div");
        const num = i < 10 ? "0" + String(i + 1) : String(i + 1);

        item.classList.add("websites-content");
        imageItem.classList.add("websites-image-container");

        const textItem = createTextItem(num, project.title, project.link);
        const infoPanel = createInfoPanel(project);

        imageItem.innerHTML = createMediaElement(project);
        setupVideoBehaviour(imageItem);
        const moreInfoBtn = textItem.querySelector(".more-info-btn");
        moreInfoBtn.addEventListener("click", () => {
            infoPanel.classList.toggle("open-panel");
            moreInfoBtn.textContent = infoPanel.classList.contains("open-panel") ? "Less Info –" : "More Info +"
        });

        item.appendChild(textItem);
        item.appendChild(infoPanel);
        item.appendChild(imageItem);
        containerWorks.appendChild(item);
    });
}

const smiley = document.querySelector("#smiley");

smiley.addEventListener("mouseenter", () => {
    smiley.textContent = ";-)"
})

smiley.addEventListener("mouseleave", () => {
    smiley.textContent = ":-)"
})

if(isMobile || isTablet) {
    setInterval(() => {
        smiley.textContent = smiley.textContent === ":-)" ? ";-)" : ":-)"
    }, 1000);
}





