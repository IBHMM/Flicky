import { Router } from "express";
import {
    getAllVideos,
    getVideoById,
    filterVideos,
    addComment,
    updateComment,
    removeComment,
} from "../../controller/video/user/user.controller.mjs"; 
import { verifyJWT } from "../../middleware/User/auth.middleware.mjs";

const router = Router();

router.route("/getallvideos").get(getAllVideos);
router.route("/getvideo/:id").get(getVideoById);
router.route("/filtervideos").get(filterVideos);

router.route("/videos/:videoId/comments/add").post(verifyJWT, addComment);
router.route("/videos/:videoId/comments/update/:commentId").put(verifyJWT, updateComment)
router.route("/videos/:videoId/comments/delete/:commentId").delete(verifyJWT, removeComment);

export default router;