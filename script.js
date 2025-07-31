const firebaseConfig = {
    apiKey: "AIzaSyDoDPdqHhMslOkCha0MapGRyYRUdhUZbfM",
    authDomain: "papa-30f39.firebaseapp.com",
    projectId: "papa-30f39",
    databaseURL: "https://papa-30f39-default-rtdb.firebaseio.com/",
    storageBucket: "papa-30f39.appspot.com",
    messagingSenderId: "332748602419",
    appId: "1:332748602419:web:d6d49d51cd6ac25a847746"
};

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dtbftpnkq';
const CLOUDINARY_API_KEY = '543627576256858';
const CLOUDINARY_UPLOAD_PRESET = 'Lavaithan';
const CLOUDINARY_API_SECRET = 'wtkB1cxJypNvO3CguCb-NsGy7bk'; 

// Admin password
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
const aboutPage = document.getElementById('about-page');

// Admin related DOM elements
const hamburgerMenu = document.getElementById('hamburger-menu');
const sideNav = document.getElementById('side-nav');
const closeSideNav = document.getElementById('close-side-nav');
const sideNavAdmin = document.getElementById('side-nav-admin');
const sideNavAbout = document.getElementById('side-nav-about');
const sideNavLogout = document.getElementById('side-nav-logout');

const adminLoginPage = document.getElementById('admin-login-modal');
const adminPasswordInput = document.getElementById('admin-password-input');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginError = document.getElementById('admin-login-error');
const closeAdminModal = document.getElementById('close-admin-modal');

const adminPage = document.getElementById('admin-page');
const adminApplicationsDiv = document.getElementById('admin-applications');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

const navWelcome = document.getElementById('nav-welcome');
const navEligibility = document.getElementById('nav-eligibility');
const navAnalytics = document.getElementById('nav-analytics');
const navTracker = document.getElementById('nav-tracker');
const footerNav = document.getElementById('footer-nav');

// Loading and popup elements
const loadingOverlay = document.getElementById('loading-overlay');
const successPopup = document.getElementById('success-popup');
const popupMessage = document.getElementById('popup-message');
const closePopup = document.getElementById('close-popup');

let currentUser = null;
let isAdminLoggedIn = false;

// --- Utility Functions ---
function showPage(pageElement) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    pageElement.style.display = 'block';
    closeNav();
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showSuccessPopup(message) {
    popupMessage.textContent = message;
    successPopup.style.display = 'flex';
    setTimeout(() => {
        successPopup.style.display = 'none';
    }, 3000);
}

closePopup.addEventListener('click', () => {
    successPopup.style.display = 'none';
});

async function uploadImageToCloudinary(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);

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
        return null;
    }
}

// --- Side Navigation and Admin Logic ---
function openNav() {
    sideNav.style.width = "250px";
    if (currentUser || isAdminLoggedIn) {
        sideNavLogout.style.display = 'block';
    } else {
        sideNavLogout.style.display = 'none';
    }
}

function closeNav() {
    sideNav.style.width = "0";
}

hamburgerMenu.addEventListener('click', openNav);
closeSideNav.addEventListener('click', closeNav);

sideNavAdmin.addEventListener('click', () => {
    closeNav();
    adminLoginPage.style.display = 'flex';
    adminPasswordInput.value = '';
    adminLoginError.style.display = 'none';
    setTimeout(() => adminLoginPage.classList.add('show'), 10);
});

sideNavAbout.addEventListener('click', () => {
    closeNav();
    showPage(aboutPage);
});

closeAdminModal.addEventListener('click', () => {
    adminLoginPage.classList.remove('show');
    setTimeout(() => adminLoginPage.style.display = 'none', 300);
});

adminLoginBtn.addEventListener('click', () => {
    const enteredPassword = adminPasswordInput.value;
    if (enteredPassword === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        localStorage.setItem('isAdminLoggedIn', 'true');
        adminLoginPage.classList.remove('show');
        setTimeout(() => adminLoginPage.style.display = 'none', 300);
        showPage(adminPage);
        loadAdminApplications();
        footerNav.style.display = 'none'; // Hide footer for admin
    } else {
        adminLoginError.textContent = 'Incorrect password.';
        adminLoginError.style.display = 'block';
    }
});

adminLogoutBtn.addEventListener('click', () => {
    isAdminLoggedIn = false;
    localStorage.removeItem('isAdminLoggedIn');
    showSuccessPopup('Admin logged out.');
    checkUserStatus();
});

sideNavLogout.addEventListener('click', () => {
    if (isAdminLoggedIn) {
        adminLogoutBtn.click();
    } else if (currentUser) {
        navLogoutUser();
    }
    closeNav();
});

// --- User Authentication Logic ---
function checkUserStatus() {
    const storedUser = localStorage.getItem('currentUser');
    const storedAdminStatus = localStorage.getItem('isAdminLoggedIn');

    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');

    if (storedAdminStatus === 'true') {
        isAdminLoggedIn = true;
        showPage(adminPage);
        loadAdminApplications();
        sideNavAdmin.style.display = 'none';
        sideNavLogout.style.display = 'block';
        footerNav.style.display = 'none'; // Hide footer for admin
        return;
    }

    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showPage(welcomePage);
        startImageSlider();
        incrementAppViews();
        sideNavAdmin.style.display = 'block';
        sideNavLogout.style.display = 'block';
        footerNav.style.display = 'flex'; // Show footer for logged in users
    } else {
        currentUser = null;
        isAdminLoggedIn = false;
        showPage(authPage);
        showRegisterSection();
        sideNavAdmin.style.display = 'block';
        sideNavLogout.style.display = 'none';
        footerNav.style.display = 'none'; // Hide footer for non-logged in users
    }
}

function navLogoutUser() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showSuccessPopup('Logged out successfully.');
    checkUserStatus();
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
        showSuccessPopup("Please fill in all registration fields.");
        return;
    }

    showLoading();
    try {
        const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
        if (snapshot.exists()) {
            showSuccessPopup("This email is already registered. Please login or use a different email.");
            hideLoading();
            return;
        }

        const userRef = database.ref('users').push();
        await userRef.set({
            username: username,
            email: email,
            password: password
        });
        
        showSuccessPopup("Registration successful! Please login.");
        registerUsernameInput.value = '';
        registerEmailInput.value = '';
        registerPasswordInput.value = '';
        showLoginSection();
    } catch (error) {
        console.error("Registration error:", error);
        showSuccessPopup("Registration failed. Please try again.");
    } finally {
        hideLoading();
    }
});

loginBtn.addEventListener('click', async () => {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (!email || !password) {
        showSuccessPopup("Please enter both email and password.");
        return;
    }

    showLoading();
    try {
        const usersRef = database.ref('users');
        const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
        const userData = snapshot.val();

        if (userData) {
            const userId = Object.keys(userData)[0];
            const user = userData[userId];

            if (user.password === password) {
                currentUser = { uid: userId, username: user.username, email: user.email };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loginEmailInput.value = '';
                loginPasswordInput.value = '';
                checkUserStatus();
            } else {
                showSuccessPopup("Incorrect password.");
            }
        } else {
            showSuccessPopup("User not found. Please register.");
        }
    } catch (error) {
        console.error("Login error:", error);
        showSuccessPopup("Login failed. Please try again.");
    } finally {
        hideLoading();
    }
});

showLoginLink.addEventListener('click', showLoginSection);
showRegisterLink.addEventListener('click', showRegisterSection);

// --- Welcome Page Slider ---
const sliderImages = [
    'download.webp',
    'happy.webp'
];
let currentImageIndex = 0;
let sliderInterval;

function startImageSlider() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
        sliderImage.style.opacity = 0;
        setTimeout(() => {
            sliderImage.src = sliderImages[currentImageIndex];
            sliderImage.style.opacity = 1;
        }, 1000);
    }, 5000);
}

// --- Loan Application Logic ---
youthBusinessLoanCard.addEventListener('click', () => {
    if (!currentUser) {
        showSuccessPopup("Please login to apply for a loan.");
        showPage(authPage);
        return;
    }
    showPage(youthLoanPage);
});

apnaGharApniChatLoanCard.addEventListener('click', () => {
    if (!currentUser) {
        showSuccessPopup("Please login to apply for a loan.");
        showPage(authPage);
        return;
    }
    showPage(gharLoanPage);
});

youthLoanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        showSuccessPopup("Session expired. Please login to apply for a loan.");
        showPage(authPage);
        return;
    }

    showLoading();
    
    try {
        const cnicFrontFile = youthCnicFrontInput.files[0];
        const cnicBackFile = youthCnicBackInput.files[0];
        const applicantPicFile = youthApplicantPicInput.files[0];

        // First store text data
        const applicationData = {
            userId: currentUser.uid,
            username: currentUser.username,
            email: currentUser.email,
            loanType: 'Youth Business Loan',
            education: youthEducationInput.value.trim(),
            work: youthWorkInput.value.trim(),
            mobileNumber: youthMobileInput.value.trim(),
            cnicNumber: youthCnicNumberInput.value.trim(),
            status: 'Pending',
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            cnicFrontUrl: 'uploading',
            cnicBackUrl: 'uploading',
            applicantPicUrl: 'uploading'
        };

        const newApplicationRef = database.ref('applications').push();
        await newApplicationRef.set(applicationData);

        // Upload images
        const [cnicFrontUrl, cnicBackUrl, applicantPicUrl] = await Promise.all([
            uploadImageToCloudinary(cnicFrontFile),
            uploadImageToCloudinary(cnicBackFile),
            uploadImageToCloudinary(applicantPicFile)
        ]);

        // Update with image URLs
        await newApplicationRef.update({
            cnicFrontUrl: cnicFrontUrl || 'failed',
            cnicBackUrl: cnicBackUrl || 'failed',
            applicantPicUrl: applicantPicUrl || 'failed'
        });

        showSuccessPopup("Youth Business Loan application submitted successfully!");
        youthLoanForm.reset();
        showPage(welcomePage);
    } catch (error) {
        console.error("Error submitting youth loan application:", error);
        showSuccessPopup("Error submitting application. Please try again.");
    } finally {
        hideLoading();
    }
});

gharLoanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        showSuccessPopup("Session expired. Please login to apply for a loan.");
        showPage(authPage);
        return;
    }

    showLoading();
    
    try {
        const cnicFrontFile = gharCnicFrontInput.files[0];
        const cnicBackFile = gharCnicBackInput.files[0];
        const relativeCnicFrontFile = gharRelativeCnicFrontInput.files[0];
        const plotRegistryFile = gharPlotRegistryInput.files[0];

        // First store text data
        const applicationData = {
            userId: currentUser.uid,
            username: currentUser.username,
            email: currentUser.email,
            loanType: 'Apna Ghar Apni Chat Loan',
            mobileNumber1: gharMobile1Input.value.trim(),
            mobileNumber2: gharMobile2Input.value.trim(),
            cnicNumber: gharCnicNumberInput.value.trim(),
            status: 'Pending',
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            cnicFrontUrl: 'uploading',
            cnicBackUrl: 'uploading',
            relativeCnicFrontUrl: 'uploading',
            plotRegistryUrl: 'uploading'
        };

        const newApplicationRef = database.ref('applications').push();
        await newApplicationRef.set(applicationData);

        // Upload images
        const [cnicFrontUrl, cnicBackUrl, relativeCnicFrontUrl, plotRegistryUrl] = await Promise.all([
            uploadImageToCloudinary(cnicFrontFile),
            uploadImageToCloudinary(cnicBackFile),
            uploadImageToCloudinary(relativeCnicFrontFile),
            uploadImageToCloudinary(plotRegistryFile)
        ]);

        // Update with image URLs
        await newApplicationRef.update({
            cnicFrontUrl: cnicFrontUrl || 'failed',
            cnicBackUrl: cnicBackUrl || 'failed',
            relativeCnicFrontUrl: relativeCnicFrontUrl || 'failed',
            plotRegistryUrl: plotRegistryUrl || 'failed'
        });

        showSuccessPopup("Apna Ghar Apni Chat Loan application submitted successfully!");
        gharLoanForm.reset();
        showPage(welcomePage);
    } catch (error) {
        console.error("Error submitting ghar loan application:", error);
        showSuccessPopup("Error submitting application. Please try again.");
    } finally {
        hideLoading();
    }
});

// --- Application Tracker Logic ---
trackerSearchBtn.addEventListener('click', async () => {
    const cnic = trackerCnicInput.value.trim();
    if (!cnic) {
        showSuccessPopup("Please enter your CNIC number to track your application.");
        return;
    }

    showLoading();
    trackerResultsDiv.innerHTML = '<p>Searching...</p>';

    try {
        const snapshot = await database.ref('applications').orderByChild('cnicNumber').equalTo(cnic).once('value');
        const applications = snapshot.val();
        trackerResultsDiv.innerHTML = '';

        if (applications) {
            Object.keys(applications).forEach(appId => {
                const app = applications[appId];
                const appDiv = document.createElement('div');
                appDiv.classList.add('application-result');
                appDiv.innerHTML = `
                    <h4>Applicant: ${app.username}</h4>
                    <p><strong>Loan Type:</strong> ${app.loanType}</p>
                    <p><strong>Mobile:</strong> ${app.mobileNumber || app.mobileNumber1}</p>
                    <p><strong>CNIC:</strong> ${app.cnicNumber}</p>
                    <p><strong>Status:</strong> <span class="status-${app.status.toLowerCase()}">${app.status}</span></p>
                    <p><strong>Submitted:</strong> ${new Date(app.timestamp).toLocaleString()}</p>
                `;
                trackerResultsDiv.appendChild(appDiv);
            });
        } else {
            trackerResultsDiv.innerHTML = '<p>No applications found for this CNIC number.</p>';
        }
    } catch (error) {
        console.error("Error fetching applications:", error);
        trackerResultsDiv.innerHTML = '<p>Error searching for applications.</p>';
    } finally {
        hideLoading();
    }
});

// --- Analytics Logic ---
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

function loadAnalyticsData() {
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
    showSuccessPopup('Thanks for liking our app!');
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
                showSuccessPopup(`You rated ${rating} stars!`);
            }
        });

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
        showSuccessPopup("Please enter your feedback.");
        return;
    }
    if (!currentUser) {
        showSuccessPopup("Please login to submit feedback.");
        return;
    }

    showLoading();
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
    } finally {
        hideLoading();
    }
});

// --- Admin Page Logic ---
function loadAdminApplications() {
    if (!isAdminLoggedIn) {
        adminApplicationsDiv.innerHTML = '<p>You do not have administrative access.</p>';
        return;
    }

    const applicationsRef = database.ref('applications');
    applicationsRef.on('value', (snapshot) => {
        adminApplicationsDiv.innerHTML = '';
        const applications = snapshot.val();
        if (applications) {
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
        showSuccessPopup("Permission denied.");
        return;
    }
    showLoading();
    try {
        await database.ref(`applications/${appId}/status`).set(status);
        showSuccessPopup(`Application status updated to ${status}.`);
    } catch (error) {
        console.error("Error updating status:", error);
        showSuccessPopup("Failed to update application status.");
    } finally {
        hideLoading();
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
    loadAnalyticsData();
});
navTracker.addEventListener('click', () => showPage(trackerPage));

// --- Initial App Load ---
document.addEventListener('DOMContentLoaded', () => {
    checkUserStatus();
    initializeAnalytics();
});
