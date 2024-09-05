import { Router } from "express";
import { verifyJWT } from "../../middleware/User/auth.middleware.mjs";
import { verifyAdmin } from "../../middleware/User/admin.middleware.mjs";
import {
  blockUser,
  unblockUser,
  updateUser,
  deleteUser,
  addUser,
  addSubscription,
  removeSubscription,
  getAllUsers,
  getUser,
  SoftDelete,
  restoreUser,
} from "../../controller/user/admin/admin.user.controller.mjs";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024} });

const router = Router();

router.route("/block/:userId").patch(verifyJWT, verifyAdmin, blockUser);
router.route("/unblock/:userId").patch(verifyJWT, verifyAdmin, unblockUser);
router.route("/update/:userId").patch(upload.fields([{ name: 'picture', maxCount: 1 }]), updateUser);
router.route("/delete/:userId").delete(verifyJWT, verifyAdmin, deleteUser);

router.route("/adduser").post(upload.fields([{ name: 'picture', maxCount: 1 }]), addUser);

router.route("/subscription/add/:userId").patch(verifyJWT, verifyAdmin, addSubscription);
router.route("/subscription/remove/:userId").patch(verifyJWT, verifyAdmin, removeSubscription);
router.route("/getallusers").get(verifyJWT, verifyAdmin, getAllUsers);
router.route("/getalluser/:userId").get(verifyJWT, verifyAdmin, getUser);
router.route("/softDelete/:userId").patch(verifyJWT, verifyAdmin, SoftDelete);
router.route("/restoreUser/:userId").patch(verifyJWT, verifyAdmin, restoreUser);

export default router;
