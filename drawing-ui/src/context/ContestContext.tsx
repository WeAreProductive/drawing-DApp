import { createContext, useContext, useState } from "react";
import { ContestType } from "../shared/types";

type Props = {
  children: React.ReactNode;
};

const initialContestContext = {
  contest: null,
  setContest: (contest: ContestType | null) => undefined,
};
const ContestContext = createContext<any>(initialContestContext);

export const useContestsContext = () => {
  const context = useContext(ContestContext);

  if (!context) {
    console.error("Contest context can be used only within a Contest Provider");
  }

  return context;
};

export const ContestContextProvider = ({ children }: Props) => {
  const [contest, setContest] = useState<ContestType | null>(null);
  const value = {
    contest,
    setContest,
  };
  return (
    <ContestContext.Provider value={value}>{children}</ContestContext.Provider>
  );
};
