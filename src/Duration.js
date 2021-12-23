import { Fragment, useState } from "react";
import moment from 'moment';
import { DatePicker, Button } from 'antd';
const { RangePicker } = DatePicker;

function Duration(props) {

    const durations = props.duration;
    const days = props.productSku;
    const sameDay = false;


    const [Duration, setDuration] = useState({
        duration: durations[0],
        index: 0
    });

    const [availableDate, setavailableDate] = useState([]);

    const setProductDuration = (duration, index) => {
        setDuration({ duration: duration, index: index });
        seperateAvailable();
    }

    const seperateAvailable = () => {
        var available = days.filter(day => day.status === "available");
        setavailableDate([...available]);
        console.log(days);
        // console.log(durations);

    }

    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState();

    const disabledDate = current => {
        // Duration.duration.datefrom
        if (sameDay) {
            return current > moment().endOf('day').add(Duration.duration.value - 1, "days") ||  current < moment().endOf('day').subtract(1,"day");
        }
        else{
            return current < moment().endOf('day').subtract(1,"day");
        }
    };

    const onOpenChange = open => {
        if (open) {
            setHackValue([]);
            setDates([]);
        } else {
            setHackValue(undefined);
        }
    };

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
            />
        </Fragment>
    );
}

export default Duration;