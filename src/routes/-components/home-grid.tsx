import { useRef } from "react";
import WidgetWrapper from "./widget-wrapper";
import NewsWidget from "./news-widget";
import CalendarWidget from "./calendar-widget";
import RatingWidget from "./rating-widget";
import Adboard from "./adboard";
import { Tournament } from "@/types/tournaments";
import { User } from "@/types/users";
import { Blog } from "@/types/blogs"
import { useTranslation } from "react-i18next";

interface DataStatus {
  tournamentsEmpty: boolean;
  usersEmpty: boolean;
  articlesEmpty: boolean;
}

interface Props {
  tournaments: Tournament[] | null;
  users: User[] | null;
  articles: Blog[] | null;
  dataStatus: DataStatus;
}

const HomePageGrid = ({ tournaments, users, articles, dataStatus }: Props) => {
  const { t } = useTranslation();
  const newsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const adboardRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-[1440px] min-h-screen mx-auto md:px-4 lg:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 my-8 mb-16 space-y-8 md:space-y-0">
        <div className="sm:col-span-2 md:col-span-7 flex flex-col ">
          <WidgetWrapper heading={t("homepage.calendar.name")} addr="voistlused">
            <div className="py-2 px-4 flex-grow" ref={newsRef}>
              <CalendarWidget
                tournaments={tournaments || []}
                isEmpty={false}
              />
            </div>
          </WidgetWrapper>
        </div>
        <div className="sm:col-span-2 md:col-span-5 flex flex-col">
          <WidgetWrapper heading={t("homepage.news.name")} addr="uudised">
            <div className="py-2 px-4 flex-grow" ref={calendarRef}>
              <NewsWidget blogs={articles} isEmpty={dataStatus.articlesEmpty} />
            </div>
          </WidgetWrapper>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 my-8">
        <div className="sm:col-span-1 md:col-span-7 flex flex-col">
          <WidgetWrapper heading={t("homepage.ranking.name")} addr="reiting">
            <div className="py-2 px-4 pr-8 flex-grow" ref={ratingRef}>
              <RatingWidget users={users} isEmpty={dataStatus.usersEmpty} />
            </div>
          </WidgetWrapper>
        </div>
        <div className="sm:col-span-1 md:col-span-5 flex flex-col">
          <div className="h-full">
            <div className="p-2 flex-grow" ref={adboardRef}>
              <Adboard />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row"></div>
    </div>
  );
};

export default HomePageGrid;
