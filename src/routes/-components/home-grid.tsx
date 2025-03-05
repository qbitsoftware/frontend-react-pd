import { useRef, useEffect, useState } from 'react'
import WidgetWrapper from "./widget-wrapper";
import NewsWidget from "./news-widget";
import CalendarWidget from "./calendar-widget";
import { Blog, Tournament, UserNew } from '@/types/types';
import Adboard from "./adboard";
import RatingWidget from "./rating-widget";
import { useTranslation } from 'react-i18next';

interface Props {
  tournaments: Tournament[] | null
  users: UserNew[] | null
  articles: Blog[] | null
}

const HomePageGrid = ({ tournaments, users, articles }: Props) => {
  const newsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const adboardRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();

    const updateNewsCalendarHeight = () => {
      if (newsRef.current && calendarRef.current) {
        if (isMobile) {
          // Set a smaller height for mobile
          calendarRef.current.style.height = '300px';
        } else {
          // On desktop, match news height
          const newsHeight = newsRef.current.offsetHeight;
          calendarRef.current.style.height = `${newsHeight}px`;
        }
      }
    };

    // Update rating widget height based on adboard container
    const updateAdboardRatingHeight = () => {
      if (adboardRef.current && ratingRef.current) {
        const adboardHeight = adboardRef.current.offsetHeight;
        ratingRef.current.style.height = `${adboardHeight}px`;
      }
    };

    const updateAllHeights = () => {
      updateNewsCalendarHeight();
      updateAdboardRatingHeight();
    };

    updateAllHeights();

    // Set up resize observer for content changes
    const resizeObserver = new ResizeObserver(updateAllHeights);

    // Store current ref values for cleanup
    const currentNewsRef = newsRef.current;
    const currentAdboardRef = adboardRef.current;

    if (currentNewsRef) {
      resizeObserver.observe(currentNewsRef);
    }

    if (currentAdboardRef) {
      resizeObserver.observe(currentAdboardRef);
    }

    const handleResize = () => {
      checkMobile();
      updateAllHeights();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up observer
      if (currentNewsRef) {
        resizeObserver.unobserve(currentNewsRef);
      }

      if (currentAdboardRef) {
        resizeObserver.unobserve(currentAdboardRef);
      }

      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2 gap-y-4 p-1 lg:p-6 max-w-[1440px] mx-auto">
      <div className="sm:col-span-2 md:col-span-8 flex flex-col ">
        <WidgetWrapper heading={t("homepage.news.name")} view_all={t("homepage.news.view_all")} addr="uudised">
          <div className="py-2 px-4  flex-grow" ref={newsRef}>
            <NewsWidget blogs={articles} />
          </div>
        </WidgetWrapper>
      </div>
      <div className="sm:col-span-2 md:col-span-4 flex flex-col">
        <WidgetWrapper heading={t("homepage.calendar.name")} view_all={t("homepage.calendar.view_all")} addr="kalender">
          <div className="py-2 px-4 flex-grow" ref={calendarRef}>
            <CalendarWidget tournaments={tournaments} />
          </div>
        </WidgetWrapper>
      </div>
      <div className="sm:col-span-1 md:col-span-5 flex flex-col">
        <div className="h-full">
          <div className="p-2  flex-grow" ref={adboardRef}>
            <Adboard />
          </div>
        </div>
      </div>
      <div className="sm:col-span-1 md:col-span-7 flex flex-col">
        <WidgetWrapper heading={t("homepage.ranking.name")} view_all={t("homepage.ranking.view_all")} addr="reiting">
          <div className="py-2 px-4  flex-grow" ref={ratingRef}>
            <RatingWidget users={users} />
          </div>
        </WidgetWrapper>
      </div>
    </div>

  )
}

export default HomePageGrid
