import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { LoginFormData } from "@/routes/login";
import { axiosInstance } from "./axiosconf";
import { User, UserLogin } from "@/types/users";
// import { RegisterFormData } from "@/routes/register";
import { RegisterFormData } from "@/types/users";

export interface LoginResponse {
  data: UserLogin;
  message: string;
  error: string | null;
}

export interface UsersResponse {
  data: User[];
  message: string;
  error: string | null;
}

export const useGetUser = () => {
  return queryOptions<LoginResponse>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/check", {
        withCredentials: true,
      });
      return data;
    },
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: LoginFormData) => {
      const { data } = await axiosInstance.post("/auth/login", formData, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useGetCurrentUserQuery = () => {
  return useQuery<LoginResponse>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/auth/check`, {
        withCredentials: true,
      });
      return data;
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export const UseGetCurrentUser = () => {
  return queryOptions<LoginResponse>({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/auth/check`, {
        withCredentials: true,
      });
      return data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        `/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], {
        data: null,
        message: "",
        error: null,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.refetchQueries({ queryKey: ["user"] });
    },
  });
};

export const UseGetUsersDebounce = (searchTerm: string) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", searchTerm],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/user_suggestions?search=${searchTerm}`,
        {
          withCredentials: true,
        },
      );
      return data;
    },
    enabled: !!searchTerm,
  });
};

export const UseGetUsers = (searchTerm?: string) => {
  if (searchTerm === undefined) {
    searchTerm = "";
  }
  return queryOptions<UsersResponse>({
    queryKey: ["users", searchTerm],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/users?search=${searchTerm}`,
        {
          withCredentials: true,
        },
      );
      return data;
    },
    enabled: !!searchTerm,
  });
};

export const fetchUserByName = async (name: string): Promise<User | null> => {
  try {
    const { data } = await axiosInstance.get(`/api/v1/users?search=${name}`, {
      withCredentials: true,
    });
    return data.data[0] || null;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      const { data } = await axiosInstance.post("/auth/register", formData, {
        withCredentials: true,
      });
      return data;
    },
  });
};

export function useUsersCount() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/v1/user_suggestions", {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return {
    count: data?.data?.length || 0,
    isLoading,
  };
}

export interface FeedbackForm {
  name: string;
  title: string;
  body: string;
}

export const sendUserFeedback = async (feedback: FeedbackForm) => {
  try {
    await axiosInstance.post("/api/v1/feedback", feedback);
    return { success: true };
  } catch (error) {
    console.error("Failed to send feedback:", error);
    return { success: false, error };
  }
};

