import express  from "express";
import body from 'body-parser';
import ethUtil from 'ethereumjs-util';
import {log} from './httplogger';
// import http2 from 'http2';

const app = express();
const port = process.env.PORT || 3000;
// const host = 'http://0.0.0.0';
app.use(body.json());


const verifySignature = ({nonce, signature, pubKey}) => {
  const msgHash = ethUtil.hashPersonalMessage(Buffer.from(nonce, 'hex'))
  const p = JSON.parse(signature)
  const v = p.v
  const r = Buffer.from(p.r, 'hex')
  const s = Buffer.from(p.s, 'hex')
  const sigRecover = ethUtil.ecrecover(msgHash, v, r, s).toString('hex')
  const sigPubKey = ethUtil.publicToAddress(Buffer.from(sigRecover, 'hex'), true).toString('hex')
  if (sigPubKey === pubKey) {
      return true
  } else {
      return false
  }
}

app.get('/api/v1/auth/selfkey',[log],(req,res)=>{
  res.json({ nonce: "u9YGjSOQ4g620ACyYdbyv978gbujhff6fygni9" });
})
app.post('/api/v1/auth/selfkey',[log],(req,res)=>{
  const userData = req.body
  console.log("verification",verifySignature(userData),"data",req.body);
  res.json({token: "CnQbKQq2lHI3qVIs3udE4G7ENVudhEzklNOQ4TG08jgKjwE29aCh6kCZLgU8dsn4"});
})

app.post('/api/v1/auth/selfkey/login',[log],(req,res)=>{
  console.log(req.body);
  res.json({redirectTo: "/dashboard"});
})

app.all('**',[log],(req,res)=>{
  res.json('Sorry wrong route.')
})
app.listen(port,()=>{
  console.log(`Server started at :${port}`);
})


