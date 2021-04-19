const nodemailer = require("nodemailer");
const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS
  }
});
function SendEmail(email, name, isCancel = false) {
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mahdi Soultana",
    html: `
      <head>
      <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
    />
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Karantina:wght@300;400;700&display=swap');
      .body{
        font-family: 'Karantina', cursive;
        color:#333;
        background:no-repeat cover center/center;
        background-image: url("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngarea.com%2Fview%2Fe636130f_confetti-png-welcome-banner-background-png-hd-png%2F&psig=AOvVaw0SjB7tPP28aK5zgEmJ0XiA&ust=1618842152805000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJDFvPT3iPACFQAAAAAdAAAAABAI");
        
        padding:2rem;
        border-radius: .6em;
        
      }
      .name{
          font-size:1.2rem; 
          font-weight:300;
          font-style:italic;
          padding:1rem;
      }
      .reciver{
          font-size:1.4rem;
        
         
          font-style:italic;
      }
       
      a{
        text-decoration: none;
      }
      </style>
      </head>
    <body>
    <div class="body">
    <h1 style="text-align:center">Welcome to Meet Mahdi Soultana!</h1>
    <span class="reciver">Hi ${name},</span>
    <p>
    My name is <span class="name">Mahdi Soultana</span>. I’m the CEO & founder of FrontMasterPortfolio and I wanted to be the first to welcome you and your team on board!
    </p>

    <span style="font-size:1.3rem">😊Ok</span>,
    <p> it’s true; this is an automated email, but if you have any questions simply reply to this email and I'd be more than happy to chat with you . :)</p>
    
    <strong><p>To help you get the most out of Me :</p></strong>
    <ul style="list-style:none">
   <li> - We'll be sending you 5 Getting Started With Me , one day within the next of each week. (if you do not wish to receive them, feel free to unsubscribe!)</li>
    <li> - If you'd like to quickly learn how to Work With Me in less than 30 minutes, <span style="font-size:1.2rem; font-style:italic;font-weight:bold color:black;">we can schedule a live chat and talking .</sapn></li>
    <li> - Take a look at My  completely public Projects !  see what is coming up soon. <a href="https://github.com/Mahdi-Soultana" target="_blank"><i class="fab fa-github-square"></i>get Touche My Github</a> 🥰</li>

    <li> - Comming Soon!  FrontEndMaster Portfolio for your iPhone or Android, for those times when you're on-the-go.<li>
    </ul>
    <p style="font-style:'italic';font-weight:'bold'">Thanks again for giving <strong>Me<strong>  a try!😀</p>
     <small class="name">Mahdi Soultana</small> 
    
    <p>ps.- One of our Sales Executives will be reaching out to you shortly, to help you with any questions you might have. <p>
     
    </div>
    
    </body>`
  };

  if (isCancel) {
    mailOptions = {
      ...mailOptions,
      html: `
      <head>
      <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
    />
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Karantina:wght@300;400;700&display=swap');
      .body{
        font-family: 'Karantina', cursive;
        color:#333;
      }
      .name{
          font-size:1.2rem; 
          font-weight:300;
          font-style:italic;
          padding:1rem;
      }
      .reciver{
          font-size:1.4rem;
        
         
          font-style:italic;
      }
       p{
           font-size:1.2rem;
       }
      a{
        text-decoration: none;
      }
      </style>
      </head>
    <body>
    <div class="body">
    <h1 style="text-align:center">Cancelation Account!</h1>
    <span class="reciver">Hi ${name},</span>
     
        <p>Please help Me to improve My Site </p>
        <h2>Hi</h2>

        <p>You recently canceled your FrontEndMatserPortfolio subscription and I'm sorry to see you go. Thank you for being with us. There could be various reasons for leaving and I really hope you can help us learn and improve.
        </p>
        <p>
        If it's not too much to ask, please let me know what made you unhappy, or what we could have done better. Please share your feedback here: <a href="https://www.linkedin.com/in/mahdisoultana/"> Get Me Your Feed Back Here !</a>
</p>
        <h3>Thank you, and hope our paths will cross again,<h3>

        <span class="name">Mahdi Soultana founder Of FrontEndMaster Portfolio<span>
    </div>
    
    </body>`
    };
  }
  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { SendEmail };
