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
  <div className="flex w-1/2 flex-col items-center justify-center gap-6 text-center">
    <div className="rounded-full border border-purple-900 bg-purple-800 p-12 text-6xl">
      {icon}
    </div>

    <h3 className="text-3xl">{title}</h3>

    <p className="w-2/3 text-center text-xl leading-relaxed text-muted-foreground">
      {description}
    </p>
  </div>
);

function Examples() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: nunitoStyle }} />
      </Head>
      <div className="bg-background pb-32 text-foreground">
        <nav className="flex h-20 items-center border-border bg-gradient-to-r from-emerald-300 to-cyan-300 p-3">
          <div className="container mx-auto flex flex-wrap items-center justify-between"></div>
        </nav>

        <div className="flex flex-col gap-12">
          <div className="container mx-auto">
            <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
              <h1 className="my-20 text-4xl font-extrabold leading-none tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Templates to get you going
              </h1>

              <p className="mb-20 text-xl font-normal leading-10 text-muted-foreground sm:px-16 lg:text-3xl xl:px-48">
                The fastest way to start, pick a style you like.
              </p>

              <p className="mx-auto w-2/3 font-normal leading-8 text-muted-foreground sm:px-16 lg:text-xl xl:px-48"></p>

              <p className="hidden text-lg font-normal text-muted-foreground sm:px-16 lg:text-xl xl:px-48">
                Start with one of our designs or a{" "}
                <Link href="/builder" className="text-foreground">
                  blank template
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mx-auto grid gap-6 pb-44 lg:grid-cols-2 xl:grid-cols-3">
            {templates.map((tpl, key) => (
              <figure
                key={key}
                className="flex-cl border-primary/50 group mb-3 flex h-[290px] w-[300px] rounded-2xl border-2 bg-cover bg-center md:w-[400px]"
                style={{ backgroundImage: `url(${tpl.image})` }}
              >
                <Link href={`/build/${tpl.href}`}></Link>

                <div className="hidden size-full bg-muted p-3 text-muted-foreground transition group-hover:flex">
                  <div className="flex w-full justify-between gap-3 self-end">
                    <div className="w-full">
                      <Link href={`/build/${tpl.href}`} target="_blank">
                        <div className="hover:bg-primary/90 w-full rounded-lg border border-primary bg-primary p-3 text-center">
                          Build
                        </div>
                      </Link>
                    </div>
                    <div className="w-full">
                      <Link href={`${tpl.demo}`} target="_blank">
                        <div className="hover:bg-muted/90 w-full rounded-lg bg-muted p-3 text-center">
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
              className="m-3 w-full cursor-pointer rounded-xl bg-primary p-12 text-center text-2xl text-foreground hover:bg-primary lg:w-1/3"
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
