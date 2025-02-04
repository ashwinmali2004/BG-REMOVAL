import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("No token provided or incorrect format");
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    // console.log("Received Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded); // Log decoded data

        if (!decoded.id) {
            console.log("Decoded token does not contain a valid user ID");
            return res.status(400).json({ success: false, message: "Invalid Token Data" });
        }

        req.body.userId = decoded.id; // Attach user ID to request
        // console.log("User ID attached to request:", req.body.userId);
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
    // console.log(process.env.JWT_SECRET);
    
};

export default authUser;
