// Firebase Configuration (from your prompt)
const firebaseConfig = {
    apiKey: "AIzaSyDoDPdqHhMslOkCha0MapGRyYRUdhUZbfM",
    authDomain: "papa-30f39.firebaseapp.com",
    projectId: "papa-30f39",
    databaseURL: "https://papa-30f39-default-rtdb.firebaseio.com/",
    storageBucket: "papa-30f39.appspot.com",
    messagingSenderId: "332748602419",
    appId: "1:332748602419:web:d6d49d51cd6ac25a847746"
};

// Cloudinary Configuration (from your prompt)
const CLOUDINARY_CLOUD_NAME = 'dtbftpnkq';
const CLOUDINARY_API_KEY = '543627576256858';
const CLOUDINARY_UPLOAD_PRESET = 'Lavaithan';
// WARNING: Exposing API Secret on client-side is INSECURE and should NOT be done in production.
// This is included as per your request but for real apps, use server-side signed uploads.
const CLOUDINARY_API_SECRET = 'wtkB1cxJypNvO3CguCb-NsGy7bk'; 

// Admin password (INSECURE: Hardcoded in client-side code)
const ADMIN_PASSWORD = 'Lavaithan';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

// --- DOM Elements ---
const appDiv = document.getElementById('app');
const authPage = document.getElementById('auth-page');
const registerSection = document.getElementById('register-section');
const loginSection = document.getElementById('login-section');
const registerUsernameInput = document.getElementById('register-username');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerBtn = document.getElementById('register-btn');
const showLoginLink = document.getElementById('show-login');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const showRegisterLink = document.getElementById('show-register');

const welcomePage = document.getElementById('welcome-page');
const sliderImage = document.getElementById('slider-image');
const youthBusinessLoanCard = document.getElementById('youth-business-loan');
const apnaGharApniChatLoanCard = document.getElementById('apna-ghar-apni-chat-loan');

const youthLoanPage = document.getElementById('youth-loan-page');
const youthLoanForm = document.getElementById('youth-loan-form');
const youthCnicFrontInput = document.getElementById('youth-cnic-front');
const youthCnicBackInput = document.getElementById('youth-cnic-back');
const youthApplicantPicInput = document.getElementById('youth-applicant-pic');
const youthEducationInput = document.getElementById('youth-education');
const youthWorkInput = document.getElementById('youth-work');
const youthMobileInput = document.getElementById('youth-mobile');
const youthCnicNumberInput = document.getElementById('youth-cnic-number');


const gharLoanPage = document.getElementById('ghar-loan-page');
const gharLoanForm = document.getElementById('ghar-loan-form');
const gharCnicFrontInput = document.getElementById('ghar-cnic-front');
const gharCnicBackInput = document.getElementById('ghar-cnic-back');
const gharRelativeCnicFrontInput = document.getElementById('ghar-relative-cnic-front');
const gharMobile1Input = document.getElementById('ghar-mobile1');
const gharMobile2Input = document.getElementById('ghar-mobile2');
const gharPlotRegistryInput = document.getElementById('ghar-plot-registry');
const gharCnicNumberInput = document.getElementById('ghar-cnic-number');


const trackerPage = document.getElementById('tracker-page');
const trackerCnicInput = document.getElementById('tracker-cnic');
const trackerSearchBtn = document.getElementById('tracker-search-btn');
const trackerResultsDiv = document.getElementById('tracker-results');

const analyticsPage = document.getElementById('analytics-page');
const appViewsSpan = document.getElementById('app-views');
const appLikesSpan = document.getElementById('app-likes');
const likeBtn = document.getElementById('like-btn');
const ratingStarsDiv = document.getElementById('rating-stars');
const userRatingDisplay = document.getElementById('user-rating-display');
const feedbackTextarea = document.getElementById('feedback-text');
const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
const feedbackStatusDiv = document.getElementById('feedback-status');

const eligibilityPage = document.getElementById('eligibility-page');

// Admin related DOM elements
const hamburgerMenu = document.getElementById('hamburger-menu');
const sideNav = document.getElementById('side-nav');
const closeSideNav = document.getElementById('close-side-nav');
const sideNavAdmin = document.getElementById('side-nav-admin');
const sideNavLogout = document.getElementById('side-nav-logout'); // New for side nav

const adminLoginPage = document.getElementById('admin-login-modal'); // This is now a modal
const adminPasswordInput = document.getElementById('admin-password-input');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginError = document.getElementById('admin-login-error');
const closeAdminModal = document.getElementById('close-admin-modal');

const adminPage = document.getElementById('admin-page');
const adminApplicationsDiv = document.getElementById('admin-applications');
const adminLogoutBtn = document.getElementById('admin-logout-btn'); // For main admin page logout


const navWelcome = document.getElementById('nav-welcome');
const navEligibility = document.getElementById('nav-eligibility');
const navAnalytics = document.getElementById('nav-analytics');
const navTracker = document.getElementById('nav-tracker');

let currentUser = null; // Stores current logged-in user's data (username, email, uid)
let isAdminLoggedIn = false; // Tracks if admin session is active

// --- Utility Functions ---
function showPage(pageElement) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    pageElement.style.display = 'block';
    closeNav(); // Close side nav when page changes
}

async function uploadImageToCloudinary(file) {
    if (!file) return null; // Handle case where no file is selected

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY); // Included as requested. INSECURE for production.

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error('Cloudinary upload failed: ' + (data.error ? data.error.message : 'Unknown error'));
        }
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        alert("Failed to upload image. Please try again.");
        return null;
    }
}

function showPopup(message) {
    alert(message); // Simple alert for popup
}

// --- Side Navigation and Admin Logic ---
function openNav() {
    sideNav.style.width = "250px"; // Open the side navigation
    // Conditionally show/hide logout in side nav
    if (currentUser || isAdminLoggedIn) {
        sideNavLogout.style.display = 'block';
    } else {
        sideNavLogout.style.display = 'none';
    }
}

function closeNav() {
    sideNav.style.width = "0"; // Close the side navigation
}

hamburgerMenu.addEventListener('click', openNav);
closeSideNav.addEventListener('click', closeNav);

// Admin login from side navigation
sideNavAdmin.addEventListener('click', () => {
    closeNav(); // Close the side nav
    adminLoginPage.style.display = 'flex'; // Show the modal container immediately
    adminPasswordInput.value = ''; // Clear password field
    adminLoginError.style.display = 'none'; // Hide error message
    // Add 'show' class to modal for transition effect
    setTimeout(() => adminLoginPage.classList.add('show'), 10); // Small delay for display:flex to take effect before transition
});

closeAdminModal.addEventListener('click', () => {
    adminLoginPage.classList.remove('show'); // Remove 'show' class to trigger fade out
    setTimeout(() => adminLoginPage.style.display = 'none', 300); // Hide after transition (0.3s defined in CSS)
});

// Admin Login Button in modal
adminLoginBtn.addEventListener('click', () => {
    const enteredPassword = adminPasswordInput.value;
    if (enteredPassword === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        localStorage.setItem('isAdminLoggedIn', 'true'); // Persist admin status
        adminLoginPage.classList.remove('show'); // Hide modal
        setTimeout(() => adminLoginPage.style.display = 'none', 300);
        showPage(adminPage); // Go to admin page
        loadAdminApplications();
    } else {
        adminLoginError.textContent = 'Incorrect password.';
        adminLoginError.style.display = 'block';
    }
});

// Admin logout from admin page
adminLogoutBtn.addEventListener('click', () => {
    isAdminLoggedIn = false;
    localStorage.removeItem('isAdminLoggedIn');
    showPopup('Admin logged out.');
    checkUserStatus(); // Re-check user status to go to appropriate page (auth or welcome)
});

// Logout from side nav
sideNavLogout.addEventListener('click', () => {
    if (isAdminLoggedIn) {
        adminLogoutBtn.click(); // Trigger admin logout logic
    } else if (currentUser) {
        navLogoutUser(); // Trigger regular user logout logic
    }
    closeNav();
});


// --- User Authentication Logic (Custom - INSECURE for production) ---
function checkUserStatus() {
    const storedUser = localStorage.getItem('currentUser');
    const storedAdminStatus = localStorage.getItem('isAdminLoggedIn');

    if (storedAdminStatus === 'true') {
        isAdminLoggedIn = true;
        showPage(adminPage);
        loadAdminApplications();
        sideNavAdmin.style.display = 'none'; // Hide admin login if already logged in
        sideNavLogout.style.display = 'block';
        return; // Admin takes precedence
    }

    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showPage(welcomePage);
        startImageSlider();
        incrementAppViews(); // Increment views on successful user login/welcome
        sideNavAdmin.style.display = 'block'; // Show admin login option for regular users
        sideNavLogout.style.display = 'block';
    } else {
        currentUser = null;
        isAdminLoggedIn = false; // Ensure admin status is false if no user
        showPage(authPage);
        showRegisterSection();
        sideNavAdmin.style.display = 'block'; // Always show admin login option
        sideNavLogout.style.display = 'none';
    }
}

function navLogoutUser() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showPopup('Logged out successfully.');
    checkUserStatus(); // Redirect to auth page
}


function showRegisterSection() {
    registerSection.style.display = 'block';
    loginSection.style.display = 'none';
}

function showLoginSection() {
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
}

registerBtn.addEventListener('click', async () => {
    const username = registerUsernameInput.value.trim();
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value.trim();

    if (!username || !email || !password) {
        alert("Please fill in all registration fields.");
        return;
    }

    // Check if email already exists
    try {
        const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
        if (snapshot.exists()) {
            alert("This email is already registered. Please login or use a different email.");
            return;
        }
    } catch (error) {
        console.error("Error checking existing user:", error);
        alert("An error occurred during registration. Please try again.");
        return;
    }

    try {
        const userRef = database.ref('users').push(); // Generate a unique ID for the user
        await userRef.set({
            username: username,
            email: email,
            password: password // INSECURE: Storing plaintext password. Never do this in production.
        });
        alert("Registration successful! Please login.");
        registerUsernameInput.value = '';
        registerEmailInput.value = '';
        registerPasswordInput.value = '';
        showLoginSection();
    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.message);
    }
});

loginBtn.addEventListener('click', async () => {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const usersRef = database.ref('users');
        const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
        const userData = snapshot.val();

        if (userData) {
            const userId = Object.keys(userData)[0]; // Get the unique key for the user
            const user = userData[userId];

            if (user.password === password) { // INSECURE: Plaintext password comparison.
                currentUser = { uid: userId, username: user.username, email: user.email };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loginEmailInput.value = '';
                loginPasswordInput.value = '';
                checkUserStatus(); // Go to welcome page
            } else {
                alert("Incorrect password.");
            }
        } else {
            alert("User not found. Please register.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
    }
});

showLoginLink.addEventListener('click', showLoginSection);
showRegisterLink.addEventListener('click', showRegisterSection);


// --- Welcome Page Slider ---
// Updated: Use the names of your uploaded images
const sliderImages = [
    'download.webp', // Prime Minister Youth Loan Program
    'happy.webp'     // CM Punjab Maryam Nawaz (Apna Ghar Apni Chat related)
];
let currentImageIndex = 0;
let sliderInterval;

function startImageSlider() {
    clearInterval(sliderInterval); // Clear any existing interval
    sliderInterval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
        sliderImage.style.opacity = 0; // Start fade out
        setTimeout(() => {
            sliderImage.src = sliderImages[currentImageIndex];
            sliderImage.style.opacity = 1; // Fade in
        }, 1000); // Wait for fade out (1s) before changing src and fading in
    }, 5000); // Change image every 5 seconds
}

// --- Loan Application Logic ---
youthBusinessLoanCard.addEventListener('click', () => {
    if (!currentUser) {
        alert("Please login to apply for a loan.");
        showPage(authPage);
        return;
    }
    showPage(youthLoanPage);
});

apnaGharApniChatLoanCard.addEventListener('click', () => {
    if (!currentUser) {
        alert("Please login to apply for a loan.");
        showPage(authPage);
        return;
    }
    showPage(gharLoanPage);
});

youthLoanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Session expired. Please login to apply for a loan.");
        showPage(authPage);
        return;
    }

    showPopup("Uploading documents. Please wait...");

    const cnicFrontFile = youthCnicFrontInput.files[0];
    const cnicBackFile = youthCnicBackInput.files[0];
    const applicantPicFile = youthApplicantPicInput.files[0];

    // Upload images concurrently
    const [cnicFrontUrl, cnicBackUrl, applicantPicUrl] = await Promise.all([
        uploadImageToCloudinary(cnicFrontFile),
        uploadImageToCloudinary(cnnicBackFile),
        uploadImageToCloudinary(applicantPicFile)
    ]);

    if (!cnicFrontUrl || !cnicBackUrl || !applicantPicUrl) {
        alert("Failed to upload all required images. Application not submitted.");
        return;
    }

    const applicationData = {
        userId: currentUser.uid,
        username: currentUser.username,
        email: currentUser.email,
        loanType: 'Youth Business Loan',
        cnicFrontUrl: cnicFrontUrl,
        cnicBackUrl: cnicBackUrl,
        applicantPicUrl: applicantPicUrl,
        education: youthEducationInput.value.trim(),
        work: youthWorkInput.value.trim(),
        mobileNumber: youthMobileInput.value.trim(),
        cnicNumber: youthCnicNumberInput.value.trim(), 
        status: 'Pending',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    try {
        const newApplicationRef = database.ref('applications').push();
        await newApplicationRef.set(applicationData);
        showPopup("Youth Business Loan application successfully submitted!");
        youthLoanForm.reset();
        showPage(welcomePage);
    } catch (error) {
        console.error("Error submitting youth loan application:", error);
        showPopup("Error submitting application. Please try again.");
    }
});

gharLoanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Session expired. Please login to apply for a loan.");
        showPage(authPage);
        return;
    }

    showPopup("Uploading documents. Please wait...");

    const cnicFrontFile = gharCnicFrontInput.files[0];
    const cnicBackFile = gharCnicBackInput.files[0];
    const relativeCnicFrontFile = gharRelativeCnicFrontInput.files[0];
    const plotRegistryFile = gharPlotRegistryInput.files[0];

    // Upload images concurrently
    const [cnicFrontUrl, cnicBackUrl, relativeCnicFrontUrl, plotRegistryUrl] = await Promise.all([
        uploadImageToCloudinary(cnicFrontFile),
        uploadImageToCloudinary(cnicBackFile),
        uploadImageToCloudinary(relativeCnicFrontFile),
        uploadImageToCloudinary(plotRegistryFile)
    ]);

    if (!cnicFrontUrl || !cnicBackUrl || !relativeCnicFrontUrl || !plotRegistryUrl) {
        alert("Failed to upload all required images. Application not submitted.");
        return;
    }

    const applicationData = {
        userId: currentUser.uid,
        username: currentUser.username,
        email: currentUser.email,
        loanType: 'Apna Ghar Apni Chat Loan',
        cnicFrontUrl: cnicFrontUrl,
        cnicBackUrl: cnicBackUrl,
        relativeCnicFrontUrl: relativeCnicFrontUrl,
        mobileNumber1: gharMobile1Input.value.trim(),
        mobileNumber2: gharMobile2Input.value.trim(),
        plotRegistryUrl: plotRegistryUrl,
        cnicNumber: gharCnicNumberInput.value.trim(),
        status: 'Pending',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    try {
        const newApplicationRef = database.ref('applications').push();
        await newApplicationRef.set(applicationData);
        showPopup("Apna Ghar Apni Chat Loan application successfully submitted!");
        gharLoanForm.reset();
        showPage(welcomePage);
    } catch (error) {
        console.error("Error submitting ghar loan application:", error);
        showPopup("Error submitting application. Please try again.");
    }
});

// --- Application Tracker Logic ---
trackerSearchBtn.addEventListener('click', async () => {
    const cnic = trackerCnicInput.value.trim();
    if (!cnic) {
        alert("Please enter your CNIC number to track your application.");
        return;
    }

    trackerResultsDiv.innerHTML = '<p>Searching...</p>';

    try {
        // Query applications by CNIC number
        const snapshot = await database.ref('applications').orderByChild('cnicNumber').equalTo(cnic).once('value');
        const applications = snapshot.val();
        trackerResultsDiv.innerHTML = '';

        if (applications) {
            Object.keys(applications).forEach(appId => {
                const app = applications[appId];
                const appDiv = document.createElement('div');
                appDiv.innerHTML = `
                    <h4>Applicant: ${app.username}</h4>
                    <p><strong>Loan Type:</strong> ${app.loanType}</p>
                    <p><strong>Mobile:</strong> ${app.mobileNumber || app.mobileNumber1}</p>
                    <p><strong>CNIC:</strong> ${app.cnicNumber}</p>
                    <p><strong>Status:</strong> <span style="font-weight: bold; color: ${app.status === 'Approved' ? 'var(--accent-color)' : (app.status === 'Rejected' ? 'var(--danger-color)' : 'orange')}">${app.status}</span></p>
                `;
                trackerResultsDiv.appendChild(appDiv);
            });
            if (trackerResultsDiv.innerHTML === '') {
                 trackerResultsDiv.innerHTML = '<p>No applications found for this CNIC number.</p>';
            }
        } else {
            trackerResultsDiv.innerHTML = '<p>No applications found for this CNIC number.</p>';
        }
    } catch (error) {
        console.error("Error fetching applications:", error);
        trackerResultsDiv.innerHTML = '<p>Error searching for applications.</p>';
    }
});


// --- Analytics Logic ---
// Initialize analytics data if not present
async function initializeAnalytics() {
    const analyticsRef = database.ref('analytics');
    const snapshot = await analyticsRef.once('value');
    if (!snapshot.exists()) {
        await analyticsRef.set({
            views: 0,
            likes: 0,
            ratings: {
                total: 0,
                count: 0
            },
            feedback: {}
        });
    }
    loadAnalyticsData();
}

async function loadAnalyticsData() {
    const analyticsRef = database.ref('analytics');
    analyticsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            appViewsSpan.textContent = data.views || 0;
            appLikesSpan.textContent = data.likes || 0;
            updateRatingDisplay(data.ratings ? data.ratings.total : 0, data.ratings ? data.ratings.count : 0);
        }
    });
}

function incrementAppViews() {
    const analyticsRef = database.ref('analytics/views');
    analyticsRef.transaction((currentViews) => {
        return (currentViews || 0) + 1;
    });
}

likeBtn.addEventListener('click', async () => {
    const analyticsRef = database.ref('analytics/likes');
    analyticsRef.transaction((currentLikes) => {
        return (currentLikes || 0) + 1;
    });
    alert('Thanks for liking our app!');
});

ratingStarsDiv.addEventListener('click', async (e) => {
    if (e.target.classList.contains('star')) {
        const rating = parseInt(e.target.dataset.value);
        const analyticsRatingsRef = database.ref('analytics/ratings');

        analyticsRatingsRef.transaction((currentRatings) => {
            const newRatings = currentRatings || { total: 0, count: 0 };
            newRatings.total += rating;
            newRatings.count += 1;
            return newRatings;
        }, (error, committed, snapshot) => {
            if (error) {
                console.error("Rating update failed: ", error);
            } else if (committed) {
                const data = snapshot.val();
                updateRatingDisplay(data.total, data.count);
                alert(`You rated ${rating} stars!`);
            }
        });

        // Visually update stars
        document.querySelectorAll('.star').forEach(star => {
            if (parseInt(star.dataset.value) <= rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }
});

function updateRatingDisplay(total, count) {
    if (count > 0) {
        const averageRating = (total / count).toFixed(1);
        userRatingDisplay.textContent = `${averageRating} / 5 (${count} ratings)`;
    } else {
        userRatingDisplay.textContent = 'Not Rated Yet';
    }
}

submitFeedbackBtn.addEventListener('click', async () => {
    const feedback = feedbackTextarea.value.trim();
    if (!feedback) {
        alert("Please enter your feedback.");
        return;
    }
    if (!currentUser) {
        alert("Please login to submit feedback.");
        return;
    }

    try {
        const feedbackRef = database.ref('analytics/feedback').push();
        await feedbackRef.set({
            userId: currentUser.uid,
            username: currentUser.username,
            feedback: feedback,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        feedbackStatusDiv.textContent = "Feedback submitted successfully!";
        feedbackStatusDiv.style.color = 'var(--accent-color)';
        feedbackTextarea.value = '';
        setTimeout(() => feedbackStatusDiv.textContent = '', 3000);
    } catch (error) {
        console.error("Error submitting feedback:", error);
        feedbackStatusDiv.textContent = "Error submitting feedback.";
        feedbackStatusDiv.style.color = 'var(--danger-color)';
    }
});

// --- Admin Page Logic (INSECURE for production) ---
// This is a highly insecure implementation for demonstration purposes.
// A real admin panel would require proper authentication and server-side processing.

function loadAdminApplications() {
    if (!isAdminLoggedIn) {
        adminApplicationsDiv.innerHTML = '<p>You do not have administrative access.</p>';
        return;
    }

    const applicationsRef = database.ref('applications');
    // Using 'on' for real-time updates in admin panel
    applicationsRef.on('value', (snapshot) => {
        adminApplicationsDiv.innerHTML = ''; // Clear previous
        const applications = snapshot.val();
        if (applications) {
            // Convert to array and sort by timestamp (newest first)
            const sortedApplications = Object.keys(applications).map(key => ({
                id: key,
                ...applications[key]
            })).sort((a, b) => b.timestamp - a.timestamp);

            sortedApplications.forEach(app => {
                const appItem = document.createElement('div');
                appItem.classList.add('application-item');
                appItem.innerHTML = `
                    <h4>${app.username} - ${app.loanType}</h4>
                    <p>Email: ${app.email}</p>
                    <p>Mobile: ${app.mobileNumber || app.mobileNumber1}</p>
                    <p>CNIC: ${app.cnicNumber || 'N/A'}</p>
                    <p>Status: <span id="status-${app.id}" class="status-${app.status.toLowerCase()}">${app.status}</span></p>
                    <p>Submitted: ${new Date(app.timestamp).toLocaleString()}</p>
                    <h5>Documents:</h5>
                    <ul>
                        <li><a href="${app.cnicFrontUrl}" target="_blank" class="document-link">CNIC Front</a></li>
                        <li><a href="${app.cnicBackUrl}" target="_blank" class="document-link">CNIC Back</a></li>
                        ${app.applicantPicUrl ? `<li><a href="${app.applicantPicUrl}" target="_blank" class="document-link">Applicant Photo</a></li>` : ''}
                        ${app.relativeCnicFrontUrl ? `<li><a href="${app.relativeCnicFrontUrl}" target="_blank" class="document-link">Relative CNIC Front</a></li>` : ''}
                        ${app.plotRegistryUrl ? `<li><a href="${app.plotRegistryUrl}" target="_blank" class="document-link">Plot Registry</a></li>` : ''}
                    </ul>
                    <button class="approve-btn" data-id="${app.id}" ${app.status !== 'Pending' ? 'disabled' : ''}>Approve</button>
                    <button class="reject-btn" data-id="${app.id}" ${app.status !== 'Pending' ? 'disabled' : ''}>Reject</button>
                `;
                adminApplicationsDiv.appendChild(appItem);
            });

            // Attach event listeners after elements are in DOM
            document.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', (e) => updateApplicationStatus(e.target.dataset.id, 'Approved'));
            });
            document.querySelectorAll('.reject-btn').forEach(button => {
                button.addEventListener('click', (e) => updateApplicationStatus(e.target.dataset.id, 'Rejected'));
            });

        } else {
            adminApplicationsDiv.innerHTML = '<p>No applications have been submitted yet.</p>';
        }
    });
}

async function updateApplicationStatus(appId, status) {
    if (!isAdminLoggedIn) {
        alert("Permission denied.");
        return;
    }
    try {
        await database.ref(`applications/${appId}/status`).set(status);
        // The 'on' listener in loadAdminApplications will automatically update the UI
        showPopup(`Application ${appId} status updated to ${status}.`);
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update application status.");
    }
}


// --- Footer Navigation ---
navWelcome.addEventListener('click', () => {
    if (currentUser) {
        showPage(welcomePage);
        startImageSlider();
    } else {
        showPage(authPage);
    }
});
navEligibility.addEventListener('click', () => showPage(eligibilityPage));
navAnalytics.addEventListener('click', () => {
    showPage(analyticsPage);
    loadAnalyticsData(); // Reload data when navigating to analytics
});
navTracker.addEventListener('click', () => showPage(trackerPage));


// --- Initial App Load ---
document.addEventListener('DOMContentLoaded', () => {
    checkUserStatus();
    initializeAnalytics(); // Ensure analytics data is initialized
});
