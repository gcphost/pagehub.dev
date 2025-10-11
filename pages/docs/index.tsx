import Head from "next/head";
import Link from "next/link";

const DocsIndex = () => {
  const docs = [
    {
      title: "Selectors",
      description:
        "Complete reference for all PageHub selector components and their properties",
      href: "/docs/selectors",
      icon: "🎨",
    },
  ];

  return (
    <>
      <Head>
        <title>Documentation - PageHub</title>
        <meta
          name="description"
          content="PageHub documentation and API reference"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-5xl font-bold text-foreground">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about PageHub
            </p>
          </div>

          {/* Documentation Cards */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <Link key={doc.href} href={doc.href}>
                <div className="cursor-pointer rounded-xl border border-border bg-background p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="mb-4 text-4xl">{doc.icon}</div>
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    {doc.title}
                  </h2>
                  <p className="text-muted-foreground">{doc.description}</p>
                  <div className="mt-4 flex items-center font-medium text-blue-600">
                    View Documentation
                    <svg
                      className="ml-2 size-4"
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
          <div className="rounded-xl border border-border bg-background p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <a
                href="/page-builder-api"
                className="flex items-center gap-3 rounded-lg p-4 transition-colors hover:bg-background"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Page Builder API
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    API endpoints and usage
                  </p>
                </div>
              </a>
              <a
                href="/templates"
                className="flex items-center gap-3 rounded-lg p-4 transition-colors hover:bg-background"
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-foreground">Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Pre-built page templates
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-primary-foreground shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg"
            >
              <svg
                className="size-5"
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
