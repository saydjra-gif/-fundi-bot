const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
const VERIFY_TOKEN = "fundi123";
app.get('/', (req,res)=>{res.send('Fundi Simu TZ Bot Live 0688155728');});
app.get('/webhook',(req,res)=>{
  let mode=req.query['hub.mode'];let token=req.query['hub.verify_token'];let challenge=req.query['hub.challenge'];
  if(mode==='subscribe'&&token===VERIFY_TOKEN){res.status(200).send(challenge);}else{res.sendStatus(403);}
});
app.post('/webhook',async(req,res)=>{
  let body=req.body;
  if(body.object){
    if(body.entry&&body.entry[0].changes&&body.entry[0].changes[0].value.messages){
      let phone_number_id=body.entry[0].changes[0].value.metadata.phone_number_id;
      let from=body.entry[0].changes[0].value.messages[0].from;
      let msg_body=body.entry[0].changes[0].value.messages[0].text?.body||"";
      let jibu=getAI(msg_body);
      await axios({method:"POST",url:`https://graph.facebook.com/v19.0/${phone_number_id}/messages?access_token=${process.env.WHATSAPP_TOKEN}`,data:{messaging_product:"whatsapp",to:from,text:{body:jibu}},headers:{"Content-Type":"application/json"}});
    }
    res.sendStatus(200);
  }else{res.sendStatus(404);}
});
function getAI(msg){
  msg=msg.toLowerCase();
  if(msg.includes("habari")||msg.includes("mambo")||msg.includes("hello")) return "Habari! Karibu Fundi Simu TZ - Kariakoo Dar. Mimi ni Fundi wa Simu. Namba 0688155728. Unahitaji nini?\n1. Bei za Screen\n2. Matengenezo\n3. Kununua simu\n4. Location";
  if(msg.includes("screen")||msg.includes("kioo")) return "Bei za Screen leo:\nInfinix/Tecno: 25k-45k\nSamsung A: 40k-90k\niPhone: 80k-350k Original\nTuma Model nikupe bei kamili! 0688155728";
  if(msg.includes("wapi")||msg.includes("location")||msg.includes("duka")) return "Location: Kariakoo, Ndanda na Aggrey St, Dar. Karibu na jengo la Kariakoo. Piga 0688155728 tukuchukue. 8am-8pm kila siku!";
  return `Asante: "${msg}"\nMimi Fundi Simu TZ AI. Naweza kusaidia matengenezo, bei za spare, kununua simu. Andika tatizo lako au piga: 0688155728`;
}
app.listen(process.env.PORT||3000,()=>{console.log('Bot running');});
