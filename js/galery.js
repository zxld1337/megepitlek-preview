// --- Constants ---
let currentModalImageIndex = 0;
let activeModalSet = []; // Holds the image set for the currently open modal

// --- DOM Elements ---
const galleryContainer = document.getElementById("imageGallery");
const modal = document.getElementById("imageModal");
const modalImageElement = document.getElementById("modalImageElement");
const modalCaptionText = document.getElementById("modalCaptionText");
const closeModalButton = document.getElementById("closeModalButton");
const prevModalImageButton = document.getElementById("prevModalImageButton");
const nextModalImageButton = document.getElementById("nextModalImageButton");

// --- Function to Create Main Gallery Grid ---
function createMainGallery() {
  // Items already written into the HTML (crawlable without JS): only wire them up.
  const staticItems = galleryContainer.querySelectorAll(".gallery-item");
  if (staticItems.length) {
    staticItems.forEach((item, index) => {
      const projectData = mainGalleryImages[index];
      if (!projectData) return;
      item.addEventListener("click", () => openModal(projectData, 0));
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(projectData, 0);
        }
      });
    });
    return;
  }

  galleryContainer.innerHTML = "";

  mainGalleryImages.forEach((projectData, index) => {
    // Changed imageData to projectData for clarity
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");
    // Pass the actual projectData object to openModal
    galleryItem.addEventListener("click", () => openModal(projectData, 0));

    const imgElement = document.createElement("img");
    imgElement.src = IMAGE_BASE_PATH + projectData.src;
    imgElement.alt = projectData.alt;
    imgElement.onerror = function () {
      this.onerror = null;
      this.src =
        "https://placehold.co/600x400/CCCCCC/FFFFFF?text=Grid+Img+Error";
      this.alt = "Grid image not found";
    };

    const overlay = document.createElement("div");
    overlay.classList.add("image-overlay");
    const altTextElement = document.createElement("p");
    altTextElement.classList.add("alt-text");
    altTextElement.textContent = projectData.alt;

    overlay.appendChild(altTextElement);
    galleryItem.appendChild(imgElement);
    galleryItem.appendChild(overlay);
    galleryContainer.appendChild(galleryItem);
  });
}

// --- Modal Functions ---
// openModal now accepts the full projectData object
function openModal(projectData, startIndex) {
  const imagesForThisFolder = projectData.detailImages; // Get detail images directly from the project data

  if (imagesForThisFolder && imagesForThisFolder.length > 0) {
    activeModalSet = imagesForThisFolder;
    currentModalImageIndex = startIndex;
    showModalImage(currentModalImageIndex);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  } else {
    console.warn(
      `No detail images found for folder: ${projectData.folder} in mainGalleryImages.`
    );
    const tempMsg = document.createElement("div");
    tempMsg.textContent = `No detailed images available for this project (${projectData.folder}). Please check the 'detailImages' array for this project.`;
    tempMsg.style.position = "fixed";
    tempMsg.style.top = "20px";
    tempMsg.style.left = "50%";
    tempMsg.style.transform = "translateX(-50%)";
    tempMsg.style.backgroundColor = "rgba(220, 53, 69, 0.9)";
    tempMsg.style.color = "white";
    tempMsg.style.padding = "12px 25px";
    tempMsg.style.borderRadius = "6px";
    tempMsg.style.zIndex = "2000";
    tempMsg.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    document.body.appendChild(tempMsg);
    setTimeout(() => {
      if (document.body.contains(tempMsg)) {
        document.body.removeChild(tempMsg);
      }
    }, 4000);
  }
}

function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  activeModalSet = [];
}

function showModalImage(index) {
  if (
    activeModalSet.length === 0 ||
    index < 0 ||
    index >= activeModalSet.length
  ) {
    console.error(
      "Attempted to show modal image with invalid index or empty set:",
      index,
      activeModalSet
    );
    modalImageElement.src =
      "https://placehold.co/800x600/CCCCCC/FFFFFF?text=Error+Loading+Images";
    modalImageElement.alt = "Error loading images for this project.";
    modalCaptionText.textContent =
      "An error occurred while trying to display images.";
    return;
  }

  const imageData = activeModalSet[index];
  modalImageElement.src = IMAGE_BASE_PATH + imageData.src; // Construct full path
  modalImageElement.alt = imageData.alt;
  modalImageElement.onerror = function () {
    this.onerror = null;
    this.src =
      "https://placehold.co/800x600/CCCCCC/FFFFFF?text=Folder+Image+Error";
    this.alt = "Folder image not found";
    modalCaptionText.textContent = `Image "${imageData.src}" not found.`; // Simplified error message
  };
  modalCaptionText.textContent = imageData.alt;
}

function showNextModalImage() {
  if (activeModalSet.length === 0) return;
  currentModalImageIndex = (currentModalImageIndex + 1) % activeModalSet.length;
  showModalImage(currentModalImageIndex);
}

function showPrevModalImage() {
  if (activeModalSet.length === 0) return;
  currentModalImageIndex =
    (currentModalImageIndex - 1 + activeModalSet.length) %
    activeModalSet.length;
  showModalImage(currentModalImageIndex);
}

// --- Event Listeners ---
closeModalButton.addEventListener("click", closeModal);
prevModalImageButton.addEventListener("click", showPrevModalImage);
nextModalImageButton.addEventListener("click", showNextModalImage);

window.addEventListener('click', (event) => {
    if (modal.style.display === 'block') { 
      const target = event.target;

      const isClickOnProtectedElement = 
        target.closest('#modalImageElement') ||  // Clicked on or inside the main image
        target.closest('#prevModalImageButton') || // Clicked on or inside the prev button
        target.closest('#nextModalImageButton') || // Clicked on or inside the next button
        target.closest('#closeModalButton');      // Clicked on or inside the explicit close button

      if (!isClickOnProtectedElement) {
        if (modal.contains(target)) {
          closeModal();
        }
      }
    }
  });

document.addEventListener("keydown", (event) => {
  if (modal.style.display === "block") {
    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowRight") {
      showNextModalImage();
    } else if (event.key === "ArrowLeft") {
      showPrevModalImage();
    }
  }
});

// --- Initialize ---
window.onload = () => {
  createMainGallery();
};

