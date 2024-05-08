import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, showAlert } from '../../Store/headerSlice';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useParams } from 'react-router-dom';
import { Grid, Icon, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

const StatisticMode = {
    LIKES: 'likes',
    RATINGS: 'ratings'
};

const PeriodSize = {
    HOUR: 'hour',
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year',
    DECADE: 'decade'
};

const getStartOfPeriod = (frequency) => {
    const now = new Date();
    switch (frequency) {
        //case PeriodSize.HOUR: return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
        case PeriodSize.DAY: return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        case PeriodSize.MONTH: return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        case PeriodSize.YEAR: return new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        case PeriodSize.DECADE: return new Date(Math.floor(now.getFullYear() / 10) * 10, 0, 1, 0, 0, 0, 0);
        default: return null;
    }
};

function formatDateToISOStringWithoutTimeZone(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

const calculateIncreasedDate = (date, dataFrequency) => {
    switch (dataFrequency) {
        case PeriodSize.HOUR: return new Date(date.getTime() + (1 * 60 * 60 * 1000));
        case PeriodSize.DAY: return new Date(date.getTime() + (1 * 24 * 60 * 60 * 1000));
        case PeriodSize.MONTH: return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        case PeriodSize.YEAR: return new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
        case PeriodSize.DECADE: return new Date(date.getFullYear() + 10, date.getMonth(), date.getDate());
        default: return null;
    }
}

const calculateDecreasedDate = (date, dataFrequency) => {
    switch (dataFrequency) {
        case PeriodSize.HOUR: return new Date(date.getTime() - (1 * 60 * 60 * 1000));
        case PeriodSize.DAY: return new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000));
        case PeriodSize.MONTH: return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        case PeriodSize.YEAR: return new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
        case PeriodSize.DECADE: return new Date(date.getFullYear() - 10, date.getMonth(), date.getDate());
        default: return null;
    }
};

const StatisticsTab = (props) => {
    const { currentTab, index, valueId, getLikes, getRatings } = props;

    const dispatch = useDispatch();
    const params = useParams();

    const [statisticMode, setStatisticMode] = React.useState(StatisticMode.LIKES);
    const [periodSize, setPeriodSize] = React.useState(PeriodSize.MONTH);

    const periodStartDate = getStartOfPeriod(periodSize);
    const [periodDates, setPeriodDates] = React.useState({ periodStart: periodStartDate, periodEnd: calculateIncreasedDate(periodStartDate, periodSize) });
    const [veryFirstValue, setVeryFirstValue] = React.useState(null);
    const [veryLastValue, setVeryLastValue] = React.useState(null);

    const [likesStatistics, setLikesStatistic] = React.useState(null);
    const [ratingsStatistics, setRatingsStatistic] = React.useState(null);
    const [ratingsScoreStatistics, setRatingsScoreStatistic] = React.useState(null);

    React.useEffect(() => {
        if (index === currentTab && statisticMode === StatisticMode.LIKES) fetchLikesStatistics();
        if (index === currentTab && statisticMode === StatisticMode.RATINGS) fetchRatingsStatistics();
    }, [periodDates, statisticMode]);

    const fetchLikesStatistics = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await getLikes(params[valueId], {
            periodStart: (formatDateToISOStringWithoutTimeZone(new Date(periodDates.periodStart))), periodSize: periodSize
        });
        if (result.successfully === true) {
            if (result.data !== null) {
                setLikesStatistic(result.data.statisticsValue);
                setVeryFirstValue(result.data.veryFirstValue);
                setVeryLastValue(result.data.veryLastValue);
            } else {
                setLikesStatistic([]);
            }
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати статистику лайків картини: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const fetchRatingsStatistics = async () => {
        dispatch(setLoading({ isLoading: true }));
        const result = await getRatings(params[valueId], {
            periodStart: (formatDateToISOStringWithoutTimeZone(new Date(periodDates.periodStart))), periodSize: periodSize
        });
        if (result.successfully === true) {
            if (result.data !== null) {
                const updatedStatisticsValue = result.data.statisticsValue.map(item => {
                    const { ratingsCount } = item;
                    const total0To1 = ratingsCount.from0To1;
                    const total1To2 = total0To1 + ratingsCount.from1To2;
                    const total2To3 = total1To2 + ratingsCount.from2To3;
                    const total3To4 = total2To3 + ratingsCount.from3To4;
                    const total4To5 = total3To4 + ratingsCount.from4To5;
                    return { ...item, totalCount: { total0To1, total1To2, total2To3, total3To4, total4To5 } };
                });

                const score0To1 = result.data.statisticsValue.reduce((total, item) => total + item.ratingsCount.from0To1, 0);
                const score1To2 = result.data.statisticsValue.reduce((total, item) => total + item.ratingsCount.from1To2, 0);
                const score2To3 = result.data.statisticsValue.reduce((total, item) => total + item.ratingsCount.from2To3, 0);
                const score3To4 = result.data.statisticsValue.reduce((total, item) => total + item.ratingsCount.from3To4, 0);
                const score4To5 = result.data.statisticsValue.reduce((total, item) => total + item.ratingsCount.from4To5, 0);
                const score = score0To1 + score1To2 + score2To3 + score3To4 + score4To5;

                setRatingsStatistic(updatedStatisticsValue);
                setRatingsScoreStatistic(score !== 0 ? [{
                    name: 'Rating', sum: score, from0To1: score0To1 / score * 100, from1To2: score1To2 / score * 100,
                    from2To3: score2To3 / score * 100, from3To4: score3To4 / score * 100, from4To5: score4To5 / score * 100
                }] : []);
                setVeryFirstValue(result.data.veryFirstValue);
                setVeryLastValue(result.data.veryLastValue);
            } else {
                setRatingsStatistic([]);
            }
            dispatch(setLoading({ isLoading: false }));
        } else {
            dispatch(setLoading({ isLoading: false }));
            dispatch(showAlert({ message: "Не вдалось отримати статистику оцінок картини: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    if (statisticMode === StatisticMode.LIKES && (likesStatistics === null || likesStatistics.length === 0) ||
        statisticMode === StatisticMode.RATINGS && (ratingsStatistics === null || ratingsStatistics.length === 0))
        return <div>Немає даних для відображеня статистики</div>;

    const setPeriods = (start, periodSize) => {
        setPeriodDates({ periodStart: start, periodEnd: calculateIncreasedDate(start, periodSize) });
    }

    const handleChangeStatisticMode = (event, newStatisticMode) => {
        if (newStatisticMode !== null) {
            setStatisticMode(newStatisticMode);
            setPeriods(getStartOfPeriod(periodSize), periodSize);
        }
    };

    const handleChangePeriodSize = (event, newSize) => {
        if (newSize !== null) {
            setPeriods(getStartOfPeriod(newSize), newSize);
            setPeriodSize(newSize);
        }
    };

    const handleIncreasePeriodStart = () => {
        const newPeriodStart = calculateIncreasedDate(periodDates.periodStart, periodSize);
        if (newPeriodStart <= new Date()) {
            setPeriods(newPeriodStart, periodSize);
        }
    };

    const handleDecreasePeriodStart = () => {
        const newPeriodStart = calculateDecreasedDate(periodDates.periodStart, periodSize);
        if (newPeriodStart <= new Date()) {
            setPeriods(newPeriodStart, periodSize);
        }
    };

    const isBackButtonDisabled = !veryFirstValue || periodDates.periodStart <= new Date(veryFirstValue);
    const isForwardButtonDisabled = periodDates.periodEnd >= new Date();

    const dateToStringForXAxis = (date) => {
        switch (periodSize) {
            case PeriodSize.DAY: return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            case PeriodSize.MONTH: return date.getDate();
            case PeriodSize.YEAR: return date.toLocaleString('default', { month: 'long' });
            case PeriodSize.DECADE: return date.getFullYear();
            default: return null;
        }
    }

    const dateToStringForTooltip = (date) => {
        switch (periodSize) {
            case PeriodSize.DAY: return date.toLocaleString();
            case PeriodSize.MONTH: return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
            case PeriodSize.YEAR: return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            case PeriodSize.DECADE: return date.getFullYear();
            default: return null;
        }
    }

    const dateToStringToPagination = () => {
        switch (periodSize) {
            case PeriodSize.DAY: return `${periodDates.periodStart.toLocaleDateString()}`;
            case PeriodSize.MONTH: return `${periodDates.periodStart.toLocaleString('default', { month: 'long' })} ${periodDates.periodStart.getFullYear()}`;
            case PeriodSize.YEAR: return `${periodDates.periodStart.getFullYear()}`;
            case PeriodSize.DECADE: return `${periodDates.periodStart.getFullYear()}-${periodDates.periodEnd.getFullYear()}`;
            default: return null;
        }
    }

    return (
        <>
            <Grid container alignItems="center" display="flex" justifyContent="space-between">
                <Grid item display="flex" flexDirection="column" justifyContent="flex-start">
                    <Typography variant="body1" gutterBottom> Переглядати: </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={statisticMode}
                        exclusive
                        onChange={handleChangeStatisticMode}
                        aria-label="StatisticType"
                    >
                        <ToggleButton value={StatisticMode.LIKES} title="Переглядати статистику лайків">Лайки</ToggleButton>
                        <ToggleButton value={StatisticMode.RATINGS} title="Переглядати статистику оцінок">Оцінки</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item display="flex" flexDirection="column" justifyContent="flex-end">
                    <Typography variant="body1" gutterBottom>
                        Розмір відрізка:
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={periodSize}
                        exclusive
                        onChange={handleChangePeriodSize}
                        aria-label="PeriodSize"
                    >
                        <ToggleButton value={PeriodSize.DAY} title="Розмір спостережуваного періоду: день">день</ToggleButton>
                        <ToggleButton value={PeriodSize.MONTH} title="Розмір спостережуваного періоду: місяць">місяць</ToggleButton>
                        <ToggleButton value={PeriodSize.YEAR} title="Розмір спостережуваного періоду: рік">рік</ToggleButton>
                        <ToggleButton value={PeriodSize.DECADE} title="Розмір спостережуваного періоду: десятиліття">десятиліття</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>

            <div style={{ width: '100%', height: 440 }}>
                {statisticMode === StatisticMode.LIKES ? (
                    <ResponsiveContainer>
                        <LineChart
                            data={likesStatistics}
                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                            <XAxis
                                dataKey="timePeriodStart"
                                tickFormatter={(timeStr) => dateToStringForXAxis(new Date(timeStr))}
                            />
                            <YAxis />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Tooltip
                                labelFormatter={(label) => dateToStringForTooltip(new Date(label))}
                                formatter={(value, name, props) => {
                                    if (name === 'likesCount') {
                                        return [`Кількість лайків: ${value}`];
                                    }
                                    return [value];
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="likesCount"
                                stroke="#2196f3"
                                strokeWidth={2}
                                dot={{ stroke: '#2196f3', strokeWidth: 2, fill: '#2196f3' }}
                                activeDot={{ r: 8 }}
                                animationDuration={500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <>
                        {ratingsScoreStatistics.length !== 0 &&
                            <ResponsiveContainer width="100%" height={40}>
                                <BarChart data={ratingsScoreStatistics} layout="vertical" >
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="Rating" hide />
                                    <Tooltip
                                        formatter={(value, name, props) => {
                                            if (name === 'from0To1') return [`0 - 1 ★: ${value}%`]
                                            if (name === 'from1To2') return [`1 - 2 ★★: ${value}%`]
                                            if (name === 'from2To3') return [`2 - 3 ★★★: ${value}%`]
                                            if (name === 'from3To4') return [`3 - 4 ★★★★: ${value}%`]
                                            if (name === 'from4To5') return [`4 - 5 ★★★★★: ${value}%`]
                                            return [value];
                                        }}
                                    />
                                    <Bar dataKey="from0To1" stackId="stack" fill="#e51f1f" />
                                    <Bar dataKey="from1To2" stackId="stack" fill="#f2a134" />
                                    <Bar dataKey="from2To3" stackId="stack" fill="#f7e379" />
                                    <Bar dataKey="from3To4" stackId="stack" fill="#bbdb44" />
                                    <Bar dataKey="from4To5" stackId="stack" fill="#44ce1b" />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={ratingsStatistics} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                <XAxis
                                    dataKey="timePeriodStart"
                                    tickFormatter={(timeStr) => dateToStringForXAxis(new Date(timeStr))}
                                />
                                <YAxis />
                                <CartesianGrid stroke="#f5f5f5" />
                                <Tooltip
                                    labelFormatter={(label) => dateToStringForTooltip(new Date(label))}
                                    formatter={(value, name, props) => {
                                        if (name === 'totalCount.total0To1') return [`★ 0 - 1: ${props.payload.ratingsCount.from0To1}`]
                                        if (name === 'totalCount.total1To2') return [`★ 1 - 2: ${props.payload.ratingsCount.from1To2}`]
                                        if (name === 'totalCount.total2To3') return [`★ 2 - 3: ${props.payload.ratingsCount.from2To3}`]
                                        if (name === 'totalCount.total3To4') return [`★ 3 - 4: ${props.payload.ratingsCount.from3To4}`]
                                        if (name === 'totalCount.total4To5') return [`★ 4 - 5: ${props.payload.ratingsCount.from4To5}`]
                                        return [value];
                                    }}
                                />
                                <Area type="monotone" dataKey="totalCount.total4To5" stackId="1" stroke="#44ce1b"
                                    fill="#44ce1b" strokeWidth={2} animationDuration={500} />
                                <Area type="monotone" dataKey="totalCount.total3To4" stackId="2" stroke="#bbdb44"
                                    fill="#bbdb44" strokeWidth={2} animationDuration={500} />
                                <Area type="monotone" dataKey="totalCount.total2To3" stackId="3" stroke="#f7e379"
                                    fill="#f7e379" strokeWidth={2} animationDuration={500} />
                                <Area type="monotone" dataKey="totalCount.total1To2" stackId="4" stroke="#f2a134"
                                    fill="#f2a134" strokeWidth={2} animationDuration={500} />
                                <Area type="monotone" dataKey="totalCount.total0To1" stackId="5" stroke="#e51f1f"
                                    fill="#e51f1f" strokeWidth={2} animationDuration={500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </>

                )}
            </div>

            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item container justifyContent="center" alignItems="center" spacing={1}>
                    <Grid item>
                        <IconButton onClick={handleDecreasePeriodStart} disabled={isBackButtonDisabled} aria-label="Назад">
                            <Icon>arrow_back</Icon>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            {dateToStringToPagination()}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={handleIncreasePeriodStart} disabled={isForwardButtonDisabled} aria-label="Вперед">
                            <Icon>arrow_forward</Icon>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default StatisticsTab;
