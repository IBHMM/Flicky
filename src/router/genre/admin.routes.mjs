import { Router } from "express";
import { addGenre, deleteGenre, updateGenre } from "../../controller/genre/admin/index.mjs";
import { verifyAdmin } from "../../middleware/User/admin.middleware.mjs";
import { verifyJWT } from "../../middleware/User/auth.middleware.mjs";


const router = Router();

router.use(verifyJWT, verifyAdmin);                                

router.route("/deletegenre/:genreId").delete(deleteGenre);
router.route("/updategenre/:genreId").patch(updateGenre);
router.route("/addgenre").post(addGenre);

export default router;