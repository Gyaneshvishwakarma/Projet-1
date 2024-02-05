import path from "path";
export const renderHeader = (req, res) => {
    // Your logic for rendering the header
    res.render('Patials/header', { user: req.session.user });
};

export const renderFooter = (req, res) => {
    // Your logic for rendering the footer
    res.render('Patials/footer', { user: req.session.user });
};

export const renderAbout = (req, res) => {
    res.render('about', { user: req.session.user });
};

export const renderHome = (req, res) => {
    res.render('home', { user: req.session.user });
};

export const renderContact = (req, res) => {
    res.render('contact', { user: req.session.user });
};

export const renderUserProfile = (req, res) => {
    res.render('UserProfile', { user: req.session.user });
};

export const renderGallery = (req, res) => {
    res.render('gallery', { user: req.session.user });
};

export const renderTraining = (req, res, trainings, selectedTraining) => {
    res.render('training', { trainings, selectedTraining,user: req.session.user });
};

export const renderLogin = (req, res) => {
    res.render('login', { user: req.session.user });
};

export const renderRegister = (req, res) => {
    res.render('register', { user: req.session.user });
};

export const renderRegisterSuccefully = (req, res) => {
    res.render('registrationSuccess', { user: req.session.user });
};

export const renderTrainingAdmin = (req, res, trainings, selectedTraining) => {
    res.render('trainingAdmin', { trainings, selectedTraining ,user: req.session.user });
};

export const renderTrainingDetail = (req, res) => {
    res.render('trainingDetail', { user: req.session.user });
};

export const renderUserPanel = (req, res, users) => {
    res.render('userPanel', { users, user: req.session.user });
};

export const renderFomulationBook = (req, res) => {
    res.render('formulationbook', { user: req.session.user });
};

export const renderBooks = (req, res, books, selectedBook) => {
    res.render('books', { books, selectedBook,user: req.session.user });
};

export const renderBooksAdmin = (req, res, books, selectedBook) => {
    res.render('booksAdmin', { books, selectedBook,user: req.session.user });
};


export const renderAdminHeader = (req, res) => {
    res.render('AdminHeader', { user: req.session.user });
};

export const renderAdminDashboard = (req, res) => {
    res.render('AdminDashboard', { user: req.session.user });
};

export const renderForbidden = (req, res) => {
    res.status(403).send("Forbidden: You do not have permission to access this page");
};