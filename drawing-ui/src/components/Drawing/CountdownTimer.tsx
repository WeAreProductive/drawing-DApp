import moment from "moment";
import { useCanvasContext } from "../../context/CanvasContext";
import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const { currentDrawingData } = useCanvasContext();
  const [eventTime, setEventTime] = useState("");
  const [timeRemainingLabel, setTimeRemainingLabel] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);

  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time / 60) % 60);
    const hours = Math.floor((time / (60 * 60)) % 24);
    const days = Math.floor(time / (60 * 60 * 24));
    const formatted = `${days.toString().padStart(2, "0")}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
    return formatted;
  };
  useEffect(() => {
    if (!currentDrawingData) {
      setEventTime("");
      setTimeRemainingLabel("");
    } else {
      setEventTime(currentDrawingData.closed_at);
    }
  }, [currentDrawingData]);

  useEffect(() => {
    if (eventTime) {
      const countdownInterval = setInterval(() => {
        const currentTime = moment().unix();
        let remainingTime = +eventTime - currentTime;

        if (remainingTime <= 0) {
          remainingTime = 0;
          clearInterval(countdownInterval);
        }
        const label = formatTime(remainingTime);
        setTimeRemainingLabel(label);
        setRemainingTime(remainingTime);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [eventTime, timeRemainingLabel, currentDrawingData]);
  return (
    <span className="text-sm font-semibold sm:ml-4">
      {remainingTime ? `${timeRemainingLabel} until ready to MINT` : ""}
    </span>
  );
};

export default CountdownTimer;
