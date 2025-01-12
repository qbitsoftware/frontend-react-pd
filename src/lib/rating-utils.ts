import { User } from "@/types/types";
import { TFunction } from "i18next";

// tabelipõhised asjad

export const filterByAgeClass = (user: User, ageClass: string) => {
  const year = new Date(user.birth_date).getFullYear();
  const sex = user.sex;

  switch (ageClass) {
    case "cadet_boys":
      return year >= 2007 && sex === "M";
    case "cadet_girls":
      return year >= 2007 && sex === "N";
    case "junior_boys":
      return year >= 2003 && year <= 2006 && sex === "M";
    case "junior_girls":
      return year >= 2003 && year <= 2006 && sex === "N";
    case "senior_men":
      return year <= 1995 && sex === "M";
    case "senior_women":
      return year <= 1995 && sex === "N";
    default:
      return true;
  }
}

export const modifyTitleDependingOnFilter = (
  t: TFunction,
  showCombined: boolean,
  sex: string,
  ageClass: string
): string => {
  let prefix = t('rating.header_prefix.combined');

  if (!showCombined) {
    if (sex === 'M') {
      switch (ageClass) {
        case 'cadet_boys':
          prefix = t('rating.header_prefix.cadet_boys');
          break;
        case 'junior_boys':
          prefix = t('rating.header_prefix.junior_boys');
          break;
        case 'senior_men':
          prefix = t('rating.header_prefix.senior_men');
          break;
        default:
          prefix = t('rating.header_prefix.men');
          break;
      }
    } else if (sex === 'N') {
      switch (ageClass) {
        case 'cadet_girls':
          prefix = t('rating.header_prefix.cadet_girls');
          break;
        case 'junior_girls':
          prefix = t('rating.header_prefix.junior_girls');
          break;
        case 'senior_women':
          prefix = t('rating.header_prefix.senior_women');
          break;
        default:
          prefix = t('rating.header_prefix.women');
          break;
      }
    } else if (ageClass === 'senior') {
      prefix = t('rating.header_prefix.senior');
    }
  }

  return prefix + " " + t('rating.header');
};

export const getYear = (date: Date) => {
  return new Date(date).getFullYear()
}
