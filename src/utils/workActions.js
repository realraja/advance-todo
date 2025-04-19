import axios from "axios";



export const userTryCatch = (passedFunction) => async(data) => {
    try {
        return await passedFunction(data);
    } catch (error) {
        console.log(error,error.message);
        return {success:false,message:error.response?.data.message ? error.response.data.message:error.message,data:error.response?.data.data ? error.response.data.data:null};
    }
}

export const getWorkData = userTryCatch(async()=>{
    const {data} = await axios.get(`/api/work`);
    return data;
})