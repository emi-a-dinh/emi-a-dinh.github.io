const projects = [
  {
    title: "TaskLogger (Hackathon)",
    desc: "AI-powered group project task delegator for college teams. It turns project specs into structured, dependency-aware tasks, scores difficulty, and helps assign work fairly based on skills and workload.",
    tags: ["Next.js", "Supabase", "Clerk/Auth", "AI Task Planning"],
    modalTags: ["Next.js", "Supabase", "OpenAI", "GPT 5.2"],
    link: "https://tasklogger-gray.vercel.app/sign-in",
    images: [
      {
        src: "./assets/tasklogger-screen-1.png",
        alt: "TaskLogger board workflow screenshot",
      },
      {
        src: "./assets/tasklogger-screen-2.png",
        alt: "TaskLogger dashboard screenshot",
      },
    ],
  },
  {
    title: "Kids First Initiative",
    desc: "Technical lead for K-6 educational games. Our team built an original game that teaches gravity, friction, and the three states of matter through interactive play.",
    tags: ["Technical Lead", "Next.js", "MongoDB", "Unity"],
    deployStatus: "To be deployed",
    image: "./assets/project-placeholder.svg",
    imageAlt: "Kids First Initiative project placeholder image",
  },
  {
    title: "HaulSmart",
    desc: "Founding Software Engineer for a mobile/web platform (Expo + iOS deployment) that filters gas stations by rig configuration constraints.",
    modalDesc:
      "Founding Software Engineer for HaulSmart. Designed and implemented the end-to-end system architecture for a mobile/web application filtering gas stations based on vehicle rig constraints. Built the full-stack application across frontend UI and backend services, implemented core data models/APIs/business logic for configuration-based fueling matches, wrote most production code, and worked directly with startup leadership to translate product requirements into scalable technical solutions. Built with Expo and planned for iOS deployment.",
    tags: ["Founding Engineer", "Expo", "iOS Deployment", "Full Stack"],
    link: "https://haul-smart.vercel.app/landingProjects",
    images: [
      {
        src: "./assets/haulsmart-screen-1.png",
        alt: "HaulSmart rig compatibility and station accessibility check screen",
      },
      {
        src: "./assets/haulsmart-screen-2.png",
        alt: "HaulSmart map with filtered station pins",
      },
      {
        src: "./assets/haulsmart-screen-3.png",
        alt: "HaulSmart trailer garage and configuration management screen",
      },
    ],
  },
];

const curiosities = [
  "human-centered app design",
  "ML tools for everyday workflows",
  "creative coding with visuals",
  "building products people actually use",
];

const greetings = ["Hello", "こんにちは", "Xin chào", "你好", "nei5 hou2"];
const photoFallback = "./assets/project-placeholder.svg";
const photoSources = [
  {
    title: "Badminton Graduation Shoot",
    desc: "Graduation photoshoot in June.",
    baseName: "badminton",
  },
  {
    title: "Berkeley Graduation Shoot",
    desc: "Graduation photoshoot in May.",
    baseName: "berkeley",
  },
  {
    title: "Alishan, Taiwan",
    desc: "This was in Alishan during April.",
    baseName: "taiwan",
  },
];

const photoSourceCache = new Map();

const buildLogEntries = [
  {
    date: "Feb 24, 2026",
    title: "Added project image modal gallery",
    note: "TaskLogger cards now open with multi-screenshot previews and metadata tags.",
  },
  {
    date: "Feb 23, 2026",
    title: "Introduced reading progress component",
    note: "Split book tracking into its own card next to About Me for clearer storytelling.",
  },
  {
    date: "Feb 23, 2026",
    title: "Connected social + portfolio flow",
    note: "Linked GitHub/LinkedIn in hero and footer, and added a matching LinkedIn banner asset.",
  },
  {
    date: "Feb 23, 2026",
    title: "Launched personal site v1",
    note: "Built warm cafe-inspired design system, responsive layout, and animated hero identity.",
  },
];

const githubBuildLogConfig = {
  username: "emi-a-dinh",
  eventLimit: 30,
  entryLimit: 8,
};

function escapeHtml(text) {
  const value = String(text ?? "");
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatLogDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function capitalize(text) {
  if (!text) return "";
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function mapGitHubEventsToLogEntries(events) {
  const items = [];

  events.forEach((event) => {
    const repoName = event?.repo?.name || "a repository";
    const payload = event?.payload || {};

    if (event.type === "PushEvent" && payload.commits?.length) {
      const commitCount = payload.commits.length;
      const firstCommit = payload.commits[0];
      const firstMessage = (firstCommit?.message || "Updated code").split("\n")[0];
      items.push({
        date: formatLogDate(event.created_at),
        title: `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""} to ${repoName}`,
        note: firstMessage,
        url: firstCommit?.sha ? `https://github.com/${repoName}/commit/${firstCommit.sha}` : `https://github.com/${repoName}`,
        timestamp: event.created_at,
      });
      return;
    }

    if (event.type === "PullRequestEvent" && payload.pull_request) {
      items.push({
        date: formatLogDate(event.created_at),
        title: `${capitalize(payload.action)} pull request in ${repoName}`,
        note: payload.pull_request.title || "Pull request activity",
        url: payload.pull_request.html_url,
        timestamp: event.created_at,
      });
      return;
    }

    if (event.type === "CreateEvent") {
      items.push({
        date: formatLogDate(event.created_at),
        title: `Created ${payload.ref_type || "resource"} in ${repoName}`,
        note: payload.ref ? `Name: ${payload.ref}` : "New repository activity",
        url: `https://github.com/${repoName}`,
        timestamp: event.created_at,
      });
      return;
    }

    if (event.type === "IssuesEvent" && payload.issue) {
      items.push({
        date: formatLogDate(event.created_at),
        title: `${capitalize(payload.action)} issue in ${repoName}`,
        note: payload.issue.title || "Issue activity",
        url: payload.issue.html_url,
        timestamp: event.created_at,
      });
      return;
    }

    if (event.type === "ReleaseEvent" && payload.release) {
      items.push({
        date: formatLogDate(event.created_at),
        title: `Published release in ${repoName}`,
        note: payload.release.name || payload.release.tag_name || "Release activity",
        url: payload.release.html_url,
        timestamp: event.created_at,
      });
    }
  });

  return items.slice(0, githubBuildLogConfig.entryLimit);
}

function getLogEntryTimestamp(entry) {
  const raw = entry.timestamp || entry.date;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function renderProjects() {
  const grid = document.querySelector("#project-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project, index) => `
      <article
        class="project-card"
        data-project-index="${index}"
        role="button"
        tabindex="0"
        aria-label="Open project details for ${project.title}"
      >
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <div class="chip-row">
          ${project.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
        </div>
        ${
          project.link
            ? `<a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">Live Demo</a>`
            : `<span class="project-status">${project.deployStatus || "To be deployed"}</span>`
        }
      </article>
    `,
    )
    .join("");
}

function setupProjectModal() {
  const grid = document.querySelector("#project-grid");
  const modal = document.querySelector("#project-modal");
  const modalTitle = document.querySelector("#project-modal-title");
  const modalDescription = document.querySelector("#project-modal-description");
  const modalTags = document.querySelector("#project-modal-tags");
  const modalImage = document.querySelector("#project-modal-image");
  const modalLink = document.querySelector("#project-modal-link");
  const modalThumbs = document.querySelector("#project-modal-thumbs");
  const prevButton = document.querySelector("#project-modal-prev");
  const nextButton = document.querySelector("#project-modal-next");
  const closeButton = document.querySelector("#project-modal-close");
  const backdrop = document.querySelector("#project-modal-backdrop");

  if (
    !grid ||
    !modal ||
    !modalTitle ||
    !modalDescription ||
    !modalTags ||
    !modalImage ||
    !modalLink ||
    !modalThumbs ||
    !prevButton ||
    !nextButton ||
    !closeButton ||
    !backdrop
  ) {
    return;
  }

  const fallbackImage = "./assets/project-placeholder.svg";
  let modalImages = [];
  let currentModalImageIndex = 0;

  const setModalImage = (index) => {
    if (!modalImages.length) return;
    currentModalImageIndex = (index + modalImages.length) % modalImages.length;
    const current = modalImages[currentModalImageIndex];
    modalImage.src = current?.src || fallbackImage;
    modalImage.alt = current?.alt || "Project screenshot";

    const thumbButtons = modalThumbs.querySelectorAll("button");
    thumbButtons.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("active", thumbIndex === currentModalImageIndex);
    });
  };

  const renderThumbs = () => {
    modalThumbs.innerHTML = modalImages
      .map(
        (image, index) => `
          <button
            type="button"
            data-image-index="${index}"
            aria-label="View screenshot ${index + 1}"
            class="${index === currentModalImageIndex ? "active" : ""}"
          >
            <img src="${image.src}" alt="${image.alt}" onerror="this.src='./assets/project-placeholder.svg'" />
          </button>
        `,
      )
      .join("");

    modalThumbs.hidden = modalImages.length <= 1;
    prevButton.hidden = modalImages.length <= 1;
    nextButton.hidden = modalImages.length <= 1;
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const openModal = (project) => {
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.modalDesc || project.desc;
    const tagsToRender = project.modalTags?.length ? project.modalTags : project.tags || [];
    modalTags.innerHTML = tagsToRender.map((tag) => `<span>${tag}</span>`).join("");
    modalTags.hidden = tagsToRender.length === 0;
    modalImages =
      project.images?.length
        ? project.images
        : [{ src: project.image || fallbackImage, alt: project.imageAlt || `${project.title} preview` }];
    currentModalImageIndex = 0;
    renderThumbs();
    setModalImage(0);

    if (project.link) {
      modalLink.href = project.link;
      modalLink.hidden = false;
    } else {
      modalLink.href = "";
      modalLink.hidden = true;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  modalImage.addEventListener("error", () => {
    modalImage.src = fallbackImage;
  });

  modalThumbs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-image-index]");
    if (!button) return;
    const index = Number(button.dataset.imageIndex);
    if (Number.isNaN(index)) return;
    setModalImage(index);
  });

  prevButton.addEventListener("click", () => {
    setModalImage(currentModalImageIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    setModalImage(currentModalImageIndex + 1);
  });

  grid.addEventListener("click", (event) => {
    if (event.target.closest(".project-link")) return;
    const card = event.target.closest(".project-card");
    if (!card) return;

    const index = Number(card.dataset.projectIndex);
    if (Number.isNaN(index) || !projects[index]) return;
    openModal(projects[index]);
  });

  grid.addEventListener("keydown", (event) => {
    const card = event.target.closest(".project-card");
    if (!card) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();

    const index = Number(card.dataset.projectIndex);
    if (Number.isNaN(index) || !projects[index]) return;
    openModal(projects[index]);
  });

  closeButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function canLoadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function resolvePhotoSource(baseName) {
  if (photoSourceCache.has(baseName)) return photoSourceCache.get(baseName);

  const extensions = ["", ".png", ".jpg", ".jpeg", ".webp"];
  for (const ext of extensions) {
    const candidate = `./assets/${baseName}${ext}`;
    const exists = await canLoadImage(candidate);
    if (exists) {
      photoSourceCache.set(baseName, candidate);
      return candidate;
    }
  }

  photoSourceCache.set(baseName, photoFallback);
  return photoFallback;
}

function setupPhotoModal() {
  const cards = document.querySelectorAll(".photo-card");
  const modal = document.querySelector("#photo-modal");
  const panel = document.querySelector(".photo-modal-panel");
  const title = document.querySelector("#photo-modal-title");
  const description = document.querySelector("#photo-modal-description");
  const image = document.querySelector("#photo-modal-image");
  const closeButton = document.querySelector("#photo-modal-close");
  const backdrop = document.querySelector("#photo-modal-backdrop");

  if (!cards.length || !modal || !panel || !title || !description || !image || !closeButton || !backdrop) {
    return;
  }

  let openToken = 0;

  const setPhotoModalOrientation = () => {
    const isPortrait = image.naturalHeight > image.naturalWidth;
    panel.classList.toggle("photo-modal-portrait", isPortrait);
    panel.classList.toggle("photo-modal-landscape", !isPortrait);
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const openModal = async (photo) => {
    const token = ++openToken;
    title.textContent = photo.title;
    description.textContent = photo.desc;
    panel.classList.remove("photo-modal-portrait", "photo-modal-landscape");
    panel.classList.add("photo-modal-landscape");
    image.src = photoFallback;
    image.alt = `${photo.title} photo`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const resolved = await resolvePhotoSource(photo.baseName);
    if (token !== openToken) return;
    image.src = resolved;
  };

  image.addEventListener("load", setPhotoModalOrientation);

  image.addEventListener("error", () => {
    image.src = photoFallback;
    panel.classList.remove("photo-modal-portrait");
    panel.classList.add("photo-modal-landscape");
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.photoIndex);
      if (Number.isNaN(index) || !photoSources[index]) return;
      openModal(photoSources[index]);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const index = Number(card.dataset.photoIndex);
      if (Number.isNaN(index) || !photoSources[index]) return;
      openModal(photoSources[index]);
    });
  });

  closeButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function renderBuildLog(entries) {
  const container = document.querySelector("#build-log-list");
  if (!container) return;

  const orderedEntries = [...entries].sort(
    (a, b) => getLogEntryTimestamp(b) - getLogEntryTimestamp(a),
  );

  container.innerHTML = orderedEntries
    .map(
      (entry) => `
        <article class="build-log-item">
          <p class="build-log-date">${escapeHtml(entry.date)}</p>
          <p class="build-log-title">${escapeHtml(entry.title)}</p>
          <p class="build-log-note">${escapeHtml(entry.note)}</p>
          ${
            entry.url
              ? `<a class="build-log-link" href="${escapeHtml(entry.url)}" target="_blank" rel="noreferrer">View on GitHub</a>`
              : ""
          }
        </article>
      `,
    )
    .join("");
}

async function loadGitHubBuildLog() {
  const status = document.querySelector("#build-log-status");
  const fallbackEntries = buildLogEntries;
  renderBuildLog(fallbackEntries);

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubBuildLogConfig.username}/events/public?per_page=${githubBuildLogConfig.eventLimit}`,
      {
        headers: { Accept: "application/vnd.github+json" },
      },
    );

    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const events = await response.json();
    const githubEntries = mapGitHubEventsToLogEntries(events);

    if (githubEntries.length) {
      renderBuildLog(githubEntries);
      if (status) status.textContent = `Live from GitHub @${githubBuildLogConfig.username}`;
    } else if (status) {
      status.textContent = "No recent public GitHub events. Showing local log.";
    }
  } catch (error) {
    if (status) status.textContent = "GitHub sync unavailable. Showing local log.";
  }
}

function startCuriosityLoop() {
  const text = document.querySelector("#curiosity-text");
  if (!text) return;
  let index = 0;

  setInterval(() => {
    index = (index + 1) % curiosities.length;
    text.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
      duration: 520,
      easing: "ease-in-out",
    });
    text.textContent = curiosities[index];
  }, 2600);
}

function startGreetingLoop() {
  const text = document.querySelector("#greeting-text");
  if (!text) return;
  let index = 0;

  setInterval(() => {
    index = (index + 1) % greetings.length;
    text.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
      duration: 540,
      easing: "ease-in-out",
    });
    text.textContent = greetings[index];
  }, 2200);
}

function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.09, 0.35)}s`;
    observer.observe(el);
  });
}

renderProjects();
setupProjectModal();
setupPhotoModal();
loadGitHubBuildLog();
startGreetingLoop();
startCuriosityLoop();
setupRevealAnimations();
