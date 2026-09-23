import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"BRAVENTIS Arbeitszentrale",description:"Die zentrale Arbeitsplattform von BRAVENTIS"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body>{children}</body></html>}
