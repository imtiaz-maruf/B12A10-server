const admin = require("../config/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Firebase Token Verification Error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyFirebaseToken;