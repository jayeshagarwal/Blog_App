const bodyParser = require("body-parser"),
mongoose = require("mongoose"),
sanitizer = require("express-sanitizer"),
express = require("express"),
app = express();

mongoose.connect("mongodb://localhost/blog_app");

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    created: {type: Date, default: Date.now}
});
const blog = mongoose.model("blog", blogSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(sanitizer());
app.set("view engine", "ejs");

app.get("/", (req,res)=> {
    res.redirect("/blogs");
});

app.get("/blogs", (req,res)=> {
    blog.find({}, (err, foundBlogs)=> {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {blogs: foundBlogs});
        }
    });
});

app.get("/blogs/new", (req,res)=> {
    res.render("new");
})

app.post("/blogs", (req,res)=> {
    req.body.content = req.sanitize(req.body.content);
    blog.create(req.body, (err,newBlog)=> {
        if(err)
        {
            res.redirect("/blogs/new");
        }
        else
        {
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs/:id", (req,res)=> {
    blog.findById(req.params.id, (err,foundBlog)=>{
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show", {blog: foundBlog})
        }
    });
})

app.get("/blogs/:id/edit", (req,res)=> {
    blog.findById(req.params.id, (err,foundBlog)=>{
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit", {blog: foundBlog})
        }
    });
})

app.post("/blogs/:id", (req,res)=> {
    blog.findByIdAndUpdate(req.params.id, req.body, (err,updateBlog)=> {
        if(err)
        {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

app.get("/blogs/:id/delete", (req,res)=> {
    blog.findByIdAndDelete(req.params.id, (err)=> {
        if(err)
        {
            res.redirect("/blogs/:id");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

app.listen("3000", ()=> {
    console.log("server started");
})