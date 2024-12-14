require("dotenv").config();
const express = require("express");
const path = require("path");
const publicRoutes = require("./routes/publicRoutes");
const privateRoutes = require("./routes/privateRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(
    "/bootstrap",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", publicRoutes);
app.use("/api", privateRoutes);


app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});