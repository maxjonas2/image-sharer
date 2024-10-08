import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./ui/globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
// const lato = Lato({
//   subsets: ["latin"],
//   weight: ["100", "300", "400", "700", "900"],
// });

export const metadata: Metadata = {
  title: "Sharer",
  description: "A cute little file sharing app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={"px-6 bg-slate-200 space-y-4 " + inter.className}>
        <header className='pt-4'>
          <div className='content header-content | flex justify-between items-center'>
            <div className='logo-container'>
              <picture className='logo-picture'>
                <img width='180' height='40' src='/assets/logo.png' />
              </picture>
            </div>
            <nav className='flex gap-4 text-[--text-strong] font-[500] items-center'>
              <Link href='/'>Sign In</Link>
              <Link href='/' className='btn-hollow centered'>
                Sign Up
              </Link>
              <Link href='/'>Menu</Link>
            </nav>
          </div>
        </header>
        <>{children}</>
      </body>
    </html>
  );
}
