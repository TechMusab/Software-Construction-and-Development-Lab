const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./model");
require('dotenv').config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err));

async function seedAdminUser() {
  try {
    const adminUser = await User.findOne({ username: "admin" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const newUser = new User({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });
      await newUser.save();
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin user already exists!");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seedAdminUser();

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).send({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.send({ token });
});

app.listen(3004, () => console.log("Auth Service running on port 3004"));
