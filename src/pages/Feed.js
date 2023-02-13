import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth } from "../actions/auth";
import Post from "../components/Post";
import { getAllRoute, userRoute } from "../utils/APIRoutes";
import { io } from "socket.io-client"

const Feed = () => {
   const navigate = useNavigate()
   
   useEffect(() => {
      !isAuth() && navigate('/login')
   }, [])
   
   const [users, setUsers] = useState(null)
   const [loggeduser, setloggeduser] = useState(null)
   const [loggeduserID, setloggeduserID] = useState("")
   const [shouldFetch, setShouldFetch] = useState(true)

   

   useEffect(() => {
      if(JSON.parse(localStorage.getItem("user")){
         setloggeduserID(JSON.parse(localStorage.getItem("user"))._id)
      }
   }, [loggeduserID])

   const socket = useRef();
   useEffect(() => {
      if (loggeduser) {
         socket.current = io("https://dating-server-production.up.railway.app/")
         socket.current.emit("newUser", loggeduser.email)
      }
   }, [loggeduser])

   

   useEffect(() => {
      if (loggeduserID && shouldFetch) {

         axios.get(`${getAllRoute}${loggeduserID}`).then((response) => {
            setUsers(response.data.usersdata)
            setloggeduser(response.data.loggeduser)
         }).catch((err) => {
            console.log(err)
         }).finally(() => {
            setShouldFetch(false)
         })
      }

   }, [loggeduserID, shouldFetch])

   const handleRefreshData = () => {
      setShouldFetch(true);
      console.log("refresh")
   }

   return (
      <div className="h-screen flex justify-center overflow-y-scroll bg-white rounded-lg shadow-lg">
         <div style={{ minWidth: 350 }} className="py-20 p-6 w-1/2 mr-9">

            {(users && loggeduser) ?
               (
                  users.map((user) => {
                     return (
                        <Post key={user._id} user={user} loggeduser={loggeduser} socket={socket} handleRefreshData={handleRefreshData} />
                     )
                  })
               ) : (
                  <>
                     <h1 className="text-6xl" >Loading... </h1>
                     <p className="py-5" >fetching data may take time</p>
                  </>
               )
            }
         </div>
      </div>
   );
};

export default Feed;
