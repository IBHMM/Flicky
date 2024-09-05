import { Genre } from "../../../model/Genres/index.mjs";

export const getallGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getGenreById = async (req, res) => {
    const { genreId } = req.params;
    
    
    try {
        const genre = await Genre.findOne({id: genreId});

        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        res.status(200).send(genre);
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
}
