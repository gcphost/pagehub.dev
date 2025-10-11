import Head from "next/head";
import Link from "next/link";

const DocsIndex = () => {
  const docs = [
    {
      title: "Selectors",
      description: "Complete reference for all PageHub selector components and their properties",
      href: "/docs/selectors",
      icon: "🎨",
    },
  ];

  return (
    <>
      <Head>
        <title>Documentation - PageHub</title>
        <meta name="description" content="PageHub documentation and API reference" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about PageHub
            </p>
          </div>

          {/* Documentation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {docs.map((doc) => (
              <Link key={doc.href} href={doc.href}>
                <div className="bg-background rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 cursor-pointer border border-border">
                  <div className="text-4xl mb-4">{doc.icon}</div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {doc.title}
                  </h2>
                  <p className="text-muted-foreground">{doc.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    View Documentation
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="bg-background rounded-xl shadow-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/page-builder-api"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-background transition-colors"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-semibold text-foreground">Page Builder API</h3>
                  <p className="text-sm text-muted-foreground">API endpoints and usage</p>
                </div>
              </a>
              <a
                href="/templates"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-background transition-colors"
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-foreground">Templates</h3>
                  <p className="text-sm text-muted-foreground">Pre-built page templates</p>
                </div>
              </a>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-primary-foreground rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocsIndex;

