// src/hooks/useReservations.ts
import { useEffect, useState } from "react";
import { getUserReservations } from "../utils/BackendCommunication";

export type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

export const useReservations = () => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getUserReservations();
        setReservations(data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Failed to load reservations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return { reservations, isLoading, error };
};
