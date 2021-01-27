import { createContext } from "react";

const PagoContext = createContext({});

const PagoProvider = PagoContext.Provider;
const PagoConsumer = PagoContext.Consumer;

export { PagoProvider, PagoConsumer, PagoContext };
