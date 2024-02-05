import { dirname } from "path";
import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { fileURLToPath } from "url";
import router from "./routes/routes.js";
import conn from "./config/db.js";

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

const PORT = process.env.PORT || 8080 ;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
