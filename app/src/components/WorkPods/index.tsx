import "./WorkPods.css";
import peepo from "../../assets/placeholder-pepe.jpg";

const WorkPods = () => {
  return (
    <>
      <h1>Work Pods</h1>
      <div className="work-pods-container">
        <div className="hexagon available">
          <img src={peepo} alt="Peepo" />
          <p>C230-1</p>
        </div>
        <div className="hexagon has-slots">
          <img src={peepo} alt="Peepo" />
          <p>C230-2</p>
        </div>
        <div className="hexagon fully-booked">
          <img src={peepo} alt="Peepo" />
          <p>C230-3</p>
        </div>
      </div>
      <div className="separator"></div>
      <div className="work-pods-container">
        <div className="hexagon available">
          <img src={peepo} alt="Peepo" />
          <p>C242-1</p>
        </div>
        <div className="hexagon has-slots">
          <img src={peepo} alt="Peepo" />
          <p>C242-2</p>
        </div>
      </div>
    </>
  );
};

export default WorkPods;
