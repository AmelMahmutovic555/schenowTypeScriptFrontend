import "./style/Schedule.css";
export default function Habits() {
  return (
    <article className="home">
      <section className="scheduleParent">
        <div className="headingSchedule">
          <h1>ScheNow</h1>
          <p>Schedule your next adventure</p>
        </div>
        <div className="scheduleBtnParent">
          <div>
            <a href="/availableDate">
              <button>Add an Available Date</button>
            </a>
          </div>

          <div>
            <a href="/book">
              <button>All Available Dates</button>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
