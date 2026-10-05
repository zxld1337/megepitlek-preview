const images = [
    "images/landing/image1.jpg",
    "images/landing/image2.jpg",
    "images/landing/image3.jpg",
    "images/landing/image4.jpg",
    "images/landing/image5.jpg",
    "images/landing/image6.jpg",
    "images/landing/image7.jpg",
    "images/landing/image8.jpg",
];

let currentIndex = 0;
const heroImage = document.getElementById("hero-image");

function updateImage(index) {
    heroImage.classList.add("fade-out");
    heroImage.classList.add("fade-out");

    setTimeout(() => {
        heroImage.src = images[index];
        heroImage.classList.remove("fade-out");
        heroImage.classList.add("fade-in");

        setTimeout(() => {
            heroImage.classList.remove("fade-in");
        }, 500);
    }, 500);
}

setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage(currentIndex);
}, 4000);



