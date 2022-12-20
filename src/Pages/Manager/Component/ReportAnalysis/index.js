/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { useEffect, useState } from 'react';
import './index.css';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

import ReportAnalysisApi from '~/Api/reportAnalysis';

function ReportAnalysis() {
    const colors = [
        '#ec005a',
        '#ff2413',
        '#ff4400',
        '#ff9300',
        '#ffed00',
        '#79ca0d',
        '#009838',
        '#00ab9f',
        '#0075c2',
        '#6f2296',
    ];

    const chartTypes = [
        { label: 'Doughnut', id: 'doughnut' },
        { label: 'Line', id: 'line' },
        { label: 'Pie', id: 'pie' },
        { label: 'Bar', id: 'bar' },
        { label: 'PolarArea', id: 'polarArea' },
    ];
    const orderBys = ['Date', 'Top access'];
    const names = ['Detail page', 'Display on search page'];

    const [report, setReport] = useState();
    const [chartData, setChartData] = useState();
    const [filter, setFilter] = useState({
        chartType: chartTypes[0],
        orderBy: orderBys[0],
        page: 1,
        name: names[0],
    });

    const getData = async () => {
        let res = '';
        const params = {
            page: filter.page,
            orderBy: filter.orderBy,
            name: filter.name,
        };
        res = await ReportAnalysisApi.getByFilter(params);

        const { data } = res;
        setReport(data);
        const chartData = {
            labels: data.report.map((e) => e.title),
            datasets: [
                {
                    label: 'Number of access',
                    data: data.report.map((e) => e.count),
                    backgroundColor: colors,
                    borderColor: 'rgb(169, 169, 169)',
                    borderWidth: 2,
                    color: '#000',
                },
            ],
        };
        setChartData(chartData);
    };

    useEffect(() => {
        getData();
    }, [filter]);

    const increase = () => {
        const pageNum = report.total / report.limit;
        if (filter.page < pageNum) {
            const page = filter.page + 1;
            setFilter({ ...filter, page });
        }
    };

    const decrease = () => {
        if (filter.page > 1) {
            const page = filter.page - 1;
            setFilter({ ...filter, page });
        }
    };

    return (
        <div className="report-analysis__container">
            <div className="filter">
                <Autocomplete
                    onChange={(event, value) => {
                        setFilter({ ...filter, chartType: value });
                    }}
                    options={chartTypes}
                    sx={{
                        width: 300,
                        height: 90,
                        marginRight: 2,
                        svg: { color: '#fff' },
                        input: { color: '#fff' },
                        label: { color: '#fff' },
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    renderInput={(params) => <TextField {...params} label="Chart type" />}
                />

                <Autocomplete
                    onChange={(event, value) => {
                        console.log(value);
                        setFilter({ ...filter, page: 1, orderBy: value });
                    }}
                    options={orderBys}
                    sx={{
                        width: 300,
                        marginBottom: 2,
                        svg: { color: '#fff' },
                        input: { color: '#fff' },
                        label: { color: '#fff' },
                    }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    renderInput={(params) => <TextField {...params} label="Order by" />}
                />

                <Autocomplete
                    onChange={(event, value) => {
                        setFilter({ ...filter, page: 1, name: value });
                    }}
                    options={names}
                    sx={{
                        width: 300,
                        marginBottom: 2,
                        svg: { color: '#fff' },
                        input: { color: '#fff' },
                        label: { color: '#fff' },
                    }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    renderInput={(params) => <TextField {...params} label="Tracking name" />}
                />
            </div>

            <div className="">
                <IconButton sx={{ color: '#fff' }} onClick={decrease}>
                    <ArrowBackIosNewOutlinedIcon />
                </IconButton>
                <IconButton sx={{ color: '#fff' }} onClick={increase}>
                    <ArrowForwardIosOutlinedIcon />
                </IconButton>
            </div>

            <div className="chart">
                {chartData && (
                    <Chart type={filter.chartType ? filter.chartType.id : chartTypes[0].id} data={chartData} />
                )}
            </div>
        </div>
    );
}
export default ReportAnalysis;
