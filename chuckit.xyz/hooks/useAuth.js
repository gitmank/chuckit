"use client";
import { useState, useEffect } from "react";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(STATUS.LOADING);

  useEffect(() => {
    const getUser = async () => {
      setStatus(STATUS.LOADING);
      try {
        const res = await fetch("/api/protected/user");
        if (res.status === 200) {
          const data = await res.json();
          setUser(data.user);
          setStatus(STATUS.SUCCESS);
        } else {
          setStatus(STATUS.ERROR);
          setUser(null);
        }
      } catch (error) {
        setStatus(STATUS.ERROR);
        setUser(null);
      }
    }
    getUser();
  }, []);

  return [user, status];
};

export default useAuth;
