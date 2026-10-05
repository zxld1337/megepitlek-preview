function generateImageArray(numberOfImages, folderName, label) {
  const images = [];
  numberOfImages++;
  for (let i = 0; i < numberOfImages; i++) {
    images.push({
      src: `${folderName}/${i}.JPG`,
      alt: label
        ? `${label} – ${i + 1}. fotó`
        : `Kép ${i + 1} / ${numberOfImages}`,
    });
  }
  return images;
}
