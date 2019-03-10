import * as echarts from "echarts";

export let data = {
};
export let methods = {
    onReady: function(this: Vue) {
        // --- 柱状图表 ---
        let myChart = echarts.init(this.$refs.chart);
        let option: echarts.EChartOption = {
            title: {
                text: "ECharts Demo"
            },
            tooltip: {},
            legend: {
                data: ["Sales"]
            },
            xAxis: {
                data: ["Shirt-A", "Shirt-B", "Shirt-C", "Shirt-D", "Shirt-E", "Shirt-F"]
            },
            yAxis: {},
            series: [{
                name: "Sales",
                type: "bar",
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        myChart.setOption(option);

        // --- 线性图表 ---
        let myChart2 = echarts.init(this.$refs.chart2);
        let option2: echarts.EChartOption = {
            title: {
                text: "ECharts Line"
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ["A", "B"]
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    name: "A",
                    type: "line",
                    stack: "Count",
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: "B",
                    type: "line",
                    stack: "Count",
                    data: [220, 182, 191, 234, 290, 330, 310]
                }
            ]
        };
        myChart2.setOption(option2);
    }
};