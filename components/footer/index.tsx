import Link from "next/link";

const Footer = () => (
  <>
    <div className="container mx-auto flex justify-center items-center gap-12 mt-24">
      <Link href="/privacy" className=" opacity-50 hover:opacity-100 ">
        Privacy Policy
      </Link>

      <Link href="/terms" className=" opacity-50 hover:opacity-100 ">
        Terms of Service
      </Link>
      <a
        href="mailto:gcphost@gmail.com"
        className=" opacity-50 hover:opacity-100 "
      >
        Contact
      </a>

      <a
        href="mailto:gcphost@gmail.com"
        className=" opacity-50 hover:opacity-100 "
      >
        DMCA
      </a>
    </div>
  </>
);

export default Footer;
