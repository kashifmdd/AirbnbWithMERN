const express = require('express');
const app = express();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(cookieParser("secretcode"));{{
const sessionOption = session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: true
});


app.use(sessionOption);
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user not registered");
    }else{
        req.flash('success', 'user registered successfully!' );
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
});



// app.get("/test", (req, res) => {
//     res.send("session set successfully");
// });

// app.get("/reqcount", (req, res) => {
//     if (req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you have visited this page ${req.session.count}times`);
// });

// // signed cookies
// app.get("/getsignedcookies", (req, res) => {
//     res.cookie("made in", "india", { signed: true });
//     res.send("signed cookies set");
// });



// // send cookies
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hlo");
//     // res.cookie("made in", "india");
//     res.send("cookies set");
// });

// app.get("/greet", (req, res) => {
//     let { name = "anonymous" } = req.cookies;
//     res.send(`Hello ${name}`);
// });


// app.get("/", (req, res) => {
//     console.log(req.cookies);
//     res.send("Hello World");
// });

// app.use("/posts", postRoutes);
// app.use("/users", userRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});