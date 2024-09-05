import { Movie } from '../../../model/Movie/index.mjs';
import { User } from '../../../model/User/index.mjs';
import { Subscription } from '../../../model/Subscription/index.mjs';
import { CheckCardAndTransferMoney } from '../../../services/Transfer.mjs';

export const getAllVideos = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error });
    }
};

export const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findOne({ id });
        if (!movie) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error fetching video by ID", error });
    }
};

export const filterVideos = async (req, res) => {
    try {
        const { name, genre, isAdultContent, isSubscriptionNeed, writer, director, cast, language, category, duration } = req.query;

        if (!name && !genre && !isAdultContent && !isSubscriptionNeed && !writer && !director && !cast && !language && !category && !duration) {
            return res.status(400).json({ message: "At least one filter parameter is required" });
        }

        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (genre) query.genre = genre;

        if (isAdultContent === 'true') {
            query.isAdultContent = false; 
        } else if (isAdultContent === 'false') {
            query.isAdultContent = false;
        }

        if (isSubscriptionNeed === 'true') {
            query.isSubscriptionNeed = false; 
        } else if (isSubscriptionNeed === 'false') {
            query.isSubscriptionNeed = false;
        }

        if (writer) query.writer = { $regex: writer, $options: 'i' };
        if (director) query.director = { $regex: director, $options: 'i' };
        if (cast) query.cast = { $in: cast.split(',') };
        if (language) query.language = language;
        if (category) query.category = category;
        if (duration) query.duration = { $lte: parseInt(duration, 10) };

        const movies = await Movie.find(query);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error filtering videos", error });
    }
};

export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const user = req.user;
        const { comment } = req.body;

        const movie = await Movie.findOne({ id: videoId });

        if (!movie) {
            return res.status(404).json({ message: "Video not found" });
        }

        const newComment = {
            user: {
                name: user.name,
                email: user.email,
                username: user.username,
            },
            comment: comment,
            date: new Date(),
        };

        movie.reviews.push(newComment);
        await movie.save();
        res.status(200).json({ message: "Comment added successfully", movie });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { videoId, commentId } = req.query;
        const user = req.user;
        const { comment } = req.body;

        const movie = await Movie.findOne({ id: videoId });

        if (!movie) {
            return res.status(404).json({ message: "Video not found" });
        }

        const review = movie.reviews.id(commentId);

        if (!review) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (review.user.email !== user.email) {
            return res.status(403).json({ message: "You are not authorized to update this comment" });
        }

        review.comment = comment;
        review.date = new Date();

        await movie.save();

        res.status(200).json({ message: "Comment updated successfully", movie });
    } catch (error) {
        res.status(500).json({ message: "Error updating comment", error });
    }
};

export const removeComment = async (req, res) => {
    try {
        const { videoId, commentId } = req.params;
        const user = req.user;

        const movie = await Movie.findOne({ id: videoId });

        if (!movie) {
            return res.status(404).json({ message: "Video not found" });
        }

        const review = movie.reviews.id(commentId);

        if (!review) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (review.user.email !== user.email) {
            return res.status(403).json({ message: "You are not authorized to remove this comment" });
        }

        review.remove();
        await movie.save();

        res.status(200).json({ message: "Comment removed successfully", movie });
    } catch (error) {
        res.status(500).json({ message: "Error removing comment", error });
    }
};


