import {Main} from "./components/main";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {IncomeView} from "./components/income/income-view";
import {ExpenseView} from "./components/expense/expense-view";
import {IncomeCreate} from "./components/income/income-create";
import {ExpenseCreate} from "./components/expense/expense-create";
import {IncomeEdit} from "./components/income/income-edit";
import {ExpenseEdit} from "./components/expense/expense-edit";
import {OperationsView} from "./components/operations/operation-view";
import {OperationCreate} from "./components/operations/operation-create";
import {OperationEdit} from "./components/operations/operation-edit";
import {AuthUtils} from "./utils/auth-utils";
import {SidebarUtils} from "./utils/sidebar-utils";
import type {RouteType} from "./types/route.type";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private routes: RouteType[];
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));

        document.addEventListener('click', async (e) => {

            const target = e.target as HTMLElement;
            const link = target?.closest?.('a');
            if (link instanceof HTMLAnchorElement && link.origin === window.location.origin) {
                e.preventDefault();
                await this.open(link.pathname + link.search);
            }
        });
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this);
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this);
                },
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this);
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this);
                }
            },
            {
                route: '/income/view',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeView(this);
                },
            },
            {
                route: '/income/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this);
                },
            },
            {
                route: '/income/edit',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this);
                },
            },
            {
                route: '/expense/view',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expense/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseView(this);
                },
            },
            {
                route: '/expense/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/expense/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this);
                },
            },
            {
                route: '/expense/edit',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/expense/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit(this);
                },
            },
            {
                route: '/operations/view',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/operations/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsView(this);
                },
            },
            {
                route: '/operation/create',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationCreate(this);
                },
            },
            {
                route: '/operation/edit',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationEdit(this);
                },
            },
        ];
    }

    private updateMenu(urlRoute: string): void {
        const menuLinks: NodeListOf<HTMLElement> | null = document.querySelectorAll('.nav-link, .dropdown-item');
        const categoryButton: HTMLButtonElement | null = document.querySelector('.dropdown-toggle');
        const activeLink: HTMLAnchorElement | null = document.querySelector('.nav-link.active');

        if (activeLink && activeLink.getAttribute('href') === urlRoute) {
            return;
        }
        if (menuLinks) {
            menuLinks.forEach((link: HTMLElement): void => {
                link.classList.remove('active');
                link.classList.add('link-dark');
            });
        }

        if (categoryButton) {
            categoryButton.classList.remove('active');
        }

        menuLinks.forEach((link: HTMLElement): void => {
            if (link.getAttribute('href') === urlRoute) {
                link.classList.add('active');
                link.classList.remove('link-dark');
            }
        });

        if (categoryButton) {
            if (urlRoute.includes('/income') || urlRoute.includes('/expense')) {
                categoryButton.classList.add('active');
            }
        }
    }

    public async open(route:string): Promise<void> {
        window.history.pushState({}, '', route);
        return await this.activateRoute();
    }

    private async activateRoute(): Promise<void> {
        const urlRoute: string = window.location.pathname;

        const isAuthPage: boolean = urlRoute === '/login' || urlRoute === '/sign-up';

        const accessToken: string | null = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        const refreshToken: string | null = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (!accessToken && !refreshToken && !isAuthPage) {
            window.history.replaceState({}, '', '/login');
            return await this.activateRoute();
        }

        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.title) {
                if (this.titlePageElement) {
                    this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
                }
            }
            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;

                if (newRoute.useLayout) {
                    let layout: HTMLElement | null = document.getElementById('main-content');
                    if (!layout) {
                        if (this.contentPageElement) {
                            this.contentPageElement.innerHTML = await fetch(newRoute.useLayout as string).then(response => response.text());
                            layout = document.getElementById('main-content');
                            SidebarUtils.initLogout(this);
                        }
                    }
                    contentBlock = layout;
                    await SidebarUtils.showBalance();
                    SidebarUtils.showUserName();
                    this.updateMenu(urlRoute);

                } else {
                    if (this.contentPageElement) this.contentPageElement.innerHTML = '';
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                    if (newRoute.filePathTemplate === '/templates/pages/main.html') {
                        new Main(this);
                    }
                }
            }
            if (newRoute && newRoute.load && typeof newRoute.load === 'function') {
                setTimeout(() => {
                    newRoute.load?.();
                }, 100);
            }
        } else {
            console.log('Not route Found!');
            await this.open('/404');

        }
    }
}