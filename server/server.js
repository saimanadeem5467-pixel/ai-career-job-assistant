const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase =require("./supabase");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "yes" : "no");
const aiRoutes= require("./routes/aiRoutes");
const jobRoutes =require("./routes/jobRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/ai",aiRoutes);
app.use("/api/jobs",jobRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the server!' });
});
app.get("/api/test-supabase", async (req, res) => {

    const { data, error } = await
        supabase
            .from('profiles')
            .select('*');
    if (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });

    }

    res.json({
        success: true,
        message: 'Supabase connection successful!',
        data,

    });
});
//app.use("/api/ai",aiRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});