import { Actor } from "../../model/Actors/index.mjs";
import uuid from "uuid";

export const createActor = async (req, res) => {
    try {
        const {
            name,
            bio,
            birthDate,
            nationality,
            movies,
            awards,
            socialMedia,
        } = req.body;
  
        if (name === undefined) {
            return res.status(400).json({ message: "Name is required." });
        }
    
        const actorData = {
            id: uuid(),
            name,
            bio: bio !== undefined ? bio : "",
            birthDate: birthDate !== undefined ? birthDate : null,
            nationality: nationality !== undefined ? nationality : "",
            imageUrl: imageUrl !== undefined ? imageUrl : "",
            movies: Array.isArray(movies) ? movies : [],
            awards: Array.isArray(awards) ? awards : [],
            socialMedia: socialMedia !== undefined ? socialMedia : {},
        };
    
        const actor = new Actor(actorData);
        const savedActor = await actor.save();
        res.status(201).json(savedActor);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.status(200).json(actors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) {
      return res.status(404).json({ message: 'Actor not found' });
    }
    res.status(200).json(actor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateActorById = async (req, res) => {
    try{
        const {userId} = req.params;
        const actor = await Actor.findByIdAndUpdate({id : userId});
        if (!actor) {
            return res.status(404).json({ message: 'Actor not found' });
        }

        const {name, bio, birthDate, nationality, imageUrl, movies, awards, socialMedia} = req.body;
        actor.name = name || actor.name;
        actor.bio = bio || actor.bio;
        actor.birthDate = birthDate || actor.birthDate;
        actor.nationality = nationality || actor.nationality;
        actor.imageUrl = imageUrl || actor.imageUrl;
        actor.movies = movies || actor.movies;
        actor.awards = awards || actor.awards;
        actor.socialMedia = socialMedia || actor.socialMedia;
        const updatedActor = await actor.save();
        res.status(200).json(updatedActor);
    }catch(err) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteActorById = async (req, res) => {
  try {
    const actor = await Actor.findByIdAndDelete(req.params.id);
    if (!actor) {
      return res.status(404).json({ message: 'Actor not found' });
    }
    res.status(200).json({ message: 'Actor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
