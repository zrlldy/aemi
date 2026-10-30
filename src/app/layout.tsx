import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'aemi — Code meets motion', description: 'Backend developer and motion designer based in Cebu, Philippines. Making things work. Making things move.' };
export default function Layout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
