import Footer from "components/footer";
import { NextSeo } from "next-seo";
import { Nunito } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { SiTailwindcss } from "react-icons/si";
import {
  TbDeviceFloppy,
  TbDeviceMobile,
  TbLogin,
  TbPageBreak,
  TbWorldWww,
} from "react-icons/tb";
import { siteDescription, siteTitle } from "utils/lib";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Noto Sans",
    "sans-serif",
  ],
});

const Card = ({ icon, title, description }) => (
  <div className="mb-12 flex w-full flex-col items-center justify-center gap-6 text-center md:mb-0 md:w-1/2">
    <div className="rounded-full border border-border bg-muted p-12 text-6xl shadow-lg backdrop-blur-sm">
      {icon}
    </div>

    <h3 className="text-3xl">{title}</h3>

    <p className="w-2/3 text-center text-xl leading-relaxed text-muted-foreground">
      {description}
    </p>
  </div>
);

export const HomePage = () => (
  <>
    <Head>
      <meta name="author" content="William Bowman" />
    </Head>

    <NextSeo title={siteTitle} description={siteDescription} />

    <Home />
  </>
);

function Home() {
  return (
    <div className={`bg-background text-foreground ${nunito.className}`}>
      <nav className="flex h-6 items-center border-border bg-gradient-to-r from-emerald-300 to-cyan-300 p-3"></nav>

      <div className="flex flex-col gap-12 pb-20 lg:gap-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
            <h1 className="my-20 text-4xl font-extrabold leading-none tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Build beautiful pages in minutes
            </h1>

            <p className="mb-20 text-xl font-normal leading-10 text-muted-foreground sm:px-16 lg:text-3xl xl:px-48">
              The fastest way to create landing pages. No code, no hassle—just
              drag, drop, and publish.
            </p>

            <p className="mb-8 hidden text-lg font-normal text-muted-foreground sm:px-16 lg:text-xl xl:px-48">
              Start with one of our designs or a{" "}
              <Link href="/builder" className="text-foreground">
                blank template
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="container mx-auto mb-24 flex justify-center">
          <Link
            href="/templates"
            className="cursor-pointer rounded-xl bg-background p-12 text-center text-2xl text-foreground hover:bg-muted lg:w-1/3"
          >
            Get Started
          </Link>
        </div>

        <div className="mx-auto my-6 items-start gap-24 md:my-12 md:flex md:w-2/3">
          <Card
            icon={<SiTailwindcss />}
            title="Powered by Tailwind"
            description="Access thousands of utility classes instantly. Style anything with precision—colors, spacing, shadows, and more."
          />

          <Card
            icon={<TbPageBreak />}
            title="Multiple Pages"
            description="Build complete websites, not just landing pages. Add pages, link them together, create seamless navigation."
          />
        </div>

        <div className="mx-auto my-6 w-2/3 items-start gap-24 md:my-12 md:flex">
          <Card
            icon={<TbDeviceMobile />}
            title="Mobile Responsive"
            description="Design for mobile and desktop separately. Preview on any screen size and ensure your site looks perfect everywhere."
          />
          <Card
            icon={<TbWorldWww />}
            title="Custom Domains"
            description="Launch on a free pagehub.dev subdomain instantly, or connect your own custom domain when you're ready."
          />
        </div>

        <div className="mx-auto my-6 w-2/3 items-start gap-24 md:my-12 md:flex">
          <Card
            icon={<TbDeviceFloppy />}
            title="Auto-Save"
            description="Never lose your work. Every change saves automatically as you build. Come back anytime to continue where you left off."
          />
          <Card
            icon={<TbLogin />}
            title="No Login Required"
            description="Start building immediately—no signup needed. Each page gets a unique, private link. Ready to publish? Claim your subdomain with one click."
          />
        </div>

        <div className="mx-auto text-center text-5xl leading-relaxed md:w-1/2">
          Start building today.
        </div>

        <div className="container mx-auto flex justify-center">
          <Link
            href="/templates"
            className="cursor-pointer rounded-xl bg-background p-12 text-center text-2xl text-foreground hover:bg-muted lg:w-1/3"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-32 hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-24">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-8 text-4xl font-bold md:text-5xl">
              Integrate PageHub into your platform
            </h2>
            <p className="mb-12 text-xl leading-relaxed text-muted-foreground md:text-2xl">
              Seamlessly add page building to your product. Your users create
              pages, you control the data. Perfect for SaaS apps, CMSs, and
              platforms that need white-label page creation.
            </p>
            <div className="flex justify-center">
              <a
                href="mailto:gcphost@gmail.com"
                className="rounded-lg bg-background px-10 py-5 text-xl font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Contact Us for More Info
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Home;
