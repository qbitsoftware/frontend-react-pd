import { useLogout } from "@/queries/users"
import { Button } from "./button"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { useRouter } from "@tanstack/react-router"
import { useUser } from "@/providers/userProvider"


interface AuthButtonProps {
    className?: string
}

export const AuthButton: React.FC<AuthButtonProps> = ({ className }) => {
    const { t } = useTranslation()
    const router = useRouter()
    const logout = useLogout()
    const { user, setUser } = useUser()

    const handleLogout = async () => {
        console.log("Logging out")
        try {
            setUser(null)
            router.navigate({
                to: "/",
                replace: true,
            });
            await logout.mutateAsync()
        } catch (error) {
            console.error(error)
        }
    }

    if (user && user.role == 1) {
        return <Button variant="secondary" className="text-white rounded-xl px-6  hover:bg-secondary" onClick={handleLogout}>{t('navbar.logout')}</Button>
    } else {
        return (
            <Link to="/login">
                <Button variant="secondary" className={cn("text-white rounded-xl px-3  hover:bg-secondary py-1", className)}>{t('navbar.login')}</Button>
            </Link>
        )
    }
}