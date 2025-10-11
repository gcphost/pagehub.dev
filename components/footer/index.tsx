import Link from "next/link";

const Footer = () => (
  <>
    <div className="container mx-auto mt-24 flex items-center justify-center gap-12">
      <Link href="/privacy" className="opacity-50 hover:opacity-100">
        Privacy Policy
      </Link>

      <Link href="/terms" className="opacity-50 hover:opacity-100">
        Terms of Service
      </Link>
      <a
        href="mailto:gcphost@gmail.com"
        className="opacity-50 hover:opacity-100"
      >
        Contact
      </a>

      <a
        href="mailto:gcphost@gmail.com"
        className="opacity-50 hover:opacity-100"
      >
        DMCA
      </a>
    </div>
  </>
);

export default Footer;
