import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const MovieSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4
    },
    genre: {
        type: String,
        required: true
    },
    name: { 
        type: String,
        required: true 
    },
    description: { 
        type: String 
    },
    duration: { 
        type: Number
    },
    publishedAt: { 
        type: Date,
        default: Date.now
    },
    thumbnailUrl: { 
        type: String 
    },
    videoUrl: { 
        type: String, 
        required: true 
    },
    score: {
        imdb: { 
            type: Number 
        },
        fhd: { 
            type: Number 
        },
    },
    language: { 
        type: String 
    },
    quality: { 
        type: String 
    },
    cast: {
        type: [String],
        default: []
    },
    director: { 
        type: String 
    },
    writer: { 
        type: String 
    },
    reviews: [
        {
            user: { 
                type: {
                    name:  String,
                    email: String,
                    username: String
                } 
            },
            comment: { 
                type: String 
            },
            date: { 
                type: Date, 
                default: Date.now 
            },
        },
    ],
    isAdultContent: { 
        type: Boolean, 
        default: false 
    },
    isSubscriptionNeed: { 
        type: Boolean, 
        default: false 
    },
});

MovieSchema.pre('save', function(next) {
    if (this.isNew) {
        this.id = uuidv4();
    }
    next();
});

export const Movie = mongoose.model("Movie", MovieSchema);
