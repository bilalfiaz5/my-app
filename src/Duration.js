import { Fragment, useState, useEffect } from "react";
import moment from 'moment';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

function Duration(props) {

    const durations = props.duration;
    const days = props.productSku;
    const sameDay = false;

    useEffect(() => {
    }, [])

    const [Duration, setDuration] = useState({
        duration: durations[0],
        index: 0
    });

    const [availableDate, setavailableDate] = useState({});
    const [open, setopen] = useState(false);
    const [selected, setselected] = useState(false);
    const [availableSKU, setavailableSKU] = useState([]);

    const setProductDuration = (duration, index) => {
        setDuration({ duration: duration, index: index });
        setopen(true);
        seperateAvailable();
    }

    const seperateAvailable = () => {
        var available = days.filter(day => day.status === "available");
        setavailableSKU([...available]);
        // console.log(days);
        // console.log(durations);
    }



    const [dates, setDates] = useState([]);
    const [value, setValue] = useState([]);

    const disabledDate = current => {
        // Duration.duration.datefrom

        if (sameDay) {
            return current > moment().endOf('day').add(Duration.duration.value - 1, "days") || current < moment().endOf('day').subtract(1, "day");
        }


        if (selected) {
            // console.log(value[1]);

            // return value[1] < moment().endOf('day').subtract(1, "day");

        }
        else {
            return current < moment().endOf('day').add(3, "day") ;
        }
    };

    const onDateUpdate = (val) => {
        console.log(val);
        if (val[1] != null) {
            var datefrom = val[1];
            var suggest = moment(datefrom.format('L')).endOf('day').add(Duration.duration.value - 1, "days")
            setValue([datefrom, suggest]);
            setselected(false);
        }
        else{
            var datefrom = val[0];
            var suggest = moment(datefrom.format('L')).endOf('day').add(Duration.duration.value - 1, "days")
            setValue([datefrom, suggest]);
            setselected(true);
            // disabledDate();
        }
       

        // setselected(true);
        // setopen(false);



    };

    const onSelectDate = () => {
        // const moment2 = val[0];
        // console.log(moment2.format('L'));
        // var suggest = moment(moment2.format('L')).endOf('day').add(Duration.duration.value - 1, "days")
        // console.log(suggest);
        // // console.log(v);
        // setValue([moment2, suggest]);
        setopen(false);
    };


    function onChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      }

    function onOk() {
        return <button onClick={onSelectDate}>Confirm</button>
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
                value={value}
                // defaultValue={[moment(current, dateFormat), moment(current, dateFormat)]}
                disabledDate={disabledDate}
                onCalendarChange={val => onDateUpdate(val)}
                // onChange={onChange}
              
                open={open}
                onOpenChange={val => setopen(true)}
                renderExtraFooter={onOk}
            // disabled={[false,true]}
            />
        </Fragment>
    );
}

export default Duration;