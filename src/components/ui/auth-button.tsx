import { useGetLogin, useLogout } from "@/queries/users"
import { Button } from "./button"
import { Link, useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface AuthButtonProps {
    className?: string
}

export const AuthButton: React.FC<AuthButtonProps> = ({ className }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const logout = useLogout()
    const { data: userData } = useGetLogin()

    const handleLogout = async () => {
        try {
            await logout.mutateAsync()
            navigate({ to: "/" })
        } catch (error) {
            console.error(error)
        }
    }

    if (userData?.data) {
        return <Button variant="secondary" className="text-white rounded-xl px-6  hover:bg-secondary" onClick={handleLogout}>{t('navbar.logout')}</Button>
    } else {
        return (
            <Link to="/admin">
                <Button variant="secondary" className={cn("text-white rounded-xl px-3  hover:bg-secondary py-1", className)}>{t('navbar.login')}</Button>
            </Link>
        )
    }
}