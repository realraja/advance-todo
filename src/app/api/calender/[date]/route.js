import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Diary from "@/models/diary";
import Goal from "@/models/goal";
import Movie from "@/models/movies";
import Skill from "@/models/skill";
import Task from "@/models/task";
import User from "@/models/user";

export const GET = userTryCatch(async (req, context) => {
    const dateString = context?.params?.date;
    if (!dateString) return failedResponse("Please provide valid date");
  
    const inputDate = new Date(dateString);
    if (isNaN(inputDate)) return failedResponse("Invalid date format");
  
    const userId = req.user._id;
  
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));
    const dayName = startOfDay.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
    const formattedDate = inputDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
  
    // Fetch user once and select all needed fields
  
    // Habit check helper
    const checkDateMatch = (arr) =>
      arr?.some((d) => new Date(d).toISOString().split("T")[0] === formattedDate);
  
    const GetDataArray  = [
      User.findById(userId).select("+bathed +running +didThat +brushed").lean(),
      Task.find({
        user: userId,
        type: "task",
        $or: [
          { completedAt: { $gte: startOfDay, $lte: endOfDay } },
          { doTaskOn: { $gte: startOfDay, $lte: endOfDay } }
        ]
      }),
      Task.find({
        user: userId,
        type: "work",
        $or: [
          { completedAt: { $gte: startOfDay, $lte: endOfDay } },
          { whenDoWork: dayName }
        ]
      }),
      Goal.find({
        user: userId,
        $or: [
          { doBefore: { $gt: startOfDay } },
          { completedAt: { $gte: startOfDay, $lte: endOfDay } }
        ]
      }),
      Diary.find({
        user: userId,
        forDate: { $gte: startOfDay, $lte: endOfDay }
      }),
      Movie.find({
        user: userId,
        watchedDates: {
          $elemMatch: { date: { $gte: startOfDay, $lte: endOfDay } }
        }
      }),
      Skill.find({
        user: userId,
        daysOfDid: {
          $elemMatch: { date: { $gte: startOfDay, $lte: endOfDay } }
        }
      }),
    ]
  
    
    // Fetch everything in parallel
    const [user,task, work, goal, diary, movie, skill] = await Promise.all(GetDataArray);
  
  
    const isBrushed = checkDateMatch(user.brushed);
    const isBathed = checkDateMatch(user.bathed);
    const isRunning = checkDateMatch(user.running);
    const isDidThat = checkDateMatch(user.didThat);
  
    return successResponse("Data fetched successfully", {
      goal,
      task,
      work,
      diary,
      movie,
      skill,
      isBrushed,
      isBathed,
      isRunning,
      isDidThat,
      user,
    });
  })
