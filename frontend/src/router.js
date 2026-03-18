import {Main} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout.js";
import {IncomeView} from "./components/income/income-view.js";
import {ExpenseView} from "./components/expense/expense-view.js";
import {IncomeDelete} from "./components/income/delete.js";
import {IncomeCreate} from "./components/income/income-create.js";
import {ExpenseCreate} from "./components/expense/expense-create.js";
import {IncomeEdit} from "./components/income/income-edit.js";
import {ExpenseEdit} from "./components/expense/expense-edit.js";
import {OperationsView} from "./components/operations/operation-view.js";
import {OperationCreate} from "./components/operations/operation-create.js";
import {OperationEdit} from "./components/operations/operation-edit.js";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));

        document.addEventListener('click', (e) => {
            // Ищем ближайший тег <a> от элемента, на который кликнули
            const link = e.target.closest('a');

            // Проверяем: это ссылка, она ведет на наш же сайт (не внешняя)
            // и у нее нет атрибута target="_blank"
            if (link && link.href && link.origin === window.location.origin) {
                e.preventDefault(); // Отменяем стандартную перезагрузку страницы
                window.history.pushState({}, '', link.pathname); // Меняем URL без перезагрузки
                this.activateRoute.bind(this); // Вызываем отрисовку новой страницы
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
                // scripts: [
                //     'moment.min.js',
                //     'moment-ru-locale.js',
                //     //'moment.min.js.map',
                //     'fullcalendar.js',
                //     'fullcalendar-locale-ru.js'
                // ],
                // styles: [
                //     'fullcalendar.css'
                // ]
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
                    new Login();
                },
                // unload: () => {
                //     document.body.classList.remove('login-page');
                //     document.body.style.height = 'auto';
                // },
                // styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp();
                },
                // unload: () => {
                //     document.body.classList.remove('register-page');
                //     document.body.style.height = 'auto';
                // },
                // styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout();
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
            // {
            //     rout: '/income/delete',
            //     load: () => {
            //         new IncomeDelete();
            //     },
            // },
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
                    new OperationsView();
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

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;

                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('main-content');
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
            //history.pushState({}, '', '/404');
            window.location = '/404';

        }
    }
}