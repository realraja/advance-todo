import axios from "axios";



export const userTryCatch = (passedFunction) => async(data) => {
    try {
        return await passedFunction(data);
    } catch (error) {
        console.log(error,error.message);
        return {success:false,message:error.response?.data.message ? error.response.data.message:error.message,data:error.response?.data.data ? error.response.data.data:null};
    }
}

export const CheckUser = userTryCatch(async()=>{
    const {data} = await axios.get(`/api/auth/web`);
    return data;
})
export const RegisterUser = userTryCatch(async(userData={})=>{
    const {data} = await axios.post('/api/auth/register',userData);
    return data;
})
export const LoginUser = userTryCatch(async(userData={})=>{
    const {data} = await axios.post('/api/auth/login',userData);
    return data;
})
export const GoogleLoginUser = userTryCatch(async(userData={})=>{
    const {data} = await axios.post('/api/auth/google',userData);
    return data;
})
export const logoutUser = userTryCatch(async(userData={})=>{
    const {data} = await axios.post('/api/auth/logout',userData);
    return data;
})