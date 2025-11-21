/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Agency, Contact, User } from "@/generated/prisma";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User;
  contact?: Contact;
  agency?: Agency;
};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [data, setdata] = useState<ModalData>({});
  const [showingModal, setshowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setisMounted] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setisMounted(true);
  }, []);

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        try {
          const fetched = await fetchData();
          setdata((prev) => {
            return { ...prev, ...(fetched || {}) };
          });
        } catch (error) {
          console.error("Failed to fetch modal data:", error);
        }
      }
      setisOpen(true);
      setshowingModal(modal);
    }
  };

  const setClose = () => {
    setisOpen(false);
    setdata({});
  };

  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used withing the modal provider");
  }

  return context;
};

export default ModalProvider;
