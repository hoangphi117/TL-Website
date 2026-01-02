import { ChartBarMixed, type BarChartItem } from "@/components/admin/common/ChartBarMixed";
import { ChartLineDots } from "@/components/admin/common/ChartLineDots";
import { ChartLineLinear, type LineChartItem } from "@/components/admin/common/ChartLineLinear";
import PageTitle from "@/components/admin/common/PageTitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import dashboardApi from "@/services/api/admin/dashboardApi";
import type { DashboardTotals } from "@/types/dashboard";
import type { IProduct } from "@/types/product";
import { CircleDollarSign, ShoppingCart, Tag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { formatVND } from "@/utils/admin/formatMoney";
import { TopProducts } from "@/components/admin/dashboard/TopProducts";
import { NewUserList } from "@/components/admin/dashboard/NewUsersList";
import type { IUser } from "@/types/user";

export default function DashboardPage() {
    const USER_COLORS = [
        "#ef4444", // red-500
        "#22c55e", // green-500
        "#eab308", // yellow-500
        "#3b82f6", // blue-500
        "#a855f7", // purple-500
        "#a855f7", // purple-500
        "#14b8a6", // teal
    ];

    function mapLineChartData(
        labels: string[],
        data: number[]
        ): LineChartItem[] {
        return labels.map((label, index) => ({
            label,
            value: data[index] ?? 0,
        }))
    }

    function mapBarChartData(
        labels: string[],
        data: number[],
        color: string
        ): BarChartItem[] {
        return labels.map((label, index) => ({
            label,
            value: data[index] ?? 0,
            color: USER_COLORS[index]
        }))
    }

    const [totals, setTotals] = useState<DashboardTotals>({
        users: 0,
        products: 0,
        revenueThisYear: 0,
        revenueThisMonth: 0,
        revenueLastMonth: 0,
    });

    const month = new Date().getMonth() + 1;

    const [topProducts, setTopProducts] = useState<IProduct[]>([]);
    const [newUsers, setNewUsers] = useState<IUser[]>([]);

    const [ordersChart, setOrdersChart] = useState<LineChartItem[]>([]);
    const [usersChart, setUsersChart] = useState<BarChartItem[]>([]);
    const [weekRevenueChart, setWeekRevenueChart] = useState<LineChartItem[]>([]);
    const [totalRevenue7Day, setTotalRevenue7Day] = useState(0);
    const [totalUser7Day, setTotalUsers7Day] = useState(0);

    const ordersChartConfig = {
        value: {
            label: "Đơn hàng",
            color: "var(--chart-1)",
        },
    };

    const usersChartConfig = {
        value: {
            label: "Khách hàng",
            color: "var(--chart-2)",
        }
    }

    const weekRevenueChartConfig = {
        value: {
            label: "Doanh thu",
            color: "var(--chart-2)"
        }
    }

    const loadData = async () => {
        try {
            const res = await dashboardApi.get();
            console.log("check res: ", res.data.data);
            console.log("check res: ", res.data);
            setTotals(res.data.totals);
            setTopProducts(res.data.topProducts.slice(0, 5));
            setNewUsers(res.data.topNewUsers.slice(0, 5));

            const orderChartData = mapLineChartData(
                res.data.ordersByDayInMonth.labels,
                res.data.ordersByDayInMonth.data
            );

            const userChartData = mapBarChartData(
                res.data.usersNew7Days.labels,
                res.data.usersNew7Days.data,
            );

            const weekRevenueChartData = mapLineChartData(
                res.data.revenue7Days.labels,
                res.data.revenue7Days.data,
            );

            console.log("check chart data: ", orderChartData);
            setOrdersChart(orderChartData)
            setUsersChart(userChartData);
            setWeekRevenueChart(weekRevenueChartData);

            const revenue7Day = weekRevenueChartData.reduce((total, item) => total + item.value, 0);
            const user7Day = userChartData.reduce((total, item) => total + item.value, 0);
            setTotalRevenue7Day(revenue7Day);
            setTotalUsers7Day(user7Day);
            
        }catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        try {
            const fetchData = () => {
                loadData();
            }
            fetchData();
        }catch(error) {
            console.log(error);
        }
    }, [])

    return (
        <div className="p-2 md:p-4 bg-white space-y-4">
            <PageTitle title="Quản lí doanh thu" subTitle="Tổng quan về hoạt động kinh doanh và chỉ số quan trọng"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 px-3">
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <p className="text-md font-semibold text-zinc-500">Tổng doanh thu</p>
                        <div className="h-9 w-9 rounded-md bg-green-100 flex items-center justify-center">
                            <CircleDollarSign className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            <CountUp
                                end={totals.revenueThisYear}
                                duration={1}
                                easingFn={(t, b, c, d) => {
                                    // easeOutCubic
                                    t /= d;
                                    t--;
                                    return c * (t * t * t + 1) + b;
                                }}
                                formattingFn={(v) => v.toLocaleString("vi-VN") + " ₫"}
                            />
                        </p>
                        <p className="text-sm text-gray-500">Trong năm nay</p>
                    </CardContent>
                </Card >
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <p className="text-md font-semibold text-zinc-500">Tổng đơn hàng</p>
                        <div className="h-9 w-9 rounded-md bg-blue-100 flex items-center justify-center">
                            <ShoppingCart color="#0b35e0" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{3000000}</p>
                        <p className="text-sm text-gray-500">Trong 30 ngày gần nhất</p>
                    </CardContent>
                </Card>
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <p className="text-md font-semibold text-zinc-500">Tổng khách hàng</p>
                        <div className="h-9 w-9 rounded-md bg-violet-100 flex items-center justify-center">
                            <UserRound color="#800be0" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{3000000}</p>
                        <p className="text-sm text-gray-500">Trong 30 ngày gần nhất</p>
                    </CardContent>
                </Card>
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <p className="text-md font-semibold text-zinc-500">Tổng sản phẩm</p>
                        <div className="h-9 w-9 rounded-md bg-amber-50 flex items-center justify-center">
                            <Tag size={28} color="#f1dd04" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totals.products}</p>
                        <p className="text-sm text-gray-500">Trong 30 ngày gần nhất</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch px-3 mt-8 gap-5 justify-center">
                <div className="md:col-span-2">
                    <ChartLineLinear
                        chartData={ordersChart}
                        chartConfig={ordersChartConfig}
                        dataKey="value"
                        titelChart={`Đơn hàng trong tháng ${month}`}
                        subTitle="Số đơn hàng theo ngày trong tháng hiện tại"
                    />
                </div>
                <div className="flex col-span-1 gap-4 flex-col md:col-span-2 sm:flex-row sm:gap-5 sm:justify-center sm:w-full lg:flex-col lg:h-full lg:col-span-1 lg:gap-4">
                    <div className="lg:flex-1">

                    <ChartLineDots
                        chartData={weekRevenueChart}
                        chartConfig={weekRevenueChartConfig}
                        dataKey="value"
                        titelChart="Doanh thu 7 ngày qua"
                        subTitle={`Tổng doanh thu: ${formatVND(totalRevenue7Day)}`}
                    />
                    </div>

                    <div className="lg:flex-1">
                    <ChartBarMixed
                        chartData={usersChart}
                        chartConfig={usersChartConfig}
                        dataKey="value"
                        titelChart="Khách hàng mới trong 7 ngày qua"
                        subTitle={`Tổng khách hàng mới: ${totalUser7Day}`}
                    />
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <TopProducts products={topProducts}/>
            </div> 
            <NewUserList users={newUsers}/>
        </div>
    )
}