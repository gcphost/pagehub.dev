import Footer from "components/footer";
import Head from "next/head";
import Link from "next/link";
import { templates } from "utils/templates";

const nunitoStyle = `
  * {
    font-family: 'Nunito', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
  }
`;

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
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: nunitoStyle }} />
      </Head>
      <div className="bg-gray-800 text-white pb-32">
        <nav className="p-3 border-gray-200 bg-gradient-to-r from-emerald-300 to-cyan-300 h-20 flex items-center">
          <div className="container flex flex-wrap items-center justify-between mx-auto"></div>
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
                Start with one of our designs or a{" "}
                <Link href="/builder" className="text-white">
                  blank template
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="pb-44 gap-6 mx-auto grid lg:grid-cols-2 xl:grid-cols-3">
            {templates.map((tpl, key) => (
              <figure
                key={key}
                className="w-[300px] md:w-[400px] h-[290px] bg-center bg-cover flex flex-cl rounded-2xl border-primary-400/50 border-2 mb-3 group"
                style={{ backgroundImage: `url(${tpl.image})` }}
              >
                <Link href={`/build/${tpl.href}`}></Link>

                <div className="w-full h-full bg-gray-500/50  hidden group-hover:flex transition p-3">
                  <div className="flex gap-3 self-end justify-between w-full">
                    <div className="w-full">
                      <Link href={`/build/${tpl.href}`} target="_blank">
                        <div className="bg-primary-500 px-3 py-3 rounded-lg w-full text-center border border-primary-700 hover:bg-primary-400/90">
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
            <Link
              href="/build"
              className="bg-primary-500 hover:bg-primary-400 cursor-pointer text-white text-center text-2xl w-full m-3 lg:w-1/3 p-12 rounded-xl"
            >
              Start from scratch
            </Link>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Examples;
