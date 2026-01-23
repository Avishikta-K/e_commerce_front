export const runFlyToCartAnimation = (imgElement, callback) => {
  const cartIcon = document.getElementById('cart-icon');

  if (!cartIcon || !imgElement) return;

  const imgRect = imgElement.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const flyingImg = imgElement.cloneNode();

  // 1. Force a square shape
  const size = Math.min(imgRect.width, imgRect.height);

  // 2. Calculate offsets to center the square over the original image
  // (Original Width - Square Width) / 2 gives us the left padding needed to center it
  const offsetX = (imgRect.width - size) / 2;
  const offsetY = (imgRect.height - size) / 2;

  // Start Position (Centered)
  flyingImg.style.position = 'fixed';
  // Add the offsets to the original positions
  flyingImg.style.left = `${imgRect.left + offsetX}px`;
  flyingImg.style.top = `${imgRect.top + offsetY}px`;
  
  flyingImg.style.width = `${size}px`;
  flyingImg.style.height = `${size}px`;
  flyingImg.style.objectFit = 'cover'; 
  flyingImg.style.borderRadius = '50%';
  flyingImg.style.zIndex = '9999';
  flyingImg.style.pointerEvents = 'none';

  // Animation Settings
  flyingImg.style.transition = 'all 0.8s ease-in-out';

  document.body.appendChild(flyingImg);

  // STEP 1: The "Pop"
  requestAnimationFrame(() => {
    flyingImg.style.transform = 'scale(1.1)'; 
  });

  // STEP 2: The "Throw"
  setTimeout(() => {
    flyingImg.style.left = `${cartRect.left + 5}px`;
    flyingImg.style.top = `${cartRect.top + 5}px`;
    flyingImg.style.width = '15px'; 
    flyingImg.style.height = '15px';
    flyingImg.style.opacity = '1'; 
    flyingImg.style.transform = 'rotate(360deg) scale(1)'; 
  }, 50);

  // Cleanup
  setTimeout(() => {
    if (document.body.contains(flyingImg)) {
      document.body.removeChild(flyingImg);
    }
    if (callback) callback();
  }, 850);
};