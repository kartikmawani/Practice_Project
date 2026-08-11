import  express from "express";
export const router=express.Router({caseSensitive:true,strict:true})
//post is recommended for both as  login is saving credentials too
router.post('/login',Authentication,loginController);
router.post('/reqister',RegisterController);