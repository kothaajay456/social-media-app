const cloudinary=require("cloudinary").v2;

cloudinary.config({
cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_CLOUD_KEY,
api_secret:process.env.CLOUDINARY_CLOUD_SECRET,
timeout:6000,
});

const uploadtoCloudinary=async(filecontent)=>{
    try{
        const response=await cloudinary.uploader.upload(filecontent);
        return response;
    }
    catch (err) {
    console.error("[CLOUDINARY UPLOAD ERROR]", err);
    throw new Error("Failed to upload image to Cloudinary");
  }
};


module.exports={uploadtoCloudinary,cloudinary};