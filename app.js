const createError = require("http-errors");
const express = require("express");
const path = require("path");
const lessMiddleware = require("less-middleware");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("view engine", "pug");

// don't use less middleware in Vercel Production
if (process.env.VERCEL_ENV !== "production") {
  app.use(lessMiddleware(path.join(__dirname, "public"), { debug: true }));
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", usersRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status;

  // res.locals.error = req.app.get("env") === "bdevelopment" ? err : { };

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
