const User = require("../models/User");
const Result = require("../models/Result");

exports.getLeaderboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyLeaderboard = await Result.aggregate([
      {
        $match: {
          completedAt: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
          totalQuestions: { $sum: "$totalQuestions" },
          quizCount: { $sum: 1 },
          averageScore: { 
            $avg: { 
              $multiply: [
                { $divide: ["$score", "$totalQuestions"] },
                100
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1
              }
            }
          ],
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          username: { $ifNull: ["$userDetails.username", "Anonymous User"] },
          fullName: { $ifNull: ["$userDetails.fullName", ""] },
          avatar: { $ifNull: ["$userDetails.avatar", null] },
          totalScore: 1,
          quizCount: 1,
          averageScore: { $ifNull: ["$averageScore", 0] }
        }
      },
      {
        $sort: { averageScore: -1 }
      }
    ]);

    const leaderboardWithRanks = dailyLeaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      displayName: user.username || 'Anonymous User'
    }));

    res.status(200).json({
      success: true,
      date: today.toISOString().split('T')[0],
      leaderboard: leaderboardWithRanks
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};