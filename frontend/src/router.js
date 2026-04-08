import {Main} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout.js";
import {IncomeView} from "./components/income/income-view.js";
import {ExpenseView} from "./components/expense/expense-view.js";
import {IncomeCreate} from "./components/income/income-create.js";
import {ExpenseCreate} from "./components/expense/expense-create.js";
import {IncomeEdit} from "./components/income/income-edit.js";
import {ExpenseEdit} from "./components/expense/expense-edit.js";
import {OperationsView} from "./components/operations/operation-view.js";
import {OperationCreate} from "./components/operations/operation-create.js";
import {OperationEdit} from "./components/operations/operation-edit.js";
import {AuthUtils} from "./utils/auth-utils.js";
import {SidebarUtils} from "./utils/sidebar-utils.js";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.isInitialLoad = true;
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (e.target.closest('[data-bs-toggle="dropdown"]')) {
                return;
            }

            if (link && link.href && link.origin === window.location.origin) {
                e.preventDefault();

                this.open(link.pathname).then();
            }
        });
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main();
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
                    new IncomeView();
                },
            },
            {
                route: '/income/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate();
                },
            },
            {
                route: '/income/edit',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit();
                },
            },
            {
                route: '/expense/view',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expense/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseView();
                },
            },
            {
                route: '/expense/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/expense/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate();
                },
            },
            {
                route: '/expense/edit',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/expense/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit();
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
                    new OperationCreate();
                },
            },
            {
                route: '/operation/edit',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationEdit();
                },
            },
        ];
    }

    updateMenu(urlRoute) {
        const menuLinks = document.querySelectorAll('.nav-link, .dropdown-item');
        const categoryButton = document.querySelector('.dropdown-toggle');
        const activeLink = document.querySelector('.nav-link.active');

        if (activeLink && activeLink.getAttribute('href') === urlRoute) {
            return;
        }

        menuLinks.forEach(link => {
            link.classList.remove('active');
            link.classList.add('link-dark');

            if (link.getAttribute('href') === urlRoute) {
                link.classList.add('active');
                link.classList.remove('link-dark');

                if (link.classList.contains('dropdown-item')) {
                    categoryButton.classList.add('active');
                }
            }
        });

        if (urlRoute.includes('/income') || urlRoute.includes('/expense')) {
            categoryButton.classList.add('active');

        }
    }

    async open(route) {
        window.history.pushState({}, '', route);
        return await this.activateRoute();
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;

        const isAuthPage = urlRoute === '/login' || urlRoute === '/sign-up';

        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (!accessToken && !refreshToken && !isAuthPage) {
            // this.contentPageElement.innerHTML = '';
            window.history.replaceState({}, '', '/login');
            return await this.activateRoute();

        }

        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;

                if (newRoute.useLayout) {
                    let layout = document.getElementById('main-content');
                    if (!layout) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                        layout = document.getElementById('main-content');
                        SidebarUtils.initLogout(this);
                    }
                    contentBlock = layout;
                    await SidebarUtils.showBalance();
                    SidebarUtils.showUserName();
                    this.updateMenu(urlRoute);

                } else {
                    this.contentPageElement.innerHTML = '';
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                if (newRoute.filePathTemplate === '/templates/pages/main.html') {
                    // Первая диаграмма
                    const incomeChart = new Main('chartIncome', 'Доходы', [50, 20, 30, 10, 40]);
                    // Вторая диаграмма
                    const expenseChart = new Main('chartExpenses', 'Расходы', [10, 40, 15, 25, 10]);
                }
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('Not route Found!');
            this.open('/404');

        }
    }
}