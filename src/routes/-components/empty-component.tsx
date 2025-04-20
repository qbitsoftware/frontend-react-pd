import { useTranslation } from "react-i18next";

interface EmptyComponentProps {
    errorMessage: string;
}

const EmptyComponent = ({errorMessage}: EmptyComponentProps) => {
    const {t} = useTranslation()
  return (
    <div className="p-6 text-center rounded-sm">
        <p className="text-stone-500">{t(`${errorMessage}`)}</p>
    </div>
  )
}

export default EmptyComponent
