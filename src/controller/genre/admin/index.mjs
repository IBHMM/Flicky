import { Genre } from "../../../model/Genres/index.mjs";
import { v4 as uuidv4 } from 'uuid';


export const deleteGenre = async (req, res) => {
    const { genreId } = req.params;

    try {
        const genre = await Genre.findOneAndDelete({id: genreId});

        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        res.status(200).json({ message: "Genre deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateGenre = async (req, res) => {
    const { genreId } = req.params;  
    const { name, description } = req.body;  

    try {
        const genre = await Genre.findOne({ id: genreId });

        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }

        genre.name = name || genre.name;
        genre.description = description || genre.description;

        await genre.save();

        res.status(200).json(genre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addGenre = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: "Please enter name and description" });
    }

    try {
        const newGenre = new Genre({ name, description, id: uuidv4() });
        await newGenre.save();
        res.status(201).json(newGenre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
