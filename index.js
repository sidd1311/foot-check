// // const express = require("express");
// // const TeachableMachine = require("@sashido/teachablemachine-node");

// // const model = new TeachableMachine({
// //     modelUrl: "https://teachablemachine.withgoogle.com/models/r6BBk-hiN/"
// //   });
  
// //   const app = express();
// //   const port = 3000;
  
// //   app.get("/image/classify", async (req, res) => {
// //     const { url } = req.query;
  
// //     return model.classify({
// //       imageUrl: url,
// //     }).then((predictions) => {
// //       console.log(predictions);
// //       return res.json(predictions);
// //     }).catch((e) => {
// //       console.error(e);
// //       res.status(500).send("Something went wrong!")
// //     });
// //   });
  
// //   app.listen(port, () => {
// //     console.log(`Example app listening at http://localhost:${port}`);
// //   });

// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const TeachableMachine = require("@sashido/teachablemachine-node");
// require("dotenv").config();

// app.set("view engine", "ejs");

// const model = new TeachableMachine({
//   modelUrl: "https://teachablemachine.withgoogle.com/models/w5gmvQ_-M/",
// });

// const app = express();
// const port = 3000;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Multer with Cloudinary Storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "uploads", // Cloudinary folder name
//     allowed_formats: ["jpg", "jpeg", "png"], // Allowed image formats
//   },
// });

// const upload = multer({ storage: storage });

// // Route to handle image upload and classification
// app.post("/image/classify", upload.single("image"), async (req, res) => {
//   const imageUrl = req.file ? req.file.path : null; // Ge  t the Cloudinary URL of the uploaded image
// console.log(imageUrl)
//   if (!imageUrl) {
//     return res.status(400).send("No image uploaded!");
//   }

//   try {
//     // Classify the uploaded image using the Teachable Machine model
//     const predictions = await model.classify({ imageUrl: imageUrl });
//     console.log(predictions);
//     const processedPredictions = predictions.map(p => {
//         return {
//             class: p.class,
//             percentage: (p.score * 100).toFixed(0) // Convert score to percentage and round
//         };
//     });

//     // Send the classification result
//     res.json(processedPredictions);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Something went wrong during classification!");
//   }
// });


// // Start the server
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });


const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const TeachableMachine = require("@sashido/teachablemachine-node");
require("dotenv").config();

// Initialize the Teachable Machine model
const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/w5gmvQ_-M/",
});

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Render the upload page at the root
app.get("/", (req, res) => {
  res.render("upload"); // Render 'upload.ejs'
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed image formats
  },
});

const upload = multer({ storage: storage });

// Route to handle image upload and classification
app.post("/image/classify", upload.single("image"), async (req, res) => {
  const imageUrl = req.file ? req.file.path : null; // Get the Cloudinary URL of the uploaded image

  if (!imageUrl) {
    return res.status(400).send("No image uploaded!");
  }

  try {
    // Classify the uploaded image using the Teachable Machine model
    const predictions = await model.classify({ imageUrl: imageUrl });

    // Process the predictions to format the result
    const processedPredictions = predictions.map((p) => ({
      class: p.class,
      percentage: (p.score * 100).toFixed(0), // Convert score to percentage and round
    }));

    // Send the classification result as a JSON response
    res.json(processedPredictions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Something went wrong during classification!");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
