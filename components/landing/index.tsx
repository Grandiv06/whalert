"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ContentWrapper } from "@/components/layout/landing/content-wrapper";
import BlogSection from "./components/blog";
import Comments from "./components/comments";
import LandingLogin from "./components/landingLogin";
import LatestSignal from "./components/latestSignal";
import PlatformsSection from "./components/platform";
import Questions from "./components/questions";
import Tools from "./components/tools";
import TraderSection from "./components/trader-section";
import TransparencySection from "./components/TransparencySection";
import WhySignal from "./components/whySignal";
import LandingPlans from "./components/plans";

const LandingPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("focus") !== "plans") return;

    const plansSection = document.getElementById("plans");
    if (!plansSection) return;

    window.scrollTo({ top: 0, behavior: "auto" });

    const scrollTimer = window.setTimeout(() => {
      plansSection.scrollIntoView({ behavior: "smooth", block: "start" });
      plansSection.classList.add("plans-arrival-pulse");
    }, 240);

    const cleanupTimer = window.setTimeout(() => {
      plansSection.classList.remove("plans-arrival-pulse");
    }, 2600);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(cleanupTimer);
      plansSection.classList.remove("plans-arrival-pulse");
    };
  }, [searchParams]);

  return (
    <div className="">
      <div
        className="relative min-h-[80vh] pt-32 sm:pt-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/landing-bg.svg)" }}
      >
        <ContentWrapper>
          <LandingLogin />
        </ContentWrapper>

        <ContentWrapper>
          <PlatformsSection />
        </ContentWrapper>
      </div>
      <div className="relative">
        {/* <div className="absolute -top-96 left-0 w-full h-full">
          <Image src={liner} alt="why-signal-bg" width={1000} height={1000} />
        </div>

        <div className="absolute top-20 left-0 rotate-180 w-full h-full">
          <Image src={liner} alt="why-signal-bg" width={1000} height={1000} />
        </div> */}

        <ContentWrapper>
          <WhySignal />
        </ContentWrapper>
      </div>

      <ContentWrapper>
        <Tools />
      </ContentWrapper>

      <ContentWrapper>
        <TransparencySection />
      </ContentWrapper>
      <div className="relative">
        {/* <div className="absolute -top-96 left-0 w-full h-full">
          <Image src={liner} alt="why-signal-bg" width={1000} height={1000} />
        </div>

        <div className="absolute top-20 left-0 rotate-180 w-full h-full">
          <Image src={liner} alt="why-signal-bg" width={1000} height={1000} />
        </div> */}

        <ContentWrapper>
          <TraderSection />
        </ContentWrapper>

        <ContentWrapper>
          <LatestSignal />
        </ContentWrapper>

        <ContentWrapper>
          <LandingPlans />
        </ContentWrapper>

        <ContentWrapper>
          <Comments />
        </ContentWrapper>

        <ContentWrapper>
          <Questions />
        </ContentWrapper>

        <ContentWrapper>
          <BlogSection />
        </ContentWrapper>
      </div>
    </div>
  );
};

export { LandingPage };
export default LandingPage;
