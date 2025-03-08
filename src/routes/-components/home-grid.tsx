import { useRef, useEffect } from 'react';
import WidgetWrapper from "./widget-wrapper";
import NewsWidget from "./news-widget";
import CalendarWidget from "./calendar-widget";
import RatingWidget from "./rating-widget";
import Adboard from "./adboard";
import { Blog, Tournament, UserNew } from '@/types/types';
import { useTranslation } from 'react-i18next';


interface Props {
  tournaments: Tournament[] | null
  users: UserNew[] | null
  articles: Blog[] | null
}

const HomePageGrid = ({ tournaments, users, articles }: Props) => {
  const { t } = useTranslation();
  const newsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const adboardRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const adjustHeights = () => {
      if (calendarRef.current && newsRef.current) {
        const calendarHeight = calendarRef.current.clientHeight;
        newsRef.current.style.height = `${calendarHeight}px`;
      }

      if (adboardRef.current && ratingRef.current) {
        const adboardHeight = adboardRef.current.clientHeight;
        ratingRef.current.style.height = `${adboardHeight}px`;
      }
    };

    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    return () => {
      window.removeEventListener('resize', adjustHeights);
    };
  }, []);

  return (    <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
      
      <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2 z-10">
      
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 my-8 mb-16">
        <div className="sm:col-span-2 md:col-span-7 flex flex-col ">
          <WidgetWrapper heading={t("homepage.calendar.name")} addr="kalender">
            <div className="py-2 px-4 flex-grow" ref={newsRef}>
              <CalendarWidget tournaments={tournaments} />
            </div>
          </WidgetWrapper>
        </div>
        <div className="sm:col-span-2 md:col-span-5 flex flex-col">
          <WidgetWrapper heading={t("homepage.news.name")} addr="uudised">
            <div className="py-2 px-4 flex-grow" ref={calendarRef}>
              <NewsWidget blogs={articles} />
            </div>
          </WidgetWrapper>
        </div>
      </div>
      
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 my-8">
        <div className="sm:col-span-1 md:col-span-7 flex flex-col">
          <WidgetWrapper heading={t("homepage.ranking.name")} addr="reiting">
            <div className="py-2 px-4 flex-grow" ref={ratingRef}>
              <RatingWidget users={users} />
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
      
    </div>
  );
};

export default HomePageGrid;