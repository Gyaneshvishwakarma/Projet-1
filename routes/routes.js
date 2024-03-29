// routes.js
import express from 'express';
import * as controllers from "../controllers/controllers.js";
import conn from "../config/db.js";
import multer from 'multer';

// const app = express();
const router = express.Router();
// app.use(express.static("public"));

const isAdmin = (req, res, next) => {
    // Assuming you have a session or token-based authentication
    const user = req.session.user; // Replace with your authentication method

    if (user && user.role === 'admin') {
        // User is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authorized, redirect to login or show an unauthorized message
        res.status(403).send('Access forbidden, Please Login With Admin Id Password');
    }
};

const isUser = (req, res, next) => {
    // Assuming you have a session or token-based authentication
    const user = req.session.user; // Replace with your authentication method

    if (user && user.role === 'user') {
        // User is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authorized, redirect to login or show an unauthorized message
        res.redirect('login')
    }
};

// multer code

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/booksimg'); // specify your upload directory for books
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get('/header', controllers.renderHeader);
router.get('/footer', controllers.renderFooter);
router.get('/home', controllers.renderHome);
router.get('/about', controllers.renderAbout);
router.get('/books', isUser,controllers.renderBooks);
router.get('/formulationbook',controllers.renderFomulationBook);
router.get('/bookingData',controllers.renderBookingData);
router.get('/trainingDetail', controllers.renderTrainingDetail);
router.get('/contact', controllers.renderContact);
router.get('/userProfile', controllers.renderUserProfile);
router.get('/gallery', controllers.renderGallery);
router.get('/training', controllers.renderTraining);
router.get('/login', controllers.renderLogin);
router.get('/register', controllers.renderRegister);
router.get('/registrationSuccess', controllers.renderRegisterSuccefully);
router.get('/booking', controllers.renderBookingForm);
router.get('/invoice', controllers.renderInvoice);
// Use the modified renderAdminHeader function
router.get("/AdminHeader", isAdmin,
    controllers.renderAdminHeader
);


router.get('/AdminDashboard', controllers.renderAdminDashboard);

router.get('/training', (req, res) => {
    conn.query('SELECT * FROM training', (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).send('Internal Server Error');
        } else {
            controllers.renderTraining(req, res, results);
        }
    });
});


router.get('/booksAdmin',isAdmin, (req, res) => {
    const selectedBookId = req.query.bookId || null;
    const query = 'SELECT * FROM books';

    conn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).send('Internal Server Error');
        } else {
            const selectedBook = results.find(book => book.id == selectedBookId);
            res.render('booksAdmin', { books: results, selectedBook ,user: req.session.user });
        }
    });
});

router.post('/booksAdmin/delete/:id',isAdmin, (req, res) => {
    const bookId = req.params.id;
    const query = 'DELETE FROM books WHERE id=?';
    conn.query(query, [bookId], (err) => {
        if (err) throw err;
        res.redirect('/booksAdmin');
    });
});

router.post('/booksAdmin/update/:id', upload.single('bookImage'), isAdmin, (req, res) => {
    const bookId = req.params.id;
    const { name, description, price } = req.body;
    const imgFilename = req.file.filename;

    const query = 'UPDATE books SET name=?, description=?, price=?, imgFilename=? WHERE id=?';
    conn.query(query, [name, description, price, imgFilename, bookId], (err) => {
        if (err) throw err;
        res.redirect('/booksAdmin');
    });
});


router.post('/books', upload.single('bookImage'),(req, res) => {
    const { name, description, price } = req.body;
    const imgFilename = req.file.filename;
    const query = 'INSERT INTO books (name, description, price, imgFilename) VALUES (?, ?, ?, ?)';
    conn.query(query, [name, description, price, imgFilename], (err, results) => {
        if (err) throw err;
        res.redirect('/booksAdmin');
    });
});



router.get('/books', (req, res) => {
    conn.query('SELECT * FROM books', (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).send('Internal Server Error');
        } else {
            controllers.renderBooks(req, res, results);
        }
    });
});


router.get('/trainingAdmin', isAdmin,(req, res) => {
    conn.query('SELECT * FROM training', (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).send('Internal Server Error');
        } else {
            controllers.renderTrainingAdmin(req, res, results);
        }
    });
});

router.post('/training', (req, res) => {
    const { name, description, duration, date ,price } = req.body;
    const query = 'INSERT INTO training (name, description,duration,date, price) VALUES (?, ?, ?, ?, ?)';
    conn.query(query, [name, description, duration,date,price], (err, result) => {
        if (err) throw err;
        res.redirect('/trainingAdmin');
    });
});

router.post('/trainingAdmin/update/:id', (req, res) => {
    const trainingId = req.params.id;
    const { name, description, duration, date, price } = req.body;
    const query = 'UPDATE training SET name=?, description=?, duration=?, date=?, price=? WHERE id=?';

    conn.query(query, [name, description, duration, date, price, trainingId], (err, results) => {
        if (err) throw err;

        const selectedTraining = results.find(training => training.id == trainingId);
        res.redirect('/trainingAdmin', { trainings: results, selectedTraining, user: req.session.user });
    });
});


router.post('/trainingAdmin/delete/:id', (req, res) => {
    const trainingId = req.params.id;
    const query = 'DELETE FROM training WHERE id=?';
    conn.query(query, [trainingId], (err) => {
        if (err) throw err;
        res.redirect('/trainingAdmin');
    });
});

router.get('/trainingsAdmin',isAdmin, (req, res) => {
    const selectedTrainingId = req.query.trainingId || null;
    const query = 'SELECT * FROM training';

    conn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).send('Internal Server Error');
        } else {
            const selectedTraining = results.find(training => training.id == selectedTrainingId);
            res.render('trainingAdmin', { trainings: results, selectedTraining ,  user: req.session.user });
        }
    });
});



router.get('/userpanel',isAdmin, (req, res) => {
    conn.query('SELECT * FROM register', (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).send('Internal Server Error');
        } else {
            controllers.renderUserPanel(req, res, results);
        }
    });
});

export default router;
