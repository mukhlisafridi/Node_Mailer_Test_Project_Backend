// import nodemailer from "nodemailer";
// export const emailController = (req, res) => {
//   try {
//     const { to, subject, text } = req.body;
//     const transpoter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // for https STARTTLS
//       auth: {
//         user: "abc@gmail.com",
//         pass: " app pass",
//       },
//     });
//     const info = transpoter.sendMail({
//       from: ' "Mukhlis Afridi"<mukhlisaafridi4@gmail.com>',
//       to: to,
//       subject: subject,
//       text: text, // for html : <h1>hello</h1>
//     });

//     return res.status(200).json({
//       message: "Email Successfully Sent..!",
//       success: true,
//       info,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({
//         message:"Error in emailController",
//         success:false,
//         error
       
//     })
//   }
// };
