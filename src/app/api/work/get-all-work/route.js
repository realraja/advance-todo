import { successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import Task from "@/models/task";



export const GET = userTryCatch(async (req) => {
    const work = await Task.find({
      user: req.user._id,
      type: 'work',
    })
      .sort({ completed: 1, createdAt: -1 }); // Fetch more, sort in JS
  
    // List of days starting from today
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayIndex = new Date().getDay(); // 0 = Sunday
  
    const orderedDays = [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)];
  
    const sortedWork = work.sort((a, b) => {
      const dayA = a.whenDoWork?.toLowerCase() || 'anytime';
      const dayB = b.whenDoWork?.toLowerCase() || 'anytime';
  
      const indexA = dayA === 'anytime' ? Infinity : orderedDays.indexOf(dayA);
      const indexB = dayB === 'anytime' ? Infinity : orderedDays.indexOf(dayB);
  
      return indexA - indexB;
    });
  
  
    return successResponse('work fetched successfully', { work: sortedWork});
  });
  

