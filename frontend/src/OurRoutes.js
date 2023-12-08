import React, { useEffect, lazy, Suspense } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import toast, { Toaster } from 'react-hot-toast';

//Protected route
import { ProtectedRoute } from "protected-route-react"

//Global Functions Stuff
import { Token } from './GlobalFunctions';

//---------- Redux Store Stuff
import { useDispatch, useSelector } from 'react-redux'
import { clearUserError, getUser } from './Store/UsersSlice'

//----------------Pages Specific Stuff
//Layout of all the pages
import Layout from './components/Layout/Layout'
import Loading from './components/Layout/Loading';

//All User Access Pages
const Home = lazy(() => import('./pages/Home'));
const Error404 = lazy(() => import('./pages/Error404'));

//Not authenticated pages
const Login = lazy(() => import('./pages/Auth/Login'))
const Logout = lazy(() => import('./pages/Auth/Logout'))
const Register = lazy(() => import('./pages/Auth/Register'))
const ForgetPassword = lazy(() => import('./pages/Auth/ForgetPassword'))
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'))



const OurRoutes = () => {

  const dispatch = useDispatch();

  const { user, isAuthenticated, success, msg, } = useSelector(state => state.user);

  useEffect(() => { //Specific for handle users slice

    if (success === true && msg)
      toast.success(msg);
    else if (success === false && msg)
      toast.error(msg);

    dispatch(clearUserError()); //clear all the user api stuffs

  }, [dispatch, success, msg]);

  useEffect(() => {
    if (Token)
      dispatch(getUser()); //Call the api to fetch logged in user details
  }, [dispatch])

  return (
    <>
      <BrowserRouter>

        <Routes>

          {/* Home Page  */}
          <Route path='/home' element={<Suspense fallback={<Loading />}><Layout ><Home redirect='/' user={user} /></Layout> </Suspense>} />
    
          {/* ---------------- Auth Specific Stuff Pages ------------------- X  */}
          {/* Register Page  */}
          <Route path='/register' element={<Suspense fallback={<Loading />}><ProtectedRoute isAuthenticated={!isAuthenticated} redirect='/home' > <Layout ><Register /></Layout></ProtectedRoute> </Suspense>} />

          {/* Login Page  */}
          <Route path='/' element={<Suspense fallback={<Loading />}><ProtectedRoute isAuthenticated={!isAuthenticated} redirect='/home' ><Layout ><Login /></Layout> </ProtectedRoute></Suspense>} />

          {/* Login Page  */}
          <Route path='/logout' element={<Suspense fallback={<Loading />}> <ProtectedRoute isAuthenticated={isAuthenticated} redirect='/' > <Layout > <Logout /></Layout> </ProtectedRoute> </Suspense>} />

          {/* Forget Password Page  */}
          <Route path='/forgetpassword' element={<Suspense fallback={<Loading />}><ProtectedRoute isAuthenticated={!isAuthenticated} redirect='/home'><Layout ><ForgetPassword /></Layout> </ProtectedRoute> </Suspense>} />

          {/* Reset Password Page  */}
          <Route path='/resetPassword/:token' element={<Suspense fallback={<Loading />}><ProtectedRoute isAuthenticated={!isAuthenticated} redirect='/home' ><Layout ><ResetPassword /></Layout> </ProtectedRoute> </Suspense>} />

        
          {/* Error Page  */}
          <Route path='*' element={<Layout ><Error404 /></Layout>} />

        </Routes>

        {/* Notification like in form of toasts  */}
        <Toaster />

      </BrowserRouter>
    </>
  )
}

export default OurRoutes