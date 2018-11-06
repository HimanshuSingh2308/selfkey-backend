import bunyan from 'bunyan';
import  {name} from '../config/bunyan';

const logger = bunyan.createLogger({
  name,
  serializers: {
    req:bunyan.stdSerializers.req,
    err: bunyan.stdSerializers.err,
    res:bunyan.stdSerializers.res
  },
  streams: [
    {
      level: 'error',
      path: './debug.log' 
    },
    {
      level: 'info',
      stream:process.stdout
    } 
  ]
});

const log = (req,res,next) => {
  logger.info({body:req.body});
  next();
}

const error = (err,req,res,next) => {
  try {
    err=JSON.parse(err); 
  } catch (error) {
    err=err;
  } finally {
    logger.error({err});
    // based on errors you can send custom error-messages to users.
    res.status(500).json({status:"error",message:"Not Found"});
  }
  // console.log('\n\n\n');
}

const print = (type=null,title=null,msg=null)=>{
  if( type === 'error' )
  {
    logger.error({title},msg);
  } else if ( type === 'success' ) {
    logger.info({title},msg);
  } else {
    logger.info({title},msg);
  }
}


module.exports = {log,print,error};

