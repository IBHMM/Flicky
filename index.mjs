import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ConnectDB } from './src/config/DataBase.mjs';
import userRouter from './src/router/user/user.routes.mjs';
import adminRouter from './src/router/user/admin.routes.mjs';
import cookieParser from 'cookie-parser';
import usergenreRouter from './src/router/genre/user.routes.mjs';
import admingenreRouter from './src/router/genre/admin.routes.mjs';
import usermovieRouter from './src/router/movie/user.routes.mjs';
import adminMovieRouter from './src/router/movie/admin.routes.mjs';
import cloudinary from 'cloudinary';

dotenv.config();
ConnectDB();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/user/genre", usergenreRouter);
app.use("/api/v1/admin/genre", admingenreRouter);

app.use("/api/v1/user/movie", usermovieRouter);
app.use("/api/v1/admin/movie", adminMovieRouter);

app.get("/health", (req, res) => {
    res.send("server is living");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
