import mongoose from "mongoose";

export async function ConnectDB() {
    mongoose.connect(process.env.DB_CONNECTION_STRING);
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}