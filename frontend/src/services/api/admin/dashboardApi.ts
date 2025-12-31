import type { IDashboardResponse } from "@/types/dashboard";
import axiosClient from "./axiosClient";

const dashboardApi = {
    get() {
        return axiosClient.get<IDashboardResponse>('/admin/dashboard/overview');
    }
}

export default dashboardApi;