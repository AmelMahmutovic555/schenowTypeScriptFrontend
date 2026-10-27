import { ChangeEvent, FormEvent, useContext, useState } from "react";
import "./style/AvailableDate.css";
import axios from "axios";
// import { useNavigate } from "react-router";
// import { AuthContext } from "../../context/authContext/AuthContext";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthProvider";

interface Meeting {
  date: string;
  from: string;
  to: string;
  available: boolean;
}

export default function AvailableDate() {
  const { setMessage, apiUrl } = useContext(AuthContext);

  const [meeting, setMeeting] = useState<Meeting>({
    date: "",
    from: "",
    to: "",
    available: true,
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>, id: keyof Meeting) {
    setMeeting((prevState) => ({
      ...prevState,
      [id]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const availableMeeting = {
      date: meeting.date,
      from: meeting.from,
      to: meeting.to,
      available: meeting.available,
    };
    try {
      const res = await axios.post<string>(
        `${apiUrl}/timeslot/add`,
        availableMeeting,
      );

      setMessage(res.data);
      navigate("/book");
    } catch (error: any) {
      setError(error.response.data);
    }
  }

  function clear(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMeeting((prevState) => ({
      ...prevState,
      date: "",
      from: "",
      to: "",
    }));
  }

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTodayHours = () => {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, "0");
    const mm = String(today.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const todayStr = getTodayString();

  const todayHrs = getTodayHours();
  return (
    <article className="articleParentBooking">
      <div>
        <h1>Add Available Time Slot</h1>
        <p>Create a new appointment window for people to book.</p>
      </div>
      <section className="meetingParent">
        <form className="formParent" onSubmit={handleSubmit}>
          {error ? <div id="error">{error}</div> : <div></div>}

          <div className="headingMeetingParent">
            <h3>New Time Slot</h3>
            <p>Select a date and time range for when you're available.</p>
          </div>
          <div className="meetingParent2">
            <div>
              <label>Date</label>
              <div className="input">
                <input
                  type="date"
                  name="date"
                  min={todayStr}
                  value={meeting.date}
                  onChange={(e) => handleChange(e, "date")}
                  required
                />
              </div>
            </div>

            <div>
              <label>Start Time</label>

              <div className="input">
                <input
                  type="time"
                  name="from"
                  // min={todayHrs}
                  value={meeting.from}
                  onChange={(e) => handleChange(e, "from")}
                  required
                />
              </div>
            </div>

            <div>
              <label>End Time</label>
              <div className="input">
                <input
                  type="time"
                  name="to"
                  value={meeting.to}
                  onChange={(e) => handleChange(e, "to")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="meetingBtnParent">
            <button className="dialogCancel" onClick={clear}>
              Clear
            </button>
            <button className="dialogConfirm">Add Slot</button>
          </div>
        </form>
      </section>
    </article>
  );
}
