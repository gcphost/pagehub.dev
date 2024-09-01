import Footer from "components/footer";
import { NextSeo } from "next-seo";
import Link from "next/link";

function Terms() {
  return (
    <>
      <NextSeo title="Terms of Service" description="Terms of Service" />

      <div className="bg-gray-800 text-white pb-32">
        <nav className="p-3 border-gray-200 bg-gradient-to-r from-emerald-300 to-cyan-300 h-20 flex items-center"></nav>

        <div className=" flex flex-col gap-12">
          <div className="container mx-auto ">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
              <h1 className="mb-20 mt-20 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
                Terms of Service
              </h1>

              <div className="text-left flex flex-col gap-6 leading-8">
                <p className="text-center text-2xl lg:w-2/3 mx-auto mb-12">
                  By using Pagehub, you agree to the following terms of service.
                  Please read them carefully.
                </p>
                <h3 className="text-lg font-bold mb-2">1. Use of Service:</h3>
                <p className="mb-2">
                  You may use Pagehub only for lawful purposes and in accordance
                  with these terms of service. You agree not to use our service:
                </p>
                <ul className="list-disc list-inside mb-2">
                  <li>To infringe on the rights of others;</li>
                  <li>
                    To engage in conduct that is offensive, defamatory, or
                    otherwise harmful;
                  </li>
                  <li>To transmit viruses or other malicious code;</li>
                  <li>
                    To collect information from other users without their
                    consent;
                  </li>
                  <li>
                    To interfere with the proper functioning of our service.
                  </li>
                </ul>
                <h3 className="text-lg font-bold mb-2">2. User Accounts:</h3>
                <p className="mb-2">
                  To use our service, you may be required to create an account.
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for any activities that occur
                  under your account. You agree to notify us immediately of any
                  unauthorized access to or use of your account.
                </p>
                <h3 className="text-lg font-bold mb-2">
                  3. Intellectual Property:
                </h3>
                <p className="mb-2">
                  All content and materials included on our service, including
                  but not limited to text, graphics, logos, images, and
                  software, are the property of Pagehub or its licensors and are
                  protected by intellectual property laws. You may not use,
                  reproduce, distribute, or display any content or materials
                  from our service without our prior written consent.
                </p>
                <h3 className="text-lg font-bold mb-2">
                  4. Limitation of Liability:
                </h3>
                <p className="mb-2">
                  In no event shall Pagehub or its affiliates be liable for any
                  direct, indirect, incidental, special, or consequential
                  damages arising out of or in any way connected with the use of
                  our service, whether based on contract, tort, strict
                  liability, or any other legal theory.
                </p>
                <h3 className="text-lg font-bold mb-2">
                  5. Modification of Terms:
                </h3>
                <p className="mb-2">
                  We reserve the right to modify these terms of service at any
                  time without prior notice. By continuing to use our service
                  after any modifications have been made, you agree to be bound
                  by the revised terms.
                </p>

                <h3 className="text-lg font-bold mb-2">
                  6. User-Generated Content:
                </h3>
                <p className="mb-2">
                  Pagehub allows users to generate and post content on our
                  service, including but not limited to text, images, and
                  videos. By posting content on our service, you grant Pagehub a
                  non-exclusive, transferable, sub-licensable, royalty-free,
                  worldwide license to use, modify, and distribute your content
                  in any media format and through any media channel now known or
                  later developed. You represent and warrant that you own or
                  have the necessary licenses, rights, consents, and permissions
                  to grant this license to Pagehub.
                </p>
                <p className="mb-2">
                  You acknowledge and agree that you are solely responsible for
                  any content you post on our service and the consequences of
                  posting such content. You represent and warrant that your
                  content is accurate, does not violate any laws or regulations,
                  and does not infringe on the rights of any third party.
                  Pagehub reserves the right to remove any content that violates
                  these terms of service or that we believe is otherwise
                  offensive, harmful, or inappropriate.
                </p>
                <h3 className="text-lg font-bold mb-2">7. Indemnification:</h3>
                <p className="mb-2">
                  You agree to indemnify and hold Pagehub and its affiliates,
                  officers, agents, employees, and partners harmless from any
                  claim or demand, including reasonable attorneys&apos; fees,
                  made by any third party due to or arising out of your use of
                  our service, your violation of these terms of service, or your
                  violation of any rights of another.
                </p>
                <h3 className="text-lg font-bold mb-2">8. Governing Law:</h3>
                <p className="mb-2">
                  These terms of service and your use of our service shall be
                  governed by and construed in accordance with the laws of Los
                  Angeles, CA, USA. Any dispute arising out of or related to
                  these terms of service or your use of our service shall be
                  resolved exclusively in the courts of Los Angeles County.
                </p>
                <h3 className="text-lg font-bold mb-2">9. Termination:</h3>
                <p className="mb-2">
                  Pagehub reserves the right to terminate your access to our
                  service at any time and for any reason without prior notice.
                  Upon termination, your right to use our service will
                  immediately cease.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto flex justify-center">
            <Link
              href="/build"
              className="bg-violet-500 hover:bg-violet-400 cursor-pointer text-white text-center text-2xl w-full m-3 lg:w-1/3 p-12 rounded-xl"
            >
              Build a page today!
            </Link>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Terms;
