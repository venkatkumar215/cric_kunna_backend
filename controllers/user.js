import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";


import UserModel from '../models/user.js';


const secret = 'test';

export const singin =async(req,res)=>{
    const {emailId,password} =req.body;
    console.log('email',req.body)
    try{
       const oldUser=await UserModel.findOne({emailId});

       if(!oldUser) return res.status(404).json({message:'User doesnot exist'});
      
       const isPasswordCorrect = await bcrypt.compare(password,oldUser.password);
       
       if(!isPasswordCorrect) return res.status(400).json({message:'Invalid credentials'});
       
       const token = jwt.sign({email:oldUser.email,id:oldUser._id},secret,{expiresIn:'1h'});
      
       return res.status(200).json({result:oldUser,token});

    }
    catch(err){
        console.log(err)
         res.status(500).json({message:'something went wrong'});
    }
}

export const signup = async( req,res)=>{
   
    const{email,password,firstName,LastName} = req.body;
    try{
        
        const oldUser =await UserModel.findOne({email});
        if(oldUser){
            return res.status(400).json({message:'User already exist'});

        }

        const hashedPassword = await bcrypt.hash(password,12);

        const result = await UserModel.create({
            email,
            password:hashedPassword,
            name:`${firstName} ${LastName}`
        });  
        const token = jwt.sign({email:result.email,id:result._id},secret,{expiresIn:'1h'});
        res.status(201).json({result,token})

    }
    catch{

        res.status(500).json({message:'something went wrong'});
        // console.log(error)
    }
}