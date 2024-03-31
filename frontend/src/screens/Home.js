import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enterOTP, listPolls, requestOTP } from "../api/voteAPI";
const Home = () => {
  const [component, setComponent] = useState(0);
  const navigate = useNavigate();

  //COMPONENT 0
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function api() {
      try {
        const result = await listPolls();
        setPoll(result.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    }
    api();
  }, []);

  const handleVote = (nominee) => {
    setSelectedNominee(nominee);
    setComponent(1);
  };

  //COMPONENT 1
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [regNo, setRegNo] = useState("");
  const [invalidRegNo, setInvalidRegNo] = useState(null);
  const [otpLoading, setOTPLoading] = useState(false);
  const handleConfirm = async () => {
    try {
      setOTPLoading(true);
      const result = await requestOTP(regNo.toUpperCase());
      setComponent(2);
    } catch (err) {
      setInvalidRegNo(err.response.data.message);
    } finally {
      setOTPLoading(false);
    }
  };

  // COMPONENT 2
  const [otp, setOTP] = useState("");
  const [invalidOTP, setInvalidOTP] = useState(null);
  const [enterOTPLoading, setEnterOTPLoading] = useState(false);

  const confirmOTP = async () => {
    try {
      setEnterOTPLoading(true);
      const result = await enterOTP({
        otp,
        regno: regNo.toUpperCase(),
        nomineeRegNo: selectedNominee.regno.toUpperCase(),
      });
      setRegNo('')
      setOTP('')
      setComponent(3);
      setInvalidOTP(null)
      setInvalidRegNo(null)
    } catch (err) {
      setInvalidOTP(err.response.data.message);
    } finally {
      setEnterOTPLoading(false);
    }
  };

  return (
    <>
      {/* // DISPLAY NOMINEES */}
      {component === 0 && (
        <section className="bg-purple-200 rounded-2xl p-5 mb-10">
          <div className="container mx-auto">
            <div className="p-5 ">
              <h2 className="text-center text-5xl font-bold">Voting System</h2>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => navigate("/admin-login")}
                className="bg-red-500 rounded-2xl p-4 text-medium text-white font-bold hover:bg-red-600"
              >
                Admin Panel
              </button>
              <button
                onClick={() => navigate("/result")}
                className="flex  bg-red-500 rounded-2xl p-4 text-medium text-white font-bold hover:bg-red-600"
              >
                Results
              </button>
            </div>
            {poll && (
              <div className=" flex justify-center">
                <h1 className="font-bold text-4xl text-gray-600">
                  {poll.name}
                </h1>
              </div>
            )}
            <div className="flex flex-wrap mt-5">
              {poll && (
                <div className=" flex w-1/3 p-3">
                  {poll.nominees.map((nominee, index) => (
                    <div
                      key={index}
                      className="bg-white m-5 p-5 rounded-2xl shadow-lg"
                    >
                      <h3 className="text-center text-2xl font-bold text-gray-700">
                        {nominee.name}
                      </h3>
                      <h2 className="text-center p-5 text-3xl text-gray-600">
                        {nominee.regno}
                      </h2>
                      <div className="flex justify-center">
                        <button
                          className="bg-purple-600 text-lg text-white p-5 rounded-2xl hover:bg-purple-900 mt-5"
                          onClick={() => handleVote(nominee)}
                        >
                          vote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className=" w-1/2 text-center mx-auto mb-1 bg-white py-3 rounded-2xl shadow-lg">
                  <label
                    className="text-center text-2xl font-bold"
                    htmlFor="polls"
                  >
                    {error}
                  </label>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* //DISPLAY TO ENTER REGNO */}
      {component === 1 && (
        <section className="bg-purple-200 rounded-2xl p-5 ">
          <div className="container mx-auto">
            <div className="">
              <h2 className="text-center text-5xl font-bold">Voting System</h2>
            </div>
            <div className=" w-1/2 text-center mx-auto m-5 bg-white p-5 rounded-2xl shadow-lg">
              <div className="flex justify-center mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-20 h-20 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
                  />
                </svg>
              </div>
              <h2 className="text-center text-3xl font-bold text-gray-700">
                To Vote
              </h2>
              <br />
              <h2 className="text-center p-2 text-3xl text-gray-600">
                {selectedNominee.regno} <br />({selectedNominee.name})
              </h2>
              <div className="border flex flex-col justify-center p-2">
                <input
                  onChange={(e) => setRegNo(e.target.value)}
                  value={regNo}
                  className="border border-black p-3 rounded-2xl font-bold text-lg shadow"
                  type="text"
                  id="number"
                  placeholder="Enter Your RegNo"
                />
                {invalidRegNo && (
                  <h3 className="mb-5  font-bold text-red-600 text-lg text-left">
                    {invalidRegNo}
                  </h3>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  disabled={otpLoading}
                  className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 mt-5"
                >
                  {otpLoading ? "Loading..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* //DISPLAY TO ENTER OTP */}
      {component === 2 && (
        <section className="bg-purple-200 rounded-2xl p-5 mb-5">
          <div className="container mx-auto">
            <div className="py-28">
              <h2 className="text-center text-5xl font-bold">
                OTP Verification
              </h2>
            </div>
            <div className=" w-1/2 text-center mx-auto mb-10 mt-5 bg-white p-10 rounded-2xl shadow-lg">
              <div className="flex justify-center mb-">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-20 h-20 text-purple-500 mt-5 mb-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </div>

              <h2 className="text-center text-3xl font-bold text-gray-700">
                OTP has been sent to your college Email Id
              </h2>
              <br />
              <div className="flex justify-center p-2">
                <input
                  className="border border-black p-3 rounded-2xl font-bold text-lg shadow"
                  type="number"
                  id="number"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>
              {invalidOTP && (
                <h3 className="mb-5 font-bold text-red-600 text-lg">
                  {invalidOTP}
                </h3>
              )}
              <div className="flex justify-center">
                <button
                  onClick={confirmOTP}
                  disabled={enterOTPLoading}
                  className="bg-purple-600 text-lg text-white p-5 px-8 rounded-2xl hover:bg-purple-900 mt-5"
                >
                  {enterOTPLoading ? "Loading..." : "Confirm OTP"}
                </button>
              </div>
            </div>
            <br />
          </div>
        </section>
      )}

      {component === 3 && (
        <section className="bg-purple-200 rounded-2xl p-5 mb-5">
          <div className="container mx-auto">
            <h2 className="text-center text-3xl font-bold text-gray-800">
              Thankyou <br /> Your vote is submitted successfully!
            </h2>
            <div className="flex justify-center p-2">
              <button
                onClick={() => setComponent(0)}
                className="bg-white rounded px-2 py-1 font-bold shadow"
              >
                Home
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
