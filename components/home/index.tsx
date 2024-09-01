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
              Create your own landing pages!
            </h1>

            <p className="mb-20 leading-10 text-xl font-normal lg:text-3xl sm:px-16 xl:px-48 text-gray-400">
              Begin crafting your own <strong>responsive web pages</strong> and
              secure your <strong>pagehub.dev</strong> link today!
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
          <a
            href="/templates"
            className="bg-violet-500 hover:bg-violet-400 cursor-pointer text-white text-center text-2xl lg:w-1/3 p-12 rounded-xl"
          >
            Start Today, Free!
          </a>
        </div>

        <div className="my-6 md:my-12 mx-auto md:flex gap-24 md:w-2/3  items-start">
          <Card
            icon={<SiTailwindcss />}
            title="TailwindCSS"
            description="Styling simplified. We provide all the classes at your finger tips with room to spare. No more guessing what sizes or colors, pick and choose quickly."
          />

          <Card
            icon={<TbPageBreak />}
            title="Multiple Pages"
            description="Adding a new page to your website is fast and easy. "
          />
        </div>

        <div className="my-6 md:my-12 mx-auto md:flex gap-24 w-2/3  items-start">
          <Card
            icon={<TbDeviceMobile />}
            title="Mobile First"
            description="Start by creating an attractive mobile site first—it's crucial. You can refine things for other screen sizes when you're ready."
          />
          <Card
            icon={<TbWorldWww />}
            title="Custom Domains"
            description="No domain? No worries! Opt for our provided one or bring your own custom domain to create your unique online presence. Customize it to fit your style and preferences."
          />
        </div>

        <div className="my-6 md:my-12 mx-auto md:flex gap-24 w-2/3  items-start">
          <Card
            icon={<TbDeviceFloppy />}
            title="Auto-saving"
            description="Rest assured knowing your work is safe with auto-saving. Every change is automatically saved as a draft—reload the page or come back later without worry. Press 'save' to publish your work and go live whenever you're ready."
          />
          <Card
            icon={<TbLogin />}
            title="No Login Required!"
            description="Each page is assigned a unique ID, which serves as your private link. Keep it secure and avoid sharing it. Name your page and save it to secure your own subdomain for safe browsing."
          />
        </div>

        <div className="text-center text-5xl md:w-1/2 mx-auto leading-relaxed">
          Try all the features for free during the beta!
        </div>

        <div className="container mx-auto flex justify-center">
          <a
            href="/templates"
            className="bg-violet-500 hover:bg-violet-400 cursor-pointer text-white text-center text-2xl lg:w-1/3 p-12 rounded-xl"
          >
            Start Today, Free!
          </a>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Home;
