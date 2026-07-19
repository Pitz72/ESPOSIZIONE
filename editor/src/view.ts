import { createContext, useContext } from "react";

/** Vista autore (lingua naturale) vs tecnica (dato grezzo). Stesso .iwstory. */
export type View = "autore" | "tecnica";

export const ViewContext = createContext<View>("autore");
export const useView = (): View => useContext(ViewContext);
