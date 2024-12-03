import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'et',
        debug: true,
        // resources: {
        //     en: {
        //         translation: {
        //             // here we will place our translations...
        //             title: "Inglise titel"
        //         },
        //     },
        //     et: {
        //         translation: {
        //             title: "eesti title"
        //         }
        //     }
        // }

        // resources: {
        //     en: {
        //         translation: {
        //             description: {
        //                 part1: 'Edit <1>src/App.js</1> and save to reload.',
        //                 part2: 'Learn React'
        //             }
        //         }
        //     },
        //     de: {
        //         translation: {
        //             description: {
        //                 part1: 'Ändere <1>src/App.js</1> und speichere um neu zu laden.',
        //                 part2: 'Lerne React'
        //             }
        //         }
        //     }
        // }
    });

export default i18n;