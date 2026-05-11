declare module "*.scss" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.css" {
    const content: { [className: string]: string };
    export default content;
}

declare module 'bootstrap';

declare module 'vanillajs-datepicker';
declare module 'vanillajs-datepicker/locales/ru';