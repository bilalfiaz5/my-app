import { Fragment, useState, useEffect } from "react";
import moment from 'moment';
import { DatePicker, Checkbox } from 'antd';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
const { RangePicker } = DatePicker;

function Duration(props) {

    const durations = props.duration;
    const days = props.productSku;

    useEffect(() => {
        
    }, [])

    const [Duration, setDuration] = useState({
        duration: durations[0],
        index: 0
    });

    // const [availableDate, setavailableDate] = useState({});
    const [open, setopen] = useState(false);
    const [availableSKU, setavailableSKU] = useState([]);
    const [sameDay, setsameDay] = useState(false);
    
    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState();

    const setProductDuration = (duration, index) => {
        setDuration({ duration: duration, index: index });
        setopen(true);
        setDates([]);
        setHackValue([]);
        seperateAvailable();
    }

    const seperateAvailable = () => {
        var availableAfterToday = days.filter(day => moment(day.dateFrom) >= moment().add(4, "day") || moment(day.dateTo) >= moment().add(4, "day"));
        var available = availableAfterToday.filter(day => day.status === "available");
        setavailableSKU([...available]);
        console.log(days);
        console.log(availableAfterToday);
        console.log(available);

    }


    const disabledDate = current => {

        if (!dates) {
            return false;
        }

        if (sameDay) {
            return current > moment().endOf('day').add(Duration.duration.value - 1, "days") || current < moment().endOf('day').subtract(1, "day");
        }

        const tooLate = dates[0] && current.diff(dates[0], 'days') > Duration.duration.value - 1;
        return tooLate || current < moment().endOf('day').add(3, "day");
    };

    const onOpenChange = open => {
        if (open) {
            setopen(open);
            setHackValue([]);
            setDates([]);
        } else {
            setopen(false);
            setHackValue(undefined);
        }
    };

    function onChange(e) {
        setsameDay(e.target.checked);
      }

    return (
        <Fragment>
            <div className="h3--size">Rental Duration (Days)</div>
            {
                durations.map((duration, index) => {
                    return <Fragment>
                        <button className={`btn btn--size ${Duration.index === index ? "active" : null}`} onClick={() => setProductDuration(duration, index)}>{duration.value}</button>
                    </Fragment>
                })
            }
            <br />
            <br />

            <RangePicker
                value={hackValue || value}
                disabledDate={disabledDate}
                onCalendarChange={val => setDates(val)}
                onChange={val => setValue(val)}
                onOpenChange={onOpenChange}
                open={open}
            />

            <br />
            <br />
            <Checkbox onChange={onChange}>Checkbox</Checkbox>
            <br />
            <br />
            <button>Cancel</button>
            <hr />
            <button>{`Pay Now ${Duration.duration.price}  ${Duration.duration.currency} `}</button>
        </Fragment>
    );
}

export default Duration;