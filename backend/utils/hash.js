import bcrypt from 'bcrypt'

//hasing password
export const hashPassword=async(password)=>{
    const hashedPassword = await bcrypt.hash(password,10);
    return hashedPassword;
}

//compare hashed password
export const comparePassword=async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword);
}

