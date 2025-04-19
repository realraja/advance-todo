import { failedResponse } from "@/middleware/response"


export const GET = (req) => {
    return failedResponse('this route is not found')
}