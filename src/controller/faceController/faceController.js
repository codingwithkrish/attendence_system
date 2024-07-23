import exp from "constants";
import FaceModel from "../../models/faceModel";
import User from "../../models/userModel";
export const addFace = async (req, res) => {
  try {
    const File1 = req.files.File1.tempFilePath
    const File2 = req.files.File2.tempFilePath
    const File3 = req.files.File3.tempFilePath
    const userId = req.body.userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (result) {

      res.json({ message: "Face data stored successfully" })
    } else {
      res.json({ message: "Something went wrong, please try again." })

    }

    let result = await uploadLabeledImages([File1, File2, File3], userId);
    res.status(201).json({ face });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
export const getFace = async (req, res) => {
  try {
    const File1 = req.files.File1.tempFilePath;
    let result = await getDescriptorsFromDB(File1);
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });

  }

}
async function uploadLabeledImages(images, userId) {
  try {
    let counter = 0;
    const descriptions = [];
    // Loop through the images
    for (let i = 0; i < images.length; i++) {
      const img = await canvas.loadImage(images[i]);
      counter = (i / images.length) * 100;
      console.log(`Progress = ${counter}%`);
      // Read each face and save the face descriptions in the descriptions array
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }

    // Create a new face document with the given label and save it in DB
    const createFace = new FaceModel({
      faceId: userId,
      descriptions: descriptions,
    });
    await createFace.save();
    return true;
  } catch (error) {
    console.log(error);
    return (error);
  }
}
async function getDescriptorsFromDB(image) {
  let faces = await FaceModel.find();
  for (i = 0; i < faces.length; i++) {
    for (j = 0; j < faces[i].descriptions.length; j++) {
      faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
    }
    faces[i] = new faceapi.LabeledFaceDescriptors(faces[i].label, faces[i].descriptions);
  }

  const faceMatcher = new faceapi.FaceMatcher(faces, 0.6);

  const img = await canvas.loadImage(image);
  let temp = faceapi.createCanvasFromMedia(img);
  const displaySize = { width: img.width, height: img.height };
  faceapi.matchDimensions(temp, displaySize);

  const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
  return results;
}
