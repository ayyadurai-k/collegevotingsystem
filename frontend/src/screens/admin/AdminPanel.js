import React, { useEffect, useState } from "react";
import { createPoll, deletePoll, listPolls } from "../../api/voteAPI";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [component, setComponent] = useState(0);
  //COMPONENT 0
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      const result = await deletePoll();
      setPoll(null);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  //COMPONENT 1
  const [nominees, setNominees] = useState([]);
  const [nominee, setNominee] = useState("");
  const [name, setName] = useState("");
  const [error1, setError1] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (nominee.length != 10) {
      setNominee("");
      return setError1("Invalid Registration Number...!");
    }

    if (nominees.includes(nominee.toUpperCase())) {
      setNominee("");
      return setError1("Duplicate  Nominees Are Not Allowed...!");
    }

    setNominees((prev) => {
      return [...prev, nominee.toUpperCase()];
    });
    setNominee("");
    setError1(null);
  };

  useEffect(() => {
    async function api() {
      try {
        const result = await listPolls();
        setPoll(result.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    }
    if (component === 0) {
      api();
      setName("");
      setNominees([]);
      setError(null);
      setError1(null);
    }
  }, [component]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createPoll({ name, nominees });
      setComponent(0);
    } catch (err) {
      setError1(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* DISPLAY POLLS */}
      {component === 0 && (
        <section className="bg-purple-200 rounded-2xl p-5 mb-10">
          <div className="py-10">
            <button
              onClick={() => navigate("/")}
              className="bg-white rounded px-2 py-1 font-bold shadow"
            >
              Home
            </button>
            <h2 className="text-center text-5xl font-bold">Admin Panel</h2>
            <h4 className="text-left text-5xl font-italic ml-8 mt-8">
              Polls:-
            </h4>
          </div>
          {poll && (
            <div className=" w-1/2 text-center mx-auto mb-5 bg-white py-3 rounded-2xl shadow-lg">
              <label className="text-center text-2xl font-bold" htmlFor="polls">
                {poll.name}
              </label>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-lg text-white px-2 py-1 rounded-xl hover:bg-red-700 mt-2 ml-5"
                type="submit"
              >
                Delete
              </button>
              <div>
                <h3 className="text-left m-5 font-bold text-xl">Nominees : </h3>
                <ol className="font-bold">
                  {poll.nominees.map((nominee, index) => (
                    <li
                      key={index}
                      className="bg-purple-500 my-0.5 mx-4 rounded p-1"
                    >
                      {nominee.name}({nominee.regno})
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          {!poll && (
            <div className=" w-1/2 text-center mx-auto mb-5 bg-white py-3 rounded-2xl shadow-lg">
              <label className="text-center text-2xl font-bold" htmlFor="polls">
                No Poll Found...!
              </label>
            </div>
          )}
          <button
            onClick={() => setComponent(1)}
            className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 mt-5 justify-center"
          >
            Create
          </button>
        </section>
      )}

      {/* CREATE POLL */}
      {component === 1 && (
        <section className="bg-purple-200 rounded-2xl p-5 mb-10">
          <div className="container mx-auto">
            <div>
              <button
                onClick={() => setComponent(0)}
                className="bg-white px-3 py-1 rounded font-bold"
              >
                Back
              </button>
            </div>
            <div className="py-10">
              <h2 className="text-center text-5xl font-bold">Create Poll</h2>
            </div>
            <div className="container mx-auto">
              <form className="flex flex-wrap mt-2 mb-2">
                <div className="w-1/2 p-5">
                  <div className="bg-white p-10 rounded-2xl shadow-lg">
                    <label
                      className="text-center mb-5 text-2xl font-italic text-gray-700"
                      htmlFor="name"
                    >
                      Poll Name :
                    </label>

                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="mt-2 border border-black p-3 rounded-2xl font-bold text-lg shadow ml-5"
                      type="text"
                      id="name"
                      placeholder="Enter poll name"
                    />

                    <div className="mt-5">
                      <label
                        className="text-center mb-5 text-2xl font-italic text-gray-700"
                        htmlFor="nominee"
                      >
                        Nominee :
                      </label>
                      <input
                        onChange={(e) => setNominee(e.target.value)}
                        value={nominee}
                        className="mt-2 border border-black p-3 rounded-2xl font-bold text-lg shadow ml-7"
                        type="text"
                        id="nominee"
                        placeholder="Enter nominee Regno"
                      />
                      <label
                        onClick={handleAdd}
                        className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 ml-2 mt-5"
                      >
                        Add
                      </label>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 p-5">
                  <div className="bg-white p-5 rounded-2xl shadow-lg">
                    <div>
                      <label
                        className="text-center text-2xl font-italic text-gray-700"
                        htmlFor="nominee"
                      >
                        Nominees:-
                      </label>
                      <div className="bg-purple-400 p-3 mt-3">
                        <div>
                          {nominees.map((nominee, index) => (
                            <p
                              key={index}
                              className="bg-white p-2 text-black font-bold m-1"
                            >
                              {nominee}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {error1 && (
                  <h3 className="mb-5 font-bold text-red-600 text-lg text-left">
                    {error1}
                  </h3>
                )}
                <div className=" w-full flex justify-center">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-2 py-0.5 rounded"
                  >
                    {loading ? 'Loading...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AdminPanel;
