const express=require("express");
const morgan=require("morgan");//logging  http headers
const helmet=require("helmet"); //improves web security 
const cors=require("cors");//corss origin resurce sharing
const cookieParser=require("cookie-parser");//parse cookie heder from hhtp requests and makes to acces cookie data
const path=require("path");
const globalErrorhandler=require("./controllers/errorController");
const userRouter=require("./routes/userRoutes");
const postRouter=require("./routes/postRoutes");

const app=express();

app.use("/",express.static("uploads"));

app.use(cookieParser());

app.use(helmet());

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP
  message: "Too many requests, please try again later.",
});

app.use('/api', limiter);

app.use(cors(
    {
       origin: 'http://localhost:5173',
        credentials:true,
    }
));

app.use(express.static(path.join(__dirname,'public')));



if(process.env.NODE_ENV==='development')
{
app.use(morgan('dev'));
}

app.use(express.json({limit:"10kb"}));

// app.use(
//   mongoSanitize()
// );

// app.use(xss());

app.use("/api/v1/users",userRouter)

app.use("/api/v1/posts",postRouter);

app.use(globalErrorhandler);

// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


module.exports=app;