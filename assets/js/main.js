// =======================================
// App State
// =======================================
let properties = [];
let currentProperty = null;
let currentImageIndex = 0;
let modalOpen = false;

// =======================================
// DOM Elements
// =======================================
const navMenu = document.getElementById('nav-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const propertiesGrid = document.getElementById('properties-grid');
const modal = document.getElementById('property-modal');
const modalClose = document.getElementById('modal-close');
const contactForm = document.getElementById('contact-form');

// =======================================
// Initialize App
// =======================================
document.addEventListener('DOMContentLoaded', () => {
  loadProperties();
  setupEventListeners();
});

// =======================================
// Load Properties from JSON
// =======================================
async function loadProperties() {
  try {
    const response = await fetch('data/properties.json');
    const data = await response.json();
    properties = data.properties;
    renderProperties();
  } catch (error) {
    console.error('Error loading properties:', error);
    propertiesGrid.innerHTML = '<p style="text-align: center; color: #666;">Unable to load properties. Please try again later.</p>';
  }
}

// =======================================
// Render Property Cards
// =======================================
function renderProperties() {
  if (!properties.length) return;
  
  propertiesGrid.innerHTML = properties.map(property => `
    <div class="property-card" data-id="${property.id}">
      <img src="${property.image}" alt="${property.title}" class="property-image">
      <div class="property-info">
        <div class="property-price">${property.price}</div>
        <h3 class="property-title">${property.title}</h3>
        <div class="property-location">
          <span>📍</span>
          ${property.location}
        </div>
      </div>
    </div>
  `).join('');
  
  // Add click event listeners to property cards
  document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', () => {
      const propertyId = parseInt(card.dataset.id);
      openPropertyModal(propertyId);
    });
  });
}

// =======================================
// Property Modal Functions
// =======================================
function openPropertyModal(propertyId) {
  currentProperty = properties.find(p => p.id === propertyId);
  if (!currentProperty) return;
  
  currentImageIndex = 0;
  modalOpen = true;
  
  // Populate modal content
  populateModalContent();
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePropertyModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  modalOpen = false;
  currentProperty = null;
  currentImageIndex = 0;
}

function populateModalContent() {
  if (!currentProperty) return;
  
  const modalDetails = document.getElementById('modal-details');
  
  modalDetails.innerHTML = `
    <div class="modal-gallery">
      ${currentProperty.images.map((img, index) => `
        <img src="${img}" alt="${currentProperty.title}" class="modal-image ${index === 0 ? 'active' : ''}" data-index="${index}">
      `).join('')}
      
      ${currentProperty.images.length > 1 ? `
        <button class="gallery-nav gallery-prev" onclick="changeImage(-1)">‹</button>
        <button class="gallery-nav gallery-next" onclick="changeImage(1)">›</button>
        <div class="gallery-dots">
          ${currentProperty.images.map((_, index) => `
            <button class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})"></button>
          `).join('')}
        </div>
      ` : ''}
    </div>
    
    <div class="modal-details">
      <div class="modal-price">${currentProperty.price}</div>
      <h2 class="modal-title">${currentProperty.title}</h2>
      <div class="modal-location">
        <span>📍</span>
        ${currentProperty.location}
      </div>
      
      <p class="modal-description">${currentProperty.description}</p>
      
      <div class="modal-features">
        <h4>Property Features</h4>
        <ul class="features-list">
          ${currentProperty.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      
      <button class="enquire-btn" onclick="scrollToContact()">Enquire Now</button>
    </div>
  `;
}

// =======================================
// Gallery Navigation
// =======================================
function changeImage(direction) {
  if (!currentProperty || currentProperty.images.length <= 1) return;
  
  const images = document.querySelectorAll('.modal-image');
  const dots = document.querySelectorAll('.gallery-dot');
  
  images[currentImageIndex].classList.remove('active');
  dots[currentImageIndex].classList.remove('active');
  
  currentImageIndex += direction;
  
  if (currentImageIndex >= images.length) {
    currentImageIndex = 0;
  } else if (currentImageIndex < 0) {
    currentImageIndex = images.length - 1;
  }
  
  images[currentImageIndex].classList.add('active');
  dots[currentImageIndex].classList.add('active');
}

function goToImage(index) {
  if (!currentProperty || !currentProperty.images.length) return;
  
  const images = document.querySelectorAll('.modal-image');
  const dots = document.querySelectorAll('.gallery-dot');
  
  images[currentImageIndex].classList.remove('active');
  dots[currentImageIndex].classList.remove('active');
  
  currentImageIndex = index;
  
  images[currentImageIndex].classList.add('active');
  dots[currentImageIndex].classList.add('active');
}

// =======================================
// Event Listeners
// =======================================
function setupEventListeners() {
  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  // Modal close
  modalClose.addEventListener('click', closePropertyModal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePropertyModal();
    }
  });
  
  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen) {
      closePropertyModal();
    }
  });
  
  // Contact form submission
  contactForm.addEventListener('submit', handleFormSubmit);
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        navMenu.classList.remove('active');
        
        // Smooth scroll to target
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
  // Add scroll effect to header
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
      header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
  });
}

function toggleMobileMenu() {
  navMenu.classList.toggle('active');
  
  // Animate hamburger icon
  const spans = mobileMenuBtn.querySelectorAll('span');
  const isActive = navMenu.classList.contains('active');
  
  if (isActive) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

// =======================================
// Utility Functions
// =======================================
function scrollToContact() {
  closePropertyModal();
  const contactSection = document.getElementById('contact');
  contactSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message');
  
  // Simple validation
  if (!name || (!email && !phone) || !message) {
    alert('Please fill in all required fields (Name, Email or Phone, and Message).');
    return;
  }
  
  // Update button state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Construct data for Google Forms
  const googleFormData = new FormData();
  googleFormData.append('entry.665789752', name);     // Name
  googleFormData.append('entry.1764999526', phone);   // Phone
  googleFormData.append('entry.722616374', message);  // Message
  if (email) {
    googleFormData.append('emailAddress', email);     // Email
  }

  // Submit using fetch with 'no-cors' mode
  const actionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScCh7s3wwIAzLkXu9pttdnNS-JOL1iiw0G4MQMU-nOGxTbGEA/formResponse';
  
  fetch(actionUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: googleFormData
  }).then(() => {
    // Show success message
    alert('Thank you for your inquiry! We will get back to you soon.');
    contactForm.reset();
  }).catch((err) => {
    console.error('Error submitting form:', err);
    alert('Failed to send the message. Please try again later.');
  }).finally(() => {
    // Reset button state
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  });
}

// =======================================
// Global Functions (for onclick handlers)
// =======================================
window.changeImage = changeImage;
window.goToImage = goToImage;
window.scrollToContact = scrollToContact;
window.openPropertyModal = openPropertyModal;