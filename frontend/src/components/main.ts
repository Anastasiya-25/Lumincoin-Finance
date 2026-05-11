import {Chart, PieController, ArcElement, Legend, Title, Tooltip} from 'chart.js';
import {HttpUtils} from "../utils/http-utils";
import {PeriodUtils} from "../utils/period-utils";
import type {Router} from "../router";
import type {ResultResponseType} from "../types/result-response.type";
import type {ChartDataType} from "../types/chart-data.type";
import type {OperationPeriodResponseType} from "../types/operation-period-response.type";

Chart.register(PieController, ArcElement, Legend, Title, Tooltip);

export class Main {
    readonly route: Router;
    constructor(route: Router) {
        this.route = route;
        new PeriodUtils(this.getOperations.bind(this));

        this.getOperations('all').then();
    }

    private async getOperations(period: string, dateFrom?: string | null, dateTo?: string | null): Promise<void> {
        let url: string = '/operations?period=' + period;

        if (period === 'interval' && dateFrom && dateTo) {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }

        const result: ResultResponseType<OperationPeriodResponseType[]> = await HttpUtils.request(url);

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response) {
            return alert("Ошибка загрузки данных для выбранного периода");
        }

        const incomeData: ChartDataType = this.process(result.response, 'income');
        const expenseData: ChartDataType = this.process(result.response, 'expense');

        this.renderChart('chartIncome', 'Доходы', incomeData);
        this.renderChart('chartExpenses', 'Расходы', expenseData);
    }

    private process(operations: OperationPeriodResponseType[], type: 'income' | 'expense') {
        const filtered: OperationPeriodResponseType[] = operations.filter((op: OperationPeriodResponseType): boolean => op.type === type);
        const totals: Record<string, number> = {};
        filtered.forEach((op: OperationPeriodResponseType): void => {
            const categoryName: string = op.category;
            const amount: number = Number(op.amount);
            if (!isNaN(amount)) {
                totals[categoryName] = (totals[categoryName] || 0) + amount;
            }
        });
        return {
            labels: Object.keys(totals),
            data: Object.values(totals) as number[]
        };
    }

    private renderChart(canvasId: string, title: string, chartData: ChartDataType): void {
        const canvas = document.getElementById(canvasId)as HTMLCanvasElement | null;
        if (!canvas) return;

        const existingChart: Chart | undefined = Chart.getChart(canvas);

        if (existingChart) {
            existingChart.destroy();
        }

        if (!chartData || !chartData.data || chartData.data.length === 0) {
            return;
        }

        new Chart(canvas, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#0D6EFD', '#20C997', '#6610f2']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        color: '#290661',
                        font: { size: 28 }
                    }
                }
            }
        });
    }

}
