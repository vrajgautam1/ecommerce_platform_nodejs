function otpGen(){
    let otp = Math.floor(Math.random()*(99999-10000+1)+10000)
    return otp
}

module.exports = {otpGen}