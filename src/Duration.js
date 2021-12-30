import { Fragment, useState, useEffect } from "react";
import moment from 'moment';
import { DatePicker, Checkbox, Alert, Input } from 'antd';
// for range picker ant component is used
const { RangePicker } = DatePicker;


function Duration(props) {
    // contains the duration of the product
    const durations = props.duration;
    const days = props.productSku;

    // select the first duration by default
    const [Duration, setDuration] = useState({
        duration: durations[0],
        index: 0
    });

    const [open, setopen] = useState(false);
    const [availablesku, setavailablesku] = useState();
    const [sameDay, setsameDay] = useState(false);
    const [showpostal, setshowpostal] = useState(false);
    const [available, setavailable] = useState(false);
    const [notavailable, setnotavailable] = useState(false);


    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState();
    const [disabledates, setdisabledates] = useState([false, false]);

    // get the information for availble product of first sku
    useEffect(() => {
        (async () => {
            setProductDuration(Duration.duration, Duration.index);
            // updateSameDayDate();
        })()
        document.querySelector("input[placeholder='End date']").disabled = true;
    }, [sameDay])

      // Call every time when the date is changes
    useEffect(() => {
        if (value != null) {
            showAvailability(value);
        }
    }, [value]);


      // Call every time when the duration is changes
      useEffect(() => {
        updateSameDayDate();
    }, [Duration]);

    // Sets the selected duration and updates the dates and value of calender to empty and alert to hide
    const setProductDuration = (duration, index) => {
        setDuration({ duration: duration, index: index });
        setnotavailable(false);
        setavailable(false);
        setDates([]);
        setHackValue([]);
        updateSameDayDate();
        seperateAvailable();
    }

    // this function seperate all the days on some creteria first is the status available and second is the date lies in between the three days from current date 
    const seperateAvailable = () => {
        var availableAfterToday = days.filter(day => moment(day.dateFrom) >= moment().add(4, "day") || moment(day.dateTo) >= moment().add(4, "day"));
        var available = availableAfterToday.filter(day => day.status == "available" || day.dateTo == null);
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

        // This simply disable the previous dates and 3 date after the current date becasue we have dissable 3 days after current date 
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
            // document.querySelector("input[placeholder='End date']").disabled = false;
        }
    }

    // This function is called when we select the date from the calender and hence calulate the range and availablity of the product
    const onUpdate = (val) => {
        var datefrom = val[0];
        var dateto = moment(datefrom).endOf('day').add(Duration.duration.value - 1, "days");
        setValue([datefrom, dateto]);
        setopen(false);
    }


    // The function checks the availablity of the product from the selected date given by the user 
    const showAvailability = () => {
        const datefrom = moment(value[0]).format("L");
        const dateto = moment(value[1]).format("L");

        if (availablesku.length === 0) {
            setnotavailable(true);
        }
        else {
            availablesku.map(e => {
                // if we have the dateTO null then we will check with only dateFrom of the product
                if (e.dateTo == null) {

                    // Substract the one day beacsue it was converting to extra one day due to timezone
                    const productdatefrom = moment(e.dateFrom).subtract(1, "days").format("L");
                    const productdateto = moment(e.dateTo).subtract(1, "days").format("L");

                    // if product dateFrom lies between the selected data then product is available else it is not
                    if (productdatefrom <= datefrom) {
                        setnotavailable(false);
                        setavailable(true);
                    }
                    else {
                        setnotavailable(true);
                        setavailable(false);
                    }
                }
                else {
                    // if we dont have the dateTO null then we will check product dateFrom lies between the selected data 
                    if (e.dateFrom <= datefrom && e.dateFrom >= dateto) {
                        setnotavailable(false);
                        setavailable(true);
                    }
                    else {
                        setnotavailable(true);
                        setavailable(false);
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
                format="DD-MM-YYYY"
            />

            {/* Alert that will notify if product is not available */}
            {notavailable ? (<Alert message="Product Not Available" type="error" className="error" showIcon={true}/>) : ("")}
            {available ? (<Alert message="Product Available" type="success" className="error" showIcon={true}/>) : ("")}
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