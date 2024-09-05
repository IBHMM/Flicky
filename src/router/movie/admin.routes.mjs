import { Router } from "express";
import { verifyAdmin } from "../../middleware/User/admin.middleware.mjs";
import { verifyJWT } from "../../middleware/User/auth.middleware.mjs";
import { deleteVideo, updateVideo, UploadVideo } from "../../controller/video/admin/admin.controller.mjs";
import multer from "multer";

const router = Router();

router.use(verifyJWT, verifyAdmin);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'picture', maxCount: 1 }
]), UploadVideo);

router.delete('/delete/:movieId', deleteVideo);

router.patch('/update/:movieId', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'picture', maxCount: 1 }
]), updateVideo);

export default router;