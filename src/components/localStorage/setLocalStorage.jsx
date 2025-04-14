'use client';
import { IS_USER_LOGGED_IN, USER_DATA, USER_ID } from '@/constants/localConst';
import { getOrSaveLocalStorage } from '@/lib/localStorage';
import { login, logout } from '@/redux/slicer/auth';
import { CheckUser } from '@/utils/authRequests';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export default function ClientOnlyHydrator() {
  const {isUser,userId,userData} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsUser = async() => {
        try {
            const data = await CheckUser();
            console.log(data);
            if(data.success){
            //   toast.success(data.message);
            //   console.log(data.data);
              await dispatch(login(data?.data));
            }else{
                await dispatch(logout());
            //   toast.error(data.message);
            }    
        
          } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed: ' + error.message);
            
          }
    }

    checkIsUser();
  }, [dispatch]);

  useEffect(() => {
    getOrSaveLocalStorage({ key: IS_USER_LOGGED_IN, value: isUser, get: false }); 
    getOrSaveLocalStorage({ key: USER_ID, value: userId, get: false }); 
    getOrSaveLocalStorage({ key: USER_DATA, value: userData, get: false }); 
  }, [isUser,userId,userData]);

  return null;
}
