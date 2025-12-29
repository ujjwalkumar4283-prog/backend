import app from './app.js'
import dotenv from 'dotenv'
import dbConnect from './db/index.js'
dotenv.config()


const port=process.env.PORT ||8000
dbConnect()
.then(()=>{
  console.log("db connect hua");
  app.listen(port, () => {
  console.log(`server is listening at port ${port}`)
})
})
.catch((err)=>{
  console.log(err)
  process.exit();
})


