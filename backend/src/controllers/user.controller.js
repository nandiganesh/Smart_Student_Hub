import { asyncHandler } from '../utils/asyncHandlers.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { Certificate } from '../models/certificate.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generatesAccessAndRefereshToken = async(userId)=>{
    try{
const user =await User.findByIdAndUpdate(userId);
   const accessToken=user.generatesAccessToken()
   const refreshToken=user.generatesRefreshToken()

   user.refreshToken=refreshToken;
   await user.save({validateBeforeSave: false});

   return{accessToken, refreshToken}
    }catch (error) {
        console.error("Error generating access and refresh tokens:", error);
        throw new ApiError(500, "Internal server error");
    }
}

const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password, role, studentId, department, semester } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role
    if (role && !['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // For students, studentId is required
    if ((role === 'student' || !role) && !studentId?.trim()) {
      return res.status(400).json({ message: "Student ID is required for student accounts" });
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existedUser) {
      return res.status(409).json({ message: "User with email or username already exists" });
    }

    const userData = {
      fullName,
      email,
      password,
      username: username.toLowerCase(),
      role: role || 'student'
    };

    // Add student-specific fields
    if (userData.role === 'student') {
      userData.studentId = studentId;
      if (department) userData.department = department;
      if (semester) userData.semester = parseInt(semester);
    }

    // Add department for faculty/admin if provided
    if ((userData.role === 'faculty' || userData.role === 'admin') && department) {
      userData.department = department;
    }

    const user = await User.create(userData);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res.status(500).json({ message: "Something went wrong while registering the user" });
    }

    return res.status(201).json({
      message: "User registered Successfully",
      user: createdUser
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generatesAccessAndRefereshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { data: req.user },
            "User fetched successfully"
        ))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getUserPoints = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Calculate total points from verified certificates
        const verifiedCertificates = await Certificate.find({ 
            userId: userId, 
            status: 'Verified' 
        });
        
        const totalPoints = verifiedCertificates.reduce((sum, cert) => sum + (cert.points || 0), 0);
        
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { totalPoints },
                "User points fetched successfully"
            ));
    } catch (error) {
        console.error("Error fetching user points:", error);
        throw new ApiError(500, "Failed to fetch user points");
    }
});

export { 
    registerUser ,
    loginUser,
    logoutUser,
    getCurrentUser,
    getUserPoints
};