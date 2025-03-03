import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFadeIn } from "@/hooks/useFadeIn";
import { UpcomingTournaments } from "./-components/comingTournaments";

import { TopMonthPerformers } from "./-components/topPerformers";
import { TopFive } from "./-components/topFive";

export const Route = createFileRoute("/")({
  component: Index,
  // loader: async ({ context: { queryClient } }) => {
  //     const articledata = queryClient.ensureQueryData(UseGetArticles())
  //     return articledata
  // }
});

function Index() {
  const { t } = useTranslation();

  const [heroControls, heroRef] = useFadeIn();
  const [tournamentsControls, tournamentsRef] = useFadeIn(0.2);

  return (
    <div className="bg-gradient-to-b from-white to-gray-200">
      <div
        className="relative h-[30vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/test/table_tennis_background.png?height=1080&width=1920')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            className="text-center text-white"
            ref={heroRef}
            initial={{ opacity: 0, y: 20 }}
            animate={heroControls}
          >
            <h1 className="text-5xl font-bold mb-4">{t("homepage.title")}</h1>
            <p className="text-xl mb-8">{t("homepage.description")}</p>
            <Link to="/voistlused">
              <Button
                size="lg"
                className="bg-secondary hover:bg-blue-700 text-white"
              >
                {t("homepage.title_button")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.section
          className="mb-16"
          ref={tournamentsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={tournamentsControls}
        >
          <UpcomingTournaments />
        </motion.section>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          {/* <LatestArticles articles={articledata.data.slice(0, 3)} /> */}
        </motion.div>

        <div className="flex justify-center sm:flex-row flex-col gap-10 w-full mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex-1"
          >
            <TopFive gender="men" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex-1"
          >
            <TopFive gender="women" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className=""
        >
          <TopMonthPerformers />
        </motion.div>
      </div>
    </div>
  );
}
