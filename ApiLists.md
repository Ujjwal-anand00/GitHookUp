# DevTinder Apis

## authRouter

-POST /signup
-POST /login
-POST /logout

## profileRouter

-GET/profile/view
-PATCH/profile/edit
-PATCH/profile/password

## connectionRequestRouter

<!-- igonred & interested -->
-POST/request/send/:status/:userID  
 
<!-- accepted & rejected -->
-POST/request/review/:status/:requestID


## userRouter

-GET/user/connection
-GET/user/request
-GET/user/feed
