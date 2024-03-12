import { dirname } from "path";
import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { fileURLToPath } from "url";
import router from "./routes/routes.js";
import conn from "./config/db.js";
// import stripePackage from 'stripe';

const __dirname = dirname (fileURLToPath(import.meta.url));
console.log(__dirname);
const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set('view engine', 'ejs');


app.use(session({
    secret: 'myselfgyaneshandhereismysecretekeyisgyan',
    resave: true,
    saveUninitialized: true,
}));


app.use('/', router);


app.get("/",(req,res)=> {
    res.sendFile(__dirname + "/public/index.html")
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    conn.query("SELECT * FROM register WHERE email = ?", [email], function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
            // Compare the entered password with the stored hash
            bcrypt.compare(password, results[0].password, function (err, result) {
                if (err) throw err;

                if (result) {
                    const user = {
                        id: results[0].id,
                        name: results[0].name,
                        email: results[0].email,
                        role: results[0].role,
                    };

                    req.session.user = user;

                    if (user.role === 'admin') {
                        // If the user is an admin, redirect to the admin panel
                        res.redirect("/AdminHeader");
                    } else {
                        // For regular users, redirect to the home page or user panel
                        res.redirect("/home");
                    }
                } else {
                    res.send("Login unsuccessful");
                }
                res.end();
            });
        } else {
            res.send("Login unsuccessful");
            res.end();
        }
    });
});


app.post('/register', function (req, res) {
   
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    bcrypt.hash(password, 10, function (err, hash) {
        if (err) throw err;

        var sql = "INSERT INTO register (name, email, password) VALUES (?, ?, ?)";
        conn.query(sql, [name, email, hash], function (error, result) {
            if (error) throw error;

            res.render('registrationSuccess', { name, user: req.session.user });
        });
    });
});

//paymetn gateway

// const stripe = stripePackage('sk_test_51Oe9OjSDVzR5g1RwEr6MJZLY00OdOZhbc4aYOaroDNVywHqzAB8X1yJueGAkrfipoav0GBs1e9k6vJ7srisZtxsc00yUwVRtBn');
// const YOUR_DOMAIN = 'http://localhost:8080';

// app.post('/create-checkout-session', async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//           price: 'price_1Oefw4SDVzR5g1RwnnNzTiZy',
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${YOUR_DOMAIN}/success`,
//       cancel_url: `${YOUR_DOMAIN}/cancel`,
//     });
  
//     res.redirect(303, session.url);
//   });



// // Route for success page
// app.get('/success', (req, res) => {
//     // Retrieve session ID from query parameter
//     const sessionId = req.query.session_id;
//     // Render success page with session ID
//     res.render('success', { sessionId , user: req.session.user});
// });

// // Route for cancel page
// app.get('/cancel', (req, res) => {
//     res.render('cancel');
// });


// training book system code 
// Route for booking a training seat
app.post('/bookings', (req, res) => {
    const { name, email, contact, address, training_mode } = req.body;
    // Query to fetch the count of bookings
    const COUNT_BOOKINGS_QUERY = `SELECT COUNT(*) as count FROM bookings`;
    conn.query(COUNT_BOOKINGS_QUERY, (err, result) => {
        if (err) {
            res.status(500).send('Error booking seat');
            throw err;
        }
        // Extract the count from the result
        const seat_no = result[0].count + 1; // Next available seat number
        const INSERT_BOOKING_QUERY = `INSERT INTO bookings (name, email, contact, address, seat_no, training_mode) VALUES (?, ?, ?, ?, ?, ?)`;
        conn.query(INSERT_BOOKING_QUERY, [name, email, contact, address, seat_no, training_mode], (err, result) => {
            if (err) {
                res.status(500).send('Error booking seat');
                throw err;
            }
            res.status(200).send('Seat Book Successfully');
        });
    });
});

// Route for fetching all bookings (for admin panel)
app.get('/bookinglist', (req, res) => {
    // Query to fetch bookings from database
    const query = "SELECT * FROM bookings";

    // Execute query
    conn.query(query, (err, rows) => {
        if (err) {
            throw err;
        }
        // Render bookings_list EJS template and pass bookings data to it
        res.render('booking_list', { bookings: rows , user: req.session.user});
    });
});


// port
const PORT = process.env.PORT || 8080 ;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
