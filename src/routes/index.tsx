import { createFileRoute } from "@tanstack/react-router";
import HomePageGrid from "./-components/home-grid";
import { UseGetTournaments, type TournamentsResponse } from "@/queries/tournaments";
import { UseGetUsers, type UsersResponse } from "@/queries/users";
import { UseGetBlogsOption, type BlogsResponseUser } from "@/queries/blogs";
import ErrorPage from "@/components/error";
import axios from "axios";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context: { queryClient } }) => {
    let tournaments: TournamentsResponse = {
      data: [],
      message: "Default empty state",
      error: null
    };
    
    let users: UsersResponse = { 
      data: [],
      message: "Default empty state",
      error: null 
    };
    
    let articles_data: BlogsResponseUser = { 
      data: {
        blogs: [],
        total_pages: 0
      },
      message: "Default empty state",
      error: null 
    };
    
    try {
      tournaments = await queryClient.ensureQueryData(UseGetTournaments());
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Tournaments API returned 404");
      } else {
        throw error; 
      }
    }
    
    try {
      users = await queryClient.ensureQueryData(UseGetUsers());
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Users API returned 404");
      } else {
        throw error;
      }
    }
    
    try {
      articles_data = await queryClient.ensureQueryData(UseGetBlogsOption()) as BlogsResponseUser;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Blogs API returned 404");
      } else {
        throw error;
      }
    }
    
    const dataStatus = {
      tournamentsEmpty: !tournaments?.data?.length,
      usersEmpty: !users?.data?.length,
      articlesEmpty: !articles_data?.data?.blogs?.length
    };
    
    return { tournaments, users, articles_data, dataStatus };
  },
  errorComponent: () => <ErrorPage />
});

function Index() {
  const { tournaments, users, articles_data, dataStatus } = Route.useLoaderData();

  return (
    <HomePageGrid 
      tournaments={tournaments?.data} 
      users={users?.data} 
      articles={articles_data?.data?.blogs}
      dataStatus={dataStatus}
    />
  );
}