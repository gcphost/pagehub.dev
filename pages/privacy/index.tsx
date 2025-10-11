import Footer from "components/footer";
import { NextSeo } from "next-seo";
import Link from "next/link";

function Privacy() {
  return (
    <>
      <NextSeo title="Privacy Policy" description="Privacy Policy" />

      <div className="bg-muted-foreground pb-32 text-primary-foreground">
        <nav className="flex h-20 items-center border-border bg-gradient-to-r from-emerald-300 to-cyan-300 p-3"></nav>

        <div className="flex flex-col gap-12">
          <div className="container mx-auto">
            <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
              <h1 className="my-20 text-4xl font-extrabold leading-none tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>

              <div className="flex flex-col gap-6 text-left leading-8">
                <p className="mx-auto mb-12 text-center text-2xl lg:w-2/3">
                  At Pagehub, we take your privacy seriously. This privacy
                  policy outlines what data we collect, how we use it, and how
                  we protect it. By using our service, you agree to the terms
                  outlined in this privacy policy.
                </p>
                <h3 className="mb-2 text-lg font-bold">Data We Collect:</h3>
                <p className="mb-2">
                  When you use Pagehub, we collect your email address and avatar
                  for identification purposes. We also collect data related to
                  the pages you create on our platform, including but not
                  limited to text, images, and other media. We may collect data
                  about your usage of our service through Google Analytics and
                  Vercel Analytics.
                </p>
                <h3 className="mb-2 text-lg font-bold">
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
                <h3 className="mb-2 text-lg font-bold">Data Sharing:</h3>
                <p className="mb-2">
                  We do not share your personal information with third parties
                  except as required by law or as necessary to provide you with
                  our service. We may share non-personal, aggregated data with
                  third parties for marketing or research purposes.
                </p>
                <h3 className="mb-2 text-lg font-bold">Data Security:</h3>
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
            <Link
              href="/build"
              className="m-3 w-full cursor-pointer rounded-xl bg-primary p-12 text-center text-2xl text-primary-foreground hover:bg-muted-foreground lg:w-1/3"
            >
              Start building!
            </Link>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Privacy;
