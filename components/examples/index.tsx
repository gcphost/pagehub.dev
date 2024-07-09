import Footer from 'components/footer';
import Link from 'next/link';
import { templates } from 'utils/templates';

const Card = ({ icon, title, description }) => (
  <div className="text-center flex gap-6 flex-col justify-center items-center w-1/2">
    <div className="border border-purple-900 bg-purple-800 rounded-full p-12  text-6xl">
      {icon}
    </div>

    <h3 className="text-3xl">{title}</h3>

    <p className="w-2/3 text-center text-xl text-gray-300 leading-relaxed">
      {description}
    </p>
  </div>
);

function Examples() {
  return (
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
              Templates to get you going
            </h1>

            <p className="mb-20 leading-10 text-xl font-normal lg:text-3xl sm:px-16 xl:px-48 text-gray-400">
              The fastest way to start, pick a style you like.
            </p>

            <p className="w-2/3 mx-auto leading-8  font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400"></p>

            <p className="text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400 hidden">
              Start with one of our designs or a{' '}
              <Link href="/builder" legacyBehavior>
                <a className="text-white ">blank template</a>
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="pb-44 gap-6 mx-auto grid lg:grid-cols-2 xl:grid-cols-3">
          {templates.map((tpl, key) => (
              <figure
                key={key}
                className="w-[300px] md:w-[400px] h-[290px] bg-center bg-cover flex flex-cl rounded-2xl border-violet-400/50 border-2 mb-3 group"
                style={{ backgroundImage: `url(${tpl.image})` }}
              >
                <Link href={`/build/${tpl.href}`}></Link>

                <div className="w-full h-full bg-gray-500/50  hidden group-hover:flex transition p-3">
                  <div className="flex gap-3 self-end justify-between w-full">
                    <div className="w-full">
                      <Link href={`/build/${tpl.href}`} target="_blank">
                        <div className="bg-violet-500 px-3 py-3 rounded-lg w-full text-center border border-violet-700 hover:bg-violet-400/90">
                          Build
                        </div>
                      </Link>
                    </div>
                    <div className="w-full">
                      <Link href={`${tpl.demo}`} target="_blank">
                        <div className="bg-gray-500 px-3 py-3 rounded-lg w-full text-center hover:bg-gray-400/90">
                          Demo
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </figure>
          ))}
        </div>

        <div className="container mx-auto flex justify-center">
          <a
            href="/build"
            className="bg-violet-500 hover:bg-violet-400 cursor-pointer text-white text-center text-2xl w-full m-3 lg:w-1/3 p-12 rounded-xl"
          >
            Start from scratch
          </a>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Examples;
