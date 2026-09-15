const express = require('express');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;

// Middleware configuration
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Allows reading form submissions
app.use(express.static('public')); // Serves CSS files
app.use(methodOverride('_method')); // Allows HTML forms to safely mimic PUT/DELETE actions

// Temporary in-memory array (Data does not persist between server restarts)
let posts = [
    {
        id: "1",
        title: "Welcome to My Blog",
        author: "Alex Mercer",
        content: "This is a sample blog post built with Node.js, Express, and EJS. Data is safely managed in an array on the server side!",
        category: "Tech",
        createdAt: new Date().toLocaleString()
    }
];

// ROUTES

// 1. READ ALL POSTS (With optional category filter)
app.get('/', (req, res) => {
    const selectedCategory = req.query.category;
    let filteredPosts = posts;

    if (selectedCategory && selectedCategory !== 'All') {
        filteredPosts = posts.filter(post => post.category === selectedCategory);
    }

    res.render('index', { posts: filteredPosts, currentCategory: selectedCategory || 'All' });
});

// 2. CREATE A NEW POST
app.post('/posts', (req, res) => {
    const { title, author, content, category } = req.body;
    
    const newPost = {
        id: Date.now().toString(), // Generates a unique string ID
        title,
        author,
        content,
        category,
        createdAt: new Date().toLocaleString() // Uses JavaScript Date Object
    };

    posts.push(newPost);
    res.redirect('/');
});

// 3. SHOW EDIT FORM
app.get('/edit/:id', (req, res) => {
    const postToEdit = posts.find(p => p.id === req.params.id);
    if (!postToEdit) {
        return res.redirect('/');
    }
    res.render('edit', { post: postToEdit });
});

// 4. UPDATE EXISTING POST
app.put('/edit/:id', (req, res) => {
    const { title, author, content, category } = req.body;
    const postIndex = posts.findIndex(p => p.id === req.params.id);

    if (postIndex !== -1) {
        // Keeps original ID and creation time, updates text data
        posts[postIndex] = {
            ...posts[postIndex],
            title,
            author,
            content,
            category
        };
    }
    res.redirect('/');
});

// 5. DELETE A POST
app.delete('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id);
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});