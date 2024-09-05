import { Movie as Video } from "../../../model/Movie/index.mjs";
import cloudinary from 'cloudinary'; 

export const UploadVideo = async (req, res) => {
  try {
    const { video, picture } = req.files;

    if (!video || !video[0] || !picture || !picture[0]) {
      return res.status(400).json({ error: "Both video and picture files are required" });
    }

    const data = req.body.data;

    const {
      genre,
      isAdultContent,
      isSubscriptionNeed,
      writer,
      director,
      cast,
      language,
      duration,
      score,
      publishedAt,
      name
    } = JSON.parse(data);

    if (!genre || !writer || !director || !language || !duration || !score || !publishedAt || !name) {
      console.log(genre, writer, director, language, duration, score, publishedAt, name)
      return res.status(400).json({ error: "All fields are required" });
    }

    const videoUploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: 'video', folder: 'CloudinaryDemo/videos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(video[0].buffer);
    });

    const pictureUploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: 'image', folder: 'CloudinaryDemo/images' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(picture[0].buffer);
    });

    const newVideo = new Video({
      genre,
      isAdultContent,
      isSubscriptionNeed,
      writer,
      director,
      cast,
      language,
      duration,
      videoUrl: videoUploadResult.secure_url,
      thumbnailUrl: pictureUploadResult.secure_url,
      score,
      publishedAt,
      name
    });

    await newVideo.save();

    res.status(201).json({
      message: "Video and movie details uploaded successfully",
      video: newVideo
    });
  } catch (error) {
    console.error("Error uploading video and picture:", error);
    res.status(500).json({ error: "Error uploading video and picture", details: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { movieId } = req.params;

    const video = await Video.findOne({ id: movieId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    
    const VpublicId = video.videoUrl.split('/').pop().split('.')[0]; 
    const IpublicId = video.thumbnailUrl.split('/').pop().split('.')[0]; 
    
    const videoDeleteResponse = await cloudinary.uploader.destroy(VpublicId, { resource_type: 'video' });
    const imageDeleteResponse = await cloudinary.uploader.destroy(IpublicId, { resource_type: 'image' });
    
    if (videoDeleteResponse.result !== 'ok' && videoDeleteResponse.result !== 'not found') {
      return res.status(500).json({ error: "Failed to delete video from Cloudinary" });
    }
    
    if (imageDeleteResponse.result !== 'ok' && imageDeleteResponse.result !== 'not found') {
      return res.status(500).json({ error: "Failed to delete thumbnail from Cloudinary" });
    }
    
    await Video.findOneAndDelete({ id: movieId });
    res.status(200).json({ message: "Video and thumbnail deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ error: "Error deleting video" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { video, picture } = req.files;
    
    const data = req.body.data;
    const {
      genre,
      isAdultContent,
      isSubscriptionNeed,
      writer,
      director,
      cast,
      language,
      duration,
      score,
      publishedAt,
      name
    } = JSON.parse(data);

    const video_ = await Video.findOne({ id: movieId });

    if (!video_) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (Object.keys(score).length !== 2) {
      res.status(400).json({ error: "Invalid score format score must constain both imdb and fhd" });
    }

    if (video !== undefined) {

      const oldVideoPublicId = video.videoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(oldVideoPublicId, { resource_type: 'video' });

      const videoUploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'video', folder: 'CloudinaryDemo/videos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(video[0].buffer);
      });

      video_.videoUrl = videoUploadResult.secure_url;
    }

    if (picture !== undefined) {
      const oldThumbnailPublicId = video_.thumbnailUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(oldThumbnailPublicId, { resource_type: 'image' });


      const pictureUploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image', folder: 'CloudinaryDemo/images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(picture[0].buffer);
      });

      video_.thumbnailUrl = pictureUploadResult.secure_url;
    }

    video_.genre = genre || video_.genre;
    video_.isAdultContent = isAdultContent !== undefined ? isAdultContent === "true" : video_.isAdultContent;
    video_.isSubscriptionNeed = isSubscriptionNeed !== undefined ? isSubscriptionNeed === "true" : video_.isSubscriptionNeed;
    video_.writer = writer || video_.writer;
    video_.director = director || video_.director;
    video_.cast = cast || video_.cast;
    video_.language = language || video_.language;
    video_.duration = duration || video_.duration;
    video_.score = score || video_.score;
    video_.publishedAt = publishedAt || video_.publishedAt;
    video_.name = name || video_.name;

    await video_.save();  

    res.status(200).json({ message: "Video updated successfully", video_ });
  } catch (error) {
    res.status(500).json({ error: "Error updating video" });
  }
};
