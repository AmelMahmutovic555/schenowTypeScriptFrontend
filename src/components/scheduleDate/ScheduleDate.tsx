import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./style/ScheduleDate.css";
import { AuthContext } from "../../context/AuthProvider";

interface TimeSlot {
  id: number;
  date: string;
  from: string;
  to: string;
  available: boolean;
}

interface UserInfo {
  name: string;
  email: string;
}

export default function ScheduleDate() {
  const { message, setMessage, apiUrl } = useContext(AuthContext);

  const [availableDates, setAvailableDates] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<TimeSlot | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
  });

  const ref = useRef<HTMLDialogElement | null>(null);

  const handleDates = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await axios.get<TimeSlot[]>(`${apiUrl}/timeslot/all`);

      setAvailableDates(res.data);
    } catch (error: unknown) {
      setMessage("Failed to load available appointments.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    handleDates();
  }, [handleDates]);

  function handleChange(e: ChangeEvent<HTMLInputElement>, id: keyof UserInfo) {
    setUserInfo((prevState) => ({
      ...prevState,
      [id]: e.target.value,
    }));
  }

  function openDialog(slot: TimeSlot) {
    setSelectedDate(slot);
    setUserInfo({
      name: "",
      email: "",
    });
    setMessage(null);
    ref.current?.showModal();
  }

  function closeDialog() {
    ref.current?.close();
    setSelectedDate(null);
  }

  async function handleBooking(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!selectedDate || !userInfo.name || !userInfo.email) {
      return;
    }

    const booked = {
      name: userInfo.name,
      email: userInfo.email,
      available: false,
    };

    try {
      setMessage(null);

      const res = await axios.put<string>(
        `${apiUrl}/timeslot/book/${selectedDate.date}/${selectedDate.from}/${selectedDate.to}`,
        booked,
      );

      setMessage(res.data);
      closeDialog();

      await handleDates();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          typeof error.response?.data === "string"
            ? error.response.data
            : "Booking failed. Please try again.",
        );
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  }

  function calculateDuration(from: string, to: string): number {
    const [fromHour, fromMinute] = from.split(":").map(Number);
    const [toHour, toMinute] = to.split(":").map(Number);

    return toHour * 60 + toMinute - (fromHour * 60 + fromMinute);
  }

  return (
    <article className="articleParentBooking">
      <div>
        <h1>Book a Meeting</h1>
        <p>
          Choose from the available spots and book your meeting with just a few
          clicks.
        </p>
      </div>
      <div className="parentBooking">
        {message && <div id="mess">{message}</div>}

        <div id="parentAvaDates">
          {loading ? (
            <div>Loading...</div>
          ) : (
            availableDates &&
            availableDates.map((ad) => {
              return ad.available === true ? (
                <>
                  <div key={ad.id} className="cardDates">
                    <h3 className="headingAvaSpot">Available Spot</h3>

                    <div className="avaSpotParent">
                      <p className="date">
                        <span>Date</span>
                        <div>{ad.date}</div>
                      </p>
                      <p className="time">
                        <span>Time</span>
                        <div>
                          {ad.from.split(":")[0] + ":" + ad.from.split(":")[1]}-
                          {ad.to.split(":")[0] + ":" + ad.to.split(":")[1]}
                        </div>
                      </p>

                      <p className="time">
                        <span>Duration</span>
                        <div>{calculateDuration(ad.from, ad.to)} min</div>
                      </p>
                      <button
                        className="btnBookNow"
                        onClick={() => openDialog(ad)}
                      >
                        Book Now
                      </button>
                      {/* <p></p> */}
                    </div>
                  </div>

                  <dialog key={ad.id} ref={ref} id="dialog">
                    <div className="headerDialogParent">
                      <div>
                        <h3>Book Meeting</h3>
                        <p>Complete your details to confirm this time slot.</p>
                      </div>
                      <button onClick={closeDialog} className="x">
                        X
                      </button>
                    </div>

                    <div className="dateTimeParent">
                      <p className="dialogDate">
                        <span>Date</span> <br />
                        <div>{selectedDate?.date}</div>
                      </p>
                      <p className="dialogTime">
                        <span>Time</span> <br />
                        <div>
                          {selectedDate?.from.split(":")[0] +
                            ":" +
                            selectedDate?.from.split(":")[1]}
                          -
                          {selectedDate?.to.split(":")[0] +
                            ":" +
                            selectedDate?.to.split(":")[1]}
                        </div>
                      </p>
                      <p className="dialogTime">
                        <span>Duration</span>
                        <div>
                          {selectedDate &&
                            calculateDuration(
                              selectedDate.from,
                              selectedDate.to,
                            )}{" "}
                          min
                        </div>
                      </p>
                    </div>
                    <label>Name</label>
                    <input
                      type="name"
                      name="name"
                      value={userInfo.name}
                      onChange={(e) => handleChange(e, "name")}
                      placeholder="Enter your name"
                      required
                    />
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={userInfo.email}
                      onChange={(e) => handleChange(e, "email")}
                      placeholder="Enter your email address"
                      required
                    />

                    <div className="dialog-btn-parent">
                      <button onClick={closeDialog} className="dialogCancel">
                        Cancel
                      </button>
                      <button onClick={handleBooking} className="dialogConfirm">
                        Confirm Booking
                      </button>
                    </div>
                  </dialog>
                </>
              ) : (
                <div key={ad.id} className="cardDates">
                  <div className="bookedMark">Booked</div>

                  <div className="avaSpotParent">
                    <p className="date">
                      <span>Date</span>
                      <div>{ad.date}</div>
                    </p>
                    <p className="time">
                      <span>Time</span>
                      <div>
                        {ad.from.split(":")[0] + ":" + ad.from.split(":")[1]}-
                        {ad.to.split(":")[0] + ":" + ad.to.split(":")[1]}
                      </div>
                    </p>

                    <p className="time">
                      <span>Duration</span>
                      <div>{calculateDuration(ad.from, ad.to)} min</div>
                    </p>
                    <button className="btnBookNowDisabled" disabled>
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </article>
  );
}
