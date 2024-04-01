import asyncError from "../utils/asyncError.js";
import User from "../models/userMdl.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Vote from "../models/voteMdl.js";
import sendResponse from "../utils/sendResponse.js";
import { checkEmpty } from "../utils/validate.js";
import { generateOTP, getSumOfOTP, sendOTP } from "../utils/otp.js";
import { getExpiryTime } from "../utils/time.js";

export const createPoll = asyncError(async (req, res, next) => {
  const { name, nominees } = req.body;
  if (checkEmpty([name, nominees])) {
    return next(new ErrorHandler("Name and Nominees Are Required....!", 400));
  }
  //CHECK NOMINEES COUNT
  if (!(nominees.length > 1)) {
    return next(
      new ErrorHandler("More Than One Nominees Are Required....!", 400)
    );
  }

  let nomineesData = [];
  for await (const nominee of nominees) {
    const nomineeResult = await User.findOne({ regno: nominee });
    if (!nomineeResult)
      return next(new ErrorHandler("Nominee is not a student...!", 400));
    nomineesData.push({
      email: nomineeResult.email,
      name: nomineeResult.name,
      regno: nomineeResult.regno,
    });
  }

  const polls = await Vote.find({});
  if (polls.length >= 1) {
    return next(new ErrorHandler("Already Poll Exists...!", 400));
  }
  const poll = await Vote.create({
    name,
    nominees: nomineesData,
  });

  sendResponse(res, 201, "Poll Created Successfully...!", poll);
});

export const deletePoll = asyncError(async (req, res, next) => {
  const poll = await Vote.deleteMany({});
  return sendResponse(res, 200, "Poll Deleted Successfully...!", null);
});

export const fetchPoll = asyncError(async (req, res, next) => {
  let poll = await Vote.find({});
  if (poll.length === 0) {
    return next(new ErrorHandler("No Poll Exits...!", 400));
  }
  poll = poll[0];
  return sendResponse(res, 200, "Poll Fetched Successfully...!", poll);
});

export const makeVote = asyncError(async (req, res, next) => {
  const { regno } = req.params;
  if (checkEmpty([regno])) {
    return next(new ErrorHandler("RegNo is Required....!", 400));
  }
  const user = await User.findOne({ regno });
  if (!user) {
    return next(new ErrorHandler("User Doesn't Exists....!", 400));
  }
  let poll = await Vote.find({});
  if (poll.length === 0) {
    return next(new ErrorHandler("No Poll Exits...!", 400));
  }
  poll = poll[0];
  const voter = poll.voters.find((voter) => voter.regno === user.regno);
  if (voter) {
    return next(new ErrorHandler("You're Already Voted ...!", 400));
  }
  const otpNum = generateOTP();
  const expiryTime = getExpiryTime();
  try {
    await sendOTP(user.email, otpNum);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
  const otpGeneratedUser = await User.findByIdAndUpdate(
    user._id,
    {
      otp: {
        num: otpNum,
        expiresTime: expiryTime,
      },
    },
    { new: true }
  );
  return sendResponse(
    res,
    201,
    "Otp Generated Successfully...!",
    otpGeneratedUser
  );
});

export const enterOTP = asyncError(async (req, res, next) => {
  const { otp, regno, nomineeRegNo } = req.body;
  //CHECK ALL NOT EMPTY
  if (checkEmpty([otp, regno, nomineeRegNo]))
    return next(new ErrorHandler("OTP and RegNo is Required...!", 400));
  const user = await User.findOne({ regno }); // FIND USER WITH "regno"
  if (!user) return next(new ErrorHandler("User Doesn't Exists....!", 400));
  const poll = (await Vote.find({}))[0]; //FIND CURRENT POLL
  // FIND NOMINEE FROM GIVEN "nomineeRegNo"
  const nominee = poll.nominees.find(
    (nominee) => nominee.regno === nomineeRegNo
  );
  if (!nominee)
    return next(new ErrorHandler("Nominee Doesn't Exists....!", 400));
  // CHECK VOTERS ALREADY EXISTS OR NOT
  const { voters } = poll;
  const voter = voters.find((voter) => voter.regno === regno);
  if (voter) return next(new ErrorHandler("Your Vote Is Already Exists...!"));
  console.log(getSumOfOTP(user.otp.num),"  ",otp);
  if (getSumOfOTP(user.otp.num) !== parseInt(otp))
    return next(new ErrorHandler("Invalid OTP...!", 400)); // CHECK OTP IS  EQUAL OR NOT
  // CHECK OTP EXPIRES TIME
  const otpExpiresTime = user.otp.expiresTime.getTime();
  const nowTime = new Date().getTime();
  if (!(nowTime <= otpExpiresTime))
    return next(new ErrorHandler("Invalid OTP...!", 400));
  // INCREASE VOTES COUNT IN NOMINEE ARRAY
  await Vote.updateOne(
    {
      _id: poll._id,
      "nominees._id": nominee._id,
    },
    {
      $inc: { "nominees.$.votes": 1 },
    }
  );
  // ADD VOTER TO VOTERS ARRAY
  const updatedVote = await Vote.updateOne(
    { _id: poll._id },
    { $push: { voters: { regno: regno } } }
  );
  return sendResponse(
    res,
    200,
    "Your Vote Is Successfully Registered...!",
    null
  );
});

export const pollResult = asyncError(async (req, res, next) => {
  const poll = (await Vote.find({}))[0];
  const { nominees } = poll;
  let maxVotes = 0;
  let winners = null
  for (let i = 0; i < nominees.length; i++) {
    if (maxVotes < nominees[i].votes) {
      maxVotes = nominees[i].votes;
    }
  }
  if (maxVotes > 0) {
    winners = poll.nominees.filter((nominee) => {
      if (nominee.votes === maxVotes) {
        return nominee;
      }
    });
  }
  poll.result.display = true;
  await poll.save();

  return sendResponse(res, 200, "Vote Displayed Successfully...!", {
    nominees,
    winners,
  });
});
