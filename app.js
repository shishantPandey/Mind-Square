const express =  require('express');
const app = express();
const userModels = require("./models/user");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const path = require('path')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require("fs")



app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = file.originalname
      cb(null,  uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })
app.get("/",isLoggedIn , async(req,res)=>{
    let user = await userModels.findOne({email : req.user.email});
        res.render('index', {user});
    
     
})
app.get("/register.ejs",(req,res)=>{
    // res.send("hello world")
    res.render('register');

})
app.get("/upload.ejs",(req,res)=>{
    // res.send("hello world")
    res.render('upload');

})

app.get("/login.ejs",(req,res)=>{
    // res.send("hello world")
    res.render('login');

})
app.get("/content.ejs",(req,res)=>{
    // res.send("hello world")
  
  
        const uploadsDir = path.join(__dirname, 'public', 'uploads');
    
        // Read the directory
        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return res.status(500).send('Unable to read files');
            }
    
            // Send the list of files to the EJS template
            res.render('content', { files });
        });
    

})

    
app.post("/upload" ,upload.single('file'), (req,res)=>{
    res.redirect("content.ejs");
})

app.post("/register", async(req,res) => {

 let {email,password,username} = req.body;
 let user  = await userModels.findOne({email});
 if(user) return res.status(500).send("user already  registered");
bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
      let user = await  userModels.create({
            username,
            email,
            password: hash
        });
       let token =  jwt.sign({email: email, username: username},"shhhh")
      // Setting a cookie that persists for 7 days
res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

       res.redirect("/")
    })
})

});
app.post('/login',async(req,res)=>{
    let {email,password} = req.body;
    let user  = await userModels.findOne({email});
 if(!user) return res.status(500).send("user not   registered");
 bcrypt.compare(password,user.password,function(err,result){
    if(result){
if (user.password=="$2b$10$GBrfz38TebJSD25eiv.Tfewd53ZOqg40RRwxQXqJL0ChFCFv71Eie") {
    console.log("admin login")
    let token =  jwt.sign({email: email, username: user.username},"shhhh")
// Setting a cookie that persists for 7 days
res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).redirect("/");
    
}else{

    let token =  jwt.sign({email: email, username: user.username},"shhhh")
 // Setting a cookie that persists for 7 days
res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).redirect("/");
}
    } 
    else res.redirect("/signup.ejs")
 })
})
app.get("/logout", (req,res)=>{
    res.clearCookie("token")
    res.redirect("/")
})
function isLoggedIn(req,res,next){
    const token = req.cookies.token;
  if (!token) {
    return res.status(401).render('index');
  }
    else{
        let data = jwt.verify(req.cookies.token,"shhhh");
        req.user = data;
    }
    next();
}
app.listen(3000)