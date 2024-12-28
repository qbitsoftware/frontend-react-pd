import { cn } from "@/lib/utils"

interface ToastNotificationProps {
    toast: (options: object) => void // Adjust this type as needed
  }

export const useToastNotification = ({ toast }: ToastNotificationProps) => {
    const successToast = (message: string, description?: React.ReactNode) => {
      toast({
        title: message,
        description,
        className: cn(
          "bg-green-50 border-green-200 text-green-800 text-black",
          "dark:bg-green-900 dark:border-green-700 dark:text-green-100"
        ),
      })
    }
  
    const errorToast = (message: string, description?: React.ReactNode) => {
      toast({
        title: message,
        description,
        className: cn(
          "bg-red-50 border-red-200",
          "dark:bg-red-900 dark:border-red-700"
        ),
      })
    }
  
    return {
      successToast,
      errorToast,
    }
  }