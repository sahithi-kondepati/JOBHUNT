// DOM Elements
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");
const registerBtn = document.querySelector(".btn");
const jobGrid = document.querySelector(".job__grid");
const API_BASE_URL = "http://localhost:5000/api"; // Update if deployed

// Mobile Menu Toggle
menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

// Registration Modal
registerBtn.addEventListener("click", () => {
  showRegistrationModal();
});

// Fetch Jobs from Backend
async function fetchJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    
    const jobs = await response.json();
    renderJobs(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    jobGrid.innerHTML = `<p class="error">Error loading jobs. Please try again later.</p>`;
  }
}

// Render Jobs to DOM
function renderJobs(jobs) {
  jobGrid.innerHTML = jobs.map(job => `
    <div class="job__card">
      <div class="job__card__header">
        <img src="${job.logo}" alt="${job.company}" />
        <div>
          <h5>${job.company}</h5>
          <h6>${job.location}</h6>
        </div>
      </div>
      <h4>${job.position}</h4>
      <p>${job.description}</p>
      <div class="job__card__footer">
        <span>${job.openings} Positions</span>
        <span>${job.type}</span>
        <span>${job.salary}/Year</span>
      </div>
      <button class="btn apply-btn" data-jobid="${job._id}">Apply Now</button>
    </div>
  `).join('');

  // Add event listeners to apply buttons
  document.querySelectorAll('.apply-btn').forEach(btn => {
    btn.addEventListener('click', handleJobApplication);
  });
}

// Handle Job Application
function handleJobApplication(e) {
  const jobId = e.target.dataset.jobid;
  // You would typically show a modal here to collect application details
  alert(`Applying for job ID: ${jobId}`);
  // Then send application data to backend
}

// Registration Modal Functions
function showRegistrationModal() {
  const modalHTML = `
    <div class="modal-overlay">
      <div class="modal">
        <button class="close-modal">&times;</button>
        <h3>Create Your Account</h3>
        <form id="registration-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <div class="form-group">
            <label for="user-type">I am a:</label>
            <select id="user-type">
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <button type="submit" class="btn">Register</button>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });
  document.getElementById('registration-form').addEventListener('submit', handleRegistration);
}

function closeModal() {
  document.querySelector('.modal-overlay').remove();
}

async function handleRegistration(e) {
  e.preventDefault();
  
  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role: document.getElementById('user-type').value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('Registration successful! You can now log in.');
      closeModal();
    } else {
      alert(data.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration.');
  }
}

// Scroll Reveal Animations
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__container h2", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".header__container h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__container p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".steps__card", {
  ...scrollRevealOption,
  interval: 500,
});
ScrollReveal().reveal(".explore__card", {
  duration: 1000,
  interval: 500,
});
ScrollReveal().reveal(".offer__card", {
  ...scrollRevealOption,
  interval: 500,
});

// Initialize Swiper
const swiper = new Swiper(".swiper", {
  loop: true,
  autoplay: {
    delay: 3000,
  },
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchJobs();
});