import { failedResponse, successResponse } from "@/middleware/response";
import { userTryCatch } from "@/middleware/tryCatch";
import User from "@/models/user";



export const GET = userTryCatch(async(req) =>{
    const importantEvents = await User.findById(req.user._id);
    return successResponse('importantEvents fetch successfully',{importantEvents:importantEvents.importantEvents});
})

export const POST = userTryCatch(async(req) =>{
    const {name,date} = await req.json();
    if(!name || !date) return failedResponse('invailid cridentials')
    const user = await User.findById(req.user._id);
    user.importantEvents.push({name,date:new Date(date)});
    await user.save()
    return successResponse('importantEvents added successfully',{importantEvents:user.importantEvents});
})
export const PUT = userTryCatch(async(req) =>{
    const {name,date,id} = await req.json();
    if(!name || !date ||!id) return failedResponse('invailid cridentials')
    const user = await User.findById(req.user._id);

    const event = user.importantEvents.id(id);
    if (!event) return failedResponse('Event not found');

    event.name = name;
    event.date = new Date(date);
  
    await user.save();
    return successResponse('importantEvents updated successfully',{event});
})

export const DELETE = userTryCatch(async (req) => {
    const { id } = await req.json();
  
    if (!id) return failedResponse('Event ID is required');
  
    const user = await User.findById(req.user._id);
  
    // Filter out the event to delete
    user.importantEvents = user.importantEvents.filter(
      (event) => event._id.toString() !== id
    );
  
    await user.save();
  
    return successResponse('Event deleted successfully', { importantEvents: user.importantEvents });
  });


