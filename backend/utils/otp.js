import nodeMailer from 'nodemailer'


export const generateOTP = () => {
    let otp = ""
    for (let i = 0; i <= 5; i++) {
        let otpSingle = Math.floor(Math.random() * 9)
        otp += otpSingle
    }
    return otp;
}

export const sendOTP = (to, otp) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: '"College Final Year Project" <hello@wibetec.com>', // sender address
        to: to, // list of receivers
        subject: "Voting System", // Subject line
        text: "For OTP", // plain text body
        html: `<main> <h1>Your OTP For Vote</h1><br><h1>OTP From College Final year project by<span style="color:red;"> Ayyadurai-Mani</span></h1> <p>${otp}</p> <h4>Please Enter Within 2 Minutes</h4> </main>`, // html body
    }

    return transporter.sendMail(mailOptions);
}