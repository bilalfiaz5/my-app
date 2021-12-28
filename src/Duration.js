import { Fragment, useState, useEffect } from "react";
import moment from 'moment';
import { DatePicker, Checkbox, Alert, Input } from 'antd';
// for range picker ant component is used
const { RangePicker } = DatePicker;


function Duration(props) {
    // contains the duration of the product
    const durations = props.duration;

    // select the first duration by default
    const [Duration, setDuration] = useState({
        duration: durations[0],
        index: 0
    });

    const [open, setopen] = useState(false);
    const [availablesku, setavailablesku] = useState([]);
    const [sameDay, setsameDay] = useState(false);
    const [showpostal, setshowpostal] = useState(false);
    const [available, setavailable] = useState(false);

    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState();
    const [disabledates, setdisabledates] = useState([false, false]);

    // get the information for availble product of first sku
    useEffect(() => {
        (async () => {
            updateSameDayDate();
            seperateAvailable(props.productSku);
        })()
        document.querySelector("input[placeholder='End date']").disabled = true;
    }, [sameDay, Duration])

    // Sets the selected duration and updates the dates and value of calender to empty 
    const setProductDuration = (duration, index) => {
        setDuration({ duration: duration, index: index });
        setDates([]);
        setHackValue([]);
        updateSameDayDate();
        seperateAvailable();
    }

    // this function seperate all the days on some creteria first is the status available and second is the date lies in between the three days from current date 
    const seperateAvailable = (days) => {
        var availableAfterToday = days.filter(day => moment(day.dateFrom) >= moment().add(4, "day") || moment(day.dateTo) >= moment().add(4, "day"));
        var available = availableAfterToday.filter(day => day.status == "available");

        days.map((day, i) => {
            if (day.dateTo == null) {
                return available.push(day);
            }
        });
        setavailablesku(available);
    }

    // This function is used to disable the all prevoius date
    const disabledDate = current => {
        if (!dates) {
            return false;
        }

        // this block disable all prevoius and futher date after the range if only same day is selected
        if (sameDay) {
            return current > moment().endOf('day').add(Duration.duration.value - 1, "days") || current < moment().endOf('day').subtract(1, "day");
        }

        // This simply disabble the preoius dates and 3 date after the current date
        const tooLate = dates[0] && current.diff(dates[0], 'days') > Duration.duration.value - 1;
        return tooLate || current < moment().endOf('day').add(3, "day");
    };

    // This is the function given by the ant design to handle the oprn and closing of calender
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

    // simply hanndles the check of checkbox
    function onChange(e) {
        setsameDay(e.target.checked);
    }

    // The function calulate and update the range of days if same day deleivery is selected also show the post field and set disasble dates
    const updateSameDayDate = () => {
        if (sameDay) {
            setshowpostal(true);
            var datefrom = moment().endOf('day').add(3, "day");
            var suggest = moment(datefrom).endOf('day').add(Duration.duration.value - 1, "days");
            setValue([datefrom, suggest]);
            setdisabledates([true, true]);
        }
        else {
            setshowpostal(false);
            setValue();
            setDates([]);
            setdisabledates([false, false]);
            document.querySelector("input[placeholder='End date']").disabled = false;
        }
    }

    // This function is called when we select the date from the calender and hence calulate the range and availablity of the product
    const onUpdate = (val) => {
        var datefrom = val[0];
        var suggest = moment(datefrom).endOf('day').add(Duration.duration.value - 1, "days");
        setValue([datefrom, suggest]);
        setopen(false);
        showAvailability(datefrom, suggest);
    }


    // The function checks the availablity of the product from the selected date given by the user 
    const showAvailability = (datefrom, dateto) => {
        if (availablesku.length === 0) {
            setavailable(true);
        }
        else {
            availablesku.map(e => {
                // if we have the dateTO null then we will check with only dateFrom of the product
                if (e.dateTo == null) {
                    // if product dateFrom lies between the selected data then product is available else it is not
                    if (e.dateFrom >= datefrom) {
                        setavailable(false);
                    }
                    else {
                        setavailable(true);
                    }
                }
                else {
                    // if we dont have the dateTO null then we will check product dateFrom lies between the selected data 
                    if (e.dateFrom >= datefrom && e.dateFrom <= dateto) {
                        setavailable(false);
                    }
                    else {
                        setavailable(true);
                    }
                }
            });

        }
    }

    return (
        <Fragment>
            <div className="h3--size">Rental Duration <span className="span--duration">(Days)</span></div>
            
            {/* Show button for different duration */}
            {
                durations.map((duration, index) => {
                    return <Fragment>
                        <button className={`btn btn--size btn--md ${Duration.index === index ? "active" : null}`} onClick={() => setProductDuration(duration, index)}>{duration.value} Days</button>
                    </Fragment>
                })
            }

            {/* show the checkbox for same delivery */}
            <Checkbox onChange={onChange}>Same day delivery</Checkbox>

            {/* show the inputfield when the checkbox is complete */}
            {showpostal ? (<Input placeholder="Only Sydney Metro postcode" />) : ("")}

            {/* Ant range Picker with value and disable dates, open and various function */}
            <RangePicker
                value={value}
                disabledDate={disabledDate}
                onCalendarChange={val => onUpdate(val)}
                onOpenChange={onOpenChange}
                open={open}
                className="date--selector"
                disabled={disabledates}
            />

            {/* Alert that will notify if product is not available */}
            {available ? (<Alert message="Product Not Available" type="error" className="error" />) : ("")}

            <hr />

            {/* Display the remaining button with duration price and currency */}
            <div className="btn--group">
                <button className="btn--cncl">Cancel</button>
                <button className="btn--pay">{`Add to Cart `}<span>{`${Duration.duration.price}  ${Duration.duration.currency}`}</span></button>
            </div>

        </Fragment>
    );
}

export default Duration;