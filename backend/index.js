import express, { text } from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChat.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to MONGODB");
  } catch (error) {
    console.log(error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
  publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;
  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    const userChats = await UserChats.find({ userId: userId });

    if (userChats.length === 0) { // Check if array is empty
      const newUserChats = new UserChats({
        userId: userId,
        chats: [{
          _id: savedChat._id,
          title: text.substring(0, 40),
        }],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }
    res.status(201).send(newChat._id);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Error creating chat!");
  }
});


app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId });

    if (userChats.length > 0) {
      res.status(200).send(userChats[0].chats);
    } else {
      res.status(404).send("No chats found for this user.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching user chats!");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res)=>{
  const userId = req.auth.userId;
  const {question, answer, img} = req.body;
  const newItems = [
    ...(question ? [{role:"user", parts: [{text:question}], ...(img && {img})}]:[]),
    {role:"model", parts:[{text:answer}]}
  ]
  try{
    const updatedChat = await Chat.updateOne({_id:req.params.id, userId},{
      $push:{
        history:{
          $each: newItems,
        },
      },
    })
    res.status(200).send(updatedChat);
  }catch(err){
    console.log(err);
    res.status(500).send("Error adding conversations!");
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

app.listen(port, () => {
  connect();
  console.log("server running on port 3000");
});