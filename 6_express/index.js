import express from "express";
import path from "path";
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;

app.use(express.static("public"));
// Define __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/blog/:slug", (req, res) => {
  // http://localhost:3000/blog/python?mode=dark
  console.log(req);
  console.log(req.params);
  console.log(req.query);

  res.send(`Blog post ${req.params.slug}`);
});

app.get("/index", (req, res) => {        
  res.sendFile('templates/index.html', { root: __dirname });
  // res.send("Hello World")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
