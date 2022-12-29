const express=require('express');
const app = express();
const cors = require('cors');
const port =process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt=require('jsonwebtoken')
require('dotenv').config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.01makvu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)





    const userCollection = client.db("OnClub").collection("userCollection");
    const postCollection=client.db("OnClub").collection("postCollection");
    const profileCollection=client.db("OnClub").collection("profileCollection");
    

    app.post('/users',async(req,res)=>{
        const user=req.body;
        const result=await userCollection.insertOne(user);
        res.send(result);

    })

    app.post('/posts',async(req,res)=>{
        const post=req.body;
        const result=await postCollection.insertOne(post);
        console.log(result)
        res.send(result);
    })

    app.get('/allPost',async(req,res)=>{
        const query={};
        const cursor=postCollection.find(query);
        const allPost=await cursor.sort({_id:-1}).toArray();
        res.send(allPost);
      })
    app.get('/allPostHome',async(req,res)=>{
        const query={};
        const cursor=postCollection.find(query);
        const allPost=await cursor.sort({like:-1}).limit(3).toArray();
        res.send(allPost);
      })

      app.get('/postDetails/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await postCollection.findOne(query);
        res.send(result);
      })


      
      app.put('/addLike/:id',async(req,res)=>{
        const id=req.params.id;
        const status=req.body;
        const query={_id:ObjectId(id)}
        const updateLike={
          $set:status
        }
        const result = await postCollection.updateOne(query,updateLike);
        res.send(result);
      })

      app.put('/addComment/:id',async(req,res)=>{
        const id=req.params.id;
        const status=req.body;
        console.log(status)
        const query={_id:ObjectId(id)}
        const addComment={
          $set:[
            {comments:status}
          ]
            
          
        }
        const result = await postCollection.updateOne(query,addComment);
        res.send(result);
      })

      


      app.get('/profile',async(req,res)=>{
        let query={};
        if(req.query.email){
          query={
            email:req.query.email
          }
        }
        const cursor=userCollection.find(query);
        const result=await cursor.toArray();
        res.send(result);
      })

      app.put('/updateInfo/:id',async(req,res)=>{
        const id=req.params.id;
        const status=req.body;
        const query={_id:ObjectId(id)}
        const updateProfile={
          $set:status
        }
        
        const result = await userCollection.updateOne(query,updateProfile);
        res.send(result);
      })




 app.listen(port, () => {
     console.log(` port ${port}`)
   })