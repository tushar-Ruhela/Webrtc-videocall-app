import { createContext, useContext, useMemo } from "react";

import io from "socket.io-client";
import { Socket } from "socket.io-client";

const Socketcontext = createContext<Socket|null>(null);
export const UseSocket = ():Socket|null => {
  const socket = useContext(Socketcontext);

  return socket;
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
 const socket = useMemo(
  () => io("http://10.118.243.208:5000", { transports: ["websocket"] }),
  []
);
  return (
    <Socketcontext.Provider value={socket}>{children}</Socketcontext.Provider>
  );
};

export default SocketProvider;
