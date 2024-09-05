import { Router } from "express";
import { getallGenres, getGenreById } from "../../controller/genre/user/index.mjs";


const router = Router();

router.route("/getallgenres").get(getallGenres);
router.route("/getgenre/:genreId").get(getGenreById);

export default router;