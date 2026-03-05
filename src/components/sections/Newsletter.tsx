import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="container px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-green-950 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
          {/* Background Gradient & Effects */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.lime.100),white)] opacity-20" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-green-600/10 ring-1 ring-green-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
          
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 -z-10 bg-green-950/90 mix-blend-multiply" />
          
          {/* Decorative shapes */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx="512" cy="512" r="512" fill="url(#gradient-newsletter)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient-newsletter">
                <stop stopColor="#16a34a" /> {/* green-600 */}
                <stop offset="1" stopColor="#14532d" /> {/* green-900 */}
              </radialGradient>
            </defs>
          </svg>

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay Connected
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Stay updated on our latest programs, events, and impact stories. Be part of the change.
            </p>
            
            <div className="mt-10 flex flex-col gap-y-4 sm:flex-row sm:justify-center sm:gap-x-6 items-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-lime-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 h-12 w-full sm:w-80"
              />
              <Button 
                variant="default" 
                size="lg" 
                className="flex-none rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 h-12 w-full sm:w-auto"
              >
                Subscribe
              </Button>
            </div>
            
            <p className="mt-4 text-xs leading-5 text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
