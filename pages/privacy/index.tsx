import Footer from 'components/footer';
import { NextSeo } from 'next-seo';

function Privacy() {
  return (
    <>
      <NextSeo title="Privacy Policy" description="Privacy Policy" />

      <div className="bg-gray-800 text-white pb-32">
        <nav className="p-3 border-gray-200 rounded bg-gradient-to-r from-emerald-300 to-cyan-300 h-20 flex items-center">
          <div className="container flex flex-wrap items-center justify-between mx-auto">
            <a href="#" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrapsty  fill-white"></span>
            </a>
            <button
              data-collapse-toggle="navbar-hamburger"
              type="button"
              className="hidden  items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-hamburger"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="hidden w-full" id="navbar-hamburger">
              <ul className="flex flex-col mt-4 rounded-lg bg-gray-50">
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded"
                    aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className=" flex flex-col gap-12">
          <div className="container mx-auto ">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
              <h1 className="mb-20 mt-20 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>

              <div className="text-left flex flex-col gap-6 leading-8">
                <p className="text-center text-2xl lg:w-2/3 mx-auto mb-12">
                  At Pagehub, we take your privacy seriously. This privacy
                  policy outlines what data we collect, how we use it, and how
                  we protect it. By using our service, you agree to the terms
                  outlined in this privacy policy.
                </p>
                <h3 className="text-lg font-bold mb-2">Data We Collect:</h3>
                <p className="mb-2">
                  When you use Pagehub, we collect your email address and avatar
                  for identification purposes. We also collect data related to
                  the pages you create on our platform, including but not
                  limited to text, images, and other media. We may collect data
                  about your usage of our service through Google Analytics and
                  Vercel Analytics.
                </p>
                <h3 className="text-lg font-bold mb-2">
                  How We Use Your Data:
                </h3>
                <p className="mb-2">
                  We use your email address and avatar to identify you when you
                  log in to Pagehub. We use the data related to the pages you
                  create to provide you with our web page builder service. We
                  may use data collected through Google Analytics and Vercel
                  Analytics to improve our service and to analyze trends and
                  usage patterns.
                </p>
                <h3 className="text-lg font-bold mb-2">Data Sharing:</h3>
                <p className="mb-2">
                  We do not share your personal information with third parties
                  except as required by law or as necessary to provide you with
                  our service. We may share non-personal, aggregated data with
                  third parties for marketing or research purposes.
                </p>
                <h3 className="text-lg font-bold mb-2">Data Security:</h3>
                <p className="mb-2">
                  We take reasonable measures to protect your data from
                  unauthorized access or disclosure. We use industry-standard
                  security measures to protect your personal information, and we
                  restrict access to your data to only those employees or
                  contractors who need it to provide you with our service.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto flex justify-center">
            <a
              href="/build"
              className="bg-violet-500 hover:bg-violet-400 cursor-pointer text-white text-center text-2xl w-full m-3 lg:w-1/3 p-12 rounded-xl"
            >
              Start building!
            </a>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Privacy;
