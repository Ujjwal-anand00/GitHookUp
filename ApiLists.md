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

-POST/request/send/intrested/:userID
-POST/request/send/ignored/:userID
-POST/request/review/accepted/:requestID
-POST/request/review/rejected/:requestID

## userRouter

-GET/user/connection
-GET/user/request
-GET/user/feed
