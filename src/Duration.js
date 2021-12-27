import { Fragment, useState, useEffect } from "react";
import moment from 'moment';
import { DatePicker, Checkbox, Alert, Input } from 'antd';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
const { RangePicker } = DatePicker;


function Duration(props) {

    const durations = props.duration;
    const days = props.productSku;

    const [Duration, setDuration] = useState({
        duration: durations[0],
        index: 0
    });

    const [open, setopen] = useState(false);
    const [availableSKU, setavailableSKU] = useState([]);
    const [sameDay, setsameDay] = useState(false);
    const [showpostal, setshowpostal] = useState(false);
    const [error, seterror] = useState({
        message: "",
        show: false
    });

    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState();

    useEffect(() => {
        document.querySelector("input[placeholder='End date']").disabled = true;
        showAvailability();
        updateSameDayDate();
    }, [sameDay,Duration])

    const setProductDuration = (duration, index) => {
        setDuration({ duration: duration, index: index });
        setDates([]);
        setHackValue([]);
        updateSameDayDate();
        seperateAvailable();
    }

    const seperateAvailable = () => {
        var availableAfterToday = days.filter(day => moment(day.dateFrom) >= moment().add(4, "day") || moment(day.dateTo) >= moment().add(4, "day"));
        var available = availableAfterToday.filter(day => day.status === "available").push(days[1]);
        setavailableSKU(available);
        console.log(days);
        console.log(availableAfterToday);
        console.log(available);
    }

    const showAvailability = () => {
        console.log(availableSKU);
        if (availableSKU.length === 0) {
            seterror({
                message: "No Avaible product",
                show: true
            });
        }
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
            setValue();
            setDates([]);
        } else {
            setopen(false);
            setHackValue(undefined);
        }
    };

    function onChange(e) {
        setsameDay(e.target.checked);
    }

   


    const updateSameDayDate = () => {
        if (sameDay) {
            setshowpostal(true);
            document.querySelector("input[placeholder='Start date']").disabled = true;
            var datefrom = moment().endOf('day').add(3, "day");
            var suggest = moment(datefrom).endOf('day').add(Duration.duration.value - 1, "days");
            setValue([datefrom, suggest]);
        }
        else {
            setshowpostal(false);
            setValue();
            setDates([]);
        }
    }

    const onUpdate = (val) => {
        var datefrom = val[0];
        var suggest = moment(datefrom).endOf('day').add(Duration.duration.value - 1, "days");
        setValue([datefrom, suggest]);
        setopen(false);
    }

    return (
        <Fragment>
            <div className="h3--size">Rental Duration <span className="span--duration">(Days)</span></div>
            {
                durations.map((duration, index) => {
                    return <Fragment>
                        <button className={`btn btn--size btn--md ${Duration.index === index ? "active" : null}`} onClick={() => setProductDuration(duration, index)}>{duration.value} Days</button>
                    </Fragment>
                })
            }

            <Checkbox onChange={onChange}>Same day delivery</Checkbox>
            {showpostal ? (<Input placeholder="Only Sydney Metro postcode" />) : ("")}

            <RangePicker
                value={value}
                disabledDate={disabledDate}
                onCalendarChange={val => onUpdate(val)}
                onOpenChange={onOpenChange}
                open={open}
                className="date--selector"
            />

            {/* {error ? (<Alert message={error.message} type="error" />) : ("")} */}
            <hr />


            <div className="btn--group">
                <button className="btn--cncl">Cancel</button>

                <button className="btn--pay">{`Add to Cart `}<span>{`${Duration.duration.price}  ${Duration.duration.currency}`}</span></button>
            </div>
        </Fragment>
    );
}

export default Duration;