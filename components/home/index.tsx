import Footer from "components/footer";
import { NextSeo } from "next-seo";
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

const Card = ({ icon, title, description }) => (
  <div className="text-center flex gap-6 flex-col justify-center items-center w-full mb-12 md:mb-0 md:w-1/2">
    <div className="border border-purple-900 bg-purple-800 rounded-full p-12  text-6xl">
      {icon}
    </div>

    <h3 className="text-3xl">{title}</h3>

    <p className="w-2/3 text-center text-xl text-gray-300 leading-relaxed">
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
    <div className="bg-gray-800 text-white">
      <nav className="p-3 border-gray-200 bg-gradient-to-r from-emerald-300 to-cyan-300 h-20 flex items-center"></nav>

      <div className=" flex flex-col gap-12 pb-20">
        <div className="container mx-auto ">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <h1 className="mb-20 mt-20 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              Build beautiful pages in minutes
            </h1>

            <p className="mb-20 leading-10 text-xl font-normal lg:text-3xl sm:px-16 xl:px-48 text-gray-400">
              The fastest way to create landing pages. No code, no hassle—just drag, drop, and publish.
            </p>

            <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400 hidden">
              Start with one of our designs or a{" "}
              <Link href="/builder" className="text-white ">
                blank template
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="container mx-auto flex justify-center mb-24">
          <Link
            href="/templates"
            className="bg-primary-500 hover:bg-primary-400 cursor-pointer text-white text-center text-2xl lg:w-1/3 p-12 rounded-xl"
          >
            Get Started Free
          </Link>
        </div>

        <div className="my-6 md:my-12 mx-auto md:flex gap-24 md:w-2/3  items-start">
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

        <div className="my-6 md:my-12 mx-auto md:flex gap-24 w-2/3  items-start">
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

        <div className="my-6 md:my-12 mx-auto md:flex gap-24 w-2/3  items-start">
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

        <div className="text-center text-5xl md:w-1/2 mx-auto leading-relaxed">
          Free during beta. No credit card required.
        </div>

        <div className="container mx-auto flex justify-center">
          <Link
            href="/templates"
            className="bg-primary-500 hover:bg-primary-400 cursor-pointer text-white text-center text-2xl lg:w-1/3 p-12 rounded-xl"
          >
            Get Started Free
          </Link>
        </div>

        <div className="mt-32 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-24">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Integrate PageHub into your platform
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Seamlessly add page building to your product. Your users create pages, you control the data.
              Perfect for SaaS apps, CMSs, and platforms that need white-label page creation.
            </p>
            <div className="flex justify-center">
              <a
                href="mailto:gcphost@gmail.com"
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-10 py-5 rounded-lg text-xl transition-colors"
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
