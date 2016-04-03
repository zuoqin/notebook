# notebook

A nice offline supported notebook application upgraded to Angular 2 & TypeScript

1. Add email configuration to your mongodb:
   db.controls.update({name:"emailserver"},{name:"emailserver", sfield1:"email login", sfield2:"email password", sfield3:"smtp server address", bfields1:"SSL support true/false"},{upsert:true})
2. Add WeiBo AppKey setttings:
   db.controls.insert({name:"weiboappkey", "sfield1":"588957036"})


Commands to run node server:
 1. sudo pm2 stop server
 2. sudo pm2 start server.js
