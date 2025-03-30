// JS for India's Freedom Struggle Website

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Create audio element for button clicks - preload to ensure availability
  const clickSound = document.getElementById('click-sound') || new Audio('audio/keypress.mp3');
  clickSound.volume = 1.0; // Maximum volume for button clicks
  clickSound.preload = 'auto';
  
  // Ensure audio is ready to play
  clickSound.load();
  
  // Background music element
  const backgroundMusic = document.getElementById('background-music');
  if (backgroundMusic) {
    backgroundMusic.volume = 0.35; // Set appropriate volume for background music
    backgroundMusic.load(); // Ensure it's loaded
  }
  
  // Check if music should be playing (from localStorage)
  if (localStorage.getItem('musicPlaying') === 'true' && backgroundMusic) {
    backgroundMusic.play()
      .catch(error => console.log('Auto-play prevented by browser:', error));
  }
  
  // More comprehensive selector for clickable elements
  const clickableElements = document.querySelectorAll(
    'a, button, .button, .btn, input[type="button"], input[type="submit"], .nav-links a, .footer-links a, ' +
    '.nav-buttons a, [role="button"], [onclick], .timeline-item a, .logo'
  );
  
  // Check if we're on the home page
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname.endsWith('/') || 
                    window.location.pathname.split('/').pop() === '';
  
  // General click handler for the entire document
  document.addEventListener('click', function(e) {
    // Find if the clicked element or any of its parents is a clickable element
    let element = e.target;
    let isClickable = false;
    
    // Check if the element or any parent is a clickable element
    while (element && element !== document) {
      if (element.tagName === 'A' || 
          element.tagName === 'BUTTON' || 
          element.classList.contains('button') ||
          element.classList.contains('btn') ||
          element.getAttribute('role') === 'button' ||
          element.hasAttribute('onclick')) {
        isClickable = true;
        break;
      }
      element = element.parentElement;
    }
    
    // If clickable and not an external link, play sound
    if (isClickable && element) {
      // Don't play sound for links that navigate away from the site
      const href = element.getAttribute('href');
      if (element.getAttribute('target') === '_blank' || 
          (href && (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')))) {
        return;
      }
      
      // Play the click sound
      if (clickSound.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        clickSound.currentTime = 0;
        const playPromise = clickSound.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Error playing sound:', error);
            // Try again with a new Audio object
            const fallbackSound = new Audio('audio/keypress.mp3');
            fallbackSound.volume = 1.0;
            fallbackSound.play().catch(e => console.log('Fallback sound failed:', e));
          });
        }
      } else {
        // If original sound not ready, create a new instance
        const tempSound = new Audio('audio/keypress.mp3');
        tempSound.volume = 1.0;
        tempSound.play().catch(e => console.log('Temp sound failed:', e));
      }
      
      // If on home page and music isn't already playing, start background music
      if (isHomePage && backgroundMusic && localStorage.getItem('musicPlaying') !== 'true') {
        backgroundMusic.play()
          .then(() => {
            localStorage.setItem('musicPlaying', 'true');
          })
          .catch(error => console.log('Auto-play prevented by browser:', error));
      }
    }
  });
  
  // Also add direct event listeners to all known clickable elements as backup
  clickableElements.forEach(element => {
    element.addEventListener('click', function(e) {
      // Don't play sound for links that navigate away from the site
      const href = this.getAttribute('href');
      if (this.getAttribute('target') === '_blank' || 
          (href && (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')))) {
        return;
      }
      
      // Reset and play the click sound
      clickSound.currentTime = 0;
      clickSound.play().catch(e => console.log('Element direct sound failed:', e));
    });
  });
  
  // Highlight current page in navigation
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === 'index.html' && linkHref === 'index.html') ||
        (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
}); 