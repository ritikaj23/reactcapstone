const express = require('express');
const cors = require('cors');
const http = require('http');
const connectToMongo = require('./db');
const app = express();
let multer=require('multer')

app.set('view engine','ejs')
app.use(express.static('public'))

const PORT = process.env.PORT || 8181;
const doctorsDetail=require('./models/doctors')


// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectToMongo();

// Routes
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/doctors',async(req,res)=>{
  try{
      const getDoctors=await doctorsDetail.find({});
      res.send(getDoctors)
  }catch(e){
      console.log(e);
  }
})
app.get('/doctorimage',(req,res)=>{
  res.render('index')
})

let storage=multer.diskStorage({
  destination:'./public/doctor_images',
  filename:(req,file,cb)=>{
      cb(null,Date.now()+file.originalname)
  }
})

//upload setting
let upload=multer({
  storage:storage,
  fileFilter:(req,file,cb)=>{
      if(
          file.mimetype=='image/jpg' ||
          file.mimetype=='image/jpeg' ||
          file.mimetype=='image/gif' ||
          file.mimetype=='image/png'
      ){
          cb(null,true);
          
      }
      else{
          cb(null,false)
          cb(new Error('Only jpg,jpeg,png and gif is allowed'))
      }
  }
})
app.post('/multiplepost',upload.array('multiple_post',3),(req,res)=>{
  req.files.forEach((image)=>{
    doctorsDetail.create({profilePic:image.filename})
      .then((x)=>{
          // console.log(x);
          res.redirect('/view')
      })
      .catch(()=>{
          console.log('error');
          // res.send('Error')
      })
  })
 

})
  // Start the server
app.listen(PORT, () => {
console.log(`Server is running on port http://localhost:${PORT}`);
});
