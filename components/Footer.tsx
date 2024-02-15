import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mx-auto flex max-w-3xl gap-3 p-3 ">
      <Link href="/privacy">Privacy</Link>
    </footer>
  );
};

export default Footer;
